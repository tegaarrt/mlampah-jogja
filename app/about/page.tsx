// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase"; // Pastikan path ini sesuai dengan file supabase kamu

// // === TEMPAT WISATA POPULER (DENGAN URL GAMBAR LOKAL) ===
// const wisataPopulerMaster = [
//   { id: 1, nama: "HeHa Sky View", kategori: "Wisata Alam & Spot Foto", img: "/wisata/heha.jpg", imgFallback: "linear-gradient(135deg, #1e3a8a, #3b82f6)", deskripsi: "Destinasi wisata kekinian dengan pemandangan kota Jogja dari ketinggian, dilengkapi restoran dan spot foto ikonik." },
//   { id: 2, nama: "Obelix Hills", kategori: "Wisata Rekreasi", img: "/wisata/obelix.jpg", imgFallback: "linear-gradient(135deg, #7c2d12, #ea580c)", deskripsi: "Tempat nongkrong asik di atas bukit batu purba dengan pemandangan sunset terbaik dan puluhan spot foto instagramable." },
//   { id: 3, nama: "Candi Prambanan", kategori: "Wisata Sejarah", img: "/wisata/prambanan.jpg", imgFallback: "linear-gradient(135deg, #064e3b, #10b981)", deskripsi: "Kompleks candi Hindu terbesar di Indonesia yang dibangun pada abad ke-9 Masehi, menawarkan kemegahan arsitektur kuno." },
//   { id: 4, nama: "Pantai Mesra", kategori: "Wisata Alam", img: "/wisata/mesra.jpg", imgFallback: "linear-gradient(135deg, #0f766e, #06b6d4)", deskripsi: "Pantai pasir putih yang bersih dengan taman rumput hijau dan bangku-bangku taman estetik di pinggir tebing." },
//   { id: 5, nama: "Jalan Malioboro", kategori: "Pusat Belanja & Budaya", img: "/wisata/malioboro.jpg", imgFallback: "linear-gradient(135deg, #4c1d95, #8b5cf6)", deskripsi: "Jantung kota Yogyakarta. Pusat perbelanjaan, kuliner, dan budaya yang tak pernah sepi dari wisatawan." },
//   { id: 6, nama: "Tebing Breksi", kategori: "Wisata Alam & Spot Foto", img: "/wisata/breksi.jpg", imgFallback: "linear-gradient(135deg, #9f1239, #f43f5e)", deskripsi: "Bekas tambang batu kapur yang disulap menjadi taman tebing berukir megah, sangat cocok untuk fotografi dan menikmati sunset." },
//   { id: 7, nama: "Pantai Parangtritis", kategori: "Wisata Alam & Spot Foto", img: "/wisata/parangtritis.jpg", imgFallback: "linear-gradient(135deg, #b47f8e, #623038)", deskripsi: "Pantai paling legendaris di Jogja, terkenal dengan ombak besarnya, gumuk pasir, dan penyewaan ATV serta bendi." }
// ];

// export default function AboutPage() {
//   const router = useRouter();
  
//   // === STATE AUTO-SLIDER STATISTIK ===
//   const [statSlide, setStatSlide] = useState(0);
//   const totalStatSlides = 3;

//   // === STATE UNTUK DATA WISATA & MODAL DETAIL ===
//   const [wisataData, setWisataData] = useState<any[]>(wisataPopulerMaster.map(w => ({ ...w, jumlah_dilihat: 0 })));
//   const [selectedWisata, setSelectedWisata] = useState<any>(null);

//   // 1. AUTO-SLIDE STATISTIK
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setStatSlide((prev) => (prev + 1) % totalStatSlides);
//     }, 4000); 
//     return () => clearInterval(timer);
//   }, []);

//   // 2. MENGAMBIL TOTAL TAYANGAN (VIEWS) DARI SUPABASE SAAT HALAMAN DIBUKA
//   useEffect(() => {
//     const fetchViews = async () => {
//       try {
//         // Asumsi: Kamu sudah membuat kolom 'jumlah_dilihat' di tabel 'nilai_kriteria'
//         const { data, error } = await supabase.from('nilai_kriteria').select('destinasi_wisata, jumlah_dilihat');
        
//         if (!error && data) {
//           // Sinkronisasi data dari Supabase dengan kartu wisata di layar
//           setWisataData(prevData => prevData.map(wisata => {
//             const wisataDiDb = data.find((db: any) => db.destinasi_wisata === wisata.nama);
//             return {
//               ...wisata,
//               jumlah_dilihat: wisataDiDb?.jumlah_dilihat || 0
//             };
//           }));
//         }
//       } catch (err) {
//         console.error("Gagal menarik data tayangan:", err);
//       }
//     };

//     fetchViews();
//   }, []);

//   // 3. FUNGSI KLIK KARTU & TAMBAH TAYANGAN (ANTI-SPAM)
//   const handleBukaDetail = async (wisata: any) => {
//     setSelectedWisata(wisata); // Buka Modal

//     const kunciDilihat = `sudah_lihat_${wisata.id}`;
//     const sudahPernahLihat = localStorage.getItem(kunciDilihat);

//     // Jika belum pernah diklik oleh perangkat ini
//     if (!sudahPernahLihat) {
//       const viewBaru = wisata.jumlah_dilihat + 1;

//       // Update angka di layar secara instan biar UI terasa cepat (Optimistic UI)
//       setWisataData(prev => prev.map(w => w.id === wisata.id ? { ...w, jumlah_dilihat: viewBaru } : w));
//       setSelectedWisata((prev: any) => ({ ...prev, jumlah_dilihat: viewBaru }));
      
//       // Tandai di browser pengguna
//       localStorage.setItem(kunciDilihat, 'true');

//       // Kirim penambahan ke Supabase secara diam-diam (Background task)
//       try {
//         await supabase
//           .from('nilai_kriteria')
//           .update({ jumlah_dilihat: viewBaru })
//           .eq('destinasi_wisata', wisata.nama);
//       } catch (e) {
//         console.error("Gagal update tayangan ke database:", e);
//       }
//     }
//   };

