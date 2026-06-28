// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";

// // --- DATA MOCKUP UNTUK TAMPILAN DASBOR ---
// const mockMetrik = {
//   totalRombongan: 124,
//   totalResponden: 890,
//   kenaikan: "+12.5%",
// };

// const mockTopDestinasi = [
//   { nama: "Malioboro", persentase: 48, warna: "#ef4444" },
//   { nama: "Candi Prambanan", persentase: 24, warna: "#3b82f6" },
//   { nama: "Taman Sari", persentase: 16, warna: "#10b981" },
//   { nama: "Goa Pindul", persentase: 12, warna: "#f59e0b" },
// ];

// // Default Kriteria BWM
// const defaultCriteriaMaster = [
//   { id: "k1", nama: "Jenis Wisata", aktif: true },
//   { id: "k2", nama: "Biaya", aktif: true },
//   { id: "k3", nama: "Aksesibilitas", aktif: true },
//   { id: "k4", nama: "Fasilitas", aktif: true },
//   { id: "k5", nama: "Daya Tarik Wisata", aktif: true }
// ];

// export default function DasborStaffAdmin() {
//   const [menuAktif, setMenuAktif] = useState("Dashboard");
  
//   // State untuk Data Pengaturan Kriteria
//   const [kriteriaSetting, setKriteriaSetting] = useState(defaultCriteriaMaster);
  
//   // Fungsi penentu sapaan berdasarkan jam
//   const jam = new Date().getHours();
//   const sapaan = jam < 12 ? "Good Morning" : jam < 18 ? "Good Afternoon" : "Good Evening";

//   const menuSidebar = ["Dashboard", "Criteria", "Demographics", "Performance", "Alternative", "Profile", "Setting"];

//   // Saat komponen dimuat, ambil pengaturan kriteria terakhir dari database (localStorage)
//   useEffect(() => {
//     const savedCriteria = localStorage.getItem("dss_criteria_settings");
//     if (savedCriteria) {
//       setKriteriaSetting(JSON.parse(savedCriteria));
//     }
//   }, []);

//   // Fungsi saat toggle kriteria diklik
//   const handleToggleKriteria = (id: string) => {
//     const updatedCriteria = kriteriaSetting.map(k => {
//       if (k.id === id) {
//         return { ...k, aktif: !k.aktif };
//       }
//       return k;
//     });

//     // Validasi: Minimal harus ada 3 kriteria yang aktif agar BWM bisa dihitung
//     const activeCount = updatedCriteria.filter(k => k.aktif).length;
//     if (activeCount < 3) {
//       alert("⚠️ Peringatan: Metode BWM membutuhkan minimal 3 kriteria aktif untuk dihitung.");
//       return;
//     }

//     setKriteriaSetting(updatedCriteria);
//     localStorage.setItem("dss_criteria_settings", JSON.stringify(updatedCriteria));
    
//     // PANCARKAN SINYAL GLOBAL KE SELURUH TAB ANGGOTA
//     window.dispatchEvent(new Event("storage"));
//   };

//   return (
//     <div style={styles.container}>
      
//       {/* 1. SIDEBAR KIRI */}
//       <aside style={styles.sidebar}>
//         <div style={styles.logoContainer}>
//           <h1 style={styles.logoText}>Jogja<span style={{color: "#0194f3"}}>Trip</span></h1>
//         </div>

//         <nav style={styles.navContainer}>
//           {menuSidebar.map((menu) => (
//             <div 
//               key={menu} 
//               onClick={() => setMenuAktif(menu)}
//               style={{
//                 ...styles.navItem, 
//                 backgroundColor: menuAktif === menu ? "#f0f8ff" : "transparent",
//                 color: menuAktif === menu ? "#0194f3" : "#64748b",
//                 borderRight: menuAktif === menu ? "4px solid #0194f3" : "4px solid transparent",
//                 fontWeight: menuAktif === menu ? "bold" : "500"
//               }}
//             >
//               <span style={styles.navIcon}>{menu === "Dashboard" ? "📊" : menu === "Demographics" ? "👥" : menu === "Criteria" ? "🎯" : "📁"}</span>
//               {menu}
//             </div>
//           ))}
//         </nav>

//         <div style={styles.userProfileSidebar}>
//           <div style={styles.avatarAdmin}>A</div>
//           <div style={{flex: 1}}>
//             <h4 style={{margin: 0, fontSize: "0.9rem", color: "#0f172a"}}>Admin Staff</h4>
//             <small style={{color: "#64748b"}}>Travelxism Ops</small>
//           </div>
//           <Link href="/" style={{textDecoration: "none", color: "#94a3b8", fontWeight: "bold"}}>...</Link>
//         </div>
//       </aside>

//       {/* 2. AREA KONTEN UTAMA */}
//       <main style={styles.mainContent}>
        
//         {/* HEADER */}
//         <header style={styles.header}>
//           <h2 style={styles.greeting}>{sapaan}, Admin</h2>
//           <div style={styles.notificationBtn}>🔔</div>
//         </header>

//         {/* JIKA MENU DASHBOARD AKTIF */}
//         {menuAktif === "Dashboard" && (
//           <div style={styles.fadeAnimation}>
//             {/* SUMMARY CARDS (3 KOTAK ATAS) */}
//             <div style={styles.summaryGrid}>
//               <div style={styles.card}>
//                 <div style={styles.cardTitleBox}>
//                   <span style={styles.cardTitle}>Total Rooms Created</span>
//                   <span style={styles.badgeUp}>↑ {mockMetrik.kenaikan}</span>
//                 </div>
//                 <h1 style={styles.cardNumber}>{mockMetrik.totalRombongan}</h1>
//                 <p style={styles.cardDesc}>Group Trips Planned</p>
//               </div>

