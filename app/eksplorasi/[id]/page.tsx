// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";

// export default function DetailDestinasiPage() {
//   const router = useRouter();
//   const { id } = useParams();
  
//   const [destinasi, setDestinasi] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDetail = async () => {
//       try {
//         const { data, error } = await supabase
//           .from('destinasi')
//           .select(`
//             *,
//             kategori_wisata (nama)
//           `)
//           .eq('id', id)
//           .single();

//         if (error) {
//           alert("Gagal memuat detail destinasi.");
//         } else {
//           setDestinasi(data);
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchDetail();
//   }, [id]);

//   if (loading) return <div style={{padding: "50px", textAlign: "center"}}>Memuat detail wisata...</div>;
//   if (!destinasi) return <div style={{padding: "50px", textAlign: "center"}}>Destinasi tidak ditemukan!</div>;

//   return (
//     <div style={{minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "sans-serif"}}>
//       {/* Tombol Back */}
//       <div style={{padding: "20px 4%"}}>
//         <button 
//           onClick={() => router.back()} 
//           style={{padding: "10px 20px", cursor: "pointer", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#fff"}}
//         >
//           ⬅ Kembali ke Etalase
//         </button>
//       </div>

//       {/* Konten Detail */}
//       <div style={{maxWidth: "1000px", margin: "0 auto", padding: "0 4%", display: "flex", gap: "40px", flexWrap: "wrap"}}>
//         <img 
//           src={destinasi.gambar_url || "https://images.unsplash.com/photo-1584814352125-9f5b61b58941?w=800&q=80"} 
//           alt={destinasi.nama_tempat} 
//           style={{flex: 1, minWidth: "300px", borderRadius: "16px", objectFit: "cover", maxHeight: "500px"}} 
//         />
        
//         <div style={{flex: 1, minWidth: "300px"}}>
//           <div style={{backgroundColor: "#84cc16", display: "inline-block", padding: "6px 12px", borderRadius: "8px", color: "#fff", fontWeight: "bold", fontSize: "0.8rem", marginBottom: "15px"}}>
//             {destinasi.kategori_wisata?.nama || "Umum"}
//           </div>
//           <h1 style={{fontSize: "2.5rem", margin: "0 0 10px 0", color: "#0f172a"}}>{destinasi.nama_tempat}</h1>
//           <p style={{fontSize: "1.1rem", color: "#64748b", margin: "0 0 20px 0"}}>📍 {destinasi.alamat}</p>
          
//           <div style={{backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "25px"}}>
//             <h3 style={{margin: "0 0 10px 0", color: "#0f172a"}}>Informasi Harga</h3>
//             <p style={{fontSize: "1.5rem", color: "#ea580c", fontWeight: "900", margin: 0}}>
//               Rp{destinasi.harga_tiket ? Number(destinasi.harga_tiket).toLocaleString('id-ID') : "Gratis"}
//             </p>
//           </div>

