// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase"; 

// // === GAMBAR LOKAL ===
// const wisataList = [
//   { id: 1, nama: "Candi Prambanan", desc: "Candi peninggalan majapahit dengan pesona luar biasa.", img: "/wisata/prambanan.jpg" },
//   { id: 2, nama: "Jalan Malioboro", desc: "Jantung budaya dan pusat belanja legendaris Jogja.", img: "/wisata/malioboro.jpg" },
//   { id: 3, nama: "Taman Sari", desc: "Istana air penuh sejarah peninggalan Sultan keraton.", img: "/wisata/tamansari.jpg" }
// ];

// export default function ClaudeStyleLanding() {
//   const router = useRouter();
  
//   // === STATE MODAL (POP-UP) ===
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modeForm, setModeForm] = useState<"PILIH_ROLE" | "ANGGOTA" | "LOGIN_KETUA" | "REGISTER_KETUA" | "LOGIN_STAFF">("PILIH_ROLE");
//   const [hoverRole, setHoverRole] = useState<"ANGGOTA" | "KETUA" | null>(null);

//   // === STATE INTERAKTIF NAVBAR & TOMBOL ===
//   const [hoverNav, setHoverNav] = useState<string | null>(null);
//   const [hoverBtn, setHoverBtn] = useState<string | null>(null);
  
//   const [hoverAbout, setHoverAbout] = useState(false);
//   const [hoverPanduan, setHoverPanduan] = useState(false);
//   const [hoverAdmin, setHoverAdmin] = useState(false);
  
//   const [hoverLihatDestinasi, setHoverLihatDestinasi] = useState(false);
//   const [hoverPrev, setHoverPrev] = useState(false);
//   const [hoverNext, setHoverNext] = useState(false);
//   const [hoverSlideBtn, setHoverSlideBtn] = useState<number | null>(null);

//   // === STATE DATA INPUT ANGGOTA ===
//   const [kodeRuang, setKodeRuang] = useState("");
//   const [namaAnggota, setNamaAnggota] = useState("");
//   const [umur, setUmur] = useState("");
//   const [gender, setGender] = useState("L");

//   // === STATE DATA INPUT KETUA ===
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [namaLengkap, setNamaLengkap] = useState("");

//   // === STATE ANIMASI TEKS KIRI ===
//   const words = ["ribet.", "drama.", "debat.", "pusing."];
//   const [wordIndex, setWordIndex] = useState(0);
//   const [fade, setFade] = useState(true);

//   // === STATE SLIDER KANAN ===
//   const [currentSlide, setCurrentSlide] = useState(0);

//   useEffect(() => {
//     const textInterval = setInterval(() => {
//       setFade(false); 
//       setTimeout(() => {
//         setWordIndex((prev) => (prev + 1) % words.length); 
//         setFade(true); 
//       }, 400); 
//     }, 2500); 
//     return () => clearInterval(textInterval);
//   }, [words.length]);

//   useEffect(() => {
//     const slideInterval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % wisataList.length);
//     }, 5000); 
//     return () => clearInterval(slideInterval);
//   }, []);

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % wisataList.length);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + wisataList.length) % wisataList.length);
//   };

//   const handleGetStarted = () => {
//     setModeForm("PILIH_ROLE"); 
//     setIsModalOpen(true);
//   };

//   // === FUNGSI AUTH ANGGOTA ===
//   const handleMasukAnggota = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const { data: dataRuang, error: errRuang } = await supabase
//         .from('ruang')
//         .select('id_ruang, nama_grup')
//         .eq('kode_ruang', kodeRuang.toUpperCase())
//         .single();

//       if (errRuang || !dataRuang) {
//         alert("Kode Ruang tidak ditemukan atau tidak valid.");
//         return; 
//       }

//       const { data: existingUser } = await supabase
//         .from('user_anggota')
//         .select('id_user, id_ruang')
//         .eq('nama_anggota', namaAnggota)
//         .eq('kode_ruang', kodeRuang.toUpperCase())
//         .single();

//       let userId = existingUser?.id_user;
//       let finalIdRuang = dataRuang.id_ruang;

//       if (!existingUser) {
//         const { data: dataAnggotaBaru, error: errAnggota } = await supabase
//           .from('user_anggota')
//           .insert([{
//               kode_ruang: kodeRuang.toUpperCase(),
//               nama_anggota: namaAnggota,
//               usia: parseInt(umur),
//               gender: gender,
//               id_ruang: finalIdRuang 
//           }])
//           .select()
//           .single(); 

//         if (errAnggota) {
//           console.error("Supabase Insert Error:", errAnggota);
//           alert(`Gagal mendaftar: ${errAnggota.message}`);
//           return;
//         }
//         userId = dataAnggotaBaru.id_user;
//       }

//       localStorage.setItem("temp_anggota", JSON.stringify({ 
//         id_user: userId,
//         namaAnggota: namaAnggota, 
//         umur: umur, 
//         gender: gender, 
//         kodeRuang: kodeRuang.toUpperCase(),
//         id_ruang: finalIdRuang, 
//         nama_grup: dataRuang.nama_grup
//       }));
      
//       setIsModalOpen(false); 

//       const statusSubmit = localStorage.getItem(`status_submit_${kodeRuang.toUpperCase()}_${namaAnggota}`);
//       if (statusSubmit === "DONE") {
//         router.push('/kuesioner'); 
//       } else {
//         router.push('/anggota'); 
//       }
//     } catch (error) {
//        console.error("Terjadi kesalahan sistem:", error);
//        alert("Sistem sedang sibuk. Silakan coba lagi.");
//     }
//   };

//   // === FUNGSI AUTH KETUA ===
//   const handleAuthKetua = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (modeForm === "REGISTER_KETUA") {
//       const { error } = await supabase
//         .from('user_ketua') 
//         .insert([{ nama_lengkap: namaLengkap, username: username, password: password }]);

//       if (error) {
//         alert(`Pendaftaran gagal: ${error.message}`);
//       } else {
//         alert("Pendaftaran sukses! Silakan login untuk membuat ruang rombongan.");
//         setModeForm("LOGIN_KETUA"); 
//       }
      
//     } else if (modeForm === "LOGIN_KETUA") {
//       const { data, error } = await supabase
//         .from('user_ketua')
//         .select('*')
//         .eq('username', username)
//         .eq('password', password);

//       if (error) {
//         alert(`Error Supabase: ${error.message}`);
//       } else if (!data || data.length === 0) {
//         alert("Username atau Password salah!");
//       } else {
//         const user = data[0]; 
//         localStorage.setItem("temp_ketua", JSON.stringify({ 
//           id_ketua: user.id_ketua,          
//           nama_lengkap: user.nama_lengkap,   
//           username_login: user.username      
//         }));
        
//         setIsModalOpen(false); 
//         window.open('/ketua', '_blank'); 
//       }
//     }
//   };

//   const handleAuthStaff = (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsModalOpen(false); 
//     window.open('/staff', '_blank');
//   };

//   return (
//     <div style={styles.pageContainer}>
      
//       {/* HEADER NAVBAR (Clean White Premium) */}
//       <nav style={styles.navbar}>
//         <div 
//           style={{...styles.logo, transform: hoverNav === "logo" ? "scale(1.02)" : "scale(1)"}}
//           onClick={() => router.push('/')}
//           onMouseEnter={() => setHoverNav("logo")}
//           onMouseLeave={() => setHoverNav(null)}
//         >
//           <div style={styles.logoIcon}>
//             <div style={styles.logoLeaf1} />
//             <div style={styles.logoLeaf2} />
//             <div style={styles.logoLeaf3} />
//           </div>
//           Mlampah Jogja
//         </div>
        
