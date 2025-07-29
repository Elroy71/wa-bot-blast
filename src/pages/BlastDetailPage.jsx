// src/pages/BlastDetailPage.jsx

import React from 'react';
import { ArrowLeft, File, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full inline-flex items-center";
    
    if (status === 'Dibaca') {
        return <span className={`${baseClasses} bg-green-100 text-green-800`}><CheckCircle size={14} className="mr-1.5"/>Dibaca</span>;
    }
    if (status === 'Terkirim') {
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}><CheckCircle size={14} className="mr-1.5"/>Terkirim</span>;
    }
    if (status === 'Gagal') {
        return <span className={`${baseClasses} bg-red-100 text-red-800`}><XCircle size={14} className="mr-1.5"/>Gagal</span>;
    }
    return <span className={`${baseClasses} bg-gray-100 text-gray-800`}><Clock size={14} className="mr-1.5"/>{status}</span>;
};


const BlastDetailPage = ({ navigateTo, blasts, params }) => {
    const { blastId } = params;
    const blast = blasts.find(b => b.id === blastId);

    if (!blast) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-700">Blast Tidak Ditemukan</h2>
                <p className="text-gray-500 mt-2">Riwayat blast yang Anda cari tidak ada atau mungkin telah dihapus.</p>
                <button
                    onClick={() => navigateTo('blasts')}
                    className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors"
                >
                    Kembali ke Daftar Blast
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center mb-6">
                <button onClick={() => navigateTo('blasts')} className="p-2 rounded-full hover:bg-gray-200 mr-4">
                    <ArrowLeft size={24} className="text-gray-700" />
                </button>
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Detail Blast: {blast.name}</h2>
                    <p className="text-gray-500 text-sm mt-1">ID: {blast.id}</p>
                </div>
            </div>

            {/* --- KARTU RINGKASAN --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white p-5 rounded-xl shadow">
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{blast.status}</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow">
                    <h3 className="text-sm font-medium text-gray-500">Grup Target</h3>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{blast.group}</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow">
                    <h3 className="text-sm font-medium text-gray-500">Pengirim</h3>
                    <p className="mt-1 text-xl font-semibold text-gray-900 truncate">{blast.sender}</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow">
                    <h3 className="text-sm font-medium text-gray-500">Terkirim / Gagal</h3>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                        <span className="text-green-600">{blast.sent}</span> / <span className="text-red-600">{blast.failed}</span>
                    </p>
                </div>
            </div>

            {/* --- PESAN & LAMPIRAN --- */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Isi Pesan</h3>
                {/* Gunakan fallback jika pesan tidak ada */}
                <p className="text-gray-600 whitespace-pre-wrap p-4 bg-gray-50 rounded-lg">{blast.message || "Pesan tidak tersedia."}</p>
                
                {blast.attachment && (
                    <div className="mt-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">File Lampiran</h3>
                        <div className="flex items-center bg-indigo-50 text-indigo-700 p-3 rounded-lg border border-indigo-200">
                            <File size={20} className="mr-3"/>
                            <span className="font-medium">{blast.attachment}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* --- TABEL PENERIMA --- */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Laporan Pengiriman</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nama Kontak</th>
                                <th scope="col" className="px-6 py-3">Nomor Telepon</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Dikirim Pada</th>
                                <th scope="col" className="px-6 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* // <-- PERUBAHAN DI SINI: Menambahkan '|| []' sebagai fallback */}
                            {(blast.recipients || []).map((recipient, index) => (
                                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{recipient.name}</td>
                                    <td className="px-6 py-4">{recipient.phone}</td>
                                    <td className="px-6 py-4"><StatusBadge status={recipient.status} /></td>
                                    <td className="px-6 py-4">{recipient.sentAt || '-'}</td>
                                    <td className="px-6 py-4">
                                        <button className="text-red-500 hover:text-red-700 flex items-center text-xs">
                                            <Trash2 size={14} className="mr-1"/> Hapus Log
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Menampilkan pesan jika tidak ada data penerima */}
                    {(!blast.recipients || blast.recipients.length === 0) && (
                        <div className="text-center py-8 text-gray-500">
                            Tidak ada data laporan pengiriman untuk blast ini.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlastDetailPage;
