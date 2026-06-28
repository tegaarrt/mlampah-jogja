// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";

// export default function EksplorasiPage() {
//   const router = useRouter();
  
//   // State Data
//   const [destinasiList, setDestinasiList] = useState<any[]>([]);
//   const [kategoriList, setKategoriList] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   // State Filter & Interaktif
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeFilter, setActiveFilter] = useState("Semua");
//   const [hoverNav, setHoverNav] = useState<string | null>(null);
//   const [hoverCard, setHoverCard] = useState<number | null>(null);

//   useEffect(() => {
//     const fetchSemuaDestinasi = async () => {
//       console.log("⏳ Mencoba menghubungi Supabase...");

//       try {
//         // KITA UBAH JADI SELECT BINTANG (*) DULU UNTUK TESTING
//         const { data, error } = await supabase
//           .from('destinasi')
//           .select('*'); 

//         console.log("📊 HASIL DATA:", data);
//         console.log("❌ PESAN ERROR:", error);

//         if (error) {
//           alert("Gagal memuat data! Error: " + error.message); 
//         } else if (data && data.length === 0) {
//           alert("Koneksi berhasil, TAPI Supabase mengirimkan data kosong (0 baris). Cek RLS atau isi tabel!");
//         } else {
//           alert(`Sukses! Berhasil ditarik ${data?.length} destinasi wisata.`);
//           setDestinasiList(data || []);
//         }
//       } catch (err) {
//         console.error("System Error:", err);
//         alert("Terjadi kesalahan sistem yang tidak terduga.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSemuaDestinasi();
//   }, []);
  

//   // Logika Filter (Pencarian Teks + Tombol Kategori)
//   const filteredDestinasi = destinasiList.filter(item => {
//     const matchSearch = item.nama_tempat?.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchCategory = activeFilter === "Semua" || item.kategori_wisata?.nama === activeFilter;
//     return matchSearch && matchCategory;
//   });

//   return (
//     <div style={styles.pageContainer}>
      
//       {/* NAVBAR */}
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
        
//         <div style={styles.navRightActions}>
//           <button style={styles.btnNavOutline} onClick={() => router.push('/about')}>
//             <span style={{marginRight: "6px"}}>ⓘ</span> About
//           </button>
//           <button style={styles.btnNavOutline} onClick={() => window.open('/panduan', '_blank')}>
//             <span style={{marginRight: "6px"}}>📄</span> Panduan
//           </button>
//           <button style={styles.btnNavPrimary} onClick={() => window.open('/staff', '_blank')}>
//             <span style={{marginRight: "6px"}}>🔒</span> Portal Admin
//           </button>
//         </div>
//       </nav>

//       {/* HEADER EKSPLORASI */}
//       <header style={styles.exploreHeader}>
//         <div style={styles.headerContent}>
//           <h1 style={styles.headerTitle}>Eksplorasi Keindahan Jogja</h1>
//           <p style={styles.headerSubtitle}>Temukan puluhan destinasi wisata terbaik untuk rombongan Anda.</p>
          
//           <div style={styles.searchContainer}>
//             <span style={styles.searchIcon}>🔍</span>
//             <input 
//               type="text" 
//               placeholder="Cari nama destinasi wisata..." 
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               style={styles.searchInput}
//             />
//             <button style={styles.btnSearch}>Cari</button>
//           </div>
//         </div>
//       </header>

//       {/* KONTEN UTAMA ETALASE */}
//       <main style={styles.mainContent}>
        
//         <div style={styles.sectionTitleBox}>
//           <h2 style={styles.sectionTitle}>Rekomendasi Destinasi ({filteredDestinasi.length})</h2>
          
