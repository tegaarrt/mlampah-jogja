// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";

// export default function DashboardKetuaModern() {
//   const router = useRouter();
//   const [isMounted, setIsMounted] = useState(false);
//   const [hoverBtn, setHoverBtn] = useState<string | null>(null);

//   // === STATE DATA KETUA ===
//   const [idKetua, setIdKetua] = useState<number | null>(null);
//   const [namaKetua, setNamaKetua] = useState("Loading...");

//   // === STATE FORM PEMBUATAN RUANG ===
//   const [inputNamaGrup, setInputNamaGrup] = useState("");
//   const [inputTargetAnggota, setInputTargetAnggota] = useState("");

//   // === STATE RUANG AKTIF (YANG SEDANG DIPANTAU) ===
//   const [kodeRuang, setKodeRuang] = useState("");
//   const [namaGrupAktif, setNamaGrupAktif] = useState("");
//   const [targetAnggotaAktif, setTargetAnggotaAktif] = useState(0);

//   // === STATE RIWAYAT RUANG & KONTROL UI ===
//   const [riwayatRuang, setRiwayatRuang] = useState<any[]>([]);
//   const [isFinalized, setIsFinalized] = useState(false);
//   const [showResults, setShowResults] = useState(false);
//   const [listVoteAnggota, setListVoteAnggota] = useState<any[]>([]);

//   // === STATE HASIL DARI PYTHON ===
//   const [hasilBwmPython, setHasilBwmPython] = useState<any>(null);
//   const [hasilRanking, setHasilRanking] = useState<any[]>([]); 
//   const [isMenghitung, setIsMenghitung] = useState(false);

//   useEffect(() => {
//     setIsMounted(true); 
//     try {
//       const dataKetua = localStorage.getItem("temp_ketua");
//       if (dataKetua) {
//         const parsedData = JSON.parse(dataKetua);
//         const namaLengkap = parsedData.nama_lengkap || parsedData.username_login || "Ketua Rombongan";
//         setNamaKetua(namaLengkap);
//         if (parsedData.id_ketua) {
//           setIdKetua(parsedData.id_ketua);
//           fetchRiwayatRuang(parsedData.id_ketua);
//         }
//       } else {
//         router.push('/'); 
//       }
//     } catch (error) {
//       console.error("Gagal membaca Local Storage:", error);
//       router.push('/');
//     }
//   }, [router]);

//   const fetchRiwayatRuang = async (id: number) => {
//     try {
//       const { data, error } = await supabase
//         .from('ruang')
//         .select('*')
//         .eq('id_ketua', id)
//         .order('id_ruang', { ascending: false });

//       if (!error && data && Array.isArray(data)) {
//         setRiwayatRuang(data);
//       }
//     } catch (e) {
//       console.error("Koneksi Supabase Terputus:", e);
//     }
//   };

//   useEffect(() => {
//     if (!kodeRuang) return;
//     const radarInterval = setInterval(() => {
//       try {
//         const rawData = localStorage.getItem("simulated_db_votes");
//         if (rawData) {
//           const dbVotes = JSON.parse(rawData);
//           if (Array.isArray(dbVotes)) {
//             const votesDiRuangIni = dbVotes.filter((v: any) => v.kodeRuang === kodeRuang);
//             setListVoteAnggota(votesDiRuangIni);
//           }
//         }
//       } catch (e) {
//         console.error("Radar Error:", e);
//       }
//     }, 2000);
//     return () => clearInterval(radarInterval);
//   }, [kodeRuang]);

//   const jumlahSubmit = Array.isArray(listVoteAnggota) ? listVoteAnggota.length : 0;
//   const progressPersen = targetAnggotaAktif > 0 ? Math.min(100, Math.round((jumlahSubmit / targetAnggotaAktif) * 100)) : 0;

//   const handleBuatRuangBaru = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!inputNamaGrup || !inputTargetAnggota) {
//       alert("Mohon isi Nama Grup dan Target Anggota!");
//       return;
//     }
//     if (!idKetua) return;

//     const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
//     const generatedKode = `JOG-${randomCode}`;

//     const { error } = await supabase.from('ruang').insert([
//         { kode_ruang: generatedKode, nama_ketua: namaKetua, nama_grup: inputNamaGrup, jumlah_anggota: parseInt(inputTargetAnggota), id_ketua: idKetua }
//       ]);

//     if (!error) {
//       setKodeRuang(generatedKode);
//       setNamaGrupAktif(inputNamaGrup);
//       setTargetAnggotaAktif(parseInt(inputTargetAnggota));
//       setShowResults(false);
//       setIsFinalized(false);
//       setInputNamaGrup("");
//       setInputTargetAnggota("");
//       fetchRiwayatRuang(idKetua);
//     }
//   };

//   const handlePantauRuang = (ruang: any) => {
//     setKodeRuang(ruang.kode_ruang);
//     setNamaGrupAktif(ruang.nama_grup);
//     setTargetAnggotaAktif(ruang.jumlah_anggota);
//     setShowResults(false);
//     setIsFinalized(false);
//   };

//   const tembakApiPython = async () => {
//     setIsMenghitung(true);
//     try {
//       const respon = await fetch("http://127.0.0.1:8000/hitung-bwm", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ kode_ruang: kodeRuang }) 
//       });

//       if (!respon.ok) {
//         const errorData = await respon.json();
//         throw new Error(errorData.detail || "Terjadi kesalahan di algoritma Python.");
//       }

//       const data = await respon.json();
      
//       setHasilBwmPython(data.bobot_global); 
//       setHasilRanking(data.ranking_topsis || []); 
//       setShowResults(true);

//     } catch (error: any) {
//       alert(`Perhitungan Error: ${error.message}`);
//       console.error(error);
//     } finally {
//       setIsMenghitung(false);
//     }
//   };

//   const handleHitungData = () => {
//     if (jumlahSubmit === 0) {
//       alert("Belum ada satupun anggota yang mengumpulkan suara.");
//       return;
//     }
    
//     if (jumlahSubmit < targetAnggotaAktif) {
//       const confirm = window.confirm(`Baru ${jumlahSubmit} dari ${targetAnggotaAktif} anggota yang mengisi kuesioner. Anda yakin ingin menghitung hasil secara parsial?`);
//       if (confirm) tembakApiPython();
//     } else {
//       tembakApiPython();
//     }
//   };

//   const handleFinalisasi = () => {
//     if (window.confirm(`Kunci keputusan akhir untuk grup ${namaGrupAktif}?`)) {
//       setIsFinalized(true);
//     }
//   };

//   if (!isMounted) return <div style={styles.loadingState}><h3>Membuka Sistem...</h3></div>;

//   return (
//     <div style={styles.pageContainer}>
      
//       {/* NAVBAR LIGHT MODERN */}
//       <nav style={styles.navbar}>
//         <div style={styles.navBrand}>
//           <div style={styles.logoIcon}>
//             <div style={styles.logoLeaf1} />
//             <div style={styles.logoLeaf2} />
//             <div style={styles.logoLeaf3} />
//           </div>
//           <div>
//             <h2 style={styles.brandTitle}>Laman Ketua Grup</h2>
//             <p style={styles.brandSubtitle}>Mlampah Jogja Team</p>
//           </div>
//         </div>
//         <div style={styles.userProfile}>
//           <div style={styles.avatar}>{namaKetua ? namaKetua.charAt(0).toUpperCase() : "A"}</div>
//           <span style={styles.profileName}>{namaKetua}</span>
//           <div 
//             onClick={() => { localStorage.clear(); router.push('/'); }} 
//             onMouseEnter={() => setHoverBtn('logout')}
//             onMouseLeave={() => setHoverBtn(null)}
//             style={{
//               ...styles.logoutBtn,
//               backgroundColor: hoverBtn === 'logout' ? "#f1f5f9" : "#fff",
//               transform: hoverBtn === 'logout' ? "translateY(-1px)" : "translateY(0)"
//             }}
//           >
//             Keluar
//           </div>
//         </div>
//       </nav>

//       {/* KONTEN UTAMA */}
//       <main style={styles.mainContent}>
        
