// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase"; 

// // --- Komponen Panduan (Sistematika BWM) ---
// const PenjelasanBWM = ({ type }: { type: 'best' | 'worst' }) => (
//   <div style={{
//     fontSize: "0.85rem", 
//     color: "#000", 
//     marginTop: "12px", 
//     fontStyle: "italic",
//     backgroundColor: type === 'best' ? "#e0f2fe" : "#fee2e2",
//     padding: "10px 15px",
//     borderRadius: "8px",
//     border: `2px solid ${type === 'best' ? "#bae6fd" : "#fecaca"}`,
//     fontWeight: "600",
//     lineHeight: "1.5"
//   }}>
//     {type === 'best' 
//       ? "💡 Best: Pilih kriteria yang PALING UTAMA bagi Anda. Setelah dipilih, beri nilai skala 1-9 di bawahnya untuk membandingkan seberapa mutlak pentingnya kriteria ini dibanding yang lain."
//       : "💡 Worst: Pilih kriteria yang PALING BISA DIABAIKAN. Setelah dipilih, beri nilai skala 1-9 di bawahnya untuk membandingkan seberapa lebih penting kriteria lain terhadap kriteria ini."}
//   </div>
// );

// // Data master statis
// const DAFTAR_KRITERIA_MASTER = [
//   "Jenis Wisata",
//   "Biaya",
//   "Aksesibilitas",
//   "Fasilitas",
//   "Daya Tarik Wisata"
// ];

// const subKriteriaData: Record<string, string[]> = {
//   "Jenis Wisata": ["Wisata Alam", "Wisata Budaya", "Wisata Historis", "Wisata Rekreasi"],
//   "Biaya": ["Harga Paket Wisata", "Biaya Tambahan", "Kesesuaian Harga dengan Fasilitas"],
//   "Aksesibilitas": ["Jarak Tempuh", "Kemudahan Transportasi"],
//   "Fasilitas": ["Fasilitas Umum", "Area Parkir", "Keamanan Lokasi", "Kebersihan Lingkungan"],
//   "Daya Tarik Wisata": ["Keindahan dan Keunikan Destinasi", "Aktivitas Wisata", "Spot Foto / Media Sosial"]
// };

// const mapOpsiKeKolomSQL: Record<string, string> = {
//   "Wisata Alam": "alam", "Wisata Budaya": "budaya", "Wisata Historis": "historis", "Wisata Rekreasi": "rekreasi",
//   "Harga Paket Wisata": "harga_paket_wisata", "Biaya Tambahan": "biaya_tambahan", "Kesesuaian Harga dengan Fasilitas": "kesesuaian_harga_dengan_fasilitas",
//   "Jarak Tempuh": "jarak_tempuh", "Kemudahan Transportasi": "kemudahan_transportasi",
//   "Fasilitas Umum": "fasilitas_umum", "Area Parkir": "area_parkir", "Keamanan Lokasi": "keamanan_lokasi", "Kebersihan Lingkungan": "kebersihan",
//   "Keindahan dan Keunikan Destinasi": "keindahan_keunikan", "Aktivitas Wisata": "aktivitas_wisata", "Spot Foto / Media Sosial": "spot_foto"
// };

// type SubBWMState = {
//   best: string; worst: string; isBestLocked: boolean; isWorstLocked: boolean;
//   skorBest: Record<string, number>; skorWorst: Record<string, number>;
// };

// export default function KuesionerBWM() {
//   const router = useRouter();

//   const [dataUser, setDataUser] = useState({ namaAnggota: "", kodeRuang: "" });
//   const [tahap, setTahap] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [hoverBtn, setHoverBtn] = useState<string | null>(null);
  
//   const [statusCekHasil, setStatusCekHasil] = useState<"IDLE" | "LOADING" | "EMPTY" | "SUCCESS">("IDLE");
//   const [dataHasil, setDataHasil] = useState<any[]>([]);

//   // === STATE KRITERIA DINAMIS DARI ADMIN ===
//   const [daftarKriteriaAktif, setDaftarKriteriaAktif] = useState<string[]>(DAFTAR_KRITERIA_MASTER);

//   const [bestKriteria, setBestKriteria] = useState("");
//   const [isBestLocked, setIsBestLocked] = useState(false);
//   const [skorBest, setSkorBest] = useState<Record<string, number>>({});

//   const [worstKriteria, setWorstKriteria] = useState("");
//   const [isWorstLocked, setIsWorstLocked] = useState(false);
//   const [skorWorst, setSkorWorst] = useState<Record<string, number>>({});

//   const [subBwm, setSubBwm] = useState<Record<string, SubBWMState>>(() => {
//     const init: Record<string, SubBWMState> = {};
//     Object.keys(subKriteriaData).forEach(kat => {
//       init[kat] = { best: "", worst: "", isBestLocked: false, isWorstLocked: false, skorBest: {}, skorWorst: {} };
//     });
//     return init;
//   });

//   useEffect(() => {
//     const savedData = localStorage.getItem("temp_anggota");
//     if (savedData) {
//       const parsedData = JSON.parse(savedData);
//       setDataUser(parsedData);
      
//       // === SINKRONISASI KRITERIA DARI ADMIN ===
//       const settingAdmin = localStorage.getItem(`kriteria_ruang_${parsedData.id_ruang}`);
//       if (settingAdmin) {
//         try {
//           const kriteriaDariAdmin = JSON.parse(settingAdmin);
//           const kriteriaYangBolehTampil = kriteriaDariAdmin
//             .filter((k: any) => k.aktif === true)
//             .map((k: any) => k.nama);
          
//           if (kriteriaYangBolehTampil.length > 0) {
//             setDaftarKriteriaAktif(kriteriaYangBolehTampil);
//           }
//         } catch (e) {
//           console.error("Gagal membaca setting kriteria dari Admin:", e);
//         }
//       }

//       // === LOGIKA ANTI BOCOR ===
//       const statusSubmit = localStorage.getItem(`status_submit_${parsedData.kodeRuang}_${parsedData.namaAnggota}`);
//       if (statusSubmit === "DONE") {
//         setTahap(3); 
//       }
//     } else {
//       router.push("/");
//     }
//   }, [router]);

//   const handleBestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selected = e.target.value;
//     setBestKriteria(selected);
//     setIsBestLocked(true); 
//     const initialScores: Record<string, number> = {};
//     daftarKriteriaAktif.forEach(k => { if (k !== selected) initialScores[k] = 1; });
//     setSkorBest(initialScores);
//     if (worstKriteria === selected) { setWorstKriteria(""); setIsWorstLocked(false); }
//   };

//   const handleSkorBestChange = (kriteriaLain: string, nilai: number) => { setSkorBest(prev => ({ ...prev, [kriteriaLain]: nilai })); };

//   const handleWorstChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selected = e.target.value;
//     setWorstKriteria(selected);
//     setIsWorstLocked(true);
//     const initialScores: Record<string, number> = {};
//     daftarKriteriaAktif.forEach(k => { if (k !== selected) initialScores[k] = 1; });
//     setSkorWorst(initialScores);
//   };

//   const handleSkorWorstChange = (kriteriaLain: string, nilai: number) => { setSkorWorst(prev => ({ ...prev, [kriteriaLain]: nilai })); };

//   const isBwmUtamaValid = isBestLocked && isWorstLocked && (bestKriteria !== worstKriteria);

//   const handleSubBestChange = (kategori: string, selected: string) => {
//     setSubBwm(prev => {
//       const catState = prev[kategori];
//       const initialScores: Record<string, number> = {};
//       subKriteriaData[kategori].forEach(k => { if(k !== selected) initialScores[k] = 1; });
//       return {
//         ...prev,
//         [kategori]: { ...catState, best: selected, isBestLocked: true, skorBest: initialScores, worst: catState.worst === selected ? "" : catState.worst, isWorstLocked: catState.worst === selected ? false : catState.isWorstLocked }
//       };
//     });
//   };

//   const handleSubSkorBestChange = (kategori: string, subLain: string, nilai: number) => {
//     setSubBwm(prev => ({ ...prev, [kategori]: { ...prev[kategori], skorBest: { ...prev[kategori].skorBest, [subLain]: nilai } } }));
//   };

//   const handleSubWorstChange = (kategori: string, selected: string) => {
//     setSubBwm(prev => {
//       const catState = prev[kategori];
//       const initialScores: Record<string, number> = {};
//       subKriteriaData[kategori].forEach(k => { if(k !== selected) initialScores[k] = 1; });
//       return {
//         ...prev, [kategori]: { ...catState, worst: selected, isWorstLocked: true, skorWorst: initialScores }
//       };
//     });
//   };

//   const handleSubSkorWorstChange = (kategori: string, subLain: string, nilai: number) => {
//     setSubBwm(prev => ({ ...prev, [kategori]: { ...prev[kategori], skorWorst: { ...prev[kategori].skorWorst, [subLain]: nilai } } }));
//   };

//   const unlockSubBest = (kategori: string) => { setSubBwm(prev => ({...prev, [kategori]: {...prev[kategori], isBestLocked: false}})); };
//   const unlockSubWorst = (kategori: string) => { setSubBwm(prev => ({...prev, [kategori]: {...prev[kategori], isWorstLocked: false}})); };

//   const isSubKriteriaSelesai = daftarKriteriaAktif.every(cat => {
//     const stateCat = subBwm[cat];
//     return stateCat.isBestLocked && stateCat.isWorstLocked && stateCat.best !== stateCat.worst;
//   });

//   const handleSubmitData = async () => {
//     setIsSubmitting(true);
//     const roomCode = (dataUser.kodeRuang || "").trim().toUpperCase();
//     const dbPromises = [];

//     const bboMainPayload = {
//       kode_ruang: roomCode, best_kriteria: bestKriteria,
//       "jenis_wisata": bestKriteria === "Jenis Wisata" ? 1 : skorBest["Jenis Wisata"] || 1,
//       "biaya": bestKriteria === "Biaya" ? 1 : skorBest["Biaya"] || 1,
//       "aksesibilitas": bestKriteria === "Aksesibilitas" ? 1 : skorBest["Aksesibilitas"] || 1,
//       "fasilitas": bestKriteria === "Fasilitas" ? 1 : skorBest["Fasilitas"] || 1,
//       "daya_tarik": bestKriteria === "Daya Tarik Wisata" ? 1 : skorBest["Daya Tarik Wisata"] || 1,
//     };

//     const bowMainPayload = {
//       kode_ruang: roomCode, worst_kriteria: worstKriteria,
//       "jenis_wisata": worstKriteria === "Jenis Wisata" ? 1 : skorWorst["Jenis Wisata"] || 1,
//       "biaya": worstKriteria === "Biaya" ? 1 : skorWorst["Biaya"] || 1,
//       "aksesibilitas": worstKriteria === "Aksesibilitas" ? 1 : skorWorst["Aksesibilitas"] || 1,
//       "fasilitas": worstKriteria === "Fasilitas" ? 1 : skorWorst["Fasilitas"] || 1,
//       "daya_tarik": worstKriteria === "Daya Tarik Wisata" ? 1 : skorWorst["Daya Tarik Wisata"] || 1,
//     };

//     dbPromises.push(supabase.from('bbo_main').insert([bboMainPayload]));
//     dbPromises.push(supabase.from('bow_main').insert([bowMainPayload]));

//     const mapKategoriKeNamaTabel: Record<string, string> = {
//       "Jenis Wisata": "jenis_wisata", "Biaya": "biaya", "Aksesibilitas": "aksesibilitas", "Fasilitas": "fasilitas", "Daya Tarik Wisata": "daya_tarik"
//     };