//         {/* Actions Kanan (Sesuai Permintaan: About & Portal Admin disamakan warnanya) */}
//         <div style={styles.navRightActions}>
//           <button 
//             style={{
//               ...styles.btnNavPrimary,
//               backgroundColor: hoverAbout ? "#365314" : "#4d7c0f",
//               transform: hoverAbout ? "translateY(-1px)" : "translateY(0)"
//             }} 
//             onClick={() => router.push('/about')}
//             onMouseEnter={() => setHoverAbout(true)}
//             onMouseLeave={() => setHoverAbout(false)}
//           >
//             <span style={{marginRight: "6px"}}>ⓘ</span> About
//           </button>
          
//           <button 
//             style={{
//               ...styles.btnNavOutline,
//               backgroundColor: hoverPanduan ? "#f7fee7" : "#fff",
//               borderColor: hoverPanduan ? "#4d7c0f" : "#cbd5e1",
//               color: hoverPanduan ? "#4d7c0f" : "#334155",
//               transform: hoverPanduan ? "translateY(-1px)" : "translateY(0)"
//             }} 
//             onClick={() => window.open('/panduan', '_blank')}
//             onMouseEnter={() => setHoverPanduan(true)}
//             onMouseLeave={() => setHoverPanduan(false)}
//           >
//             <span style={{marginRight: "6px"}}>📄</span> Panduan
//           </button>

//           <button 
//             style={{
//               ...styles.btnNavPrimary,
//               backgroundColor: hoverAdmin ? "#365314" : "#4d7c0f",
//               transform: hoverAdmin ? "translateY(-1px)" : "translateY(0)"
//             }} 
//             onClick={() => { setModeForm("LOGIN_STAFF"); setIsModalOpen(true); }}
//             onMouseEnter={() => setHoverAdmin(true)}
//             onMouseLeave={() => setHoverAdmin(false)}
//           >
//             <span style={{marginRight: "6px"}}>🔒</span> Portal Admin
//           </button>
//         </div>
//       </nav>

//       {/* KONTEN UTAMA */}
//       <main style={styles.heroContent}>
//         <div style={styles.textSide}>
//           <div style={styles.badgeTop}>
//             <span style={{color: "#4d7c0f", marginRight: "6px"}}>🌱</span> 
//             Explore Jogja
//           </div>
          
//           <h1 style={styles.mainTitle}>
//             Liburan rombongan <br/>bebas <span style={{...styles.slidingWord, opacity: fade ? 1 : 0}}>{words[wordIndex]}</span><br/>
//             Keputusan lebih cepat.
//           </h1>
          
//           <p style={styles.description}>
//             Nikmati pengalaman merencanakan wisata kelompok yang lebih mudah dengan algoritma cerdas pemilih destinasi terbaik di Yogyakarta.
//           </p>

//           <div style={{ marginTop: "40px", display: "flex", gap: "15px", alignItems: "center" }}>
//             <button 
//               onClick={handleGetStarted} 
//               onMouseEnter={() => setHoverBtn("start")}
//               onMouseLeave={() => setHoverBtn(null)}
//               style={{
//                 ...styles.btnGetStarted,
//                 transform: hoverBtn === "start" ? "translateY(-2px)" : "translateY(0)",
//                 boxShadow: hoverBtn === "start" ? "0 10px 25px rgba(77, 124, 15, 0.3)" : "none"
//               }}
//             >
//               Mulai Sekarang ➔
//             </button>
//             <button 
//               onClick={() => window.open('/eksplorasi', '_blank')}
//               onMouseEnter={() => setHoverLihatDestinasi(true)}
//               onMouseLeave={() => setHoverLihatDestinasi(false)}
//               style={{
//                 ...styles.btnSecondary,
//                 backgroundColor: hoverLihatDestinasi ? "#f8fafc" : "#fff",
//                 transform: hoverLihatDestinasi ? "translateY(-2px)" : "translateY(0)"
//               }}
//             >
//               Eksplorasi Wisata 📍
//             </button>
//           </div>
//         </div>

//         {/* SLIDER GAMBAR KANAN (TANPA KOTAK HITAM & AVATAR) */}
//         <div style={styles.sliderSide}>
//           <div style={styles.sliderWrapper}>
//             {wisataList.map((wisata, index) => (
//               <div key={wisata.id} style={{
//                 ...styles.slideItem,
//                 opacity: currentSlide === index ? 1 : 0,
//                 transform: currentSlide === index ? "scale(1)" : "scale(1.05)",
//                 // Gradient ini dibuat tebal di bawah agar tulisan putih tetap terbaca sempurna
//                 backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.4) 40%, rgba(0, 0, 0, 0) 100%), url('${wisata.img}')`,
//               }}>
                
//                 {/* Info Text Lagsung di atas gambar */}
//                 <div style={styles.floatingInfoBox}>
//                   <div style={styles.slideBadge}>Populer</div>
//                   <h3 style={styles.slideTitle}>{wisata.nama}</h3>
//                   <p style={styles.slideDesc}>{wisata.desc}</p>
                  
//                   <div style={{marginTop: "25px"}}>
//                     <button 
//                       onClick={() => window.open('/eksplorasi', '_blank')}
//                       onMouseEnter={() => setHoverSlideBtn(index)}
//                       onMouseLeave={() => setHoverSlideBtn(null)}
//                       style={{
//                         ...styles.btnExploreSlide,
//                         backgroundColor: hoverSlideBtn === index ? "#fff" : "rgba(255,255,255,0.15)",
//                         color: hoverSlideBtn === index ? "#0f172a" : "#fff",
//                         borderColor: hoverSlideBtn === index ? "#fff" : "rgba(255,255,255,0.6)"
//                       }}
//                     >
//                       Lihat Selengkapnya ➔
//                     </button>
//                   </div>
//                 </div>

//               </div>
//             ))}
//           </div>

//           {/* Vertical Controls (Interaktif) */}
//           <div style={styles.verticalControls}>
//               <button 
//                 onClick={prevSlide}
//                 onMouseEnter={() => setHoverPrev(true)}
//                 onMouseLeave={() => setHoverPrev(false)}
//                 style={{...styles.controlBtnRound, backgroundColor: hoverPrev ? "#4d7c0f" : "#fff", color: hoverPrev ? "#fff" : "#64748b"}}
//               >
//                 ᐱ
//               </button>
//               <div style={styles.controlDivider}></div>
//               <button 
//                 onClick={nextSlide}
//                 onMouseEnter={() => setHoverNext(true)}
//                 onMouseLeave={() => setHoverNext(false)}
//                 style={{...styles.controlBtnRound, backgroundColor: hoverNext ? "#4d7c0f" : "#fff", color: hoverNext ? "#fff" : "#64748b"}}
//               >
//                 ᐯ
//               </button>
//           </div>
//         </div>
//       </main>

//       {/* FOOTER */}
//       <footer style={styles.footer}>
//         <p style={styles.footerText}>&copy; Website Mlampah Jogja &bull; By Kelompok 02 APSI TI UNS</p>
//       </footer>

