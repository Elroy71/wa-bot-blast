import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Plus } from 'lucide-react';
import SearchableContactList from '../components/SearchableContactList';
import AddContactModal from '../components/AddContactModal';

// PERUBAHAN: Komponen tidak lagi menerima props dari App.jsx
const EditGroupPage = ({ navigateTo, params }) => {
    const { groupId } = params;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // State untuk data dan loading
    const [allContacts, setAllContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect untuk mengambil data detail grup DAN semua kontak secara bersamaan
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Mengambil data grup dan data kontak secara paralel
                const [groupResponse, contactsResponse] = await Promise.all([
                    fetch(`http://localhost:3000/api/groups/${groupId}`),
                    fetch('http://localhost:3000/api/contacts')
                ]);

                if (!groupResponse.ok) throw new Error('Grup tidak ditemukan atau gagal dimuat.');
                if (!contactsResponse.ok) throw new Error('Gagal memuat daftar kontak.');

                const groupData = await groupResponse.json();
                const contactsData = await contactsResponse.json();

                // Mengisi form dengan data dari backend
                setName(groupData.name);
                setDescription(groupData.description);
                setSelectedMembers(groupData.members); // Backend mengirim array ID anggota
                setAllContacts(contactsData);

            } catch (err) {
                setError(err.message);
                alert(err.message);
                navigateTo('groups');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [groupId, navigateTo]);

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
            
            const newContact = await response.json();
            setIsModalOpen(false);
            alert('Kontak baru berhasil ditambahkan!');
            // Ambil ulang daftar kontak untuk menampilkan yang baru
            setAllContacts(prev => [...prev, newContact.data]);
        } catch (error) {
            alert(error.message);
        }
    };
    
    // Fungsi untuk menyimpan perubahan
    const handleSaveChanges = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("Nama grup tidak boleh kosong.");
            return;
        }

        const updatedData = { name, description, members: selectedMembers };

        try {
            const response = await fetch(`http://localhost:3000/api/groups/${groupId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) throw new Error('Gagal memperbarui grup');

            alert('Perubahan berhasil disimpan!');
            navigateTo('groups');
        } catch (err) {
            alert(err.message);
        }
    };

    if (isLoading) {
        return <div className="text-center p-10">Memuat data grup...</div>;
    }
    
    if (error) {
        return <div className="text-center p-10 text-red-600">Error: {error}</div>;
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
                    {/* ... (bagian form lainnya sama persis) ... */}
                     <div>
                        <label htmlFor="group-name" className="block text-sm font-medium text-gray-700 mb-1">Nama Grup</label>
                        <input type="text" id="group-name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                        <label htmlFor="group-description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (Opsional)</label>
                        <textarea id="group-description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"></textarea>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">Anggota Grup</label>
                            <button type="button" onClick={() => setIsModalOpen(true)} className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                <Plus size={16} className="mr-1" />
                                Tambah Kontak Baru
                            </button>
                        </div>
                        <SearchableContactList 
                            contacts={allContacts}
                            selectedContactIds={selectedMembers}
                            onContactSelect={handleContactSelect}
                        />
                        <div className="flex items-center text-sm text-gray-600 mt-2">
                            <Users size={16} className="mr-2" />
                            <span>{selectedMembers.length} kontak terpilih</span>
                        </div>
                    </div>

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