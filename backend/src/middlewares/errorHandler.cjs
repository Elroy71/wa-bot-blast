// src/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Menangani error spesifik dari Prisma
    if (err.code === 'P2002') {
        // Gagal karena ada data yang sama (unique constraint)
        const field = err.meta?.target?.[0];
        
        // --- PESAN DIPERBAIKI DI SINI ---
        // Membuat pesan lebih dinamis dan ramah pengguna
        let message = `Data yang Anda masukkan sudah ada.`;
        if (field === 'phone') {
            message = 'Nomor telepon ini sudah terdaftar. Silakan gunakan nomor lain.';
        } else if (field === 'name') {
            message = 'Nama ini sudah digunakan. Silakan gunakan nama lain.';
        }

        return res.status(409).json({ // 409 Conflict
            message: message,
            field: field,
        });
    }

    if (err.code === 'P2025') {
        // Record to update/delete not found
        return res.status(404).json({
            message: 'Not Found: The record you tried to act on does not exist.',
        });
    }

    // General server error
    res.status(500).json({
        message: 'An internal server error occurred',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
};

module.exports = errorHandler;