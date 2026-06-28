// "use client";

// import React, { useState } from "react";
// import Link from "next/link";

// const tutorialSteps = [
//   {
//     id: "ketua",
//     stepNum: "01",
//     title: "Inisiasi Ruang (Ketua)",
//     heading: "Membuat Ruang Kolaborasi Rombongan",
//     desc: "Sebagai inisiator (Ketua), langkah pertama adalah mendaftarkan profil grup Anda. Masukkan nama entitas rombongan dan estimasi jumlah anggota yang akan berpartisipasi. Sistem akan mengenerate sebuah kode akses unik.",
//     highlight: "Kode unik ini (misal: JOG-8431) bersifat rahasia dan menjadi kunci utama bagi anggota untuk masuk ke sesi."
//   },
//   {
//     id: "anggota",
//     stepNum: "02",
//     title: "Autentikasi (Anggota)",
//     heading: "Bergabung ke Sesi Pengambilan Keputusan",
//     desc: "Anggota rombongan menggunakan kode akses dari Ketua untuk masuk ke dalam portal. Sistem akan secara otomatis memverifikasi dan menyinkronkan data anggota dengan grup yang bersangkutan untuk memastikan validitas.",
//     highlight: "Pastikan kode dimasukkan dengan tepat untuk menghindari kegagalan autentikasi sinkronisasi lokal."
//   },
//   {
//     id: "bwm",
//     stepNum: "03",
//     title: "Evaluasi BWM",
//     heading: "Penentuan Bobot Kriteria via Best-Worst Method",
//     desc: "Anggota akan dihadapkan pada instrumen kuesioner BWM. Anda diminta menentukan satu kriteria Paling Penting (Best) dan Paling Tidak Penting (Worst), lalu memberikan komparasi skala 1-9 terhadap kriteria lainnya.",
//     highlight: "Pendekatan BWM ini sangat efektif untuk mencegah inkonsistensi yang sering terjadi pada voting manual."
//   },
//   {
//     id: "topsis",
//     stepNum: "04",
//     title: "Kalkulasi TOPSIS",
//     heading: "Agregasi Hasil & Rekomendasi Destinasi",
//     desc: "Sistem secara real-time memantau masuknya vektor preferensi anggota. Setelah target data terpenuhi, algoritma TOPSIS akan menghitung jarak solusi ideal dan memberikan peringkat destinasi wisata yang paling optimal.",
//     highlight: "Ketua memegang kendali penuh untuk memantau progres secara live dan mengunci hasil (finalisasi) secara mutlak."
//   }
// ];

// export default function PanduanPage() {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [hoverBtn, setHoverBtn] = useState<string | null>(null);

//   const nextSlide = () => {
//     if (currentSlide < tutorialSteps.length - 1) {
//       setCurrentSlide(currentSlide + 1);
//     }
//   };

//   const prevSlide = () => {
//     if (currentSlide > 0) {
//       setCurrentSlide(currentSlide - 1);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       {/* NAVBAR */}
//       <nav style={styles.navbar}>
//         <div style={styles.logo}>
//           <div style={styles.logoIcon}>
//             <div style={styles.logoLeaf1} />
//             <div style={styles.logoLeaf2} />
//             <div style={styles.logoLeaf3} />
//           </div>
//           Mlampah Jogja
//         </div>
//         <Link 
//           href="/" 
//           style={{
//             ...styles.btnBack,
//             backgroundColor: hoverBtn === "back" ? "#000" : "#fff",
//             color: hoverBtn === "back" ? "#B3EBF2" : "#000"
//           }}
//           onMouseEnter={() => setHoverBtn("back")}
//           onMouseLeave={() => setHoverBtn(null)}
//         >
//           ⬅ Kembali ke Beranda
//         </Link>
//       </nav>

//       <main style={styles.mainContent}>
//         <div style={styles.header}>
//           <h1 style={styles.title}>Panduan Penggunaan</h1>
//           <p style={styles.subtitle}>
//             Pelajari cara kerja sistem kami untuk menemukan preferensi terbaik kelompok wisata Anda.
//           </p>
//         </div>

//         {/* WRAPPER ANTI-BUG: 
//           Lebarnya 100% layar (100vw), dan memotong apa pun yang keluar dari batas layar.
//           Ini yang mencegah background terpotong/melar menjadi putih!
//         */}
//         <div style={styles.sliderOverflowWrapper}>
          
