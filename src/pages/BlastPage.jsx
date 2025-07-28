import React from 'react';
import { PlusCircle } from 'lucide-react';
import { recentBlasts } from '../data/mockData';

const BlastPage = () => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Daftar Blast</h2>
            <button className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors">
                <PlusCircle size={20} className="mr-2" />
                Buat Blast Baru
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
                        {recentBlasts.map(blast => (
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
                                <td className="px-6 py-4">
                                    <button className="text-indigo-600 hover:text-indigo-900">Detail</button>
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