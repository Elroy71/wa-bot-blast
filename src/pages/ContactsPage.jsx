import React from 'react';
import { UserPlus, FileUp, Link as LinkIcon } from 'lucide-react';
import { contacts } from '../data/mockData';

const ContactsPage = () => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Daftar Kontak</h2>
            <div className="flex space-x-2">
                <button className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                    <UserPlus size={20} className="mr-2" />
                    Tambah Manual
                </button>
                 <button className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition-colors">
                    <FileUp size={20} className="mr-2" />
                    Import Excel
                </button>
                 <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors">
                    <LinkIcon size={20} className="mr-2" />
                    Import G-Sheet
                </button>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Nama</th>
                        <th scope="col" className="px-6 py-3">Nomor Telepon</th>
                        <th scope="col" className="px-6 py-3">Grup</th>
                        <th scope="col" className="px-6 py-3">Ditambahkan Via</th>
                        <th scope="col" className="px-6 py-3">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map(contact => (
                        <tr key={contact.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{contact.name}</td>
                            <td className="px-6 py-4">{contact.phone}</td>
                            <td className="px-6 py-4"><span className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">{contact.group}</span></td>
                            <td className="px-6 py-4">{contact.added}</td>
                            <td className="px-6 py-4 flex space-x-2">
                                <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                <button className="text-red-600 hover:text-red-900">Hapus</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default ContactsPage;