//   return (
//     <div style={styles.pageContainer}>
      
//       {/* NAVBAR */}
//       <nav style={styles.navbar}>
//         <div style={styles.logo} onClick={() => router.push('/')}>
//           <div style={styles.logoIcon}>
//             <div style={styles.logoLeaf1} />
//             <div style={styles.logoLeaf2} />
//             <div style={styles.logoLeaf3} />
//           </div>
//           JogjaTrip
//         </div>
        
//         <div style={styles.navRightActions}>
//           <div style={{...styles.menuItem, color: "#bef264"}}>About</div>
//           <div style={styles.menuItem} onClick={() => router.push('/')}>Home</div>
//           <button onClick={() => window.open('/panduan', '_blank')} style={styles.btnNavOutline}>
//             Panduan
//           </button>
//         </div>
//       </nav>

//       {/* KONTEN UTAMA */}
//       <main style={styles.mainContent}>
        
//         {/* === HERO SECTION === */}
//         <section style={styles.aboutHeroSection}>
//           <div style={styles.textContainer}>
//             <div style={styles.badge}>TENTANG JOGJATRIP</div>
//             <h1 style={styles.mainTitle}>Satu Aplikasi untuk Keputusan Liburan Rombongan.</h1>
//             <p style={styles.description}>
//               Pernahkah Anda merasa pusing saat merencanakan liburan bersama teman kelas, rekan kerja, atau keluarga besar? Menyatukan banyak kepala dan keinginan yang berbeda-beda seringkali berujung pada perdebatan panjang.
//             </p>
//             <p style={styles.description}>
//               <strong>JogjaTrip hadir sebagai solusi cerdas.</strong> Aplikasi ini membantu rombongan Anda memilih tujuan wisata di Yogyakarta secara adil. Setiap anggota cukup memilih preferensi mereka, dan algoritma matematis kami akan menghitung rekomendasi destinasi yang paling memuaskan semua pihak. Tidak ada lagi perdebatan, cukup voting dan berangkat!
//             </p>
//           </div>

//           <div style={styles.graphicContainer}>
//             <div style={styles.statsSliderWrapper}>
              
//               <div style={{...styles.statSlide, opacity: statSlide === 0 ? 1 : 0, zIndex: statSlide === 0 ? 2 : 1}}>
//                 <div style={styles.statHeader}>
//                   <h4 style={styles.statTitle}>Tren Wisatawan D.I. Yogyakarta</h4>
//                   <p style={styles.statSubtitle}>Data Kunjungan (Juta Orang) 5 Tahun Terakhir</p>
//                 </div>
//                 <div style={styles.chartContainer}>
//                   <div style={styles.barColumn}><span style={styles.barValue}>6.1</span><div style={{...styles.barFill, height: "70%", backgroundColor: "rgba(255,255,255,0.2)"}}></div><span style={styles.barLabel}>'19</span></div>
//                   <div style={styles.barColumn}><span style={styles.barValue}>2.3</span><div style={{...styles.barFill, height: "25%", backgroundColor: "rgba(255,255,255,0.2)"}}></div><span style={styles.barLabel}>'20</span></div>
//                   <div style={styles.barColumn}><span style={styles.barValue}>4.5</span><div style={{...styles.barFill, height: "50%", backgroundColor: "rgba(255,255,255,0.2)"}}></div><span style={styles.barLabel}>'21</span></div>
//                   <div style={styles.barColumn}><span style={styles.barValue}>7.2</span><div style={{...styles.barFill, height: "80%", backgroundColor: "rgba(255,255,255,0.2)"}}></div><span style={styles.barLabel}>'22</span></div>
//                   <div style={styles.barColumn}><span style={{...styles.barValue, color: "#bef264", fontWeight: "bold"}}>8.9</span><div style={{...styles.barFill, height: "100%", backgroundColor: "#bef264", boxShadow: "0 0 15px rgba(190, 242, 100, 0.4)"}}></div><span style={{...styles.barLabel, color: "#fff", fontWeight: "bold"}}>'23</span></div>
//                 </div>
//               </div>

//               <div style={{...styles.statSlide, opacity: statSlide === 1 ? 1 : 0, zIndex: statSlide === 1 ? 2 : 1}}>
//                 <div style={styles.statHeaderCentered}>
//                   <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="#bef264" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom: "20px"}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
//                   <h4 style={styles.statTitle}>Akurasi Rekomendasi Destinasi</h4>
//                   <p style={styles.statSubtitle}>Konsensus Rombongan via TOPSIS & BWM</p>
//                 </div>
//                 <div style={styles.bigNumberContainer}>
//                   <span style={styles.bigNumber}>94</span><span style={styles.percentSymbol}>%</span>
//                 </div>
//                 <p style={{textAlign: "center", color: "#94a3b8", fontSize: "0.95rem", margin: 0, padding: "0 20px"}}>
//                   Rombongan menyatakan sangat puas dengan destinasi akhir yang dipilih secara matematis oleh sistem kami.
//                 </p>
//               </div>

//               <div style={{...styles.statSlide, opacity: statSlide === 2 ? 1 : 0, zIndex: statSlide === 2 ? 2 : 1}}>
//                 <div style={styles.statHeader}>
//                   <h4 style={styles.statTitle}>Efisiensi Waktu Diskusi</h4>
//                   <p style={styles.statSubtitle}>Rata-rata waktu untuk mencapai kesepakatan</p>
//                 </div>
//                 <div style={styles.comparisonContainer}>
//                   <div style={styles.compareBox}><span style={styles.compareLabel}>Manual (Grup Chat)</span><span style={styles.compareBadValue}>&plusmn; 5 Hari</span></div>
//                   <div style={styles.compareArrow}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></div>
//                   <div style={{...styles.compareBox, backgroundColor: "rgba(132, 204, 22, 0.1)", borderColor: "rgba(132, 204, 22, 0.3)"}}><span style={{...styles.compareLabel, color: "#bef264"}}>Via JogjaTrip DSS</span><span style={styles.compareGoodValue}>15 Menit</span></div>
//                 </div>
//                 <p style={{textAlign: "left", color: "#94a3b8", fontSize: "0.95rem", margin: "25px 0 0 0"}}>Sistem komputasi kami merangkum ratusan preferensi kriteria dalam hitungan detik.</p>
//               </div>

