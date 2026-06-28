import scipy.stats as stats
import numpy as np

# 1. Masukkan 10 data replikasi Current State
current_data = [214, 200, 200, 203, 226, 212, 237, 194, 221, 213]
target_jurnal = 218

# 2. Jalankan One-Sample T-Test
t_stat, p_value = stats.ttest_1samp(current_data, target_jurnal)

# 3. Cetak Hasil
print("=== HASIL UJI VALIDASI CURRENT STATE ===")
print(f"Rata-rata Simulasi : {np.mean(current_data)}")
print(f"Nilai T-Hitung     : {t_stat:.4f}")
print(f"P-Value            : {p_value:.4f}")
print("----------------------------------------")

# 4. Logika Kesimpulan
if p_value > 0.05:
    print("Kesimpulan: H0 DITERIMA.")
    print("Secara statistik tidak ada perbedaan signifikan antara model Arena dan Jurnal.")
    print("Status: MODEL VALID")
else:
    print("Kesimpulan: H0 DITOLAK.")
    print("Terdapat perbedaan signifikan antara model Arena dan Jurnal.")
    print("Status: MODEL TIDAK VALID")