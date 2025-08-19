// src/services/dashboard.service.cjs

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Mengambil statistik utama untuk halaman dashboard.
 */
const getDashboardStats = async () => {
    // Menjalankan semua query secara paralel untuk efisiensi
    const [
        totalContacts,
        totalGroups,
        activeSenders,
        completedBlasts,
    ] = await Promise.all([
        prisma.contact.count(),
        prisma.group.count(),
        prisma.whatsappSender.count({ where: { status: 'paired' } }),
        prisma.blast.count({ where: { status: 'COMPLETED' } }),
    ]);

    return {
        totalContacts,
        totalGroups,
        activeSenders,
        completedBlasts,
    };
};

/**
 * Mengambil 5 blast terakhir untuk tabel aktivitas.
 */
const getRecentBlasts = async () => {
    const recentBlastsData = await prisma.blast.findMany({
        take: 5, // Ambil 5 data teratas
        orderBy: { createdAt: 'desc' },
        include: {
            whatsappSender: { select: { name: true } },
            targetGroups: { select: { group: { select: { name: true } } } },
            _count: {
                select: {
                    recipientLogs: { where: { status: { in: ['SENT', 'DELIVERED', 'READ'] } } },
                    // Kita bisa hitung gagal dengan cara lain jika perlu
                },
            },
        },
    });

    // Format data agar sesuai dengan frontend
    const formattedBlasts = await Promise.all(
        recentBlastsData.map(async (blast) => {
            const failedCount = await prisma.blastRecipientLog.count({
                where: { blastId: blast.id, status: 'FAILED' },
            });

            return {
                id: blast.id,
                name: blast.title,
                group: blast.targetGroups.map(tg => tg.group.name).join(', '),
                status: blast.status,
                sent: blast._count.recipientLogs,
                failed: failedCount,
                date: blast.createdAt.toISOString().split('T')[0],
            };
        })
    );

    return formattedBlasts;
};

module.exports = {
    getDashboardStats,
    getRecentBlasts,
};