//           {/* WINDOW SLIDER (Area di tengah yang membatasi ukuran 1 kartu) */}
//           <div style={styles.sliderWindow}>
            
//             {/* TRACK SLIDER (Rel kereta yang bergeser ke kiri/kanan) */}
//             <div style={{
//               ...styles.sliderTrack,
//               transform: `translateX(calc(-${currentSlide * 100}% - ${currentSlide * 30}px))`
//             }}>
//               {tutorialSteps.map((step, index) => {
//                 const isActive = index === currentSlide;
                
//                 return (
//                   <div key={step.id} style={styles.slideItem}>
//                     <div style={{
//                       ...styles.slideCard,
//                       opacity: isActive ? 1 : 0.4,
//                       transform: isActive ? "scale(1)" : "scale(0.85)",
//                       pointerEvents: isActive ? "auto" : "none"
//                     }}>
//                       <div style={styles.stepBadge}>TAHAP {step.stepNum} &mdash; {step.title.toUpperCase()}</div>
//                       <h2 style={styles.contentHeading}>{step.heading}</h2>
//                       <p style={styles.contentDesc}>{step.desc}</p>
                      
//                       <div style={styles.highlightBox}>
//                         <div style={styles.highlightIcon}>💡</div>
//                         <span style={styles.highlightText}>{step.highlight}</span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* TOMBOL KIRI (PREV) */}
//             <button 
//               onClick={prevSlide} 
//               disabled={currentSlide === 0}
//               onMouseEnter={() => setHoverBtn("prev")}
//               onMouseLeave={() => setHoverBtn(null)}
//               style={{
//                 ...styles.navButton, 
//                 left: "-25px", 
//                 opacity: currentSlide === 0 ? 0 : 1,
//                 cursor: currentSlide === 0 ? "default" : "pointer",
//                 backgroundColor: hoverBtn === "prev" ? "#000" : "#fff",
//                 color: hoverBtn === "prev" ? "#B3EBF2" : "#000"
//               }}
//             >
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
//             </button>

//             {/* TOMBOL KANAN (NEXT) */}
//             <button 
//               onClick={nextSlide} 
//               disabled={currentSlide === tutorialSteps.length - 1}
//               onMouseEnter={() => setHoverBtn("next")}
//               onMouseLeave={() => setHoverBtn(null)}
//               style={{
//                 ...styles.navButton, 
//                 right: "-25px",
//                 opacity: currentSlide === tutorialSteps.length - 1 ? 0 : 1,
//                 cursor: currentSlide === tutorialSteps.length - 1 ? "default" : "pointer",
//                 backgroundColor: hoverBtn === "next" ? "#000" : "#B3EBF2",
//                 color: hoverBtn === "next" ? "#fff" : "#000"
//               }}
//             >
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
//             </button>

//           </div>
//         </div>

//         {/* PROGRESS DOTS */}
//         <div style={styles.dotsContainer}>
//           {tutorialSteps.map((_, index) => (
//             <div 
//               key={`dot-${index}`} 
//               onClick={() => setCurrentSlide(index)}
//               style={{
//                 ...styles.dot,
//                 width: currentSlide === index ? "35px" : "12px",
//                 backgroundColor: currentSlide === index ? "#B3EBF2" : "#e2e8f0",
//                 borderColor: currentSlide === index ? "#000" : "transparent"
//               }}
//             />
//           ))}
//         </div>

//       </main>
//     </div>
//   );
// }

// // === PREMIUM CLEAN OUTLINE & PASTEL BLUE GRADIENT THEME ===
// const styles: { [key: string]: React.CSSProperties } = {
//   // Fix background bug: width & maxWidth 100%, dan posisi background di-fix
//   container: { 
//     minHeight: "100vh", 
//     width: "100%",
//     maxWidth: "100vw",
//     // Gradasi Biru ke Putih + Gambar Background
//     backgroundImage: `linear-gradient(to bottom right, rgba(138, 196, 246, 0.85), rgba(255, 255, 255, 0.95)), url('/bg-candi.jpg')`, 
//     backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed",
//     color: "#000", fontFamily: "system-ui, -apple-system, sans-serif",
//     display: "flex", flexDirection: "column",
//     overflowX: "hidden" 
//   },
  