//     for (const kategori of daftarKriteriaAktif) {
//       const stateBwm = subBwm[kategori];
//       const suffixTabel = mapKategoriKeNamaTabel[kategori];
//       const bboSubPayload: any = { kode_ruang: roomCode, best: stateBwm.best };
//       const bowSubPayload: any = { kode_ruang: roomCode, worst: stateBwm.worst };

//       subKriteriaData[kategori].forEach(subOpsi => {
//         const namaKolomSQL = mapOpsiKeKolomSQL[subOpsi];
//         bboSubPayload[namaKolomSQL] = stateBwm.best === subOpsi ? 1 : (stateBwm.skorBest[subOpsi] || 1);
//         bowSubPayload[namaKolomSQL] = stateBwm.worst === subOpsi ? 1 : (stateBwm.skorWorst[subOpsi] || 1);
//       });

//       dbPromises.push(supabase.from(`bbo_${suffixTabel}`).insert([bboSubPayload]));
//       dbPromises.push(supabase.from(`bow_${suffixTabel}`).insert([bowSubPayload]));
//     }

//     try {
//       const results = await Promise.all(dbPromises);
//       const errors = results.filter(r => r.error);
//       if (errors.length > 0) {
//         console.error(errors);
//         alert("Gagal menyimpan kuesioner. Periksa koneksi internet.");
//         setIsSubmitting(false);
//         return;
//       }

//       const existingDb = JSON.parse(localStorage.getItem("simulated_db_votes") || "[]");
//       const newVote = { namaAnggota: dataUser.namaAnggota, kodeRuang: roomCode, timestamp: new Date().toISOString() };
//       existingDb.push(newVote);
//       localStorage.setItem("simulated_db_votes", JSON.stringify(existingDb));
      
//       localStorage.setItem(`status_submit_${roomCode}_${dataUser.namaAnggota}`, "DONE");
      
//       window.dispatchEvent(new Event("storage"));
      
//       setTahap(3); 
//     } catch (e) {
//       console.error(e);
//       alert("Terjadi gangguan konektivitas jaringan.");
//       setIsSubmitting(false);
//     }
//   };

//   const handleCekHasil = async () => {
//     setStatusCekHasil("LOADING");
//     try {
//       const { data, error } = await supabase
//         .from('keputusan_final_grup')
//         .select('destinasi, skor_akhir')
//         .eq('kode_ruang', dataUser.kodeRuang)
//         .order('ranking_dipilih', { ascending: true });

//       if (data && data.length > 0) {
//         const formattedHasil = data.map(item => ({
//           nama_destinasi: item.destinasi,
//           skor_akhir: item.skor_akhir
//         }));
//         setDataHasil(formattedHasil);
//         setStatusCekHasil("SUCCESS");
//       } else {
//         setStatusCekHasil("EMPTY");
//       }
//     } catch (err) {
//       setStatusCekHasil("EMPTY");
//     }
//   };

//   return (
//     <div style={styles.pageContainer}>
//       <nav style={styles.navbar}>
//         <div style={styles.navBrand}>
//           <div style={styles.logoIcon}>
//             <div style={styles.logoLeaf1} />
//             <div style={styles.logoLeaf2} />
//             <div style={styles.logoLeaf3} />
//           </div>
//           <div>
//             <h2 style={styles.brandTitle}>Instrumen Pilihan</h2>
//             <p style={styles.brandSubtitle}>Mlampah Jogja DSS</p>
//           </div>
//         </div>
        
//         <div style={styles.userProfile}>
//           <div style={styles.userInfo}>
//             <span style={styles.roomCodeBadge}>{dataUser.kodeRuang || "NON-ACTIVE"}</span>
//             <span style={styles.profileName}>{dataUser.namaAnggota || "Anonim"}</span>
//           </div>
//           <Link 
//             href="/" 
//             onMouseEnter={() => setHoverBtn('logout')}
//             onMouseLeave={() => setHoverBtn(null)}
//             style={{
//               ...styles.logoutBtn,
//               backgroundColor: hoverBtn === 'logout' ? "#000" : "#fff",
//               color: hoverBtn === 'logout' ? "#B3EBF2" : "#000",
//               transform: hoverBtn === 'logout' ? "translateY(-2px)" : "translateY(0)"
//             }}
//           >
//             Tutup Sesi
//           </Link>
//         </div>
//       </nav>

//       <main style={styles.mainContent}>
        
//         {/* TAHAP 1: KRITERIA UTAMA */}
//         {tahap === 1 && (
//           <div style={styles.centerWrapper}>
//             <div style={styles.cardPremiumContainer}>
              
//               <div style={styles.stepIndicator}>
//                 <div style={styles.stepDotActive}>1</div>
//                 <div style={styles.stepLabelActive}>Kategori Utama</div>
//                 <div style={styles.stepLine}></div>
//                 <div style={styles.stepDotInactive}>2</div>
//                 <div style={styles.stepLabelInactive}>Detail Kategori</div>
//               </div>
              
//               <div style={{textAlign: "center", marginBottom: "40px"}}>
//                 <h3 style={styles.cardTitle}>Tentukan Kriteria Utama Liburan</h3>
//                 <p style={styles.cardDescCenter}>Pilih satu hal yang <strong>paling Anda perdulikan</strong> dan satu yang <strong>paling tidak Anda perdulikan</strong> saat liburan.</p>
//               </div>

//               <div style={styles.splitGrid}>
                
//                 {/* --- KOLOM KIRI: BEST CRITERIA --- */}
//                 <div style={styles.gridColumn}>
//                   <div style={{...styles.columnHeader, borderBottomColor: "#000"}}>
//                     <h4 style={{...styles.columnTitle, color: "#000", backgroundColor: "#B3EBF2", padding: "6px 12px", borderRadius: "8px", border: "2px solid #000", display: "inline-block"}}>👍 Paling Penting</h4>
//                   </div>
                  
//                   <div style={styles.dropdownContainer}>
//                     <div style={styles.dropdownHeader}>
//                       <label style={styles.dropdownLabel}>Pilih kategori yang paling utama:</label>
//                       {isBestLocked && (<button onClick={() => setIsBestLocked(false)} style={styles.btnUnlock}>Ubah Pilihan</button>)}
//                     </div>
//                     <select 
//                       value={bestKriteria} 
//                       onChange={handleBestChange} 
//                       disabled={isBestLocked}
//                       style={{...styles.inputField, cursor: isBestLocked ? "not-allowed" : "pointer", backgroundColor: isBestLocked ? "#f1f5f9" : "#fff", opacity: isBestLocked ? 0.7 : 1}}
//                     >
//                       <option value="" disabled>-- Pilih Kategori Utama --</option>
//                       {daftarKriteriaAktif.map(k => <option key={`b-${k}`} value={k}>{k}</option>)}
//                     </select>
                    
//                     {/* TOOLTIP BANTUAN BEST */}
//                     {!isBestLocked && <PenjelasanBWM type="best" />}
//                   </div>

//                   {bestKriteria && isBestLocked && (
//                     <div style={styles.comparisonContainer}>
//                       <div style={styles.infoBox}>Seberapa lebih penting <strong>{bestKriteria}</strong> jika dibandingkan dengan:</div>
//                       <div style={styles.matrixArea}>
//                         {daftarKriteriaAktif.filter(k => k !== bestKriteria).map(kriteriaLain => (
//                           <div key={`b-row-${kriteriaLain}`} style={styles.comparisonRow}>
//                             <div style={styles.comparisonTitle}>
//                               <span style={styles.highlightOther}>{kriteriaLain}</span>
//                             </div>
//                             <div style={styles.scaleButtonGroup}>
//                               {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
//                                 const isSelected = skorBest[kriteriaLain] === num;
//                                 return (
//                                   <button key={`b-btn-${num}`} type="button" onClick={() => handleSkorBestChange(kriteriaLain, num)}
//                                     style={{
//                                       ...styles.scaleBtn,
//                                       backgroundColor: isSelected ? "#000" : "#fff",
//                                       color: isSelected ? "#B3EBF2" : "#000",
//                                       fontWeight: isSelected ? "900" : "600",
//                                       transform: isSelected ? "scale(1.1)" : "scale(1)"
//                                     }}
//                                   >{num}</button>
//                                 );
//                               })}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                       <p style={{fontSize: "0.8rem", color: "#64748b", margin: 0, textAlign: "right"}}>*1 = Sama Penting, 9 = Sangat Mutlak Penting</p>
//                     </div>
//                   )}
//                 </div>

//                 {/* --- KOLOM KANAN: WORST CRITERIA --- */}
//                 <div style={styles.gridColumn}>
//                   <div style={{...styles.columnHeader, borderBottomColor: "#000"}}>
//                     <h4 style={{...styles.columnTitle, color: "#000", backgroundColor: "#fecaca", padding: "6px 12px", borderRadius: "8px", border: "2px solid #000", display: "inline-block"}}>👎 Paling Tidak Penting</h4>
//                   </div>
                  
//                   <div style={styles.dropdownContainer}>
//                     <div style={styles.dropdownHeader}>
//                       <label style={styles.dropdownLabel}>Pilih kategori yang paling bisa diabaikan:</label>
//                       {isWorstLocked && (<button onClick={() => setIsWorstLocked(false)} style={styles.btnUnlock}>Ubah Pilihan</button>)}
//                     </div>
//                     <select 
//                       value={worstKriteria} 
//                       onChange={handleWorstChange} 
//                       disabled={isWorstLocked || !isBestLocked}
//                       style={{...styles.inputField, cursor: (isWorstLocked || !isBestLocked) ? "not-allowed" : "pointer", backgroundColor: (isWorstLocked || !isBestLocked) ? "#f1f5f9" : "#fff", opacity: (isWorstLocked || !isBestLocked) ? 0.7 : 1}}
//                     >
//                       <option value="" disabled>{!isBestLocked ? "Kunci pilihan 'Paling Penting' dahulu" : "-- Pilih Kategori Terakhir --"}</option>
//                       {daftarKriteriaAktif.filter(k => k !== bestKriteria).map(k => <option key={`w-${k}`} value={k}>{k}</option>)}
//                     </select>
                    
//                     {/* TOOLTIP BANTUAN WORST */}
//                     {(!isWorstLocked && isBestLocked) && <PenjelasanBWM type="worst" />}
//                   </div>

//                   {worstKriteria && isWorstLocked && (
//                     <div style={styles.comparisonContainer}>
//                       <div style={styles.infoBox}>Bandingkan kembali kategori lainnya terhadap <strong>{worstKriteria}</strong>:</div>
//                       <div style={styles.matrixArea}>
//                         {daftarKriteriaAktif.filter(k => k !== worstKriteria).map(kriteriaLain => (
//                           <div key={`w-row-${kriteriaLain}`} style={styles.comparisonRow}>
//                             <div style={styles.comparisonTitle}>
//                               <span style={styles.highlightOther}>{kriteriaLain}</span>
//                             </div>
//                             <div style={styles.scaleButtonGroup}>
//                               {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
//                                 const isSelected = skorWorst[kriteriaLain] === num;
//                                 return (
//                                   <button key={`w-btn-${num}`} type="button" onClick={() => handleSkorWorstChange(kriteriaLain, num)}
//                                     style={{
//                                       ...styles.scaleBtn,
//                                       backgroundColor: isSelected ? "#000" : "#fff",
//                                       color: isSelected ? "#fca5a5" : "#000",
//                                       fontWeight: isSelected ? "900" : "600",
//                                       transform: isSelected ? "scale(1.1)" : "scale(1)",
//                                       borderColor: isSelected ? "#000" : "#cbd5e1"
//                                     }}
//                                   >{num}</button>
//                                 );
//                               })}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                       <p style={{fontSize: "0.8rem", color: "#64748b", margin: 0, textAlign: "right"}}>*1 = Sama Penting, 9 = Sangat Mutlak Penting</p>
//                     </div>
//                   )}
//                 </div>