//         {/* JIKA BELUM ADA RUANG YANG DIPANTAU (LAYAR AWAL KETUA) */}
//         {!kodeRuang ? (
//           <div style={styles.splitGridAwal}>
            
//             {/* KOTAK BUAT RUANG */}
//             <div style={styles.cardPremium}>
//               <h3 style={styles.cardTitleAwal}>🔑 Buat Ruang Kolaborasi</h3>
//               <p style={styles.cardDescAwal}>Generate kode unik untuk memulai pemilihan wisata bersama grup.</p>
              
//               <form onSubmit={handleBuatRuangBaru} style={styles.formContainer}>
//                 <div>
//                   <label style={styles.labelForm}>Nama Grup Wisata</label>
//                   <input 
//                     type="text" 
//                     placeholder="Cth: Keluarga Besar Budi" 
//                     required 
//                     value={inputNamaGrup} 
//                     onChange={(e) => setInputNamaGrup(e.target.value)} 
//                     style={styles.inputPremium} 
//                   />
//                 </div>
//                 <div>
//                   <label style={styles.labelForm}>Target Jumlah Anggota</label>
//                   <input 
//                     type="number" 
//                     placeholder="Cth: 15" 
//                     required min="1" 
//                     value={inputTargetAnggota} 
//                     onChange={(e) => setInputTargetAnggota(e.target.value)} 
//                     style={styles.inputPremium} 
//                   />
//                 </div>
//                 <button 
//                   type="submit" 
//                   onMouseEnter={() => setHoverBtn('btnGen')}
//                   onMouseLeave={() => setHoverBtn(null)}
//                   style={{
//                     ...styles.btnGenerate,
//                     backgroundColor: hoverBtn === 'btnGen' ? "#3f6212" : "#4d7c0f",
//                     transform: hoverBtn === 'btnGen' ? "translateY(-2px)" : "translateY(0)"
//                   }}
//                 > 
//                   Generate Kode Ruang Baru
//                 </button>
//               </form>
//             </div>

//             {/* KOTAK RIWAYAT */}
//             <div style={styles.cardPremiumRiwayat}>
//               <h3 style={styles.cardTitleAwal}>📚 Riwayat Ruang Anda</h3>
//               <p style={styles.cardDescAwal}>Klik pantau untuk melanjutkan pemantauan grup yang sudah ada.</p>

//               {(!riwayatRuang || riwayatRuang.length === 0) ? (
//                 <div style={styles.emptyState}>
//                   <div style={{fontSize: "3rem", marginBottom: "10px"}}>📭</div>
//                   <p>Anda belum pernah membuat ruang rombongan.</p>
//                 </div>
//               ) : (
//                 <div style={styles.listRiwayat}>
//                   {riwayatRuang.map((ruang) => (
//                     <div key={ruang.id_ruang} style={styles.itemRiwayat}>
//                       <div>
//                         <div style={styles.riwayatNama}>{ruang.nama_grup}</div>
//                         <div style={styles.riwayatInfo}>{ruang.kode_ruang} &bull; {ruang.jumlah_anggota} Anggota</div>
//                       </div>
//                       <button 
//                         onClick={() => handlePantauRuang(ruang)} 
//                         style={styles.btnPantauMini}
//                       >
//                         Pantau ➔
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
          
//           /* === JIKA SUDAH ADA RUANG YANG DIPANTAU (LAYAR MONITORING) === */
//           <>
//             {!showResults ? (
//               // LAYAR MONITORING PROGRES
//               <div style={styles.splitGridMonitor}>
                
//                 {/* KOTAK INFO KODE GRUP (KIRI) */}
//                 <div style={styles.cardInfoGrup}>
//                   <div style={styles.headerInfoGrup}>
//                     <div style={styles.iconInfoGrup}>💼</div>
//                     <div>
//                       <div style={styles.labelInfoGrup}>KODE GRUP</div>
//                       <div style={styles.namaInfoGrup}>{namaGrupAktif.toUpperCase()}</div>
//                     </div>
//                   </div>
                  
//                   <h1 style={styles.teksKodeBesar}>{kodeRuang}</h1>
//                   <p style={styles.descInfoGrup}>Bagikan kode ini ke <strong>{targetAnggotaAktif} anggota</strong> Anda untuk mulai voting preferensi.</p>
                  
//                   <div style={styles.statsGrupBox}>
//                     <div style={styles.statItem}>
//                       <span style={styles.statValue}>👥 {targetAnggotaAktif}</span>
//                       <span style={styles.statLabel}>Anggota</span>
//                     </div>
//                     <div style={styles.statItemLine}></div>
//                     <div style={styles.statItem}>
//                       <span style={{...styles.statValue, color: "#16a34a"}}>🟢 {jumlahSubmit}</span>
//                       <span style={styles.statLabel}>Sudah Mengisi</span>
//                     </div>
//                   </div>

//                   <div style={styles.btnGrupActions}>
//                     <button style={styles.btnOutlineAction}>📄 Copy Kode</button>
//                     <button style={styles.btnWaAction}>💬 Share WhatsApp</button>
//                   </div>
//                   <div style={{fontSize: "0.8rem", color: "#64748b", marginTop: "15px", textAlign: "center"}}>Link grup: mlampahjogja.id/grup/{kodeRuang}</div>
//                 </div>

//                 {/* KOTAK PROGRES & ANALISIS (KANAN) */}
//                 <div style={styles.cardProgres}>
//                   <div style={styles.headerProgres}>
//                     <h3 style={styles.titleProgres}>PROGRES PENGISIAN PREFERENSI</h3>
//                     <span style={styles.updateText}>Diperbarui Live 🔄</span>
//                   </div>

//                   <div style={styles.progresBody}>
//                     {/* Donut Chart Visual Mockup */}
//                     <div style={styles.donutChartBox}>
//                       <svg viewBox="0 0 36 36" style={styles.circularChart}>
//                         <path style={styles.circleBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
//                         <path style={{...styles.circle, strokeDasharray: `${progressPersen}, 100`}} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
//                       </svg>
//                       <div style={styles.donutText}>
//                         <div style={styles.donutValue}>{jumlahSubmit}<span style={styles.donutDivider}>/{targetAnggotaAktif}</span></div>
//                         <div style={styles.donutPercent}>({progressPersen}%)</div>
//                       </div>
//                     </div>

//                     {/* Bar Chart Lines */}
//                     <div style={styles.barStatsContainer}>
//                       <div style={styles.barStatRow}>
//                         <div style={styles.barLabelGroup}>
//                           <span style={{color: "#16a34a", fontSize: "1.2rem"}}>●</span>
//                           <span style={styles.barText}>Sudah Mengisi</span>
//                         </div>
//                         <span style={styles.barCount}>{jumlahSubmit} anggota</span>
//                       </div>
//                       <div style={styles.barTrack}><div style={{...styles.barFill, width: `${progressPersen}%`, backgroundColor: "#16a34a"}}></div></div>

//                       <div style={styles.barStatRow}>
//                         <div style={styles.barLabelGroup}>
//                           <span style={{color: "#eab308", fontSize: "1.2rem"}}>●</span>
//                           <span style={styles.barText}>Belum Mengisi</span>
//                         </div>
//                         <span style={styles.barCount}>{targetAnggotaAktif - jumlahSubmit} anggota</span>
//                       </div>
//                       <div style={styles.barTrack}><div style={{...styles.barFill, width: `${100 - progressPersen}%`, backgroundColor: "#eab308"}}></div></div>
//                     </div>
//                   </div>

