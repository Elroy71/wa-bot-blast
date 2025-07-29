# 📊 Dashboard Manajemen WhatsApp Blast

Aplikasi ini adalah dashboard antarmuka (frontend) berbasis **React.js** untuk menyimulasikan pengelolaan kampanye pesan massal (blast) WhatsApp. Pengguna dapat mengelola nomor pengirim, daftar kontak, grup kontak, dan meluncurkan kampanye blast dengan mudah melalui antarmuka web yang intuitif dan responsif.

> ⚠️ Proyek ini sepenuhnya berjalan di sisi klien (client-side only) dengan menggunakan **mock data**, sehingga **tidak memerlukan backend/server** untuk menjalankannya.

---

## ✨ Fitur Utama

### 📌 Dashboard (Beranda)
- Menampilkan ringkasan aktivitas dan data penting.
- *Saat ini masih berfungsi sebagai placeholder.*

### 📲 Manajemen Sender
- Mengelola daftar nomor WhatsApp sebagai pengirim pesan.
- Terhubung ke "AI Agent" untuk balasan otomatis (simulasi).

### 📇 Manajemen Kontak
- Menambahkan dan mengelola daftar kontak individual.
- Menyimpan informasi nama dan nomor telepon.

### 👥 Manajemen Grup Kontak
- Membuat grup kontak baru.
- Menambahkan atau menghapus anggota dari daftar kontak.
- Mengedit nama grup dan anggotanya.
- Menghapus grup kontak yang tidak diperlukan.

### 📣 Kampanye Blast (Pesan Massal)
- **Membuat Kampanye**: Nama kampanye, isi pesan, pilih grup target, dan pilih sender.
- **Lampiran File**: Unggah file (format apa pun, maksimal 30MB).
- **Riwayat Blast**: Tabel riwayat kampanye, status, jumlah terkirim/gagal, dan tanggal.
- **Detail Laporan**: Status pengiriman per kontak (Terkirim, Dibaca, Gagal).
- **Hapus Riwayat**: Menghapus riwayat kampanye lama.

---

## 🚀 Tumpukan Teknologi (Tech Stack)

- ⚛️ **React.js** (v18+)
- 🎨 **Tailwind CSS**
- 🧩 **Lucide React** (Ikon)
- 📦 **npm / yarn**

---

## 📋 Prasyarat (Prerequisites)

Sebelum menjalankan proyek, pastikan Anda telah menginstal:

- [Node.js](https://nodejs.org) (Disarankan: v16.x atau lebih baru)
- npm (biasanya sudah termasuk dalam Node.js)

---

## ⚙️ Instalasi & Menjalankan Proyek

1. **Clone Repositori**

```bash
git clone https://github.com/Elroy71/wa-bot-blast.git
```

2. **Masuk ke Direktori Proyek**
```bash
cd wa-bot-blast
```

3. **Instal Dependensi**
```bash
npm install
```

4. **Jalankan Aplikasi**
```bash
npm run dev
```

5. **Akses di Browser**
```bash
Buka browser dan akses:
http://localhost:3000
```