//   // NAVBAR (Border solid, tanpa shadow, warna putih)
//   navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 6%", borderBottom: "2px solid #000", backgroundColor: "#fff", position: "sticky", top: 0, zIndex: 100 },
//   logo: { display: "flex", alignItems: "center", gap: "12px", fontSize: "1.4rem", fontWeight: "900", color: "#000", letterSpacing: "1px"},
//   logoIcon: { position: "relative", width: "24px", height: "24px" },
//   logoLeaf1: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#B3EBF2", borderRadius: "2px 8px 2px 8px", top: 0, left: 0, border: "1px solid #000" },
//   logoLeaf2: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#B3EBF2", borderRadius: "8px 2px 8px 2px", top: 0, right: 0, border: "1px solid #000" },
//   logoLeaf3: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#B3EBF2", borderRadius: "8px 2px 8px 2px", bottom: 0, left: 0, border: "1px solid #000" },
//   btnBack: { color: "#000", textDecoration: "none", border: "2px solid #000", padding: "10px 22px", borderRadius: "10px", fontSize: "0.95rem", fontWeight: "800", transition: "all 0.2s" },
  
//   // KONTEN UTAMA
//   mainContent: { padding: "60px 0", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" },
//   header: { textAlign: "center", marginBottom: "50px", padding: "0 20px" },
//   title: { fontSize: "3rem", fontFamily: "Georgia, serif", color: "#000", margin: "0 0 15px 0", fontWeight: "900" },
//   subtitle: { fontSize: "1.15rem", color: "#333", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6", fontWeight: "600" },
  
//   // SLIDER WRAPPER (Anti-Bug: Mengamankan agar rel slider tidak menarik layar ke kanan)
//   sliderOverflowWrapper: { width: "100%", overflowX: "hidden", padding: "20px 0" },
  
//   // WINDOW SLIDER (Membatasi lebar kartu utama di tengah)
//   sliderWindow: { width: "100%", maxWidth: "800px", position: "relative", margin: "0 auto" },
  
//   // TRACK SLIDER (Container flex untuk menyusun kartu bersampingan)
//   sliderTrack: { display: "flex", gap: "30px", transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)" },
  
//   // INDIVIDU SLIDE (Lebarnya proporsional 100% dari Window)
//   slideItem: { flex: "0 0 100%", transition: "all 0.6s ease" },
  
//   // KARTU DALAM SLIDE (Clean Outline, NO SHADOW, dengan warna Pastel Blue)
//   slideCard: { 
//     width: "100%", backgroundColor: "#fff", border: "2px solid #000", borderRadius: "24px",
//     padding: "60px 50px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
//     textAlign: "center", height: "450px", transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)"
//   },
  
//   stepBadge: { display: "inline-block", backgroundColor: "#B3EBF2", color: "#000", padding: "8px 18px", borderRadius: "12px", border: "2px solid #000", fontSize: "0.85rem", fontWeight: "900", letterSpacing: "1px", marginBottom: "30px" },
//   contentHeading: { fontSize: "2.4rem", color: "#000", margin: "0 0 25px 0", fontFamily: "Georgia, serif", fontWeight: "900", lineHeight: "1.3" },
//   contentDesc: { fontSize: "1.1rem", color: "#333", lineHeight: "1.8", margin: "0 auto 40px auto", maxWidth: "700px", fontWeight: "600" },
  
//   highlightBox: { display: "flex", gap: "15px", backgroundColor: "#f8fafc", padding: "20px 25px", borderRadius: "16px", border: "2px dashed #000", alignItems: "center", textAlign: "left", width: "100%", maxWidth: "700px" },
//   highlightIcon: { fontSize: "1.5rem" },
//   highlightText: { fontSize: "0.95rem", color: "#000", lineHeight: "1.6", fontWeight: "700" },

//   // TOMBOL NAVIGASI KIRI KANAN (Mengambang di luar pinggiran kartu utama)
//   navButton: {
//     position: "absolute", top: "50%", transform: "translateY(-50%)", width: "60px", height: "60px",
//     borderRadius: "50%", border: "2px solid #000", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 20, transition: "all 0.2s"
//   },

