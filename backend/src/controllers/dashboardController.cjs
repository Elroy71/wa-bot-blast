// src/controllers/dashboardController.cjs

const dashboardService = require('../services/dashboard.service.cjs');

/**
 * Menggabungkan semua data untuk dashboard dalam satu respons.
 */
const getDashboardData = async (req, res, next) => {
    try {
        const stats = await dashboardService.getDashboardStats();
        const recentBlasts = await dashboardService.getRecentBlasts();

        res.status(200).json({
            stats,
            recentBlasts,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardData,
};
