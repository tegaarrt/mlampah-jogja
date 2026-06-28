// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";

// export default function DetailDestinasiPage() {
//   const router = useRouter();
//   const params = useParams();
//   const id = params.id; 

//   const [destinasi, setDestinasi] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDetailLengkap = async () => {
//       if (!id) return;
      
//       // QUERY SUPER JOIN SUPABASE
//       // Mengambil data destinasi beserta seluruh relasinya dalam 1 tarikan nafas
//       const { data, error } = await supabase
//         .from('destinasi')
//         .select(`
//           *,
//           kategori_wisata ( nama ),
//           destinasi_fasilitas ( fasilitas ( nama ) ),
//           destinasi_aktivitas ( aktivitas ( nama ) ),
//           destinasi_transportasi ( moda_transportasi ( nama ) )
//         `)
//         .eq('id', id)
//         .single(); 

//       if (error) {
//         console.error("Error fetching detail:", error);
//       } else {
//         // Membersihkan format array dari Supabase agar lebih mudah dipakai di UI
//         const cleanData = {
//           ...data,
//           nama_kategori: data.kategori_wisata?.nama || "Umum",
//           list_fasilitas: data.destinasi_fasilitas?.map((df: any) => df.fasilitas?.nama).filter(Boolean) || [],
//           list_aktivitas: data.destinasi_aktivitas?.map((da: any) => da.aktivitas?.nama).filter(Boolean) || [],
//           list_transportasi: data.destinasi_transportasi?.map((dt: any) => dt.moda_transportasi?.nama).filter(Boolean) || []
//         };
        
//         setDestinasi(cleanData);
//       }
//       setLoading(false);
//     };

//     fetchDetailLengkap();
//   }, [id]);

//   if (loading) return <div style={styles.centerMsg}>🔄 Memuat Detail Lengkap...</div>;
//   if (!destinasi) return <div style={styles.centerMsg}>🏜️ Destinasi Tidak Ditemukan</div>;

//   return (
//     <div style={styles.pageContainer}>
//       {/* Tombol Back */}
//       <button onClick={() => router.push('/eksplorasi')} style={styles.btnBack}>⬅ Kembali Eksplorasi</button>

//       <div style={styles.contentGrid}>
        
//         {/* KOLOM KIRI (GAMBAR & INFO SINGKAT) */}
//         <div style={styles.leftColumn}>
//           <div style={styles.imageCard}>
//             <img src={destinasi.gambar_url || "https://images.unsplash.com/photo-1584814352125-9f5b61b58941?w=800&q=80"} alt={destinasi.nama_tempat} style={styles.mainImage} />
//             <div style={styles.ratingBadge}>★ {destinasi.rating || "N/A"}</div>
//           </div>

//           <div style={styles.quickInfoCard}>
//             <h3 style={styles.quickInfoTitle}>Informasi Singkat</h3>
            
//             <div style={styles.infoItem}>
//               <div style={styles.infoIcon}>🕒</div>
//               <div>
//                 <div style={styles.infoLabel}>Jam Operasional</div>
//                 <div style={styles.infoValue}>{destinasi.jam_buka} - {destinasi.jam_tutup}</div>
//               </div>
//             </div>
//             <div style={styles.infoDivider}></div>
//             <div style={styles.infoItem}>
//               <div style={styles.infoIcon}>💰</div>
//               <div>
//                 <div style={styles.infoLabel}>Harga Tiket</div>
//                 <div style={{...styles.infoValue, color: "#ea580c", fontSize: "1.2rem", fontWeight: "900"}}>
//                   Rp{destinasi.harga_tiket ? Number(destinasi.harga_tiket).toLocaleString('id-ID') : "Gratis"}
//                 </div>
//               </div>
//             </div>
            
//             {/* TRANSPORTASI */}
//             {destinasi.list_transportasi.length > 0 && (
//               <>
//                 <div style={styles.infoDivider}></div>
//                 <div style={styles.infoItem}>
//                   <div style={styles.infoIcon}>🚌</div>
//                   <div>
//                     <div style={styles.infoLabel}>Akses Transportasi</div>
//                     <div style={styles.infoValue}>{destinasi.list_transportasi.join(", ")}</div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {/* KOLOM KANAN (DETAIL LENGKAP & MAPS) */}
//         <div style={styles.rightColumn}>
//           <div style={styles.detailCard}>
            