//               <div style={styles.card}>
//                 <div style={styles.cardTitleBox}>
//                   <span style={styles.cardTitle}>DSS Total Votes</span>
//                 </div>
//                 <h1 style={styles.cardNumber}>{mockMetrik.totalResponden}</h1>
//                 <p style={styles.cardDesc}>Members Participated</p>
//               </div>

//               <div style={styles.card}>
//                 <div style={styles.cardTitleBox}>
//                   <span style={styles.cardTitle}>Average Age</span>
//                 </div>
//                 <h1 style={styles.cardNumber}>24.5</h1>
//                 <p style={styles.cardDesc}>Years Old</p>
//               </div>
//             </div>

//             {/* AREA GRAFIK & LAPORAN */}
//             <div style={styles.reportsGrid}>
//               {/* KOLOM KIRI (LEBAR): DEMOGRAFI (GENDER & USIA) */}
//               <div style={styles.largeCard}>
//                 <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px"}}>
//                   <h3 style={styles.sectionTitle}>DSS Demographics Report</h3>
//                   <select style={styles.dropdownMini}>
//                     <option>This Month</option>
//                   </select>
//                 </div>

//                 <div style={{display: "flex", gap: "40px", flexWrap: "wrap"}}>
//                   {/* Grafik Gender (CSS Bar) */}
//                   <div style={{flex: 1, minWidth: "200px"}}>
//                     <h4 style={{color: "#64748b", fontSize: "0.85rem", marginBottom: "15px"}}>GENDER DISTRIBUTION</h4>
                    
//                     <div style={{display: "flex", justifyContent: "space-between", marginBottom: "5px"}}>
//                       <span style={{fontWeight: "bold", color: "#0f172a", fontSize: "0.9rem"}}>Male (L)</span>
//                       <span style={{color: "#0194f3", fontWeight: "bold"}}>65%</span>
//                     </div>
//                     <div style={styles.progressBarBg}>
//                       <div style={{...styles.progressBarFill, width: "65%", backgroundColor: "#0194f3"}}></div>
//                     </div>

//                     <div style={{display: "flex", justifyContent: "space-between", marginBottom: "5px", marginTop: "15px"}}>
//                       <span style={{fontWeight: "bold", color: "#0f172a", fontSize: "0.9rem"}}>Female (P)</span>
//                       <span style={{color: "#ec4899", fontWeight: "bold"}}>35%</span>
//                     </div>
//                     <div style={styles.progressBarBg}>
//                       <div style={{...styles.progressBarFill, width: "35%", backgroundColor: "#ec4899"}}></div>
//                     </div>
//                   </div>

//                   {/* Grafik Usia (CSS Bar) */}
//                   <div style={{flex: 1, minWidth: "200px"}}>
//                     <h4 style={{color: "#64748b", fontSize: "0.85rem", marginBottom: "15px"}}>AGE GROUPS</h4>
                    
//                     <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px"}}>
//                       <div style={{width: "45px", fontSize: "0.8rem", color: "#64748b"}}>17-22</div>
//                       <div style={styles.progressBarBg}><div style={{...styles.progressBarFill, width: "40%", backgroundColor: "#10b981"}}></div></div>
//                       <div style={{fontSize: "0.8rem", fontWeight: "bold", color: "#0f172a"}}>40%</div>
//                     </div>
//                     <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px"}}>
//                       <div style={{width: "45px", fontSize: "0.8rem", color: "#64748b"}}>23-30</div>
//                       <div style={styles.progressBarBg}><div style={{...styles.progressBarFill, width: "45%", backgroundColor: "#10b981"}}></div></div>
//                       <div style={{fontSize: "0.8rem", fontWeight: "bold", color: "#0f172a"}}>45%</div>
//                     </div>
//                     <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
//                       <div style={{width: "45px", fontSize: "0.8rem", color: "#64748b"}}>31+</div>
//                       <div style={styles.progressBarBg}><div style={{...styles.progressBarFill, width: "15%", backgroundColor: "#10b981"}}></div></div>
//                       <div style={{fontSize: "0.8rem", fontWeight: "bold", color: "#0f172a"}}>15%</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* KOLOM KANAN (SEMPIT): TOP DESTINASI */}
//               <div style={styles.sideCard}>
//                 <h3 style={styles.sectionTitle}>Top Chosen Dest.</h3>
//                 <div style={{marginTop: "20px", display: "flex", flexDirection: "column", gap: "18px"}}>
//                   {mockTopDestinasi.map((dest, i) => (
//                     <div key={i} style={{display: "flex", alignItems: "center", gap: "15px"}}>
//                       <div style={{width: "35px", height: "35px", borderRadius: "50%", backgroundColor: `${dest.warna}15`, color: dest.warna, display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold", fontSize: "0.8rem"}}>
//                         #{i+1}
//                       </div>
//                       <div style={{flex: 1}}>
//                         <div style={{fontWeight: "bold", color: "#0f172a", fontSize: "0.95rem"}}>{dest.nama}</div>
//                         <div style={{width: "100%", height: "4px", backgroundColor: "#f1f5f9", marginTop: "5px", borderRadius: "2px"}}>
//                           <div style={{width: `${dest.persentase}%`, height: "100%", backgroundColor: dest.warna, borderRadius: "2px"}}></div>
//                         </div>
//                       </div>
//                       <div style={{fontWeight: "900", color: "#0194f3", fontSize: "0.95rem"}}>{dest.persentase}%</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* JIKA MENU CRITERIA AKTIF */}
//         {menuAktif === "Criteria" && (
//           <div style={styles.fadeAnimation}>
//             <div style={styles.largeCard}>
//               <div style={{marginBottom: "30px"}}>
//                 <h3 style={styles.sectionTitle}>Pengaturan Kriteria Master (BWM)</h3>
//                 <p style={{color: "#64748b", fontSize: "0.95rem", marginTop: "8px"}}>
//                   Aktifkan atau nonaktifkan kriteria yang akan muncul di layar kuesioner pengguna. Perubahan ini bersifat <strong>real-time</strong> ke seluruh form aktif.
//                 </p>
//               </div>

