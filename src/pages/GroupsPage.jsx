import React from 'react';
import { PlusCircle, Users } from 'lucide-react';
import { contactGroups } from '../data/mockData';

const GroupsPage = () => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Daftar Grup</h2>
            <button className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors">
                <PlusCircle size={20} className="mr-2" />
                Buat Grup Baru
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactGroups.map(group => (
                <div key={group.id} className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
                    <div>
                        <h4 className="text-lg font-bold text-gray-800">{group.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{group.description}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center text-sm text-gray-600">
                            <Users size={16} className="mr-2" />
                            <span>{group.members} Kontak</span>
                        </div>
                        <div className="flex space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Kelola</button>
                            <button className="text-red-600 hover:text-red-900 text-sm font-medium">Hapus</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default GroupsPage;
