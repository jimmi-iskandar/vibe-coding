# Rencana Implementasi: Project Backend dengan Bun, ElysiaJS, Drizzle, dan MySQL

Dokumen ini berisi panduan tingkat tinggi untuk menginisialisasi dan membuat struktur dasar backend API. Rencana ini ditujukan untuk diimplementasikan oleh programmer atau model AI lainnya.

---

## 1. Persiapan Folder & Inisialisasi Project
- Buat folder baru di dalam repositori ini (misal: `api-backend`).
- Masuk ke folder tersebut dan inisialisasi project menggunakan **Bun**:
  ```bash
  bun init
  ```
- Bersihkan file boilerplate yang tidak diperlukan untuk memulai dari struktur yang bersih.

## 2. Instalasi Dependency
Pasang pustaka-pustaka utama yang dibutuhkan:
- **Web Framework**: `elysia` (ElysiaJS)
- **ORM & Driver**: `drizzle-orm` dan `mysql2` (untuk koneksi ke MySQL)
- **Development Tools**: `drizzle-kit` (untuk migrasi skema database)

## 3. Konfigurasi Database & ORM (Drizzle)
- Buat file konfigurasi `.env` untuk menyimpan detail koneksi database MySQL (Host, Port, User, Password, Database Name).
- Buat modul koneksi database:
  - Inisialisasi client `mysql2` menggunakan connection pool.
  - Hubungkan client tersebut ke `drizzle-orm`.
- Definisikan file skema database (`schema.ts`):
  - Buat satu tabel contoh (misalnya `users` atau `items`) lengkap dengan kolom ID, nama, email, dan timestamp menggunakan tipe data MySQL yang sesuai di Drizzle.
- Buat file konfigurasi `drizzle.config.ts` untuk memetakan folder skema dan folder migrasi.

## 4. Pembuatan Migrasi & Sinkronisasi Database
- Buat script untuk generate migrasi berdasarkan skema Drizzle:
  ```bash
  bunx drizzle-kit generate
  ```
- Jalankan migrasi ke database MySQL target untuk membuat tabel yang didefinisikan:
  ```bash
  bunx drizzle-kit migrate
  ```

## 5. Implementasi Server (ElysiaJS)
- Buat server instance Elysia di file utama (misal: `src/index.ts`).
- Buat endpoint API sederhana (CRUD) untuk tabel contoh yang sudah didefinisikan:
  - **GET** `/items` - Mengambil semua data dari database menggunakan Drizzle select.
  - **POST** `/items` - Menyimpan data baru menggunakan Drizzle insert.
  - **GET** `/items/:id` - Mengambil data berdasarkan ID.
  - **PUT/PATCH** `/items/:id` - Memperbarui data.
  - **DELETE** `/items/:id` - Menghapus data.
- Pastikan server berjalan di port yang dapat dikonfigurasi melalui `.env` (default: `3000`).

## 6. Pengujian & Menjalankan Aplikasi
- Jalankan server dalam mode development:
  ```bash
  bun --watch src/index.ts
  ```
- Lakukan verifikasi endpoint menggunakan HTTP client (curl/Postman) untuk memastikan integrasi ElysiaJS, Drizzle, dan database MySQL berfungsi dengan baik.
