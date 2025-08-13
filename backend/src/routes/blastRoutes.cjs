// src/routes/blastRoutes.cjs

const express = require('express');
const { createBlast } = require('../controllers/blastController.cjs');
const upload = require('../middlewares/upload.cjs');

const router = express.Router();

// Endpoint untuk MEMBUAT blast baru
router.post('/', upload.single('attachment'), createBlast);

// Ekspor router menggunakan module.exports
module.exports = router;