//       {/* POP-UP MODAL (Modern Clean Design) */}
//       {isModalOpen && (
//         <div style={styles.modalOverlay}>
//           <div style={{...styles.formContainer, maxWidth: modeForm === "PILIH_ROLE" ? "700px" : "450px", padding: modeForm === "PILIH_ROLE" ? "50px" : "40px"}}>
//             <button onClick={() => setIsModalOpen(false)} style={styles.btnClose}>✕</button>

//             {/* TAHAP 1 POP-UP: PILIH ROLE */}
//             {modeForm === "PILIH_ROLE" && (
//               <>
//                 <div style={styles.cardHeader}>
//                   <h3 style={styles.cardTitle}>Pilih Peran Anda</h3>
//                 </div>
//                 <p style={{textAlign: "center", color: "#64748b", marginBottom: "40px", fontSize: "1rem"}}>Silakan pilih jalur akses untuk melanjutkan ke dalam sistem Mlampah Jogja.</p>
                
//                 <div style={styles.roleGridContainer}>
//                   <div 
//                     onClick={() => setModeForm("ANGGOTA")}
//                     onMouseEnter={() => setHoverRole("ANGGOTA")}
//                     onMouseLeave={() => setHoverRole(null)}
//                     style={{...styles.roleCard, borderColor: hoverRole === "ANGGOTA" ? "#4d7c0f" : "#e2e8f0", backgroundColor: hoverRole === "ANGGOTA" ? "#f7fee7" : "#fff", transform: hoverRole === "ANGGOTA" ? "translateY(-4px)" : "translateY(0)", boxShadow: hoverRole === "ANGGOTA" ? "0 15px 30px rgba(77, 124, 15, 0.1)" : "none"}}
//                   >
//                     <div style={{...styles.iconContainer, backgroundColor: hoverRole === "ANGGOTA" ? "#4d7c0f" : "#f1f5f9"}}>
//                       <img src="/group rombongan.png" alt="Ikon Anggota" style={{ width: "45px", height: "45px", objectFit: "contain", filter: hoverRole === "ANGGOTA" ? "brightness(0) invert(1)" : "none" }} />
//                     </div>
//                     <h4 style={styles.roleCardTitle}>Anggota Rombongan</h4>
//                     <p style={styles.roleCardDesc}>Masuk dengan kode untuk mengisi kuesioner voting wisata.</p>
//                   </div>

//                   <div 
//                     onClick={() => setModeForm("LOGIN_KETUA")}
//                     onMouseEnter={() => setHoverRole("KETUA")}
//                     onMouseLeave={() => setHoverRole(null)}
//                     style={{...styles.roleCard, borderColor: hoverRole === "KETUA" ? "#4d7c0f" : "#e2e8f0", backgroundColor: hoverRole === "KETUA" ? "#f7fee7" : "#fff", transform: hoverRole === "KETUA" ? "translateY(-4px)" : "translateY(0)", boxShadow: hoverRole === "KETUA" ? "0 15px 30px rgba(77, 124, 15, 0.1)" : "none"}}
//                   >
//                     <div style={{...styles.iconContainer, backgroundColor: hoverRole === "KETUA" ? "#4d7c0f" : "#f1f5f9"}}>
//                       <img src="/icon-ketua.png" alt="Ikon Ketua" style={{ width: "45px", height: "45px", objectFit: "contain", filter: hoverRole === "KETUA" ? "brightness(0) invert(1)" : "none" }} />
//                     </div>
//                     <h4 style={styles.roleCardTitle}>Ketua Rombongan</h4>
//                     <p style={styles.roleCardDesc}>Buat dan kelola ruang voting rombongan secara komprehensif.</p>
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* TAHAP 2: ANGGOTA */}
//             {modeForm === "ANGGOTA" && (
//               <>
//                 <div style={styles.cardHeader}>
//                   <h3 style={styles.cardTitle}>Masuk Anggota</h3>
//                 </div>
//                 <form onSubmit={handleMasukAnggota} style={styles.formElement}>
//                   <div>
//                     <label style={styles.labelForm}>Kode Ruang</label>
//                     <input type="text" placeholder="Cth: JOG-1234" required value={kodeRuang} onChange={e => setKodeRuang(e.target.value.toUpperCase())} style={styles.inputField} />
//                   </div>
//                   <div>
//                     <label style={styles.labelForm}>Nama Lengkap</label>
//                     <input type="text" placeholder="Masukkan nama Anda" required value={namaAnggota} onChange={e => setNamaAnggota(e.target.value)} style={styles.inputField} />
//                   </div>
//                   <div style={{display: "flex", gap: "15px"}}>
//                     <div style={{flex: 1}}>
//                       <label style={styles.labelForm}>Usia</label>
//                       <input type="number" placeholder="Tahun" required value={umur} onChange={e => setUmur(e.target.value)} style={styles.inputField} />
//                     </div>
//                     <div style={{flex: 1}}>
//                       <label style={styles.labelForm}>Gender</label>
//                       <select value={gender} onChange={e => setGender(e.target.value)} style={styles.inputField}>
//                         <option value="L">Laki-laki</option>
//                         <option value="P">Perempuan</option>
//                       </select>
//                     </div>
//                   </div>
//                   <button type="submit" style={styles.submitButtonForm}>Masuk Ruang ➔</button>
//                   <button type="button" onClick={() => setModeForm("PILIH_ROLE")} style={styles.btnBack}>⬅ Kembali</button>
//                 </form>
//               </>
//             )}

//             {/* TAHAP 2: KETUA */}
//             {(modeForm === "LOGIN_KETUA" || modeForm === "REGISTER_KETUA") && (
//               <>
//                 <div style={styles.cardHeader}>
//                   <h3 style={styles.cardTitle}>
//                     {modeForm === "LOGIN_KETUA" ? "Login Ketua" : "Daftar Ketua"}
//                   </h3>
//                 </div>
//                 <form onSubmit={handleAuthKetua} style={styles.formElement}>
//                   {modeForm === "REGISTER_KETUA" && (
//                     <div>
//                       <label style={styles.labelForm}>Nama Lengkap</label>
//                       <input type="text" placeholder="Nama Lengkap Anda" required value={namaLengkap} onChange={e => setNamaLengkap(e.target.value)} style={styles.inputField} />
//                     </div>
//                   )}
//                   <div>
//                     <label style={styles.labelForm}>Username</label>
//                     <input type="text" placeholder="Masukkan username" required value={username} onChange={e => setUsername(e.target.value)} style={styles.inputField} />
//                   </div>
//                   <div>
//                     <label style={styles.labelForm}>Password</label>
//                     <input type="password" placeholder="Masukkan password" required value={password} onChange={e => setPassword(e.target.value)} style={styles.inputField} />
//                   </div>

//                   <button type="submit" style={styles.submitButtonForm}>
//                     {modeForm === "LOGIN_KETUA" ? "Masuk Portal ➔" : "Daftar Sekarang ➔"}
//                   </button>
//                   <button type="button" onClick={() => setModeForm("PILIH_ROLE")} style={styles.btnBack}>⬅ Kembali</button>
//                 </form>
//                 <div style={styles.switchText}>
//                   {modeForm === "LOGIN_KETUA" ? "Belum punya akun? " : "Sudah punya akun? "}
//                   <span style={styles.linkText} onClick={() => setModeForm(modeForm === "LOGIN_KETUA" ? "REGISTER_KETUA" : "LOGIN_KETUA")}>
//                     {modeForm === "LOGIN_KETUA" ? "Daftar di sini" : "Login di sini"}
//                   </span>
//                 </div>
//               </>
//             )}

