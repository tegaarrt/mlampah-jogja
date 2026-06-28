// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";

// export default function PortalAnggota() {
//   const router = useRouter();

//   // State untuk menampung data dari halaman depan (Landing Page)
//   const [dataUser, setDataUser] = useState({ namaAnggota: "", kodeRuang: "", umur: "", gender: "" });
  
//   // State untuk status verifikasi database
//   const [isVerifying, setIsVerifying] = useState(true);
//   const [isValidCode, setIsValidCode] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   // State interaktif (Hover)
//   const [hoverBtn, setHoverBtn] = useState<string | null>(null);

//   // State untuk data grup dari Supabase
//   const [namaGrupDariDB, setNamaGrupDariDB] = useState("");
//   const [idRuang, setIdRuang] = useState<number | null>(null);

//   useEffect(() => {
//     // 1. Ambil data yang diisi user dari Pop-up Landing Page
//     const savedData = localStorage.getItem("temp_anggota");
    
//     if (!savedData) {
//       alert("Harap login melalui halaman utama terlebih dahulu.");
//       router.push("/");
//       return;
//     }

//     const parsedData = JSON.parse(savedData);
//     setDataUser(parsedData);

//     // 2. CEK KODE RUANG LANGSUNG KE SUPABASE
//     const verifikasiRuang = async () => {
//       try {
//         const { data, error } = await supabase
//           .from('ruang')
//           .select('id_ruang, nama_grup')
//           .eq('kode_ruang', parsedData.kodeRuang.toUpperCase())
//           .single();

//         if (error || !data) {
//           setIsValidCode(false);
//         } else {
//           setIsValidCode(true);
//           setNamaGrupDariDB(data.nama_grup);
//           setIdRuang(data.id_ruang);
//         }
//       } catch (err) {
//         console.error("Gagal verifikasi ruang:", err);
//         setIsValidCode(false);
//       } finally {
//         setIsVerifying(false);
//       }
//     };

//     verifikasiRuang();
//   }, [router]);

//   // Handler untuk menyimpan data ke user_anggota dan pindah ke Kuesioner
//   const handleMulaiKuesioner = async () => {
//     setIsSubmitting(true);

//     try {
//       const { data: existingUser } = await supabase
//         .from('user_anggota')
//         .select('id_user')
//         .eq('kode_ruang', dataUser.kodeRuang.toUpperCase())
//         .eq('nama_anggota', dataUser.namaAnggota)
//         .single();

//       if (existingUser) {
//         router.push('/kuesioner');
//         return;
//       }

//       const { error } = await supabase
//         .from('user_anggota')
//         .insert([
//           {
//             kode_ruang: dataUser.kodeRuang.toUpperCase(),
//             nama_anggota: dataUser.namaAnggota,
//             usia: parseInt(dataUser.umur),
//             gender: dataUser.gender,
//             id_ruang: idRuang 
//           }
//         ]);

//       if (error) {
//         alert(`Gagal mendaftarkan diri: ${error.message}`);
//         setIsSubmitting(false);
//       } else {
//         router.push('/kuesioner');
//       }
      
//     } catch (err) {
//       console.error(err);
//       alert("Terjadi kesalahan sistem saat mendaftar.");
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       {/* NAVBAR */}
//       <nav style={styles.navbar}>
//         <div style={styles.navBrand}>
//           {/* Logo Daun Asli */}
//           <div style={styles.logoIcon}>
//             <div style={styles.logoLeaf1} />
//             <div style={styles.logoLeaf2} />
//             <div style={styles.logoLeaf3} />
//           </div>
//           <div>
//             <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#000", fontFamily: "Georgia, serif", fontWeight: "900" }}>Portal Anggota</h2>
//             <p style={{ margin: 0, fontSize: "0.85rem", color: "#333", fontWeight: "600" }}>Mlampah Jogja DSS</p>
//           </div>
//         </div>
//         <div 
//           onClick={() => { localStorage.clear(); router.push('/'); }} 
//           onMouseEnter={() => setHoverBtn('logout')}
//           onMouseLeave={() => setHoverBtn(null)}
//           style={{
//             ...styles.btnKeluar,
//             backgroundColor: hoverBtn === 'logout' ? "#000" : "#fff",
//             color: hoverBtn === 'logout' ? "#B3EBF2" : "#000",
//             transform: hoverBtn === 'logout' ? "translateY(-2px)" : "translateY(0)"
//           }}
//         >
//           Keluar
//         </div>
//       </nav>

