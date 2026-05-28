# IJOL Client Site

React + TypeScript + Vite landing site untuk IJOL.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Environment

Copy `.env.example` ke `.env.local`, lalu isi:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SUPABASE_USERS_TABLE=users
VITE_SUPABASE_ITEMS_TABLE=items
VITE_SUPABASE_ITEM_PHOTOS_TABLE=item_photos
VITE_SUPABASE_ITEM_BRAND_PROOFS_TABLE=item_brand_proofs
VITE_SUPABASE_SWAP_REQUESTS_TABLE=swap_requests
VITE_SUPABASE_AWS_UPLOAD_FUNCTION=create-s3-upload-url
```

## Upload Flow

Form `Upload Baju` memakai flow:

1. Client upsert user berdasarkan nomor WhatsApp.
2. Client meminta presigned URL ke Supabase Edge Function.
3. Client upload foto item dan bukti brand langsung ke AWS S3 memakai presigned URL.
4. Client membuat row `items`.
5. Client membuat row `item_photos`.
6. Client membuat row `item_brand_proofs` jika item branded dan bukti di-upload.

AWS secret tidak boleh berada di frontend. Edge Function Supabase yang membuat presigned URL harus menyimpan AWS credential di secret server-side.

### Edge Function Contract

Template function tersedia di `supabase/functions/create-s3-upload-url/index.ts`.

Secrets yang dibutuhkan di Supabase:

```bash
supabase secrets set AWS_REGION=ap-southeast-1
supabase secrets set AWS_S3_BUCKET=your-bucket-name
supabase secrets set AWS_ACCESS_KEY_ID=your-access-key
supabase secrets set AWS_SECRET_ACCESS_KEY=your-secret-key
supabase secrets set AWS_PUBLIC_BASE_URL=https://your-cdn-or-public-bucket-url
```

Deploy function:

```bash
supabase functions deploy create-s3-upload-url
```

Bucket S3 perlu CORS untuk upload dari browser. Di AWS S3 bucket, buka **Permissions > Cross-origin resource sharing (CORS)** lalu isi:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedOrigins": ["http://localhost:5173", "http://localhost:5174", "https://domain-production-kamu.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

Untuk testing cepat boleh pakai `"AllowedOrigins": ["*"]`, tapi untuk production lebih baik isi domain yang benar.

Request dari frontend:

```json
{
  "fileName": "photo.jpg",
  "contentType": "image/jpeg",
  "fileSize": 123456,
  "folder": "ijol-mvp/..."
}
```

Response yang diharapkan:

```json
{
  "uploadUrl": "https://s3-presigned-put-url",
  "publicUrl": "https://cdn-or-s3-public-url/photo.jpg",
  "key": "ijol-mvp/.../photo.jpg",
  "headers": {}
}
```

### Supabase Tables

Jalankan SQL di `supabase/upload-flow-schema.sql` dari Supabase SQL Editor untuk membuat:

- `users`
- `items`
- `item_photos`
- `item_brand_proofs`

Kalau table `items` sudah pernah dibuat dari schema lama, jalankan juga:

```txt
supabase/alter-items-validation-fields.sql
```

Perubahan schema item terbaru:

- `is_branded` disimpan sebagai boolean, bukan string `brand_status`.
- `category_gender` berisi `male`, `female`, atau `unisex`.
- `name` hanya menerima huruf, spasi, dan `-`.
- `size` hanya menerima huruf kapital dan angka.
- `condition` dibatasi ke opsi kondisi yang ada di form.
- Ukuran foto maksimal 10MB per file.

Existing user lookup memakai table `VITE_SUPABASE_USERS_TABLE` dengan kolom:

- `id`
- `full_name`
- `phone`
- `city`

Nomor telepon untuk lookup disimpan dalam format lokal Indonesia, misalnya `081234567890`.
Input lookup hanya menerima digit, harus diawali `08`, minimal 10 digit, dan maksimal 14 digit.

Untuk production, policy `select` user dan multi insert dari client sebaiknya dipindahkan ke Edge Function/RPC supaya client tidak bisa membaca atau menulis tabel terlalu bebas.