//             {/* Kategori dari tabel kategori_wisata */}
//             <div style={styles.badgeCategory}>{destinasi.nama_kategori}</div>
            
//             <h1 style={styles.title}>{destinasi.nama_tempat}</h1>
            
//             <div style={styles.addressBox}>
//               <span style={{fontSize: "1.2rem"}}>📍</span>
//               <span style={styles.addressText}>{destinasi.alamat}</span>
//             </div>

//             <div style={{marginTop: "30px"}}>
//               <h3 style={styles.sectionTitle}>Deskripsi Tempat</h3>
//               <p style={styles.descriptionText}>{destinasi.deskripsi_lengkap}</p>
//             </div>

//             {/* FASILITAS & AKTIVITAS DARI TABEL RELASI */}
//             <div style={styles.amenitiesGrid}>
              
//               {destinasi.list_fasilitas.length > 0 && (
//                 <div>
//                   <h3 style={styles.sectionTitle}>Fasilitas Tersedia</h3>
//                   <ul style={styles.listStyle}>
//                     {destinasi.list_fasilitas.map((fasilitas: string, idx: number) => (
//                       <li key={idx} style={styles.listItem}>✔️ {fasilitas}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {destinasi.list_aktivitas.length > 0 && (
//                 <div>
//                   <h3 style={styles.sectionTitle}>Aktivitas Seru</h3>
//                   <ul style={styles.listStyle}>
//                     {destinasi.list_aktivitas.map((aktivitas: string, idx: number) => (
//                       <li key={idx} style={styles.listItem}>🎯 {aktivitas}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//             </div>

//             <div style={styles.mapsBox}>
//               <h3 style={{...styles.sectionTitle, color: "#166534", marginBottom: "10px"}}>Rute Perjalanan</h3>
//               <p style={{color: "#166534", fontSize: "0.95rem", marginBottom: "15px"}}>Buka rute perjalanan langsung melalui aplikasi Google Maps.</p>
//               <a href={destinasi.link_gmaps} target="_blank" rel="noopener noreferrer" style={styles.btnMaps}>
//                 🗺️ Buka di Google Maps
//               </a>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // === CSS IN JS ===
// const styles: { [key: string]: React.CSSProperties } = {
//   pageContainer: { minHeight: "100vh", backgroundColor: "#f8fafc", padding: "40px 6%", fontFamily: "system-ui, sans-serif" },
//   centerMsg: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.5rem", fontWeight: "bold", color: "#4d7c0f" },
//   btnBack: { background: "none", border: "none", color: "#64748b", fontSize: "1rem", fontWeight: "700", cursor: "pointer", marginBottom: "20px" },
  
//   contentGrid: { display: "flex", gap: "30px", flexWrap: "wrap", alignItems: "flex-start" },
//   leftColumn: { flex: "1 1 350px", display: "flex", flexDirection: "column", gap: "20px" },
//   imageCard: { width: "100%", borderRadius: "20px", overflow: "hidden", position: "relative", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", border: "4px solid #fff" },
//   mainImage: { width: "100%", height: "350px", objectFit: "cover", display: "block" },
//   ratingBadge: { position: "absolute", top: "20px", right: "20px", backgroundColor: "rgba(0,0,0,0.7)", color: "#fbbf24", padding: "8px 16px", borderRadius: "12px", fontWeight: "900", backdropFilter: "blur(4px)" },
  
//   quickInfoCard: { backgroundColor: "#fff", borderRadius: "20px", padding: "25px", border: "1px solid #e2e8f0" },
//   quickInfoTitle: { margin: "0 0 20px 0", fontSize: "1.1rem", color: "#0f172a", fontWeight: "800" },
//   infoItem: { display: "flex", alignItems: "center", gap: "15px" },
//   infoIcon: { width: "45px", height: "45px", borderRadius: "12px", backgroundColor: "#f8fafc", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.2rem", border: "1px solid #e2e8f0" },
//   infoLabel: { fontSize: "0.8rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase" },
//   infoValue: { fontSize: "1.05rem", color: "#0f172a", fontWeight: "700", marginTop: "2px" },
//   infoDivider: { width: "100%", height: "1px", backgroundColor: "#f1f5f9", margin: "15px 0" },