//       <main style={styles.mainContent}>
        
//         {/* KOTAK VERIFIKASI / LOBBY (Clean Outline Putih) */}
//         <div style={styles.cardPremium}>
          
//           {/* STATE 1: SEDANG CEK DATABASE */}
//           {isVerifying && (
//             <div style={styles.stateCenter}>
//               <div style={{fontSize: "4rem", animation: "pulse 1.5s infinite", marginBottom: "15px"}}>🔍</div>
//               <h2 style={styles.title}>Menyinkronkan Data...</h2>
//               <p style={styles.desc}>Sistem sedang mencari ruang rombongan dengan kode <strong style={{color: "#000"}}>{dataUser.kodeRuang}</strong> di database.</p>
//             </div>
//           )}

//           {/* STATE 2: KODE SALAH / TIDAK DITEMUKAN */}
//           {!isVerifying && !isValidCode && (
//             <div style={styles.stateCenter}>
//               <div style={{fontSize: "4rem", marginBottom: "15px"}}>❌</div>
//               <h2 style={{...styles.title, color: "#ef4444"}}>Kode Ruang Tidak Valid</h2>
//               <p style={styles.desc}>Ruang <strong style={{color: "#000"}}>{dataUser.kodeRuang}</strong> tidak ditemukan atau Ketua belum membuka ruang tersebut.</p>
//               <Link 
//                 href="/" 
//                 onMouseEnter={() => setHoverBtn('error')}
//                 onMouseLeave={() => setHoverBtn(null)}
//                 style={{
//                   ...styles.btnError,
//                   backgroundColor: hoverBtn === 'error' ? "#ef4444" : "#fff",
//                   color: hoverBtn === 'error' ? "#fff" : "#ef4444",
//                   transform: hoverBtn === 'error' ? "translateY(-2px)" : "translateY(0)"
//                 }}
//               >
//                 Kembali ke Halaman Utama
//               </Link>
//             </div>
//           )}

//           {/* STATE 3: BERHASIL TERHUBUNG (KODE BENAR) */}
//           {!isVerifying && isValidCode && (
//             <div style={styles.stateCenter}>
              
//               {/* IKON CUSTOM ROMBONGAN */}
//               <div style={styles.imageIconWrapper}>
//                 <img src="/group rombongan.png" alt="Rombongan" style={styles.customIcon} />
//               </div>
              
//               <h2 style={styles.title}>Halo, {dataUser.namaAnggota}! 👋</h2>
              
//               <div style={styles.successBox}>
//                 <p style={{fontSize: "0.95rem", color: "#333", margin: "0 0 10px 0", fontWeight: "600"}}>Anda berhasil terhubung dengan rombongan:</p>
//                 <h3 style={{fontSize: "2rem", color: "#000", margin: "0 0 5px 0", fontWeight: "900", fontFamily: "Georgia, serif"}}>{namaGrupDariDB}</h3>
//                 <p style={{fontSize: "0.9rem", color: "#000", margin: 0, fontWeight: "700", backgroundColor: "#B3EBF2", padding: "4px 12px", borderRadius: "8px", display: "inline-block", border: "2px solid #000", marginTop: "10px"}}>Kode: {dataUser.kodeRuang.toUpperCase()}</p>
//               </div>

//               <p style={{...styles.desc, maxWidth: "500px"}}>
//                 Ketua rombongan sedang menunggu partisipasi Anda. Silakan mulai kuesioner BWM untuk menentukan tingkat kepentingan kriteria wisata Anda.
//               </p>

//               {/* TOMBOL EKSEKUSI */}
//               <button 
//                 onClick={handleMulaiKuesioner} 
//                 disabled={isSubmitting}
//                 onMouseEnter={() => setHoverBtn('mulai')}
//                 onMouseLeave={() => setHoverBtn(null)}
//                 style={{
//                   ...styles.btnPrimary,
//                   backgroundColor: isSubmitting ? "#e2e8f0" : (hoverBtn === 'mulai' ? "#000" : "#B3EBF2"),
//                   color: isSubmitting ? "#94a3b8" : (hoverBtn === 'mulai' ? "#B3EBF2" : "#000"),
//                   cursor: isSubmitting ? "not-allowed" : "pointer",
//                   transform: hoverBtn === 'mulai' && !isSubmitting ? "translateY(-2px)" : "translateY(0)"
//                 }}
//               >
//                 {isSubmitting ? "Menyiapkan Kuesioner..." : "Mulai Kuesioner BWM ➔"}
//               </button>
//             </div>
//           )}