//                   {/* Tombol Eksekusi */}
//                   <div style={{marginTop: "30px"}}>
//                     <button 
//                       onClick={handleHitungData} 
//                       disabled={isMenghitung || jumlahSubmit === 0}
//                       onMouseEnter={() => setHoverBtn('hitung')}
//                       onMouseLeave={() => setHoverBtn(null)}
//                       style={{
//                         ...styles.btnAnalisis,
//                         backgroundColor: (isMenghitung || jumlahSubmit === 0) ? "#cbd5e1" : (hoverBtn === 'hitung' ? "#3f6212" : "#4d7c0f"),
//                         transform: hoverBtn === 'hitung' && jumlahSubmit > 0 && !isMenghitung ? "translateY(-2px)" : "translateY(0)"
//                       }}
//                     >
//                       {isMenghitung ? "Mengalkulasi..." : "⚡ Analisis Destinasi (BWM-TOPSIS)"}
//                     </button>
//                     <p style={styles.infoBawahBtn}>Sistem akan menghitung rekomendasi terbaik untuk grup Anda.</p>
//                   </div>
                  
//                   <button onClick={() => setKodeRuang("")} style={styles.btnTutupMonitor}>✕ Tutup Monitoring & Kembali</button>
//                 </div>
//               </div>
//             ) : (

//               // LAYAR HASIL REKOMENDASI (TAHAP 3)
//               <div style={styles.fadeAnimation}>
//                 <div style={styles.cardHasilPremium}>
//                   <div style={styles.headerHasil}>
//                     <div>
//                       <h3 style={styles.titleHasil}>🏆 Rekomendasi Konsensus Destinasi</h3>
//                       <p style={styles.descHasil}>Kalkulasi AI berdasarkan {jumlahSubmit} suara anggota grup {namaGrupAktif}.</p>
//                     </div>
//                     <button onClick={() => setShowResults(false)} style={styles.btnBackHasil}>⬅ Kembali Monitor</button>
//                   </div>
                  
//                   <div style={styles.tableWrapper}>
//                     <table style={styles.tabelMcdm}>
//                       <thead>
//                         <tr style={styles.thRow}>
//                           <th style={styles.thCell}>Rank</th>
//                           <th style={styles.thCell}>Destinasi Wisata</th>
//                           <th style={{...styles.thCell, textAlign: "right"}}>Skor Akhir (V)</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {hasilRanking && hasilRanking.length > 0 ? (
//                           hasilRanking.map((wisata, i) => (
//                             <tr key={i} style={{...styles.tbRow, backgroundColor: i === 0 ? "#f0fdf4" : "transparent"}}>
//                               <td style={styles.tdRankCell}>
//                                 <span style={{...styles.badgeRank, backgroundColor: i === 0 ? "#16a34a" : "#f1f5f9", color: i === 0 ? "#fff" : "#475569"}}>
//                                   #{i + 1}
//                                 </span>
//                               </td>
//                               <td style={styles.tdCell}>
//                                 <div style={{ fontWeight: "700", color: "#0f172a", fontSize: "1.1rem" }}>{wisata.nama_destinasi}</div>
//                               </td>
//                               <td style={{...styles.tdCell, textAlign: "right", color: i === 0 ? "#16a34a" : "#0f172a", fontWeight: "800", fontSize: "1.2rem"}}>
//                                 {wisata.skor_akhir}
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr><td colSpan={3} style={{padding: "30px", textAlign: "center", color: "#64748b"}}>Tidak ada data hasil.</td></tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
                  
//                   <div style={{marginTop: "30px", textAlign: "center"}}>
//                     <button 
//                       onClick={handleFinalisasi} 
//                       disabled={isFinalized} 
//                       style={{...styles.btnFinalisasi, backgroundColor: isFinalized ? "#e2e8f0" : "#0f172a", color: isFinalized ? "#94a3b8" : "#fff", cursor: isFinalized ? "not-allowed" : "pointer"}}
//                     >
//                       {isFinalized ? "🔒 Keputusan Dikunci (Selesai)" : "Deal & Kunci Keputusan Grup ✅"}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </main>
//     </div>
//   );
// }

// // === PREMIUM CLEAN SOFT-UI CSS IN JS ===
// const styles: { [key: string]: React.CSSProperties } = {
//   pageContainer: { 
//     minHeight: "100vh", width: "100%", fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
//     backgroundColor: "#f8fafc",
//     backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9)), url('/bg-candi.jpg')`, 
//     backgroundSize: "cover", backgroundPosition: "center top", backgroundAttachment: "fixed",
//     display: "flex", flexDirection: "column", boxSizing: "border-box"
//   },
  
//   // NAVBAR CLEAN
//   navbar: { width: "100%", height: "80px", padding: "0 6%", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid #f1f5f9", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" },
//   navBrand: { display: "flex", alignItems: "center", gap: "12px" }, 
//   logoIcon: { position: "relative", width: "24px", height: "24px" },
//   logoLeaf1: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#84cc16", borderRadius: "2px 8px 2px 8px", top: 0, left: 0 },
//   logoLeaf2: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#4d7c0f", borderRadius: "8px 2px 8px 2px", top: 0, right: 0 },
//   logoLeaf3: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#65a30d", borderRadius: "8px 2px 8px 2px", bottom: 0, left: 0 },
//   brandTitle: { margin: 0, fontSize: "1.1rem", fontWeight: "800", color: "#0f172a", textTransform: "uppercase" }, 
//   brandSubtitle: { margin: 0, fontSize: "0.75rem", color: "#64748b", fontWeight: "500" },
  
//   userProfile: { display: "flex", alignItems: "center", gap: "15px" }, 
//   avatar: { width: "35px", height: "35px", borderRadius: "50%", backgroundColor: "#0f172a", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold", color: "#fff", fontSize: "0.9rem" }, 
//   profileName: { fontSize: "0.95rem", fontWeight: "600", color: "#0f172a" }, 
//   logoutBtn: { cursor: "pointer", fontSize: "0.85rem", border: "1px solid #cbd5e1", padding: "8px 16px", borderRadius: "20px", transition: "all 0.2s ease", fontWeight: "600", color: "#475569" },
  
//   // MAIN CONTENT
//   mainContent: { flex: 1, padding: "40px 6%", maxWidth: "1200px", margin: "0 auto", width: "100%", boxSizing: "border-box" }, 

//   // TAMPILAN AWAL (MEMBUAT RUANG)
//   splitGridAwal: { display: "flex", gap: "30px", flexWrap: "wrap", alignItems: "stretch" },
//   cardPremium: { flex: "1 1 400px", backgroundColor: "#fff", borderRadius: "24px", padding: "40px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9" },
//   cardPremiumRiwayat: { flex: "1 1 400px", backgroundColor: "#fff", borderRadius: "24px", padding: "40px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9", display: "flex", flexDirection: "column" },
  
//   cardTitleAwal: { margin: "0 0 10px 0", fontSize: "1.4rem", color: "#0f172a", fontWeight: "800" },
//   cardDescAwal: { margin: "0 0 30px 0", fontSize: "0.95rem", color: "#64748b", lineHeight: 1.5 },
  
//   formContainer: { display: "flex", flexDirection: "column", gap: "20px" },
//   labelForm: { fontSize: "0.85rem", color: "#475569", fontWeight: "700", marginBottom: "8px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }, 
//   inputPremium: { width: "100%", padding: "15px 18px", borderRadius: "12px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", color: "#0f172a", fontSize: "0.95rem", outline: "none", transition: "all 0.2s", fontWeight: "500", boxSizing: "border-box" }, 
//   btnGenerate: { width: "100%", padding: "16px", marginTop: "10px", color: "#fff", border: "none", borderRadius: "12px", fontSize: "1rem", fontWeight: "700", cursor: "pointer", transition: "all 0.2s ease" }, 
  
//   emptyState: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", color: "#94a3b8", fontSize: "0.9rem", padding: "20px" },
//   listRiwayat: { display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto", flex: 1 },
//   itemRiwayat: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", borderRadius: "16px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc" },
//   riwayatNama: { fontWeight: "800", color: "#0f172a", fontSize: "1rem", marginBottom: "4px" },
//   riwayatInfo: { fontSize: "0.8rem", color: "#64748b", fontWeight: "500" },
//   btnPantauMini: { padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "600", backgroundColor: "#fff", border: "1px solid #cbd5e1", color: "#0f172a", cursor: "pointer" },

//   // === TAMPILAN MONITORING (SESUAI GAMBAR REFERENSI) ===
//   splitGridMonitor: { display: "flex", gap: "30px", flexWrap: "wrap", alignItems: "stretch" },
  
