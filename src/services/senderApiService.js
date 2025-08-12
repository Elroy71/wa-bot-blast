// Alamat dasar backend Anda. Pastikan port-nya sesuai.
const API_BASE_URL = 'http://localhost:3000/api/senders';

/**
 * Fungsi helper untuk menangani respons dari fetch.
 * @param {Response} response - Objek respons dari fetch.
 * @returns {Promise<any>} - Data JSON jika berhasil.
 * @throws {Error} - Error dengan pesan dari backend jika gagal.
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        // Melemparkan error agar bisa ditangkap oleh .catch() di komponen
        throw new Error(errorData.message || 'Terjadi kesalahan pada server.');
    }
    // Jika respons tidak memiliki konten (seperti pada DELETE), kembalikan null
    if (response.status === 204) {
        return null;
    }
    return response.json();
};

/**
 * Mengambil semua data sender dari backend.
 */
export const getSenders = () => {
    return fetch(API_BASE_URL).then(handleResponse);
};

/**
 * Membuat sender baru.
 * @param {object} senderData - Data untuk sender baru (misal: { name, phone }).
 */
export const createSender = (senderData) => {
    return fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(senderData),
    }).then(handleResponse);
};

/**
 * Memperbarui nama sender.
 * @param {number|string} id - ID sender yang akan diupdate.
 * @param {object} senderData - Data yang akan diupdate (misal: { name }).
 */
export const updateSenderName = (id, senderData) => {
    return fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(senderData),
    }).then(handleResponse);
};

/**
 * Memperbarui status sender (paired/unpaired).
 * @param {number|string} id - ID sender.
 * @param {string} status - Status baru ('paired' atau 'unpaired').
 */
export const updateSenderStatus = (id, status) => {
    return fetch(`${API_BASE_URL}/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    }).then(handleResponse);
};

/**
 * Menghapus sender.
 * @param {number|string} id - ID sender yang akan dihapus.
 */
export const deleteSender = (id) => {
    return fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
    }).then(handleResponse);
};

/**
 * Meminta generate QR code (simulasi).
 * @param {number|string} id - ID sender.
 */
export const generateQrCode = (id) => {
    return fetch(`${API_BASE_URL}/${id}/qr`).then(handleResponse);
};