//               </div>

//               <div style={styles.actionButtons}>
//                 <button 
//                   onClick={() => setTahap(2)} 
//                   disabled={!isBwmUtamaValid} 
//                   onMouseEnter={() => setHoverBtn('next1')}
//                   onMouseLeave={() => setHoverBtn(null)}
//                   style={{
//                     ...styles.btnPrimary,
//                     opacity: isBwmUtamaValid ? 1 : 0.4, 
//                     cursor: isBwmUtamaValid ? "pointer" : "not-allowed",
//                     transform: hoverBtn === 'next1' && isBwmUtamaValid ? "translateY(-3px)" : "translateY(0)"
//                   }}
//                 >
//                   Lanjut ke Detail Kategori &rarr;
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* TAHAP 2: EVALUASI SUB-KRITERIA (Hanya Tampilkan Yg Aktif) */}
//         {tahap === 2 && (
//           <div style={styles.centerWrapper}>
//             <div style={styles.cardPremiumContainer}>
//               <div style={styles.stepIndicator}>
//                 <div style={styles.stepDotSuccess}>&#10003;</div><div style={styles.stepLabelSuccess}>Kategori Utama</div><div style={styles.stepLineActive}></div>
//                 <div style={styles.stepDotActive}>2</div><div style={styles.stepLabelActive}>Detail Kategori</div>
//               </div>
//               <div style={styles.headerSection}>
//                 <h3 style={styles.cardTitle}>Evaluasi Detail Kategori Wisata</h3>
//                 <p style={styles.cardDescCenter}>Terapkan pola pemilihan yang sama untuk setiap rincian dari kategori wisata di bawah ini.</p>
//               </div>
              
//               <div style={styles.subCriteriaWrapper}>
//                 {daftarKriteriaAktif.map((kategori) => {
//                   const subs = subKriteriaData[kategori];
//                   const catState = subBwm[kategori];
                  
//                   return (
//                     <div key={kategori} style={styles.categorySection}>
//                       <h4 style={styles.categoryTitle}>{kategori}</h4>
                      
//                       <div style={{...styles.splitGrid, padding: "25px"}}>
//                         {/* KOLOM KIRI SUB (BEST) */}
//                         <div style={styles.gridColumn}>
//                           <div style={styles.dropdownContainer}>
//                             <div style={styles.dropdownHeader}>
//                               <label style={styles.dropdownLabel}>Pilih Paling Penting (👍):</label>
//                               {catState.isBestLocked && (<button onClick={() => unlockSubBest(kategori)} style={styles.btnUnlock}>Ubah</button>)}
//                             </div>
//                             <select 
//                               value={catState.best} onChange={(e) => handleSubBestChange(kategori, e.target.value)} disabled={catState.isBestLocked}
//                               style={{...styles.inputField, cursor: catState.isBestLocked ? "not-allowed" : "pointer", backgroundColor: catState.isBestLocked ? "#f1f5f9" : "#fff"}}
//                             >
//                               <option value="" disabled>-- Pilih Rincian --</option>
//                               {subs.map(k => <option key={`sub-b-${k}`} value={k}>{k}</option>)}
//                             </select>
                            
//                             {/* TOOLTIP BANTUAN SUB-BEST */}
//                             {!catState.isBestLocked && <PenjelasanBWM type="best" />}
//                           </div>

//                           {catState.best && catState.isBestLocked && (
//                             <div style={styles.comparisonContainer}>
//                               <div style={styles.matrixArea}>
//                                 {subs.filter(k => k !== catState.best).map(subLain => (
//                                   <div key={`sub-b-row-${subLain}`} style={styles.comparisonRow}>
//                                     <div style={styles.comparisonTitle}><span style={styles.highlightOther}>{subLain}</span></div>
//                                     <div style={styles.scaleButtonGroup}>
//                                       {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
//                                         const isSelected = catState.skorBest[subLain] === num;
//                                         return (
//                                           <button key={`sub-b-btn-${num}`} type="button" onClick={() => handleSubSkorBestChange(kategori, subLain, num)}
//                                             style={{
//                                               ...styles.scaleBtn, backgroundColor: isSelected ? "#000" : "#fff", color: isSelected ? "#B3EBF2" : "#000"
//                                             }}
//                                           >{num}</button>
//                                         );
//                                       })}
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </div>

//                         {/* KOLOM KANAN SUB (WORST) */}
//                         <div style={styles.gridColumn}>
//                           <div style={styles.dropdownContainer}>
//                             <div style={styles.dropdownHeader}>
//                               <label style={styles.dropdownLabel}>Pilih Paling Bisa Diabaikan (👎):</label>
//                               {catState.isWorstLocked && (<button onClick={() => unlockSubWorst(kategori)} style={styles.btnUnlock}>Ubah</button>)}
//                             </div>
//                             <select 
//                               value={catState.worst} onChange={(e) => handleSubWorstChange(kategori, e.target.value)} disabled={catState.isWorstLocked || !catState.isBestLocked}
//                               style={{...styles.inputField, cursor: (catState.isWorstLocked || !catState.isBestLocked) ? "not-allowed" : "pointer", backgroundColor: (catState.isWorstLocked || !catState.isBestLocked) ? "#f1f5f9" : "#fff"}}
//                             >
//                               <option value="" disabled>{!catState.isBestLocked ? "Kunci pilihan kiri dahulu" : "-- Pilih Rincian --"}</option>
//                               {subs.filter(k => k !== catState.best).map(k => <option key={`sub-w-${k}`} value={k}>{k}</option>)}
//                             </select>
                            
//                             {/* TOOLTIP BANTUAN SUB-WORST */}
//                             {(!catState.isWorstLocked && catState.isBestLocked) && <PenjelasanBWM type="worst" />}
//                           </div>

//                           {catState.worst && catState.isWorstLocked && (
//                             <div style={styles.comparisonContainer}>
//                               <div style={styles.matrixArea}>
//                                 {subs.filter(k => k !== catState.worst).map(subLain => (
//                                   <div key={`sub-w-row-${subLain}`} style={styles.comparisonRow}>
//                                     <div style={styles.comparisonTitle}><span style={styles.highlightOther}>{subLain}</span></div>
//                                     <div style={styles.scaleButtonGroup}>
//                                       {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
//                                         const isSelected = catState.skorWorst[subLain] === num;
//                                         return (
//                                           <button key={`sub-w-btn-${num}`} type="button" onClick={() => handleSubSkorWorstChange(kategori, subLain, num)}
//                                             style={{
//                                               ...styles.scaleBtn, backgroundColor: isSelected ? "#000" : "#fff", color: isSelected ? "#fca5a5" : "#000"
//                                             }}
//                                           >{num}</button>
//                                         );
//                                       })}
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               <div style={{...styles.actionButtons, marginTop: "40px", flexDirection: "row", gap: "20px"}}>
//                 <button onClick={() => setTahap(1)} disabled={isSubmitting} style={{...styles.btnSecondary, flex: 1}}>
//                   &larr; Kembali Revisi
//                 </button>
//                 <button 
//                   onClick={handleSubmitData} 
//                   disabled={!isSubKriteriaSelesai || isSubmitting} 
//                   onMouseEnter={() => setHoverBtn('submit')}
//                   onMouseLeave={() => setHoverBtn(null)}
//                   style={{
//                     ...styles.btnSubmit, flex: 2, 
//                     opacity: (!isSubKriteriaSelesai || isSubmitting) ? 0.4 : 1, 
//                     cursor: (!isSubKriteriaSelesai || isSubmitting) ? "not-allowed" : "pointer",
//                     transform: hoverBtn === 'submit' && isSubKriteriaSelesai && !isSubmitting ? "translateY(-3px)" : "translateY(0)"
//                   }}
//                 >
//                   {isSubmitting ? "Menyimpan Ke Database..." : "Kirimkan Keputusan Saya ✅"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* TAHAP 3: LAYAR SUKSES & CEK HASIL */}
//         {tahap === 3 && (
//           <div style={styles.centerWrapper}>
//             <div style={{...styles.cardPremiumContainer, maxWidth: "700px", textAlign: "center", alignItems: "center"}}>
//               <div style={styles.successIconBox}>🎉</div>
//               <h3 style={styles.cardTitle}>Data Preferensi Terekam!</h3>
//               <p style={{...styles.cardDescCenter, margin: "15px 0 30px 0"}}>
//                 Terima kasih, <strong>{dataUser.namaAnggota}</strong>. Pendapat Anda telah tersimpan dengan aman di ruang <strong>{dataUser.kodeRuang}</strong>.
//               </p>
              
//               {/* KOTAK STATUS CEK HASIL */}
//               {statusCekHasil === "LOADING" && (
//                 <div style={styles.resultBox}>
//                   <div style={{fontSize: "2rem", animation: "spin 2s linear infinite"}}>🔄</div>
//                   <p style={{fontWeight: "bold", marginTop: "10px"}}>Sedang menghubungi server...</p>
//                 </div>
//               )}

//               {statusCekHasil === "EMPTY" && (
//                 <div style={styles.resultBoxWarning}>
//                   <div style={{fontSize: "2rem"}}>⏳</div>
//                   <p style={{fontWeight: "bold", marginTop: "10px", color: "#000"}}>Ketua Grup belum memfinalisasi hasil.</p>
//                   <p style={{fontSize: "0.9rem", color: "#333", marginTop: "5px"}}>Silakan hubungi ketua rombongan Anda untuk menyelesaikan kalkulasi di Portal Ketua, lalu coba cek lagi nanti.</p>
//                 </div>
//               )}

//               {statusCekHasil === "SUCCESS" && (
//                 <div style={styles.resultBoxSuccess}>
//                   <h4 style={{margin: "0 0 15px 0", fontSize: "1.3rem", fontWeight: "900", borderBottom: "2px solid #000", paddingBottom: "10px"}}>🏆 Keputusan Final Rombongan</h4>
//                   <table style={styles.tabelMcdm}>
//                     <tbody>
//                       {dataHasil.map((wisata, i) => (
//                         <tr key={i} style={{borderBottom: "1px solid rgba(0,0,0,0.1)"}}>
//                           <td style={{padding: "15px", fontWeight: "bold", textAlign: "left"}}>#{i+1} {wisata.nama_destinasi}</td>
//                           <td style={{padding: "15px", textAlign: "right", fontWeight: "900", color: "#059669"}}>{wisata.skor_akhir}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}

//               <div style={styles.actionButtonsCenter}>
//                 <button 
//                   onClick={handleCekHasil}
//                   onMouseEnter={() => setHoverBtn('cekHasil')}
//                   onMouseLeave={() => setHoverBtn(null)}
//                   style={{
//                     ...styles.btnCheckResult,
//                     transform: hoverBtn === 'cekHasil' ? "translateY(-2px)" : "translateY(0)"
//                   }}
//                 >
//                   Lihat Hasil Perangkingan 📊
//                 </button>

//                 <Link 
//                   href="/" 
//                   style={styles.btnExitOutline}
//                 >
//                   Kembali ke Beranda
//                 </Link>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>

//       {/* FOOTER */}
//       <footer style={styles.footer}>
//         <p style={styles.footerText}>&copy; 2026 Mlampah Jogja Decision Support System.</p>
//       </footer>
//     </div>
//   );
// }