//             {/* POP-UP STAFF */}
//             {modeForm === "LOGIN_STAFF" && (
//               <>
//                 <div style={styles.cardHeader}>
//                   <h3 style={styles.cardTitle}>Akses Admin</h3>
//                 </div>
//                 <form onSubmit={handleAuthStaff} style={styles.formElement}>
//                   <div>
//                     <label style={styles.labelForm}>ID Pegawai</label>
//                     <input type="text" placeholder="Masukkan ID" required value={username} onChange={e => setUsername(e.target.value)} style={styles.inputField} />
//                   </div>
//                   <div>
//                     <label style={styles.labelForm}>Kata Sandi</label>
//                     <input type="password" placeholder="Masukkan kata sandi" required value={password} onChange={e => setPassword(e.target.value)} style={styles.inputField} />
//                   </div>
//                   <button type="submit" style={styles.submitButtonForm}>Akses Dasbor ➔</button>
//                   <button type="button" onClick={() => setIsModalOpen(false)} style={styles.btnBack}>Batal</button>
//                 </form>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // === PREMIUM TRAVEL THEME CSS IN JS ===
// const styles: { [key: string]: React.CSSProperties } = {
//   // GRADASI LATAR BELAKANG PUTIH KE BIRU/HIJAU SAMAR, DITAMBAH GAMBAR CANDI TIPIS
//   // GRADASI LATAR BELAKANG PUTIH KE BIRU/HIJAU SAMAR, DITAMBAH GAMBAR CANDI TIPIS
//   pageContainer: { 
//     position: "relative", 
//     width: "100%", 
//     minHeight: "100vh", 
//     backgroundColor: "#f8fafc",
//     // PERBAIKAN: Format penulisan kutip ganda dan tunggal pada background-image
//     backgroundImage: "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0.6) 100%), url('/background2.jpg')", 
//     backgroundSize: "cover", 
//     backgroundPosition: "center top", 
//     backgroundAttachment: "fixed", 
//     fontFamily: "'Inter', system-ui, -apple-system, sans-serif", 
//     display: "flex", 
//     flexDirection: "column", 
//     overflowX: "hidden" 
//   },

//   // NAVBAR CLEAN
//   navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 4%", width: "100%", zIndex: 100, backgroundColor: "transparent" },
//   logo: { display: "flex", alignItems: "center", gap: "10px", fontSize: "1.2rem", fontWeight: "900", color: "#000", letterSpacing: "0.5px", cursor: "pointer", textTransform: "uppercase" },
//   logoIcon: { position: "relative", width: "22px", height: "22px" },
//   logoLeaf1: { position: "absolute", width: "10px", height: "10px", backgroundColor: "#84cc16", borderRadius: "2px 8px 2px 8px", top: 0, left: 0 },
//   logoLeaf2: { position: "absolute", width: "10px", height: "10px", backgroundColor: "#4d7c0f", borderRadius: "8px 2px 8px 2px", top: 0, right: 0 },
//   logoLeaf3: { position: "absolute", width: "10px", height: "10px", backgroundColor: "#65a30d", borderRadius: "8px 2px 8px 2px", bottom: 0, left: 0 },
  
//   navRightActions: { display: "flex", alignItems: "center", gap: "15px" },
//   btnNavOutline: { padding: "8px 16px", borderRadius: "8px", border: "1px solid", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600", display: "flex", alignItems: "center", transition: "all 0.2s" },
//   btnNavPrimary: { padding: "8px 16px", borderRadius: "8px", border: "none", color: "#fff", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600", display: "flex", alignItems: "center", transition: "all 0.2s" },
  
//   // KONTEN UTAMA
//   heroContent: { flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4%", gap: "30px", marginTop: "40px" },
//   textSide: { flex: "1 1 45%", maxWidth: "600px", zIndex: 10, paddingBottom: "40px" },
  
//   badgeTop: { backgroundColor: "#f0fdf4", color: "#166534", padding: "6px 14px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "700", marginBottom: "20px", display: "inline-flex", alignItems: "center", border: "1px solid #bbf7d0" },
//   mainTitle: { fontSize: "3.8rem", fontFamily: "Georgia, serif", fontWeight: 800, lineHeight: 1.1, margin: "0 0 20px 0", color: "#0f172a", letterSpacing: "-1px" },
//   slidingWord: { display: "inline-block", color: "#4d7c0f", fontStyle: "italic", transition: "all 0.4s ease" },
//   description: { fontSize: "1.1rem", lineHeight: 1.6, color: "#475569", maxWidth: "500px", fontWeight: "400" },
  
//   btnGetStarted: { padding: "16px 32px", backgroundColor: "#4d7c0f", color: "#fff", border: "none", borderRadius: "12px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: "10px" },
//   btnSecondary: { padding: "15px 28px", color: "#0f172a", border: "1px solid #cbd5e1", borderRadius: "12px", fontSize: "1rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", transition: "all 0.2s ease" },

//   // SLIDER KANAN (TANPA KOTAK HITAM)
//   sliderSide: { flex: "1.2 1 55%", position: "relative", display: "flex", alignItems: "center", gap: "20px" },
//   sliderWrapper: { width: "100%", maxWidth: "800px", height: "500px", position: "relative", borderRadius: "30px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.15)", border: "6px solid #fff" },
//   slideItem: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundSize: "cover", backgroundPosition: "center", transition: "all 0.8s ease" },
  
//   // Teks Langsung Mengambang
//   floatingInfoBox: { position: "absolute", bottom: "30px", left: "40px", right: "40px" },
//   slideBadge: { backgroundColor: "#bef264", color: "#365314", padding: "4px 10px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "800", marginBottom: "15px", display: "inline-block" },
//   slideTitle: { fontSize: "2.4rem", color: "#fff", margin: "0 0 10px 0", fontFamily: "Georgia, serif", fontWeight: "700", textShadow: "0 2px 4px rgba(0,0,0,0.8)" },
//   slideDesc: { fontSize: "1.05rem", color: "rgba(255,255,255,0.95)", margin: 0, fontWeight: "500", textShadow: "0 2px 4px rgba(0,0,0,0.8)" },
  
//   btnExploreSlide: { padding: "10px 22px", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "800", cursor: "pointer", transition: "all 0.3s ease", border: "1px solid", backdropFilter: "blur(4px)" },

//   verticalControls: { display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" },
//   controlBtnRound: { width: "45px", height: "45px", borderRadius: "50%", border: "1px solid #e2e8f0", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", transition: "all 0.2s ease", fontWeight: "bold" },
//   controlDivider: { width: "2px", height: "30px", backgroundColor: "#e2e8f0" },

//   // FOOTER
//   footer: { padding: "30px 4%", textAlign: "center", marginTop: "auto" },
//   footerText: { color: "#94a3b8", fontSize: "0.85rem", margin: 0, fontWeight: "500" },

//   // === MODAL FORM (CLEAN WHITE) ===
//   modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(5px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999, animation: "fadeIn 0.2s ease-out" },
//   formContainer: { position: "relative", backgroundColor: "#fff", borderRadius: "24px", boxShadow: "0 25px 50px rgba(0,0,0,0.2)", border: "1px solid #e2e8f0", color: "#0f172a", width: "100%", maxHeight: "90vh", overflowY: "auto" },
//   btnClose: { position: "absolute", top: "20px", right: "25px", background: "#f1f5f9", border: "none", color: "#64748b", fontSize: "1.2rem", cursor: "pointer", zIndex: 10, width: "36px", height: "36px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", transition: "all 0.2s", fontWeight: "bold" },
  
