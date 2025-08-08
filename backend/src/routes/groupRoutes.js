// File: src/routes/groupRoutes.js

const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

// Rute untuk mendapatkan semua grup (untuk halaman utama)
// GET /api/groups
router.get('/', groupController.getGroups);

// Rute untuk membuat grup baru
// POST /api/groups
router.post('/', groupController.createNewGroup);

// Rute untuk mendapatkan detail satu grup (untuk halaman edit)
// GET /api/groups/:id
router.get('/:id', groupController.getGroupDetails);

// Rute untuk memperbarui grup
// PUT /api/groups/:id
router.put('/:id', groupController.updateExistingGroup);

// Rute untuk menghapus grup
// DELETE /api/groups/:id
router.delete('/:id', groupController.deleteExistingGroup);

module.exports = router;
