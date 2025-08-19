// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import StatCard from '../components/dashboard/StatCard';
import { Users, UserPlus, MessageSquare, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';

const API_URL = 'http://localhost:3000/api';

// Helper function untuk status badge
const getStatusBadge = (status) => {
    switch (status) {
        case 'COMPLETED': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Selesai</span>;
        case 'SENDING': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Mengirim</span>;
        case 'SCHEDULED': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Dijadwalkan</span>;
        case 'FAILED': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Gagal</span>;
        default: return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
};

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [recentBlasts, setRecentBlasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/dashboard`);
                if (!response.ok) {
                    throw new Error('Gagal mengambil data dashboard.');
                }
                const data = await response.json();
                setStats(data.stats);
                setRecentBlasts(data.recentBlasts);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Data untuk StatCard, sekarang menggunakan data dari state
    const dashboardStats = stats ? [
        { id: 1, title: 'Total Kontak', value: stats.totalContacts, icon: UserPlus, color: 'bg-blue-500' },
        { id: 2, title: 'Total Grup', value: stats.totalGroups, icon: Users, color: 'bg-green-500' },
        { id: 3, title: 'Sender Aktif', value: stats.activeSenders, icon: MessageSquare, color: 'bg-yellow-500' },
        { id: 4, title: 'Blast Selesai', value: stats.completedBlasts, icon: CheckCircle, color: 'bg-indigo-500' },
    ] : [];

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-8 w-8 text-indigo-600" /></div>;
    }

    if (error) {
        return <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg flex items-center justify-center"><AlertTriangle className="mr-2" /> {error}</div>;
    }

    return (
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
                                    <td className="px-6 py-4">{getStatusBadge(blast.status)}</td>
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
};

export default DashboardPage;