//   // Kotak Info Grup (Kiri) - Gradasi Hijau/Biru Lembut
//   cardInfoGrup: { flex: "1 1 350px", borderRadius: "24px", padding: "40px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", background: "linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)", display: "flex", flexDirection: "column" },
//   headerInfoGrup: { display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" },
//   iconInfoGrup: { width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#16a34a", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.2rem" },
//   labelInfoGrup: { fontSize: "0.75rem", color: "#475569", fontWeight: "700", letterSpacing: "1px" },
//   namaInfoGrup: { fontSize: "1.1rem", color: "#0f172a", fontWeight: "800" },
  
//   teksKodeBesar: { margin: "10px 0", fontSize: "3.5rem", fontWeight: "900", color: "#16a34a", letterSpacing: "2px" }, 
//   descInfoGrup: { fontSize: "0.95rem", color: "#475569", margin: "0 0 30px 0", lineHeight: 1.5 },
  
//   statsGrupBox: { display: "flex", alignItems: "center", gap: "20px", backgroundColor: "#fff", padding: "15px 25px", borderRadius: "16px", border: "1px dashed #cbd5e1", marginBottom: "30px" },
//   statItem: { display: "flex", flexDirection: "column", gap: "5px" },
//   statValue: { fontSize: "1.4rem", fontWeight: "900", color: "#0f172a" },
//   statLabel: { fontSize: "0.75rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase" },
//   statItemLine: { width: "1px", height: "40px", backgroundColor: "#e2e8f0" },
  
//   btnGrupActions: { display: "flex", gap: "10px" },
//   btnOutlineAction: { flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid #16a34a", backgroundColor: "#fff", color: "#16a34a", fontWeight: "700", cursor: "pointer", fontSize: "0.9rem" },
//   btnWaAction: { flex: 1, padding: "12px", borderRadius: "10px", border: "none", backgroundColor: "#16a34a", color: "#fff", fontWeight: "700", cursor: "pointer", fontSize: "0.9rem" },

//   // Kotak Progres (Kanan)
//   cardProgres: { flex: "1.5 1 500px", backgroundColor: "#fff", borderRadius: "24px", padding: "40px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9", display: "flex", flexDirection: "column" },
//   headerProgres: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "1px solid #f1f5f9", paddingBottom: "15px" },
//   titleProgres: { fontSize: "1rem", color: "#0f172a", fontWeight: "800", letterSpacing: "0.5px", margin: 0 },
//   updateText: { fontSize: "0.8rem", color: "#64748b", fontWeight: "500" },
  
//   progresBody: { display: "flex", gap: "40px", alignItems: "center", flexWrap: "wrap" },
  
//   // Donut Chart CSS
//   donutChartBox: { width: "150px", height: "150px", position: "relative" },
//   circularChart: { display: "block", margin: "0 auto", maxWidth: "100%", maxHeight: "250px" },
//   circleBg: { fill: "none", stroke: "#f1f5f9", strokeWidth: "3.8" },
//   circle: { fill: "none", strokeWidth: "3.8", strokeLinecap: "round", transition: "stroke-dasharray 1s ease" },
//   donutText: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" },
//   donutValue: { fontSize: "1.8rem", fontWeight: "900", color: "#0f172a", display: "flex", alignItems: "baseline" },
//   donutDivider: { fontSize: "1rem", color: "#64748b", fontWeight: "600", marginLeft: "2px" },
//   donutPercent: { fontSize: "0.85rem", color: "#64748b", fontWeight: "500", marginTop: "2px" },

//   // Bar Stats
//   barStatsContainer: { flex: 1, display: "flex", flexDirection: "column", gap: "20px" },
//   barStatRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
//   barLabelGroup: { display: "flex", alignItems: "center", gap: "8px" },
//   barText: { fontSize: "0.9rem", color: "#0f172a", fontWeight: "700" },
//   barCount: { fontSize: "0.85rem", color: "#64748b", fontWeight: "500" },
//   barTrack: { width: "100%", height: "8px", backgroundColor: "#f1f5f9", borderRadius: "4px", overflow: "hidden" },
//   barFill: { height: "100%", borderRadius: "4px", transition: "width 1s ease" },

//   btnAnalisis: { width: "100%", padding: "16px", color: "#fff", border: "none", borderRadius: "12px", fontSize: "1rem", fontWeight: "700", cursor: "pointer", transition: "all 0.2s ease" },
//   infoBawahBtn: { textAlign: "center", fontSize: "0.85rem", color: "#64748b", margin: "10px 0 0 0" },
//   btnTutupMonitor: { background: "none", border: "none", color: "#ef4444", fontSize: "0.9rem", fontWeight: "600", marginTop: "auto", paddingTop: "20px", cursor: "pointer", alignSelf: "center", transition: "opacity 0.2s" },

//   // === TAMPILAN HASIL ===
//   cardHasilPremium: { backgroundColor: "#fff", borderRadius: "24px", padding: "40px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" },
//   headerHasil: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "20px", marginBottom: "25px" },
//   titleHasil: { margin: "0 0 5px 0", fontSize: "1.4rem", color: "#0f172a", fontWeight: "800" },
//   descHasil: { margin: 0, fontSize: "0.9rem", color: "#64748b" },
//   btnBackHasil: { padding: "10px 20px", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "600", cursor: "pointer", color: "#0f172a" },
  
//   tableWrapper: { backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" },
//   tabelMcdm: { width: "100%", borderCollapse: "collapse" }, 
//   thRow: { backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }, 
//   thCell: { padding: "15px 20px", fontSize: "0.85rem", color: "#475569", fontWeight: "700", textAlign: "left", textTransform: "uppercase" }, 
//   tbRow: { borderBottom: "1px solid #f1f5f9" }, 
//   tdCell: { padding: "18px 20px", color: "#0f172a" }, 
//   tdRankCell: { padding: "18px 20px", width: "80px" }, 
//   badgeRank: { padding: "6px 12px", borderRadius: "8px", fontSize: "0.9rem", fontWeight: "800", display: "inline-flex", justifyContent: "center", alignItems: "center" },
  