//         </div>
//       </main>
//     </div>
//   );
// }

// // === PREMIUM CLEAN OUTLINE (PASTEL BLUE GRADIENT) ===
// const styles: { [key: string]: React.CSSProperties } = {
//   // Tema Terang dengan Gradasi Biru-Putih dan Background Candi
//   container: { 
//     minHeight: "100vh", 
//     backgroundColor: "#ffffff", 
//     fontFamily: "system-ui, -apple-system, sans-serif",
//     backgroundImage: `linear-gradient(to bottom right, rgba(138, 196, 246, 0.85), rgba(255, 255, 255, 0.95)), url('/bg-candi.jpg')`, 
//     backgroundSize: "cover", 
//     backgroundPosition: "center", 
//     backgroundAttachment: "fixed"
//   },
  
//   // NAVBAR (Border solid tanpa shadow)
//   navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 6%", backgroundColor: "#fff", borderBottom: "2px solid #000", position: "sticky", top: 0, zIndex: 100 },
//   navBrand: { display: "flex", alignItems: "center", gap: "15px" },
  
//   // Daun Logo Mlampah Jogja (TETAP HIJAU)
//   logoIcon: { position: "relative", width: "24px", height: "24px" },
//   logoLeaf1: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#0eec02", borderRadius: "2px 8px 2px 8px", top: 0, left: 0, border: "1px solid #000" },
//   logoLeaf2: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#005f08", borderRadius: "8px 2px 8px 2px", top: 0, right: 0, border: "1px solid #000" },
//   logoLeaf3: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#00c264", borderRadius: "8px 2px 8px 2px", bottom: 0, left: 0, border: "1px solid #000" },

//   btnKeluar: { color: "#000", textDecoration: "none", border: "2px solid #000", padding: "8px 20px", borderRadius: "10px", fontSize: "0.95rem", cursor: "pointer", fontWeight: "800", transition: "all 0.2s" },

//   mainContent: { display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 4%", minHeight: "calc(100vh - 85px)" },
  
//   // KOTAK UTAMA (Clean Outline, Putih Solid, NO SHADOW)
//   cardPremium: { width: "100%", maxWidth: "650px", backgroundColor: "#fff", borderRadius: "24px", padding: "50px", border: "3px solid #000" },
  
//   stateCenter: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", animation: "fadeIn 0.5s ease" },
//   title: { margin: "0 0 15px 0", fontSize: "2.2rem", color: "#000", fontFamily: "Georgia, serif", fontWeight: "900" },
//   desc: { margin: "0 0 30px 0", fontSize: "1.05rem", color: "#333", lineHeight: 1.6, fontWeight: "500" },
  
//   // IKON KUSTOM
//   imageIconWrapper: { width: "100px", height: "100px", backgroundColor: "#f8fafc", borderRadius: "24px", border: "2px solid #000", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "25px", animation: "bounce 1s ease" },
//   customIcon: { width: "60%", height: "60%", objectFit: "contain" },

//   // KOTAK SUKSES (Pastel Blue)
//   successBox: { width: "100%", backgroundColor: "#f8fafc", border: "2px dashed #000", borderRadius: "16px", padding: "30px 20px", marginBottom: "35px" },

