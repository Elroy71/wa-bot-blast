// src/routes/blastRoutes.cjs

const express = require('express');
const { 
    createBlast, 
    getBlasts, 
    getBlastDetails 
} = require('../controllers/blastController.cjs');
const upload = require('../middlewares/upload.cjs');

const router = express.Router();

router.post('/', upload.single('attachment'), createBlast);
router.get('/', getBlasts);

router.get('/:id', getBlastDetails);

module.exports = router;
