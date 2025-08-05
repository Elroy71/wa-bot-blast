import React from 'react';
import StatCard from '../components/dashboard/StatCard';
import { dashboardStats, recentBlasts } from '../data/mockData';

const DashboardPage = () => (
    <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardStats.map(item => <StatCard key={item.id} item={item} />)}
        </div>
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Aktivitas Blast Terkini</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nama Blast</th>
                            <th scope="col" className="px-6 py-3">Grup</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Terkirim/Gagal</th>
                            <th scope="col" className="px-6 py-3">Tanggal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentBlasts.map(blast => (
                            <tr key={blast.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{blast.name}</td>
                                <td className="px-6 py-4">{blast.group}</td>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

export default DashboardPage;
