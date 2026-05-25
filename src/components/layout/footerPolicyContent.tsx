import type { ReactNode } from 'react';

export type FooterPolicyKey = 'refund' | 'terms';

type FooterPolicySection = {
  title: string;
  content: ReactNode;
};

export type FooterPolicyContent = {
  title: string;
  updatedAt: string;
  intro: ReactNode;
  sections: FooterPolicySection[];
};

const termsSections: FooterPolicySection[] = [
  {
    title: 'Tentang IJOL',
    content: (
      <>
        <p>
          IJOL adalah platform pertukaran pakaian berbasis komunitas yang menghubungkan pengguna
          untuk menukar, membeli, menyewa, mendonasikan, dan mendaur ulang pakaian tidak terpakai.
          IJOL bukan marketplace jual beli konvensional. Seluruh mekanisme platform dirancang
          untuk memastikan ekosistem fashion yang bersifat sirkular, di mana setiap pakaian yang
          masuk ke ekosistem IJOL memiliki tujuan yang berkelanjutan.
        </p>
        <p>
          IJOL bertindak sebagai perantara dan koordinator antar pengguna. IJOL tidak memiliki,
          menyimpan, atau memproses pakaian yang dipertukarkan antar pengguna, kecuali untuk item
          yang masuk ke program Donasi dan IJOL Fiber.
        </p>
      </>
    ),
  },
  {
    title: 'Keanggotaan dan Akun',
    content: (
      <p>
        Pengguna wajib berusia minimal 17 tahun atau mendapat persetujuan orang tua atau wali untuk
        menggunakan layanan IJOL. Setiap pengguna hanya diperbolehkan memiliki satu akun aktif.
        Informasi yang diberikan pada saat pendaftaran harus akurat dan terkini. IJOL berhak
        menangguhkan atau menghapus akun yang terbukti memberikan informasi palsu, melakukan
        penipuan, atau melanggar ketentuan ini.
      </p>
    ),
  },
  {
    title: 'Layanan yang Tersedia',
    content: (
      <>
        <p>IJOL menyediakan empat jalur layanan:</p>
        <ul>
          <li>
            <strong>Swap Pakaian</strong>, yaitu pertukaran pakaian antar dua pengguna dengan
            memiliki minimal satu item aktif di katalog IJOL.
          </li>
          <li>
            <strong>Beli Pakaian</strong>, yaitu pembelian pakaian preloved dari pengguna lain
            menggunakan uang. Pengguna yang menggunakan fitur ini diberikan pilihan untuk
            berkontribusi ke program IJOL Fiber dengan mengirimkan pakaian tidak terpakai dalam
            kondisi apapun. Kontribusi ini bersifat sukarela namun mendapat insentif berupa
            pengurangan platform fee dan gratis ongkir sebagaimana dijelaskan pada Pasal 6.
          </li>
          <li>
            <strong>Sewa Pakaian</strong>, yaitu penyewaan pakaian dalam durasi tertentu dengan
            pemilik pakaian.
          </li>
          <li>
            <strong>Donasi Pakaian</strong>, yaitu penyerahan pakaian layak pakai kepada mitra NGO
            dan komunitas terverifikasi.
          </li>
          <li>
            <strong>IJOL Fiber</strong>, yaitu pengiriman pakaian dalam kondisi apapun untuk
            diproses menjadi material daur ulang.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Ketentuan Upload Item ke Katalog',
    content: (
      <p>
        Pengguna yang mengunggah item ke katalog IJOL menyatakan bahwa item tersebut adalah milik
        mereka sendiri, dalam kondisi yang sesuai dengan deskripsi dan foto yang diunggah, sudah
        bersih dan layak pakai, serta bebas dari kerusakan yang tidak dicantumkan. IJOL berhak
        menolak item yang tidak memenuhi standar kualitas tanpa memberikan kompensasi. Foto yang
        diunggah harus merupakan foto asli item tersebut, bukan foto dari internet atau katalog
        brand. Item yang tidak berhasil diswap dalam 90 hari akan diinformasikan kepada pemilik
        untuk diperbarui, didonasikan, atau dikirim ke IJOL Fiber.
      </p>
    ),
  },
  {
    title: 'Ketentuan Transaksi',
    content: (
      <>
        <p>
          Semua transaksi, baik swap maupun pembelian, wajib dilakukan sepenuhnya melalui platform
          IJOL. Transaksi yang terbukti dinegosiasikan atau diselesaikan di luar platform tidak
          mendapat perlindungan, jaminan, maupun kebijakan refund dari IJOL.
        </p>
        <p>
          Pengiriman pakaian dilakukan langsung antar pengguna melalui jasa ekspedisi pilihan
          masing-masing (apabila menggunakan paket Mini Swap). Biaya pengiriman ditanggung oleh
          masing-masing pengguna. Sebelum melakukan pengiriman, kedua pihak wajib merekam video
          singkat kondisi item saat dikemas dan mengirimkannya ke admin IJOL sebagai bukti kondisi
          item pada saat dikirim.
        </p>
      </>
    ),
  },
  {
    title: 'Program Insentif Kontribusi IJOL Fiber saat Pembelian',
    content: (
      <>
        <p>
          Pengguna yang melakukan pembelian pakaian preloved diberikan pilihan sukarela untuk
          berkontribusi ke program IJOL Fiber. Pilihan ini tersedia dalam dua opsi:
        </p>
        <ul>
          <li>
            <strong>Opsi Tanpa Kontribusi:</strong> pengguna membayar platform fee penuh sebesar 8%
            (pakaian &lt;Rp100.000) dan 10% (pakaian &gt;Rp100.000), ongkir ditanggung pengguna.
          </li>
          <li>
            <strong>Opsi Dengan Kontribusi IJOL Fiber:</strong> pengguna mengirimkan minimal satu
            pakaian tidak terpakai dalam kondisi apapun ke drop point IJOL Fiber, dan mendapatkan
            gratis platform fee, serta gratis ongkir (biaya dikembalikan oleh admin setelah pakaian
            sampai di tempat drop-off).
          </li>
        </ul>
        <p>
          Bukti pengiriman ke IJOL Fiber berupa nomor resi atau foto drop-off wajib dilaporkan
          kepada admin IJOL dalam tiga hari setelah pembelian untuk mendapatkan insentif. Insentif
          tidak dapat diberikan retroaktif setelah batas waktu tersebut.
        </p>
      </>
    ),
  },
  {
    title: 'Larangan',
    content: (
      <p>
        Pengguna dilarang mengunggah item yang bukan miliknya, mengunggah item dengan foto atau
        deskripsi yang tidak sesuai kondisi aslinya, menggunakan platform untuk transaksi di luar
        sistem IJOL, membuat lebih dari satu akun, menyebarkan informasi kontak pengguna lain tanpa
        persetujuan, menggunakan platform untuk tujuan komersial atau bisnis tanpa izin tertulis
        dari IJOL, serta melakukan tindakan yang merugikan pengguna lain atau merusak reputasi
        platform.
      </p>
    ),
  },
  {
    title: 'Privasi dan Data',
    content: (
      <p>
        IJOL mengumpulkan data berupa nama, nomor WhatsApp, kota domisili, dan foto item. Data ini
        digunakan semata-mata untuk keperluan operasional platform dan tidak dibagikan kepada pihak
        ketiga tanpa persetujuan pengguna.
      </p>
    ),
  },
  {
    title: 'Penghentian Layanan',
    content: (
      <p>
        IJOL berhak menangguhkan atau menghentikan pengguna yang melanggar ketentuan ini tanpa
        pemberitahuan sebelumnya. Pengguna yang akunnya dihentikan karena pelanggaran tidak berhak
        atas pengembalian platform fee maupun swap token.
      </p>
    ),
  },
  {
    title: 'Perubahan Ketentuan',
    content: (
      <p>
        IJOL berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diinformasikan
        melalui website, email, dan WhatsApp admin minimal tujuh hari sebelum berlaku. Penggunaan
        platform setelah perubahan berlaku dianggap sebagai persetujuan atas ketentuan yang baru.
      </p>
    ),
  },
];

const refundSections: FooterPolicySection[] = [
  {
    title: 'Skenario 1 - Item berbeda signifikan dari foto atau deskripsi',
    content: (
      <>
        <p>
          Jika item yang diterima terbukti memiliki perbedaan signifikan dari foto dan deskripsi
          yang dicantumkan di katalog, pengguna berhak mendapatkan pengembalian swap token secara
          penuh dan platform fee dikembalikan sepenuhnya. Klaim wajib diajukan dalam 24 jam setelah
          paket diterima dengan disertai foto atau video kondisi item. Proses pengembalian
          diselesaikan dalam dua kali dua puluh empat jam.
        </p>
        <p>
          Yang termasuk perbedaan signifikan: sobekan atau lubang yang tidak ada di foto, noda
          permanen yang tidak disebutkan dalam deskripsi, ukuran yang berbeda dari yang dicantumkan,
          dan item yang dikirim bukan item yang difotokan.
        </p>
        <p>
          Yang tidak termasuk perbedaan signifikan: perbedaan warna akibat pencahayaan foto, bau
          yang dapat hilang setelah dicuci, kerutan atau bekas lipatan, dan perbedaan selera setelah
          melihat langsung.
        </p>
      </>
    ),
  },
  {
    title: 'Skenario 2 - Item rusak akibat pengiriman',
    content: (
      <p>
        Jika item terbukti rusak selama proses pengiriman, platform fee dikembalikan dan swap token
        dikembalikan sebesar lima puluh persen. Untuk nilai item, pengguna disarankan mengajukan
        klaim kepada jasa ekspedisi yang digunakan. IJOL menyarankan pengguna untuk selalu
        menggunakan layanan asuransi paket yang tersedia di jasa ekspedisi. Klaim wajib diajukan
        dalam 24 jam setelah paket diterima dengan disertai foto kondisi paket dan isinya.
      </p>
    ),
  },
  {
    title: 'Skenario 3 - Pemilik item membatalkan setelah Swapped (match)',
    content: (
      <p>
        Jika pemilik item membatalkan transaksi setelah kedua pihak dikonfirmasi cocok, swap token
        dan platform fee pengguna yang mengajukan request dikembalikan sepenuhnya. Pemilik yang
        membatalkan dikenakan penalti berupa pengurangan satu swap token dan catatan pada profil.
      </p>
    ),
  },
  {
    title: 'Skenario 4 - Pengguna yang mengajukan request membatalkan setelah bayar',
    content: (
      <p>
        Jika pengguna yang mengajukan request membatalkan setelah konfirmasi dan pembayaran
        dilakukan, platform fee tidak dikembalikan karena biaya koordinasi admin telah digunakan.
        Swap token dikembalikan sebesar lima puluh persen. Pembatalan harus dilaporkan kepada admin
        IJOL sebelum paket dikirim.
      </p>
    ),
  },
  {
    title: 'Skenario 5 - Paket tidak sampai atau hilang di ekspedisi',
    content: (
      <p>
        Jika paket terbukti hilang berdasarkan konfirmasi dari jasa ekspedisi, swap token dan
        platform fee dikembalikan sepenuhnya. Pengguna wajib melampirkan nomor resi dan bukti
        konfirmasi kehilangan dari jasa ekspedisi. Proses pengembalian diselesaikan dalam lima kali
        dua puluh empat jam setelah bukti diterima.
      </p>
    ),
  },
  {
    title: 'Skenario 6 - Pembatalan subscription',
    content: (
      <p>
        Pengguna dapat membatalkan subscription kapan saja tanpa penalti. Biaya subscription yang
        sudah dibayarkan tidak dikembalikan dalam bentuk uang tunai. Sisa kuota swap yang belum
        digunakan pada bulan berjalan akan dikonversikan menjadi swap token dengan nilai yang setara
        dan berlaku selama sembilan puluh hari sejak tanggal pembatalan.
      </p>
    ),
  },
  {
    title: 'Skenario 7 - Insentif IJOL Fiber tidak diklaim dalam batas waktu',
    content: (
      <p>
        Jika pengguna yang memilih opsi kontribusi IJOL Fiber tidak melaporkan bukti pengiriman
        dalam tiga hari setelah pembelian, insentif berupa gratis platform fee dan gratis ongkir
        dianggap hangus dan tidak dapat diklaim kembali. Tidak ada refund yang berlaku untuk
        skenario ini karena kontribusi IJOL Fiber bersifat sukarela dan pilihan insentif telah
        diinformasikan sebelum transaksi disetujui.
      </p>
    ),
  },
  {
    title: 'Ketentuan Umum',
    content: (
      <p>
        Seluruh klaim refund hanya diproses untuk transaksi yang sepenuhnya dilakukan melalui
        platform IJOL. Transaksi yang terbukti dinegosiasikan atau diselesaikan di luar platform
        tidak mendapat perlindungan refund dalam bentuk apapun. Keputusan IJOL atas setiap klaim
        refund bersifat final setelah melalui proses verifikasi bukti yang diajukan pengguna.
      </p>
    ),
  },
];

export const footerPolicies: Record<FooterPolicyKey, FooterPolicyContent> = {
  refund: {
    title: 'Kebijakan Refund',
    updatedAt: 'Mei 2026',
    intro: (
      <p>
        Karena IJOL bukan platform jual beli konvensional, refund tidak diberikan dalam bentuk uang
        tunai, melainkan dalam bentuk swap token dan pengembalian platform fee sesuai skenario yang
        berlaku. Seluruh klaim refund hanya diproses untuk transaksi yang sepenuhnya dilakukan
        melalui platform IJOL.
      </p>
    ),
    sections: refundSections,
  },
  terms: {
    title: 'Syarat dan Ketentuan',
    updatedAt: 'Mei 2026',
    intro: (
      <p>
        Dengan menggunakan platform IJOL, baik melalui website maupun layanan terkait, kamu dianggap
        telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan berikut. Jika kamu
        tidak menyetujui sebagian atau seluruh isi ketentuan ini, harap tidak menggunakan layanan
        IJOL.
      </p>
    ),
    sections: termsSections,
  },
};
