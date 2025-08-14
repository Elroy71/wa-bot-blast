// src/pages/BlastPage.jsx

import React, { useState, useEffect } from 'react';
import { PlusCircle, Eye, Trash2, Loader2, AlertTriangle } from 'lucide-react';

// URL base API Anda
const API_URL = 'http://localhost:3000/api';

// Helper function untuk status badge agar lebih rapi
const getStatusBadge = (status) => {
    switch (status) {
        case 'COMPLETED':
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Selesai</span>;
        case 'SENDING':
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Mengirim</span>;
        case 'SCHEDULED':
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Dijadwalkan</span>;
        case 'FAILED':
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Gagal</span>;
        default:
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
};

const BlastPage = ({ navigateTo }) => {
    // State untuk data, loading, dan error
    const [blasts, setBlasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fungsi untuk mengambil data dari backend
    const fetchBlasts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/blasts`);
            if (!response.ok) {
                throw new Error('Gagal mengambil data dari server.');
            }
            const data = await response.json();
            setBlasts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // useEffect untuk memanggil fetchBlasts saat komponen pertama kali dimuat
    useEffect(() => {
        fetchBlasts();
    }, []);

    // Fungsi untuk menangani penghapusan blast
    const handleDeleteBlast = async (blastId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus blast ini?')) {
            try {
                const response = await fetch(`${API_URL}/blasts/${blastId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Gagal menghapus blast.');
                }
                // Hapus blast dari state untuk memperbarui UI secara instan
                setBlasts(blasts.filter(b => b.id !== blastId));
            } catch (err) {
                alert(err.message); // Tampilkan error jika gagal
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-8 w-8 text-indigo-600" /></div>;
    }

    if (error) {
        return <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg flex items-center justify-center"><AlertTriangle className="mr-2" /> {error}</div>;
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-gray-800">Daftar Blast</h2>
                <button 
                    onClick={() => navigateTo('createBlast')}
                    className="flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors w-full md:w-auto"
                >
                    <PlusCircle size={20} className="mr-2" />
                    <span>Tambah Blast</span>
                </button>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nama Blast</th>
                                <th scope="col" className="px-6 py-3">Grup Target</th>
                                <th scope="col" className="px-6 py-3">Sender</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Terkirim/Gagal</th>
                                <th scope="col" className="px-6 py-3">Tanggal</th>
                                <th scope="col" className="px-6 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blasts.map(blast => (
                                <tr key={blast.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{blast.name}</td>
                                    <td className="px-6 py-4">{blast.group}</td>
                                    <td className="px-6 py-4">{blast.sender}</td>
                                    <td className="px-6 py-4">{getStatusBadge(blast.status)}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-green-600">{blast.sent}</span> / <span className="text-red-600">{blast.failed}</span>
                                    </td>
                                    <td className="px-6 py-4">{blast.date}</td>
                                    <td className="px-6 py-4 flex items-center space-x-4">
                                        <button 
                                            onClick={() => navigateTo('blastDetail', { blastId: blast.id })} 
                                            className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors text-xs"
                                        >
                                            <Eye size={14} className="mr-1"/> Detail
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteBlast(blast.id)}
                                            className="flex items-center bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-xs"
                                        >
                                            <Trash2 size={14} className="mr-1"/> Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BlastPage;