//   btnFinalisasi: { padding: "18px 40px", border: "none", borderRadius: "12px", fontSize: "1.05rem", fontWeight: "700", transition: "all 0.2s ease" }, 
//   fadeAnimation: { animation: "fadeIn 0.4s ease-in-out" }
// };

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DashboardKetuaModern() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [hoverBtn, setHoverBtn] = useState<string | null>(null);

  // === STATE DATA KETUA ===
  const [idKetua, setIdKetua] = useState<number | null>(null);
  const [namaKetua, setNamaKetua] = useState("Loading...");

  // === STATE FORM PEMBUATAN RUANG ===
  const [inputNamaGrup, setInputNamaGrup] = useState("");
  const [inputTargetAnggota, setInputTargetAnggota] = useState("");

  // === STATE RUANG AKTIF (YANG SEDANG DIPANTAU) ===
  const [kodeRuang, setKodeRuang] = useState("");
  const [namaGrupAktif, setNamaGrupAktif] = useState("");
  const [targetAnggotaAktif, setTargetAnggotaAktif] = useState(0);

  // === STATE RIWAYAT RUANG & KONTROL UI ===
  const [riwayatRuang, setRiwayatRuang] = useState<any[]>([]);
  const [isFinalized, setIsFinalized] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // === PERBAIKAN: STATE JUMLAH SUBMIT REAL DARI SUPABASE ===
  const [jumlahSubmit, setJumlahSubmit] = useState(0);

  // === STATE HASIL ===
  const [hasilBwmPython, setHasilBwmPython] = useState<any>(null);
  const [hasilRanking, setHasilRanking] = useState<any[]>([]); 
  const [isMenghitung, setIsMenghitung] = useState(false);

  useEffect(() => {
    setIsMounted(true); 
    try {
      const dataKetua = localStorage.getItem("temp_ketua");
      if (dataKetua) {
        const parsedData = JSON.parse(dataKetua);
        const namaLengkap = parsedData.nama_lengkap || parsedData.username_login || "Ketua Rombongan";
        setNamaKetua(namaLengkap);
        if (parsedData.id_ketua) {
          setIdKetua(parsedData.id_ketua);
          fetchRiwayatRuang(parsedData.id_ketua);
        }
      } else {
        router.push('/'); 
      }
    } catch (error) {
      console.error("Gagal membaca Local Storage:", error);
      router.push('/');
    }
  }, [router]);

  const fetchRiwayatRuang = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('ruang')
        .select('*')
        .eq('id_ketua', id)
        .order('id_ruang', { ascending: false });

      if (!error && data && Array.isArray(data)) {
        setRiwayatRuang(data);
      }
    } catch (e) {
      console.error("Koneksi Supabase Terputus:", e);
    }
  };

  // === PERBAIKAN RADAR LIVE PROGRES: LANGSUNG KE SUPABASE ===
  useEffect(() => {
    if (!kodeRuang) return;
    
    const fetchLiveProgress = async () => {
      try {
        // Menghitung berapa banyak user yang mensubmit di bbo_main untuk kode ini
        const { count, error } = await supabase
          .from('bbo_main')
          .select('*', { count: 'exact', head: true })
          .eq('kode_ruang', kodeRuang);

        if (!error && count !== null) {
          setJumlahSubmit(count);
        }
      } catch (e) {
        console.error("Radar Supabase Error:", e);
      }
    };

    // Panggil langsung sekali saat dipantau
    fetchLiveProgress();

    // Pantau database tiap 3 detik
    const radarInterval = setInterval(fetchLiveProgress, 3000);
    return () => clearInterval(radarInterval);
  }, [kodeRuang]);

  const progressPersen = targetAnggotaAktif > 0 ? Math.min(100, Math.round((jumlahSubmit / targetAnggotaAktif) * 100)) : 0;

  const handleBuatRuangBaru = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNamaGrup || !inputTargetAnggota) {
      alert("Mohon isi Nama Grup dan Target Anggota!");
      return;
    }
    if (!idKetua) return;

    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const generatedKode = `JOG-${randomCode}`;

    const { error } = await supabase.from('ruang').insert([
        { kode_ruang: generatedKode, nama_ketua: namaKetua, nama_grup: inputNamaGrup, jumlah_anggota: parseInt(inputTargetAnggota), id_ketua: idKetua }
      ]);

    if (!error) {
      setKodeRuang(generatedKode);
      setNamaGrupAktif(inputNamaGrup);
      setTargetAnggotaAktif(parseInt(inputTargetAnggota));
      setShowResults(false);
      setIsFinalized(false);
      setInputNamaGrup("");
      setInputTargetAnggota("");
      setJumlahSubmit(0); // Reset progress lokal
      fetchRiwayatRuang(idKetua);
    }
  };

  // === FUNGSI BARU: HAPUS GRUP ===
  const handleHapusRuang = async (kode: string, namaGrup: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah kepencet fitur pantau
    
    const confirm = window.confirm(`⚠️ PERINGATAN!\n\nAnda yakin ingin menghapus permanen grup "${namaGrup}" (${kode})?\n\nSemua data voting yang masuk akan ikut terhapus.`);
    if (!confirm) return;

    try {
      // Hapus tabel ruang. 
      // (Penting: Pastikan di Supabase kolom Foreign Key kode_ruang pada tabel terkait sudah di-set 'ON DELETE CASCADE' agar tidak error)
      const { error } = await supabase
        .from('ruang')
        .delete()
        .eq('kode_ruang', kode);

      if (error) {
        alert(`Gagal menghapus grup. (Saran: Cek setting ON DELETE CASCADE di database Supabase-mu). Detail: ${error.message}`);
      } else {
        alert(`Grup ${namaGrup} berhasil dihapus dari sistem.`);
        if (kode === kodeRuang) {
          setKodeRuang(""); // Jika grup yang dihapus sedang dibuka, tutup layarnya
        }
        if (idKetua) fetchRiwayatRuang(idKetua); // Update ulang daftar grup
      }
    } catch (err) {
      console.error("Terjadi error hapus data:", err);
    }
  };

  const handlePantauRuang = async (ruang: any) => {
    setKodeRuang(ruang.kode_ruang);
    setNamaGrupAktif(ruang.nama_grup);
    setTargetAnggotaAktif(ruang.jumlah_anggota);
    setJumlahSubmit(0); // Reset sejenak selagi nunggu data Supabase
    
    // 1. Reset state layar
    setShowResults(false);
    setIsFinalized(false);
    setHasilRanking([]);

    try {
      // 2. Cek apakah ruang ini sudah dikunci (Deal) di database
      const { data: finalData } = await supabase
        .from('keputusan_final_grup')
        .select('id')
        .eq('kode_ruang', ruang.kode_ruang)
        .single();

      if (finalData) {
        // 3. JIKA SUDAH DIKUNCI: Tarik hasil ranking langsung dari database Supabase
        const { data: rankData } = await supabase
          .from('hasil_ranking_topsis')
          .select('destinasi, skor_akhir')
          .eq('kode_ruang', ruang.kode_ruang)
          .order('ranking', { ascending: true });

        if (rankData && rankData.length > 0) {
          const formattedRank = rankData.map((item) => ({
            nama_destinasi: item.destinasi,
            skor_akhir: item.skor_akhir
          }));
          
          setHasilRanking(formattedRank);
          setIsFinalized(true);
          setShowResults(true); 
        }
      }
    } catch (error) {
      console.error("Error cek status ruang:", error);
    }
  };

  const tembakApiPython = async () => {
    setIsMenghitung(true);
    try {
      const respon = await fetch("/api/hitung-bwm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kode_ruang: kodeRuang }) 
      });

      if (!respon.ok) {
        const errorData = await respon.json();
        throw new Error(errorData.detail || "Terjadi kesalahan di algoritma Python.");
      }

      const data = await respon.json();
      
      setHasilBwmPython(data.bobot_global); 
      setHasilRanking(data.ranking_topsis || []); 
      setShowResults(true);
      setIsFinalized(false);
    } catch (error: any) {
      alert(`Perhitungan Error: ${error.message}`);
      console.error(error);
    } finally {
      setIsMenghitung(false);
    }
  };

  const handleHitungData = () => {
    if (jumlahSubmit === 0) {
      alert("Belum ada satupun anggota yang mengumpulkan suara.");
      return;
    }
    
    if (jumlahSubmit < targetAnggotaAktif) {
      const confirm = window.confirm(`Baru ${jumlahSubmit} dari ${targetAnggotaAktif} anggota yang mengisi kuesioner. Anda yakin ingin menghitung hasil secara parsial?`);
      if (confirm) tembakApiPython();
    } else {
      tembakApiPython();
    }
  };

  const handleFinalisasi = async () => {
    if (!hasilRanking || hasilRanking.length === 0) {
      alert("Belum ada hasil ranking untuk dikunci.");
      return;
    }

    const juara1 = hasilRanking[0]; 

    if (window.confirm(`Kunci keputusan akhir untuk grup ${namaGrupAktif} dengan destinasi ${juara1.nama_destinasi}?`)) {
      try {
        const { data: rankData, error: errRank } = await supabase
          .from('hasil_ranking_topsis')
          .select('id')
          .eq('kode_ruang', kodeRuang)
          .eq('ranking', 1)
          .single();

        if (errRank || !rankData) {
          alert("Gagal mengambil ID Ranking. Pastikan data perhitungan valid.");
          return;
        }

        const { error: errInsert } = await supabase
          .from('keputusan_final_grup')
          .insert([{
            kode_ruang: kodeRuang,
            id_ketua: idKetua,
            id_hasil_ranking: rankData.id,
            destinasi: juara1.nama_destinasi,
            ranking_dipilih: 1,
            skor_akhir: parseFloat(juara1.skor_akhir)
          }]);

        if (errInsert) {
          if (errInsert.code === '23505') { 
            alert("Keputusan untuk grup ini sudah pernah dikunci sebelumnya!");
            setIsFinalized(true);
          } else {
            alert(`Gagal menyimpan keputusan: ${errInsert.message}`);
          }
          return;
        }

        alert(`🎉 Mantap! Keputusan grup ${namaGrupAktif} telah dikunci pada destinasi: ${juara1.nama_destinasi}.`);
        setIsFinalized(true);

      } catch (error) {
        console.error("Error finalisasi:", error);
        alert("Terjadi kesalahan sistem saat mencoba mengunci keputusan.");
      }
    }
  };

  if (!isMounted) return <div style={styles.loadingState}><h3>Membuka Sistem...</h3></div>;

  return (
    <div style={styles.pageContainer}>
      
      {/* NAVBAR LIGHT MODERN */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>
          <div style={styles.logoIcon}>
            <div style={styles.logoLeaf1} />
            <div style={styles.logoLeaf2} />
            <div style={styles.logoLeaf3} />
          </div>
          <div>
            <h2 style={styles.brandTitle}>Laman Ketua Grup</h2>
            <p style={styles.brandSubtitle}>Mlampah Jogja Team</p>
          </div>
        </div>
        <div style={styles.userProfile}>
          <div style={styles.avatar}>{namaKetua ? namaKetua.charAt(0).toUpperCase() : "A"}</div>
          <span style={styles.profileName}>{namaKetua}</span>
          <div 
            onClick={() => { localStorage.clear(); router.push('/'); }} 
            onMouseEnter={() => setHoverBtn('logout')}
            onMouseLeave={() => setHoverBtn(null)}
            style={{
              ...styles.logoutBtn,
              backgroundColor: hoverBtn === 'logout' ? "#f1f5f9" : "#fff",
              transform: hoverBtn === 'logout' ? "translateY(-1px)" : "translateY(0)"
            }}
          >
            Keluar
          </div>
        </div>
      </nav>

      {/* KONTEN UTAMA */}
      <main style={styles.mainContent}>
        
        {/* JIKA BELUM ADA RUANG YANG DIPANTAU (LAYAR AWAL KETUA) */}
        {!kodeRuang ? (
          <div style={styles.splitGridAwal}>
            
            {/* KOTAK BUAT RUANG */}
            <div style={styles.cardPremium}>
              <h3 style={styles.cardTitleAwal}>🔑 Buat Ruang Kolaborasi</h3>
              <p style={styles.cardDescAwal}>Generate kode unik untuk memulai pemilihan wisata bersama grup.</p>
              
              <form onSubmit={handleBuatRuangBaru} style={styles.formContainer}>
                <div>
                  <label style={styles.labelForm}>Nama Grup Wisata</label>
                  <input 
                    type="text" 
                    placeholder="Cth: Keluarga Besar Budi" 
                    required 
                    value={inputNamaGrup} 
                    onChange={(e) => setInputNamaGrup(e.target.value)} 
                    style={styles.inputPremium} 
                  />
                </div>
                <div>
                  <label style={styles.labelForm}>Target Jumlah Anggota</label>
                  <input 
                    type="number" 
                    placeholder="Cth: 15" 
                    required min="1" 
                    value={inputTargetAnggota} 
                    onChange={(e) => setInputTargetAnggota(e.target.value)} 
                    style={styles.inputPremium} 
                  />
                </div>
                <button 
                  type="submit" 
                  onMouseEnter={() => setHoverBtn('btnGen')}
                  onMouseLeave={() => setHoverBtn(null)}
                  style={{
                    ...styles.btnGenerate,
                    backgroundColor: hoverBtn === 'btnGen' ? "#3f6212" : "#4d7c0f",
                    transform: hoverBtn === 'btnGen' ? "translateY(-2px)" : "translateY(0)"
                  }}
                > 
                  Generate Kode Ruang Baru
                </button>
              </form>
            </div>

            {/* KOTAK RIWAYAT */}
            <div style={styles.cardPremiumRiwayat}>
              <h3 style={styles.cardTitleAwal}>📚 Riwayat Ruang Anda</h3>
              <p style={styles.cardDescAwal}>Pilih grup untuk dipantau atau kelola data Anda di sini.</p>

              {(!riwayatRuang || riwayatRuang.length === 0) ? (
                <div style={styles.emptyState}>
                  <div style={{fontSize: "3rem", marginBottom: "10px"}}>📭</div>
                  <p>Anda belum pernah membuat ruang rombongan.</p>
                </div>
              ) : (
                <div style={styles.listRiwayat}>
                  {riwayatRuang.map((ruang) => (
                    <div key={ruang.id_ruang} style={styles.itemRiwayat}>
                      <div>
                        <div style={styles.riwayatNama}>{ruang.nama_grup}</div>
                        <div style={styles.riwayatInfo}>{ruang.kode_ruang} &bull; {ruang.jumlah_anggota} Anggota</div>
                      </div>
                      
                      {/* TOMBOL AKSI GROUP */}
                      <div style={{display: "flex", gap: "8px"}}>
                        <button 
                          onClick={() => handlePantauRuang(ruang)} 
                          style={styles.btnPantauMini}
                        >
                          Pantau ➔
                        </button>
                        <button 
                          onClick={(e) => handleHapusRuang(ruang.kode_ruang, ruang.nama_grup, e)} 
                          style={styles.btnHapusMini}
                          title="Hapus Grup Permanen"
                        >
                          🗑️
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          
          /* === JIKA SUDAH ADA RUANG YANG DIPANTAU (LAYAR MONITORING) === */
          <>
            {!showResults ? (
              // LAYAR MONITORING PROGRES
              <div style={styles.splitGridMonitor}>
                
                {/* KOTAK INFO KODE GRUP (KIRI) */}
                <div style={styles.cardInfoGrup}>
                  <div style={styles.headerInfoGrup}>
                    <div style={styles.iconInfoGrup}>💼</div>
                    <div>
                      <div style={styles.labelInfoGrup}>KODE GRUP</div>
                      <div style={styles.namaInfoGrup}>{namaGrupAktif.toUpperCase()}</div>
                    </div>
                  </div>
                  
                  <h1 style={styles.teksKodeBesar}>{kodeRuang}</h1>
                  <p style={styles.descInfoGrup}>Bagikan kode ini ke <strong>{targetAnggotaAktif} anggota</strong> Anda untuk mulai voting preferensi.</p>
                  
                  <div style={styles.statsGrupBox}>
                    <div style={styles.statItem}>
                      <span style={styles.statValue}>👥 {targetAnggotaAktif}</span>
                      <span style={styles.statLabel}>Anggota</span>
                    </div>
                    <div style={styles.statItemLine}></div>
                    <div style={styles.statItem}>
                      <span style={{...styles.statValue, color: "#16a34a"}}>🟢 {jumlahSubmit}</span>
                      <span style={styles.statLabel}>Sudah Mengisi</span>
                    </div>
                  </div>

                  <div style={styles.btnGrupActions}>
                    <button style={styles.btnOutlineAction}>📄 Copy Kode</button>
                    <button style={styles.btnWaAction}>💬 Share WhatsApp</button>
                  </div>
                  <div style={{fontSize: "0.8rem", color: "#64748b", marginTop: "15px", textAlign: "center"}}>Link grup: mlampahjogja.id/grup/{kodeRuang}</div>
                </div>

                {/* KOTAK PROGRES & ANALISIS (KANAN) */}
                <div style={styles.cardProgres}>
                  <div style={styles.headerProgres}>
                    <h3 style={styles.titleProgres}>PROGRES PENGISIAN PREFERENSI</h3>
                    <span style={styles.updateText}>Diperbarui Live 🔄</span>
                  </div>

                  <div style={styles.progresBody}>
                    <div style={styles.donutChartBox}>
                      <svg viewBox="0 0 36 36" style={styles.circularChart}>
                        <path style={styles.circleBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path style={{...styles.circle, strokeDasharray: `${progressPersen}, 100`}} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <div style={styles.donutText}>
                        <div style={styles.donutValue}>{jumlahSubmit}<span style={styles.donutDivider}>/{targetAnggotaAktif}</span></div>
                        <div style={styles.donutPercent}>({progressPersen}%)</div>
                      </div>
                    </div>

                    <div style={styles.barStatsContainer}>
                      <div style={styles.barStatRow}>
                        <div style={styles.barLabelGroup}>
                          <span style={{color: "#16a34a", fontSize: "1.2rem"}}>●</span>
                          <span style={styles.barText}>Sudah Mengisi</span>
                        </div>
                        <span style={styles.barCount}>{jumlahSubmit} anggota</span>
                      </div>
                      <div style={styles.barTrack}><div style={{...styles.barFill, width: `${progressPersen}%`, backgroundColor: "#16a34a"}}></div></div>

                      <div style={styles.barStatRow}>
                        <div style={styles.barLabelGroup}>
                          <span style={{color: "#eab308", fontSize: "1.2rem"}}>●</span>
                          <span style={styles.barText}>Belum Mengisi</span>
                        </div>
                        <span style={styles.barCount}>{Math.max(0, targetAnggotaAktif - jumlahSubmit)} anggota</span>
                      </div>
                      <div style={styles.barTrack}><div style={{...styles.barFill, width: `${100 - progressPersen}%`, backgroundColor: "#eab308"}}></div></div>
                    </div>
                  </div>

                  <div style={{marginTop: "30px"}}>
                    <button 
                      onClick={handleHitungData} 
                      disabled={isMenghitung || jumlahSubmit === 0}
                      onMouseEnter={() => setHoverBtn('hitung')}
                      onMouseLeave={() => setHoverBtn(null)}
                      style={{
                        ...styles.btnAnalisis,
                        backgroundColor: (isMenghitung || jumlahSubmit === 0) ? "#cbd5e1" : (hoverBtn === 'hitung' ? "#3f6212" : "#4d7c0f"),
                        transform: hoverBtn === 'hitung' && jumlahSubmit > 0 && !isMenghitung ? "translateY(-2px)" : "translateY(0)"
                      }}
                    >
                      {isMenghitung ? "Mengalkulasi..." : "⚡ Analisis Destinasi (BWM-TOPSIS)"}
                    </button>
                    <p style={styles.infoBawahBtn}>Sistem akan menghitung rekomendasi terbaik untuk grup Anda.</p>
                  </div>
                  
                  <button onClick={() => setKodeRuang("")} style={styles.btnTutupMonitor}>✕ Tutup Monitoring & Kembali</button>
                </div>
              </div>
            ) : (

              // LAYAR HASIL REKOMENDASI (TAHAP 3)
              <div style={styles.fadeAnimation}>
                <div style={styles.cardHasilPremium}>
                  <div style={styles.headerHasil}>
                    <div>
                      <h3 style={styles.titleHasil}>🏆 Rekomendasi Konsensus Destinasi</h3>
                      <p style={styles.descHasil}>
                        {isFinalized 
                          ? `Keputusan final untuk grup ${namaGrupAktif} telah dikunci.` 
                          : `Kalkulasi berdasarkan ${jumlahSubmit} suara anggota grup ${namaGrupAktif}.`
                        }
                      </p>
                    </div>
                    {/* Logika Tombol Kembali Pintar */}
                    {isFinalized ? (
                      <button onClick={() => setKodeRuang("")} style={styles.btnBackHasil}>⬅ Kembali ke Daftar Grup</button>
                    ) : (
                      <button onClick={() => setShowResults(false)} style={styles.btnBackHasil}>⬅ Kembali Monitor</button>
                    )}
                  </div>
                  
                  <div style={styles.tableWrapper}>
                    <table style={styles.tabelMcdm}>
                      <thead>
                        <tr style={styles.thRow}>
                          <th style={styles.thCell}>Rank</th>
                          <th style={styles.thCell}>Destinasi Wisata</th>
                          <th style={{...styles.thCell, textAlign: "right"}}>Skor Akhir (V)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hasilRanking && hasilRanking.length > 0 ? (
                          hasilRanking.map((wisata, i) => (
                            <tr key={i} style={{...styles.tbRow, backgroundColor: i === 0 ? "#f0fdf4" : "transparent"}}>
                              <td style={styles.tdRankCell}>
                                <span style={{...styles.badgeRank, backgroundColor: i === 0 ? "#16a34a" : "#f1f5f9", color: i === 0 ? "#fff" : "#475569"}}>
                                  #{i + 1}
                                </span>
                              </td>
                              <td style={styles.tdCell}>
                                <div style={{ fontWeight: "700", color: "#0f172a", fontSize: "1.1rem" }}>{wisata.nama_destinasi}</div>
                              </td>
                              <td style={{...styles.tdCell, textAlign: "right", color: i === 0 ? "#16a34a" : "#0f172a", fontWeight: "800", fontSize: "1.2rem"}}>
                                {wisata.skor_akhir}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={3} style={{padding: "30px", textAlign: "center", color: "#64748b"}}>Tidak ada data hasil.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  <div style={{marginTop: "30px", textAlign: "center"}}>
                    <button 
                      onClick={handleFinalisasi} 
                      disabled={isFinalized} 
                      style={{...styles.btnFinalisasi, backgroundColor: isFinalized ? "#e2e8f0" : "#0f172a", color: isFinalized ? "#94a3b8" : "#fff", cursor: isFinalized ? "not-allowed" : "pointer"}}
                    >
                      {isFinalized ? "🔒 Keputusan Dikunci (Selesai)" : "Deal & Kunci Keputusan Grup ✅"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// === PREMIUM CLEAN SOFT-UI CSS IN JS ===
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: { 
    minHeight: "100vh", width: "100%", fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    backgroundColor: "#f8fafc",
    backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9)), url('/bg-candi.jpg')`, 
    backgroundSize: "cover", backgroundPosition: "center top", backgroundAttachment: "fixed",
    display: "flex", flexDirection: "column", boxSizing: "border-box"
  },
  
  // NAVBAR CLEAN
  navbar: { width: "100%", height: "80px", padding: "0 6%", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid #f1f5f9", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" },
  navBrand: { display: "flex", alignItems: "center", gap: "12px" }, 
  logoIcon: { position: "relative", width: "24px", height: "24px" },
  logoLeaf1: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#84cc16", borderRadius: "2px 8px 2px 8px", top: 0, left: 0 },
  logoLeaf2: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#4d7c0f", borderRadius: "8px 2px 8px 2px", top: 0, right: 0 },
  logoLeaf3: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#65a30d", borderRadius: "8px 2px 8px 2px", bottom: 0, left: 0 },
  brandTitle: { margin: 0, fontSize: "1.1rem", fontWeight: "800", color: "#0f172a", textTransform: "uppercase" }, 
  brandSubtitle: { margin: 0, fontSize: "0.75rem", color: "#64748b", fontWeight: "500" },
  
  userProfile: { display: "flex", alignItems: "center", gap: "15px" }, 
  avatar: { width: "35px", height: "35px", borderRadius: "50%", backgroundColor: "#0f172a", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold", color: "#fff", fontSize: "0.9rem" }, 
  profileName: { fontSize: "0.95rem", fontWeight: "600", color: "#0f172a" }, 
  logoutBtn: { cursor: "pointer", fontSize: "0.85rem", border: "1px solid #cbd5e1", padding: "8px 16px", borderRadius: "20px", transition: "all 0.2s ease", fontWeight: "600", color: "#475569" },
  
  // MAIN CONTENT
  mainContent: { flex: 1, padding: "40px 6%", maxWidth: "1200px", margin: "0 auto", width: "100%", boxSizing: "border-box" }, 

  // TAMPILAN AWAL (MEMBUAT RUANG)
  splitGridAwal: { display: "flex", gap: "30px", flexWrap: "wrap", alignItems: "stretch" },
  cardPremium: { flex: "1 1 400px", backgroundColor: "#fff", borderRadius: "24px", padding: "40px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9" },
  cardPremiumRiwayat: { flex: "1 1 400px", backgroundColor: "#fff", borderRadius: "24px", padding: "40px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9", display: "flex", flexDirection: "column" },
  
  cardTitleAwal: { margin: "0 0 10px 0", fontSize: "1.4rem", color: "#0f172a", fontWeight: "800" },
  cardDescAwal: { margin: "0 0 30px 0", fontSize: "0.95rem", color: "#64748b", lineHeight: 1.5 },
  
  formContainer: { display: "flex", flexDirection: "column", gap: "20px" },
  labelForm: { fontSize: "0.85rem", color: "#475569", fontWeight: "700", marginBottom: "8px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }, 
  inputPremium: { width: "100%", padding: "15px 18px", borderRadius: "12px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", color: "#0f172a", fontSize: "0.95rem", outline: "none", transition: "all 0.2s", fontWeight: "500", boxSizing: "border-box" }, 
  btnGenerate: { width: "100%", padding: "16px", marginTop: "10px", color: "#fff", border: "none", borderRadius: "12px", fontSize: "1rem", fontWeight: "700", cursor: "pointer", transition: "all 0.2s ease" }, 
  
  emptyState: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", color: "#94a3b8", fontSize: "0.9rem", padding: "20px" },
  listRiwayat: { display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto", flex: 1 },
  itemRiwayat: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", borderRadius: "16px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc" },
  riwayatNama: { fontWeight: "800", color: "#0f172a", fontSize: "1rem", marginBottom: "4px" },
  riwayatInfo: { fontSize: "0.8rem", color: "#64748b", fontWeight: "500" },
  
  btnPantauMini: { padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "600", backgroundColor: "#fff", border: "1px solid #cbd5e1", color: "#0f172a", cursor: "pointer" },
  btnHapusMini: { padding: "8px", borderRadius: "8px", fontSize: "0.9rem", fontWeight: "600", backgroundColor: "#fee2e2", border: "1px solid #f87171", color: "#ef4444", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" },

  // === TAMPILAN MONITORING (SESUAI GAMBAR REFERENSI) ===
  splitGridMonitor: { display: "flex", gap: "30px", flexWrap: "wrap", alignItems: "stretch" },
  
  // Kotak Info Grup (Kiri) - Gradasi Hijau/Biru Lembut
  cardInfoGrup: { flex: "1 1 350px", borderRadius: "24px", padding: "40px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", background: "linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)", display: "flex", flexDirection: "column" },
  headerInfoGrup: { display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" },
  iconInfoGrup: { width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#16a34a", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.2rem" },
  labelInfoGrup: { fontSize: "0.75rem", color: "#475569", fontWeight: "700", letterSpacing: "1px" },
  namaInfoGrup: { fontSize: "1.1rem", color: "#0f172a", fontWeight: "800" },
  
  teksKodeBesar: { margin: "10px 0", fontSize: "3.5rem", fontWeight: "900", color: "#16a34a", letterSpacing: "2px" }, 
  descInfoGrup: { fontSize: "0.95rem", color: "#475569", margin: "0 0 30px 0", lineHeight: 1.5 },
  
  statsGrupBox: { display: "flex", alignItems: "center", gap: "20px", backgroundColor: "#fff", padding: "15px 25px", borderRadius: "16px", border: "1px dashed #cbd5e1", marginBottom: "30px" },
  statItem: { display: "flex", flexDirection: "column", gap: "5px" },
  statValue: { fontSize: "1.4rem", fontWeight: "900", color: "#0f172a" },
  statLabel: { fontSize: "0.75rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase" },
  statItemLine: { width: "1px", height: "40px", backgroundColor: "#e2e8f0" },
  
  btnGrupActions: { display: "flex", gap: "10px" },
  btnOutlineAction: { flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid #16a34a", backgroundColor: "#fff", color: "#16a34a", fontWeight: "700", cursor: "pointer", fontSize: "0.9rem" },
  btnWaAction: { flex: 1, padding: "12px", borderRadius: "10px", border: "none", backgroundColor: "#16a34a", color: "#fff", fontWeight: "700", cursor: "pointer", fontSize: "0.9rem" },

  // Kotak Progres (Kanan)
  cardProgres: { flex: "1.5 1 500px", backgroundColor: "#fff", borderRadius: "24px", padding: "40px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9", display: "flex", flexDirection: "column" },
  headerProgres: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "1px solid #f1f5f9", paddingBottom: "15px" },
  titleProgres: { fontSize: "1rem", color: "#0f172a", fontWeight: "800", letterSpacing: "0.5px", margin: 0 },
  updateText: { fontSize: "0.8rem", color: "#64748b", fontWeight: "500" },
  
  progresBody: { display: "flex", gap: "40px", alignItems: "center", flexWrap: "wrap" },
  
  // Donut Chart CSS
  donutChartBox: { width: "150px", height: "150px", position: "relative" },
  circularChart: { display: "block", margin: "0 auto", maxWidth: "100%", maxHeight: "250px" },
  circleBg: { fill: "none", stroke: "#f1f5f9", strokeWidth: "3.8" },
  circle: { fill: "none", strokeWidth: "3.8", strokeLinecap: "round", transition: "stroke-dasharray 1s ease" },
  donutText: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" },
  donutValue: { fontSize: "1.8rem", fontWeight: "900", color: "#0f172a", display: "flex", alignItems: "baseline" },
  donutDivider: { fontSize: "1rem", color: "#64748b", fontWeight: "600", marginLeft: "2px" },
  donutPercent: { fontSize: "0.85rem", color: "#64748b", fontWeight: "500", marginTop: "2px" },

  // Bar Stats
  barStatsContainer: { flex: 1, display: "flex", flexDirection: "column", gap: "20px" },
  barStatRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  barLabelGroup: { display: "flex", alignItems: "center", gap: "8px" },
  barText: { fontSize: "0.9rem", color: "#0f172a", fontWeight: "700" },
  barCount: { fontSize: "0.85rem", color: "#64748b", fontWeight: "500" },
  barTrack: { width: "100%", height: "8px", backgroundColor: "#f1f5f9", borderRadius: "4px", overflow: "hidden" },
  barFill: { height: "100%", borderRadius: "4px", transition: "width 1s ease" },

  btnAnalisis: { width: "100%", padding: "16px", color: "#fff", border: "none", borderRadius: "12px", fontSize: "1rem", fontWeight: "700", cursor: "pointer", transition: "all 0.2s ease" },
  infoBawahBtn: { textAlign: "center", fontSize: "0.85rem", color: "#64748b", margin: "10px 0 0 0" },
  btnTutupMonitor: { background: "none", border: "none", color: "#ef4444", fontSize: "0.9rem", fontWeight: "600", marginTop: "auto", paddingTop: "20px", cursor: "pointer", alignSelf: "center", transition: "opacity 0.2s" },

  // === TAMPILAN HASIL ===
  cardHasilPremium: { backgroundColor: "#fff", borderRadius: "24px", padding: "40px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" },
  headerHasil: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "20px", marginBottom: "25px" },
  titleHasil: { margin: "0 0 5px 0", fontSize: "1.4rem", color: "#0f172a", fontWeight: "800" },
  descHasil: { margin: 0, fontSize: "0.9rem", color: "#64748b" },
  btnBackHasil: { padding: "10px 20px", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "600", cursor: "pointer", color: "#0f172a" },
  
  tableWrapper: { backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" },
  tabelMcdm: { width: "100%", borderCollapse: "collapse" }, 
  thRow: { backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }, 
  thCell: { padding: "15px 20px", fontSize: "0.85rem", color: "#475569", fontWeight: "700", textAlign: "left", textTransform: "uppercase" }, 
  tbRow: { borderBottom: "1px solid #f1f5f9" }, 
  tdCell: { padding: "18px 20px", color: "#0f172a" }, 
  tdRankCell: { padding: "18px 20px", width: "80px" }, 
  badgeRank: { padding: "6px 12px", borderRadius: "8px", fontSize: "0.9rem", fontWeight: "800", display: "inline-flex", justifyContent: "center", alignItems: "center" },
  
  btnFinalisasi: { padding: "18px 40px", border: "none", borderRadius: "12px", fontSize: "1.05rem", fontWeight: "700", transition: "all 0.2s ease" }, 
  fadeAnimation: { animation: "fadeIn 0.4s ease-in-out" }
};