// // === PREMIUM CLEAN OUTLINE (PASTEL BLUE GRADIENT) CSS ===
// const styles: { [key: string]: React.CSSProperties } = {
//   // CONTAINER UTAMA (ANTI-BUG HEADER MENGECIL)
//   pageContainer: { 
//     minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif", width: "100%", maxWidth: "100vw",
//     backgroundImage: `linear-gradient(to bottom right, rgba(138, 196, 246, 0.85), rgba(255, 255, 255, 0.95)), url('/bg-candi.jpg')`, 
//     backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed",
//     display: "flex", flexDirection: "column", overflowX: "hidden", margin: 0, padding: 0
//   },
  
//   // NAVBAR (ANTI-BUG LEBAR PENUH)
//   navbar: { width: "100%", boxSizing: "border-box", height: "85px", padding: "0 6%", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #000", backgroundColor: "#fff", position: "sticky", top: 0, left: 0, right: 0, zIndex: 100 },
//   navBrand: { display: "flex", alignItems: "center", gap: "15px" }, 
  
//   logoIcon: { position: "relative", width: "26px", height: "26px" },
//   logoLeaf1: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#0eec02", borderRadius: "2px 8px 2px 8px", top: 0, left: 0, border: "1px solid #000" },
//   logoLeaf2: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#005f08", borderRadius: "8px 2px 8px 2px", top: 0, right: 0, border: "1px solid #000" },
//   logoLeaf3: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#00c264", borderRadius: "8px 2px 8px 2px", bottom: 0, left: 0, border: "1px solid #000" },

//   brandTitle: { margin: 0, fontSize: "1.2rem", fontWeight: "900", color: "#000", letterSpacing: "0.5px", textTransform: "uppercase" }, 
//   brandSubtitle: { margin: 0, fontSize: "0.85rem", color: "#333", fontWeight: "600" },
//   userProfile: { display: "flex", alignItems: "center", gap: "20px" }, 
//   userInfo: { display: "flex", flexDirection: "column", alignItems: "flex-end" },
//   roomCodeBadge: { backgroundColor: "#B3EBF2", color: "#000", fontSize: "0.75rem", padding: "4px 10px", borderRadius: "8px", border: "2px solid #000", fontWeight: "900", marginBottom: "3px" },
//   profileName: { fontSize: "0.95rem", fontWeight: "700", color: "#000" }, 
//   logoutBtn: { fontSize: "0.9rem", color: "#000", textDecoration: "none", border: "2px solid #000", padding: "8px 18px", borderRadius: "10px", fontWeight: "bold", transition: "all 0.2s" },
  
//   mainContent: { padding: "40px 4%", width: "100%", maxWidth: "1600px", margin: "0 auto", boxSizing: "border-box" },
//   centerWrapper: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 180px)" },
  
//   cardPremiumContainer: { backgroundColor: "#fff", borderRadius: "24px", padding: "50px", width: "100%", border: "2px solid #000", display: "flex", flexDirection: "column", animation: "fadeIn 0.4s ease-out", boxSizing: "border-box" },
  
//   headerSection: { marginBottom: "30px", textAlign: "center" },
//   cardTitle: { margin: "0 0 10px 0", fontSize: "2.2rem", color: "#000", fontWeight: "900", fontFamily: "Georgia, serif" }, 
//   cardDescCenter: { margin: "0 auto", fontSize: "1.05rem", color: "#333", lineHeight: "1.6", maxWidth: "700px", fontWeight: "500" },
  
//   splitGrid: { display: "flex", gap: "40px", alignItems: "stretch" },
//   gridColumn: { flex: 1, display: "flex", flexDirection: "column", gap: "20px" },
//   columnHeader: { borderBottom: "2px solid", paddingBottom: "10px", marginBottom: "5px" },
//   columnTitle: { margin: 0, fontSize: "1rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px" },
  
//   stepIndicator: { display: "flex", alignItems: "center", width: "100%", marginBottom: "50px", justifyContent: "center" },
//   stepDotActive: { width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#000", color: "#B3EBF2", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "900", fontSize: "1rem", border: "2px solid #000" },
//   stepLabelActive: { color: "#000", fontSize: "0.9rem", fontWeight: "900", marginLeft: "12px", textTransform: "uppercase", letterSpacing: "1px" },
//   stepDotInactive: { width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#f8fafc", border: "2px solid #cbd5e1", color: "#64748b", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold", fontSize: "1rem" },
//   stepLabelInactive: { color: "#64748b", fontSize: "0.9rem", fontWeight: "700", marginLeft: "12px", textTransform: "uppercase", letterSpacing: "1px" },
//   stepDotSuccess: { width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#B3EBF2", color: "#000", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "900", fontSize: "1.2rem", border: "2px solid #000" },
//   stepLabelSuccess: { color: "#000", fontSize: "0.9rem", fontWeight: "900", marginLeft: "12px", textTransform: "uppercase", letterSpacing: "1px" },
//   stepLine: { flex: 1, maxWidth: "120px", height: "3px", backgroundColor: "#e2e8f0", margin: "0 20px" }, 
//   stepLineActive: { flex: 1, maxWidth: "120px", height: "3px", backgroundColor: "#000", margin: "0 20px" },
  
//   dropdownContainer: { width: "100%", padding: "20px", backgroundColor: "#f8fafc", borderRadius: "16px", border: "2px dashed #cbd5e1", display: "flex", flexDirection: "column", gap: "12px" },
//   dropdownHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
//   dropdownLabel: { color: "#000", fontSize: "0.95rem", fontWeight: "800" },
//   btnUnlock: { background: "#fff", border: "2px solid #000", color: "#000", padding: "4px 12px", borderRadius: "8px", fontSize: "0.8rem", cursor: "pointer", fontWeight: "800", transition: "all 0.2s" },
//   inputField: { padding: "16px", borderRadius: "12px", border: "2px solid #000", fontSize: "1rem", outline: "none", color: "#000", fontWeight: "700", transition: "all 0.2s", cursor: "pointer" },
  
//   comparisonContainer: { width: "100%", display: "flex", flexDirection: "column", gap: "15px", animation: "fadeIn 0.5s ease-out" },
//   infoBox: { padding: "15px", backgroundColor: "#f8fafc", borderRadius: "12px", borderLeft: "4px solid #000", fontSize: "0.95rem", color: "#000", fontWeight: "500", borderTop: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" },
//   matrixArea: { backgroundColor: "#fff", borderRadius: "16px", padding: "5px 0", border: "2px solid #e2e8f0" },
//   comparisonRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", borderBottom: "1px solid #f1f5f9" },
//   comparisonTitle: { display: "flex", alignItems: "center", gap: "10px", fontSize: "1.05rem", flex: 1 },
//   highlightOther: { color: "#000", fontWeight: "800" },
  
//   scaleButtonGroup: { display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" },
//   scaleBtn: { width: "35px", height: "35px", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", transition: "all 0.2s", fontSize: "0.95rem", border: "2px solid #cbd5e1" },
  
//   subCriteriaWrapper: { display: "flex", flexDirection: "column", gap: "40px", marginTop: "20px" },
//   categorySection: { backgroundColor: "#fff", borderRadius: "20px", border: "2px solid #000", overflow: "hidden" },
//   categoryTitle: { margin: "0", padding: "20px 30px", backgroundColor: "#f8fafc", color: "#000", fontSize: "1.2rem", fontWeight: "900", borderBottom: "2px solid #000", letterSpacing: "1px", textTransform: "uppercase" },
  
//   actionButtons: { display: "flex", flexDirection: "column", gap: "15px", marginTop: "40px", width: "100%" },
//   btnPrimary: { backgroundColor: "#000", color: "#B3EBF2", border: "2px solid #000", padding: "20px", borderRadius: "16px", fontSize: "1.1rem", fontWeight: "900", transition: "all 0.2s", textTransform: "uppercase", letterSpacing: "1px" },
//   btnSubmit: { padding: "20px", backgroundColor: "#B3EBF2", color: "#000", border: "2px solid #000", borderRadius: "16px", fontSize: "1.1rem", fontWeight: "900", transition: "all 0.2s", textTransform: "uppercase", letterSpacing: "1px" },
//   btnSecondary: { padding: "20px", backgroundColor: "#fff", color: "#000", border: "2px solid #000", borderRadius: "16px", fontSize: "1.1rem", fontWeight: "800", cursor: "pointer", transition: "all 0.2s" },
  
//   // TAHAP 3 (SUKSES & HASIL)
//   successIconBox: { width: "90px", height: "90px", borderRadius: "50%", backgroundColor: "#B3EBF2", border: "3px solid #000", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "25px", color: "#000", fontSize: "2.5rem" },
//   actionButtonsCenter: { display: "flex", gap: "20px", width: "100%", justifyContent: "center", marginTop: "30px", flexWrap: "wrap" },
//   btnCheckResult: { padding: "16px 30px", backgroundColor: "#000", color: "#B3EBF2", border: "2px solid #000", borderRadius: "12px", fontSize: "1.05rem", fontWeight: "900", cursor: "pointer", transition: "all 0.2s" },
//   btnExitOutline: { padding: "16px 30px", backgroundColor: "#fff", color: "#000", border: "2px solid #000", borderRadius: "12px", fontSize: "1.05rem", fontWeight: "800", cursor: "pointer", textDecoration: "none", transition: "all 0.2s" },
  
//   resultBox: { width: "100%", padding: "30px", backgroundColor: "#f8fafc", borderRadius: "16px", border: "2px dashed #cbd5e1", marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center" },
//   resultBoxWarning: { width: "100%", padding: "30px", backgroundColor: "#fef3c7", borderRadius: "16px", border: "2px dashed #d97706", marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center" },
//   resultBoxSuccess: { width: "100%", padding: "30px", backgroundColor: "#fff", borderRadius: "16px", border: "2px solid #000", marginTop: "20px", display: "flex", flexDirection: "column" },
//   tabelMcdm: { width: "100%", borderCollapse: "collapse" },

//   // FOOTER (ANTI-BUG LEBAR PENUH)
//   footer: { width: "100%", boxSizing: "border-box", borderTop: "2px solid #000", padding: "20px 6%", textAlign: "center", backgroundColor: "#fff", marginTop: "auto" },
//   footerText: { color: "#000", fontSize: "0.95rem", margin: 0, fontWeight: "700" }
// };

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 

// --- Komponen Panduan Utama ---
const PenjelasanBWM = ({ type }: { type: 'best' | 'worst' }) => (
  <div style={{
    fontSize: "0.85rem", color: "#000", marginTop: "12px", 
    backgroundColor: type === 'best' ? "#e0f2fe" : "#fee2e2",
    padding: "12px 15px", borderRadius: "10px", 
    border: `2px solid ${type === 'best' ? "#bae6fd" : "#fecaca"}`,
    lineHeight: "1.5"
  }}>
    {type === 'best' 
      ? <span><strong style={{fontSize: "0.95rem"}}>💡 CARA MENGISI (👍 PALING PENTING):</strong><br/>1. Pilih 1 hal yang <strong>paling jadi prioritasmu</strong>.<br/>2. Tentukan skala 1-9 di bawahnya. Semakin besar angkanya, berarti hal ini <strong>semakin mutlak pentingnya</strong> dibanding pilihan yang jadi lawannya.</span>
      : <span><strong style={{fontSize: "0.95rem"}}>💡 CARA MENGISI (👎 PALING BISA DIABAIKAN):</strong><br/>1. Pilih 1 hal yang <strong>paling nggak kamu pedulikan</strong>.<br/>2. Tentukan skala 1-9 di bawahnya. Semakin besar angkanya, berarti pilihan lawannya <strong>semakin jauh lebih penting</strong> daripada hal yang kamu abaikan ini.</span>}
  </div>
);

