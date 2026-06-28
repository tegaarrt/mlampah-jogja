# """
# ============================================================
#   BWM & TOPSIS Webhook Handler — FastAPI
#   Trigger : POST /hitung-bwm
#   Output  : Hitung Bobot Global BWM + Ranking TOPSIS
#             + Simpan semua hasil ke Supabase (v2 compatible)
# ============================================================
# """

# from fastapi import FastAPI, Request, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from supabase import create_client, Client
# import numpy as np
# import pandas as pd
# from scipy.optimize import linprog

# # ============================================================
# # KONEKSI SUPABASE (sync client — kompatibel v2)
# # ============================================================
# URL = "https://dxhigllweuqjdvrzdxbf.supabase.co"
# KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4aGlnbGx3ZXVxamR2cnpkeGJmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTgwODI3MCwiZXhwIjoyMDk1Mzg0MjcwfQ.NunSmfQ5pkaaDQyRW9n5k1GZhA63X8edH61DbaeAdss"

# supabase: Client = create_client(URL, KEY)

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ============================================================
# # KONFIGURASI KRITERIA & SUB-KRITERIA
# # ============================================================
# KRITERIA_UTAMA = {
#     "kolom": ["jenis_wisata", "biaya", "aksesibilitas", "fasilitas", "daya_tarik"],
#     "mapping_nama": {
#         "Jenis Wisata": 0, "Biaya": 1, "Aksesibilitas": 2,
#         "Fasilitas": 3, "Daya Tarik Wisata": 4
#     }
# }

# SUB_KRITERIA = {
#     "jenis_wisata": {
#         "kolom": ["alam", "budaya", "historis", "rekreasi"],
#         "mapping_nama": {
#             "Wisata Alam": 0, "Wisata Budaya": 1,
#             "Wisata Historis": 2, "Wisata Rekreasi": 3
#         }
#     },
#     "biaya": {
#         "kolom": ["harga_paket_wisata", "biaya_tambahan", "kesesuaian_harga_dengan_fasilitas"],
#         "mapping_nama": {
#             "Harga Paket Wisata": 0, "Biaya Tambahan": 1,
#             "Kesesuaian Harga dengan Fasilitas": 2
#         }
#     },
#     "aksesibilitas": {
#         "kolom": ["jarak_tempuh", "kemudahan_transportasi"],
#         "mapping_nama": {"Jarak Tempuh": 0, "Kemudahan Transportasi": 1}
#     },
#     "fasilitas": {
#         "kolom": ["fasilitas_umum", "area_parkir", "keamanan_lokasi", "kebersihan"],
#         "mapping_nama": {
#             "Fasilitas Umum": 0, "Area Parkir": 1,
#             "Keamanan Lokasi": 2, "Kebersihan Lingkungan": 3
#         }
#     },
#     "daya_tarik": {
#         "kolom": ["keindahan_keunikan", "aktivitas_wisata", "spot_foto"],
#         "mapping_nama": {
#             "Keindahan dan Keunikan Destinasi": 0,
#             "Aktivitas Wisata": 1, "Spot Foto / Media Sosial": 2
#         }
#     }
# }

# CI_TABLE = {2: 0.0001, 3: 0.1573, 4: 0.3528, 5: 0.5288, 6: 0.6694, 7: 0.7779}


# # ============================================================
# # FUNGSI BANTU: INSERT DENGAN CEK ERROR (PENTING untuk v2)
# # ============================================================
# def db_insert(tabel: str, data):
#     """
#     Wrapper insert yang SELALU mengecek response Supabase v2.
#     Supabase v2 tidak raise exception otomatis — error hanya ada di .error atau
#     response kosong. Fungsi ini memastikan kita tahu kalau insert gagal.
#     """
#     res = supabase.table(tabel).insert(data).execute()
#     # Di v2, cek apakah data berhasil masuk
#     if not res.data:
#         raise RuntimeError(
#             f"Insert ke '{tabel}' gagal / tidak ada data yang dikembalikan. "
#             f"Response: {res}"
#         )
#     return res


# def db_delete(tabel: str, kode_ruang: str):
#     """Wrapper delete dengan error handling."""
#     try:
#         supabase.table(tabel).delete().eq("kode_ruang", kode_ruang).execute()
#     except Exception as e:
#         print(f"  [!] Gagal hapus {tabel}: {e}")


# # ============================================================
# # FUNGSI BANTU: HAPUS HASIL LAMA
# # ============================================================
# def hapus_hasil_lama(kode_ruang: str):
#     """Bersihkan semua tabel hasil sebelum perhitungan ulang."""
#     tabel_hasil = [
#         "hasil_bobot_utama",
#         "hasil_bobot_sub",
#         "hasil_bobot_global",
#         "topsis_normalisasi",
#         "topsis_terbobot",
#         "topsis_solusi_ideal",
#         "topsis_jarak",
#         "hasil_ranking_topsis",
#     ]
#     for tbl in tabel_hasil:
#         db_delete(tbl, kode_ruang)