//               <div style={styles.sliderDots}>
//                 {[0, 1, 2].map((idx) => (<div key={idx} style={{...styles.dot, width: statSlide === idx ? "25px" : "8px", backgroundColor: statSlide === idx ? "#bef264" : "rgba(255,255,255,0.2)"}} />))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* === BAGIAN SLIDER DESTINASI POPULER === */}
//         <section style={styles.sliderSection}>
//           <div style={styles.sliderHeader}>
//             <h2 style={styles.sectionTitle}>Informasi Tempat Wisata</h2>
//             <p style={styles.sectionSubtitle}>*Jelajahi dan klik untuk detail</p>
//           </div>

//           <div style={styles.horizontalScrollContainer}>
//             {wisataData.map((wisata) => (
//               <div 
//                 key={wisata.id} 
//                 onClick={() => handleBukaDetail(wisata)}
//                 style={{
//                   ...styles.wisataCard,
//                   backgroundImage: `url('${wisata.img}'), ${wisata.imgFallback}`,
//                   backgroundSize: "cover",
//                   backgroundPosition: "center"
//                 }}
//               >
//                 {/* Badge Tayangan (Mata) di Pojok Kanan Atas */}
//                 <div style={styles.viewBadge}>
//                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
//                   {wisata.jumlah_dilihat}
//                 </div>

//                 <div style={styles.cardOverlay}>
//                   <span style={styles.kategoriBadge}>{wisata.kategori}</span>
//                   <h3 style={styles.wisataName}>{wisata.nama}</h3>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//       </main>

//       {/* FOOTER */}
//       <footer style={styles.footer}>
//         <p style={styles.footerText}>&copy; 2026 JogjaTrip Decision Support System.</p>
//       </footer>

//       {/* === MODAL POP-UP DETAIL WISATA === */}
//       {selectedWisata && (
//         <div style={styles.modalBackdrop} onClick={() => setSelectedWisata(null)}>
//           <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
//             <button style={styles.closeButton} onClick={() => setSelectedWisata(null)}>✕</button>
            
//             <div style={{
//               ...styles.modalImageHero,
//               backgroundImage: `url('${selectedWisata.img}'), ${selectedWisata.imgFallback}`,
//             }}>
//               <div style={styles.modalViewBadge}>
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
//                 {selectedWisata.jumlah_dilihat} Tayangan
//               </div>
//             </div>

//             <div style={styles.modalBody}>
//               <span style={styles.kategoriBadge}>{selectedWisata.kategori}</span>
//               <h2 style={{color: "#fff", fontSize: "2rem", margin: "10px 0 15px 0", fontFamily: "Georgia, serif"}}>{selectedWisata.nama}</h2>
//               <p style={{color: "#cbd5e1", lineHeight: 1.7, fontSize: "1.05rem"}}>
//                 {selectedWisata.deskripsi}
//               </p>
              
//               <div style={{marginTop: "30px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.1)"}}>
//                 <button onClick={() => setSelectedWisata(null)} style={{width: "100%", padding: "14px", backgroundColor: "#bef264", color: "#0f1115", borderRadius: "12px", fontSize: "1rem", fontWeight: "bold", border: "none", cursor: "pointer"}}>
//                   Tutup Detail
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // === PREMIUM CSS IN JS ===
// const styles: { [key: string]: React.CSSProperties } = {
//   pageContainer: { minHeight: "100vh", backgroundColor: "#0f1115", fontFamily: "system-ui, -apple-system, sans-serif", backgroundImage: `radial-gradient(circle at top left, rgba(132, 204, 22, 0.05), transparent 40%)`, display: "flex", flexDirection: "column" },
//   navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "35px 8%", width: "100%", zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.05)" },
//   logo: { display: "flex", alignItems: "center", gap: "12px", fontSize: "1.6rem", fontWeight: "700", color: "#fff", letterSpacing: "0.5px", cursor: "pointer" },
//   logoIcon: { position: "relative", width: "30px", height: "30px" },
//   logoLeaf1: { position: "absolute", width: "14px", height: "14px", backgroundColor: "#bef264", borderRadius: "2px 10px 2px 10px", top: 0, left: 0 },
//   logoLeaf2: { position: "absolute", width: "14px", height: "14px", backgroundColor: "#84cc16", borderRadius: "10px 2px 10px 2px", top: 0, right: 0 },
//   logoLeaf3: { position: "absolute", width: "14px", height: "14px", backgroundColor: "#a3e635", borderRadius: "10px 2px 10px 2px", bottom: 0, left: 0 },
//   navRightActions: { display: "flex", alignItems: "center", gap: "15px" },
//   menuItem: { cursor: "pointer", fontSize: "0.95rem", color: "#fff", fontWeight: "600", padding: "10px 15px", marginRight: "10px", transition: "color 0.2s ease" },
//   btnNavOutline: { padding: "10px 24px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.4)", backgroundColor: "transparent", color: "#fff", cursor: "pointer", fontSize: "0.95rem", fontWeight: "600", backdropFilter: "blur(5px)", transition: "all 0.3s ease" },

//   mainContent: { flex: 1, padding: "80px 8%", display: "flex", flexDirection: "column", gap: "120px" },
//   aboutHeroSection: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "60px", width: "100%" },
//   textContainer: { flex: "1", maxWidth: "600px", display: "flex", flexDirection: "column", alignItems: "flex-start" },
//   badge: { backgroundColor: "rgba(132, 204, 22, 0.1)", color: "#bef264", padding: "8px 18px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "700", letterSpacing: "1px", marginBottom: "25px" },
//   mainTitle: { fontSize: "3.2rem", fontFamily: "Georgia, serif", fontWeight: 600, lineHeight: 1.2, margin: "0 0 30px 0", color: "#fff", textAlign: "left" },
//   description: { fontSize: "1.15rem", lineHeight: 1.8, color: "#94a3b8", margin: "0 0 20px 0", textAlign: "justify" },

