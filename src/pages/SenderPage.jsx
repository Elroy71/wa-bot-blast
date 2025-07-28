import React from 'react';
import { PlusCircle, Search, BrainCircuit } from 'lucide-react';
import { mockData } from '../data/mockData';

export const SenderPage = ({ navigateTo }) => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Daftar Sender</h2>
            <div className="flex items-center space-x-3">
                <div className="relative">
                    <input type="text" placeholder="Cari..." className="bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <button onClick={() => navigateTo('aiAgentsList')} className="flex items-center bg-yellow-400 text-gray-800 font-semibold px-4 py-2 rounded-md shadow hover:bg-yellow-500 transition-colors">
                    <BrainCircuit size={20} className="mr-2" />
                    AI Agent
                </button>
                <button onClick={() => navigateTo('addSender')} className="flex items-center bg-blue-500 text-white font-semibold px-4 py-2 rounded-md shadow hover:bg-blue-600 transition-colors">
                    <PlusCircle size={20} className="mr-2" />
                    Tambah Sender
                </button>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
             <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th className="px-6 py-3">No</th>
                        <th className="px-6 py-3">Nama</th>
                        <th className="px-6 py-3">Nomor Telepon</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {mockData.senders.map((sender, index) => (
                        <tr key={sender.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4">{index + 1}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{sender.name}</td>
                            <td className="px-6 py-4">{sender.phone}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sender.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    <span className={`w-2 h-2 mr-1.5 rounded-full ${sender.status === 'Aktif' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    {sender.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                    <button className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded-md hover:bg-green-600">Edit</button>
                                    <button className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600">Hapus</button>
                                    <button className="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">Logout</button>
                                    <button 
                                        onClick={() => navigateTo('aiAgentEditor', { senderId: sender.id })} 
                                        className="px-3 py-1 text-xs font-medium text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
                                    >
                                        AI Agent
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default SenderPage;