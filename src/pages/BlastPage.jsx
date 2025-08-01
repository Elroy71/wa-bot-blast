import React from 'react';
import { PlusCircle, Eye, Trash2 } from 'lucide-react';

// 1. Komponen sekarang menerima props dari App.jsx
const BlastPage = ({ blasts, navigateTo, handleDeleteBlast }) => (
    <div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold text-gray-800">
                Daftar Blast
            </h2>
            {/* 2. Tombol ini sekarang berfungsi untuk navigasi */}
            <button 
                onClick={() => navigateTo('createBlast')}
                className="flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors w-full md:w-auto"
            >
                <PlusCircle size={20} className="mr-2" />
                <span>Tambah Blast</span>
            </button>
        </div>
        {/* 3. Tabel Blast */}
        {/* Menggunakan grid untuk responsif */}
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
                        {/* 3. Mapping data dari props 'blasts', bukan dari mockData lagi */}
                        {blasts.map(blast => (
                            <tr key={blast.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{blast.name}</td>
                                <td className="px-6 py-4">{blast.group}</td>
                                <td className="px-6 py-4">{blast.sender}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        blast.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                                        blast.status === 'Mengirim' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-blue-100 text-blue-800'
                                    }`}>
                                        {blast.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-green-600">{blast.sent}</span> / <span className="text-red-600">{blast.failed}</span>
                                </td>
                                <td className="px-6 py-4">{blast.date}</td>
                                {/* 4. Tombol Aksi (Detail & Hapus) sekarang berfungsi */}
                                <td className="px-6 py-4 flex items-center space-x-4">
                                    <button 
                                        onClick={() => navigateTo('blastDetail', { blastId: blast.id })} 
                                        className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors text-xs"
                                    >
                                        <Eye size={14} className="mr-1"/>
                                        Detail
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteBlast(blast.id)}
                                        className="flex items-center bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-xs"
                                    >
                                        <Trash2 size={14} className="mr-1"/>
                                        Hapus
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

export default BlastPage;