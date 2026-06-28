"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Fitur Next.js untuk pindah halaman otomatis

export default function LoginPage() {
    const router = useRouter(); // Kita panggil fungsi router (Ibarat supir untuk pindah halaman)

    // 1. Data Dummy Database User (Nanti ini diganti dengan Prisma/SQLite)
    const databaseUser = [
        { username: "bos", password: "123", role: "owner" },
        { username: "admin", password: "123", role: "staff" },
        { username: "tegar", password: "123", role: "ketua" },
        { username: "anggota", password: "123", role: "anggota" },
    ];

    // 2. State untuk menangkap ketikan dan menampilkan error
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [pesanError, setPesanError] = useState("");

    // 3. Logika Utama Saat Tombol Login Ditekan
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault(); // Mencegah halaman refresh (loading putih) saat tombol diklik
        setPesanError(""); // Reset error setiap kali mencoba login

        // Proses Pencarian: Cari user yang username dan password-nya pas
        const userDitemukan = databaseUser.find(
            (user) => user.username === username && user.password === password
        );

        if (userDitemukan) {
            // Jika cocok, cek perannya (role) lalu arahkan ke folder yang tepat!
            if (userDitemukan.role === "owner") {
                router.push("/owner");
            } else if (userDitemukan.role === "staff") {
                router.push("/staff");
            } else if (userDitemukan.role === "ketua") {
                router.push("/ketua");
            } else if (userDitemukan.role === "anggota") {
                router.push("/anggota");
            }
        } else {
            // Jika tidak cocok, munculkan peringatan
            setPesanError("Username atau Password salah! Silakan coba lagi.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginCard}>

                {/* Bagian Header Form */}
                <div style={styles.header}>
                    <div style={styles.iconWrapper}>✈️</div>
                    <h2 style={styles.title}>Masuk Akun</h2>
                    <p style={styles.subtitle}>Sistem Pemilihan Wisata Kolaboratif</p>
                </div>

                {/* Munculkan kotak merah kalau error */}
                {pesanError && (
                    <div style={styles.errorBox}>
                        ⚠️ {pesanError}
                    </div>
                )}

                {/* Form Input */}
                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            placeholder="Masukkan username..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            placeholder="Masukkan password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" style={styles.button}>
                        Masuk Sekarang
                    </button>
                </form>

                <p style={styles.footerText}>
                    Tubes Web 2026 • Kelompok JogjaTrip
                </p>
            </div>
        </div>
    );
}

// === STYLING CSS ===
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F7F9FA",
        backgroundImage: "linear-gradient(135deg, #0194f3 0%, #073E68 100%)", // Latar belakang biru elegan
        padding: "20px",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
    },
    loginCard: {
        backgroundColor: "#ffffff",
        padding: "40px 30px",
        borderRadius: "20px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
        width: "100%",
        maxWidth: "400px",
    },
    header: { textAlign: "center", marginBottom: "30px" },
    iconWrapper: { fontSize: "3rem", marginBottom: "10px" },
    title: { margin: "0 0 5px 0", fontSize: "1.8rem", color: "#073E68", fontWeight: "800" },
    subtitle: { margin: 0, color: "#687176", fontSize: "0.9rem" },

    errorBox: {
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
        padding: "12px",
        borderRadius: "8px",
        fontSize: "0.85rem",
        marginBottom: "20px",
        textAlign: "center",
        border: "1px solid #f87171",
    },

    form: { display: "flex", flexDirection: "column", gap: "20px" },
    inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
    label: { fontSize: "0.9rem", color: "#073E68", fontWeight: "bold" },
    input: {
        padding: "12px 15px",
        borderRadius: "10px",
        border: "1px solid #cbd5e1",
        fontSize: "1rem",
        outline: "none",
        transition: "border-color 0.2s",
    },
    button: {
        backgroundColor: "#FF5E1F",
        color: "#ffffff",
        padding: "15px",
        border: "none",
        borderRadius: "10px",
        fontSize: "1rem",
        fontWeight: "bold",
        cursor: "pointer",
        marginTop: "10px",
        transition: "background-color 0.2s",
        boxShadow: "0 4px 6px rgba(255, 94, 31, 0.2)",
    },
    footerText: {
        textAlign: "center",
        marginTop: "25px",
        color: "#94a3b8",
        fontSize: "0.8rem",
    },
};