export const uploadProductFormCopy = {
  header: {
    title: 'Daftarkan Pakaianmu',
    description:
      'Upload baju yang tidak terpakai ke katalog IJOL. Tim kami akan review dan menghubungimu jika lolos QC. Pastikan foto jelas dan informasi lengkap ya!',
    privacy: 'Kami melindungi datamu. Informasi pribadi tidak akan kami salahgunakan.',
  },
  sections: {
    personal: 'Informasi Pribadi',
    clothing: 'Informasi Pakaian',
    itemPhotos: 'Foto Item*',
    authenticityProof: 'Upload Bukti Keaslian',
  },
  userMode: {
    title: 'Apakah kamu sudah pernah upload sebelumnya?',
    description: 'Pilih opsi ini supaya data pribadi bisa diambil dari nomor WhatsApp yang pernah didaftarkan.',
    existing: {
      label: 'Sudah pernah upload',
      helper: 'Cek nomor WhatsApp, lalu IJOL akan mengisi informasi pribadi yang tersimpan.',
    },
    new: {
      label: 'User baru',
      helper: 'Isi data pribadi seperti biasa untuk membuat data user baru.',
    },
    lookupLabel: 'Cek Nomor WhatsApp*',
    lookupHelper: 'Masukkan nomor yang sama dengan upload sebelumnya.',
    lookupPlaceholder: 'Contoh: 081234567890',
    lookupButton: 'Cek nomor',
    checking: 'Mengecek nomor...',
    found: 'Nomor ditemukan. Informasi pribadi sudah terisi otomatis.',
    notFound: 'Nomor belum terdaftar. Pilih user baru untuk melanjutkan.',
    emptyPhone: 'Masukkan nomor WhatsApp terlebih dahulu.',
  },
  fields: {
    fullName: {
      label: 'Nama Lengkap*',
      helper: 'Nama kamu akan tampil di info pakaian sebagai pemilik.',
    },
    whatsapp: {
      label: 'Nomor WhatsApp aktif*',
      helper: 'Kami akan hubungi via WA untuk konfirmasi QC dan permintaan swap/beli.',
    },
    city: {
      label: 'Kota Domisili*',
      helper: 'Domisili membantu pakaianmu ditemukan pengguna terdekat.',
      placeholder: 'Pilih kota domisili',
    },
    itemName: {
      label: 'Nama item*',
      helper: 'Contoh: Kemeja flannel kotak-kotak, Kaos Oversize, Celana jeans slim fit hitam',
      placeholder: 'Isi nama jenis pakaianmu',
    },
    category: {
      label: 'Kategori*',
      placeholder: 'Pilih kategori',
    },
    brandStatus: {
      label: 'Apakah ini item branded?*',
      placeholder: 'Pilih status brand',
    },
    brand: {
      label: 'Brand*',
      placeholder: 'Masukkan brand',
    },
    size: {
      label: 'Ukuran*',
      helper: 'Contoh: S, M, L, XL, 30, 32, 38, Free Size',
      placeholder: 'Masukkan ukurannya',
    },
    condition: {
      label: 'Kondisi item*',
      placeholder: 'Pilih kondisi item',
    },
    description: {
      label: 'Deskripsi*',
      helper: 'Ceritakan detail item: warna, bahan, kondisi detail, alasan tidak dipakai, dll.',
      placeholder: 'Masukkan deskripsi',
    },
    buyPrice: {
      label: 'Harga Item (Rp)*',
      placeholder: 'Masukkan harga',
    },
    rentPrice: {
      label: 'Harga Sewa/hari (Rp)*',
      placeholder: 'Masukkan harga',
    },
  },
  media: {
    browse: 'Browse',
    itemPhotoHelper:
      'Upload min. 3 foto: tampak depan, tampak belakang, dan detail kondisi. Max 5MB per foto. Format JPG/PNG.',
    proofHelper:
      'Opsional. Pilih tipe bukti terlebih dahulu, lalu upload label, tag, nota, atau bukti pembelian.',
    removeFile: 'Hapus file',
  },
  listing: {
    preLoved: {
      label: 'Pre-Loved Item',
      helper:
        'Apabila kamu mengaktifkan Pre-Loved, calon pembeli perlu mengirim minimal 1 pakaian tidak terpakai ke IJOL Fiber — apapun kondisinya. Ini memastikan satu pakaian masuk, satu pakaian keluar.',
    },
    rental: {
      label: 'Sewa Item',
      helper: 'Aktifkan apabila kamu ingin menyewakan pakaian ini.',
    },
  },
  buttons: {
    cancel: 'Batal',
    submit: 'Upload Pakaian',
    submitting: 'Mengupload...',
    close: 'Tutup form upload',
  },
  status: {
    submitting: 'Mengupload gambar ke AWS dan menyimpan data ke Supabase...',
    success: 'Pakaian berhasil dikirim untuk review QC.',
    error: 'Upload gagal. Coba lagi sebentar.',
  },
} as const;
