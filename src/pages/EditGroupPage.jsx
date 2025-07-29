import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Plus } from 'lucide-react';
import SearchableContactList from '../components/SearchableContactList';
import AddContactModal from '../components/AddContactModal';

const EditGroupPage = ({ navigateTo, params, groups, contacts, handleUpdateGroup, handleAddContact }) => {
    const { groupId } = params;

    // State lokal untuk form, agar tidak langsung mengubah data utama
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // useEffect untuk mengisi form saat komponen pertama kali dimuat
    useEffect(() => {
        const groupToEdit = groups.find(g => g.id === groupId);
        if (groupToEdit) {
            setName(groupToEdit.name);
            setDescription(groupToEdit.description);
            setSelectedMembers(groupToEdit.members);
            setIsLoading(false);
        } else {
            // Jika grup tidak ditemukan (misal: URL salah), kembali ke daftar grup
            alert('Grup tidak ditemukan.');
            navigateTo('groups');
        }
    }, [groupId, groups, navigateTo]);

    const handleContactSelect = (contactId) => {
        setSelectedMembers(prev =>
            prev.includes(contactId)
                ? prev.filter(id => id !== contactId)
                : [...prev, contactId]
        );
    };

    const handleSaveNewContact = (newContactData) => {
        const newContact = handleAddContact(newContactData);
        setSelectedMembers(prev => [...prev, newContact.id]);
        setIsModalOpen(false);
    };

    const handleSaveChanges = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("Nama grup tidak boleh kosong.");
            return;
        }
        const updatedData = { name, description, members: selectedMembers };
        handleUpdateGroup(groupId, updatedData); // Panggil fungsi update dari App.jsx
        navigateTo('groups');
    };

    // Tampilkan pesan loading selagi data dicari
    if (isLoading) {
        return <div className="text-center p-10">Memuat data grup...</div>;
    }

    return (
        <>
            <div>
                <div className="flex items-center mb-6">
                    <button onClick={() => navigateTo('groups')} className="p-2 rounded-full hover:bg-gray-200" aria-label="Kembali">
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-3xl font-bold text-gray-800 ml-4">Kelola Grup</h2>
                </div>
                
                <form onSubmit={handleSaveChanges} className="bg-white p-8 rounded-xl shadow-md space-y-6">
                    {/* Input Nama dan Deskripsi */}
                    <div>
                        <label htmlFor="group-name" className="block text-sm font-medium text-gray-700 mb-1">Nama Grup</label>
                        <input type="text" id="group-name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                        <label htmlFor="group-description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (Opsional)</label>
                        <textarea id="group-description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"></textarea>
                    </div>

                    {/* Pemilihan Anggota */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">Anggota Grup</label>
                            <button type="button" onClick={() => setIsModalOpen(true)} className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                <Plus size={16} className="mr-1" />
                                Tambah Kontak Baru
                            </button>
                        </div>
                        <SearchableContactList 
                            contacts={contacts}
                            selectedContactIds={selectedMembers}
                            onContactSelect={handleContactSelect}
                        />
                        <div className="flex items-center text-sm text-gray-600 mt-2">
                            <Users size={16} className="mr-2" />
                            <span>{selectedMembers.length} kontak terpilih</span>
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                        <button type="button" onClick={() => navigateTo('groups')} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                            Batal
                        </button>
                        <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>

            <AddContactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveNewContact}
            />
        </>
    );
};

export default EditGroupPage;
