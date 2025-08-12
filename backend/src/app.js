// src/app.js (Backend)
const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');

// Import semua rute
const contactRoutes = require('./routes/contactRoutes');
const groupRoutes = require('./routes/groupRoutes');
const senderRoutes = require('./routes/senderRoutes');
// Pastikan nama file yang di-import sesuai (aiAgentRoutes.js)
const aiAgentRoutes = require('./routes/aiAgentRoutes');

const app = express();

// Middleware
app.use(cors());

// Mengaktifkan parsing body JSON dengan limit yang lebih besar untuk mengakomodasi data AI
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware untuk menyajikan file statis dari folder 'public'
// Ini akan dibutuhkan untuk mengakses file PDF yang di-upload
app.use('/public', express.static(path.join(__dirname, '../public')));


// Rute-rute aplikasi Anda
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Blast Bot AI API!' });
});

// Gunakan semua rute
app.use('/api/contacts', contactRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/senders', senderRoutes);

// [FIXED] Menggunakan rute untuk AI Agents dengan path yang benar
app.use('/api/agents', aiAgentRoutes);


// Error Handler harus selalu menjadi yang TERAKHIR.
app.use(errorHandler);

module.exports = app;
