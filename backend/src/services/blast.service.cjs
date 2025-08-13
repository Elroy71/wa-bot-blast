// src/services/blast.service.cjs

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const blastQueue = require('../queues/blastQueue.cjs');

/**
 * Membuat data blast baru di database dan menambahkan job ke antrian.
 * @param {object} blastData - Data dari controller (title, message, dll).
 * @param {object} attachmentFile - Objek file dari multer (jika ada).
 * @returns {object} Data blast yang baru dibuat.
 */
const createBlastAndQueueJob = async (blastData, attachmentFile) => {
    const { title, message, whatsappSenderId, targetGroupIds, scheduledAt } = blastData;

    const newBlast = await prisma.$transaction(async (tx) => {
        const blast = await tx.blast.create({
        data: {
            title,
            message,
            status: 'SCHEDULED',
            whatsappSender: { connect: { id: parseInt(whatsappSenderId) } },
            scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        },
        });

        await tx.blastGroup.createMany({
        data: targetGroupIds.map(groupId => ({
            blastId: blast.id,
            groupId: parseInt(groupId),
        })),
        });

        if (attachmentFile) {
        await tx.blastAttachment.create({
            data: {
            blastId: blast.id,
            filePath: attachmentFile.path,
            fileType: attachmentFile.mimetype,
            },
        });
        }
        
        return blast;
    });

    await blastQueue.add('process-new-blast', { blastId: newBlast.id });
    console.log(`Job added to queue for Blast ID: ${newBlast.id}`);

    return newBlast;
    };


/**
 * Mengambil semua data blast untuk ditampilkan di halaman utama.
 * @returns {Promise<Array>} - Daftar semua blast dengan ringkasan.
 */
const getAllBlasts = async () => {
    const blasts = await prisma.blast.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            whatsappSender: { select: { name: true } },
            targetGroups: { select: { group: { select: { name: true } } } },
        },
    });

    const blastsWithStats = await Promise.all(
        blasts.map(async (blast) => {
            const sentCount = await prisma.blastRecipientLog.count({
                where: {
                    blastId: blast.id,
                    status: { in: ['SENT', 'DELIVERED', 'READ'] },
                },
            });
            const failedCount = await prisma.blastRecipientLog.count({
                where: {
                    blastId: blast.id,
                    status: 'FAILED',
                },
            });

            return {
                id: blast.id,
                name: blast.title,
                group: blast.targetGroups.map(tg => tg.group.name).join(', '),
                sender: blast.whatsappSender.name,
                status: blast.status,
                sent: sentCount,
                failed: failedCount,
                date: blast.createdAt.toISOString().split('T')[0],
            };
        })
    );

    return blastsWithStats;
};

/**
 * Mengambil detail lengkap dari satu blast berdasarkan ID.
 * @param {number} id - ID dari blast yang akan diambil.
 * @returns {Promise<object|null>} - Detail blast atau null jika tidak ditemukan.
 */
const getBlastById = async (id) => {
    const blast = await prisma.blast.findUnique({
        where: { id: parseInt(id) },
        include: {
            whatsappSender: true,
            attachments: true,
            targetGroups: { include: { group: true } },
            recipientLogs: {
                include: { contact: true },
                orderBy: { contact: { name: 'asc' } }
            }
        }
    });

    if (!blast) return null;

    const sentCount = blast.recipientLogs.filter(log => ['SENT', 'DELIVERED', 'READ'].includes(log.status)).length;
    const failedCount = blast.recipientLogs.filter(log => log.status === 'FAILED').length;

    return {
        id: blast.id,
        name: blast.title,
        status: blast.status,
        group: blast.targetGroups.map(tg => tg.group.name).join(', '),
        sender: blast.whatsappSender.name,
        sent: sentCount,
        failed: failedCount,
        message: blast.message,
        attachment: blast.attachments.length > 0 ? blast.attachments[0].filePath.split(/[\\/]/).pop() : null,
        recipients: blast.recipientLogs.map(log => ({
            name: log.contact.name,
            phone: log.contact.phone,
            status: log.status === 'SENT' ? 'Terkirim' : log.status === 'READ' ? 'Dibaca' : 'Gagal',
            sentAt: log.sentAt ? log.sentAt.toLocaleString('id-ID') : '-',
        }))
    };
};


// Ekspor semua fungsi
module.exports = {
    createBlastAndQueueJob,
    getAllBlasts,
    getBlastById,
};