//           {/* TOMBOL FILTER KATEGORI DINAMIS DARI DATABASE */}
//           <div style={styles.filterGroup}>
//             <button 
//               onClick={() => setActiveFilter("Semua")}
//               style={activeFilter === "Semua" ? styles.filterChipActive : styles.filterChip}
//             >
//               Semua
//             </button>
//             {kategoriList.map(kat => (
//               <button 
//                 key={kat}
//                 onClick={() => setActiveFilter(kat)}
//                 style={activeFilter === kat ? styles.filterChipActive : styles.filterChip}
//               >
//                 {kat}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* AREA RENDER KARTU DESTINASI */}
//         {loading ? (
//           <div style={styles.loadingState}>
//             <div style={{fontSize: "3rem", animation: "spin 2s linear infinite", marginBottom: "15px"}}>🔄</div>
//             <p style={{fontSize: "1.2rem", fontWeight: "bold", color: "#0f172a"}}>Menyinkronkan Etalase Wisata...</p>
//             <p style={{color: "#64748b"}}>Menarik data langsung dari database Mlampah Jogja.</p>
//           </div>
//         ) : filteredDestinasi.length === 0 ? (
//           <div style={styles.emptyState}>
//             <div style={{fontSize: "4rem", marginBottom: "15px"}}>🏜️</div>
//             <h3 style={{color: "#0f172a", fontSize: "1.5rem"}}>Destinasi tidak ditemukan</h3>
//             <p style={{color: "#64748b"}}>Coba gunakan kata kunci pencarian atau kategori yang lain.</p>
//           </div>
//         ) : (
//           <div style={styles.gridContainer}>
//             {filteredDestinasi.map((item) => {
//               const isHovered = hoverCard === item.id;
              
//               return (
//                 <Link href={`/eksplorasi/${item.id}`} key={item.id} style={styles.cardLink}>
//                   <div 
//                     onMouseEnter={() => setHoverCard(item.id)}
//                     onMouseLeave={() => setHoverCard(null)}
//                     style={{
//                       ...styles.card,
//                       transform: isHovered ? "translateY(-6px)" : "translateY(0)",
//                       boxShadow: isHovered ? "0 15px 30px rgba(0,0,0,0.1)" : "0 4px 10px rgba(0,0,0,0.03)",
//                       borderColor: isHovered ? "#84cc16" : "#e2e8f0"
//                     }}
//                   >
//                     {/* FOTO & BADGE KATEGORI */}
//                     <div style={styles.imgWrapper}>
//                       {item.kategori_wisata?.nama && (
//                         <div style={styles.badgeTop}>{item.kategori_wisata.nama}</div>
//                       )}
                      
//                       <img 
//                         src={item.gambar_url || "https://images.unsplash.com/photo-1584814352125-9f5b61b58941?w=500&q=80"} 
//                         alt={item.nama_tempat} 
//                         style={{...styles.img, transform: isHovered ? "scale(1.05)" : "scale(1)"}} 
//                       />
//                     </div>
                    
//                     {/* DETAIL KARTU */}
//                     <div style={styles.cardBody}>
//                       <h3 style={styles.namaTempat}>{item.nama_tempat}</h3>
//                       <p style={styles.alamatText}>📍 {item.alamat ? (item.alamat.length > 25 ? item.alamat.substring(0, 25) + '...' : item.alamat) : "Yogyakarta"}</p>
                      
//                       <div style={styles.divider}></div>
                      
//                       <div style={styles.priceRow}>
//                         <div style={styles.ratingBox}>
//                           <span style={{color: "#f59e0b", fontSize: "0.9rem"}}>★</span>
//                           <span style={styles.ratingText}>{item.rating || "4.5"}</span>
//                         </div>
//                         <div style={styles.hargaBox}>
//                           <span style={styles.hargaLabel}>Mulai dari</span>
//                           <span style={styles.hargaValue}>
//                             Rp{item.harga_tiket ? Number(item.harga_tiket).toLocaleString('id-ID') : "Gratis"}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         )}
//       </main>

//       {/* FOOTER */}
//       <footer style={styles.footer}>
//         <p style={styles.footerText}>&copy; Website Mlampah Jogja &bull; Etalase Wisata Terlengkap</p>
//       </footer>
//     </div>
//   );
// }

// // === CSS IN JS ===
// const styles: { [key: string]: React.CSSProperties } = {
//   pageContainer: { 
//     minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
//     display: "flex", flexDirection: "column" 
//   },
  
//   navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 4%", width: "100%", backgroundColor: "#fff", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 100, boxSizing: "border-box" },
//   logo: { display: "flex", alignItems: "center", gap: "10px", fontSize: "1.2rem", fontWeight: "900", color: "#0f172a", cursor: "pointer", transition: "transform 0.2s" },
//   logoIcon: { position: "relative", width: "22px", height: "22px" },
//   logoLeaf1: { position: "absolute", width: "10px", height: "10px", backgroundColor: "#84cc16", borderRadius: "2px 8px 2px 8px", top: 0, left: 0 },
//   logoLeaf2: { position: "absolute", width: "10px", height: "10px", backgroundColor: "#4d7c0f", borderRadius: "8px 2px 8px 2px", top: 0, right: 0 },
//   logoLeaf3: { position: "absolute", width: "10px", height: "10px", backgroundColor: "#65a30d", borderRadius: "8px 2px 8px 2px", bottom: 0, left: 0 },
  
