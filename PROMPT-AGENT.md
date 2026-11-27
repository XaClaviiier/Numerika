# Brief implementasi untuk Codex

```text
Kembangkan Numerika untuk mahasiswa yang belajar matematika melalui contoh visual dan banyak latihan Excel. Pertahankan aplikasi offline, Poppins, pintasan keyboard, ekspor XLSX, serta jawaban yang sudah tersimpan. Gunakan slide, lembar kerja, dan dokumen latihan di folder induk. Tulis perubahan aplikasi di Numerika.

Bangun lembar latihan yang bisa dibuka offline. Mahasiswa memilih metode, membaca soal, mengetik rumus Excel di sel, mengisi ke bawah, melihat grafik dan memeriksa jawabannya. Sediakan mode terbimbing dengan penjelasan dan petunjuk per sel, serta mode mandiri untuk mengulang soal tanpa petunjuk. Simpan pekerjaan tiap latihan. Gunakan komponen bergaya shadcn untuk navigasi, tombol, tab, dan dialog. Utamakan keterbacaan angka dan penggunaan keyboard.

Sidebar memiliki dua grup utama: UTS (Week 1–7) dan UAS (Week 8–14). Urutkan topik menurut minggu. Untuk UTS, cakup galat, angka signifikan, pembulatan, Maclaurin, kriteria berhenti, biseksi, regula falsi, secant, titik tetap, Newton–Raphson, Jacobi, dan Gauss–Seidel. Tunjukkan sumber kelas atau beri label pengayaan jika minggu terkait tidak memiliki handout. Untuk UAS, pertahankan sistem nonlinier, interpolasi, turunan, dan integrasi.

Saat mahasiswa membuka topik, mulai dengan satu gagasan dalam bahasa sehari-hari. Tampilkan data secara visual, lalu contoh langkah demi langkah yang menghubungkan alamat sel, angka yang disubstitusikan, dan hasilnya. Izinkan mahasiswa maju, mundur, atau langsung berlatih. Sediakan tiga set per topik. Simpan jawaban per set dan per mode, serta berikan umpan balik di sel yang perlu diperbaiki. Contoh terselesaikan memakai data terpisah dari pekerjaan mahasiswa.

Uji ketepatan kunci secara independen dari pembulatan pada dokumen. Contoh pemeriksaan: nilai sejati 12.5 dan taksiran 12.3 memberi galat mutlak 0.2 dan galat relatif mutlak 1.6%. Uji alur konsep, contoh, latihan, ganti set, kembali ke jawaban lama, pencarian UTS/UAS, dan workbook kedua periode.

Ekspor lembar aktif sebagai XLSX dengan rumus yang tetap dapat diedit. Verifikasi perubahan sel menghitung ulang dependensi, referensi absolut tetap saat rumus disalin, kesalahan formula bisa diperbaiki, dan tiga titik (1,2), (2,5), (4,11) menghasilkan f(3)=8 dan f'(3)=3. Uji file ekspor serta laporkan batas verifikasi.
```

Targetnya Codex. Brief ini menghubungkan persiapan UAS dengan tindakan yang bisa diuji di spreadsheet.
