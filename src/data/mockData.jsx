// Mensimulasikan data yang akan Anda dapatkan dari API/backend Anda
import { Users, Group, MessageSquareText } from 'lucide-react';

export const dashboardStats = [
    { id: 1, label: 'Total Kontak', value: '1,450', icon: Users, color: 'text-blue-500' },
    { id: 2, label: 'Total Grup', value: '82', icon: Group, color: 'text-green-500' },
    { id: 3, label: 'Pesan Terkirim (Bulan Ini)', value: '12,890', icon: MessageSquareText, color: 'text-indigo-500' },
    { id: 4, label: 'Pesan Gagal', value: '112', icon: MessageSquareText, color: 'text-red-500' },
];

export const recentBlasts = [
    { id: 1, name: 'Promo Kemerdekaan', group: 'UKM Basket', sender: '+6281234567890', status: 'Selesai', sent: 150, failed: 2, date: '2024-08-17' },
    { id: 2, name: 'Info Latihan Rutin', group: 'UKM Bola', sender: '+6281234567891', status: 'Selesai', sent: 88, failed: 0, date: '2024-08-16' },
    { id: 3, name: 'Update Jadwal', group: 'Semua Kontak', sender: '+6281234567890', status: 'Mengirim', sent: 750, failed: 12, date: '2024-08-18' },
    { id: 4, name: 'Ucapan Selamat Pagi', group: 'Tim Internal', sender: '+6281234567892', status: 'Terjadwal', sent: 0, failed: 0, date: '2024-08-19' },
];

// Struktur data diperbarui untuk mendukung fitur baru
export const mockData = {
    senders: [
        { id: 1, name: 'CS Utama', phone: '+6281234567890', aiAgentId: 1, status: 'Aktif' },
        { id: 2, name: 'Marketing', phone: '+6281234567891', aiAgentId: 2, status: 'Aktif' },
        { id: 3, name: 'Support Teknis', phone: '+6281234567892', aiAgentId: null, status: 'Nonaktif' },
    ],
    aiAgents: [
        { 
            id: 1, 
            name: 'Bot Layanan Pelanggan',
            company: 'Toko Kita',
            behavior: 'Ramah, membantu, dan selalu mengarahkan ke solusi. Jangan pernah menjanjikan diskon.',
            status: 'Aktif',
            disableOnManualReply: true,
            canReadMessages: true,
            knowledgeBases: [
                { id: 'k1', title: 'Info Produk A', content: 'Produk A adalah produk unggulan kami...', photo: null, video: null, link: 'https://tokokita.com/produk-a' },
                { id: 'k2', title: 'Jam Operasional', content: 'Jam operasional kami adalah Senin-Jumat, 09:00 - 17:00 WIB.', photo: null, video: null, link: null },
            ]
        },
        { id: 2, name: 'Bot Promosi', company: 'Toko Kita', behavior: 'Antusias dan proaktif menawarkan promo.', status: 'Aktif', disableOnManualReply: false, canReadMessages: false, knowledgeBases: [] },
    ],
    // Data lain (contacts, groups, blasts) bisa ditambahkan di sini
};

export const contacts = [
    { id: 1, name: 'Ahmad Subarjo', phone: '+6285712345678', group: 'UKM Bola', added: 'Manual' },
    { id: 2, name: 'Citra Lestari', phone: '+6281987654321', group: 'UKM Basket', added: 'Excel' },
    { id: 3, name: 'Budi Santoso', phone: '+6287711223344', group: 'Tim Internal', added: 'Google Sheet' },
    { id: 4, name: 'Dewi Anggraini', phone: '+6282155667788', group: 'UKM Basket', added: 'Manual' },
];

