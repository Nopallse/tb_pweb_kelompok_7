# Web Permintaan Surat Keterangan Aktif Kuliah

## Panduan Penggunaan

1. **Clone repo ini**

   ```bash
   git clone https://github.com/Nopallse/tb_pweb_kelompok_7
   ```

2. **Install semua depedensi yang diperlukan**

   ```bash
   npm install
   ```

3. **Lakukan migrasi tabel dari Express ke MySQL**

   ```bash
   npx sequelize-cli db:migrate

   ```

4. **Jalankan seeder untuk mengirim data contoh ke dbL**

   ```bash
   npx sequelize-cli db:seed:all
   ```

5. **Jalankan Express dengan perintah**

   ```bash
   npx tailwindcss -i ./src/input.css -o ./assets/output.css --watch
   nodemon

   ```

6. **Untuk push perubahan silahkan buatlah branch baru terlebih dahulu**

   ```bash
   git checkout (nama_branch)
   git add .
   git commit -m "lihat profil"
   git push -u origin (nama_branch)
   ```

## Pembagian Tugas

1. Authentikasi - Naufal ✅
2. Logout - Naufal ✅
3. Lihat Profil untuk mahasiswa dan admin Alfa Rian✅
4. Fungsionalitas Ubah Kata Sandi Fajrin Putra Pratama✅