//           <h3 style={{color: "#0f172a", marginBottom: "10px"}}>Deskripsi</h3>
//           <p style={{lineHeight: 1.6, color: "#475569"}}>{destinasi.deskripsi || "Belum ada deskripsi untuk tempat wisata ini."}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DetailDestinasiPage() {
  const router = useRouter();
  const { id } = useParams();
  
  const [destinasi, setDestinasi] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const { data, error } = await supabase
          .from('destinasi')
          .select(`
            *,
            kategori_wisata (nama),
            destinasi_fasilitas ( fasilitas ( nama ) ),
            destinasi_transportasi ( moda_transportasi ( nama ) ),
            destinasi_aktivitas ( aktivitas ( nama ) )
          `)
          .eq('id', id)
          .single();

        if (error) {
          alert("Gagal memuat detail destinasi.");
        } else {
          setDestinasi(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div style={{minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc"}}>
        <div style={{fontSize: "2rem", animation: "spin 2s linear infinite"}}>🔄</div>
      </div>
    );
  }

  if (!destinasi) {
    return <div style={{padding: "50px", textAlign: "center"}}>Destinasi tidak ditemukan!</div>;
  }

  // Fallback Jam Operasional jika tidak ada di database
  const jamBuka = destinasi.jam_buka || "08:00:00";
  const jamTutup = destinasi.jam_tutup || "17:00:00";

  return (
    <div style={styles.pageContainer}>
      {/* Tombol Back */}
      <div style={styles.topBar}>
        <button onClick={() => router.back()} style={styles.btnBack}>
          ⬅ Kembali Eksplorasi
        </button>
      </div>

      <div style={styles.contentWrapper}>
        {/* KOLOM KIRI (Gambar & Info Singkat) */}
        <div style={styles.leftColumn}>
          {/* Gambar dengan Rating */}
          <div style={styles.imageContainer}>
            <img 
              src={destinasi.gambar_url || "https://images.unsplash.com/photo-1584814352125-9f5b61b58941?w=800&q=80"} 
              alt={destinasi.nama_tempat} 
              style={styles.mainImage} 
            />
            <div style={styles.ratingBadge}>
              <span style={{color: "#facc15"}}>★</span> {destinasi.rating || "4.6"}
            </div>
          </div>

          {/* Kartu Informasi Singkat */}
          <div style={styles.infoCard}>
            <h3 style={styles.infoCardTitle}>Informasi Singkat</h3>
            
            <div style={styles.infoRow}>
              <div style={styles.iconBox}>🕒</div>
              <div>
                <div style={styles.infoLabel}>JAM OPERASIONAL</div>
                <div style={styles.infoValue}>{jamBuka} - {jamTutup}</div>
              </div>
            </div>

            <div style={styles.infoRow}>
              <div style={styles.iconBox}>💰</div>
              <div>
                <div style={styles.infoLabel}>HARGA TIKET</div>
                <div style={{...styles.infoValue, color: "#ea580c"}}>
                  {destinasi.harga_tiket ? `Rp${Number(destinasi.harga_tiket).toLocaleString('id-ID')}` : "RpGratis"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (Detail & Rute) */}
        <div style={styles.rightColumn}>
          <div style={styles.kategoriBadge}>
            {destinasi.kategori_wisata?.nama || "Wisata Umum"}
          </div>
          
          <h1 style={styles.judulDestinasi}>{destinasi.nama_tempat}</h1>
          <p style={styles.lokasiText}>📍 {destinasi.alamat}</p>

          <div style={styles.sectionBlock}>
            <h3 style={styles.sectionTitle}>Deskripsi Tempat</h3>
            <p style={styles.deskripsiText}>
              {/* PERBAIKAN: Menggunakan deskripsi_lengkap sesuai kolom databasemu */}
              {destinasi.deskripsi_lengkap || "Belum ada deskripsi mendetail mengenai tempat wisata ini."}
            </p>
          </div>

          <div style={styles.gridList}>
            {/* Fasilitas */}
            <div>
              <h4 style={styles.listTitle}>Fasilitas Tersedia</h4>
              <ul style={styles.ulStyle}>
                {destinasi.destinasi_fasilitas?.length > 0 ? (
                  destinasi.destinasi_fasilitas.map((item: any, idx: number) => (
                    <li key={idx} style={styles.liStyle}>
                      <span style={{color: "#6b21a8", marginRight: "8px"}}>✔</span> 
                      {item.fasilitas?.nama}
                    </li>
                  ))
                ) : (
                  <li style={{color: "#94a3b8", listStyle: "none"}}>- Belum ada data fasilitas</li>
                )}
              </ul>
            </div>

            {/* Aktivitas */}
            <div>
              <h4 style={styles.listTitle}>Aktivitas Seru</h4>
              <ul style={styles.ulStyle}>
                {destinasi.destinasi_aktivitas?.length > 0 ? (
                  destinasi.destinasi_aktivitas.map((item: any, idx: number) => (
                    <li key={idx} style={styles.liStyle}>
                      <span style={{color: "#be185d", marginRight: "8px"}}>🎯</span> 
                      {item.aktivitas?.nama}
                    </li>
                  ))
                ) : (
                  <li style={{color: "#94a3b8", listStyle: "none"}}>- Belum ada data aktivitas</li>
                )}
              </ul>
            </div>
          </div>

          {/* Rute Perjalanan */}
          <div style={styles.ruteCard}>
            <h4 style={{color: "#166534", margin: "0 0 5px 0", fontSize: "1.1rem"}}>Rute Perjalanan</h4>
            <p style={{color: "#15803d", margin: "0 0 15px 0", fontSize: "0.9rem"}}>
              Buka rute perjalanan langsung melalui aplikasi Google Maps.
            </p>
            <button 
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destinasi.nama_tempat)}`, "_blank")}
              style={styles.btnMaps}
            >
              🗺️ Buka di Google Maps
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// === CSS IN JS ===
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: { minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Inter', sans-serif" },
  topBar: { padding: "20px 4%", backgroundColor: "#fff", borderBottom: "1px solid #e2e8f0" },
  btnBack: { background: "none", border: "none", color: "#334155", fontSize: "0.95rem", fontWeight: "700", cursor: "pointer" },
  
  // PERBAIKAN: Diperlebar agar tidak kotak menyempit
  contentWrapper: { 
    maxWidth: "1400px", // Diubah dari 1200px ke 1400px agar lebih lebar
    width: "100%",
    margin: "0 auto", 
    padding: "40px 4%", 
    display: "flex", 
    gap: "50px", // Jarak antar kolom diperbesar
    alignItems: "flex-start", 
    flexWrap: "wrap" 
  },
  
  // KIRI: Disesuaikan agar proporsional dengan kolom kanan yang lebih luas
  leftColumn: { flex: "1 1 380px", display: "flex", flexDirection: "column", gap: "25px" },
  imageContainer: { position: "relative", width: "100%", borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" },
  mainImage: { width: "100%", height: "350px", objectFit: "cover", display: "block" }, // Gambar sedikit ditinggikan
  ratingBadge: { position: "absolute", top: "15px", right: "15px", backgroundColor: "rgba(0,0,0,0.7)", color: "#fff", padding: "6px 12px", borderRadius: "10px", fontWeight: "bold", backdropFilter: "blur(4px)" },
  
  infoCard: { backgroundColor: "#fff", padding: "25px", borderRadius: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9" },
  infoCardTitle: { margin: "0 0 20px 0", fontSize: "1.2rem", color: "#0f172a", fontWeight: "800" },
  infoRow: { display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" },
  iconBox: { width: "45px", height: "45px", backgroundColor: "#f1f5f9", borderRadius: "12px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.2rem" },
  infoLabel: { fontSize: "0.75rem", color: "#64748b", fontWeight: "700", marginBottom: "4px" },
  infoValue: { fontSize: "1.05rem", color: "#0f172a", fontWeight: "800" },

  // KANAN: Diberi porsi ruang yang lebih lega
  rightColumn: { flex: "2 1 700px", backgroundColor: "#fff", padding: "50px", borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", border: "1px solid #f1f5f9" },
  kategoriBadge: { backgroundColor: "#f0fdf4", color: "#16a34a", padding: "6px 14px", borderRadius: "8px", fontSize: "0.8rem", fontWeight: "700", display: "inline-block", border: "1px solid #bbf7d0", marginBottom: "15px" },
  judulDestinasi: { fontSize: "2.8rem", fontFamily: "Georgia, serif", color: "#0f172a", margin: "0 0 10px 0", fontWeight: "900", lineHeight: "1.2" },
  lokasiText: { fontSize: "1.05rem", color: "#64748b", margin: "0 0 30px 0", fontWeight: "500" },
  
  sectionBlock: { marginBottom: "40px" },
  sectionTitle: { fontSize: "1.3rem", color: "#0f172a", fontWeight: "800", marginBottom: "12px" },
  deskripsiText: { fontSize: "1.05rem", color: "#475569", lineHeight: "1.8", textAlign: "justify" },

  gridList: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "40px" },
  listTitle: { fontSize: "1.1rem", color: "#0f172a", fontWeight: "800", marginBottom: "15px" },
  ulStyle: { padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" },
  liStyle: { fontSize: "1rem", color: "#475569", display: "flex", alignItems: "center" },

  ruteCard: { backgroundColor: "#f0fdf4", padding: "30px", borderRadius: "16px", border: "1px solid #bbf7d0" },
  btnMaps: { backgroundColor: "#4d7c0f", color: "#fff", border: "none", padding: "14px 28px", borderRadius: "8px", fontWeight: "700", fontSize: "1rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", transition: "background 0.2s" }
};