//   rightColumn: { flex: "1.5 1 500px" },
//   detailCard: { backgroundColor: "#fff", borderRadius: "24px", padding: "40px", border: "1px solid #e2e8f0" },
//   badgeCategory: { display: "inline-block", backgroundColor: "#f0fdf4", color: "#16a34a", padding: "6px 14px", borderRadius: "8px", fontSize: "0.8rem", fontWeight: "800", border: "1px solid #bbf7d0", marginBottom: "15px" },
//   title: { margin: "0 0 15px 0", fontSize: "2.2rem", color: "#0f172a", fontWeight: "900", fontFamily: "Georgia, serif" },
//   addressBox: { display: "flex", gap: "10px", backgroundColor: "#f8fafc", padding: "15px 20px", borderRadius: "12px", border: "1px dashed #cbd5e1" },
//   addressText: { fontSize: "0.95rem", color: "#475569", fontWeight: "500" },
  
//   sectionTitle: { fontSize: "1.1rem", color: "#0f172a", fontWeight: "800", margin: "0 0 15px 0" },
//   descriptionText: { fontSize: "1rem", color: "#475569", lineHeight: 1.8, whiteSpace: "pre-line" },
  
//   amenitiesGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "30px", padding: "20px 0", borderTop: "1px solid #e2e8f0" },
//   listStyle: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" },
//   listItem: { fontSize: "0.95rem", color: "#475569", fontWeight: "500" },

//   mapsBox: { marginTop: "30px", padding: "25px", backgroundColor: "#f0fdf4", borderRadius: "16px", border: "1px solid #bbf7d0" },
//   btnMaps: { display: "inline-block", backgroundColor: "#4d7c0f", color: "#fff", padding: "12px 24px", borderRadius: "8px", fontWeight: "700", textDecoration: "none" }
// };

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
            kategori_wisata (nama)
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

  if (loading) return <div style={{padding: "50px", textAlign: "center"}}>Memuat detail wisata...</div>;
  if (!destinasi) return <div style={{padding: "50px", textAlign: "center"}}>Destinasi tidak ditemukan!</div>;

  return (
    <div style={{minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "sans-serif"}}>
      {/* Tombol Back */}
      <div style={{padding: "20px 4%"}}>
        <button 
          onClick={() => router.back()} 
          style={{padding: "10px 20px", cursor: "pointer", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#fff"}}
        >
          ⬅ Kembali ke Etalase
        </button>
      </div>

      {/* Konten Detail */}
      <div style={{maxWidth: "1000px", margin: "0 auto", padding: "0 4%", display: "flex", gap: "40px", flexWrap: "wrap"}}>
        <img 
          src={destinasi.gambar_url || "https://images.unsplash.com/photo-1584814352125-9f5b61b58941?w=800&q=80"} 
          alt={destinasi.nama_tempat} 
          style={{flex: 1, minWidth: "300px", borderRadius: "16px", objectFit: "cover", maxHeight: "500px"}} 
        />
        
        <div style={{flex: 1, minWidth: "300px"}}>
          <div style={{backgroundColor: "#84cc16", display: "inline-block", padding: "6px 12px", borderRadius: "8px", color: "#fff", fontWeight: "bold", fontSize: "0.8rem", marginBottom: "15px"}}>
            {destinasi.kategori_wisata?.nama || "Umum"}
          </div>
          <h1 style={{fontSize: "2.5rem", margin: "0 0 10px 0", color: "#0f172a"}}>{destinasi.nama_tempat}</h1>
          <p style={{fontSize: "1.1rem", color: "#64748b", margin: "0 0 20px 0"}}>📍 {destinasi.alamat}</p>
          
          <div style={{backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "25px"}}>
            <h3 style={{margin: "0 0 10px 0", color: "#0f172a"}}>Informasi Harga</h3>
            <p style={{fontSize: "1.5rem", color: "#ea580c", fontWeight: "900", margin: 0}}>
              Rp{destinasi.harga_tiket ? Number(destinasi.harga_tiket).toLocaleString('id-ID') : "Gratis"}
            </p>
          </div>

          <h3 style={{color: "#0f172a", marginBottom: "10px"}}>Deskripsi</h3>
          <p style={{lineHeight: 1.6, color: "#475569"}}>{destinasi.deskripsi || "Belum ada deskripsi untuk tempat wisata ini."}</p>
        </div>
      </div>
    </div>
  );
}