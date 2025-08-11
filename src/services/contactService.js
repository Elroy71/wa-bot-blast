// src/services/contactService.js
import axios from 'axios';

// [PERIKSA DENGAN TELITI] Pastikan URL ini 100% benar.
// - Protokol: http
// - Alamat: localhost
// - Port: 3000 (sesuai port backend Anda)
// - Path: /api
const API_URL = 'http://localhost:3000/api';

// [DEBUGGING] Tambahkan log ini untuk memastikan file ini diimpor dengan benar.
console.log("contactService.js sedang dimuat. API URL:", API_URL);

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Definisikan semua fungsi panggilan API di sini
export const getContacts = () => {
    // [DEBUGGING] Tambahkan log ini untuk memastikan fungsi ini dipanggil.
    console.log("Memanggil getContacts()...");
    return apiClient.get('/contacts');
};

export const createContact = (contactData) => {
    console.log("Memanggil createContact()...");
    return apiClient.post('/contacts', contactData);
};

export const updateContact = (id, contactData) => {
    console.log(`Memanggil updateContact() untuk id: ${id}...`);
    return apiClient.put(`/contacts/${id}`, contactData);
};

export const deleteContact = (id) => {
    console.log(`Memanggil deleteContact() untuk id: ${id}...`);
    return apiClient.delete(`/contacts/${id}`);
};

export const importContacts = (contactsArray) => {
    console.log("Memanggil importContacts()...");
    return apiClient.post('/contacts/import', contactsArray);
};