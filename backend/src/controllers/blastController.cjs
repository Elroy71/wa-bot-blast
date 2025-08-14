// src/controllers/blastController.cjs

const blastService = require('../services/blast.service.cjs');

const createBlast = async (req, res, next) => {
    // --- LANGKAH DEBUGGING ---
    // Mari kita lihat apa yang sebenarnya ada di dalam request
    console.log("--- Request Diterima ---");
    console.log("Isi req.body:", req.body);
    console.log("Isi req.file:", req.file);
    console.log("----------------------");
    // -------------------------

    try {
        const { title, message, whatsappSenderId, targetGroupId, scheduledAt } = req.body;
        const attachmentFile = req.file;

        if (!title || !message || !whatsappSenderId || !targetGroupId) {
        // Jika Anda melihat log "req.body" kosong di terminal, inilah penyebab errornya
        return res.status(400).json({ message: 'Judul, pesan, sender, dan grup target wajib diisi.' });
        }

        const blastData = {
        title,
        message,
        whatsappSenderId,
        targetGroupId,
        scheduledAt,
        };

        const newBlast = await blastService.createBlastAndQueueJob(blastData, attachmentFile);

        res.status(201).json({ message: 'Blast berhasil dibuat dan dijadwalkan untuk diproses!', data: newBlast });

    } catch (error) {
        next(error);
    }
};

const getBlasts = async (req, res, next) => {
    try {
        const blasts = await blastService.getAllBlasts();
        res.status(200).json(blasts);
    } catch (error) {
        next(error);
    }
};

const getBlastDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const blast = await blastService.getBlastById(id);

        if (!blast) {
        return res.status(404).json({ message: 'Blast tidak ditemukan.' });
        }

        res.status(200).json(blast);
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createBlast,
    getBlasts,
    getBlastDetails,
};