//   graphicContainer: { flex: "1", display: "flex", justifyContent: "center", alignItems: "flex-start", marginTop: "10px" },
//   statsSliderWrapper: { width: "100%", maxWidth: "550px", height: "450px", position: "relative", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)", padding: "40px", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" },
//   statSlide: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", padding: "40px", transition: "opacity 0.8s ease-in-out", display: "flex", flexDirection: "column", justifyContent: "center" },
//   statHeader: { marginBottom: "30px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "15px" },
//   statHeaderCentered: { marginBottom: "20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" },
//   statTitle: { color: "#fff", margin: "0 0 8px 0", fontSize: "1.4rem", fontWeight: "700" },
//   statSubtitle: { color: "#64748b", margin: 0, fontSize: "0.95rem" },

//   chartContainer: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "200px", padding: "0 10px" },
//   barColumn: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", width: "45px", height: "100%", justifyContent: "flex-end" },
//   barValue: { color: "#cbd5e1", fontSize: "0.9rem" },
//   barFill: { width: "100%", borderRadius: "6px 6px 0 0", transition: "height 1s ease" },
//   barLabel: { color: "#64748b", fontSize: "0.9rem", marginTop: "5px" },

//   bigNumberContainer: { display: "flex", justifyContent: "center", alignItems: "flex-start", marginBottom: "20px" },
//   bigNumber: { fontSize: "7rem", fontWeight: "800", color: "#fff", lineHeight: "1", fontFamily: "Georgia, serif" },
//   percentSymbol: { fontSize: "3rem", fontWeight: "700", color: "#bef264", marginTop: "10px" },

//   comparisonContainer: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "15px" },
//   compareBox: { flex: 1, backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "30px 15px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" },
//   compareLabel: { color: "#64748b", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" },
//   compareBadValue: { color: "#fff", fontSize: "1.6rem", fontWeight: "700", textDecoration: "line-through", opacity: 0.5 },
//   compareGoodValue: { color: "#bef264", fontSize: "2.2rem", fontWeight: "800" },
//   compareArrow: { padding: "0 15px" },

//   sliderDots: { position: "absolute", bottom: "30px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", zIndex: 10 },
//   dot: { height: "6px", borderRadius: "3px", transition: "all 0.4s ease" },

//   sliderSection: { width: "100%", display: "flex", flexDirection: "column", gap: "30px" },
//   sliderHeader: { display: "flex", flexDirection: "column", gap: "5px" },
//   sectionTitle: { fontSize: "1.8rem", color: "#fff", margin: 0, fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" },
//   sectionSubtitle: { fontSize: "1rem", color: "#84cc16", margin: 0, fontStyle: "italic" },

//   horizontalScrollContainer: { display: "flex", gap: "25px", overflowX: "auto", paddingBottom: "30px", scrollSnapType: "x mandatory", scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" },
  
//   wisataCard: { flex: "0 0 300px", height: "380px", borderRadius: "20px", position: "relative", overflow: "hidden", scrollSnapAlign: "start", boxShadow: "0 15px 30px rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)", transition: "transform 0.3s ease", cursor: "pointer" },
  
//   viewBadge: { position: "absolute", top: "15px", right: "15px", backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", color: "#fff", padding: "6px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px", zIndex: 10, border: "1px solid rgba(255,255,255,0.1)" },
  
//   cardOverlay: { position: "absolute", bottom: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "30px 25px", background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.1) 70%, transparent 100%)" },
//   kategoriBadge: { backgroundColor: "rgba(132, 204, 22, 0.2)", backdropFilter: "blur(5px)", color: "#bef264", border: "1px solid rgba(132, 204, 22, 0.3)", padding: "6px 12px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: "600", marginBottom: "10px", width: "fit-content" },
//   wisataName: { fontSize: "1.5rem", color: "#fff", margin: 0, fontFamily: "Georgia, serif", fontWeight: "bold", textShadow: "0px 2px 6px rgba(0,0,0,0.9)" },

//   footer: { borderTop: "1px solid rgba(255,255,255,0.05)", padding: "30px 8%", textAlign: "center", marginTop: "auto" },
//   footerText: { color: "#64748b", fontSize: "0.9rem", margin: 0 },

//   // === STYLE MODAL ===
//   modalBackdrop: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, padding: "20px" },
//   modalContent: { backgroundColor: "#1e293b", width: "100%", maxWidth: "500px", borderRadius: "24px", overflow: "hidden", position: "relative", boxShadow: "0 25px 50px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", animation: "fadeIn 0.3s ease-out" },
//   closeButton: { position: "absolute", top: "15px", right: "15px", width: "35px", height: "35px", borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.5)", color: "#fff", border: "none", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.2rem", cursor: "pointer", zIndex: 10, backdropFilter: "blur(4px)" },
//   modalImageHero: { width: "100%", height: "250px", backgroundSize: "cover", backgroundPosition: "center", position: "relative" },
//   modalViewBadge: { position: "absolute", bottom: "15px", right: "15px", backgroundColor: "rgba(0,0,0,0.7)", color: "#fff", padding: "8px 12px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px", backdropFilter: "blur(4px)" },
//   modalBody: { padding: "30px" }
// };

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 

