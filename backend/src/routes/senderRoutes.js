const express = require('express');
const {
    getAllSenders,
    getSenderById,
    createSender,
    updateSender,
    deleteSender,
    updateSenderStatus,
    generateQrCode,
} = require('../controllers/senderController');

const router = express.Router();

// Rute untuk mendapatkan semua dan membuat sender baru
router.route('/')
    .get(getAllSenders)
    .post(createSender);

// Rute untuk update dan delete sender berdasarkan ID
router.route('/:id')
    .put(updateSender)
    .delete(deleteSender);

// Rute spesifik untuk mengubah status sender
router.put('/:id/status', updateSenderStatus);

router.get('/:id', getSenderById)

// Rute spesifik untuk generate QR code
router.get('/:id/qr', generateQrCode);

module.exports = router;