# # ============================================================
# # BWM: HITUNG BOBOT SATU RESPONDEN
# # ============================================================
# def hitung_bobot_bwm(bo: list, ow: list, best_idx: int, worst_idx: int, n: int):
#     """Selesaikan Linear Programming BWM, kembalikan (bobot, xi, CR)."""
#     c = [0.0] * n + [1.0]
#     A_ub, b_ub = [], []

#     for j in range(n):
#         rp = [0.0] * (n + 1); rp[best_idx] = 1.0;  rp[j] = -bo[j]; rp[n] = -1.0
#         rn = [0.0] * (n + 1); rn[best_idx] = -1.0; rn[j] =  bo[j]; rn[n] = -1.0
#         A_ub += [rp, rn]; b_ub += [0.0, 0.0]

#     for j in range(n):
#         rp = [0.0] * (n + 1); rp[j] = 1.0;  rp[worst_idx] = -ow[j]; rp[n] = -1.0
#         rn = [0.0] * (n + 1); rn[j] = -1.0; rn[worst_idx] =  ow[j]; rn[n] = -1.0
#         A_ub += [rp, rn]; b_ub += [0.0, 0.0]

#     A_eq = [[1.0] * n + [0.0]]
#     b_eq = [1.0]

#     res = linprog(
#         c, A_ub=A_ub, b_ub=b_ub,
#         A_eq=A_eq, b_eq=b_eq,
#         bounds=[(0, None)] * (n + 1),
#         method="highs"
#     )

#     if not res.success:
#         if n == 2:
#             w1 = bo[1] / (bo[1] + 1)
#             return ([1 - w1, w1] if best_idx == 0 else [w1, 1 - w1]), 0.0, 0.0
#         raise ValueError(f"LP gagal: {res.message}")

#     bobot = res.x[:n].tolist()
#     xi    = float(res.x[-1])
#     cr    = xi / CI_TABLE.get(n, 0.8)
#     return bobot, xi, cr


# # ============================================================
# # BWM: AGREGASI GEOMETRIC MEAN SEMUA RESPONDEN
# # ============================================================
# def geometric_mean_agregasi(weights_list: list) -> list:
#     if not weights_list:
#         return []
#     arr = np.array(weights_list)
#     gm  = np.exp(np.mean(np.log(arr + 1e-12), axis=0))
#     return (gm / gm.sum()).tolist()


# # ============================================================
# # BWM: PROSES SATU GRUP (UTAMA / SUB-KRITERIA)
# # ============================================================
# def proses_grup_bwm(
#     kode_ruang: str,
#     tbl_bbo: str, tbl_bow: str,
#     config: dict,
#     kolom_best: str, kolom_worst: str
# ):
#     """Tarik data responden dari Supabase, hitung BWM, agregasi, kembalikan bobot."""
#     kolom        = config["kolom"]
#     mapping_aman = {k.lower().strip(): v for k, v in config["mapping_nama"].items()}
#     n            = len(kolom)

#     bbo_res = supabase.table(tbl_bbo).select("*").eq("kode_ruang", kode_ruang).execute()
#     bow_res = supabase.table(tbl_bow).select("*").eq("kode_ruang", kode_ruang).execute()

#     if not bbo_res.data or not bow_res.data:
#         print(f"  [!] Data kosong di {tbl_bbo}/{tbl_bow} untuk ruang {kode_ruang}")
#         return None

#     semua_bobot = []
#     for bbo, bow in zip(bbo_res.data, bow_res.data):
#         try:
#             teks_best  = str(bbo.get(kolom_best,  "")).strip().lower()
#             teks_worst = str(bow.get(kolom_worst, "")).strip().lower()

#             if teks_best not in mapping_aman:
#                 raise ValueError(f"Teks Best '{bbo.get(kolom_best)}' tidak ada di config.")
#             if teks_worst not in mapping_aman:
#                 raise ValueError(f"Teks Worst '{bow.get(kolom_worst)}' tidak ada di config.")

#             best_idx  = mapping_aman[teks_best]
#             worst_idx = mapping_aman[teks_worst]
#             bo_vals   = [float(bbo[k]) for k in kolom]
#             ow_vals   = [float(bow[k]) for k in kolom]

#             bobot, _, _ = hitung_bobot_bwm(bo_vals, ow_vals, best_idx, worst_idx, n)
#             semua_bobot.append(bobot)

#         except Exception as e:
#             print(f"  [X] Baris gagal di {tbl_bbo}: {e}")
#             continue

