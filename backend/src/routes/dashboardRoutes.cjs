// src/routes/dashboardRoutes.cjs

const express = require('express');
const { getDashboardData } = require('../controllers/dashboardController.cjs');

const router = express.Router();

// Satu endpoint untuk mengambil semua data dashboard
router.get('/', getDashboardData);

module.exports = router;