// Data Kontak Awal (15 data)
export const allContacts = [
    { id: 1, name: 'Andi Nugroho', phone: '081234567890', email: 'andi.n@example.com', gender: 'Pria' },
    { id: 2, name: 'Siti Aminah', phone: '082345678901', email: 'siti.a@example.com', gender: 'Wanita' },
    { id: 3, name: 'Budi Santoso', phone: '083456789012', email: 'budi.s@example.com', gender: 'Pria' },
    { id: 4, name: 'Dewi Lestari', phone: '084567890123', email: 'dewi.l@example.com', gender: 'Wanita' },
    { id: 5, name: 'Eko Prasetyo', phone: '085678901234', email: 'eko.p@example.com', gender: 'Pria' },
    { id: 6, name: 'Fitriani', phone: '086789012345', email: 'fitri@example.com', gender: 'Wanita' },
    { id: 7, name: 'Gilang Ramadhan', phone: '087890123456', email: 'gilang.r@example.com', gender: 'Pria' },
    { id: 8, name: 'Hana Yulita', phone: '088901234567', email: 'hana.y@example.com', gender: 'Wanita' },
    { id: 9, name: 'Irfan Hakim', phone: '089012345678', email: 'irfan.h@example.com', gender: 'Pria' },
    { id: 10, name: 'Jasmine Putri', phone: '081122334455', email: 'jasmine.p@example.com', gender: 'Wanita' },
    { id: 11, name: 'Kurniawan', phone: '082233445566', email: 'kurniawan@example.com', gender: 'Pria' },
    { id: 12, name: 'Lia Amelia', phone: '083344556677', email: 'lia.a@example.com', gender: 'Wanita' },
    { id: 13, name: 'Morgan Oey', phone: '084455667788', email: 'morgan.o@example.com', gender: 'Pria' },
    { id: 14, name: 'Nadia Zuhra', phone: '085566778899', email: 'nadia.z@example.com', gender: 'Wanita' },
    { id: 15, name: 'Omar Daniel', phone: '086677889900', email: 'omar.d@example.com', gender: 'Pria' },
];

/**
 * Daftar grup kontak.
 * Properti 'members' sekarang berisi array dari ID kontak,
 * bukan lagi hanya angka.
 */
// Saya hanya akan menampilkan bagian contactGroups yang diperbaiki.
// Sisa dari file Anda bisa tetap sama.

export const contactGroups = [
    {
        id: 'group-1',
        name: 'UKM Basket',
        description: 'Grup untuk koordinasi anggota UKM Basket.',
        members: ['contact-1', 'contact-3', 'contact-5', 'contact-7', 'contact-9'],
    },
    {
        id: 'group-2',
        name: 'UKM Bola',
        description: 'Grup untuk semua informasi seputar UKM Bola.',
        members: ['contact-2', 'contact-4', 'contact-6', 'contact-8', 'contact-10'],
    },
    {
        id: 'group-3',
        name: 'Panitia Acara 17an',
        description: 'Koordinasi panitia untuk acara kemerdekaan.',
        members: ['contact-1', 'contact-2', 'contact-3', 'contact-4', 'contact-5', 'contact-6'],
    },
    {
        id: 'group-4',
        name: 'Keluarga Besar',
        description: 'Grup keluarga untuk silaturahmi.',
        members: ['contact-1', 'contact-2', 'contact-10', 'contact-11', 'contact-14'],
    },
    {
        id: 'group-5',
        name: 'Keluarga Besar PMK',
        description: 'Grup persekutuan mahasiswa Kristen.',
        members: ['contact-1', 'contact-5', 'contact-11', 'contact-12'],
    },
    {
        id: 'group-6',
        name: 'Keluarga Besar KMK',
        description: 'Grup keluarga mahasiswa Katolik.',
        members: ['contact-2', 'contact-6', 'contact-13', 'contact-14'],
    },
    {
        id: 'group-7',
        name: 'Tim Proyek "Andromeda"',
        description: 'Grup khusus untuk pengembangan proyek internal.',
        members: ['contact-3', 'contact-4', 'contact-7', 'contact-8'],
    },
    {
        id: 'group-8',
        name: 'Alumni Angkatan 2020',
        description: 'Wadah komunikasi untuk alumni.',
        members: ['contact-9', 'contact-10', 'contact-15'],
    },
];

// ... (sisa data di file mockData.jsx Anda)
