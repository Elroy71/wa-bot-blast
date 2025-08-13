// src/app.js (Backend)

// 1. Menggunakan 'require' untuk semua modul
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import middleware dan rute
const errorHandler = require('./middlewares/errorHandler.cjs');
const contactRoutes = require('./routes/contactRoutes.cjs');
const groupRoutes = require('./routes/groupRoutes.cjs');
const senderRoutes = require('./routes/senderRoutes.cjs');
const aiAgentRoutes = require('./routes/aiAgentRoutes.cjs');
// const blastRoutes = require('./routes/blastRoutes.cjs'); // Rute blast kita

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware untuk menyajikan file statis dari folder 'public'
// Di CommonJS, '__dirname' sudah tersedia secara global, jadi tidak perlu trik tambahan.
app.use('/public', express.static(path.join(__dirname, '../public')));

// Rute-rute aplikasi Anda
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Blast Bot AI API!' });
});

// Gunakan semua rute
app.use('/api/contacts', contactRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/senders', senderRoutes);
app.use('/api/agents', aiAgentRoutes);
// app.use('/api/blasts', blastRoutes); // Gunakan rute blast

// Error Handler harus selalu menjadi yang TERAKHIR.
app.use(errorHandler);

// 3. Menggunakan 'module.exports'
module.exports = app;
