import React, { useState, useMemo } from 'react';
import { PlusCircle, Users, Search } from 'lucide-react';

// Komponen ini menerima props dari App.jsx untuk menjaga state terpusat
const GroupsPage = ({ navigateTo, groups, handleDeleteGroup }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Logika untuk memfilter grup berdasarkan nama.
    // useMemo memastikan ini hanya berjalan saat data atau search term berubah.
    const filteredGroups = useMemo(() => {
        if (!searchTerm) {
            return groups;
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        return groups.filter(group =>
            group.name.toLowerCase().includes(lowercasedTerm)
        );
    }, [groups, searchTerm]);

    return (
        <div>
            {/* --- BAGIAN HEADER --- */}
            {/* Menggunakan flex-col di mobile dan flex-row di desktop */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-gray-800">
                    Daftar Grup
                </h2>
                <button 
                    onClick={() => navigateTo('createGroup')}
                    className="flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors w-full md:w-auto"
                >
                    <PlusCircle size={20} className="mr-2" />
                    <span>Tambah Group</span>
                </button>
            </div>

            {/* --- Bar Pencarian di Baris Terpisah --- */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama grup..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {/* --- KONTEN UTAMA (GRID KARTU) --- */}
            {filteredGroups.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGroups.map(group => (
                        <div key={group.id} className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
                            <div>
                                <h4 className="text-lg font-bold text-gray-800 truncate">{group.name}</h4>
                                <p className="text-sm text-gray-500 mt-1 h-10">{group.description}</p>
                            </div>
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Users size={16} className="mr-2" />
                                    <span>{group.members.length} Kontak</span>
                                </div>
                                <div className="flex space-x-4">
                                    <button 
                                        onClick={() => navigateTo('editGroup', { groupId: group.id })}
                                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                    >
                                        Kelola
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteGroup(group.id)}
                                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-md">
                    <p className="text-gray-500">Grup tidak ditemukan.</p>
                    {searchTerm && <p className="text-gray-400 text-sm mt-2">Coba kata kunci lain atau kosongkan pencarian.</p>}
                    {!searchTerm && <p className="text-gray-400 text-sm mt-2">Belum ada grup yang dibuat.</p>}
                </div>
            )}
        </div>
    );
};

export default GroupsPage;
