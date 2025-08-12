const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Dibungkus dalam try...catch untuk dikirim ke errorHandler
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// GET /api/senders
// Mengambil semua sender dari database
exports.getAllSenders = asyncHandler(async (req, res, next) => {
    const senders = await prisma.whatsappSender.findMany({
        orderBy: {
            createdAt: 'desc', // Data terbaru di atas
        },
    });
    res.status(200).json(senders);
});

// Fungsi untuk mendapatkan satu sender berdasarkan ID
exports.getSenderById = asyncHandler(async(req, res, next) => {
    const { id } = req.params;
    try {
        const sender = await prisma.whatsappSender.findUnique({
            where: { id: parseInt(id) },
            include: {
                aiAgent: true,
            },
        });

        if (!sender) {
            return res.status(404).json({ error: 'Whatsapp Sender tidak ditemukan.' });
        }

        res.status(200).json(sender);
    } catch (error) {
        next(error);
    }
});


// POST /api/senders
// Membuat sender baru
exports.createSender = asyncHandler(async (req, res, next) => {
    const { name, phone } = req.body;
    const newSender = await prisma.whatsappSender.create({
        data: { name, phone },
    });
    res.status(201).json(newSender);
});

// PUT /api/senders/:id
// Memperbarui nama sender
exports.updateSender = asyncHandler(async (req, res, next) => {
    const id = parseInt(req.params.id,10);
    const { name } = req.body;

    if (isNaN(id)){
        return res.status(400).json({message: 'ID harus berupa angka.'});
    }
    const updatedSender = await prisma.whatsappSender.update({
        where: { id },
        data: { name },
    });
    res.status(200).json(updatedSender);
});

// DELETE /api/senders/:id
// Menghapus sender
exports.deleteSender = asyncHandler(async (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    await prisma.whatsappSender.delete({ where: { id } });
    res.status(204).send(); // 204 No Content
});

// PUT /api/senders/:id/status
// Mengubah status (paired/unpaired)
exports.updateSenderStatus = asyncHandler(async (req, res, next) => {
    // --- PERBAIKAN DI SINI ---
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    
    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID harus berupa angka.' });
    }
    if (!['paired', 'unpaired'].includes(status)) {
        return res.status(400).json({ error: 'Status tidak valid.' });
    }

    const updatedSender = await prisma.whatsappSender.update({
        where: { id },
        data: { status },
    });
    res.status(200).json(updatedSender);
});

// GET /api/senders/:id/qr
// Simulasi untuk generate QR
exports.generateQrCode = asyncHandler(async (req, res, next) => {
    const id= parseInt(req.params.id, 10);
    // Di aplikasi nyata, di sini akan ada integrasi dengan library WhatsApp
    console.log(`[SIMULASI] Meminta QR Code untuk sender ID: ${id}`);
    res.status(200).json({ 
        message: 'Proses generate QR code dimulai.',
        // Mengirimkan kembali data sender untuk ditampilkan di modal QR
        sender: await prisma.whatsappSender.findUnique({ where: { id } })
    });
});