//   cardHeader: { display: "flex", justifyContent: "center", marginBottom: "10px", textAlign: "center" },
//   cardTitle: { fontSize: "1.8rem", fontWeight: 800, margin: 0, fontFamily: "Georgia, serif", color: "#0f172a" },
  
//   roleGridContainer: { display: "flex", gap: "20px", width: "100%", justifyContent: "center" },
//   roleCard: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "35px 25px", border: "1px solid", borderRadius: "20px", cursor: "pointer", transition: "all 0.2s ease", textAlign: "center" },
//   iconContainer: { width: "70px", height: "70px", borderRadius: "16px", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px" },
//   roleCardTitle: { fontSize: "1.15rem", color: "#0f172a", margin: "0 0 8px 0", fontWeight: "800" },
//   roleCardDesc: { fontSize: "0.85rem", color: "#64748b", margin: 0, lineHeight: 1.5, fontWeight: "500" },
  
//   formElement: { display: "flex", flexDirection: "column", gap: "15px" },
//   labelForm: { fontSize: "0.8rem", color: "#475569", fontWeight: "700", marginBottom: "6px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" },
//   inputField: { width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "0.95rem", outline: "none", backgroundColor: "#f8fafc", color: "#0f172a", transition: "border 0.2s", fontWeight: "500" },
  
//   submitButtonForm: { width: "100%", padding: "16px", backgroundColor: "#4d7c0f", color: "#fff", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "1rem", cursor: "pointer", marginTop: "10px", transition: "all 0.2s" },
//   btnBack: { background: "none", border: "none", color: "#94a3b8", cursor: "pointer", marginTop: "5px", fontSize: "0.9rem", fontWeight: "600" },
  
//   switchText: { textAlign: "center", marginTop: "20px", fontSize: "0.9rem", color: "#64748b", fontWeight: "500" },
//   linkText: { color: "#4d7c0f", fontWeight: 700, cursor: "pointer" }
// };

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 

// === GAMBAR LOKAL ===
const wisataList = [
  { id: 1, nama: "Candi Prambanan", desc: "Candi peninggalan masa lampau dengan pesona luar biasa.", img: "/wisata/prambanan.jpg" },
  { id: 2, nama: "Jalan Malioboro", desc: "Jantung budaya dan pusat belanja legendaris Jogja.", img: "/wisata/malioboro.jpg" },
  { id: 3, nama: "Taman Sari", desc: "Istana air penuh sejarah peninggalan Sultan keraton.", img: "/wisata/tamansari.jpg" }
];

