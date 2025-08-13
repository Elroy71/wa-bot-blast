// // src/controllers/blastController.cjs

// // Impor service menggunakan require
// const blastService = require('../services/blast.service.cjs');

// /**
//  * Membuat blast baru.
//  */
// const createBlast = async (req, res, next) => {
//     try {
//         const { title, message, whatsappSenderId, targetGroupIds, scheduledAt } = req.body;
//         const attachmentFile = req.file;

//         if (!title || !message || !whatsappSenderId || !targetGroupIds) {
//         return res.status(400).json({ message: 'Title, message, sender, and target groups are required.' });
//         }

//         let parsedGroupIds;
//         try {
//         parsedGroupIds = JSON.parse(targetGroupIds);
//         if (!Array.isArray(parsedGroupIds) || parsedGroupIds.length === 0) {
//             return res.status(400).json({ message: 'Target groups must be a non-empty array.' });
//         }
//         } catch (error) {
//         return res.status(400).json({ message: 'Invalid format for targetGroupIds. It must be a JSON array string.' });
//         }

//         const blastData = {
//         title,
//         message,
//         whatsappSenderId,
//         targetGroupIds: parsedGroupIds,
//         scheduledAt,
//         };

//         const newBlast = await blastService.createBlastAndQueueJob(blastData, attachmentFile);

//         res.status(201).json({ message: 'Blast berhasil dibuat dan dijadwalkan untuk diproses!', data: newBlast });

//     } catch (error) {
//         next(error);
//     }
// };

// // Ekspor fungsi menggunakan module.exports
// module.exports = {
//     createBlast,
// };