//   navRightActions: { display: "flex", alignItems: "center", gap: "12px" },
//   btnNavOutline: { padding: "8px 16px", borderRadius: "8px", border: "1px solid #4d7c0f", backgroundColor: "#fff", color: "#4d7c0f", cursor: "pointer", fontSize: "0.85rem", fontWeight: "700" },
//   btnNavPrimary: { padding: "8px 16px", borderRadius: "8px", border: "none", backgroundColor: "#4d7c0f", color: "#fff", cursor: "pointer", fontSize: "0.85rem", fontWeight: "700" },

//   exploreHeader: {
//     width: "100%", padding: "60px 20px",
//     backgroundColor: "#111827",
//     backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(77, 124, 15, 0.8)), url('/background2.jpg')`,
//     backgroundSize: "cover", backgroundPosition: "center",
//     display: "flex", justifyContent: "center", alignItems: "center"
//   },
//   headerContent: { maxWidth: "800px", width: "100%", textAlign: "center", color: "#fff" },
//   headerTitle: { fontSize: "2.8rem", fontWeight: "900", fontFamily: "Georgia, serif", margin: "0 0 10px 0" },
//   headerSubtitle: { fontSize: "1.1rem", color: "#cbd5e1", margin: "0 0 30px 0" },
  
//   searchContainer: { display: "flex", alignItems: "center", backgroundColor: "#fff", borderRadius: "12px", padding: "8px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" },
//   searchIcon: { fontSize: "1.2rem", padding: "0 15px", color: "#64748b" },
//   searchInput: { flex: 1, border: "none", outline: "none", padding: "12px 0", fontSize: "1rem", color: "#0f172a" },
//   btnSearch: { padding: "12px 30px", backgroundColor: "#4d7c0f", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", fontSize: "1rem", cursor: "pointer" },

//   mainContent: { flex: 1, maxWidth: "1300px", width: "100%", margin: "0 auto", padding: "40px 4%", boxSizing: "border-box" },
  
//   sectionTitleBox: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "30px" },
//   sectionTitle: { fontSize: "1.5rem", fontWeight: "800", color: "#0f172a", margin: 0 },
  
//   filterGroup: { display: "flex", gap: "10px", flexWrap: "wrap" },
//   filterChipActive: { padding: "8px 18px", backgroundColor: "#f0fdf4", color: "#16a34a", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "700", border: "1px solid #bbf7d0", cursor: "pointer" },
//   filterChip: { padding: "8px 18px", backgroundColor: "#fff", color: "#475569", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "600", border: "1px solid #cbd5e1", cursor: "pointer", transition: "all 0.2s" },

//   gridContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "25px" },
//   cardLink: { textDecoration: "none", color: "inherit" },
//   card: { backgroundColor: "#fff", borderRadius: "16px", overflow: "hidden", border: "1px solid #e2e8f0", transition: "all 0.3s ease", cursor: "pointer", display: "flex", flexDirection: "column", height: "100%" },
//   imgWrapper: { width: "100%", height: "200px", overflow: "hidden", position: "relative" },
//   badgeTop: { position: "absolute", top: "15px", left: "15px", backgroundColor: "rgba(0,0,0,0.75)", color: "#fff", padding: "6px 12px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: "700", zIndex: 10, backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.2)" },
//   img: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" },
  
//   cardBody: { padding: "20px", display: "flex", flexDirection: "column", flex: 1 },
//   namaTempat: { fontSize: "1.15rem", margin: "0 0 5px 0", fontWeight: "800", color: "#0f172a", lineHeight: "1.3" },
//   alamatText: { fontSize: "0.85rem", color: "#64748b", margin: "0", fontWeight: "500" },
  
//   divider: { width: "100%", height: "1px", backgroundColor: "#f1f5f9", margin: "15px 0", marginTop: "auto" },
  
//   priceRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-end" },
//   ratingBox: { display: "flex", alignItems: "center", gap: "4px" },
//   ratingText: { fontSize: "0.9rem", color: "#475569", fontWeight: "700" },
//   hargaBox: { display: "flex", flexDirection: "column", alignItems: "flex-end" },
//   hargaLabel: { fontSize: "0.7rem", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase" },
//   hargaValue: { fontSize: "1.1rem", color: "#ea580c", fontWeight: "900" },

