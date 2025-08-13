// src/services/waBlastService.cjs

/**
 * Mensimulasikan pengiriman pesan WhatsApp.
 * Di aplikasi nyata, di sinilah Anda akan mengintegrasikan API WhatsApp (seperti WABlas, etc).
 *
 * @param {string} contactPhone - Nomor telepon kontak tujuan.
 * @param {string} message - Pesan yang akan dikirim.
 * @param {object|null} attachment - Informasi file lampiran (jika ada).
 * @returns {Promise<object>} - Mengembalikan objek yang menandakan sukses atau gagal.
 */
const sendWhatsAppMessage = async (contactPhone, message, attachment) => {
  // Simulasi jeda waktu pengiriman (misalnya antara 0.5 hingga 1.5 detik)
  const delay = Math.random() * 1000 + 500;
    await new Promise(resolve => setTimeout(resolve, delay));

    console.log(`[SIMULASI] Mengirim pesan ke ${contactPhone}...`);
    if (attachment) {
        console.log(` -> dengan lampiran: ${attachment.filePath}`);
    }

    // Simulasi kemungkinan gagal (misalnya 10% kemungkinan gagal)
    if (Math.random() < 0.1) {
        console.log(` -> [GAGAL] Nomor tidak valid atau error jaringan.`);
        return { success: false, reason: 'Nomor tidak valid' };
    }

    console.log(` -> [SUKSES] Pesan terkirim.`);
    return { success: true };
};

module.exports = {
    sendWhatsAppMessage,
};