#     if not semua_bobot:
#         return None

#     return geometric_mean_agregasi(semua_bobot)


# # ============================================================
# # TOPSIS
# # ============================================================
# def kalkulasi_topsis(bobot_global: dict) -> dict:
#     """
#     Hitung TOPSIS lengkap.
#     Mengembalikan dict berisi ranking dan semua matriks antara
#     agar bisa disimpan ke Supabase secara terpisah.
#     """
#     res = supabase.table("nilai_kriteria").select("*").execute()
#     if not res.data:
#         raise ValueError("Tabel nilai_kriteria kosong atau gagal ditarik!")

#     df             = pd.DataFrame(res.data)
#     kriteria_cost  = ["harga_paket_wisata", "biaya_tambahan", "jarak_tempuh"]
#     semua_kriteria = list(bobot_global.keys())

#     X = df[semua_kriteria].values.astype(float)

#     pembagi = np.sqrt((X ** 2).sum(axis=0))
#     pembagi[pembagi == 0] = 1e-12
#     R = X / pembagi

#     array_bobot = np.array([bobot_global[k] for k in semua_kriteria])
#     V = R * array_bobot

#     A_plus  = np.zeros(len(semua_kriteria))
#     A_minus = np.zeros(len(semua_kriteria))
#     for j, kriteria in enumerate(semua_kriteria):
#         if kriteria in kriteria_cost:
#             A_plus[j]  = np.min(V[:, j])
#             A_minus[j] = np.max(V[:, j])
#         else:
#             A_plus[j]  = np.max(V[:, j])
#             A_minus[j] = np.min(V[:, j])

#     D_plus  = np.sqrt(((V - A_plus)  ** 2).sum(axis=1))
#     D_minus = np.sqrt(((V - A_minus) ** 2).sum(axis=1))

#     penyebut = D_plus + D_minus
#     penyebut[penyebut == 0] = 1e-12
#     C = D_minus / penyebut

#     df["skor_akhir"] = C
#     df_sorted     = df.sort_values(by="skor_akhir", ascending=False).reset_index(drop=True)
    
#     top_destinasi = df_sorted[["destinasi", "skor_akhir"]].head(10).to_dict("records")
    
#     ranking = [
#         {"nama_destinasi": row["destinasi"], "skor_akhir": f"{row['skor_akhir']:.4f}"}
#         for row in top_destinasi
#     ]

#     return {
#         "ranking"    : ranking,
#         "normalisasi": R,
#         "terbobot"   : V,
#         "a_plus"     : A_plus,
#         "a_minus"    : A_minus,
#         "d_plus"     : D_plus,
#         "d_minus"    : D_minus,
#         "preferensi" : C,
#         "alternatif" : df["destinasi"].tolist(),
#         "kriteria"   : semua_kriteria,
#     }


# # ============================================================
# # SIMPAN HASIL TOPSIS KE SUPABASE
# # ============================================================
# def simpan_topsis_ke_supabase(kode_ruang: str, hasil_topsis: dict):
#     """Simpan semua matriks antara TOPSIS ke tabel-tabel Supabase."""
#     alternatif = hasil_topsis["alternatif"]
#     kriteria   = hasil_topsis["kriteria"]
#     R          = hasil_topsis["normalisasi"]
#     V          = hasil_topsis["terbobot"]

#     # Matriks Normalisasi
#     rows_r = [
#         {
#             "kode_ruang": kode_ruang,
#             "destinasi" : alternatif[i],
#             "kriteria"  : krit,
#             "nilai_r"   : float(R[i][j]),
#         }
#         for i in range(len(alternatif))
#         for j, krit in enumerate(kriteria)
#     ]
#     db_insert("topsis_normalisasi", rows_r)

#     # Matriks Terbobot
#     rows_v = [
#         {
#             "kode_ruang": kode_ruang,
#             "destinasi" : alternatif[i],
#             "kriteria"  : krit,
#             "nilai_v"   : float(V[i][j]),
#         }
#         for i in range(len(alternatif))
#         for j, krit in enumerate(kriteria)
#     ]
#     db_insert("topsis_terbobot", rows_v)

#     # Solusi Ideal
#     rows_ideal = [
#         {
#             "kode_ruang": kode_ruang,
#             "kriteria"  : krit,
#             "a_plus"    : float(hasil_topsis["a_plus"][j]),
#             "a_minus"   : float(hasil_topsis["a_minus"][j]),
#         }
#         for j, krit in enumerate(kriteria)
#     ]
#     db_insert("topsis_solusi_ideal", rows_ideal)

