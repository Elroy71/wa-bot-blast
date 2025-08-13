// src/middlewares/upload.cjs

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tentukan direktori tujuan untuk menyimpan file lampiran
const uploadDir = path.join(__dirname, '../../public/uploads/attachments');

    // Pastikan direktori tujuan ada, jika tidak, buat direktorinya
    if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi penyimpanan Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    },
});

// Buat instance Multer dengan konfigurasi
const upload = multer({
    storage: storage,
  limits: { fileSize: 30 * 1024 * 1024 }, 
});

module.exports = upload;
