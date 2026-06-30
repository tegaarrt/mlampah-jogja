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
        // PERBAIKAN: Memanggil semua tabel relasi (join)
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

  if (loading) return <div style={{padding: "50px", textAlign: "center"}}>Memuat detail wisata...</div>;
  if (!destinasi) return <div style={{padding: "50px", textAlign: "center"}}>Destinasi tidak ditemukan!</div>;

  return (
    <div style={{minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "sans-serif", paddingBottom: "50px"}}>
      {/* Tombol Back */}
      <div style={{padding: "20px 4%"}}>
        <button 
          onClick={() => router.back()} 
          style={{padding: "10px 20px", cursor: "pointer", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#fff", fontWeight: "bold", color: "#334155"}}
        >
          ⬅ Kembali ke Etalase
        </button>
      </div>

      {/* Konten Detail */}
      <div style={{maxWidth: "1100px", margin: "0 auto", padding: "0 4%", display: "flex", gap: "40px", flexWrap: "wrap"}}>
        {/* Kolom Kiri: Gambar */}
        <div style={{flex: "1 1 400px"}}>
          <img 
            src={destinasi.gambar_url || "https://images.unsplash.com/photo-1584814352125-9f5b61b58941?w=800&q=80"} 
            alt={destinasi.nama_tempat} 
            style={{width: "100%", borderRadius: "16px", objectFit: "cover", maxHeight: "500px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)"}} 
          />
        </div>
        
        {/* Kolom Kanan: Informasi */}
        <div style={{flex: "1.5 1 400px"}}>
          <div style={{backgroundColor: "#84cc16", display: "inline-block", padding: "6px 12px", borderRadius: "8px", color: "#fff", fontWeight: "bold", fontSize: "0.8rem", marginBottom: "15px"}}>
            {destinasi.kategori_wisata?.nama || "Umum"}
          </div>
          <h1 style={{fontSize: "2.8rem", margin: "0 0 10px 0", color: "#0f172a", fontWeight: "900"}}>{destinasi.nama_tempat}</h1>
          <p style={{fontSize: "1.1rem", color: "#64748b", margin: "0 0 20px 0", fontWeight: "500"}}>📍 {destinasi.alamat}</p>
          
          {/* Kotak Harga */}
          <div style={{backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "30px", display: "inline-block", minWidth: "250px"}}>
            <h3 style={{margin: "0 0 5px 0", color: "#64748b", fontSize: "0.9rem", textTransform: "uppercase"}}>Informasi Harga</h3>
            <p style={{fontSize: "1.8rem", color: "#ea580c", fontWeight: "900", margin: 0}}>
              Rp{destinasi.harga_tiket ? Number(destinasi.harga_tiket).toLocaleString('id-ID') : "Gratis"}
            </p>
          </div>

          <h3 style={{color: "#0f172a", marginBottom: "10px", fontSize: "1.3rem"}}>Deskripsi</h3>
          <p style={{lineHeight: 1.7, color: "#475569", marginBottom: "30px", fontSize: "1.05rem"}}>
            {destinasi.deskripsi || "Belum ada deskripsi untuk tempat wisata ini."}
          </p>

          {/* GRID UNTUK FITUR TAMBAHAN (Fasilitas, Aktivitas, Transportasi) */}
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px"}}>
            
            {/* Bagian Fasilitas */}
            {destinasi.destinasi_fasilitas && destinasi.destinasi_fasilitas.length > 0 && (
              <div style={{backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0"}}>
                <h4 style={{margin: "0 0 15px 0", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px"}}>🛋️ Fasilitas</h4>
                <ul style={{margin: 0, paddingLeft: "20px", color: "#475569", lineHeight: "1.8"}}>
                  {destinasi.destinasi_fasilitas.map((item: any, index: number) => (
                    <li key={index}>{item.fasilitas?.nama}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bagian Aktivitas */}
            {destinasi.destinasi_aktivitas && destinasi.destinasi_aktivitas.length > 0 && (
              <div style={{backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0"}}>
                <h4 style={{margin: "0 0 15px 0", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px"}}>📸 Aktivitas</h4>
                <ul style={{margin: 0, paddingLeft: "20px", color: "#475569", lineHeight: "1.8"}}>
                  {destinasi.destinasi_aktivitas.map((item: any, index: number) => (
                    <li key={index}>{item.aktivitas?.nama}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bagian Transportasi */}
            {destinasi.destinasi_transportasi && destinasi.destinasi_transportasi.length > 0 && (
              <div style={{backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0"}}>
                <h4 style={{margin: "0 0 15px 0", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px"}}>🚌 Akses Kendaraan</h4>
                <ul style={{margin: 0, paddingLeft: "20px", color: "#475569", lineHeight: "1.8"}}>
                  {destinasi.destinasi_transportasi.map((item: any, index: number) => (
                    <li key={index}>{item.moda_transportasi?.nama}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}