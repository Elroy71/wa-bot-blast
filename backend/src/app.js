// src/app.js (Backend)

const express = require('express');
const app = express();
const cors = require('cors'); // Pastikan ini diimpor

const contactRoutes = require('./routes/contactRoutes');
const groupRoutes = require('./routes/groupRoutes');


const errorHandler = require('./middlewares/errorHandler');


// 1. Middleware CORS harus dipanggil PERTAMA.
//    Ini untuk menangani permintaan preflight OPTIONS dari browser.
app.use(cors());

// 2. Middleware untuk membaca body JSON.
//    Ini harus dipanggil SETELAH cors.
app.use(express.json());


//  Rute-rute aplikasi Anda
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Blast Bot AI API!' });
});

app.use('/api/contacts', contactRoutes);
app.use('/api/groups', groupRoutes);

//  Error Handler harus selalu menjadi yang TERAKHIR.
app.use(errorHandler);

module.exports = app;