//   // PROGRESS DOTS
//   dotsContainer: { display: "flex", justifyContent: "center", gap: "10px", marginTop: "30px", zIndex: 10 },
//   dot: { height: "10px", borderRadius: "5px", transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)", cursor: "pointer", border: "2px solid" }
// };

"use client";

import React, { useState } from "react";
import Link from "next/link";

const tutorialSteps = [
  {
    id: "ketua",
    stepNum: "01",
    shortTitle: "Inisiasi Ruang",
    shortDesc: "Pembuatan sesi grup",
    title: "Inisiasi Ruang (Ketua)",
    heading: "Membuat Ruang Kolaborasi Rombongan",
    desc: "Sebagai inisiator (Ketua), langkah pertama adalah mendaftarkan profil grup Anda. Masukkan nama entitas rombongan dan estimasi jumlah anggota yang akan berpartisipasi. Sistem akan mengenerate sebuah kode akses unik.",
    highlight: "Pastikan kode unik ini (misal: JOG-8431) dirahasiakan dan menjadi kunci utama bagi anggota untuk masuk ke sesi."
  },
  {
    id: "anggota",
    stepNum: "02",
    shortTitle: "Autentikasi Anggota",
    shortDesc: "Masuk ke sistem",
    title: "Sesi Pengambilan Keputusan",
    heading: "Bergabung ke Sesi Pengambilan Keputusan",
    desc: "Anggota rombongan menggunakan kode akses dari Ketua untuk masuk ke dalam portal. Sistem akan secara otomatis memverifikasi dan menyinkronkan data anggota dengan grup yang bersangkutan untuk memastikan validitas.",
    highlight: "Pastikan kode dimasukkan dengan tepat untuk menghindari kegagalan autentikasi dan sinkronisasi data."
  },
  {
    id: "bwm",
    stepNum: "03",
    shortTitle: "Evaluasi Kriteria",
    shortDesc: "Isi preferensi anggota",
    title: "Evaluasi BWM",
    heading: "Penentuan Bobot Kriteria via Best-Worst Method",
    desc: "Anggota akan dihadapkan pada instrumen kuesioner BWM. Anda diminta menentukan satu kriteria Paling Penting (Best) dan Paling Tidak Penting (Worst), lalu memberikan komparasi skala 1-9 terhadap kriteria lainnya.",
    highlight: "Pendekatan BWM ini sangat efektif untuk mencegah inkonsistensi yang sering terjadi pada voting manual."
  },
  {
    id: "topsis",
    stepNum: "04",
    shortTitle: "Kalkulasi TOPSIS",
    shortDesc: "Proses perhitungan SPK",
    title: "Perhitungan Metode",
    heading: "Agregasi Hasil & Rekomendasi Destinasi",
    desc: "Sistem secara real-time memantau masuknya vektor preferensi anggota. Setelah target data terpenuhi, algoritma TOPSIS akan menghitung jarak solusi ideal dan memberikan peringkat destinasi wisata yang paling optimal.",
    highlight: "Ketua memegang kendali penuh untuk memantau progres secara live dan mengunci hasil (finalisasi) secara mutlak."
  }
];

