import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import solver from "javascript-lp-solver";

// ============================================================
// KONFIGURASI KRITERIA & SUB-KRITERIA
// ============================================================
const KRITERIA_UTAMA = {
  kolom: ["jenis_wisata", "biaya", "aksesibilitas", "fasilitas", "daya_tarik"],
  mapping_nama: {
    "wisata alam": 0, "wisata budaya": 1, "wisata historis": 2, "wisata rekreasi": 3,
    "jenis wisata": 0, "biaya": 1, "aksesibilitas": 2, "fasilitas": 3, "daya tarik wisata": 4
  }
};

const SUB_KRITERIA: Record<string, any> = {
  "jenis_wisata": {
    kolom: ["alam", "budaya", "historis", "rekreasi"],
    mapping_nama: { "wisata alam": 0, "wisata budaya": 1, "wisata historis": 2, "wisata rekreasi": 3 }
  },
  "biaya": {
    kolom: ["harga_paket_wisata", "biaya_tambahan", "kesesuaian_harga_dengan_fasilitas"],
    mapping_nama: { "harga paket wisata": 0, "biaya tambahan": 1, "kesesuaian harga dengan fasilitas": 2 }
  },
  "aksesibilitas": {
    kolom: ["jarak_tempuh", "kemudahan_transportasi"],
    mapping_nama: { "jarak tempuh": 0, "kemudahan transportasi": 1 }
  },
  "fasilitas": {
    kolom: ["fasilitas_umum", "area_parkir", "keamanan_lokasi", "kebersihan"],
    mapping_nama: { "fasilitas umum": 0, "area parkir": 1, "keamanan lokasi": 2, "kebersihan lingkungan": 3 }
  },
  "daya_tarik": {
    kolom: ["keindahan_keunikan", "aktivitas_wisata", "spot_foto"],
    mapping_nama: { "keindahan dan keunikan destinasi": 0, "aktivitas wisata": 1, "spot foto / media sosial": 2 }
  }
};

const CI_VALUES: Record<number, number> = { 3: 4.47, 4: 4.80, 5: 5.14 };

// ============================================================
// UTILS & HELPERS
// ============================================================
async function hapusHasilLama(kode_ruang: string) {
  const tables = [
    "topsis_normalisasi", "topsis_terbobot", "topsis_solusi_ideal",
    "topsis_jarak", "hasil_ranking_topsis", "hasil_bobot_global",
    "hasil_bobot_sub", "hasil_bobot_utama"
  ];
  for (const t of tables) {
    await supabase.from(t).delete().eq("kode_ruang", kode_ruang);
  }
}

// Fungsi rata-rata array 2D (Pengganti np.mean)
function calculateMeanAxis0(matrix: number[][]): number[] {
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  const means = Array(numCols).fill(0);
  for (let c = 0; c < numCols; c++) {
    let sum = 0;
    for (let r = 0; r < numRows; r++) sum += matrix[r][c];
    means[c] = sum / numRows;
  }
  return means;
}

// Pengganti scipy.optimize.linprog menggunakan javascript-lp-solver
function hitungBobotBWM(bo: number[], ow: number[], best_idx: number, worst_idx: number, n: number) {
  const model: any = {
    optimize: "xi",
    opType: "min",
    constraints: { sum_w: { equal: 1 } },
    variables: { xi: { xi: 1 } }
  };

  // Inisialisasi variabel w0, w1, ...
  for (let i = 0; i < n; i++) {
    model.variables[`w${i}`] = { sum_w: 1 };
  }

  let constrCount = 0;
  for (let j = 0; j < n; j++) {
    // w_best - bo[j]*w_j - xi <= 0
    model.constraints[`c${constrCount}`] = { max: 0 };
    model.variables[`w${best_idx}`][`c${constrCount}`] = 1;
    model.variables[`w${j}`][`c${constrCount}`] = -bo[j];
    model.variables.xi[`c${constrCount}`] = -1;
    constrCount++;

    // w_best - bo[j]*w_j + xi >= 0  => -w_best + bo[j]*w_j - xi <= 0
    model.constraints[`c${constrCount}`] = { max: 0 };
    model.variables[`w${best_idx}`][`c${constrCount}`] = -1;
    model.variables[`w${j}`][`c${constrCount}`] = bo[j];
    model.variables.xi[`c${constrCount}`] = -1;
    constrCount++;

    // w_j - ow[j]*w_worst - xi <= 0
    model.constraints[`c${constrCount}`] = { max: 0 };
    model.variables[`w${j}`][`c${constrCount}`] = 1;
    model.variables[`w${worst_idx}`][`c${constrCount}`] = -ow[j];
    model.variables.xi[`c${constrCount}`] = -1;
    constrCount++;

    // w_j - ow[j]*w_worst + xi >= 0 => -w_j + ow[j]*w_worst - xi <= 0
    model.constraints[`c${constrCount}`] = { max: 0 };
    model.variables[`w${j}`][`c${constrCount}`] = -1;
    model.variables[`w${worst_idx}`][`c${constrCount}`] = ow[j];
    model.variables.xi[`c${constrCount}`] = -1;
    constrCount++;
  }

  const result = solver.Solve(model) as any;

  if (!result.feasible) {
    // Fallback seragam jika solver kaku
    return { bobot: Array(n).fill(1.0 / n), xi: 0, cr: 0 };
  }

  const bobot = [];
  for (let i = 0; i < n; i++) bobot.push(result[`w${i}`] || 0);
  const xi = result.xi || 0;
  const cr = xi / (CI_VALUES[n] || 1.0);
  
  return { bobot, xi, cr };
}