// --- Kamus Skala BWM Dinamis & Analogi (Lebih Merakyat) ---
const skalaPenjelasan: Record<number, {label: string, detail: string}> = {
  1: { label: "Setara / Sama Penting", detail: "Kedua hal ini sama-sama oke buatmu. Nggak ada yang lebih mendominasi." },
  2: { label: "Sedikit Condong (Nilai Tengah)", detail: "Nilai ragu-ragu di antara skala 1 dan 3. Agak condong dikit banget." },
  3: { label: "Agak Lebih Penting", detail: "Hal ini sedikit lebih kamu lirik/prioritaskan dibanding lawannya." },
  4: { label: "Mulai Terlihat Bedanya", detail: "Nilai ragu-ragu di antara skala 3 dan 5." },
  5: { label: "Jelas Lebih Penting", detail: "Perbedaannya jelas! Hal ini pasti kamu pilih duluan dibanding lawannya." },
  6: { label: "Sangat Menonjol", detail: "Nilai ragu-ragu di antara skala 5 dan 7." },
  7: { label: "Sangat Lebih Penting", detail: "Hal ini mendominasi pikiranmu. Lawannya hampir nggak kamu gubris." },
  8: { label: "Hampir Mutlak", detail: "Nilai ragu-ragu di antara skala 7 dan 9." },
  9: { label: "Harga Mati / Mutlak!", detail: "Nggak bisa diganggu gugat! Hal ini wajib ada, lawannya benar-benar nggak penting sama sekali." }
};

// Data master statis
const DAFTAR_KRITERIA_MASTER = ["Jenis Wisata", "Biaya", "Aksesibilitas", "Fasilitas", "Daya Tarik Wisata"];
const subKriteriaData: Record<string, string[]> = {
  "Jenis Wisata": ["Wisata Alam", "Wisata Budaya", "Wisata Historis", "Wisata Rekreasi"],
  "Biaya": ["Harga Paket Wisata", "Biaya Tambahan", "Kesesuaian Harga dengan Fasilitas"],
  "Aksesibilitas": ["Jarak Tempuh", "Kemudahan Transportasi"],
  "Fasilitas": ["Fasilitas Umum", "Area Parkir", "Keamanan Lokasi", "Kebersihan Lingkungan"],
  "Daya Tarik Wisata": ["Keindahan dan Keunikan Destinasi", "Aktivitas Wisata", "Spot Foto / Media Sosial"]
};

const mapOpsiKeKolomSQL: Record<string, string> = {
  "Wisata Alam": "alam", "Wisata Budaya": "budaya", "Wisata Historis": "historis", "Wisata Rekreasi": "rekreasi",
  "Harga Paket Wisata": "harga_paket_wisata", "Biaya Tambahan": "biaya_tambahan", "Kesesuaian Harga dengan Fasilitas": "kesesuaian_harga_dengan_fasilitas",
  "Jarak Tempuh": "jarak_tempuh", "Kemudahan Transportasi": "kemudahan_transportasi",
  "Fasilitas Umum": "fasilitas_umum", "Area Parkir": "area_parkir", "Keamanan Lokasi": "keamanan_lokasi", "Kebersihan Lingkungan": "kebersihan",
  "Keindahan dan Keunikan Destinasi": "keindahan_keunikan", "Aktivitas Wisata": "aktivitas_wisata", "Spot Foto / Media Sosial": "spot_foto"
};

type SubBWMState = {
  best: string; worst: string; isBestLocked: boolean; isWorstLocked: boolean;
  skorBest: Record<string, number>; skorWorst: Record<string, number>;
};