// === TEMPAT WISATA POPULER (DENGAN URL GAMBAR LOKAL) ===
const wisataPopulerMaster = [
  { id: 1, nama: "HeHa Sky View", kategori: "Wisata Alam & Spot Foto", img: "/wisata/heha.jpg", imgFallback: "linear-gradient(135deg, #1e3a8a, #3b82f6)", deskripsi: "Destinasi wisata kekinian dengan pemandangan kota Jogja dari ketinggian, dilengkapi restoran dan spot foto ikonik." },
  { id: 2, nama: "Obelix Hills", kategori: "Wisata Rekreasi", img: "/wisata/obelix.jpg", imgFallback: "linear-gradient(135deg, #7c2d12, #ea580c)", deskripsi: "Tempat nongkrong asik di atas bukit batu purba dengan pemandangan sunset terbaik dan puluhan spot foto instagramable." },
  { id: 3, nama: "Candi Prambanan", kategori: "Wisata Sejarah", img: "/wisata/prambanan.jpg", imgFallback: "linear-gradient(135deg, #064e3b, #10b981)", deskripsi: "Kompleks candi Hindu terbesar di Indonesia yang dibangun pada abad ke-9 Masehi, menawarkan kemegahan arsitektur kuno." },
  { id: 4, nama: "Pantai Mesra", kategori: "Wisata Alam", img: "/wisata/mesra.jpg", imgFallback: "linear-gradient(135deg, #0f766e, #06b6d4)", deskripsi: "Pantai pasir putih yang bersih dengan taman rumput hijau dan bangku-bangku taman estetik di pinggir tebing." },
  { id: 5, nama: "Jalan Malioboro", kategori: "Pusat Belanja & Budaya", img: "/wisata/malioboro.jpg", imgFallback: "linear-gradient(135deg, #4c1d95, #8b5cf6)", deskripsi: "Jantung kota Yogyakarta. Pusat perbelanjaan, kuliner, dan budaya yang tak pernah sepi dari wisatawan." },
  { id: 6, nama: "Tebing Breksi", kategori: "Wisata Alam & Spot Foto", img: "/wisata/breksi.jpg", imgFallback: "linear-gradient(135deg, #9f1239, #f43f5e)", deskripsi: "Bekas tambang batu kapur yang disulap menjadi taman tebing berukir megah, sangat cocok untuk fotografi dan menikmati sunset." },
  { id: 7, nama: "Pantai Parangtritis", kategori: "Wisata Alam & Spot Foto", img: "/wisata/parangtritis.jpg", imgFallback: "linear-gradient(135deg, #b47f8e, #623038)", deskripsi: "Pantai paling legendaris di Jogja, terkenal dengan ombak besarnya, gumuk pasir, dan penyewaan ATV serta bendi." }
];

