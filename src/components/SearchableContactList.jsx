import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

const SearchableContactList = ({ contacts, selectedContactIds, onContactSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Gunakan useMemo agar daftar tidak difilter ulang pada setiap render,
    // kecuali jika daftar kontak atau istilah pencarian berubah.
    const filteredContacts = useMemo(() => {
        if (!searchTerm) {
            return contacts;
        }
        return contacts.filter(contact =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.number.includes(searchTerm)
        );
    }, [contacts, searchTerm]);

    return (
        <div>
            {/* Input Pencarian */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Cari nama atau nomor kontak..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            {/* Daftar Kontak dengan Scroll */}
            <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact) => (
                        <label
                            key={contact.id}
                            className="flex items-center p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={selectedContactIds.includes(contact.id)}
                                onChange={() => onContactSelect(contact.id)}
                                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div className="ml-4">
                                <p className="font-medium text-gray-800">{contact.name}</p>
                                <p className="text-sm text-gray-500">{contact.number}</p>
                            </div>
                        </label>
                    ))
                ) : (
                    <p className="text-center text-gray-500 p-8">Kontak tidak ditemukan.</p>
                )}
            </div>
        </div>
    );
};

export default SearchableContactList;