async function prosesGrupBWM(kode_ruang: string, bbo_table: string, bow_table: string, config: any, field_best: string, field_worst: string) {
  const { data: res_bbo } = await supabase.from(bbo_table).select("*").eq("kode_ruang", kode_ruang);
  const { data: res_bow } = await supabase.from(bow_table).select("*").eq("kode_ruang", kode_ruang);

  if (!res_bbo || !res_bow || res_bbo.length === 0 || res_bow.length === 0) return null;

  const n = config.kolom.length;
  const all_bo = [];
  const all_ow = [];
  const best_indices = [];
  const worst_indices = [];

  for (const row of res_bbo) {
    const t_best = String(row[field_best] || "").trim().toLowerCase();
    if (config.mapping_nama[t_best] !== undefined) best_indices.push(config.mapping_nama[t_best]);
    all_bo.push(config.kolom.map((col: string) => parseFloat(row[col] || 1)));
  }

  for (const row of res_bow) {
    const t_worst = String(row[field_worst] || "").trim().toLowerCase();
    if (config.mapping_nama[t_worst] !== undefined) worst_indices.push(config.mapping_nama[t_worst]);
    all_ow.push(config.kolom.map((col: string) => parseFloat(row[col] || 1)));
  }

  if (all_bo.length === 0 || all_ow.length === 0) return null;

  const mean_bo = calculateMeanAxis0(all_bo);
  const mean_ow = calculateMeanAxis0(all_ow);

  // Cari index jangkar (Modus)
  const getMode = (arr: number[]) => arr.sort((a,b) => arr.filter(v => v===a).length - arr.filter(v => v===b).length).pop();
  const best_idx = best_indices.length > 0 ? getMode(best_indices) || 0 : 0;
  const worst_idx = worst_indices.length > 0 ? getMode(worst_indices) || (n - 1) : (n - 1);

  return hitungBobotBWM(mean_bo, mean_ow, best_idx, worst_idx, n).bobot;
}

