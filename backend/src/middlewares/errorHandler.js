// src/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Handle Prisma-specific errors
    if (err.code === 'P2002') {
        // Unique constraint failed
        return res.status(409).json({
        message: 'Conflict: A record with this value already exists.',
        field: err.meta?.target?.[0], // Shows which field caused the error
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