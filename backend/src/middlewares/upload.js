const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
    // Tentukan folder tujuan untuk menyimpan file
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    // Buat nama file yang unik untuk menghindari konflik
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filter untuk memastikan hanya file PDF yang di-upload
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true); // Terima file
    } else {
        // Tolak file dengan memberikan error
        cb(new Error('Hanya file dengan format PDF yang diizinkan!'), false);
    }
};

// Inisialisasi multer dengan konfigurasi storage dan filter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // Batasi ukuran file hingga 2MB
    }
});

module.exports = upload;