//               <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
//                 {kriteriaSetting.map((kriteria) => (
//                   <div key={kriteria.id} style={styles.criteriaRow}>
//                     <div style={{display: "flex", alignItems: "center", gap: "15px"}}>
//                       <div style={{
//                         width: "12px", height: "12px", borderRadius: "50%",
//                         backgroundColor: kriteria.aktif ? "#10b981" : "#ef4444",
//                         boxShadow: kriteria.aktif ? "0 0 10px rgba(16, 185, 129, 0.4)" : "none"
//                       }}></div>
//                       <div>
//                         <strong style={{fontSize: "1.1rem", color: kriteria.aktif ? "#0f172a" : "#94a3b8", textDecoration: kriteria.aktif ? "none" : "line-through"}}>{kriteria.nama}</strong>
//                         <div style={{fontSize: "0.85rem", color: "#64748b", marginTop: "4px"}}>ID Parameter: {kriteria.id.toUpperCase()}</div>
//                       </div>
//                     </div>
                    
//                     {/* TOGGLE SWITCH CUSTOM CSS */}
//                     <div 
//                       onClick={() => handleToggleKriteria(kriteria.id)}
//                       style={{
//                         ...styles.toggleContainer,
//                         backgroundColor: kriteria.aktif ? "#0194f3" : "#e2e8f0"
//                       }}
//                     >
//                       <div style={{
//                         ...styles.toggleCircle,
//                         transform: kriteria.aktif ? "translateX(24px)" : "translateX(0)"
//                       }}></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//       </main>
//     </div>
//   );
// }

// // === PREMIUM CSS-IN-JS (MENGADOPSI GAYA TRAVELXISM) ===
// const styles: { [key: string]: React.CSSProperties } = {
//   container: { display: "flex", minHeight: "100vh", backgroundColor: "#F7F8FA", fontFamily: "system-ui, -apple-system, sans-serif" },
  
//   // SIDEBAR
//   sidebar: { width: "260px", backgroundColor: "#ffffff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column" },
//   logoContainer: { padding: "30px", paddingBottom: "20px" },
//   logoText: { fontSize: "1.8rem", fontWeight: "900", color: "#0f172a", margin: 0, letterSpacing: "-0.5px" },
//   navContainer: { display: "flex", flexDirection: "column", flex: 1, marginTop: "20px" },
//   navItem: { padding: "15px 30px", cursor: "pointer", display: "flex", alignItems: "center", gap: "15px", fontSize: "0.95rem", transition: "all 0.2s" },
//   navIcon: { fontSize: "1.1rem" },
//   userProfileSidebar: { padding: "20px", display: "flex", alignItems: "center", gap: "12px", borderTop: "1px solid #f1f5f9", marginTop: "auto" },
//   avatarAdmin: { width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#0f172a", color: "white", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" },
  
//   // MAIN CONTENT
//   mainContent: { flex: 1, padding: "30px 40px", overflowY: "auto" },
//   header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "35px" },
//   greeting: { fontSize: "1.8rem", fontWeight: "800", color: "#0f172a", margin: 0 },
//   notificationBtn: { width: "45px", height: "45px", borderRadius: "50%", backgroundColor: "#ffffff", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.03)", cursor: "pointer", fontSize: "1.2rem", border: "1px solid #f1f5f9" },
  
//   // CARDS
//   summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "25px", marginBottom: "25px" },
//   card: { backgroundColor: "#ffffff", borderRadius: "20px", padding: "25px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", border: "1px solid #f1f5f9" },
//   cardTitleBox: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" },
//   cardTitle: { fontSize: "0.85rem", color: "#64748b", fontWeight: "bold", textTransform: "uppercase" },
//   badgeUp: { backgroundColor: "#f0fdf4", color: "#16a34a", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "bold" },
//   cardNumber: { fontSize: "2.5rem", fontWeight: "900", color: "#0194f3", margin: "0 0 5px 0" },
//   cardDesc: { fontSize: "0.85rem", color: "#94a3b8", margin: 0, fontWeight: "500" },
  
//   // REPORTS SECTION
//   reportsGrid: { display: "flex", gap: "25px", flexWrap: "wrap" },
//   largeCard: { flex: "2 1 500px", backgroundColor: "#ffffff", borderRadius: "20px", padding: "30px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", border: "1px solid #f1f5f9" },
//   sideCard: { flex: "1 1 300px", backgroundColor: "#ffffff", borderRadius: "20px", padding: "30px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", border: "1px solid #f1f5f9" },
//   sectionTitle: { fontSize: "1.2rem", fontWeight: "800", color: "#0f172a", margin: 0 },
//   dropdownMini: { padding: "6px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", fontSize: "0.8rem", color: "#475569", fontWeight: "bold", outline: "none" },
  
