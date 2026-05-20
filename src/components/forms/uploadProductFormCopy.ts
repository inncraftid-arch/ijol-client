export const uploadProductFormCopy = {
  header: {
    title: 'Daftarkan Pakaianmu',
    description:
      'Upload baju yang tidak terpakai ke katalog IJOL. Tim kami akan review dan menghubungimu jika lolos QC.',
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
      helper: 'Hanya huruf, spasi, dan tanda hubung (-).',
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
    },
    size: {
      label: 'Ukuran*',
      helper: 'Hanya angka dan huruf. Huruf otomatis menjadi kapital.',
    },
    condition: {
      label: 'Kondisi item*',
      placeholder: 'Pilih kondisi item',
    },
    description: {
      label: 'Deskripsi*',
      helper: 'Ceritakan detail item: warna, bahan, kondisi detail, alasan tidak dipakai, dll.',
    },
    buyPrice: {
      label: 'Harga Item (Rp)*',
    },
    rentPrice: {
      label: 'Harga Sewa/hari (Rp)*',
    },
  },
  media: {
    browse: 'Browse',
    itemPhotoHelper:
      'Upload minimal 1 foto untuk debug. Nanti bisa dinaikkan lagi menjadi tampak depan, belakang, dan detail kondisi.',
    proofHelper:
      'Opsional. Pilih tipe bukti terlebih dahulu, lalu upload label, tag, nota, atau bukti pembelian.',
    removeFile: 'Hapus file',
  },
  listing: {
    preLoved: {
      label: 'Pre-Loved Item',
      helper:
        'Aktifkan kalau item boleh dibeli. Pembeli perlu mengirim minimal 1 pakaian tidak terpakai ke IJOL Fiber.',
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
