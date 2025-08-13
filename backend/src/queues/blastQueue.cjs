// src/queues/blastQueue.cjs

const { Queue } = require('bullmq');

const redisConnectionUrl = process.env.REDIS_URL;

if (!redisConnectionUrl) {
    console.error("FATAL ERROR: REDIS_URL is not defined in .env file.");
    process.exit(1);
}

const blastQueue = new Queue('blast-processing-queue', {
    connection: {
        uri: redisConnectionUrl,
    },
    defaultJobOptions: {
        attempts: 3,
        backoff: {
        type: 'exponential',
        delay: 5000,
        },
    },
});

console.log("Blast processing queue initialized.");

module.exports = blastQueue;
