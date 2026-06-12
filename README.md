# LabReserve v2.0 🧪
> **Sistem Reservasi & Peminjaman Laboratorium Akademik Terintegrasi** > Tugas Akhir Mata Kuliah Pengembangan Perangkat Lunak Berbasis Komponen (PLBK) — Kelompok 11

---

## 📌 Tentang Proyek
**LabReserve v2.0** adalah platform digital berbasis web yang dirancang untuk mengotomatisasi birokrasi pemesanan ruangan laboratorium, penjadwalan sesi praktikum oleh dosen, serta manajemen sirkulasi inventaris alat riset. Sistem ini menerapkan **Arsitektur Berbasis Komponen (Component-Based Architecture)** untuk memastikan aplikasi yang skalabel, memiliki keterikatan yang longgar (*loose coupling*), dan tingkat penggunaan kembali kode (*reusability*) yang tinggi.

---

## ✨ Fitur Utama Sistem

* **Otentikasi Multi-Peran Terpadu (JWT):** Satu gerbang login cerdas yang otomatis mengarahkan dan membatasi hak akses berdasarkan tipe akun: **STUDENT (Mahasiswa)**, **LECTURER (Dosen)**, dan **LABSTAFF (Staf Lab/Admin)**.
* **Dynamic Role-Based Dashboard:** Komponen metrics grid angka statistik dan log aktivitas terbaru yang berubah secara dinamis sesuai dengan *scope* peran pengguna (Global se-kampus untuk Admin, Personal terisolasi untuk Mahasiswa/Dosen).
* **Antrean Persetujuan Dokumen (Approvals Queue):** Modul khusus Staf Lab untuk melakukan validasi berkas masuk dengan opsi setuju (*Approve*) atau tolak (*Reject*) dilengkapi modal alasan penolakan resmi.
* **Otomatisasi Email Notifikasi (Resend Integration):** Pengiriman email konfirmasi terperinci (berformat HTML & Teks Polos) yang dilemparkan secara asinkron ke kotak masuk pemohon sesaat setelah keputusan disetujui/ditolak.
* **Pengajuan Reschedule Jadwal:** Fitur dosen untuk memindahkan alokasi waktu praktikum yang aman dari eror *Unauthorized 401* melalui pengamanan *Bearer Token Headers*.
* **Manajemen Profil & Keamanan Sesi:** Fitur pembaruan biodata dan penggantian kata sandi dengan algoritma proteksi sinkronisasi data *state* React agar anti-*freeze*.

---

## 💻 Teknologi yang Digunakan

* **Framework Utama:** Next.js (App Router, React Server & Client Components)
* **Bahasa Pemrograman:** TypeScript
* **Gaya Visual & UI:** Tailwind CSS & Material Symbols (Google Icons)
* **Komponen Ikon:** Lucide React
* **Komponen Database (ORM):** Prisma ORM
* **Penyedia Basis Data:** PostgreSQL (Supabase Cloud)
* **Komponen Keamanan:** JSON Web Token (JWT) & bcrypt
* **Komponen Notifikasi Eksternal:** Resend SDK

---

## 🧱 Penerapan Prinsip PLBK di Proyek Ini

1.  **Reusable Atom UI Components:** Pemisahan elemen visual mendasar menjadi komponen independen di dalam folder `@/components/ui/` (seperti `Card`, `Input`, `Select`, `Textarea`, `Badge`, dan `Button`) yang menerima parameter dinamis lewat *Props*.
2.  **Loose Coupling (Keterikatan Longgar):** Komponen visual *frontend* sama sekali tidak terikat langsung dengan skema database. Komponen visual hanya mengonsumsi data mentah murni yang disediakan oleh komponen *API Route Endpoints*.
3.  **High Cohesion:** Setiap komponen hanya bertanggung jawab pada satu tugas spesifik. Komponen `Navbar` fokus mengurusi penyegaran profil dari token, sedangkan `Sidebar` fokus merender daftar menu dinamis berbasis peran aktif.
4.  **Fault Tolerance (Toleransi Kesalahan):** Integrasi komponen pihak ketiga (Resend SDK) dibungkus dalam blok penanganan eror (*try-catch*) terpisah. Jika server email mengalami gangguan, komponen utama database tidak akan ikut *crash*.

---

## ⚙️ Konfigurasi Variabel Lingkungan (`.env`)

Buat file bernama `.env` di direktori utama proyek Anda dan lengkapi kredensial berikut:

```env
# Koneksi Database PostgreSQL Supabase
DATABASE_URL="postgres://postgres:[PASSWORD_SUPABASE]@db.[REF_ID].supabase.co:5432/postgres?schema=public"
DIRECT_URL="postgres://postgres:[PASSWORD_SUPABASE]@db.[REF_ID].supabase.co:5432/postgres?schema=public"

# Kunci Rahasia Enkripsi JWT Token
JWT_SECRET="rahasia_kelompok_plbk_super_aman_123"

# API Key Resmi Pihak Ketiga Resend Mailer
RESEND_API_KEY="re_MasukkanKodeApiKeyResendKalian"

```

---

## 🚀 Panduan Instalasi dan Menjalankan Proyek

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di lingkungan lokal Anda:

1. **Clone Repositori:**
```bash
git clone [https://github.com/username/sistem-reservasi-lab.git](https://github.com/username/sistem-reservasi-lab.git)
cd sistem-reservasi-lab

```


2. **Instalasi Dependensi Node Modul:**
```bash
npm install

```


3. **Sinkronisasi dan Generate Skema Prisma ORM:**
```bash
npx prisma generate
npx prisma db push

```


4. **Menjalankan Server Pengembangan Lokal:**
```bash
npm run dev

```


Buka browser Anda dan akses halaman portal di alamat: `http://localhost:3000`

---