//   // TOMBOL-TOMBOL
//   btnPrimary: { width: "100%", padding: "20px", border: "2px solid #000", borderRadius: "16px", fontSize: "1.1rem", fontWeight: "900", transition: "all 0.2s", textTransform: "uppercase", letterSpacing: "1px" },
//   btnError: { padding: "15px 30px", border: "2px solid #ef4444", borderRadius: "12px", textDecoration: "none", fontWeight: "800", cursor: "pointer", transition: "all 0.2s" }
// };
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PortalAnggota() {
  const router = useRouter();

  // State untuk menampung data dari halaman depan (Landing Page)
  const [dataUser, setDataUser] = useState({ namaAnggota: "", kodeRuang: "", umur: "", gender: "" });
  
  // State untuk status verifikasi database
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidCode, setIsValidCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // STATE BARU: Mendeteksi apakah user ini sudah pernah submit kuesioner
  const [isSudahSubmit, setIsSudahSubmit] = useState(false);
  
  // State interaktif (Hover)
  const [hoverBtn, setHoverBtn] = useState<string | null>(null);

  // State untuk data grup dari Supabase
  const [namaGrupDariDB, setNamaGrupDariDB] = useState("");
  const [idRuang, setIdRuang] = useState<number | null>(null);

  useEffect(() => {
    // 1. Ambil data yang diisi user dari Pop-up Landing Page
    const savedData = localStorage.getItem("temp_anggota");
    
    if (!savedData) {
      alert("Harap login melalui halaman utama terlebih dahulu.");
      router.push("/");
      return;
    }

    const parsedData = JSON.parse(savedData);
    setDataUser(parsedData);

    // CEK STATUS SUBMIT DARI LOCAL STORAGE
    const statusSubmit = localStorage.getItem(`status_submit_${parsedData.kodeRuang.toUpperCase()}_${parsedData.namaAnggota}`);
    if (statusSubmit === "DONE") {
      setIsSudahSubmit(true);
    }

    // 2. CEK KODE RUANG LANGSUNG KE SUPABASE
    const verifikasiRuang = async () => {
      try {
        const { data, error } = await supabase
          .from('ruang')
          .select('id_ruang, nama_grup')
          .eq('kode_ruang', parsedData.kodeRuang.toUpperCase())
          .single();

        if (error || !data) {
          setIsValidCode(false);
        } else {
          setIsValidCode(true);
          setNamaGrupDariDB(data.nama_grup);
          setIdRuang(data.id_ruang);
        }
      } catch (err) {
        console.error("Gagal verifikasi ruang:", err);
        setIsValidCode(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifikasiRuang();
  }, [router]);

  // Handler untuk menyimpan data dan pindah ke Kuesioner
  const handleMulaiKuesioner = async () => {
    setIsSubmitting(true);

    // LOGIKA ANTI-BOCOR: Jika sudah pernah submit, langsung loncat ke kuesioner (Tahap 3 menanti di sana)
    if (isSudahSubmit) {
      router.push('/kuesioner');
      return;
    }

    try {
      // Pastikan data aman di database (double check)
      const { data: existingUser } = await supabase
        .from('user_anggota')
        .select('id_user')
        .eq('kode_ruang', dataUser.kodeRuang.toUpperCase())
        .eq('nama_anggota', dataUser.namaAnggota)
        .single();

      if (!existingUser) {
        const { error } = await supabase
          .from('user_anggota')
          .insert([
            {
              kode_ruang: dataUser.kodeRuang.toUpperCase(),
              nama_anggota: dataUser.namaAnggota,
              usia: parseInt(dataUser.umur),
              gender: dataUser.gender,
              id_ruang: idRuang 
            }
          ]);

        if (error) {
          alert(`Gagal mendaftarkan diri: ${error.message}`);
          setIsSubmitting(false);
          return;
        }
      }
      
      router.push('/kuesioner');
      
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem saat mendaftar.");
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>
          {/* Logo Daun Asli */}
          <div style={styles.logoIcon}>
            <div style={styles.logoLeaf1} />
            <div style={styles.logoLeaf2} />
            <div style={styles.logoLeaf3} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#000", fontFamily: "Georgia, serif", fontWeight: "900" }}>Portal Anggota</h2>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#333", fontWeight: "600" }}>Mlampah Jogja DSS</p>
          </div>
        </div>
        <div 
          onClick={() => { localStorage.clear(); router.push('/'); }} 
          onMouseEnter={() => setHoverBtn('logout')}
          onMouseLeave={() => setHoverBtn(null)}
          style={{
            ...styles.btnKeluar,
            backgroundColor: hoverBtn === 'logout' ? "#000" : "#fff",
            color: hoverBtn === 'logout' ? "#B3EBF2" : "#000",
            transform: hoverBtn === 'logout' ? "translateY(-2px)" : "translateY(0)"
          }}
        >
          Keluar
        </div>
      </nav>

      <main style={styles.mainContent}>
        
        {/* KOTAK VERIFIKASI / LOBBY (Clean Outline Putih) */}
        <div style={styles.cardPremium}>
          
          {/* STATE 1: SEDANG CEK DATABASE */}
          {isVerifying && (
            <div style={styles.stateCenter}>
              <div style={{fontSize: "4rem", animation: "pulse 1.5s infinite", marginBottom: "15px"}}>🔍</div>
              <h2 style={styles.title}>Menyinkronkan Data...</h2>
              <p style={styles.desc}>Sistem sedang mencari ruang rombongan dengan kode <strong style={{color: "#000"}}>{dataUser.kodeRuang}</strong> di database.</p>
            </div>
          )}

          {/* STATE 2: KODE SALAH / TIDAK DITEMUKAN */}
          {!isVerifying && !isValidCode && (
            <div style={styles.stateCenter}>
              <div style={{fontSize: "4rem", marginBottom: "15px"}}>❌</div>
              <h2 style={{...styles.title, color: "#ef4444"}}>Kode Ruang Tidak Valid</h2>
              <p style={styles.desc}>Ruang <strong style={{color: "#000"}}>{dataUser.kodeRuang}</strong> tidak ditemukan atau Ketua belum membuka ruang tersebut.</p>
              <Link 
                href="/" 
                onMouseEnter={() => setHoverBtn('error')}
                onMouseLeave={() => setHoverBtn(null)}
                style={{
                  ...styles.btnError,
                  backgroundColor: hoverBtn === 'error' ? "#ef4444" : "#fff",
                  color: hoverBtn === 'error' ? "#fff" : "#ef4444",
                  transform: hoverBtn === 'error' ? "translateY(-2px)" : "translateY(0)"
                }}
              >
                Kembali ke Halaman Utama
              </Link>
            </div>
          )}

          {/* STATE 3: BERHASIL TERHUBUNG (KODE BENAR) */}
          {!isVerifying && isValidCode && (
            <div style={styles.stateCenter}>
              
              {/* IKON CUSTOM ROMBONGAN */}
              <div style={styles.imageIconWrapper}>
                <img src="/group rombongan.png" alt="Rombongan" style={styles.customIcon} />
              </div>
              
              <h2 style={styles.title}>Halo, {dataUser.namaAnggota}! 👋</h2>
              
              <div style={styles.successBox}>
                <p style={{fontSize: "0.95rem", color: "#333", margin: "0 0 10px 0", fontWeight: "600"}}>Anda berhasil terhubung dengan rombongan:</p>
                <h3 style={{fontSize: "2rem", color: "#000", margin: "0 0 5px 0", fontWeight: "900", fontFamily: "Georgia, serif"}}>{namaGrupDariDB}</h3>
                <p style={{fontSize: "0.9rem", color: "#000", margin: 0, fontWeight: "700", backgroundColor: "#B3EBF2", padding: "4px 12px", borderRadius: "8px", display: "inline-block", border: "2px solid #000", marginTop: "10px"}}>Kode: {dataUser.kodeRuang.toUpperCase()}</p>
              </div>

              {/* LOGIKA TEKS DINAMIS BERDASARKAN STATUS SUBMIT */}
              <p style={{...styles.desc, maxWidth: "500px", color: isSudahSubmit ? "#059669" : "#333"}}>
                {isSudahSubmit 
                  ? "✅ Anda telah menyelesaikan pengisian kuesioner untuk rombongan ini. Silakan masuk ke dalam untuk mengecek status keputusan Ketua Grup."
                  : "Ketua rombongan sedang menunggu partisipasi Anda. Silakan mulai kuesioner BWM untuk menentukan tingkat kepentingan kriteria wisata Anda."
                }
              </p>

              {/* TOMBOL EKSEKUSI */}
              <button 
                onClick={handleMulaiKuesioner} 
                disabled={isSubmitting}
                onMouseEnter={() => setHoverBtn('mulai')}
                onMouseLeave={() => setHoverBtn(null)}
                style={{
                  ...styles.btnPrimary,
                  backgroundColor: isSubmitting ? "#e2e8f0" : (hoverBtn === 'mulai' ? "#000" : "#B3EBF2"),
                  color: isSubmitting ? "#94a3b8" : (hoverBtn === 'mulai' ? "#B3EBF2" : "#000"),
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  transform: hoverBtn === 'mulai' && !isSubmitting ? "translateY(-2px)" : "translateY(0)"
                }}
              >
                {isSubmitting 
                  ? "Memproses..." 
                  : (isSudahSubmit ? "Lihat Status & Hasil ➔" : "Mulai Kuesioner BWM ➔")
                }
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

// === PREMIUM CLEAN OUTLINE (PASTEL BLUE GRADIENT) ===
const styles: { [key: string]: React.CSSProperties } = {
  // Tema Terang dengan Gradasi Biru-Putih dan Background Candi
  container: { 
    minHeight: "100vh", width: "100%", maxWidth: "100vw", boxSizing: "border-box",
    backgroundColor: "#ffffff", 
    fontFamily: "system-ui, -apple-system, sans-serif",
    backgroundImage: `linear-gradient(to bottom right, rgba(138, 196, 246, 0.85), rgba(255, 255, 255, 0.95)), url('/bg-candi.jpg')`, 
    backgroundSize: "cover", 
    backgroundPosition: "center", 
    backgroundAttachment: "fixed"
  },
  
  // NAVBAR (Border solid tanpa shadow)
  navbar: { width: "100%", boxSizing: "border-box", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 6%", backgroundColor: "#fff", borderBottom: "2px solid #000", position: "sticky", top: 0, zIndex: 100 },
  navBrand: { display: "flex", alignItems: "center", gap: "15px" },
  
  // Daun Logo Mlampah Jogja (TETAP HIJAU)
  logoIcon: { position: "relative", width: "24px", height: "24px" },
  logoLeaf1: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#0eec02", borderRadius: "2px 8px 2px 8px", top: 0, left: 0, border: "1px solid #000" },
  logoLeaf2: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#005f08", borderRadius: "8px 2px 8px 2px", top: 0, right: 0, border: "1px solid #000" },
  logoLeaf3: { position: "absolute", width: "12px", height: "12px", backgroundColor: "#00c264", borderRadius: "8px 2px 8px 2px", bottom: 0, left: 0, border: "1px solid #000" },

  btnKeluar: { color: "#000", textDecoration: "none", border: "2px solid #000", padding: "8px 20px", borderRadius: "10px", fontSize: "0.95rem", cursor: "pointer", fontWeight: "800", transition: "all 0.2s" },

  mainContent: { display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 4%", minHeight: "calc(100vh - 85px)", width: "100%", boxSizing: "border-box" },
  
  // KOTAK UTAMA (Clean Outline, Putih Solid, NO SHADOW)
  cardPremium: { width: "100%", maxWidth: "650px", backgroundColor: "#fff", borderRadius: "24px", padding: "50px", border: "3px solid #000" },
  
  stateCenter: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", animation: "fadeIn 0.5s ease" },
  title: { margin: "0 0 15px 0", fontSize: "2.2rem", color: "#000", fontFamily: "Georgia, serif", fontWeight: "900" },
  desc: { margin: "0 0 30px 0", fontSize: "1.05rem", color: "#333", lineHeight: 1.6, fontWeight: "500" },
  
  // IKON KUSTOM
  imageIconWrapper: { width: "100px", height: "100px", backgroundColor: "#f8fafc", borderRadius: "24px", border: "2px solid #000", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "25px", animation: "bounce 1s ease" },
  customIcon: { width: "60%", height: "60%", objectFit: "contain" },

  // KOTAK SUKSES (Pastel Blue)
  successBox: { width: "100%", backgroundColor: "#f8fafc", border: "2px dashed #000", borderRadius: "16px", padding: "30px 20px", marginBottom: "35px" },

  // TOMBOL-TOMBOL
  btnPrimary: { width: "100%", padding: "20px", border: "2px solid #000", borderRadius: "16px", fontSize: "1.1rem", fontWeight: "900", transition: "all 0.2s", textTransform: "uppercase", letterSpacing: "1px" },
  btnError: { padding: "15px 30px", border: "2px solid #ef4444", borderRadius: "12px", textDecoration: "none", fontWeight: "800", cursor: "pointer", transition: "all 0.2s" }
};