//   loadingState: { textAlign: "center", padding: "100px 20px" },
//   emptyState: { textAlign: "center", padding: "80px 20px" },
//   footer: { padding: "30px 4%", textAlign: "center", backgroundColor: "#fff", borderTop: "1px solid #e2e8f0", marginTop: "auto" },
//   footerText: { color: "#94a3b8", fontSize: "0.85rem", margin: 0, fontWeight: "600" }
// };

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EksplorasiPage() {
  const router = useRouter();
  
  // State Data
  const [destinasiList, setDestinasiList] = useState<any[]>([]);
  const [kategoriList, setKategoriList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Filter & Interaktif
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [hoverNav, setHoverNav] = useState<string | null>(null);
  const [hoverCard, setHoverCard] = useState<number | null>(null);

  useEffect(() => {
    const fetchSemuaDestinasi = async () => {
      console.log("⏳ Mencoba menghubungi Supabase...");

      try {
        const { data, error } = await supabase
          .from('destinasi')
          .select(`
            *,
            kategori_wisata (
              nama
            )
          `); 

        if (error) {
          alert("Gagal memuat data! Error: " + error.message); 
        } else if (data) {
          // --- LOGIKA MENGEKSTRAK KATEGORI UNIK DARI DATABASE ---
          const daftarKategoriUnik = new Set<string>();
          
          data.forEach(item => {
            if (item.kategori_wisata && item.kategori_wisata.nama) {
              daftarKategoriUnik.add(item.kategori_wisata.nama);
            }
          });

          // Ubah tipe Set menjadi Array dan masukkan ke State
          setKategoriList(Array.from(daftarKategoriUnik));
          setDestinasiList(data);
        }
      } catch (err) {
        console.error("System Error:", err);
        alert("Terjadi kesalahan sistem yang tidak terduga.");
      } finally {
        setLoading(false);
      }
    };

    fetchSemuaDestinasi();
  }, []);
  

  // Logika Filter (Pencarian Teks + Tombol Kategori)
  const filteredDestinasi = destinasiList.filter(item => {
    const matchSearch = item.nama_tempat?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = activeFilter === "Semua" || item.kategori_wisata?.nama === activeFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div style={styles.pageContainer}>
      
      {/* NAVBAR */}
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
          <button style={styles.btnNavOutline} onClick={() => router.push('/about')}>
            <span style={{marginRight: "6px"}}>ⓘ</span> About
          </button>
          <button style={styles.btnNavOutline} onClick={() => window.open('/panduan', '_blank')}>
            <span style={{marginRight: "6px"}}>📄</span> Panduan
          </button>
          <button style={styles.btnNavPrimary} onClick={() => window.open('/staff', '_blank')}>
            <span style={{marginRight: "6px"}}>🔒</span> Portal Admin
          </button>
        </div>
      </nav>

      {/* HEADER EKSPLORASI */}
      <header style={styles.exploreHeader}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>Eksplorasi Keindahan Jogja</h1>
          <p style={styles.headerSubtitle}>Temukan puluhan destinasi wisata terbaik untuk rombongan Anda.</p>
          
          <div style={styles.searchContainer}>
            <span style={styles.searchIcon}>🔍</span>
            <input 
              type="text" 
              placeholder="Cari nama destinasi wisata..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
            <button style={styles.btnSearch}>Cari</button>
          </div>
        </div>
      </header>

      {/* KONTEN UTAMA ETALASE */}
      <main style={styles.mainContent}>
        
        <div style={styles.sectionTitleBox}>
          <h2 style={styles.sectionTitle}>Rekomendasi Destinasi ({filteredDestinasi.length})</h2>
          
          {/* TOMBOL FILTER KATEGORI DINAMIS DARI DATABASE */}
          <div style={styles.filterGroup}>
            <button 
              onClick={() => setActiveFilter("Semua")}
              style={activeFilter === "Semua" ? styles.filterChipActive : styles.filterChip}
            >
              Semua
            </button>
            {kategoriList.map(kat => (
              <button 
                key={kat}
                onClick={() => setActiveFilter(kat)}
                style={activeFilter === kat ? styles.filterChipActive : styles.filterChip}
              >
                {kat}
              </button>
            ))}
          </div>
        </div>

        {/* AREA RENDER KARTU DESTINASI */}
        {loading ? (
          <div style={styles.loadingState}>
            <div style={{fontSize: "3rem", animation: "spin 2s linear infinite", marginBottom: "15px"}}>🔄</div>
            <p style={{fontSize: "1.2rem", fontWeight: "bold", color: "#0f172a"}}>Menyinkronkan Etalase Wisata...</p>
            <p style={{color: "#64748b"}}>Menarik data langsung dari database Mlampah Jogja.</p>
          </div>
        ) : filteredDestinasi.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{fontSize: "4rem", marginBottom: "15px"}}>🏜️</div>
            <h3 style={{color: "#0f172a", fontSize: "1.5rem"}}>Destinasi tidak ditemukan</h3>
            <p style={{color: "#64748b"}}>Coba gunakan kata kunci pencarian atau kategori yang lain.</p>
          </div>
        ) : (
          <div style={styles.gridContainer}>
            {filteredDestinasi.map((item) => {
              const isHovered = hoverCard === item.id;
              
              return (
                <Link href={`/eksplorasi/${item.id}`} key={item.id} style={styles.cardLink}>
                  <div 
                    onMouseEnter={() => setHoverCard(item.id)}
                    onMouseLeave={() => setHoverCard(null)}
                    style={{
                      ...styles.card,
                      transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                      boxShadow: isHovered ? "0 15px 30px rgba(0,0,0,0.1)" : "0 4px 10px rgba(0,0,0,0.03)",
                      borderColor: isHovered ? "#84cc16" : "#e2e8f0"
                    }}
                  >
                    {/* FOTO & BADGE KATEGORI */}
                    <div style={styles.imgWrapper}>
                      {item.kategori_wisata?.nama && (
                        <div style={styles.badgeTop}>{item.kategori_wisata.nama}</div>
                      )}
                      
                      <img 
                        src={item.gambar_url || "https://images.unsplash.com/photo-1584814352125-9f5b61b58941?w=500&q=80"} 
                        alt={item.nama_tempat} 
                        style={{...styles.img, transform: isHovered ? "scale(1.05)" : "scale(1)"}} 
                      />
                    </div>
                    
                    {/* DETAIL KARTU */}
                    <div style={styles.cardBody}>
                      <h3 style={styles.namaTempat}>{item.nama_tempat}</h3>
                      <p style={styles.alamatText}>📍 {item.alamat ? (item.alamat.length > 25 ? item.alamat.substring(0, 25) + '...' : item.alamat) : "Yogyakarta"}</p>
                      
                      <div style={styles.divider}></div>
                      
                      <div style={styles.priceRow}>
                        <div style={styles.ratingBox}>
                          <span style={{color: "#f59e0b", fontSize: "0.9rem"}}>★</span>
                          <span style={styles.ratingText}>{item.rating || "4.5"}</span>
                        </div>
                        <div style={styles.hargaBox}>
                          <span style={styles.hargaLabel}>Mulai dari</span>
                          <span style={styles.hargaValue}>
                            Rp{item.harga_tiket ? Number(item.harga_tiket).toLocaleString('id-ID') : "Gratis"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>&copy; Website Mlampah Jogja &bull; Etalase Wisata Terlengkap</p>
      </footer>
    </div>
  );
}

// === CSS IN JS ===
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: { 
    minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    display: "flex", flexDirection: "column" 
  },
  
  navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 4%", width: "100%", backgroundColor: "#fff", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 100, boxSizing: "border-box" },
  logo: { display: "flex", alignItems: "center", gap: "10px", fontSize: "1.2rem", fontWeight: "900", color: "#0f172a", cursor: "pointer", transition: "transform 0.2s" },
  logoIcon: { position: "relative", width: "22px", height: "22px" },
  logoLeaf1: { position: "absolute", width: "10px", height: "10px", backgroundColor: "#84cc16", borderRadius: "2px 8px 2px 8px", top: 0, left: 0 },
  logoLeaf2: { position: "absolute", width: "10px", height: "10px", backgroundColor: "#4d7c0f", borderRadius: "8px 2px 8px 2px", top: 0, right: 0 },
  logoLeaf3: { position: "absolute", width: "10px", height: "10px", backgroundColor: "#65a30d", borderRadius: "8px 2px 8px 2px", bottom: 0, left: 0 },
  
  navRightActions: { display: "flex", alignItems: "center", gap: "12px" },
  btnNavOutline: { padding: "8px 16px", borderRadius: "8px", border: "1px solid #4d7c0f", backgroundColor: "#fff", color: "#4d7c0f", cursor: "pointer", fontSize: "0.85rem", fontWeight: "700" },
  btnNavPrimary: { padding: "8px 16px", borderRadius: "8px", border: "none", backgroundColor: "#4d7c0f", color: "#fff", cursor: "pointer", fontSize: "0.85rem", fontWeight: "700" },

  exploreHeader: {
    width: "100%", padding: "60px 20px",
    backgroundColor: "#111827",
    backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(77, 124, 15, 0.8)), url('/background2.jpg')`,
    backgroundSize: "cover", backgroundPosition: "center",
    display: "flex", justifyContent: "center", alignItems: "center"
  },
  headerContent: { maxWidth: "800px", width: "100%", textAlign: "center", color: "#fff" },
  headerTitle: { fontSize: "2.8rem", fontWeight: "900", fontFamily: "Georgia, serif", margin: "0 0 10px 0" },
  headerSubtitle: { fontSize: "1.1rem", color: "#cbd5e1", margin: "0 0 30px 0" },
  
  searchContainer: { display: "flex", alignItems: "center", backgroundColor: "#fff", borderRadius: "12px", padding: "8px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" },
  searchIcon: { fontSize: "1.2rem", padding: "0 15px", color: "#64748b" },
  searchInput: { flex: 1, border: "none", outline: "none", padding: "12px 0", fontSize: "1rem", color: "#0f172a" },
  btnSearch: { padding: "12px 30px", backgroundColor: "#4d7c0f", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", fontSize: "1rem", cursor: "pointer" },

  mainContent: { flex: 1, maxWidth: "1300px", width: "100%", margin: "0 auto", padding: "40px 4%", boxSizing: "border-box" },
  
  sectionTitleBox: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "30px" },
  sectionTitle: { fontSize: "1.5rem", fontWeight: "800", color: "#0f172a", margin: 0 },
  
  filterGroup: { display: "flex", gap: "10px", flexWrap: "wrap" },
  filterChipActive: { padding: "8px 18px", backgroundColor: "#f0fdf4", color: "#16a34a", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "700", border: "1px solid #bbf7d0", cursor: "pointer" },
  filterChip: { padding: "8px 18px", backgroundColor: "#fff", color: "#475569", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "600", border: "1px solid #cbd5e1", cursor: "pointer", transition: "all 0.2s" },

  gridContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "25px" },
  cardLink: { textDecoration: "none", color: "inherit" },
  card: { backgroundColor: "#fff", borderRadius: "16px", overflow: "hidden", border: "1px solid #e2e8f0", transition: "all 0.3s ease", cursor: "pointer", display: "flex", flexDirection: "column", height: "100%" },
  imgWrapper: { width: "100%", height: "200px", overflow: "hidden", position: "relative" },
  badgeTop: { position: "absolute", top: "15px", left: "15px", backgroundColor: "rgba(0,0,0,0.75)", color: "#fff", padding: "6px 12px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: "700", zIndex: 10, backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.2)" },
  img: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" },
  
  cardBody: { padding: "20px", display: "flex", flexDirection: "column", flex: 1 },
  namaTempat: { fontSize: "1.15rem", margin: "0 0 5px 0", fontWeight: "800", color: "#0f172a", lineHeight: "1.3" },
  alamatText: { fontSize: "0.85rem", color: "#64748b", margin: "0", fontWeight: "500" },
  
  divider: { width: "100%", height: "1px", backgroundColor: "#f1f5f9", margin: "15px 0", marginTop: "auto" },
  
  priceRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-end" },
  ratingBox: { display: "flex", alignItems: "center", gap: "4px" },
  ratingText: { fontSize: "0.9rem", color: "#475569", fontWeight: "700" },
  hargaBox: { display: "flex", flexDirection: "column", alignItems: "flex-end" },
  hargaLabel: { fontSize: "0.7rem", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase" },
  hargaValue: { fontSize: "1.1rem", color: "#ea580c", fontWeight: "900" },

  loadingState: { textAlign: "center", padding: "100px 20px" },
  emptyState: { textAlign: "center", padding: "80px 20px" },
  footer: { padding: "30px 4%", textAlign: "center", backgroundColor: "#fff", borderTop: "1px solid #e2e8f0", marginTop: "auto" },
  footerText: { color: "#94a3b8", fontSize: "0.85rem", margin: 0, fontWeight: "600" }
};