//   // TOGGLE SWITCH (NEW)
//   criteriaRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc" },
//   toggleContainer: { width: "56px", height: "32px", borderRadius: "16px", padding: "4px", cursor: "pointer", transition: "background-color 0.3s ease" },
//   toggleCircle: { width: "24px", height: "24px", backgroundColor: "#fff", borderRadius: "50%", boxShadow: "0 2px 4px rgba(0,0,0,0.2)", transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)" },

//   // CSS PROGRESS BARS
//   progressBarBg: { width: "100%", height: "8px", backgroundColor: "#f1f5f9", borderRadius: "4px", overflow: "hidden", flex: 1 },
//   progressBarFill: { height: "100%", borderRadius: "4px" },

//   fadeAnimation: { animation: "fadeIn 0.3s ease-in-out" }
// };

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 

// --- DATA MOCKUP (Hanya untuk Top Destinasi karena butuh query kompleks) ---
const mockTopDestinasi = [
  { nama: "Candi Prambanan", persentase: 48 },
  { nama: "Jalan Malioboro", persentase: 24 },
  { nama: "Taman Sari", persentase: 16 },
  { nama: "Pantai Parangtritis", persentase: 12 },
];

export default function DasborStaffAdmin() {
  const router = useRouter();
  const [menuAktif, setMenuAktif] = useState("Dashboard");
  const [hoverElement, setHoverElement] = useState<string | null>(null);
  
  // === STATE DATA DINAMIS DARI SUPABASE ===
  const [isLoading, setIsLoading] = useState(true);
  const [dataRombongan, setDataRombongan] = useState<any[]>([]);
  const [selectedRombonganId, setSelectedRombonganId] = useState<string | null>(null);

  // State Statistik Dinamis
  const [metrik, setMetrik] = useState({ totalRombongan: 0, totalResponden: 0, rataUsia: "0" });
  const [demografi, setDemografi] = useState({ pria: 0, wanita: 0, usia1: 0, usia2: 0, usia3: 0 });

  const jam = new Date().getHours();
  const sapaan = jam < 12 ? "Selamat Pagi" : jam < 18 ? "Selamat Siang" : "Selamat Malam";
  const menuSidebar = ["Dashboard", "Manajemen Rombongan", "Demographics", "Performance", "Setting"];

  // === MENGAMBIL DAN MENGOLAH DATA DARI SUPABASE ===
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        // 1. Tarik data dari 3 tabel sekaligus secara paralel agar cepat
        const [resRuang, resKetua, resAnggota] = await Promise.all([
          supabase.from('ruang').select('*'),
          supabase.from('user_ketua').select('*'),
          supabase.from('user_anggota').select('*')
        ]);

        if (resRuang.error) throw resRuang.error;
        if (resKetua.error) throw resKetua.error;
        if (resAnggota.error) throw resAnggota.error;

        const dataRuang = resRuang.data || [];
        const dataKetua = resKetua.data || [];
        const dataAnggota = resAnggota.data || [];

        // 2. Kalkulasi Statistik Dasbor Dinamis
        let totalUsia = 0, hitungPria = 0, hitungWanita = 0;
        let u17_22 = 0, u23_30 = 0, u31plus = 0;

        dataAnggota.forEach(a => {
          totalUsia += a.usia || 0;
          if (a.gender === 'L') hitungPria++; else hitungWanita++;
          
          if (a.usia <= 22) u17_22++;
          else if (a.usia <= 30) u23_30++;
          else u31plus++;
        });

        const totalA = dataAnggota.length || 1; // Mencegah pembagian dengan 0
        setMetrik({
          totalRombongan: dataRuang.length,
          totalResponden: dataAnggota.length,
          rataUsia: dataAnggota.length > 0 ? (totalUsia / dataAnggota.length).toFixed(1) : "0"
        });

        setDemografi({
          pria: Math.round((hitungPria / totalA) * 100),
          wanita: Math.round((hitungWanita / totalA) * 100),
          usia1: Math.round((u17_22 / totalA) * 100),
          usia2: Math.round((u23_30 / totalA) * 100),
          usia3: Math.round((u31plus / totalA) * 100),
        });

        // 3. Mapping Data Rombongan (Menggabungkan Ruang, Ketua, dan Anggota)
        const formattedRombongan = dataRuang.map(ruang => {
          // Cari ketua yang punya ID sama dengan id_ketua di tabel ruang
          const ketua = dataKetua.find(k => k.id_ketua === ruang.id_ketua);
          
          // Filter anggota yang berada di ruang ini
          const anggotaGroup = dataAnggota.filter(a => a.id_ruang === ruang.id_ruang || a.kode_ruang === ruang.kode_ruang);

          // Muat pengaturan kriteria tersimpan, atau berikan nilai default
          const savedKriteria = localStorage.getItem(`kriteria_ruang_${ruang.id_ruang}`);
          const kriteriaBWM = savedKriteria ? JSON.parse(savedKriteria) : [
            { id: "k1", nama: "Jenis Wisata", aktif: true },
            { id: "k2", nama: "Biaya", aktif: true },
            { id: "k3", nama: "Aksesibilitas", aktif: true },
            { id: "k4", nama: "Fasilitas", aktif: true },
            { id: "k5", nama: "Daya Tarik Wisata", aktif: true }
          ];

          return {
            id: ruang.id_ruang,
            ketua: ketua ? ketua.nama_lengkap : "Tanpa Nama",
            grup: ruang.nama_grup,
            kode: ruang.kode_ruang,
            anggota: anggotaGroup.map(a => ({
              id: a.id_user,
              nama: a.nama_anggota,
              usia: a.usia,
              gender: a.gender
            })),
            kriteria: kriteriaBWM
          };
        });

        setDataRombongan(formattedRombongan);
      } catch (err) {
        console.error("Gagal menarik data Admin:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // === Fungsi Toggle Kriteria BWM Spesifik per Grup ===
  const handleToggleKriteria = (grupId: string, kriteriaId: string) => {
    setDataRombongan(prevData => prevData.map(grup => {
      if (grup.id === grupId) {
        const updatedKriteria = grup.kriteria.map((k: any) => {
          if (k.id === kriteriaId) return { ...k, aktif: !k.aktif };
          return k;
        });

        // Validasi Minimal 3 Kriteria BWM harus nyala
        const activeCount = updatedKriteria.filter((k: any) => k.aktif).length;
        if (activeCount < 3) {
          alert("⚠️ Metode BWM membutuhkan minimal 3 kriteria aktif.");
          return grup;
        }

        // Simpan preferensi ini ke local storage (atau ke Supabase jika kamu sudah membuat kolom JSON)
        localStorage.setItem(`kriteria_ruang_${grupId}`, JSON.stringify(updatedKriteria));
        
        return { ...grup, kriteria: updatedKriteria };
      }
      return grup;
    }));
  };

  const selectedGrup = dataRombongan.find(g => g.id === selectedRombonganId);

  if (isLoading) {
    return (
      <div style={{...styles.container, justifyContent: "center", alignItems: "center"}}>
        <h2 style={{color: "#000", fontWeight: "900", animation: "pulse 1.5s infinite"}}>Menyiapkan Data Admin...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      
      {/* 1. SIDEBAR KIRI */}
      <aside style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>
            <div style={styles.logoLeaf1} />
            <div style={styles.logoLeaf2} />
            <div style={styles.logoLeaf3} />
          </div>
          <h1 style={styles.logoText}>Mlampah Jogja</h1>
        </div>

        <nav style={styles.navContainer}>
          {menuSidebar.map((menu) => (
            <div 
              key={menu} 
              onClick={() => { setMenuAktif(menu); setSelectedRombonganId(null); }}
              onMouseEnter={() => setHoverElement(menu)}
              onMouseLeave={() => setHoverElement(null)}
              style={{
                ...styles.navItem, 
                backgroundColor: menuAktif === menu ? "#000" : (hoverElement === menu ? "#f8fafc" : "transparent"),
                color: menuAktif === menu ? "#B3EBF2" : "#000",
                transform: hoverElement === menu && menuAktif !== menu ? "translateY(-2px)" : "translateY(0)"
              }}
            >
              <span style={styles.navIcon}>
                {menu === "Dashboard" ? "📊" : menu === "Demographics" ? "👥" : menu === "Manajemen Rombongan" ? "📂" : "⚙️"}
              </span>
              {menu}
            </div>
          ))}
        </nav>

        <div style={styles.userProfileSidebar}>
          <div style={styles.avatarAdmin}>A</div>
          <div style={{flex: 1}}>
            <h4 style={{margin: 0, fontSize: "0.95rem", color: "#000", fontWeight: "900"}}>Portal Admin</h4>
            <small style={{color: "#333", fontWeight: "600"}}>Mlampah Jogja DSS</small>
          </div>
        </div>
      </aside>

      {/* 2. AREA KONTEN UTAMA */}
      <main style={styles.mainContent}>
        
        {/* HEADER */}
        <header style={styles.header}>
          <div>
            <h2 style={styles.greeting}>{sapaan}, Admin!</h2>
            <p style={{margin: "5px 0 0 0", color: "#333", fontWeight: "600"}}>Pantau dan kelola aktivitas sistem pendukung keputusan.</p>
          </div>
          <Link href="/" style={styles.logoutBtn}>Tutup Portal</Link>
        </header>

        {/* JIKA MENU DASHBOARD AKTIF */}
        {menuAktif === "Dashboard" && (
          <div style={styles.fadeAnimation}>
            
            {/* SUMMARY CARDS */}
            <div style={styles.summaryGrid}>
              <div style={styles.card}>
                <div style={styles.cardTitleBox}>
                  <span style={styles.cardTitle}>Total Ruang Dibuat</span>
                </div>
                <h1 style={styles.cardNumber}>{metrik.totalRombongan}</h1>
                <p style={styles.cardDesc}>Rombongan Terdaftar Aktif</p>
              </div>

              <div style={styles.card}>
                <div style={styles.cardTitleBox}>
                  <span style={styles.cardTitle}>Total Responden</span>
                </div>
                <h1 style={styles.cardNumber}>{metrik.totalResponden}</h1>
                <p style={styles.cardDesc}>Anggota Berpartisipasi</p>
              </div>

              <div style={styles.card}>
                <div style={styles.cardTitleBox}>
                  <span style={styles.cardTitle}>Rata-Rata Usia</span>
                </div>
                <h1 style={styles.cardNumber}>{metrik.rataUsia}</h1>
                <p style={styles.cardDesc}>Tahun</p>
              </div>
            </div>

            {/* AREA GRAFIK & LAPORAN */}
            <div style={styles.reportsGrid}>
              {/* KOLOM KIRI: DEMOGRAFI */}
              <div style={styles.largeCard}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px"}}>
                  <h3 style={styles.sectionTitle}>Demografi Pengguna</h3>
                </div>

                <div style={{display: "flex", gap: "40px", flexWrap: "wrap"}}>
                  {/* Grafik Gender */}
                  <div style={{flex: 1, minWidth: "200px"}}>
                    <h4 style={{color: "#000", fontSize: "0.9rem", marginBottom: "15px", fontWeight: "900"}}>DISTRIBUSI GENDER</h4>
                    
                    <div style={{display: "flex", justifyContent: "space-between", marginBottom: "5px"}}>
                      <span style={{fontWeight: "700", color: "#000", fontSize: "0.9rem"}}>Laki-laki (L)</span>
                      <span style={{color: "#000", fontWeight: "900"}}>{demografi.pria}%</span>
                    </div>
                    <div style={styles.progressBarBg}>
                      <div style={{...styles.progressBarFill, width: `${demografi.pria}%`, backgroundColor: "#B3EBF2", borderRight: demografi.pria > 0 ? "2px solid #000" : "none"}}></div>
                    </div>

                    <div style={{display: "flex", justifyContent: "space-between", marginBottom: "5px", marginTop: "15px"}}>
                      <span style={{fontWeight: "700", color: "#000", fontSize: "0.9rem"}}>Perempuan (P)</span>
                      <span style={{color: "#000", fontWeight: "900"}}>{demografi.wanita}%</span>
                    </div>
                    <div style={styles.progressBarBg}>
                      <div style={{...styles.progressBarFill, width: `${demografi.wanita}%`, backgroundColor: "#e2e8f0", borderRight: demografi.wanita > 0 ? "2px solid #000" : "none"}}></div>
                    </div>
                  </div>

                  {/* Grafik Usia */}
                  <div style={{flex: 1, minWidth: "200px"}}>
                    <h4 style={{color: "#000", fontSize: "0.9rem", marginBottom: "15px", fontWeight: "900"}}>KELOMPOK USIA</h4>
                    
                    <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px"}}>
                      <div style={{width: "45px", fontSize: "0.85rem", color: "#000", fontWeight: "bold"}}>17-22</div>
                      <div style={styles.progressBarBg}><div style={{...styles.progressBarFill, width: `${demografi.usia1}%`, backgroundColor: "#B3EBF2", borderRight: demografi.usia1 > 0 ? "2px solid #000" : "none"}}></div></div>
                      <div style={{fontSize: "0.85rem", fontWeight: "900", color: "#000"}}>{demografi.usia1}%</div>
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px"}}>
                      <div style={{width: "45px", fontSize: "0.85rem", color: "#000", fontWeight: "bold"}}>23-30</div>
                      <div style={styles.progressBarBg}><div style={{...styles.progressBarFill, width: `${demografi.usia2}%`, backgroundColor: "#B3EBF2", borderRight: demografi.usia2 > 0 ? "2px solid #000" : "none"}}></div></div>
                      <div style={{fontSize: "0.85rem", fontWeight: "900", color: "#000"}}>{demografi.usia2}%</div>
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                      <div style={{width: "45px", fontSize: "0.85rem", color: "#000", fontWeight: "bold"}}>31+</div>
                      <div style={styles.progressBarBg}><div style={{...styles.progressBarFill, width: `${demografi.usia3}%`, backgroundColor: "#B3EBF2", borderRight: demografi.usia3 > 0 ? "2px solid #000" : "none"}}></div></div>
                      <div style={{fontSize: "0.85rem", fontWeight: "900", color: "#000"}}>{demografi.usia3}%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* KOLOM KANAN: TOP DESTINASI */}
              <div style={styles.sideCard}>
                <h3 style={styles.sectionTitle}>Destinasi Terpopuler</h3>
                <div style={{marginTop: "25px", display: "flex", flexDirection: "column", gap: "20px"}}>
                  {mockTopDestinasi.map((dest, i) => (
                    <div key={i} style={{display: "flex", alignItems: "center", gap: "15px"}}>
                      <div style={{width: "35px", height: "35px", borderRadius: "8px", border: "2px solid #000", backgroundColor: i === 0 ? "#B3EBF2" : "#fff", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "900", fontSize: "0.9rem"}}>
                        #{i+1}
                      </div>
                      <div style={{flex: 1}}>
                        <div style={{fontWeight: "900", color: "#000", fontSize: "1rem"}}>{dest.nama}</div>
                        <div style={{width: "100%", height: "8px", backgroundColor: "#f1f5f9", marginTop: "5px", borderRadius: "4px", border: "1px solid #000", overflow: "hidden"}}>
                          <div style={{width: `${dest.persentase}%`, height: "100%", backgroundColor: i === 0 ? "#B3EBF2" : "#000", borderRight: "1px solid #000"}}></div>
                        </div>
                      </div>
                      <div style={{fontWeight: "900", color: "#000", fontSize: "1rem"}}>{dest.persentase}%</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* JIKA MENU MANAJEMEN ROMBONGAN AKTIF */}
        {menuAktif === "Manajemen Rombongan" && (
          <div style={styles.fadeAnimation}>
            
            {/* TAMPILAN 1: DAFTAR ROMBONGAN */}
            {!selectedRombonganId ? (
              <div style={styles.largeCard}>
                <div style={{marginBottom: "30px"}}>
                  <h3 style={styles.sectionTitle}>Daftar Ruang Rombongan Aktif</h3>
                  <p style={{color: "#333", fontSize: "1rem", marginTop: "8px", fontWeight: "500"}}>
                    Klik pada rombongan untuk melihat detail anggota dan mengatur kriteria BWM yang diaktifkan.
                  </p>
                </div>

                <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                  {dataRombongan.length === 0 && <p style={{color: "#000", fontWeight: "bold"}}>Belum ada ruang rombongan yang terdaftar di sistem.</p>}
                  
                  {dataRombongan.map((grup) => (
                    <div 
                      key={grup.id} 
                      onClick={() => setSelectedRombonganId(grup.id)}
                      onMouseEnter={() => setHoverElement(`grup-${grup.id}`)}
                      onMouseLeave={() => setHoverElement(null)}
                      style={{
                        ...styles.grupRow,
                        backgroundColor: hoverElement === `grup-${grup.id}` ? "#B3EBF2" : "#fff",
                        transform: hoverElement === `grup-${grup.id}` ? "translateY(-2px)" : "translateY(0)"
                      }}
                    >
                      <div style={{display: "flex", alignItems: "center", gap: "20px"}}>
                        <div style={styles.iconGrup}>👥</div>
                        <div>
                          <h4 style={{margin: 0, fontSize: "1.2rem", fontWeight: "900", color: "#000"}}>{grup.grup}</h4>
                          <p style={{margin: "4px 0 0 0", fontSize: "0.9rem", color: "#333", fontWeight: "600"}}>Ketua: {grup.ketua} • Kode: <strong style={{color: "#000"}}>{grup.kode}</strong></p>
                        </div>
                      </div>
                      <div style={{textAlign: "right"}}>
                        <div style={{fontSize: "1.3rem", fontWeight: "900", color: "#000"}}>{grup.anggota.length}</div>
                        <div style={{fontSize: "0.8rem", color: "#333", fontWeight: "700", textTransform: "uppercase"}}>Anggota</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : 

            /* TAMPILAN 2: DETAIL ROMBONGAN (TABEL ANGGOTA & SETTING KRITERIA) */
            selectedGrup && (
              <div style={styles.fadeAnimation}>
                <button 
                  onClick={() => setSelectedRombonganId(null)}
                  style={styles.btnBackOutline}
                >
                  ⬅ Kembali ke Daftar
                </button>

                <div style={styles.reportsGrid}>
                  
                  {/* TABEL ANGGOTA */}
                  <div style={{...styles.largeCard, flex: "2 1 600px"}}>
                    <h3 style={styles.sectionTitle}>Detail Anggota: {selectedGrup.grup}</h3>
                    <p style={{color: "#333", fontSize: "0.95rem", marginBottom: "20px", fontWeight: "500"}}>Kode Ruang: <strong>{selectedGrup.kode}</strong></p>
                    
                    <div style={{overflowX: "auto"}}>
                      <table style={styles.tabelData}>
                        <thead>
                          <tr style={styles.thRow}>
                            <th style={styles.thCell}>No</th>
                            <th style={styles.thCell}>Nama Lengkap</th>
                            <th style={styles.thCell}>Usia</th>
                            <th style={styles.thCell}>Gender</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedGrup.anggota.length === 0 ? (
                            <tr><td colSpan={4} style={{padding: "20px", textAlign: "center"}}>Belum ada anggota yang bergabung.</td></tr>
                          ) : (
                            selectedGrup.anggota.map((member: any, index: number) => (
                              <tr key={member.id} style={styles.tbRow}>
                                <td style={{...styles.tdCell, fontWeight: "900"}}>{index + 1}</td>
                                <td style={{...styles.tdCell, fontWeight: "bold"}}>{member.nama} {member.nama === selectedGrup.ketua ? "👑" : ""}</td>
                                <td style={styles.tdCell}>{member.usia} Thn</td>
                                <td style={styles.tdCell}>{member.gender === "L" ? "Laki-laki" : "Perempuan"}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* PENGATURAN KRITERIA BWM KHUSUS GRUP INI */}
                  <div style={{...styles.sideCard, flex: "1 1 350px"}}>
                    <h3 style={styles.sectionTitle}>Kriteria BWM Grup</h3>
                    <p style={{color: "#333", fontSize: "0.9rem", marginTop: "10px", marginBottom: "25px", fontWeight: "500"}}>
                      Tentukan kriteria yang wajib dinilai oleh anggota grup ini.
                    </p>

                    <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                      {selectedGrup.kriteria.map((kriteria: any) => (
                        <div key={kriteria.id} style={styles.criteriaRow}>
                          <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
                            <div style={{
                              width: "12px", height: "12px", borderRadius: "50%",
                              backgroundColor: kriteria.aktif ? "#B3EBF2" : "#f1f5f9",
                              border: "2px solid #000"
                            }}></div>
                            <strong style={{fontSize: "0.95rem", color: "#000", fontWeight: "800", textDecoration: kriteria.aktif ? "none" : "line-through"}}>{kriteria.nama}</strong>
                          </div>
                          
                          {/* TOGGLE SWITCH CUSTOM CSS */}
                          <div 
                            onClick={() => handleToggleKriteria(selectedGrup.id, kriteria.id)}
                            style={{
                              ...styles.toggleContainer,
                              backgroundColor: kriteria.aktif ? "#000" : "#fff"
                            }}
                          >
                            <div style={{
                              ...styles.toggleCircle,
                              backgroundColor: kriteria.aktif ? "#B3EBF2" : "#000",
                              transform: kriteria.aktif ? "translateX(24px)" : "translateX(0)"
                            }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

// === PREMIUM CLEAN OUTLINE & PASTEL BLUE THEME (NO SHADOWS) ===
const styles: { [key: string]: React.CSSProperties } = {
  container: { 
    display: "flex", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif",
    backgroundImage: `linear-gradient(to bottom right, rgba(138, 196, 246, 0.85), rgba(255, 255, 255, 0.95)), url('/bg-candi.jpg')`, 
    backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed"
  },
  
  // SIDEBAR (Putih Bersih, Border Hitam Kanan)
  sidebar: { width: "280px", backgroundColor: "#ffffff", borderRight: "3px solid #000", display: "flex", flexDirection: "column" },
  logoContainer: { padding: "30px 25px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "2px solid #000" },
  logoText: { fontSize: "1.4rem", fontWeight: "900", color: "#000", margin: 0, textTransform: "uppercase", letterSpacing: "1px" },
  
  // Daun Logo
  logoIcon: { position: "relative", width: "24px", height: "24px" },
  logoLeaf1: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#0eec02", borderRadius: "2px 8px 2px 8px", top: 0, left: 0, border: "1px solid #000" },
  logoLeaf2: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#005f08", borderRadius: "8px 2px 8px 2px", top: 0, right: 0, border: "1px solid #000" },
  logoLeaf3: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#00c264", borderRadius: "8px 2px 8px 2px", bottom: 0, left: 0, border: "1px solid #000" },

  navContainer: { display: "flex", flexDirection: "column", flex: 1, padding: "20px 15px", gap: "5px" },
  navItem: { padding: "16px 20px", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "15px", fontSize: "1rem", fontWeight: "800", transition: "all 0.2s", border: "2px solid transparent" },
  navIcon: { fontSize: "1.2rem" },
  
  userProfileSidebar: { padding: "25px", display: "flex", alignItems: "center", gap: "15px", borderTop: "3px solid #000", backgroundColor: "#B3EBF2" },
  avatarAdmin: { width: "45px", height: "45px", borderRadius: "12px", border: "2px solid #000", backgroundColor: "#000", color: "#B3EBF2", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "900", fontSize: "1.2rem" },
  
  // MAIN CONTENT
  mainContent: { flex: 1, padding: "40px 50px", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" },
  greeting: { fontSize: "2.2rem", fontWeight: "900", color: "#000", margin: 0, fontFamily: "Georgia, serif" },
  logoutBtn: { padding: "12px 24px", backgroundColor: "#fff", border: "2px solid #000", borderRadius: "12px", textDecoration: "none", color: "#000", fontWeight: "900", transition: "all 0.2s", cursor: "pointer" },
  
  // CARDS (Tanpa Shadow Hitam, Full Clean Outline)
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "30px", marginBottom: "30px" },
  card: { backgroundColor: "#ffffff", borderRadius: "20px", padding: "30px", border: "3px solid #000" },
  cardTitleBox: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" },
  cardTitle: { fontSize: "0.9rem", color: "#000", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px" },
  badgeUp: { backgroundColor: "#B3EBF2", color: "#000", padding: "4px 10px", borderRadius: "8px", border: "2px solid #000", fontSize: "0.75rem", fontWeight: "900" },
  cardNumber: { fontSize: "3.5rem", fontWeight: "900", color: "#000", margin: "0 0 5px 0", fontFamily: "Georgia, serif" },
  cardDesc: { fontSize: "0.95rem", color: "#333", margin: 0, fontWeight: "600" },
  
  // REPORTS SECTION
  reportsGrid: { display: "flex", gap: "30px", flexWrap: "wrap", alignItems: "flex-start" },
  largeCard: { backgroundColor: "#ffffff", borderRadius: "24px", padding: "40px", border: "3px solid #000" },
  sideCard: { backgroundColor: "#ffffff", borderRadius: "24px", padding: "40px", border: "3px solid #000" },
  sectionTitle: { fontSize: "1.5rem", fontWeight: "900", color: "#000", margin: 0, fontFamily: "Georgia, serif" },
  dropdownMini: { padding: "8px 16px", borderRadius: "10px", border: "2px solid #000", backgroundColor: "#f8fafc", fontSize: "0.9rem", color: "#000", fontWeight: "800", outline: "none", cursor: "pointer" },
  
  // TABEL MANAJEMEN ROMBONGAN
  grupRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 25px", border: "2px solid #000", borderRadius: "16px", cursor: "pointer", transition: "all 0.2s ease" },
  iconGrup: { width: "50px", height: "50px", borderRadius: "12px", border: "2px solid #000", backgroundColor: "#f1f5f9", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.5rem" },
  btnBackOutline: { marginBottom: "25px", padding: "12px 24px", backgroundColor: "#fff", border: "2px solid #000", borderRadius: "12px", fontWeight: "900", cursor: "pointer", transition: "all 0.2s" },
  
  tabelData: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
  thRow: { borderBottom: "3px solid #000" },
  thCell: { padding: "15px", textAlign: "left", fontSize: "0.9rem", fontWeight: "900", color: "#000", textTransform: "uppercase" },
  tbRow: { borderBottom: "1px solid #e2e8f0" },
  tdCell: { padding: "18px 15px", color: "#000" },

  // TOGGLE SWITCH BWM
  criteriaRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderRadius: "12px", border: "2px solid #000", backgroundColor: "#f8fafc" },
  toggleContainer: { width: "56px", height: "32px", borderRadius: "16px", padding: "2px", border: "2px solid #000", cursor: "pointer", transition: "background-color 0.3s ease" },
  toggleCircle: { width: "24px", height: "24px", borderRadius: "50%", border: "2px solid #000", transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)" },

  // CSS PROGRESS BARS
  progressBarBg: { width: "100%", height: "12px", backgroundColor: "#fff", border: "2px solid #000", borderRadius: "6px", overflow: "hidden", flex: 1 },
  progressBarFill: { height: "100%", borderRadius: "0" },

  fadeAnimation: { animation: "fadeIn 0.3s ease-in-out" }
};