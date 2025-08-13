// // src/services/blast.service.cjs

// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const blastQueue = require('../queues/blastQueue.cjs'); // Menggunakan require

// /**
//  * Membuat data blast baru di database dan menambahkan job ke antrian.
//  * @param {object} blastData - Data dari controller (title, message, dll).
//  * @param {object} attachmentFile - Objek file dari multer (jika ada).
//  * @returns {object} Data blast yang baru dibuat.
//  */
// const createBlastAndQueueJob = async (blastData, attachmentFile) => {
//     const { title, message, whatsappSenderId, targetGroupIds, scheduledAt } = blastData;

//     // Gunakan transaksi Prisma untuk memastikan semua operasi DB berhasil atau gagal bersamaan.
//     const newBlast = await prisma.$transaction(async (tx) => {
//         // 1. Buat record Blast utama
//         const blast = await tx.blast.create({
//         data: {
//             title,
//             message,
//             status: 'SCHEDULED',
//             whatsappSender: { connect: { id: parseInt(whatsappSenderId) } },
//             scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
//         },
//         });

//         // 2. Hubungkan Blast dengan Grup Target
//         await tx.blastGroup.createMany({
//         data: targetGroupIds.map(groupId => ({
//             blastId: blast.id,
//             groupId: parseInt(groupId),
//         })),
//         });

//         // 3. Jika ada file lampiran, simpan informasinya
//         if (attachmentFile) {
//         await tx.blastAttachment.create({
//             data: {
//             blastId: blast.id,
//             filePath: attachmentFile.path,
//             fileType: attachmentFile.mimetype,
//             },
//         });
//         }
        
//         return blast;
//     });

//     // 4. Setelah transaksi DB sukses, tambahkan job ke antrian
//     await blastQueue.add('process-new-blast', { blastId: newBlast.id });
//     console.log(`Job added to queue for Blast ID: ${newBlast.id}`);

//     return newBlast;
// };

// // Ekspor fungsi menggunakan module.exports
// module.exports = {
//     createBlastAndQueueJob,
// };
