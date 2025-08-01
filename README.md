# Link Tugas JIDA berdasarkan branch dan repositori

1. Tugas Pertemuan Pertama = [https://github.com/SalmanAlmajali/gitback/tree/tugas-jida-1.git](https://github.com/SalmanAlmajali/gitback/tree/tugas-jida-1)].
2. Tugas Pertemuan Kedua = [https://github.com/SalmanAlmajali/gitback/tree/tugas-jida-2](https://github.com/SalmanAlmajali/gitback/tree/tugas-jida-2).
3. Tugas Pertemuan Keempat = [https://github.com/SalmanAlmajali/gitback/tree/tugas-jida-3](https://github.com/SalmanAlmajali/gitback/tree/tugas-jida-3).
4. Tugas Pertemuan Kelima = [https://github.com/SalmanAlmajali/gitback/tree/jida-tugas-4](https://github.com/SalmanAlmajali/gitback/tree/jida-tugas-4).
5. Tugas Pertemuan Keenam = [https://github.com/SalmanAlmajali/my-next-redux-app.git](https://github.com/SalmanAlmajali/my-next-redux-app.git).
6. Tugas Pertemuan Kedelapan = [https://github.com/SalmanAlmajali/gitback/tree/tugas-jida-6](https://github.com/SalmanAlmajali/gitback/tree/tugas-jida-6)



# Gitback – Alur Penggunaan Aplikasi

Gitback adalah aplikasi untuk mengelola *feedback* dari pengguna terhadap repository GitHub. Feedback dapat diubah menjadi GitHub Issue, serta diperkaya menggunakan AI agar lebih mudah dipahami developer.

---

## 1. Autentikasi

### a. Registrasi dengan Credential
1. Pengguna mengisi form: `name`, `email`, `password`, `confirmPassword`.
2. Validasi:
   - Password dan confirmPassword harus sama.
   - Email valid.
3. Server:
   - Validasi data (schema).
   - Cek apakah email sudah terdaftar.
   - Hash password dan simpan user baru ke database (Prisma).
4. Setelah sukses, client otomatis melakukan **sign-in** menggunakan credential.
5. User diarahkan ke dashboard.

### b. Login / Registrasi via GitHub (OAuth)
1. Pengguna klik tombol **Sign in with GitHub**.
2. Dialihkan ke flow OAuth GitHub melalui NextAuth.
3. Jika akun belum ada, sistem membuat user baru dari profil GitHub.
4. User kembali ke aplikasi dengan status login aktif.

### c. Sesi & Proteksi
- Middleware memeriksa session untuk semua halaman dashboard.
- User hanya bisa mengakses repository dan feedback miliknya.

---

## 2. Manajemen Repository

### a. Import Otomatis dari GitHub
- Jika user login via GitHub **atau** sudah menghubungkan akun credential dengan GitHub:
  1. Aplikasi menggunakan access token GitHub user.
  2. Menarik daftar repository milik user langsung dari GitHub API.
  3. User cukup memilih repository yang ingin dipantau (tanpa isi form manual).
- Repository terpilih disimpan ke tabel `UserSelectedRepository`.

### b. CRUD Repository
- **Create**  
  - User memilih repository dari daftar GitHub (jika ada OAuth) atau input manual (opsional).
- **Read**  
  - Dashboard menampilkan semua repository yang dipilih user.
- **Update**  
  - Metadata repository bisa disinkronisasi ulang dari GitHub jika diperlukan (nama, description, star, fork, dsb.).
- **Delete**  
  - Repository bisa dihapus, cascade akan menghapus feedback & feedback image terkait.
  - File gambar ikut dihapus dari storage eksternal (misal Cloudinary).

---

## 3. Feedback

### a. Create
1. User membuka form feedback di salah satu repository.
2. Mengisi:
   - `userName`, `userEmail`
   - `title`, `content`
   - `type` (BUG / FEATURE_REQUEST / OTHER)
   - `status` (default: PENDING)
3. User dapat mengunggah gambar (dibatasi max 5MB per file, max 5 file, total max 25MB).
4. Gambar divalidasi dan diupload ke Cloudinary. URL tersimpan di tabel `FeedbackImage`.

### b. Read
- Feedback ditampilkan di list atau detail.
- Bisa dicari berdasarkan nama, email, judul, repository, type, dan status.
- Statistik feedback dapat divisualisasikan (misal grafik jumlah feedback per bulan).

### c. Update
- User dapat mengedit feedback: judul, konten, type, status, repository.
- User dapat menghapus atau menambah gambar baru.
- Perubahan langsung tersimpan di database.

### d. Delete
- User dapat menghapus feedback tertentu.
- **Cascade:** semua gambar feedback dihapus dari database dan Cloudinary.

---

## 4. AI Enrichment (Coming Soon)
1. Feedback dapat diproses oleh AI (misal GPT-4o-mini).
2. AI menghasilkan:
   - `aiTitle`
   - `aiSummary`
   - `stepsToReproduce`
   - `expectedBehavior`
3. Hasil disimpan di tabel `FeedbackAIResult` dan ditampilkan di detail feedback.

---

## 5. Integrasi GitHub Issue
1. Dari detail feedback, user klik **Submit to GitHub Issue**.
2. Sistem:
   - Menyusun judul dan konten issue (termasuk hasil AI & link gambar).
   - Mengirim request `fetch` ke GitHub REST API dengan token OAuth user.
3. Issue dibuat di repository GitHub.
4. Metadata issue (nomor, URL, status) disimpan ke database.
5. Status feedback otomatis diubah ke `SUBMITTED`.

---

## 6. Keamanan
- Semua operasi CRUD memerlukan autentikasi.
- User hanya dapat mengelola resource miliknya.
- Input divalidasi ketat (schema, size/type check).
- Token GitHub hanya digunakan server-side.
- Gambar disimpan di storage eksternal (Cloudinary).

---

## 7. Visualisasi Alur (Mermaid Diagram)

```mermaid
flowchart TD
    %% Authentication
    A[User] -->|Sign Up / Sign In| B[Auth System]
    B -->|Credentials| C[Dashboard]
    B -->|GitHub OAuth| C

    %% Optional: connect GitHub after credentials login
    C -->|Connect GitHub Account| B

    %% Repository Management
    C --> D[Repository Management]
    D --> D0[Import Repository from GitHub API]
    D --> D1[Create Repository]
    D --> D2[Read Repository List]
    D --> D3[Update Repository]
    D --> D4[Delete Repository]

    %% Feedback Management
    C --> E[Feedback Management]
    E --> E1[Create Feedback + Images]
    E --> E2[Read Feedback / Search / Filter]
    E --> E3[Update Feedback + Manage Images]
    E --> E4[Delete Feedback]

    %% AI Processing
    E --> F[AI Processing]
    F -->|Generate Title, Summary, Steps, Expected Behavior| E

    %% Convert Feedback to GitHub Issue
    E --> G[Convert to GitHub Issue]
    G -->|POST via OAuth Token| H[GitHub API]
    H -->|Issue Created| E

