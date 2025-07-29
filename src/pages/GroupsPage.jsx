import React from 'react';
import { PlusCircle, Users } from 'lucide-react';

// Komponen ini sekarang menerima 'groups' dan 'handleDeleteGroup' sebagai props
const GroupsPage = ({ navigateTo, groups, handleDeleteGroup }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Daftar Grup</h2>
                <button 
                    onClick={() => navigateTo('createGroup')}
                    className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors"
                >
                    <PlusCircle size={20} className="mr-2" />
                    Buat Grup Baru
                </button>
            </div>

            {groups.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-md">
                    <p className="text-gray-500">Belum ada grup yang dibuat.</p>
                    <p className="text-gray-400 text-sm mt-2">Klik "Buat Grup Baru" untuk memulai.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Gunakan 'groups' dari props */}
                    {groups.map(group => (
                        <div key={group.id} className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
                            <div>
                                <h4 className="text-lg font-bold text-gray-800">{group.name}</h4>
                                <p className="text-sm text-gray-500 mt-1">{group.description}</p>
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
                                    {/* Panggil 'handleDeleteGroup' dari props */}
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
            )}
        </div>
    );
};

export default GroupsPage;
