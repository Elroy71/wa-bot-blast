import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Plus } from 'lucide-react';
import SearchableContactList from '../components/SearchableContactList';
import AddContactModal from '../components/AddContactModal';

// PERUBAHAN: Komponen tidak lagi menerima props 'contacts', 'handleAddGroup', 'handleAddContact'
const CreateGroupPage = ({ navigateTo }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // State baru untuk mengelola daftar kontak dari backend
    const [allContacts, setAllContacts] = useState([]);
    const [isLoadingContacts, setIsLoadingContacts] = useState(true);

    // Fungsi untuk mengambil semua kontak dari backend
    const fetchContacts = async () => {
        try {
            setIsLoadingContacts(true);
            const response = await fetch('http://localhost:3000/api/contacts');
            if (!response.ok) throw new Error('Gagal memuat kontak');
            const data = await response.json();
            setAllContacts(data);
        } catch (error) {
            alert(error.message);
        } finally {
            setIsLoadingContacts(false);
        }
    };

    // Ambil data kontak saat halaman dimuat
    useEffect(() => {
        fetchContacts();
    }, []);

    const handleContactSelect = (contactId) => {
        setSelectedMembers(prev =>
            prev.includes(contactId)
                ? prev.filter(id => id !== contactId)
                : [...prev, contactId]
        );
    };

    // Fungsi untuk menyimpan kontak baru ke backend
    const handleSaveNewContact = async (newContactData) => {
        try {
            const response = await fetch('http://localhost:3000/api/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newContactData),
            });
            if (!response.ok) throw new Error('Gagal menyimpan kontak baru');
            
            setIsModalOpen(false); // Tutup modal
            alert('Kontak baru berhasil ditambahkan!');
            await fetchContacts(); // Ambil ulang daftar kontak untuk menampilkan yang baru
        } catch (error) {
            alert(error.message);
        }
    };

    const handleSaveGroup = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("Nama grup tidak boleh kosong.");
            return;
        }

        const newGroupData = {
            name,
            description,
            members: selectedMembers,
        };

        try {
            const response = await fetch('http://localhost:3000/api/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newGroupData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menyimpan grup');
            }

            alert('Grup berhasil disimpan!');
            navigateTo('groups');
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <>
            <div>
                <div className="flex items-center mb-6">
                    <button onClick={() => navigateTo('groups')} className="p-2 rounded-full hover:bg-gray-200" aria-label="Kembali">
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-3xl font-bold text-gray-800 ml-4">Buat Grup Baru</h2>
                </div>
                
                <form onSubmit={handleSaveGroup} className="bg-white p-8 rounded-xl shadow-md space-y-6">
                    {/* Input Nama dan Deskripsi */}
                    <div>
                        <label htmlFor="group-name" className="block text-sm font-medium text-gray-700 mb-1">Nama Grup</label>
                        <input type="text" id="group-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: UKM Basket" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                        <label htmlFor="group-description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (Opsional)</label>
                        <textarea id="group-description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" placeholder="Contoh: Grup untuk koordinasi anggota UKM Basket." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"></textarea>
                    </div>

                    {/* Pemilihan Anggota */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">Pilih Anggota</label>
                            <button type="button" onClick={() => setIsModalOpen(true)} className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                <Plus size={16} className="mr-1" />
                                Tambah Kontak Baru
                            </button>
                        </div>
                        {isLoadingContacts ? (
                            <p>Memuat kontak...</p>
                        ) : (
                            <SearchableContactList 
                                contacts={allContacts}
                                selectedContactIds={selectedMembers}
                                onContactSelect={handleContactSelect}
                            />
                        )}
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
                            Simpan Grup
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

export default CreateGroupPage;