export default function PanduanPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoverBtn, setHoverBtn] = useState<string | null>(null);

  const nextSlide = () => {
    if (currentSlide < tutorialSteps.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div style={styles.pageContainer}>
      
      {/* NAVBAR (REVISI: Bersih, tanpa menu tengah, tanpa emoji) */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>
          <div style={styles.logoIcon}>
            <div style={styles.logoLeaf1} />
            <div style={styles.logoLeaf2} />
            <div style={styles.logoLeaf3} />
          </div>
          <div>
            <h2 style={styles.brandTitle}>Mlampah Jogja</h2>
            <p style={styles.brandSubtitle}>Sistem Pendukung Keputusan Wisata</p>
          </div>
        </div>
        
        <Link 
          href="/" 
          onMouseEnter={() => setHoverBtn('back')}
          onMouseLeave={() => setHoverBtn(null)}
          style={{
            ...styles.btnBackOutline,
            backgroundColor: hoverBtn === 'back' ? "#f1f5f9" : "transparent",
            transform: hoverBtn === 'back' ? "translateY(-2px)" : "translateY(0)",
            boxShadow: hoverBtn === 'back' ? "0 4px 6px rgba(0,0,0,0.05)" : "none"
          }}
        >
          Kembali ke Beranda
        </Link>
      </nav>

      {/* HEADER SECTION */}
      <header style={styles.header}>
        <h1 style={styles.title}>Panduan Penggunaan</h1>
        <p style={styles.subtitle}>
          Pelajari cara kerja sistem kami untuk menemukan preferensi terbaik<br/>kelompok wisata Anda.
        </p>
        <div style={styles.greenLine}></div>
      </header>

      {/* KONTEN UTAMA (GRID 3 KOLOM) */}
      <main style={styles.mainContainer}>
        
        {/* KOLOM KIRI: TAHAPAN PANDUAN */}
        <aside style={styles.leftSidebar}>
          <div style={styles.sidebarCard}>
            <h4 style={styles.sidebarTitle}>TAHAPAN PANDUAN</h4>
            
            <div style={styles.stepsWrapper}>
              {/* Garis vertikal penghubung */}
              <div style={styles.stepVerticalLine}></div>
              
              {tutorialSteps.map((step, index) => {
                const isActive = index === currentSlide;
                return (
                  <div 
                    key={step.id} 
                    onClick={() => setCurrentSlide(index)}
                    style={{
                      ...styles.stepItem,
                      borderColor: isActive ? "#22c55e" : "transparent",
                      backgroundColor: isActive ? "#f0fdf4" : "transparent",
                      boxShadow: isActive ? "0 4px 15px rgba(34, 197, 94, 0.1)" : "none"
                    }}
                  >
                    <div style={{
                      ...styles.stepNumber,
                      backgroundColor: isActive ? "#16a34a" : "#f1f5f9",
                      color: isActive ? "#fff" : "#64748b",
                      border: isActive ? "none" : "1px solid #cbd5e1"
                    }}>
                      {step.stepNum}
                    </div>
                    <div>
                      <h5 style={{
                        ...styles.stepName,
                        color: isActive ? "#16a34a" : "#0f172a"
                      }}>{step.shortTitle}</h5>
                      <p style={styles.stepShortDesc}>{step.shortDesc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kotak Butuh Bantuan */}
          <div style={styles.helpCard}>
            <div style={{display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "15px"}}>
              <div style={styles.helpIcon}></div>
              <div>
                <h5 style={styles.helpTitle}>Butuh Bantuan?</h5>
                <p style={styles.helpDesc}>Pelajari panduan lengkap atau hubungi tim support.</p>
              </div>
            </div>
            <button style={styles.btnFaq}>Lihat FAQ ➔</button>
          </div>
        </aside>

        {/* KOLOM TENGAH: SLIDER KONTEN UTAMA */}
        <section style={styles.centerContent}>
          {/* Tombol Panah Kiri */}
          <button 
            onClick={prevSlide} 
            disabled={currentSlide === 0} 
            onMouseEnter={() => setHoverBtn("prev")}
            onMouseLeave={() => setHoverBtn(null)}
            style={{
              ...styles.arrowBtn, 
              left: "-25px", 
              opacity: currentSlide === 0 ? 0 : 1,
              backgroundColor: hoverBtn === "prev" ? "#f8fafc" : "#fff"
            }}
          >
            ❮
          </button>

          <div style={styles.sliderCard}>
            <div style={styles.sliderContentTop}>
              <div style={styles.slideBadgeContainer}>
                <span style={styles.slideBadge}>TAHAP {tutorialSteps[currentSlide].stepNum} &mdash; {tutorialSteps[currentSlide].title.toUpperCase()}</span>
              </div>
              <h2 style={styles.slideHeading}>{tutorialSteps[currentSlide].heading}</h2>
              <p style={styles.slideDesc}>{tutorialSteps[currentSlide].desc}</p>
              
              <div style={styles.highlightBox}>
                <div style={styles.highlightIcon}>💡</div>
                <div>
                  <strong style={{color: "#16a34a", fontSize: "0.9rem", display: "block", marginBottom: "2px"}}>Penting!</strong>
                  <span style={styles.highlightText}>{tutorialSteps[currentSlide].highlight}</span>
                </div>
              </div>
            </div>

            {/* Area Gambar Estetik di Bawah Kartu */}
            <div style={styles.sliderImageArea}>
              <div style={styles.dotsContainer}>
                {tutorialSteps.map((_, idx) => (
                  <div key={idx} style={{
                    ...styles.dot,
                    width: currentSlide === idx ? "20px" : "8px",
                    backgroundColor: currentSlide === idx ? "#22c55e" : "#e2e8f0"
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* Tombol Panah Kanan */}
          <button 
            onClick={nextSlide} 
            disabled={currentSlide === tutorialSteps.length - 1} 
            onMouseEnter={() => setHoverBtn("next")}
            onMouseLeave={() => setHoverBtn(null)}
            style={{
              ...styles.arrowBtn, 
              right: "-25px", 
              backgroundColor: hoverBtn === "next" ? "#15803d" : "#16a34a", 
              color: "#fff", 
              border: "none", 
              opacity: currentSlide === tutorialSteps.length - 1 ? 0 : 1
            }}
          >
            ❯
          </button>
        </section>

        {/* KOLOM KANAN: INFO TAMBAHAN */}
        <aside style={styles.rightSidebar}>
          {/* Kotak Apa yang dilakukan */}
          <div style={styles.infoCard}>
            <h4 style={styles.infoTitle}>Apa yang dilakukan di tahap ini?</h4>
            <div style={styles.infoList}>
              <div style={styles.infoItem}>
                <div style={styles.infoItemIcon}></div>
                <p style={styles.infoItemText}>Ketua membuat sesi pengambilan keputusan dan membagikan kode akses.</p>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoItemIcon}></div>
                <p style={styles.infoItemText}>Anggota memasukkan kode pada halaman login anggota.</p>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoItemIcon}></div>
                <p style={styles.infoItemText}>Sistem memverifikasi keanggotaan dan menghubungkan ke grup.</p>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoItemIcon}></div>
                <p style={styles.infoItemText}>Anggota siap untuk mengisi preferensi dan kriteria.</p>
              </div>
            </div>
          </div>

          {/* Kotak Tips */}
          <div style={styles.tipsCard}>
            <h4 style={styles.tipsTitle}>⭐ Tips</h4>
            <p style={styles.tipsDesc}>Pastikan koneksi internet stabil agar proses sinkronisasi data berjalan lancar.</p>
            <div style={{display: "flex", gap: "10px", alignItems: "flex-start", marginTop: "10px"}}>
              <span style={{fontSize: "1rem"}}></span>
              <p style={{margin: 0, fontSize: "0.8rem", color: "#64748b"}}>Gunakan browser terbaru untuk pengalaman terbaik.</p>
            </div>
          </div>
        </aside>

      </main>

      {/* BOTTOM FEATURES ROW */}
      <div style={styles.featuresRow}>
        <div style={styles.featureItem}>
          <div style={styles.featureIcon}></div>
          <div>
            <h5 style={styles.featureTitle}>Kolaboratif</h5>
            <p style={styles.featureDesc}>Keputusan dibuat bersama secara transparan</p>
          </div>
        </div>
        <div style={styles.featureItem}>
          <div style={styles.featureIcon}></div>
          <div>
            <h5 style={styles.featureTitle}>Aman</h5>
            <p style={styles.featureDesc}>Data anggota terlindungi dengan enkripsi</p>
          </div>
        </div>
        <div style={styles.featureItem}>
          <div style={styles.featureIcon}></div>
          <div>
            <h5 style={styles.featureTitle}>Cerdas</h5>
            <p style={styles.featureDesc}>Menggunakan metode BWM dan TOPSIS</p>
          </div>
        </div>
        <div style={styles.featureItem}>
          <div style={styles.featureIcon}></div>
          <div>
            <h5 style={styles.featureTitle}>Akurat</h5>
            <p style={styles.featureDesc}>Rekomendasi berdasarkan preferensi terbaik</p>
          </div>
        </div>
        <div style={styles.featureItem}>
          <div style={styles.featureIcon}></div>
          <div>
            <h5 style={styles.featureTitle}>Untuk Jogja</h5>
            <p style={styles.featureDesc}>Rekomendasi destinasi wisata terbaik di Yogyakarta</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// === PREMIUM CLEAN MODERN CSS IN JS ===
const styles: { [key: string]: React.CSSProperties } = {
  // Latar Belakang sangat halus, warna dasar putih/abu-abu terang dengan gambar transparan
  pageContainer: { 
    minHeight: "100vh", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", width: "100%", maxWidth: "100vw", boxSizing: "border-box",
    backgroundColor: "#f8fafc",
    backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9)), url('/bg-candi.jpg')`, 
    backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed",
    display: "flex", flexDirection: "column", overflowX: "hidden", margin: 0, padding: 0
  },
  
  // NAVBAR
  navbar: { width: "100%", boxSizing: "border-box", height: "80px", padding: "0 6%", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid #f1f5f9", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" },
  navBrand: { display: "flex", alignItems: "center", gap: "12px" }, 
  logoIcon: { position: "relative", width: "24px", height: "24px" },
  logoLeaf1: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#84cc16", borderRadius: "2px 8px 2px 8px", top: 0, left: 0 },
  logoLeaf2: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#4d7c0f", borderRadius: "8px 2px 8px 2px", top: 0, right: 0 },
  logoLeaf3: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#65a30d", borderRadius: "8px 2px 8px 2px", bottom: 0, left: 0 },
  brandTitle: { margin: 0, fontSize: "1.1rem", fontWeight: "800", color: "#0f172a" }, 
  brandSubtitle: { margin: 0, fontSize: "0.75rem", color: "#64748b", fontWeight: "500" },
  
  btnBackOutline: { padding: "10px 20px", borderRadius: "20px", border: "1px solid #cbd5e1", color: "#0f172a", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600", transition: "all 0.2s" },
  
  // HEADER
  header: { textAlign: "center", padding: "50px 20px 30px 20px" },
  title: { fontSize: "2.5rem", color: "#0f172a", margin: "0 0 10px 0", fontWeight: "900", letterSpacing: "-0.5px" },
  subtitle: { fontSize: "1rem", color: "#64748b", margin: "0 auto", lineHeight: "1.6" },
  greenLine: { width: "40px", height: "4px", backgroundColor: "#16a34a", borderRadius: "2px", margin: "20px auto 0 auto" },
  
  // GRID UTAMA
  mainContainer: { display: "flex", justifyContent: "center", alignItems: "stretch", padding: "0 4%", gap: "30px", maxWidth: "1400px", margin: "0 auto", flexWrap: "wrap" },
  
  // KOLOM KIRI (STEPS)
  leftSidebar: { flex: "1 1 250px", maxWidth: "300px", display: "flex", flexDirection: "column", gap: "20px" },
  sidebarCard: { backgroundColor: "#fff", borderRadius: "20px", padding: "25px 20px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9" },
  sidebarTitle: { fontSize: "0.8rem", color: "#94a3b8", fontWeight: "700", margin: "0 0 20px 0", textTransform: "uppercase", letterSpacing: "1px" },
  stepsWrapper: { position: "relative", display: "flex", flexDirection: "column", gap: "10px" },
  stepVerticalLine: { position: "absolute", left: "15px", top: "10px", bottom: "30px", width: "1px", backgroundColor: "#e2e8f0", zIndex: 0 },
  stepItem: { position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "15px", padding: "12px 15px", borderRadius: "12px", border: "1px solid", cursor: "pointer", transition: "all 0.2s" },
  stepNumber: { width: "30px", height: "30px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "0.8rem", fontWeight: "700", flexShrink: 0 },
  stepName: { margin: 0, fontSize: "0.95rem", fontWeight: "700" },
  stepShortDesc: { margin: "2px 0 0 0", fontSize: "0.75rem", color: "#94a3b8" },
  
  helpCard: { backgroundColor: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9" },
  helpIcon: { fontSize: "1.8rem", color: "#16a34a" },
  helpTitle: { margin: "0 0 5px 0", fontSize: "0.95rem", fontWeight: "700", color: "#16a34a" },
  helpDesc: { margin: 0, fontSize: "0.8rem", color: "#64748b", lineHeight: "1.5" },
  btnFaq: { width: "100%", padding: "10px", marginTop: "15px", borderRadius: "10px", border: "1px solid #cbd5e1", backgroundColor: "#fff", color: "#0f172a", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" },

  // KOLOM TENGAH (SLIDER)
  centerContent: { flex: "2 1 600px", position: "relative", display: "flex", alignItems: "center" },
  sliderCard: { width: "100%", backgroundColor: "#fff", borderRadius: "24px", overflow: "hidden", boxShadow: "0 15px 40px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", display: "flex", flexDirection: "column" },
  sliderContentTop: { padding: "50px 60px 40px 60px", textAlign: "center", flex: 1 },
  slideBadgeContainer: { marginBottom: "25px" },
  slideBadge: { backgroundColor: "#f0fdf4", color: "#16a34a", padding: "6px 16px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "800", letterSpacing: "1px", border: "1px solid #bbf7d0" },
  slideHeading: { fontSize: "2.2rem", color: "#0f172a", margin: "0 0 20px 0", fontFamily: "Georgia, serif", fontWeight: "900", lineHeight: "1.3" },
  slideDesc: { fontSize: "1rem", color: "#475569", lineHeight: "1.7", margin: "0 auto 30px auto", maxWidth: "90%" },
  
  highlightBox: { display: "flex", gap: "15px", backgroundColor: "#f8fafc", padding: "20px 30px", borderRadius: "16px", border: "1px dashed #22c55e", textAlign: "left", maxWidth: "90%", margin: "0 auto" },
  highlightIcon: { fontSize: "1.5rem" },
  highlightText: { fontSize: "0.85rem", color: "#475569", lineHeight: "1.5", fontWeight: "500" },
  
  sliderImageArea: { height: "180px", backgroundImage: `url('/background2.jpg')`, backgroundSize: "cover", backgroundPosition: "center", position: "relative", display: "flex", justifyContent: "center", alignItems: "flex-end", paddingBottom: "20px" },
  
  arrowBtn: { position: "absolute", top: "50%", transform: "translateY(-50%)", width: "50px", height: "50px", borderRadius: "50%", border: "1px solid #e2e8f0", color: "#0f172a", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10, cursor: "pointer", boxShadow: "0 5px 15px rgba(0,0,0,0.08)", fontSize: "1.2rem", transition: "all 0.2s" },

  dotsContainer: { display: "flex", gap: "8px", backgroundColor: "rgba(255,255,255,0.8)", padding: "8px 15px", borderRadius: "20px", backdropFilter: "blur(4px)" },
  dot: { height: "8px", borderRadius: "4px", transition: "all 0.3s ease", cursor: "pointer" },

  // KOLOM KANAN (INFO & TIPS)
  rightSidebar: { flex: "1 1 250px", maxWidth: "300px", display: "flex", flexDirection: "column", gap: "20px" },
  infoCard: { backgroundColor: "#fff", borderRadius: "20px", padding: "25px 20px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9" },
  infoTitle: { fontSize: "0.95rem", color: "#0f172a", fontWeight: "800", margin: "0 0 20px 0" },
  infoList: { display: "flex", flexDirection: "column", gap: "20px" },
  infoItem: { display: "flex", gap: "15px", alignItems: "flex-start" },
  infoItemIcon: { width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#f0fdf4", display: "flex", justifyContent: "center", alignItems: "center", color: "#16a34a", fontSize: "1rem", flexShrink: 0 },
  infoItemText: { margin: 0, fontSize: "0.8rem", color: "#475569", lineHeight: "1.5" },

  tipsCard: { backgroundColor: "#fefce8", borderRadius: "20px", padding: "25px 20px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid #fef08a" },
  tipsTitle: { margin: "0 0 10px 0", fontSize: "0.95rem", color: "#b45309", fontWeight: "800" },
  tipsDesc: { margin: 0, fontSize: "0.8rem", color: "#78350f", lineHeight: "1.6" },

  // BOTTOM FEATURES
  featuresRow: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "15px", padding: "20px", backgroundColor: "#fff", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9", margin: "40px auto 50px auto", maxWidth: "1400px", width: "92%" },
  featureItem: { flex: "1 1 200px", display: "flex", alignItems: "center", gap: "15px", padding: "10px" },
  featureIcon: { width: "45px", height: "45px", borderRadius: "50%", backgroundColor: "#f0fdf4", color: "#16a34a", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.2rem", flexShrink: 0 },
  featureTitle: { margin: "0 0 4px 0", fontSize: "0.9rem", color: "#0f172a", fontWeight: "700" },
  featureDesc: { margin: 0, fontSize: "0.75rem", color: "#64748b", lineHeight: "1.4" }
};