// Pengganti pandas & numpy TOPSIS
async function kalkulasiTopsis(bobot_global: Record<string, number>) {
  const { data: df, error } = await supabase.from("nilai_kriteria").select("*");
  if (error || !df || df.length === 0) throw new Error("Gagal menarik nilai_kriteria");

  let col_alternatif = ["destinasi", "destinasi_wisata", "nama_tempat", "nama"].find(c => df[0][c] !== undefined);
  if (!col_alternatif) throw new Error("Kolom destinasi tidak ditemukan");

  const kriteria_cost = ["harga_paket_wisata", "biaya_tambahan", "jarak_tempuh"];
  const semua_kriteria = Object.keys(bobot_global);
  const n = semua_kriteria.length;
  const m = df.length;

  // X Matrix
  const X = df.map(row => semua_kriteria.map(k => parseFloat(row[k] || 0)));

  // Normalisasi (R)
  const pembagi = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sumSq = 0;
    for (let i = 0; i < m; i++) sumSq += Math.pow(X[i][j], 2);
    pembagi[j] = Math.sqrt(sumSq) || 1e-12;
  }
  const R = X.map(row => row.map((val, j) => val / pembagi[j]));

  // Terbobot (V)
  const V = R.map(row => row.map((val, j) => val * bobot_global[semua_kriteria[j]]));

  // A+ dan A-
  const A_plus = Array(n).fill(0);
  const A_minus = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const colValues = V.map(row => row[j]);
    const maxVal = Math.max(...colValues);
    const minVal = Math.min(...colValues);
    if (kriteria_cost.includes(semua_kriteria[j])) {
      A_plus[j] = minVal; A_minus[j] = maxVal;
    } else {
      A_plus[j] = maxVal; A_minus[j] = minVal;
    }
  }

  // Jarak D+ dan D-
  const D_plus = Array(m).fill(0);
  const D_minus = Array(m).fill(0);
  const C = Array(m).fill(0);

  for (let i = 0; i < m; i++) {
    let sumPlus = 0; let sumMinus = 0;
    for (let j = 0; j < n; j++) {
      sumPlus += Math.pow(V[i][j] - A_plus[j], 2);
      sumMinus += Math.pow(V[i][j] - A_minus[j], 2);
    }
    D_plus[i] = Math.sqrt(sumPlus);
    D_minus[i] = Math.sqrt(sumMinus);
    C[i] = D_minus[i] / ((D_plus[i] + D_minus[i]) || 1e-12);
    df[i].skor_akhir = C[i];
  }

  // Ranking
  const df_sorted = [...df].sort((a, b) => b.skor_akhir - a.skor_akhir);
  const ranking = df_sorted.slice(0, 10).map((row) => ({
    nama_destinasi: row[col_alternatif],
    skor_akhir: row.skor_akhir.toFixed(4)
  }));

  return { ranking, R, V, A_plus, A_minus, D_plus, D_minus, preferensi: C, kriteria: semua_kriteria, alternatif: df.map(r => r[col_alternatif]) };
}

// ============================================================
// ENDPOINT UTAMA POST
// ============================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const kode_ruang = body.kode_ruang || body.record?.kode_ruang;

    if (!kode_ruang) return NextResponse.json({ detail: "kode_ruang wajib disertakan!" }, { status: 400 });

    await hapusHasilLama(kode_ruang);

    // BWM Utama
    const bobot_utama = await prosesGrupBWM(kode_ruang, "bbo_main", "bow_main", KRITERIA_UTAMA, "best_kriteria", "worst_kriteria");
    if (!bobot_utama) return NextResponse.json({ detail: "Data BWM Utama kosong." }, { status: 400 });

    await supabase.from("hasil_bobot_utama").insert([{
      kode_ruang,
      jenis_wisata: bobot_utama[0], biaya: bobot_utama[1],
      aksesibilitas: bobot_utama[2], fasilitas: bobot_utama[3], daya_tarik: bobot_utama[4]
    }]);

    // BWM Sub & Global
    const hasil_global: Record<string, number> = {};
    let idx_utama = 0;
    
    for (const [kategori, config_sub] of Object.entries(SUB_KRITERIA)) {
      const bobot_sub = await prosesGrupBWM(kode_ruang, `bbo_${kategori}`, `bow_${kategori}`, config_sub, "best", "worst");
      if (bobot_sub) {
        const rows_sub = config_sub.kolom.map((nama_sub: string, i: number) => ({
          kode_ruang, kategori, sub_kriteria: nama_sub, bobot: bobot_sub[i]
        }));
        await supabase.from("hasil_bobot_sub").insert(rows_sub);

        config_sub.kolom.forEach((nama_sub: string, i: number) => {
          hasil_global[nama_sub] = parseFloat((bobot_utama[idx_utama] * bobot_sub[i]).toFixed(6));
        });
      }
      idx_utama++;
    }

    const rows_global = Object.entries(hasil_global).map(([k, v]) => ({ kode_ruang, kriteria: k, bobot_global: v }));
    await supabase.from("hasil_bobot_global").insert(rows_global);

    // TOPSIS
    const hasil_topsis = await kalkulasiTopsis(hasil_global);
    
    // Simpan Ranking Topsis
    const rows_ranking = hasil_topsis.ranking.map((row, idx) => ({
      kode_ruang, ranking: idx + 1, destinasi: row.nama_destinasi, skor_akhir: parseFloat(row.skor_akhir)
    }));
    await supabase.from("hasil_ranking_topsis").insert(rows_ranking);

    return NextResponse.json({
      status: "success",
      kode_ruang,
      bobot_global: hasil_global,
      ranking_topsis: hasil_topsis.ranking
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}