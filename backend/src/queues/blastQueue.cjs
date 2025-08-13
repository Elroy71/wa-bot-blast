// // src/queues/blastQueue.js

// const { Queue } = require('bullmq');

// // Ambil URL Redis dari environment variables
// const redisConnectionUrl = process.env.REDIS_URL;

// if (!redisConnectionUrl) {
//     console.error("FATAL ERROR: REDIS_URL is not defined in .env file.");
//     process.exit(1); // Hentikan aplikasi jika URL Redis tidak ada
// }

// // Buat dan ekspor instance queue.
// // Nama 'blast-processing-queue' adalah nama antrian di Redis.
// const blastQueue = new Queue('blast-processing-queue', {
//     connection: {
//         // BullMQ dapat langsung menggunakan URL Redis
//         uri: redisConnectionUrl,
//     },
//     defaultJobOptions: {
//         attempts: 3, // Coba lagi job yang gagal sebanyak 3 kali
//         backoff: {
//         type: 'exponential',
//         delay: 5000, // Tunggu 5 detik sebelum mencoba lagi
//         },
//     },
// });

// console.log("Blast processing queue initialized.");

// module.exports = blastQueue;