export default function ClaudeStyleLanding() {
  const router = useRouter();
  
  // === STATE MODAL (POP-UP) ===
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modeForm, setModeForm] = useState<"PILIH_ROLE" | "ANGGOTA" | "LOGIN_KETUA" | "REGISTER_KETUA" | "LOGIN_STAFF">("PILIH_ROLE");
  const [hoverRole, setHoverRole] = useState<"ANGGOTA" | "KETUA" | null>(null);

  // === STATE INTERAKTIF NAVBAR & TOMBOL ===
  const [hoverNav, setHoverNav] = useState<string | null>(null);
  const [hoverBtn, setHoverBtn] = useState<string | null>(null);
  
  const [hoverAbout, setHoverAbout] = useState(false);
  const [hoverPanduan, setHoverPanduan] = useState(false);
  const [hoverAdmin, setHoverAdmin] = useState(false);
  
  const [hoverLihatDestinasi, setHoverLihatDestinasi] = useState(false);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [hoverSlideBtn, setHoverSlideBtn] = useState<number | null>(null);

  // === STATE DATA INPUT ANGGOTA ===
  const [kodeRuang, setKodeRuang] = useState("");
  const [namaAnggota, setNamaAnggota] = useState("");
  const [umur, setUmur] = useState("");
  const [gender, setGender] = useState("L");

  // === STATE DATA INPUT KETUA ===
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");

  // === STATE ANIMASI TEKS KIRI ===
  const words = ["ribet.", "drama.", "debat.", "pusing."];
  const [wordIndex, setWordIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // === STATE SLIDER KANAN ===
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setFade(false); 
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length); 
        setFade(true); 
      }, 400); 
    }, 2500); 
    return () => clearInterval(textInterval);
  }, [words.length]);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % wisataList.length);
    }, 5000); 
    return () => clearInterval(slideInterval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % wisataList.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + wisataList.length) % wisataList.length);
  };

  const handleGetStarted = () => {
    setModeForm("PILIH_ROLE"); 
    setIsModalOpen(true);
  };

  // === FUNGSI AUTH ANGGOTA ===
  const handleMasukAnggota = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Ambil id_ruang dari tabel ruang melalui kode_ruang
      const { data: dataRuang, error: errRuang } = await supabase
        .from('ruang')
        .select('id_ruang, nama_grup')
        .eq('kode_ruang', kodeRuang.toUpperCase())
        .single();

      if (errRuang || !dataRuang) {
        alert("Kode Ruang tidak ditemukan atau tidak valid.");
        return; 
      }

      // Cek eksistensi user tanpa memanggil kolom id_ruang yang tidak ada
      const { data: existingUser } = await supabase
        .from('user_anggota')
        .select('id_user')
        .eq('nama_anggota', namaAnggota)
        .eq('kode_ruang', kodeRuang.toUpperCase())
        .single();

      let userId = existingUser?.id_user;
      let finalIdRuang = dataRuang.id_ruang;

      if (!existingUser) {
        // Insert data ke user_anggota tanpa kolom id_ruang
        const { data: dataAnggotaBaru, error: errAnggota } = await supabase
          .from('user_anggota')
          .insert([{
              kode_ruang: kodeRuang.toUpperCase(),
              nama_anggota: namaAnggota,
              usia: parseInt(umur),
              gender: gender
          }])
          .select()
          .single(); 

        if (errAnggota) {
          console.error("Supabase Insert Error:", errAnggota);
          alert(`Gagal mendaftar: ${errAnggota.message}`);
          return;
        }
        userId = dataAnggotaBaru.id_user;
      }

      // Simpan informasi lengkap sesi di localStorage untuk kebutuhan kuesioner
      localStorage.setItem("temp_anggota", JSON.stringify({ 
        id_user: userId,
        namaAnggota: namaAnggota, 
        umur: umur, 
        gender: gender, 
        kodeRuang: kodeRuang.toUpperCase(),
        id_ruang: finalIdRuang, 
        nama_grup: dataRuang.nama_grup
      }));
      
      setIsModalOpen(false); 

      const statusSubmit = localStorage.getItem(`status_submit_${kodeRuang.toUpperCase()}_${namaAnggota}`);
      if (statusSubmit === "DONE") {
        router.push('/kuesioner'); 
      } else {
        router.push('/anggota'); 
      }
    } catch (error) {
       console.error("Terjadi kesalahan sistem:", error);
       alert("Sistem sedang sibuk. Silakan coba lagi.");
    }
  };

  // === FUNGSI AUTH KETUA ===
  const handleAuthKetua = async (e: React.FormEvent) => {
    e.preventDefault();

    if (modeForm === "REGISTER_KETUA") {
      const { error } = await supabase
        .from('user_ketua') 
        .insert([{ nama_lengkap: namaLengkap, username: username, password: password }]);

      if (error) {
        alert(`Pendaftaran gagal: ${error.message}`);
      } else {
        alert("Pendaftaran sukses! Silakan login untuk membuat ruang rombongan.");
        setModeForm("LOGIN_KETUA"); 
      }
      
    } else if (modeForm === "LOGIN_KETUA") {
      const { data, error } = await supabase
        .from('user_ketua')
        .select('*')
        .eq('username', username)
        .eq('password', password);

      if (error) {
        alert(`Error Supabase: ${error.message}`);
      } else if (!data || data.length === 0) {
        alert("Username atau Password salah!");
      } else {
        const user = data[0]; 
        localStorage.setItem("temp_ketua", JSON.stringify({ 
          id_ketua: user.id_ketua,          
          nama_lengkap: user.nama_lengkap,   
          username_login: user.username      
        }));
        
        setIsModalOpen(false); 
        window.open('/ketua', '_blank'); 
      }
    }
  };

  const handleAuthStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false); 
    window.open('/staff', '_blank');
  };

  return (
    <div style={styles.pageContainer}>
      
      {/* HEADER NAVBAR */}
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
        
        <div style={styles.navRightActions}>
          <button 
            style={{
              ...styles.btnNavPrimary,
              backgroundColor: hoverAbout ? "#365314" : "#4d7c0f",
              transform: hoverAbout ? "translateY(-1px)" : "translateY(0)"
            }} 
            onClick={() => router.push('/about')}
            onMouseEnter={() => setHoverAbout(true)}
            onMouseLeave={() => setHoverAbout(false)}
          >
            <span style={{marginRight: "6px"}}>ⓘ</span> About
          </button>
          
          <button 
            style={{
              ...styles.btnNavOutline,
              backgroundColor: hoverPanduan ? "#f7fee7" : "#fff",
              borderColor: hoverPanduan ? "#4d7c0f" : "#cbd5e1",
              color: hoverPanduan ? "#4d7c0f" : "#334155",
              transform: hoverPanduan ? "translateY(-1px)" : "translateY(0)"
            }} 
            onClick={() => window.open('/panduan', '_blank')}
            onMouseEnter={() => setHoverPanduan(true)}
            onMouseLeave={() => setHoverPanduan(false)}
          >
            <span style={{marginRight: "6px"}}>📄</span> Panduan
          </button>

          <button 
            style={{
              ...styles.btnNavPrimary,
              backgroundColor: hoverAdmin ? "#365314" : "#4d7c0f",
              transform: hoverAdmin ? "translateY(-1px)" : "translateY(0)"
            }} 
            onClick={() => { setModeForm("LOGIN_STAFF"); setIsModalOpen(true); }}
            onMouseEnter={() => setHoverAdmin(true)}
            onMouseLeave={() => setHoverAdmin(false)}
          >
            <span style={{marginRight: "6px"}}>🔒</span> Portal Admin
          </button>
        </div>
      </nav>

      {/* KONTEN UTAMA */}
      <main style={styles.heroContent}>
        <div style={styles.textSide}>
          <div style={styles.badgeTop}>
            <span style={{color: "#4d7c0f", marginRight: "6px"}}>🌱</span> 
            Explore Jogja
          </div>
          
          <h1 style={styles.mainTitle}>
            Liburan rombongan <br/>bebas <span style={{...styles.slidingWord, opacity: fade ? 1 : 0}}>{words[wordIndex]}</span><br/>
            Keputusan lebih cepat.
          </h1>
          
          <p style={styles.description}>
            Nikmati pengalaman merencanakan wisata kelompok yang lebih mudah dengan algoritma cerdas pemilih destinasi terbaik di Yogyakarta.
          </p>

          <div style={{ marginTop: "40px", display: "flex", gap: "15px", alignItems: "center" }}>
            <button 
              onClick={handleGetStarted} 
              onMouseEnter={() => setHoverBtn("start")}
              onMouseLeave={() => setHoverBtn(null)}
              style={{
                ...styles.btnGetStarted,
                transform: hoverBtn === "start" ? "translateY(-2px)" : "translateY(0)",
                boxShadow: hoverBtn === "start" ? "0 10px 25px rgba(77, 124, 15, 0.3)" : "none"
              }}
            >
              Mulai Sekarang ➔
            </button>
            <button 
              onClick={() => window.open('/eksplorasi', '_blank')}
              onMouseEnter={() => setHoverLihatDestinasi(true)}
              onMouseLeave={() => setHoverLihatDestinasi(false)}
              style={{
                ...styles.btnSecondary,
                backgroundColor: hoverLihatDestinasi ? "#f8fafc" : "#fff",
                transform: hoverLihatDestinasi ? "translateY(-2px)" : "translateY(0)"
              }}
            >
              Eksplorasi Wisata 📍
            </button>
          </div>
        </div>

        {/* SLIDER GAMBAR KANAN */}
        <div style={styles.sliderSide}>
          <div style={styles.sliderWrapper}>
            {wisataList.map((wisata, index) => (
              <div key={wisata.id} style={{
                ...styles.slideItem,
                opacity: currentSlide === index ? 1 : 0,
                transform: currentSlide === index ? "scale(1)" : "scale(1.05)",
                backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.4) 40%, rgba(0, 0, 0, 0) 100%), url('${wisata.img}')`,
              }}>
                
                <div style={styles.floatingInfoBox}>
                  <div style={styles.slideBadge}>Populer</div>
                  <h3 style={styles.slideTitle}>{wisata.nama}</h3>
                  <p style={styles.slideDesc}>{wisata.desc}</p>
                  
                  <div style={{marginTop: "25px"}}>
                    <button 
                      onClick={() => window.open('/eksplorasi', '_blank')}
                      onMouseEnter={() => setHoverSlideBtn(index)}
                      onMouseLeave={() => setHoverSlideBtn(null)}
                      style={{
                        ...styles.btnExploreSlide,
                        backgroundColor: hoverSlideBtn === index ? "#fff" : "rgba(255,255,255,0.15)",
                        color: hoverSlideBtn === index ? "#0f172a" : "#fff",
                        borderColor: hoverSlideBtn === index ? "#fff" : "rgba(255,255,255,0.6)"
                      }}
                    >
                      Lihat Selengkapnya ➔
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Vertical Controls */}
          <div style={styles.verticalControls}>
              <button 
                onClick={prevSlide}
                onMouseEnter={() => setHoverPrev(true)}
                onMouseLeave={() => setHoverPrev(false)}
                style={{...styles.controlBtnRound, backgroundColor: hoverPrev ? "#4d7c0f" : "#fff", color: hoverPrev ? "#fff" : "#64748b"}}
              >
                ᐱ
              </button>
              <div style={styles.controlDivider}></div>
              <button 
                onClick={nextSlide}
                onMouseEnter={() => setHoverNext(true)}
                onMouseLeave={() => setHoverNext(false)}
                style={{...styles.controlBtnRound, backgroundColor: hoverNext ? "#4d7c0f" : "#fff", color: hoverNext ? "#fff" : "#64748b"}}
              >
                ᐯ
              </button>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>&copy; Website Mlampah Jogja &bull; By Kelompok 02 APSI TI UNS</p>
      </footer>

      {/* POP-UP MODAL */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={{...styles.formContainer, maxWidth: modeForm === "PILIH_ROLE" ? "700px" : "450px", padding: modeForm === "PILIH_ROLE" ? "50px" : "40px"}}>
            <button onClick={() => setIsModalOpen(false)} style={styles.btnClose}>✕</button>

            {/* TAHAP 1 POP-UP: PILIH ROLE */}
            {modeForm === "PILIH_ROLE" && (
              <>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Pilih Peran Anda</h3>
                </div>
                <p style={{textAlign: "center", color: "#64748b", marginBottom: "40px", fontSize: "1rem"}}>Silakan pilih jalur akses untuk melanjutkan ke dalam sistem Mlampah Jogja.</p>
                
                <div style={styles.roleGridContainer}>
                  <div 
                    onClick={() => setModeForm("ANGGOTA")}
                    onMouseEnter={() => setHoverRole("ANGGOTA")}
                    onMouseLeave={() => setHoverRole(null)}
                    style={{...styles.roleCard, borderColor: hoverRole === "ANGGOTA" ? "#4d7c0f" : "#e2e8f0", backgroundColor: hoverRole === "ANGGOTA" ? "#f7fee7" : "#fff", transform: hoverRole === "ANGGOTA" ? "translateY(-4px)" : "translateY(0)", boxShadow: hoverRole === "ANGGOTA" ? "0 15px 30px rgba(77, 124, 15, 0.1)" : "none"}}
                  >
                    <div style={{...styles.iconContainer, backgroundColor: hoverRole === "ANGGOTA" ? "#4d7c0f" : "#f1f5f9"}}>
                      <img src="/group rombongan.png" alt="Ikon Anggota" style={{ width: "45px", height: "45px", objectFit: "contain", filter: hoverRole === "ANGGOTA" ? "brightness(0) invert(1)" : "none" }} />
                    </div>
                    <h4 style={styles.roleCardTitle}>Anggota Rombongan</h4>
                    <p style={styles.roleCardDesc}>Masuk dengan kode untuk mengisi kuesioner voting wisata.</p>
                  </div>

                  <div 
                    onClick={() => setModeForm("LOGIN_KETUA")}
                    onMouseEnter={() => setHoverRole("KETUA")}
                    onMouseLeave={() => setHoverRole(null)}
                    style={{...styles.roleCard, borderColor: hoverRole === "KETUA" ? "#4d7c0f" : "#e2e8f0", backgroundColor: hoverRole === "KETUA" ? "#f7fee7" : "#fff", transform: hoverRole === "KETUA" ? "translateY(-4px)" : "translateY(0)", boxShadow: hoverRole === "KETUA" ? "0 15px 30px rgba(77, 124, 15, 0.1)" : "none"}}
                  >
                    <div style={{...styles.iconContainer, backgroundColor: hoverRole === "KETUA" ? "#4d7c0f" : "#f1f5f9"}}>
                      <img src="/icon-ketua.png" alt="Ikon Ketua" style={{ width: "45px", height: "45px", objectFit: "contain", filter: hoverRole === "KETUA" ? "brightness(0) invert(1)" : "none" }} />
                    </div>
                    <h4 style={styles.roleCardTitle}>Ketua Rombongan</h4>
                    <p style={styles.roleCardDesc}>Buat dan kelola ruang voting rombongan secara komprehensif.</p>
                  </div>
                </div>
              </>
            )}

            {/* TAHAP 2: ANGGOTA */}
            {modeForm === "ANGGOTA" && (
              <>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Masuk Anggota</h3>
                </div>
                <form onSubmit={handleMasukAnggota} style={styles.formElement}>
                  <div>
                    <label style={styles.labelForm}>Kode Ruang</label>
                    <input type="text" placeholder="Cth: JOG-1234" required value={kodeRuang} onChange={e => setKodeRuang(e.target.value.toUpperCase())} style={styles.inputField} />
                  </div>
                  <div>
                    <label style={styles.labelForm}>Nama Lengkap</label>
                    <input type="text" placeholder="Masukkan nama Anda" required value={namaAnggota} onChange={e => setNamaAnggota(e.target.value)} style={styles.inputField} />
                  </div>
                  <div style={{display: "flex", gap: "15px"}}>
                    <div style={{flex: 1}}>
                      <label style={styles.labelForm}>Usia</label>
                      <input type="number" placeholder="Tahun" required value={umur} onChange={e => setUmur(e.target.value)} style={styles.inputField} />
                    </div>
                    <div style={{flex: 1}}>
                      <label style={styles.labelForm}>Gender</label>
                      <select value={gender} onChange={e => setGender(e.target.value)} style={styles.inputField}>
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" style={styles.submitButtonForm}>Masuk Ruang ➔</button>
                  <button type="button" onClick={() => setModeForm("PILIH_ROLE")} style={styles.btnBack}>⬅ Kembali</button>
                </form>
              </>
            )}

            {/* TAHAP 2: KETUA */}
            {(modeForm === "LOGIN_KETUA" || modeForm === "REGISTER_KETUA") && (
              <>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>
                    {modeForm === "LOGIN_KETUA" ? "Login Ketua" : "Daftar Ketua"}
                  </h3>
                </div>
                <form onSubmit={handleAuthKetua} style={styles.formElement}>
                  {modeForm === "REGISTER_KETUA" && (
                    <div>
                      <label style={styles.labelForm}>Nama Lengkap</label>
                      <input type="text" placeholder="Nama Lengkap Anda" required value={namaLengkap} onChange={e => setNamaLengkap(e.target.value)} style={styles.inputField} />
                    </div>
                  )}
                  <div>
                    <label style={styles.labelForm}>Username</label>
                    <input type="text" placeholder="Masukkan username" required value={username} onChange={e => setUsername(e.target.value)} style={styles.inputField} />
                  </div>
                  <div>
                    <label style={styles.labelForm}>Password</label>
                    <input type="password" placeholder="Masukkan password" required value={password} onChange={e => setPassword(e.target.value)} style={styles.inputField} />
                  </div>

                  <button type="submit" style={styles.submitButtonForm}>
                    {modeForm === "LOGIN_KETUA" ? "Masuk Portal ➔" : "Daftar Sekarang ➔"}
                  </button>
                  <button type="button" onClick={() => setModeForm("PILIH_ROLE")} style={styles.btnBack}>⬅ Kembali</button>
                </form>
                <div style={styles.switchText}>
                  {modeForm === "LOGIN_KETUA" ? "Belum punya akun? " : "Sudah punya akun? "}
                  <span style={styles.linkText} onClick={() => setModeForm(modeForm === "LOGIN_KETUA" ? "REGISTER_KETUA" : "LOGIN_KETUA")}>
                    {modeForm === "LOGIN_KETUA" ? "Daftar di sini" : "Login di sini"}
                  </span>
                </div>
              </>
            )}

            {/* POP-UP STAFF */}
            {modeForm === "LOGIN_STAFF" && (
              <>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Akses Admin</h3>
                </div>
                <form onSubmit={handleAuthStaff} style={styles.formElement}>
                  <div>
                    <label style={styles.labelForm}>ID Pegawai</label>
                    <input type="text" placeholder="Masukkan ID" required value={username} onChange={e => setUsername(e.target.value)} style={styles.inputField} />
                  </div>
                  <div>
                    <label style={styles.labelForm}>Kata Sandi</label>
                    <input type="password" placeholder="Masukkan kata sandi" required value={password} onChange={e => setPassword(e.target.value)} style={styles.inputField} />
                  </div>
                  <button type="submit" style={styles.submitButtonForm}>Akses Dasbor ➔</button>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={styles.btnBack}>Batal</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// === PREMIUM TRAVEL THEME CSS IN JS ===
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: { 
    position: "relative", 
    width: "100%", 
    minHeight: "100vh", 
    backgroundColor: "#f8fafc",
    backgroundImage: "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0.6) 100%), url('/background2.jpg')", 
    backgroundSize: "cover", 
    backgroundPosition: "center top", 
    backgroundAttachment: "fixed", 
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif", 
    display: "flex", 
    flexDirection: "column", 
    overflowX: "hidden" 
  },

  navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 4%", width: "100%", zIndex: 100, backgroundColor: "transparent" },
  logo: { display: "flex", alignItems: "center", gap: "10px", fontSize: "1.2rem", fontWeight: "900", color: "#000", letterSpacing: "0.5px", cursor: "pointer", textTransform: "uppercase" },
  logoIcon: { position: "relative", width: "22px", height: "22px" },
  logoLeaf1: { position: "absolute", width: "10px", height: "10px", backgroundColor: "#84cc16", borderRadius: "2px 8px 2px 8px", top: 0, left: 0 },
  logoLeaf2: { position: "absolute", width: "10px", height: "10px", backgroundColor: "#4d7c0f", borderRadius: "8px 2px 8px 2px", top: 0, right: 0 },
  logoLeaf3: { position: "absolute", width: "10px", height: "10px", backgroundColor: "#65a30d", borderRadius: "8px 2px 8px 2px", bottom: 0, left: 0 },
  
  navRightActions: { display: "flex", alignItems: "center", gap: "15px" },
  btnNavOutline: { padding: "8px 16px", borderRadius: "8px", border: "1px solid", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600", display: "flex", alignItems: "center", transition: "all 0.2s" },
  btnNavPrimary: { padding: "8px 16px", borderRadius: "8px", border: "none", color: "#fff", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600", display: "flex", alignItems: "center", transition: "all 0.2s" },
  
  heroContent: { flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4%", gap: "30px", marginTop: "40px" },
  textSide: { flex: "1 1 45%", maxWidth: "600px", zIndex: 10, paddingBottom: "40px" },
  
  badgeTop: { backgroundColor: "#f0fdf4", color: "#166534", padding: "6px 14px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "700", marginBottom: "20px", display: "inline-flex", alignItems: "center", border: "1px solid #bbf7d0" },
  mainTitle: { fontSize: "3.8rem", fontFamily: "Georgia, serif", fontWeight: 800, lineHeight: 1.1, margin: "0 0 20px 0", color: "#0f172a", letterSpacing: "-1px" },
  slidingWord: { display: "inline-block", color: "#4d7c0f", fontStyle: "italic", transition: "all 0.4s ease" },
  description: { fontSize: "1.1rem", lineHeight: 1.6, color: "#475569", maxWidth: "500px", fontWeight: "400" },
  
  btnGetStarted: { padding: "16px 32px", backgroundColor: "#4d7c0f", color: "#fff", border: "none", borderRadius: "12px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: "10px" },
  btnSecondary: { padding: "15px 28px", color: "#0f172a", border: "1px solid #cbd5e1", borderRadius: "12px", fontSize: "1rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", transition: "all 0.2s ease" },

  sliderSide: { flex: "1.2 1 55%", position: "relative", display: "flex", alignItems: "center", gap: "20px" },
  sliderWrapper: { width: "100%", maxWidth: "800px", height: "500px", position: "relative", borderRadius: "30px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.15)", border: "6px solid #fff" },
  slideItem: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundSize: "cover", backgroundPosition: "center", transition: "all 0.8s ease" },
  
  floatingInfoBox: { position: "absolute", bottom: "30px", left: "40px", right: "40px" },
  slideBadge: { backgroundColor: "#bef264", color: "#365314", padding: "4px 10px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "800", marginBottom: "15px", display: "inline-block" },
  slideTitle: { fontSize: "2.4rem", color: "#fff", margin: "0 0 10px 0", fontFamily: "Georgia, serif", fontWeight: "700", textShadow: "0 2px 4px rgba(0,0,0,0.8)" },
  slideDesc: { fontSize: "1.05rem", color: "rgba(255,255,255,0.95)", margin: 0, fontWeight: "500", textShadow: "0 2px 4px rgba(0,0,0,0.8)" },
  
  btnExploreSlide: { padding: "10px 22px", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "800", cursor: "pointer", transition: "all 0.3s ease", border: "1px solid", backdropFilter: "blur(4px)" },

  verticalControls: { display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" },
  controlBtnRound: { width: "45px", height: "45px", borderRadius: "50%", border: "1px solid #e2e8f0", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", transition: "all 0.2s ease", fontWeight: "bold" },
  controlDivider: { width: "2px", height: "30px", backgroundColor: "#e2e8f0" },

  footer: { padding: "30px 4%", textAlign: "center", marginTop: "auto" },
  footerText: { color: "#94a3b8", fontSize: "0.85rem", margin: 0, fontWeight: "500" },

  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(5px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999, animation: "fadeIn 0.2s ease-out" },
  formContainer: { position: "relative", backgroundColor: "#fff", borderRadius: "24px", boxShadow: "0 25px 50px rgba(0,0,0,0.2)", border: "1px solid #e2e8f0", color: "#0f172a", width: "100%", maxHeight: "90vh", overflowY: "auto" },
  btnClose: { position: "absolute", top: "20px", right: "25px", background: "#f1f5f9", border: "none", color: "#64748b", fontSize: "1.2rem", cursor: "pointer", zIndex: 10, width: "36px", height: "36px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", transition: "all 0.2s", fontWeight: "bold" },
  
  cardHeader: { display: "flex", justifyContent: "center", marginBottom: "10px", textAlign: "center" },
  cardTitle: { fontSize: "1.8rem", fontWeight: 800, margin: 0, fontFamily: "Georgia, serif", color: "#0f172a" },
  
  roleGridContainer: { display: "flex", gap: "20px", width: "100%", justifyContent: "center" },
  roleCard: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "35px 25px", border: "1px solid", borderRadius: "20px", cursor: "pointer", transition: "all 0.2s ease", textAlign: "center" },
  iconContainer: { width: "70px", height: "70px", borderRadius: "16px", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px" },
  roleCardTitle: { fontSize: "1.15rem", color: "#0f172a", margin: "0 0 8px 0", fontWeight: "800" },
  roleCardDesc: { fontSize: "0.85rem", color: "#64748b", margin: 0, lineHeight: 1.5, fontWeight: "500" },
  
  formElement: { display: "flex", flexDirection: "column", gap: "15px" },
  labelForm: { fontSize: "0.8rem", color: "#475569", fontWeight: "700", marginBottom: "6px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" },
  inputField: { width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "0.95rem", outline: "none", backgroundColor: "#f8fafc", color: "#0f172a", transition: "border 0.2s", fontWeight: "500" },
  
  submitButtonForm: { width: "100%", padding: "16px", backgroundColor: "#4d7c0f", color: "#fff", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "1rem", cursor: "pointer", marginTop: "10px", transition: "all 0.2s" },
  btnBack: { background: "none", border: "none", color: "#94a3b8", cursor: "pointer", marginTop: "5px", fontSize: "0.9rem", fontWeight: "600" },
  
  switchText: { textAlign: "center", marginTop: "20px", fontSize: "0.9rem", color: "#64748b", fontWeight: "500" },
  linkText: { color: "#4d7c0f", fontWeight: 700, cursor: "pointer" }
};