export default function AboutPage() {
  const router = useRouter();
  
  // === STATE AUTO-SLIDER STATISTIK ===
  const [statSlide, setStatSlide] = useState(0);
  const totalStatSlides = 3;

  // === STATE INTERAKTIF (HOVER) ===
  const [hoverNav, setHoverNav] = useState<string | null>(null);
  const [hoverCard, setHoverCard] = useState<number | null>(null);
  const [hoverBtn, setHoverBtn] = useState<string | null>(null);

  // === STATE UNTUK DATA WISATA & MODAL DETAIL ===
  const [wisataData, setWisataData] = useState<any[]>(wisataPopulerMaster.map(w => ({ ...w, jumlah_dilihat: 0 })));
  const [selectedWisata, setSelectedWisata] = useState<any>(null);

  // 1. AUTO-SLIDE STATISTIK
  useEffect(() => {
    const timer = setInterval(() => {
      setStatSlide((prev) => (prev + 1) % totalStatSlides);
    }, 4000); 
    return () => clearInterval(timer);
  }, []);

  // 2. MENGAMBIL TOTAL TAYANGAN (VIEWS) DARI SUPABASE
  useEffect(() => {
    const fetchViews = async () => {
      try {
        const { data, error } = await supabase.from('nilai_kriteria').select('destinasi, jumlah_dilihat');
        
        if (!error && data) {
          setWisataData(prevData => prevData.map(wisata => {
            const wisataDiDb = data.find((db: any) => db.destinasi === wisata.nama);
            return {
              ...wisata,
              jumlah_dilihat: wisataDiDb?.jumlah_dilihat || 0
            };
          }));
        }
      } catch (err) {
        console.error("Gagal menarik data tayangan:", err);
      }
    };
    fetchViews();
  }, []);

  // 3. FUNGSI KLIK KARTU & TAMBAH TAYANGAN
  const handleBukaDetail = async (wisata: any) => {
    setSelectedWisata(wisata); 

    const kunciDilihat = `sudah_lihat_${wisata.id}`;
    const sudahPernahLihat = localStorage.getItem(kunciDilihat);

    if (!sudahPernahLihat) {
      const viewBaru = wisata.jumlah_dilihat + 1;

      setWisataData(prev => prev.map(w => w.id === wisata.id ? { ...w, jumlah_dilihat: viewBaru } : w));
      setSelectedWisata((prev: any) => ({ ...prev, jumlah_dilihat: viewBaru }));
      
      localStorage.setItem(kunciDilihat, 'true');

      try {
        await supabase
          .from('nilai_kriteria')
          .update({ jumlah_dilihat: viewBaru })
          .eq('destinasi', wisata.nama);
      } catch (e) {
        console.error("Gagal update tayangan ke database:", e);
      }
    }
  };

  return (
    <div style={styles.pageContainer}>
      
      {/* NAVBAR LIGHT CLEAN OUTLINE */}
      <nav style={styles.navbar}>
        <div 
          style={{...styles.logo, transform: hoverNav === "logo" ? "scale(1.02)" : "scale(1)"}}
          onClick={() => router.push('/')}
          onMouseEnter={() => setHoverNav("logo")}
          onMouseLeave={() => setHoverNav(null)}
        >
          <div style={styles.logoIcon}>
            <div style={styles.logoLeaf1} />
            <div style={styles.logoLeaf2} />
            <div style={styles.logoLeaf3} />
          </div>
          Mlampah Jogja
        </div>
        
        {/* REVISI: Hanya Tombol Home */}
        <div style={styles.navRightActions}>
          <button 
            style={{
              ...styles.btnNavOutline,
              backgroundColor: hoverNav === "home" ? "#000" : "#fff",
              color: hoverNav === "home" ? "#bef264" : "#000",
              transform: hoverNav === "home" ? "translateY(-2px)" : "translateY(0)"
            }} 
            onClick={() => router.push('/')}
            onMouseEnter={() => setHoverNav("home")}
            onMouseLeave={() => setHoverNav(null)}
          >
            ⬅ Kembali ke Home
          </button>
        </div>
      </nav>

      {/* KONTEN UTAMA */}
      <main style={styles.mainContent}>
        
        {/* === HERO SECTION === */}
        <section style={styles.aboutHeroSection}>
          <div style={styles.textContainer}>
            <div style={styles.badge}>TENTANG MLAMPAH JOGJA</div>
            <h1 style={styles.mainTitle}>Website untuk Keputusan Liburan Bersama di Jogja.</h1>
            <p style={styles.description}>
              Pernahkah Anda merasa pusing saat merencanakan liburan bersama teman kelas, rekan kerja, atau keluarga besar? Menyatukan banyak kepala dan keinginan yang berbeda-beda seringkali berujung pada perdebatan panjang.
            </p>
            <p style={styles.description}>
              <strong>Mlampah Jogja hadir sebagai solusi cerdas.</strong> Aplikasi ini membantu rombongan Anda memilih tujuan wisata di Yogyakarta secara adil. Setiap anggota cukup memilih preferensi mereka, dan algoritma matematis kami akan menghitung rekomendasi destinasi yang paling memuaskan semua pihak. Tidak ada lagi perdebatan, cukup voting dan berangkat!
            </p>
          </div>

          {/* SLIDER STATISTIK (CLEAN BOX TANPA SHADOW) */}
          <div style={styles.graphicContainer}>
            <div style={styles.statsSliderWrapper}>
              
              <div style={{...styles.statSlide, opacity: statSlide === 0 ? 1 : 0, zIndex: statSlide === 0 ? 2 : 1}}>
                <div style={styles.statHeader}>
                  <h4 style={styles.statTitle}>Tren Wisatawan D.I. Yogyakarta</h4>
                  <p style={styles.statSubtitle}>Data Kunjungan (Juta Orang) 5 Tahun Terakhir</p>
                </div>
                <div style={styles.chartContainer}>
                  <div style={styles.barColumn}><span style={styles.barValue}>6.1</span><div style={{...styles.barFill, height: "70%", backgroundColor: "#e2e8f0"}}></div><span style={styles.barLabel}>'19</span></div>
                  <div style={styles.barColumn}><span style={styles.barValue}>2.3</span><div style={{...styles.barFill, height: "25%", backgroundColor: "#e2e8f0"}}></div><span style={styles.barLabel}>'20</span></div>
                  <div style={styles.barColumn}><span style={styles.barValue}>4.5</span><div style={{...styles.barFill, height: "50%", backgroundColor: "#e2e8f0"}}></div><span style={styles.barLabel}>'21</span></div>
                  <div style={styles.barColumn}><span style={styles.barValue}>7.2</span><div style={{...styles.barFill, height: "80%", backgroundColor: "#e2e8f0"}}></div><span style={styles.barLabel}>'22</span></div>
                  <div style={styles.barColumn}><span style={{...styles.barValue, color: "#000", fontWeight: "900"}}>8.9</span><div style={{...styles.barFill, height: "100%", backgroundColor: "#bef264", border: "2px solid #000"}}></div><span style={{...styles.barLabel, color: "#000", fontWeight: "900"}}>'23</span></div>
                </div>
              </div>

              <div style={{...styles.statSlide, opacity: statSlide === 1 ? 1 : 0, zIndex: statSlide === 1 ? 2 : 1}}>
                <div style={styles.statHeaderCentered}>
                  <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom: "20px", backgroundColor: "#bef264", padding: "8px", borderRadius: "12px", border: "2px solid #000"}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  <h4 style={styles.statTitle}>Akurasi Rekomendasi Destinasi</h4>
                  <p style={styles.statSubtitle}>Konsensus Rombongan via TOPSIS & BWM</p>
                </div>
                <div style={styles.bigNumberContainer}>
                  <span style={styles.bigNumber}>94</span><span style={styles.percentSymbol}>%</span>
                </div>
                <p style={{textAlign: "center", color: "#333", fontSize: "0.95rem", margin: 0, padding: "0 20px", fontWeight: "600"}}>
                  Rombongan menyatakan sangat puas dengan destinasi akhir yang dipilih secara matematis oleh sistem.
                </p>
              </div>

              <div style={{...styles.statSlide, opacity: statSlide === 2 ? 1 : 0, zIndex: statSlide === 2 ? 2 : 1}}>
                <div style={styles.statHeader}>
                  <h4 style={styles.statTitle}>Efisiensi Waktu Diskusi</h4>
                  <p style={styles.statSubtitle}>Rata-rata waktu untuk mencapai kesepakatan</p>
                </div>
                <div style={styles.comparisonContainer}>
                  <div style={styles.compareBox}><span style={styles.compareLabel}>Manual (Chat)</span><span style={styles.compareBadValue}>&plusmn; 5 Hari</span></div>
                  <div style={styles.compareArrow}>➡</div>
                  <div style={{...styles.compareBox, backgroundColor: "#bef264"}}><span style={{...styles.compareLabel, color: "#000"}}>Via Mlampah Jogja</span><span style={styles.compareGoodValue}>15 Menit</span></div>
                </div>
                <p style={{textAlign: "left", color: "#333", fontSize: "0.95rem", margin: "25px 0 0 0", fontWeight: "600"}}>Sistem komputasi kami merangkum ratusan preferensi kriteria dalam hitungan detik.</p>
              </div>

              <div style={styles.sliderDots}>
                {[0, 1, 2].map((idx) => (<div key={idx} style={{...styles.dot, width: statSlide === idx ? "25px" : "10px", backgroundColor: statSlide === idx ? "#000" : "transparent", border: "2px solid #000"}} />))}
              </div>
            </div>
          </div>
        </section>

        {/* === BAGIAN SLIDER DESTINASI POPULER === */}
        <section style={styles.sliderSection}>
          <div style={styles.sliderHeader}>
            <h2 style={styles.sectionTitle}>Katalog Destinasi Wisata</h2>
            <p style={styles.sectionSubtitle}>*Jelajahi dan klik untuk melihat detail</p>
          </div>

          <div style={styles.horizontalScrollContainer}>
            {wisataData.map((wisata) => (
              <div 
                key={wisata.id} 
                onClick={() => handleBukaDetail(wisata)}
                onMouseEnter={() => setHoverCard(wisata.id)}
                onMouseLeave={() => setHoverCard(null)}
                style={{
                  ...styles.wisataCard,
                  backgroundImage: `url('${wisata.img}'), ${wisata.imgFallback}`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  // REVISI: Efek mengambang lembut, tanpa border shadow kaku
                  transform: hoverCard === wisata.id ? "translateY(-5px)" : "translateY(0)"
                }}
              >
                {/* Badge Tayangan (Mata) */}
                <div style={styles.viewBadge}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  {wisata.jumlah_dilihat}
                </div>

                <div style={styles.cardOverlay}>
                  <span style={styles.kategoriBadge}>{wisata.kategori}</span>
                  <h3 style={styles.wisataName}>{wisata.nama}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>&copy; 2026 Mlampah Jogja Decision Support System.</p>
      </footer>

      {/* === MODAL POP-UP DETAIL WISATA === */}
      {selectedWisata && (
        <div style={styles.modalBackdrop} onClick={() => setSelectedWisata(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              style={{...styles.closeButton, transform: hoverBtn === "close" ? "scale(1.1)" : "scale(1)"}} 
              onClick={() => setSelectedWisata(null)}
              onMouseEnter={() => setHoverBtn("close")}
              onMouseLeave={() => setHoverBtn(null)}
            >✕</button>
            
            <div style={{
              ...styles.modalImageHero,
              backgroundImage: `url('${selectedWisata.img}'), ${selectedWisata.imgFallback}`,
            }}>
              <div style={styles.modalViewBadge}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                {selectedWisata.jumlah_dilihat} Tayangan
              </div>
            </div>

            <div style={styles.modalBody}>
              <span style={styles.kategoriBadgeModal}>{selectedWisata.kategori}</span>
              <h2 style={{color: "#000", fontSize: "2.2rem", margin: "10px 0 15px 0", fontFamily: "Georgia, serif", fontWeight: "900"}}>{selectedWisata.nama}</h2>
              <p style={{color: "#333", lineHeight: 1.7, fontSize: "1.05rem", fontWeight: "500"}}>
                {selectedWisata.deskripsi}
              </p>
              
              <div style={{marginTop: "30px", paddingTop: "20px", borderTop: "2px dashed #000"}}>
                <button 
                  onClick={() => setSelectedWisata(null)} 
                  onMouseEnter={() => setHoverBtn("tutup")}
                  onMouseLeave={() => setHoverBtn(null)}
                  style={{
                    width: "100%", padding: "16px", backgroundColor: hoverBtn === "tutup" ? "#000" : "#bef264", color: hoverBtn === "tutup" ? "#bef264" : "#000", borderRadius: "12px", fontSize: "1.1rem", fontWeight: "900", border: "2px solid #000", cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px", transition: "all 0.2s"
                  }}>
                  Tutup Detail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === CSS IN JS (CLEAN OUTLINE THEME) ===
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: { 
    position: "relative", width: "100%", minHeight: "100vh", 
    backgroundImage: `linear-gradient(rgba(248, 250, 252, 0.88), rgba(248, 250, 252, 0.94)), url('/background2.jpg')`, 
    backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", 
    fontFamily: "system-ui, -apple-system, sans-serif", 
    display: "flex", flexDirection: "column", overflow: "hidden" 
  },
  
  // NAVBAR
  navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 6%", width: "100%", zIndex: 100, borderBottom: "3px solid #000", backgroundColor: "#fff", position: "sticky", top: 0 },
  logo: { display: "flex", alignItems: "center", gap: "12px", fontSize: "1.4rem", fontWeight: "900", color: "#000", letterSpacing: "1px", cursor: "pointer", transition: "all 0.3s ease" },
  logoIcon: { position: "relative", width: "26px", height: "26px" },
  logoLeaf1: { position: "absolute", width: "14px", height: "14px", backgroundColor: "#0eec02", borderRadius: "2px 10px 2px 10px", top: 0, left: 0 },
  logoLeaf2: { position: "absolute", width: "14px", height: "14px", backgroundColor: "#005f08", borderRadius: "10px 2px 10px 2px", top: 0, right: 0 },
  logoLeaf3: { position: "absolute", width: "14px", height: "14px", backgroundColor: "#00c264", borderRadius: "10px 2px 10px 2px", bottom: 0, left: 0 },
  navRightActions: { display: "flex", alignItems: "center", gap: "15px" },
  btnNavOutline: { padding: "10px 22px", borderRadius: "10px", border: "2px solid #000", color: "#000", cursor: "pointer", fontSize: "0.95rem", fontWeight: "800", transition: "all 0.2s ease" },

  // KONTEN UTAMA
  mainContent: { flex: 1, padding: "80px 6%", display: "flex", flexDirection: "column", gap: "120px", maxWidth: "1500px", margin: "0 auto", width: "100%" },
  
  aboutHeroSection: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "60px", width: "100%" },
  textContainer: { flex: "1", maxWidth: "600px", display: "flex", flexDirection: "column", alignItems: "flex-start" },
  badge: { backgroundColor: "#bef264", color: "#000", padding: "8px 18px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "900", letterSpacing: "1px", marginBottom: "25px", border: "2px solid #000" },
  mainTitle: { fontSize: "3.5rem", fontFamily: "Georgia, serif", fontWeight: 900, lineHeight: 1.2, margin: "0 0 30px 0", color: "#000", textAlign: "left" },
  description: { fontSize: "1.15rem", lineHeight: 1.8, color: "#333", margin: "0 0 20px 0", textAlign: "justify", fontWeight: "500" },

  // SLIDER STATISTIK (TANPA SHADOW)
  graphicContainer: { flex: "1", display: "flex", justifyContent: "center", alignItems: "flex-start", marginTop: "10px" },
  statsSliderWrapper: { width: "100%", maxWidth: "550px", height: "450px", position: "relative", backgroundColor: "#fff", borderRadius: "24px", border: "3px solid #000", padding: "40px" },
  statSlide: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", padding: "40px", transition: "opacity 0.8s ease-in-out", display: "flex", flexDirection: "column", justifyContent: "center" },
  statHeader: { marginBottom: "30px", borderBottom: "2px solid #e2e8f0", paddingBottom: "15px" },
  statHeaderCentered: { marginBottom: "20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" },
  statTitle: { color: "#000", margin: "0 0 8px 0", fontSize: "1.4rem", fontWeight: "900" },
  statSubtitle: { color: "#475569", margin: 0, fontSize: "0.95rem", fontWeight: "600" },

  chartContainer: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "200px", padding: "0 10px" },
  barColumn: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", width: "45px", height: "100%", justifyContent: "flex-end" },
  barValue: { color: "#475569", fontSize: "0.9rem", fontWeight: "700" },
  barFill: { width: "100%", borderRadius: "6px 6px 0 0", transition: "height 1s ease" },
  barLabel: { color: "#475569", fontSize: "0.9rem", marginTop: "5px", fontWeight: "700" },

  bigNumberContainer: { display: "flex", justifyContent: "center", alignItems: "flex-start", marginBottom: "20px" },
  bigNumber: { fontSize: "7rem", fontWeight: "900", color: "#000", lineHeight: "1", fontFamily: "Georgia, serif" },
  percentSymbol: { fontSize: "3rem", fontWeight: "900", color: "#65a30d", marginTop: "10px" },

  comparisonContainer: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "15px" },
  compareBox: { flex: 1, backgroundColor: "#f8fafc", border: "2px solid #000", borderRadius: "16px", padding: "30px 15px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" },
  compareLabel: { color: "#475569", fontSize: "0.85rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" },
  compareBadValue: { color: "#000", fontSize: "1.6rem", fontWeight: "900", textDecoration: "line-through", opacity: 0.5 },
  compareGoodValue: { color: "#000", fontSize: "2.2rem", fontWeight: "900" },
  compareArrow: { padding: "0 15px", fontSize: "1.5rem", fontWeight: "bold" },

  sliderDots: { position: "absolute", bottom: "30px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", zIndex: 10 },
  dot: { height: "10px", borderRadius: "5px", transition: "all 0.4s ease" },

  // BAGIAN SLIDER WISATA
  sliderSection: { width: "100%", display: "flex", flexDirection: "column", gap: "30px" },
  sliderHeader: { display: "flex", flexDirection: "column", gap: "5px" },
  sectionTitle: { fontSize: "2rem", color: "#000", margin: 0, fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px" },
  sectionSubtitle: { fontSize: "1.05rem", color: "#65a30d", margin: 0, fontWeight: "bold" },

  horizontalScrollContainer: { display: "flex", gap: "25px", overflowX: "auto", paddingBottom: "30px", scrollSnapType: "x mandatory", scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" },
  
  // WISATA CARD (TANPA SHADOW)
  wisataCard: { flex: "0 0 300px", height: "400px", borderRadius: "20px", position: "relative", overflow: "hidden", scrollSnapAlign: "start", border: "3px solid #000", transition: "all 0.2s ease", cursor: "pointer" },
  
  viewBadge: { position: "absolute", top: "15px", right: "15px", backgroundColor: "#fff", color: "#000", padding: "6px 12px", borderRadius: "10px", fontSize: "0.85rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "6px", zIndex: 10, border: "2px solid #000" },
  
  cardOverlay: { position: "absolute", bottom: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "30px 25px", background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.1) 70%, transparent 100%)" },
  kategoriBadge: { backgroundColor: "#bef264", color: "#000", border: "2px solid #000", padding: "6px 12px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: "900", marginBottom: "10px", width: "fit-content" },
  wisataName: { fontSize: "1.6rem", color: "#fff", margin: 0, fontFamily: "Georgia, serif", fontWeight: "900", textShadow: "0px 2px 4px rgba(0,0,0,0.9)" },

  // FOOTER
  footer: { borderTop: "3px solid #000", padding: "30px 6%", textAlign: "center", backgroundColor: "#fff" },
  footerText: { color: "#000", fontSize: "0.95rem", margin: 0, fontWeight: "700" },

  // === STYLE MODAL (TANPA SHADOW HITAM KAKU) ===
  modalBackdrop: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(5px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, padding: "20px" },
  modalContent: { backgroundColor: "#fff", width: "100%", maxWidth: "550px", borderRadius: "24px", overflow: "hidden", position: "relative", border: "3px solid #000", animation: "fadeIn 0.2s ease-out" },
  closeButton: { position: "absolute", top: "15px", right: "15px", width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#fff", color: "#000", border: "2px solid #000", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.2rem", cursor: "pointer", zIndex: 10, fontWeight: "bold", transition: "all 0.2s" },
  modalImageHero: { width: "100%", height: "250px", backgroundSize: "cover", backgroundPosition: "center", position: "relative", borderBottom: "3px solid #000" },
  modalViewBadge: { position: "absolute", bottom: "15px", right: "15px", backgroundColor: "#bef264", color: "#000", padding: "8px 12px", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "6px", border: "2px solid #000" },
  modalBody: { padding: "30px" },
  kategoriBadgeModal: { backgroundColor: "#000", color: "#bef264", padding: "6px 12px", borderRadius: "8px", fontSize: "0.8rem", fontWeight: "900", display: "inline-block", letterSpacing: "1px", textTransform: "uppercase" }
};