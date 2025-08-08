// src/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const {
    createContact,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact,
    importContacts, // [BARU] Impor fungsi baru
} = require('../controllers/contactController.js');

// [BARU] Rute untuk import harus diletakkan SEBELUM '/:id'
// agar 'import' tidak dianggap sebagai sebuah ID.
router.post('/import', importContacts);

router.post('/', createContact);
router.get('/', getAllContacts);
router.get('/:id', getContactById);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;