#     # Jarak D+ & D-
#     rows_jarak = [
#         {
#             "kode_ruang": kode_ruang,
#             "destinasi" : alternatif[i],
#             "d_plus"    : float(hasil_topsis["d_plus"][i]),
#             "d_minus"   : float(hasil_topsis["d_minus"][i]),
#         }
#         for i in range(len(alternatif))
#     ]
#     db_insert("topsis_jarak", rows_jarak)

#     # Ranking Akhir
#     rows_ranking = [
#         {
#             "kode_ruang": kode_ruang,
#             "ranking"   : rank,
#             "destinasi" : row["nama_destinasi"],
#             "skor_akhir": float(row["skor_akhir"]),
#         }
#         for rank, row in enumerate(hasil_topsis["ranking"], start=1)
#     ]
#     db_insert("hasil_ranking_topsis", rows_ranking)


# # ============================================================
# # ENDPOINT UTAMA: POST /hitung-bwm
# # ============================================================
# @app.post("/hitung-bwm")
# async def hitung_semua(request: Request):
#     body = (
#         await request.json()
#         if request.headers.get("content-type", "").startswith("application/json")
#         else {}
#     )
#     kode_ruang = body.get("kode_ruang") or (body.get("record") or {}).get("kode_ruang")

#     if not kode_ruang:
#         raise HTTPException(status_code=400, detail="kode_ruang wajib disertakan!")

#     # ── LANGKAH 0: Bersihkan hasil lama ─────────────────────────────────
#     print(f"\n[MULAI PROSES] Kode Ruang: {kode_ruang}")
#     hapus_hasil_lama(kode_ruang)
#     print("  [✓] Hasil lama berhasil dibersihkan")

#     # ── LANGKAH 1: BWM Kriteria Utama ───────────────────────────────────
#     bobot_utama = proses_grup_bwm(
#         kode_ruang, "bbo_main", "bow_main",
#         KRITERIA_UTAMA, "best_kriteria", "worst_kriteria"
#     )
#     if not bobot_utama:
#         raise HTTPException(
#             status_code=400,
#             detail="Data BWM Utama tidak valid/kosong. Cek terminal untuk detail."
#         )

#     try:
#         db_insert("hasil_bobot_utama", {
#             "kode_ruang"   : kode_ruang,
#             "jenis_wisata" : float(bobot_utama[0]),
#             "biaya"        : float(bobot_utama[1]),
#             "aksesibilitas": float(bobot_utama[2]),
#             "fasilitas"    : float(bobot_utama[3]),
#             "daya_tarik"   : float(bobot_utama[4]),
#         })
#         print(f"  [✓] BWM Utama disimpan: {[round(b, 4) for b in bobot_utama]}")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Gagal simpan bobot utama: {e}")

#     # ── LANGKAH 2: BWM Sub-Kriteria + Bobot Global ──────────────────────
#     hasil_global = {}

#     for idx_utama, (kategori, config_sub) in enumerate(SUB_KRITERIA.items()):
#         bobot_sub = proses_grup_bwm(
#             kode_ruang,
#             f"bbo_{kategori}", f"bow_{kategori}",
#             config_sub, "best", "worst"
#         )

#         if not bobot_sub:
#             print(f"  [!] Sub-kriteria '{kategori}' dilewati (data kosong).")
#             continue

#         try:
#             rows_sub = [
#                 {
#                     "kode_ruang"  : kode_ruang,
#                     "kategori"    : kategori,
#                     "sub_kriteria": nama_sub,
#                     "bobot"       : float(bobot_sub[i]),
#                 }
#                 for i, nama_sub in enumerate(config_sub["kolom"])
#             ]
#             db_insert("hasil_bobot_sub", rows_sub)
#         except Exception as e:
#             raise HTTPException(status_code=500, detail=f"Gagal simpan bobot sub '{kategori}': {e}")

#         for i, nama_kolom_sub in enumerate(config_sub["kolom"]):
#             hasil_global[nama_kolom_sub] = round(bobot_utama[idx_utama] * bobot_sub[i], 6)

#     if not hasil_global:
#         raise HTTPException(status_code=400, detail="Gagal menghitung bobot global BWM.")

#     try:
#         rows_global = [
#             {"kode_ruang": kode_ruang, "kriteria": k, "bobot_global": float(v)}
#             for k, v in hasil_global.items()
#         ]
#         db_insert("hasil_bobot_global", rows_global)
#         print(f"  [✓] BWM Selesai. Total kriteria global: {len(hasil_global)}")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Gagal simpan bobot global: {e}")

#     # ── LANGKAH 3: TOPSIS ───────────────────────────────────────────────
#     print("  [⏳] Menjalankan kalkulasi TOPSIS...")
#     try:
#         hasil_topsis  = kalkulasi_topsis(hasil_global)
#         ranking_final = hasil_topsis["ranking"]
#         print(f"  [✓] TOPSIS selesai. Juara 1: {ranking_final[0]['nama_destinasi']}")
#     except Exception as e:
#         print(f"  [X] ERROR TOPSIS: {e}")
#         raise HTTPException(status_code=500, detail=f"Error TOPSIS: {str(e)}")

