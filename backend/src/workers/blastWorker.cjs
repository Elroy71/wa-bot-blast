// src/workers/blastWorker.cjs

const { Worker } = require('bullmq');
const { PrismaClient } = require('@prisma/client');
const { sendWhatsAppMessage } = require('../services/waBlastService.cjs');

const prisma = new PrismaClient();

// Ambil URL Redis dari environment variables
const redisConnectionUrl = process.env.REDIS_URL;

if (!redisConnectionUrl) {
    console.error("FATAL ERROR: REDIS_URL is not defined in .env file.");
    process.exit(1);
}

// Definisikan logika yang akan dijalankan untuk setiap job
const processor = async (job) => {
    const { blastId } = job.data;
    console.log(`\n--- Memproses Job untuk Blast ID: ${blastId} ---`);

    try {
        // 1. Update status blast menjadi 'SENDING'
        await prisma.blast.update({
        where: { id: blastId },
        data: { status: 'SENDING', startedAt: new Date() },
    });
    console.log(`[Status] Blast ${blastId} -> SENDING`);

    // 2. Ambil semua detail yang diperlukan untuk blast ini
    const blast = await prisma.blast.findUnique({
        where: { id: blastId },
        include: {
            targetGroups: { include: { group: { include: { members: { include: { contact: true } } } } } },
            attachments: true,
        },
    });

    if (!blast) {
        throw new Error(`Blast dengan ID ${blastId} tidak ditemukan.`);
    }

    // 3. Kumpulkan semua kontak unik dari semua grup target
    const allContacts = new Map();
    blast.targetGroups.forEach(blastGroup => {
        blastGroup.group.members.forEach(member => {
            if (!allContacts.has(member.contact.id)) {
            allContacts.set(member.contact.id, member.contact);
            }
        });
        });
        const uniqueContacts = Array.from(allContacts.values());
        console.log(`Ditemukan ${uniqueContacts.length} kontak unik untuk dikirimi pesan.`);

        // 4. Loop melalui setiap kontak dan kirim pesan
        for (const contact of uniqueContacts) {
        // Personalisasi pesan jika ada placeholder {name}
        const personalizedMessage = blast.message.replace(/{name}/g, contact.name);
        const attachment = blast.attachments.length > 0 ? blast.attachments[0] : null;

        // Kirim pesan menggunakan service simulasi
        const result = await sendWhatsAppMessage(contact.phone, personalizedMessage, attachment);

        // 5. Buat log hasil pengiriman untuk setiap kontak
        await prisma.blastRecipientLog.create({
            data: {
            blastId: blastId,
            contactId: contact.id,
            status: result.success ? 'SENT' : 'FAILED',
            sentAt: result.success ? new Date() : null,
            failedReason: result.success ? null : result.reason,
            },
        });
        }

        // 6. Setelah semua selesai, update status blast menjadi 'COMPLETED'
        await prisma.blast.update({
        where: { id: blastId },
        data: { status: 'COMPLETED', completedAt: new Date() },
        });
        console.log(`[Status] Blast ${blastId} -> COMPLETED`);
        console.log(`--- Selesai Memproses Job untuk Blast ID: ${blastId} ---`);

    } catch (error) {
        console.error(`[ERROR] Gagal memproses job untuk Blast ID ${blastId}:`, error);
        // Update status blast menjadi 'FAILED' jika terjadi error tak terduga
        await prisma.blast.update({
        where: { id: blastId },
        data: { status: 'FAILED' },
        });
        // Lempar kembali error agar BullMQ tahu job ini gagal
        throw error;
    }
};


// Buat instance Worker
const worker = new Worker('blast-processing-queue', processor, {
    connection: {
        uri: redisConnectionUrl,
    },
    // Berapa banyak job yang bisa diproses secara bersamaan
    concurrency: 5, 
});

console.log('🚀 Blast Worker siap dan sedang mendengarkan pekerjaan...');

worker.on('failed', (job, err) => {
    console.error(`Job ${job.id} gagal dengan error: ${err.message}`);
});