export default function KuesionerBWM() {
  const router = useRouter();

  const [dataUser, setDataUser] = useState({ namaAnggota: "", kodeRuang: "" });
  const [tahap, setTahap] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverBtn, setHoverBtn] = useState<string | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null); // State untuk Tip Interaktif
  
  const [statusCekHasil, setStatusCekHasil] = useState<"IDLE" | "LOADING" | "EMPTY" | "SUCCESS">("IDLE");
  const [dataHasil, setDataHasil] = useState<any[]>([]);

  const [daftarKriteriaAktif, setDaftarKriteriaAktif] = useState<string[]>(DAFTAR_KRITERIA_MASTER);

  const [bestKriteria, setBestKriteria] = useState("");
  const [isBestLocked, setIsBestLocked] = useState(false);
  const [skorBest, setSkorBest] = useState<Record<string, number>>({});

  const [worstKriteria, setWorstKriteria] = useState("");
  const [isWorstLocked, setIsWorstLocked] = useState(false);
  const [skorWorst, setSkorWorst] = useState<Record<string, number>>({});

  const [subBwm, setSubBwm] = useState<Record<string, SubBWMState>>(() => {
    const init: Record<string, SubBWMState> = {};
    Object.keys(subKriteriaData).forEach(kat => {
      init[kat] = { best: "", worst: "", isBestLocked: false, isWorstLocked: false, skorBest: {}, skorWorst: {} };
    });
    return init;
  });

  useEffect(() => {
    const savedData = localStorage.getItem("temp_anggota");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setDataUser(parsedData);
      
      const settingAdmin = localStorage.getItem(`kriteria_ruang_${parsedData.id_ruang}`);
      if (settingAdmin) {
        try {
          const kriteriaDariAdmin = JSON.parse(settingAdmin);
          const kriteriaYangBolehTampil = kriteriaDariAdmin.filter((k: any) => k.aktif === true).map((k: any) => k.nama);
          if (kriteriaYangBolehTampil.length > 0) setDaftarKriteriaAktif(kriteriaYangBolehTampil);
        } catch (e) { console.error(e); }
      }

      const statusSubmit = localStorage.getItem(`status_submit_${parsedData.kodeRuang}_${parsedData.namaAnggota}`);
      if (statusSubmit === "DONE") setTahap(3); 
    } else { router.push("/"); }
  }, [router]);

  const handleBestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setBestKriteria(selected);
    setIsBestLocked(true); 
    const initialScores: Record<string, number> = {};
    daftarKriteriaAktif.forEach(k => { if (k !== selected) initialScores[k] = 1; });
    setSkorBest(initialScores);
    if (worstKriteria === selected) { setWorstKriteria(""); setIsWorstLocked(false); }
  };
  const handleSkorBestChange = (kriteriaLain: string, nilai: number) => { setSkorBest(prev => ({ ...prev, [kriteriaLain]: nilai })); };

  const handleWorstChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setWorstKriteria(selected);
    setIsWorstLocked(true);
    const initialScores: Record<string, number> = {};
    daftarKriteriaAktif.forEach(k => { if (k !== selected) initialScores[k] = 1; });
    setSkorWorst(initialScores);
  };
  const handleSkorWorstChange = (kriteriaLain: string, nilai: number) => { setSkorWorst(prev => ({ ...prev, [kriteriaLain]: nilai })); };

  const isBwmUtamaValid = isBestLocked && isWorstLocked && (bestKriteria !== worstKriteria);

  const handleSubBestChange = (kategori: string, selected: string) => {
    setSubBwm(prev => {
      const catState = prev[kategori];
      const initialScores: Record<string, number> = {};
      subKriteriaData[kategori].forEach(k => { if(k !== selected) initialScores[k] = 1; });
      return { ...prev, [kategori]: { ...catState, best: selected, isBestLocked: true, skorBest: initialScores, worst: catState.worst === selected ? "" : catState.worst, isWorstLocked: catState.worst === selected ? false : catState.isWorstLocked } };
    });
  };
  const handleSubSkorBestChange = (kategori: string, subLain: string, nilai: number) => {
    setSubBwm(prev => ({ ...prev, [kategori]: { ...prev[kategori], skorBest: { ...prev[kategori].skorBest, [subLain]: nilai } } }));
  };

  const handleSubWorstChange = (kategori: string, selected: string) => {
    setSubBwm(prev => {
      const catState = prev[kategori];
      const initialScores: Record<string, number> = {};
      subKriteriaData[kategori].forEach(k => { if(k !== selected) initialScores[k] = 1; });
      return { ...prev, [kategori]: { ...catState, worst: selected, isWorstLocked: true, skorWorst: initialScores } };
    });
  };
  const handleSubSkorWorstChange = (kategori: string, subLain: string, nilai: number) => {
    setSubBwm(prev => ({ ...prev, [kategori]: { ...prev[kategori], skorWorst: { ...prev[kategori].skorWorst, [subLain]: nilai } } }));
  };

  const unlockSubBest = (kategori: string) => { setSubBwm(prev => ({...prev, [kategori]: {...prev[kategori], isBestLocked: false}})); };
  const unlockSubWorst = (kategori: string) => { setSubBwm(prev => ({...prev, [kategori]: {...prev[kategori], isWorstLocked: false}})); };

  const isSubKriteriaSelesai = daftarKriteriaAktif.every(cat => {
    const stateCat = subBwm[cat];
    return stateCat.isBestLocked && stateCat.isWorstLocked && stateCat.best !== stateCat.worst;
  });

  const handleSubmitData = async () => {
    setIsSubmitting(true);
    const roomCode = (dataUser.kodeRuang || "").trim().toUpperCase();
    const dbPromises = [];

    const bboMainPayload = {
      kode_ruang: roomCode, best_kriteria: bestKriteria,
      "jenis_wisata": bestKriteria === "Jenis Wisata" ? 1 : skorBest["Jenis Wisata"] || 1,
      "biaya": bestKriteria === "Biaya" ? 1 : skorBest["Biaya"] || 1,
      "aksesibilitas": bestKriteria === "Aksesibilitas" ? 1 : skorBest["Aksesibilitas"] || 1,
      "fasilitas": bestKriteria === "Fasilitas" ? 1 : skorBest["Fasilitas"] || 1,
      "daya_tarik": bestKriteria === "Daya Tarik Wisata" ? 1 : skorBest["Daya Tarik Wisata"] || 1,
    };

    const bowMainPayload = {
      kode_ruang: roomCode, worst_kriteria: worstKriteria,
      "jenis_wisata": worstKriteria === "Jenis Wisata" ? 1 : skorWorst["Jenis Wisata"] || 1,
      "biaya": worstKriteria === "Biaya" ? 1 : skorWorst["Biaya"] || 1,
      "aksesibilitas": worstKriteria === "Aksesibilitas" ? 1 : skorWorst["Aksesibilitas"] || 1,
      "fasilitas": worstKriteria === "Fasilitas" ? 1 : skorWorst["Fasilitas"] || 1,
      "daya_tarik": worstKriteria === "Daya Tarik Wisata" ? 1 : skorWorst["Daya Tarik Wisata"] || 1,
    };

    dbPromises.push(supabase.from('bbo_main').insert([bboMainPayload]));
    dbPromises.push(supabase.from('bow_main').insert([bowMainPayload]));

    const mapKategoriKeNamaTabel: Record<string, string> = { "Jenis Wisata": "jenis_wisata", "Biaya": "biaya", "Aksesibilitas": "aksesibilitas", "Fasilitas": "fasilitas", "Daya Tarik Wisata": "daya_tarik" };

    for (const kategori of daftarKriteriaAktif) {
      const stateBwm = subBwm[kategori];
      const suffixTabel = mapKategoriKeNamaTabel[kategori];
      const bboSubPayload: any = { kode_ruang: roomCode, best: stateBwm.best };
      const bowSubPayload: any = { kode_ruang: roomCode, worst: stateBwm.worst };

      subKriteriaData[kategori].forEach(subOpsi => {
        const namaKolomSQL = mapOpsiKeKolomSQL[subOpsi];
        bboSubPayload[namaKolomSQL] = stateBwm.best === subOpsi ? 1 : (stateBwm.skorBest[subOpsi] || 1);
        bowSubPayload[namaKolomSQL] = stateBwm.worst === subOpsi ? 1 : (stateBwm.skorWorst[subOpsi] || 1);
      });

      dbPromises.push(supabase.from(`bbo_${suffixTabel}`).insert([bboSubPayload]));
      dbPromises.push(supabase.from(`bow_${suffixTabel}`).insert([bowSubPayload]));
    }

    try {
      const results = await Promise.all(dbPromises);
      if (results.some(r => r.error)) throw new Error("Gagal kirim ke database");
      
      const existingDb = JSON.parse(localStorage.getItem("simulated_db_votes") || "[]");
      existingDb.push({ namaAnggota: dataUser.namaAnggota, kodeRuang: roomCode, timestamp: new Date().toISOString() });
      localStorage.setItem("simulated_db_votes", JSON.stringify(existingDb));
      localStorage.setItem(`status_submit_${roomCode}_${dataUser.namaAnggota}`, "DONE");
      window.dispatchEvent(new Event("storage"));
      
      setTahap(3); 
    } catch (e) {
      alert("Terjadi gangguan konektivitas jaringan.");
      setIsSubmitting(false);
    }
  };

  const handleCekHasil = async () => {
    setStatusCekHasil("LOADING");
    try {
      const { data } = await supabase.from('keputusan_final_grup').select('destinasi, skor_akhir').eq('kode_ruang', dataUser.kodeRuang).order('ranking_dipilih', { ascending: true });
      if (data && data.length > 0) {
        setDataHasil(data.map(item => ({ nama_destinasi: item.destinasi, skor_akhir: item.skor_akhir })));
        setStatusCekHasil("SUCCESS");
      } else setStatusCekHasil("EMPTY");
    } catch (err) { setStatusCekHasil("EMPTY"); }
  };

  return (
    <div style={styles.pageContainer}>
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>
          <div style={styles.logoIcon}>
            <div style={styles.logoLeaf1} />
            <div style={styles.logoLeaf2} />
            <div style={styles.logoLeaf3} />
          </div>
          <div>
            <h2 style={styles.brandTitle}>Instrumen Pilihan</h2>
            <p style={styles.brandSubtitle}>Mlampah Jogja DSS</p>
          </div>
        </div>
        
        <div style={styles.userProfile}>
          <div style={styles.userInfo}>
            <span style={styles.roomCodeBadge}>{dataUser.kodeRuang || "NON-ACTIVE"}</span>
            <span style={styles.profileName}>{dataUser.namaAnggota || "Anonim"}</span>
          </div>
          <Link 
            href="/" onMouseEnter={() => setHoverBtn('logout')} onMouseLeave={() => setHoverBtn(null)}
            style={{ ...styles.logoutBtn, backgroundColor: hoverBtn === 'logout' ? "#000" : "#fff", color: hoverBtn === 'logout' ? "#B3EBF2" : "#000", transform: hoverBtn === 'logout' ? "translateY(-2px)" : "translateY(0)" }}
          >Tutup Sesi</Link>
        </div>
      </nav>

      <main style={styles.mainContent}>
        
        {/* TAHAP 1: KRITERIA UTAMA */}
        {tahap === 1 && (
          <div style={styles.centerWrapper}>
            <div style={styles.cardPremiumContainer}>
              
              <div style={styles.stepIndicator}>
                <div style={styles.stepDotActive}>1</div>
                <div style={styles.stepLabelActive}>Kategori Utama</div>
                <div style={styles.stepLine}></div>
                <div style={styles.stepDotInactive}>2</div>
                <div style={styles.stepLabelInactive}>Detail Kategori</div>
              </div>
              
              <div style={{textAlign: "center", marginBottom: "40px"}}>
                <h3 style={styles.cardTitle}>Tentukan Kriteria Utama Liburan</h3>
                <p style={styles.cardDescCenter}>Analisis kebutuhan liburan Anda dengan memilih dan membandingkan kriteria di bawah ini.</p>
              </div>

              <div style={styles.splitGrid}>
                
                {/* --- KOLOM KIRI: BEST CRITERIA --- */}
                <div style={styles.gridColumn}>
                  <div style={{...styles.columnHeader, borderBottomColor: "#000"}}>
                    <h4 style={{...styles.columnTitle, color: "#000", backgroundColor: "#B3EBF2", padding: "8px 14px", borderRadius: "8px", border: "2px solid #000", display: "inline-block"}}>👍 PALING PENTING</h4>
                  </div>
                  
                  <div style={styles.dropdownContainer}>
                    <div style={styles.dropdownHeader}>
                      <label style={styles.dropdownLabel}>Pilih kategori yang paling utama:</label>
                      {isBestLocked && (<button onClick={() => setIsBestLocked(false)} style={styles.btnUnlock}>Ubah Pilihan</button>)}
                    </div>
                    <select 
                      value={bestKriteria} onChange={handleBestChange} disabled={isBestLocked}
                      style={{...styles.inputField, cursor: isBestLocked ? "not-allowed" : "pointer", backgroundColor: isBestLocked ? "#f1f5f9" : "#fff", opacity: isBestLocked ? 0.7 : 1}}
                    >
                      <option value="" disabled>-- Pilih Kategori Utama --</option>
                      {daftarKriteriaAktif.map(k => <option key={`b-${k}`} value={k}>{k}</option>)}
                    </select>
                    {!isBestLocked && <PenjelasanBWM type="best" />}
                  </div>

                  {bestKriteria && isBestLocked && (
                    <div style={styles.comparisonContainer}>
                      <div style={styles.infoBox}>Beri skala seberapa <strong>{bestKriteria}</strong> lebih penting dibanding:</div>
                      <div style={styles.matrixArea}>
                        {daftarKriteriaAktif.filter(k => k !== bestKriteria).map(kriteriaLain => {
                          const currentVal = skorBest[kriteriaLain] || 1;
                          const tipId = `b-tip-${kriteriaLain}`;
                          return (
                            <div key={`b-row-${kriteriaLain}`} style={styles.comparisonRow}>
                              <div style={styles.comparisonTitle}><span style={styles.highlightOther}>{kriteriaLain}</span></div>
                              <div style={styles.scaleButtonGroupContainer}>
                                <div style={styles.scaleButtonGroup}>
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                                    const isSelected = currentVal === num;
                                    return (
                                      <button key={`b-btn-${num}`} type="button" onClick={() => handleSkorBestChange(kriteriaLain, num)}
                                        style={{ ...styles.scaleBtn, backgroundColor: isSelected ? "#000" : "#fff", color: isSelected ? "#B3EBF2" : "#000", fontWeight: isSelected ? "900" : "600", transform: isSelected ? "scale(1.1)" : "scale(1)" }}
                                      >{num}</button>
                                    );
                                  })}
                                </div>
                                <div style={styles.dynamicTextWrapper}>
                                  <span style={styles.dynamicTextBest}>{skalaPenjelasan[currentVal].label}</span>
                                  <div 
                                  
                                    style={styles.iconTipInteraktif}
                                    onMouseEnter={() => setActiveTooltip(tipId)}
                                    onMouseLeave={() => setActiveTooltip(null)}
                                  >
                                    {/* Ganti "logo-tip.png" dengan nama file logomu yang ada di folder public */}
                                     <img 
                                     src="/logo-tip.png" 
                                      alt="Info Tip" 
                                      style={{ width: "20px", height: "20px", objectFit: "contain", verticalAlign: "middle" }} 
                                      />

                                    {activeTooltip === tipId && (
                                      <div style={styles.tooltipBox}>
                                        {skalaPenjelasan[currentVal].detail}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* --- KOLOM KANAN: WORST CRITERIA --- */}
                <div style={styles.gridColumn}>
                  <div style={{...styles.columnHeader, borderBottomColor: "#000"}}>
                    <h4 style={{...styles.columnTitle, color: "#000", backgroundColor: "#fecaca", padding: "8px 14px", borderRadius: "8px", border: "2px solid #000", display: "inline-block"}}>👎 PALING BISA DIABAIKAN</h4>
                  </div>
                  
                  <div style={styles.dropdownContainer}>
                    <div style={styles.dropdownHeader}>
                      <label style={styles.dropdownLabel}>Pilih kategori yang paling tidak dipedulikan:</label>
                      {isWorstLocked && (<button onClick={() => setIsWorstLocked(false)} style={styles.btnUnlock}>Ubah Pilihan</button>)}
                    </div>
                    <select 
                      value={worstKriteria} onChange={handleWorstChange} disabled={isWorstLocked || !isBestLocked}
                      style={{...styles.inputField, cursor: (isWorstLocked || !isBestLocked) ? "not-allowed" : "pointer", backgroundColor: (isWorstLocked || !isBestLocked) ? "#f1f5f9" : "#fff", opacity: (isWorstLocked || !isBestLocked) ? 0.7 : 1}}
                    >
                      <option value="" disabled>{!isBestLocked ? "Kunci pilihan 'Paling Penting' dahulu" : "-- Pilih Kategori Terakhir --"}</option>
                      {daftarKriteriaAktif.filter(k => k !== bestKriteria).map(k => <option key={`w-${k}`} value={k}>{k}</option>)}
                    </select>
                    {(!isWorstLocked && isBestLocked) && <PenjelasanBWM type="worst" />}
                  </div>

                  {worstKriteria && isWorstLocked && (
                    <div style={styles.comparisonContainer}>
                      <div style={styles.infoBox}>Beri skala seberapa kategori lainnya lebih penting dibanding <strong>{worstKriteria}</strong>:</div>
                      <div style={styles.matrixArea}>
                        {daftarKriteriaAktif.filter(k => k !== worstKriteria).map(kriteriaLain => {
                          const currentVal = skorWorst[kriteriaLain] || 1;
                          const tipId = `w-tip-${kriteriaLain}`;
                          return (
                            <div key={`w-row-${kriteriaLain}`} style={styles.comparisonRow}>
                              <div style={styles.comparisonTitle}><span style={styles.highlightOther}>{kriteriaLain}</span></div>
                              <div style={styles.scaleButtonGroupContainer}>
                                <div style={styles.scaleButtonGroup}>
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                                    const isSelected = currentVal === num;
                                    return (
                                      <button key={`w-btn-${num}`} type="button" onClick={() => handleSkorWorstChange(kriteriaLain, num)}
                                        style={{ ...styles.scaleBtn, backgroundColor: isSelected ? "#000" : "#fff", color: isSelected ? "#fca5a5" : "#000", fontWeight: isSelected ? "900" : "600", transform: isSelected ? "scale(1.1)" : "scale(1)", borderColor: isSelected ? "#000" : "#cbd5e1" }}
                                      >{num}</button>
                                    );
                                  })}
                                </div>
                                <div style={styles.dynamicTextWrapper}>
                                  <span style={styles.dynamicTextWorst}>{skalaPenjelasan[currentVal].label}</span>
                                  <div 
                                    style={styles.iconTipInteraktif}
                                    onMouseEnter={() => setActiveTooltip(tipId)}
                                    onMouseLeave={() => setActiveTooltip(null)}
                                  >
                                    {/* Ganti "logo-tip.png" dengan nama file logomu yang ada di folder public */}
                                    <img 
                                    src="/logo-tip.png" 
                                    alt="Info Tip" 
                                    style={{ width: "20px", height: "20px", objectFit: "contain", verticalAlign: "middle" }} 
                                    />
                                    {activeTooltip === tipId && (
                                      <div style={styles.tooltipBox}>
                                        {skalaPenjelasan[currentVal].detail}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              <div style={styles.actionButtons}>
                <button 
                  onClick={() => setTahap(2)} disabled={!isBwmUtamaValid} onMouseEnter={() => setHoverBtn('next1')} onMouseLeave={() => setHoverBtn(null)}
                  style={{ ...styles.btnPrimary, opacity: isBwmUtamaValid ? 1 : 0.4, cursor: isBwmUtamaValid ? "pointer" : "not-allowed", transform: hoverBtn === 'next1' && isBwmUtamaValid ? "translateY(-3px)" : "translateY(0)" }}
                >
                  Lanjut ke Detail Kategori &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAHAP 2: EVALUASI SUB-KRITERIA */}
        {tahap === 2 && (
          <div style={styles.centerWrapper}>
            <div style={styles.cardPremiumContainer}>
              <div style={styles.stepIndicator}>
                <div style={styles.stepDotSuccess}>&#10003;</div><div style={styles.stepLabelSuccess}>Kategori Utama</div><div style={styles.stepLineActive}></div>
                <div style={styles.stepDotActive}>2</div><div style={styles.stepLabelActive}>Detail Kategori</div>
              </div>
              <div style={styles.headerSection}>
                <h3 style={styles.cardTitle}>Evaluasi Detail Kategori Wisata</h3>
                <p style={styles.cardDescCenter}>Terapkan pola pemilihan yang sama untuk setiap rincian dari kategori wisata di bawah ini.</p>
              </div>
              
              <div style={styles.subCriteriaWrapper}>
                {daftarKriteriaAktif.map((kategori) => {
                  const subs = subKriteriaData[kategori];
                  const catState = subBwm[kategori];
                  
                  return (
                    <div key={kategori} style={styles.categorySection}>
                      <h4 style={styles.categoryTitle}>{kategori}</h4>
                      <div style={{...styles.splitGrid, padding: "25px"}}>
                        {/* KOLOM KIRI SUB (BEST) */}
                        <div style={styles.gridColumn}>
                          <div style={styles.dropdownContainer}>
                            <div style={styles.dropdownHeader}>
                              <label style={styles.dropdownLabel}>Pilih Paling Penting (👍):</label>
                              {catState.isBestLocked && (<button onClick={() => unlockSubBest(kategori)} style={styles.btnUnlock}>Ubah</button>)}
                            </div>
                            <select 
                              value={catState.best} onChange={(e) => handleSubBestChange(kategori, e.target.value)} disabled={catState.isBestLocked}
                              style={{...styles.inputField, cursor: catState.isBestLocked ? "not-allowed" : "pointer", backgroundColor: catState.isBestLocked ? "#f1f5f9" : "#fff"}}
                            >
                              <option value="" disabled>-- Pilih Rincian --</option>
                              {subs.map(k => <option key={`sub-b-${k}`} value={k}>{k}</option>)}
                            </select>
                            {!catState.isBestLocked && <PenjelasanBWM type="best" />}
                          </div>

                          {catState.best && catState.isBestLocked && (
                            <div style={styles.comparisonContainer}>
                              <div style={styles.matrixArea}>
                                {subs.filter(k => k !== catState.best).map(subLain => {
                                  const currentVal = catState.skorBest[subLain] || 1;
                                  const tipId = `sub-b-tip-${kategori}-${subLain}`;
                                  return (
                                    <div key={`sub-b-row-${subLain}`} style={styles.comparisonRow}>
                                      <div style={styles.comparisonTitle}><span style={styles.highlightOther}>{subLain}</span></div>
                                      <div style={styles.scaleButtonGroupContainer}>
                                        <div style={styles.scaleButtonGroup}>
                                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                                            const isSelected = currentVal === num;
                                            return (
                                              <button key={`sub-b-btn-${num}`} type="button" onClick={() => handleSubSkorBestChange(kategori, subLain, num)}
                                                style={{ ...styles.scaleBtn, backgroundColor: isSelected ? "#000" : "#fff", color: isSelected ? "#B3EBF2" : "#000" }}
                                              >{num}</button>
                                            );
                                          })}
                                        </div>
                                        <div style={styles.dynamicTextWrapper}>
                                          <span style={styles.dynamicTextBest}>{skalaPenjelasan[currentVal].label}</span>
                                          <div 
                                            style={styles.iconTipInteraktif}
                                            onMouseEnter={() => setActiveTooltip(tipId)}
                                            onMouseLeave={() => setActiveTooltip(null)}
                                          >
                                          {/* Ganti "logo-tip.png" dengan nama file logomu yang ada di folder public */}
                                           <img 
                                           src="/logo-tip.png" 
                                           alt="Info Tip" 
                                           style={{ width: "20px", height: "20px", objectFit: "contain", verticalAlign: "middle" }} 
                                           />
                                            {activeTooltip === tipId && (
                                              <div style={styles.tooltipBox}>
                                                {skalaPenjelasan[currentVal].detail}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* KOLOM KANAN SUB (WORST) */}
                        <div style={styles.gridColumn}>
                          <div style={styles.dropdownContainer}>
                            <div style={styles.dropdownHeader}>
                              <label style={styles.dropdownLabel}>Pilih Paling Bisa Diabaikan (👎):</label>
                              {catState.isWorstLocked && (<button onClick={() => unlockSubWorst(kategori)} style={styles.btnUnlock}>Ubah</button>)}
                            </div>
                            <select 
                              value={catState.worst} onChange={(e) => handleSubWorstChange(kategori, e.target.value)} disabled={catState.isWorstLocked || !catState.isBestLocked}
                              style={{...styles.inputField, cursor: (catState.isWorstLocked || !catState.isBestLocked) ? "not-allowed" : "pointer", backgroundColor: (catState.isWorstLocked || !catState.isBestLocked) ? "#f1f5f9" : "#fff"}}
                            >
                              <option value="" disabled>{!catState.isBestLocked ? "Kunci pilihan kiri dahulu" : "-- Pilih Rincian --"}</option>
                              {subs.filter(k => k !== catState.best).map(k => <option key={`sub-w-${k}`} value={k}>{k}</option>)}
                            </select>
                            {(!catState.isWorstLocked && catState.isBestLocked) && <PenjelasanBWM type="worst" />}
                          </div>

                          {catState.worst && catState.isWorstLocked && (
                            <div style={styles.comparisonContainer}>
                              <div style={styles.matrixArea}>
                                {subs.filter(k => k !== catState.worst).map(subLain => {
                                  const currentVal = catState.skorWorst[subLain] || 1;
                                  const tipId = `sub-w-tip-${kategori}-${subLain}`;
                                  return (
                                    <div key={`sub-w-row-${subLain}`} style={styles.comparisonRow}>
                                      <div style={styles.comparisonTitle}><span style={styles.highlightOther}>{subLain}</span></div>
                                      <div style={styles.scaleButtonGroupContainer}>
                                        <div style={styles.scaleButtonGroup}>
                                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                                            const isSelected = currentVal === num;
                                            return (
                                              <button key={`sub-w-btn-${num}`} type="button" onClick={() => handleSubSkorWorstChange(kategori, subLain, num)}
                                                style={{ ...styles.scaleBtn, backgroundColor: isSelected ? "#000" : "#fff", color: isSelected ? "#fca5a5" : "#000" }}
                                              >{num}</button>
                                            );
                                          })}
                                        </div>
                                        <div style={styles.dynamicTextWrapper}>
                                          <span style={styles.dynamicTextWorst}>{skalaPenjelasan[currentVal].label}</span>
                                          <div 
                                            style={styles.iconTipInteraktif}
                                            onMouseEnter={() => setActiveTooltip(tipId)}
                                            onMouseLeave={() => setActiveTooltip(null)}
                                          >
                                            {/* Ganti "logo-tip.png" dengan nama file logomu yang ada di folder public */}
                                            <img 
                                            src="/logo-tip.png" 
                                            alt="Info Tip" 
                                            style={{ width: "20px", height: "20px", objectFit: "contain", verticalAlign: "middle" }} 
                                            />
                                            {activeTooltip === tipId && (
                                              <div style={styles.tooltipBox}>
                                                {skalaPenjelasan[currentVal].detail}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{...styles.actionButtons, marginTop: "40px", flexDirection: "row", gap: "20px"}}>
                <button onClick={() => setTahap(1)} disabled={isSubmitting} style={{...styles.btnSecondary, flex: 1}}>
                  &larr; Kembali Revisi
                </button>
                <button 
                  onClick={handleSubmitData} disabled={!isSubKriteriaSelesai || isSubmitting} onMouseEnter={() => setHoverBtn('submit')} onMouseLeave={() => setHoverBtn(null)}
                  style={{ ...styles.btnSubmit, flex: 2, opacity: (!isSubKriteriaSelesai || isSubmitting) ? 0.4 : 1, cursor: (!isSubKriteriaSelesai || isSubmitting) ? "not-allowed" : "pointer", transform: hoverBtn === 'submit' && isSubKriteriaSelesai && !isSubmitting ? "translateY(-3px)" : "translateY(0)" }}
                >
                  {isSubmitting ? "Menyimpan Ke Database..." : "Kirimkan Keputusan Saya ✅"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAHAP 3: LAYAR SUKSES & CEK HASIL */}
        {tahap === 3 && (
          <div style={styles.centerWrapper}>
            <div style={{...styles.cardPremiumContainer, maxWidth: "700px", textAlign: "center", alignItems: "center"}}>
              <div style={styles.successIconBox}>🎉</div>
              <h3 style={styles.cardTitle}>Data Preferensi Terekam!</h3>
              <p style={{...styles.cardDescCenter, margin: "15px 0 30px 0"}}>
                Terima kasih, <strong>{dataUser.namaAnggota}</strong>. Pendapat Anda telah tersimpan dengan aman di ruang <strong>{dataUser.kodeRuang}</strong>.
              </p>
              
              {statusCekHasil === "LOADING" && (
                <div style={styles.resultBox}>
                  <div style={{fontSize: "2rem", animation: "spin 2s linear infinite"}}>🔄</div>
                  <p style={{fontWeight: "bold", marginTop: "10px"}}>Sedang menghubungi server...</p>
                </div>
              )}

              {statusCekHasil === "EMPTY" && (
                <div style={styles.resultBoxWarning}>
                  <div style={{fontSize: "2rem"}}>⏳</div>
                  <p style={{fontWeight: "bold", marginTop: "10px", color: "#000"}}>Ketua Grup belum memfinalisasi hasil.</p>
                  <p style={{fontSize: "0.9rem", color: "#333", marginTop: "5px"}}>Silakan hubungi ketua rombongan Anda untuk menyelesaikan kalkulasi di Portal Ketua, lalu coba cek lagi nanti.</p>
                </div>
              )}

              {statusCekHasil === "SUCCESS" && (
                <div style={styles.resultBoxSuccess}>
                  <h4 style={{margin: "0 0 15px 0", fontSize: "1.3rem", fontWeight: "900", borderBottom: "2px solid #000", paddingBottom: "10px"}}>🏆 Keputusan Final Rombongan</h4>
                  <table style={styles.tabelMcdm}>
                    <tbody>
                      {dataHasil.map((wisata, i) => (
                        <tr key={i} style={{borderBottom: "1px solid rgba(0,0,0,0.1)"}}>
                          <td style={{padding: "15px", fontWeight: "bold", textAlign: "left"}}>#{i+1} {wisata.nama_destinasi}</td>
                          <td style={{padding: "15px", textAlign: "right", fontWeight: "900", color: "#059669"}}>{wisata.skor_akhir}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div style={styles.actionButtonsCenter}>
                <button 
                  onClick={handleCekHasil} onMouseEnter={() => setHoverBtn('cekHasil')} onMouseLeave={() => setHoverBtn(null)}
                  style={{ ...styles.btnCheckResult, transform: hoverBtn === 'cekHasil' ? "translateY(-2px)" : "translateY(0)" }}
                >Lihat Hasil Perangkingan 📊</button>
                <Link href="/" style={styles.btnExitOutline}>Kembali ke Beranda</Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <footer style={styles.footer}><p style={styles.footerText}>&copy; 2026 Mlampah Jogja Decision Support System.</p></footer>
    </div>
  );
}

// === PREMIUM CLEAN OUTLINE CSS ===
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: { 
    minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif", width: "100%", maxWidth: "100vw",
    backgroundImage: `linear-gradient(to bottom right, rgba(138, 196, 246, 0.85), rgba(255, 255, 255, 0.95)), url('/bg-candi.jpg')`, 
    backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", display: "flex", flexDirection: "column", overflowX: "hidden", margin: 0, padding: 0
  },
  
  navbar: { width: "100%", boxSizing: "border-box", height: "85px", padding: "0 6%", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #000", backgroundColor: "#fff", position: "sticky", top: 0, left: 0, right: 0, zIndex: 100 },
  navBrand: { display: "flex", alignItems: "center", gap: "15px" }, 
  logoIcon: { position: "relative", width: "26px", height: "26px" },
  logoLeaf1: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#0eec02", borderRadius: "2px 8px 2px 8px", top: 0, left: 0, border: "1px solid #000" },
  logoLeaf2: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#005f08", borderRadius: "8px 2px 8px 2px", top: 0, right: 0, border: "1px solid #000" },
  logoLeaf3: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#00c264", borderRadius: "8px 2px 8px 2px", bottom: 0, left: 0, border: "1px solid #000" },
  brandTitle: { margin: 0, fontSize: "1.2rem", fontWeight: "900", color: "#000", letterSpacing: "0.5px", textTransform: "uppercase" }, 
  brandSubtitle: { margin: 0, fontSize: "0.85rem", color: "#333", fontWeight: "600" },
  userProfile: { display: "flex", alignItems: "center", gap: "20px" }, 
  userInfo: { display: "flex", flexDirection: "column", alignItems: "flex-end" },
  roomCodeBadge: { backgroundColor: "#B3EBF2", color: "#000", fontSize: "0.75rem", padding: "4px 10px", borderRadius: "8px", border: "2px solid #000", fontWeight: "900", marginBottom: "3px" },
  profileName: { fontSize: "0.95rem", fontWeight: "700", color: "#000" }, 
  logoutBtn: { fontSize: "0.9rem", color: "#000", textDecoration: "none", border: "2px solid #000", padding: "8px 18px", borderRadius: "10px", fontWeight: "bold", transition: "all 0.2s" },
  
  mainContent: { padding: "40px 4%", width: "100%", maxWidth: "1600px", margin: "0 auto", boxSizing: "border-box" },
  centerWrapper: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 180px)" },
  
  cardPremiumContainer: { backgroundColor: "#fff", borderRadius: "24px", padding: "50px", width: "100%", border: "2px solid #000", display: "flex", flexDirection: "column", animation: "fadeIn 0.4s ease-out", boxSizing: "border-box" },
  
  headerSection: { marginBottom: "30px", textAlign: "center" },
  cardTitle: { margin: "0 0 10px 0", fontSize: "2.2rem", color: "#000", fontWeight: "900", fontFamily: "Georgia, serif" }, 
  cardDescCenter: { margin: "0 auto", fontSize: "1.05rem", color: "#333", lineHeight: "1.6", maxWidth: "700px", fontWeight: "500" },
  
  splitGrid: { display: "flex", gap: "40px", alignItems: "stretch" },
  gridColumn: { flex: 1, display: "flex", flexDirection: "column", gap: "20px" },
  columnHeader: { borderBottom: "2px solid", paddingBottom: "10px", marginBottom: "5px" },
  columnTitle: { margin: 0, fontSize: "1rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px" },
  
  stepIndicator: { display: "flex", alignItems: "center", width: "100%", marginBottom: "50px", justifyContent: "center" },
  stepDotActive: { width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#000", color: "#B3EBF2", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "900", fontSize: "1rem", border: "2px solid #000" },
  stepLabelActive: { color: "#000", fontSize: "0.9rem", fontWeight: "900", marginLeft: "12px", textTransform: "uppercase", letterSpacing: "1px" },
  stepDotInactive: { width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#f8fafc", border: "2px solid #cbd5e1", color: "#64748b", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold", fontSize: "1rem" },
  stepLabelInactive: { color: "#64748b", fontSize: "0.9rem", fontWeight: "700", marginLeft: "12px", textTransform: "uppercase", letterSpacing: "1px" },
  stepDotSuccess: { width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#B3EBF2", color: "#000", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "900", fontSize: "1.2rem", border: "2px solid #000" },
  stepLabelSuccess: { color: "#000", fontSize: "0.9rem", fontWeight: "900", marginLeft: "12px", textTransform: "uppercase", letterSpacing: "1px" },
  stepLine: { flex: 1, maxWidth: "120px", height: "3px", backgroundColor: "#e2e8f0", margin: "0 20px" }, 
  stepLineActive: { flex: 1, maxWidth: "120px", height: "3px", backgroundColor: "#000", margin: "0 20px" },
  
  dropdownContainer: { width: "100%", padding: "20px", backgroundColor: "#f8fafc", borderRadius: "16px", border: "2px dashed #cbd5e1", display: "flex", flexDirection: "column", gap: "12px" },
  dropdownHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  dropdownLabel: { color: "#000", fontSize: "0.95rem", fontWeight: "800" },
  btnUnlock: { background: "#fff", border: "2px solid #000", color: "#000", padding: "4px 12px", borderRadius: "8px", fontSize: "0.8rem", cursor: "pointer", fontWeight: "800", transition: "all 0.2s" },
  inputField: { padding: "16px", borderRadius: "12px", border: "2px solid #000", fontSize: "1rem", outline: "none", color: "#000", fontWeight: "700", transition: "all 0.2s", cursor: "pointer" },
  
  comparisonContainer: { width: "100%", display: "flex", flexDirection: "column", gap: "15px", animation: "fadeIn 0.5s ease-out" },
  infoBox: { padding: "15px", backgroundColor: "#f8fafc", borderRadius: "12px", borderLeft: "4px solid #000", fontSize: "0.95rem", color: "#000", fontWeight: "500", borderTop: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" },
  matrixArea: { backgroundColor: "#fff", borderRadius: "16px", padding: "5px 0", border: "2px solid #e2e8f0" },
  comparisonRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", borderBottom: "1px solid #f1f5f9" },
  comparisonTitle: { display: "flex", alignItems: "center", gap: "10px", fontSize: "1.05rem", flex: 1 },
  highlightOther: { color: "#000", fontWeight: "800" },
  
  // WRAPPER BARU UNTUK TIP INTERAKTIF 
  scaleButtonGroupContainer: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" },
  scaleButtonGroup: { display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" },
  scaleBtn: { width: "35px", height: "35px", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", transition: "all 0.2s", fontSize: "0.95rem", border: "2px solid #cbd5e1" },
  
  dynamicTextWrapper: { display: "flex", alignItems: "center", gap: "6px", position: "relative" },
  dynamicTextBest: { fontSize: "0.85rem", color: "#0284c7", fontWeight: "800", textTransform: "uppercase" },
  dynamicTextWorst: { fontSize: "0.85rem", color: "#e11d48", fontWeight: "800", textTransform: "uppercase" },
  
  // DESAIN TIP POP-UP
  iconTipInteraktif: { cursor: "pointer", fontSize: "1rem", position: "relative" },
  tooltipBox: { 
    position: "absolute", bottom: "130%", right: "0", width: "240px", 
    backgroundColor: "#000", color: "#fff", padding: "12px 15px", 
    borderRadius: "10px", fontSize: "0.85rem", fontWeight: "500", 
    lineHeight: "1.4", zIndex: 100, textTransform: "none", letterSpacing: "normal",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
  },

  subCriteriaWrapper: { display: "flex", flexDirection: "column", gap: "40px", marginTop: "20px" },
  categorySection: { backgroundColor: "#fff", borderRadius: "20px", border: "2px solid #000", overflow: "hidden" },
  categoryTitle: { margin: "0", padding: "20px 30px", backgroundColor: "#f8fafc", color: "#000", fontSize: "1.2rem", fontWeight: "900", borderBottom: "2px solid #000", letterSpacing: "1px", textTransform: "uppercase" },
  
  actionButtons: { display: "flex", flexDirection: "column", gap: "15px", marginTop: "40px", width: "100%" },
  btnPrimary: { backgroundColor: "#000", color: "#B3EBF2", border: "2px solid #000", padding: "20px", borderRadius: "16px", fontSize: "1.1rem", fontWeight: "900", transition: "all 0.2s", textTransform: "uppercase", letterSpacing: "1px" },
  btnSubmit: { padding: "20px", backgroundColor: "#B3EBF2", color: "#000", border: "2px solid #000", borderRadius: "16px", fontSize: "1.1rem", fontWeight: "900", transition: "all 0.2s", textTransform: "uppercase", letterSpacing: "1px" },
  btnSecondary: { padding: "20px", backgroundColor: "#fff", color: "#000", border: "2px solid #000", borderRadius: "16px", fontSize: "1.1rem", fontWeight: "800", cursor: "pointer", transition: "all 0.2s" },
  
  // TAHAP 3 (SUKSES & HASIL)
  successIconBox: { width: "90px", height: "90px", borderRadius: "50%", backgroundColor: "#B3EBF2", border: "3px solid #000", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "25px", color: "#000", fontSize: "2.5rem" },
  actionButtonsCenter: { display: "flex", gap: "20px", width: "100%", justifyContent: "center", marginTop: "30px", flexWrap: "wrap" },
  btnCheckResult: { padding: "16px 30px", backgroundColor: "#000", color: "#B3EBF2", border: "2px solid #000", borderRadius: "12px", fontSize: "1.05rem", fontWeight: "900", cursor: "pointer", transition: "all 0.2s" },
  btnExitOutline: { padding: "16px 30px", backgroundColor: "#fff", color: "#000", border: "2px solid #000", borderRadius: "12px", fontSize: "1.05rem", fontWeight: "800", cursor: "pointer", textDecoration: "none", transition: "all 0.2s" },
  
  resultBox: { width: "100%", padding: "30px", backgroundColor: "#f8fafc", borderRadius: "16px", border: "2px dashed #cbd5e1", marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center" },
  resultBoxWarning: { width: "100%", padding: "30px", backgroundColor: "#fef3c7", borderRadius: "16px", border: "2px dashed #d97706", marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center" },
  resultBoxSuccess: { width: "100%", padding: "30px", backgroundColor: "#fff", borderRadius: "16px", border: "2px solid #000", marginTop: "20px", display: "flex", flexDirection: "column" },
  tabelMcdm: { width: "100%", borderCollapse: "collapse" },

  // FOOTER
  footer: { width: "100%", boxSizing: "border-box", borderTop: "2px solid #000", padding: "20px 6%", textAlign: "center", backgroundColor: "#fff", marginTop: "auto" },
  footerText: { color: "#000", fontSize: "0.95rem", margin: 0, fontWeight: "700" }
};