#     # ── LANGKAH 4: Simpan Semua Hasil TOPSIS ────────────────────────────
#     try:
#         simpan_topsis_ke_supabase(kode_ruang, hasil_topsis)
#         print("  [✓] Semua hasil TOPSIS berhasil disimpan ke Supabase.")
#     except Exception as e:
#         print(f"  [X] Gagal menyimpan hasil TOPSIS: {e}")
#         raise HTTPException(status_code=500, detail=f"Gagal simpan TOPSIS: {str(e)}")

#     # ── LANGKAH 5: Kembalikan Respons ke Next.js ────────────────────────
#     return {
#         "status"        : "success",
#         "kode_ruang"    : kode_ruang,
#         "bobot_global"  : hasil_global,
#         "ranking_topsis": ranking_final,
#     }

"""
============================================================
  BWM & TOPSIS Webhook Handler — FastAPI
  Trigger : POST /hitung-bwm
  Output  : Hitung Bobot Global BWM + Ranking TOPSIS
            + Simpan semua hasil ke Supabase (v2 compatible)
============================================================
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import numpy as np
import pandas as pd
from scipy.optimize import linprog

# ============================================================
# KONEKSI SUPABASE (sync client — kompatibel v2)
# ============================================================
URL = "https://dxhigllweuqjdvrzdxbf.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4aGlnbGx3ZXVxamR2cnpkeGJmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTgwODI3MCwiZXhwIjoyMDk1Mzg0MjcwfQ.NunSmfQ5pkaaDQyRW9n5k1GZhA63X8edH61DbaeAdss"

supabase: Client = create_client(URL, KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# KONFIGURASI KRITERIA & SUB-KRITERIA
# ============================================================
KRITERIA_UTAMA = {
    "kolom": ["jenis_wisata", "biaya", "aksesibilitas", "fasilitas", "daya_tarik"],
    "mapping_nama": {
        "Jenis Wisata": 0, "Biaya": 1, "Aksesibilitas": 2,
        "Fasilitas": 3, "Daya Tarik Wisata": 4
    }
}

SUB_KRITERIA = {
    "jenis_wisata": {
        "kolom": ["alam", "budaya", "historis", "rekreasi"],
        "mapping_nama": {
            "Wisata Alam": 0, "Wisata Budaya": 1,
            "Wisata Historis": 2, "Wisata Rekreasi": 3
        }
    },
    "biaya": {
        "kolom": ["harga_paket_wisata", "biaya_tambahan", "kesesuaian_harga_dengan_fasilitas"],
        "mapping_nama": {
            "Harga Paket Wisata": 0, "Biaya Tambahan": 1,
            "Kesesuaian Harga dengan Fasilitas": 2
        }
    },
    "aksesibilitas": {
        "kolom": ["jarak_tempuh", "kemudahan_transportasi"],
        "mapping_nama": {"Jarak Tempuh": 0, "Kemudahan Transportasi": 1}
    },
    "fasilitas": {
        "kolom": ["fasilitas_umum", "area_parkir", "keamanan_lokasi", "kebersihan"],
        "mapping_nama": {
            "Fasilitas Umum": 0, "Area Parkir": 1,
            "Keamanan Lokasi": 2, "Kebersihan Lingkungan": 3
        }
    },
    "daya_tarik": {
        "kolom": ["keindahan_keunikan", "aktivitas_wisata", "spot_foto"],
        "mapping_nama": {
            "Keindahan dan Keunikan Destinasi": 0,
            "Aktivitas Wisata": 1, "Spot Foto / Media Sosial": 2
        }
    }
}

CI_VALUES = {3: 4.47, 4: 4.80, 5: 5.14} # Konsistensi indeks BWM dasar

# ============================================================
# UTILS & HELPERS
# ============================================================
def db_insert(table_name: str, payload):
    try:
        return supabase.table(table_name).insert(payload).execute()
    except Exception as e:
        print(f"  [X] Gagal insert ke tabel {table_name}: {e}")
        raise e

def hapus_hasil_lama(kode_ruang: str):
    tables = [
        "topsis_normalisasi", "topsis_terbobot", "topsis_solusi_ideal", 
        "topsis_jarak", "hasil_ranking_topsis", "hasil_bobot_global", 
        "hasil_bobot_sub", "hasil_bobot_utama"
    ]
    for t in tables:
        try:
            supabase.table(t).delete().eq("kode_ruang", kode_ruang).execute()
        except Exception as e:
            print(f"  [!] Gagal membersihkan tabel {t}: {e}")

# ============================================================
# FUNGSI PROSES GRUP BWM
# ============================================================
def proses_grup_bwm(kode_ruang: str, bbo_table: str, bow_table: str, config: dict, field_best: str, field_worst: str):
    try:
        res_bbo = supabase.table(bbo_table).select("*").eq("kode_ruang", kode_ruang).execute()
        res_bow = supabase.table(bow_table).select("*").eq("kode_ruang", kode_ruang).execute()
        
        if not res_bbo.data or not res_bow.data:
            return None
            
        # Sederhanakan proses agregasi rata-rata nilai perbandingan dari responden
        n = len(config["kolom"])
        all_bo = []
        all_ow = []
        
        # Cari index best & worst dominan (modus/rata-rata) untuk penyusunan matriks agregat
        best_indices = []
        worst_indices = []
        
        mapping_aman = {k.lower().strip(): v for k, v in config["mapping_nama"].items()}
        
        for row in res_bbo.data:
            t_best = str(row.get(field_best, "")).strip().lower()
            if t_best in mapping_aman:
                best_indices.append(mapping_aman[t_best])
            all_bo.append([float(row.get(col, 1)) for col in config["kolom"]])
            
        for row in res_bow.data:
            t_worst = str(row.get(field_worst, "")).strip().lower()
            if t_worst in mapping_aman:
                worst_indices.append(mapping_aman[t_worst])
            all_ow.append([float(row.get(col, 1)) for col in config["kolom"]])
            
        if not all_bo or not all_ow:
            return None
            
        # Ambil nilai rata-rata perbandingan kriteria dari semua responden
        mean_bo = np.mean(all_bo, axis=0)
        mean_ow = np.mean(all_ow, axis=0)
        
        # Penentuan indeks jangkar agregat
        best_idx = max(set(best_indices), key=best_indices.count) if best_indices else 0
        worst_idx = max(set(worst_indices), key=worst_indices.count) if worst_indices else (n - 1)
        
        bobot, _, _ = hitung_bobot_bwm(mean_bo.tolist(), mean_ow.tolist(), best_idx, worst_idx, n)
        return bobot
    except Exception as e:
        print(f"  [X] Gagal memproses BWM pada grup {bbo_table}: {e}")
        return None

# ============================================================
# FUNGSI INTERPOLASI LINEAR BWM
# ============================================================
def hitung_bobot_bwm(bo: list, ow: list, best_idx: int, worst_idx: int, n: int):
    c = [0.0] * n + [1.0]
    A_ub, b_ub = [], []

    for j in range(n):
        rp = [0.0] * (n + 1); rp[best_idx] = 1.0;  rp[j] = -bo[j]; rp[n] = -1.0
        rn = [0.0] * (n + 1); rn[best_idx] = -1.0; rn[j] =  bo[j]; rn[n] = -1.0
        A_ub += [rp, rn]; b_ub += [0.0, 0.0]

    for j in range(n):
        rp = [0.0] * (n + 1); rp[j] = 1.0;  rp[worst_idx] = -ow[j]; rp[n] = -1.0
        rn = [0.0] * (n + 1); rn[j] = -1.0; rn[worst_idx] =  ow[j]; rn[n] = -1.0
        A_ub += [rp, rn]; b_ub += [0.0, 0.0]

    A_eq = [[1.0] * n + [0.0]]
    b_eq = [1.0]

    res = linprog(
        c, A_ub=A_ub, b_ub=b_ub,
        A_eq=A_eq, b_eq=b_eq,
        bounds=[(0, None)] * (n + 1),
        method="highs"
    )

    if not res.success:
        # Fallback jika model matematis linprog kaku terhadap nilai desimal agregat
        uniform_w = [1.0 / n] * n
        return uniform_w, 0.0, 0.0

    bobot = res.x[:n].tolist()
    xi    = float(res.x[-1])
    cr    = xi / CI_VALUES.get(n, 1.0)
    return bobot, xi, cr

# ============================================================
# KALKULASI TOPSIS (REVISI ANTI ERROR INDEX COLUMN)
# ============================================================
def kalkulasi_topsis(bobot_global: dict) -> dict:
    res = supabase.table("nilai_kriteria").select("*").execute()
    if not res.data:
        raise ValueError("Tabel nilai_kriteria kosong atau gagal ditarik!")

    df = pd.DataFrame(res.data)
    
    # ── METODE DETEKSI OTOMATIS NAMA KOLOM ALTERNATIF ─────────────────
    col_alternatif = None
    for kandidat in ["destinasi", "destinasi_wisata", "nama_tempat", "nama"]:
        if kandidat in df.columns:
            col_alternatif = kandidat
            break
            
    if not col_alternatif:
        raise KeyError("Gagal menemukan kolom nama objek wisata (destinasi/destinasi_wisata) di tabel nilai_kriteria!")
    
    print(f"  [✓] Kolom alternatif terdeteksi otomatis menggunakan: '{col_alternatif}'")
    # ──────────────────────────────────────────────────────────────────

    kriteria_cost  = ["harga_paket_wisata", "biaya_tambahan", "jarak_tempuh"]
    semua_kriteria = list(bobot_global.keys())

    # Ambil matriks keputusan keputusan X
    X = df[semua_kriteria].values.astype(float)

    pembagi = np.sqrt((X ** 2).sum(axis=0))
    pembagi[pembagi == 0] = 1e-12
    R = X / pembagi

    array_bobot = np.array([bobot_global[k] for k in semua_kriteria])
    V = R * array_bobot

    A_plus  = np.zeros(len(semua_kriteria))
    A_minus = np.zeros(len(semua_kriteria))
    for j, kriteria in enumerate(semua_kriteria):
        if kriteria in kriteria_cost:
            A_plus[j]  = np.min(V[:, j])
            A_minus[j] = np.max(V[:, j])
        else:
            A_plus[j]  = np.max(V[:, j])
            A_minus[j] = np.min(V[:, j])

    D_plus  = np.sqrt(((V - A_plus)  ** 2).sum(axis=1))
    D_minus = np.sqrt(((V - A_minus) ** 2).sum(axis=1))

    penyebut = D_plus + D_minus
    penyebut[penyebut == 0] = 1e-12
    C = D_minus / penyebut

    df["skor_akhir"] = C
    df_sorted = df.sort_values(by="skor_akhir", ascending=False).reset_index(drop=True)
    
    top_destinasi = df_sorted[[col_alternatif, "skor_akhir"]].head(10).to_dict("records")
    
    ranking = [
        {"nama_destinasi": row[col_alternatif], "skor_akhir": f"{row['skor_akhir']:.4f}"}
        for row in top_destinasi
    ]

    return {
        "ranking"    : ranking,
        "normalisasi": R,
        "terbobot"   : V,
        "a_plus"     : A_plus,
        "a_minus"    : A_minus,
        "d_plus"     : D_plus,
        "d_minus"    : D_minus,
        "preferensi" : C,
        "alternatif" : df[col_alternatif].tolist(),
        "kriteria"   : semua_kriteria,
    }

# ============================================================
# SIMPAN HASIL TOPSIS KE SUPABASE
# ============================================================
def simpan_topsis_ke_supabase(kode_ruang: str, hasil_topsis: dict):
    alternatif = hasil_topsis["alternatif"]
    kriteria   = hasil_topsis["kriteria"]
    R          = hasil_topsis["normalisasi"]
    V          = hasil_topsis["terbobot"]

    # Matriks Normalisasi
    rows_r = [
        {
            "kode_ruang": kode_ruang,
            "destinasi" : alternatif[i],
            "kriteria"  : krit,
            "nilai_r"   : float(R[i][j]),
        }
        for i in range(len(alternatif))
        for j, krit in enumerate(kriteria)
    ]
    db_insert("topsis_normalisasi", rows_r)

    # Matriks Terbobot
    rows_v = [
        {
            "kode_ruang": kode_ruang,
            "destinasi" : alternatif[i],
            "kriteria"  : krit,
            "nilai_v"   : float(V[i][j]),
        }
        for i in range(len(alternatif))
        for j, krit in enumerate(kriteria)
    ]
    db_insert("topsis_terbobot", rows_v)

    # Solusi Ideal
    rows_ideal = [
        {
            "kode_ruang": kode_ruang,
            "kriteria"  : krit,
            "a_plus"    : float(hasil_topsis["a_plus"][j]),
            "a_minus"   : float(hasil_topsis["a_minus"][j]),
        }
        for j, krit in enumerate(kriteria)
    ]
    db_insert("topsis_solusi_ideal", rows_ideal)

    # Jarak D+ & D-
    rows_jarak = [
        {
            "kode_ruang": kode_ruang,
            "destinasi" : alternatif[i],
            "d_plus"    : float(hasil_topsis["d_plus"][i]),
            "d_minus"   : float(hasil_topsis["d_minus"][i]),
        }
        for i in range(len(alternatif))
    ]
    db_insert("topsis_jarak", rows_jarak)

    # Ranking Akhir
    rows_ranking = [
        {
            "kode_ruang": kode_ruang,
            "ranking"   : rank,
            "destinasi" : row["nama_destinasi"],
            "skor_akhir": float(row["skor_akhir"]),
        }
        for rank, row in enumerate(hasil_topsis["ranking"], start=1)
    ]
    db_insert("hasil_ranking_topsis", rows_ranking)


# ============================================================
# ENDPOINT UTAMA: POST /hitung-bwm
# ============================================================
@app.post("/hitung-bwm")
async def hitung_semua(request: Request):
    body = (
        await request.json()
        if request.headers.get("content-type", "").startswith("application/json")
        else {}
    )
    kode_ruang = body.get("kode_ruang") or (body.get("record") or {}).get("kode_ruang")

    if not kode_ruang:
        raise HTTPException(status_code=400, detail="kode_ruang wajib disertakan!")

    # ── LANGKAH 0: Bersihkan hasil lama ─────────────────────────────────
    print(f"\n[MULAI PROSES] Kode Ruang: {kode_ruang}")
    hapus_hasil_lama(kode_ruang)
    print("  [✓] Hasil lama berhasil dibersihkan")

    # ── LANGKAH 1: BWM Kriteria Utama ───────────────────────────────────
    bobot_utama = proses_grup_bwm(
        kode_ruang, "bbo_main", "bow_main",
        KRITERIA_UTAMA, "best_kriteria", "worst_kriteria"
    )
    if not bobot_utama:
        raise HTTPException(
            status_code=400,
            detail="Data BWM Utama tidak valid/kosong. Pastikan responden sudah mengisi kuesioner utama."
        )

    try:
        db_insert("hasil_bobot_utama", {
            "kode_ruang"   : kode_ruang,
            "jenis_wisata" : float(bobot_utama[0]),
            "biaya"        : float(bobot_utama[1]),
            "aksesibilitas": float(bobot_utama[2]),
            "fasilitas"    : float(bobot_utama[3]),
            "daya_tarik"   : float(bobot_utama[4]),
        })
        print(f"  [✓] BWM Utama disimpan: {[round(b, 4) for b in bobot_utama]}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal simpan bobot utama: {e}")

    # ── LANGKAH 2: BWM Sub-Kriteria + Bobot Global ──────────────────────
    hasil_global = {}

    for idx_utama, (kategori, config_sub) in enumerate(SUB_KRITERIA.items()):
        bobot_sub = proses_grup_bwm(
            kode_ruang,
            f"bbo_{kategori}", f"bow_{kategori}",
            config_sub, "best", "worst"
        )

        if not bobot_sub:
            print(f"  [!] Sub-kriteria '{kategori}' dilewati (data kosong).")
            continue

        try:
            rows_sub = [
                {
                    "kode_ruang"  : kode_ruang,
                    "kategori"    : kategori,
                    "sub_kriteria": nama_sub,
                    "bobot"       : float(bobot_sub[i]),
                }
                for i, nama_sub in enumerate(config_sub["kolom"])
            ]
            db_insert("hasil_bobot_sub", rows_sub)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Gagal simpan bobot sub '{kategori}': {e}")

        for i, nama_kolom_sub in enumerate(config_sub["kolom"]):
            hasil_global[nama_kolom_sub] = round(bobot_utama[idx_utama] * bobot_sub[i], 6)

    if not hasil_global:
        raise HTTPException(status_code=400, detail="Gagal menghitung bobot global BWM.")

    try:
        rows_global = [
            {"kode_ruang": kode_ruang, "kriteria": k, "bobot_global": float(v)}
            for k, v in hasil_global.items()
        ]
        db_insert("hasil_bobot_global", rows_global)
        print(f"  [✓] BWM Selesai. Total kriteria global: {len(hasil_global)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal simpan bobot global: {e}")

    # ── LANGKAH 3: TOPSIS ───────────────────────────────────────────────
    print("  [⏳] Menjalankan kalkulasi TOPSIS...")
    try:
        hasil_topsis  = kalkulasi_topsis(hasil_global)
        ranking_final = hasil_topsis["ranking"]
        print(f"  [✓] TOPSIS selesai. Juara 1: {ranking_final[0]['nama_destinasi']}")
    except Exception as e:
        print(f"  [X] ERROR TOPSIS: {e}")
        raise HTTPException(status_code=500, detail=f"Error TOPSIS: {str(e)}")

    # ── LANGKAH 4: Simpan Semua Hasil TOPSIS ────────────────────────────
    try:
        simpan_topsis_ke_supabase(kode_ruang, hasil_topsis)
        print("  [✓] Semua hasil TOPSIS berhasil disimpan ke Supabase.")
    except Exception as e:
        print(f"  [X] Gagal menyimpan hasil TOPSIS: {e}")
        raise HTTPException(status_code=500, detail=f"Gagal simpan TOPSIS: {str(e)}")

    # ── LANGKAH 5: Kembalikan Respons ke Next.js ────────────────────────
    return {
        "status"        : "success",
        "kode_ruang"    : kode_ruang,
        "bobot_global"  : hasil_global,
        "ranking_topsis": ranking_final,
    }