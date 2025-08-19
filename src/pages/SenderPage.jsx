// src/pages/SenderPage.jsx

import React, { useState, useMemo, useEffect, useCallback } from 'react';
// [BARU] Impor Link dari react-router-dom
import { Link } from 'react-router-dom';
import { PlusCircle, Search, BrainCircuit, Link as LinkIcon } from 'lucide-react';

// URL API backend Anda
const API_URL = 'http://localhost:3000/api';

// =======================================================
// KOMPONEN MODAL (TIDAK ADA PERUBAHAN)
// =======================================================

const AddSenderModal = ({ isOpen, onClose, onSave, newSender, setNewSender, error }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
                <h3 className="text-xl font-bold mb-4">Tambah Sender Baru</h3>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Sender</label>
                        <input type="text" id="name" value={newSender.name} onChange={(e) => setNewSender({ ...newSender, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Contoh: CS Marketing" required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                        <input type="text" id="phone" value={newSender.phone} onChange={(e) => setNewSender({ ...newSender, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Contoh: 6281234567890" required />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EditSenderModal = ({ isOpen, onClose, onSave, senderToEdit, setSenderToEdit }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
                <h3 className="text-xl font-bold mb-4">Edit Nama Sender</h3>
                <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
                    <div className="mb-4">
                        <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">Nama Sender</label>
                        <input type="text" id="edit-name" value={senderToEdit?.name || ''} onChange={(e) => setSenderToEdit({ ...senderToEdit, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                        <p className="w-full px-3 py-2 bg-gray-100 text-gray-500 border rounded-md">{senderToEdit?.phone}</p>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const QrCodeModal = ({ isOpen, onClose, onConfirm, sender }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm text-center mx-4">
                <h3 className="text-xl font-bold mb-2">Scan QR Code</h3>
                <p className="text-sm text-gray-600 mb-4">Scan untuk menghubungkan nomor <span className="font-bold">{sender?.phone}</span>.</p>
                <div className="flex justify-center bg-gray-100 p-4 rounded-lg mb-4">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${sender?.phone}`} alt="QR Code" />
                </div>
                <p className="text-xs text-gray-500 mb-4">Status akan berubah menjadi "Paired" setelah Anda mengklik tombol di bawah (simulasi).</p>
                <div className="flex justify-center space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Tutup</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-green-500 text-white rounded-md">Saya Sudah Scan</button>
                </div>
            </div>
        </div>
    );
};

// =======================================================
// KOMPONEN UTAMA HALAMAN SENDER
// =======================================================

// [PERUBAHAN] Hapus prop navigateTo
export const SenderPage = () => {
    const [senders, setSenders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    
    const [newSender, setNewSender] = useState({ name: '', phone: '' });
    const [currentSender, setCurrentSender] = useState(null);
    const [senderToEdit, setSenderToEdit] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState('');

    const fetchSenders = useCallback(async () => {
        setError(null);
        try {
            const response = await fetch(`${API_URL}/senders`);
            if (!response.ok) throw new Error('Gagal memuat data sender dari server.');
            const data = await response.json();
            setSenders(data);
        } catch (err) {
            setError(err.message);
            console.error("Gagal memuat sender:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        fetchSenders();

        const handleFocus = () => {
            fetchSenders();
        };
        window.addEventListener('focus', handleFocus);
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [fetchSenders]);

    const filteredSenders = useMemo(() => {
        if (!searchTerm) return senders;
        return senders.filter(sender =>
            sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sender.phone.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, senders]);

    const handleAddSender = async () => {
        setError(null);
        try {
            const response = await fetch(`${API_URL}/senders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSender)
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Gagal menambah sender.');
            }
            closeAddModal();
            fetchSenders();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateSenderName = async () => {
        if (!senderToEdit) return;
        try {
            await fetch(`${API_URL}/senders/${senderToEdit.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: senderToEdit.name })
            });
            closeEditModal();
            fetchSenders();
        } catch (err) {
            alert(`Gagal memperbarui: ${err.message}`);
        }
    };
    
    const handleDeleteSender = async (senderId) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus sender ini?")) {
            try {
                await fetch(`${API_URL}/senders/${senderId}`, { method: 'DELETE' });
                fetchSenders();
            } catch (err) {
                alert(`Gagal menghapus: ${err.message}`);
            }
        }
    };

    const updateStatus = async (senderId, newStatus) => {
        try {
            await fetch(`${API_URL}/senders/${senderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            fetchSenders();
        } catch (err) {
            alert(`Gagal mengubah status: ${err.message}`);
        }
    };

    const handleLogout = (senderId) => {
        if (window.confirm("Anda yakin ingin logout? Status WA akan menjadi 'Unpaired'.")) {
            updateStatus(senderId, 'unpaired');
        }
    };

    const handleGenerateQr = (sender) => {
        setCurrentSender(sender);
        setIsQrModalOpen(true);
    };

    const handleConfirmScan = () => {
        if (!currentSender) return;
        closeQrModal();
        updateStatus(currentSender.id, 'paired');
    };

    const openAddModal = () => { setError(null); setIsAddModalOpen(true); };
    const closeAddModal = () => { setIsAddModalOpen(false); setNewSender({ name: '', phone: '' }); };
    const openEditModal = (sender) => { setSenderToEdit(sender); setIsEditModalOpen(true); };
    const closeEditModal = () => setIsEditModalOpen(false);
    const closeQrModal = () => setIsQrModalOpen(false);

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                <h2 className="text-3xl font-bold text-gray-800">Daftar Sender</h2>
                <div className="flex items-center space-x-3">
                    {/* [PERBAIKAN] Mengganti button dengan Link */}
                    <Link to="/ai-agents" className="flex items-center bg-yellow-400 text-gray-800 font-semibold px-4 py-2 rounded-md shadow hover:bg-yellow-500">
                        <BrainCircuit size={20} className="mr-2" />
                        <span>AI Agent</span>
                    </Link>
                    {/* Tombol ini membuka modal, jadi tetap <button> */}
                    <button onClick={openAddModal} className="flex items-center bg-blue-500 text-white font-semibold px-4 py-2 rounded-md shadow hover:bg-blue-600">
                        <PlusCircle size={20} className="mr-2" />
                        <span>Tambah Sender</span>
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <div className="relative"><div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Search size={20} className="text-gray-400" /></div><input type="text" placeholder="Cari berdasarkan nama atau nomor telepon..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm" /></div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">No</th>
                            <th className="px-6 py-3">Nama</th>
                            <th className="px-6 py-3">Nomor Telepon</th>
                            <th className="px-6 py-3">Status WA</th>
                            <th className="px-6 py-3">AI Agent</th>
                            <th className="px-6 py-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="6" className="text-center py-10">Memuat data...</td></tr>
                        ) : error ? (
                            <tr><td colSpan="6" className="text-center py-10 text-red-500">{error}</td></tr>
                        ) : filteredSenders.length > 0 ? (
                            filteredSenders.map((sender, index) => (
                                <tr key={sender.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{index + 1}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{sender.name}</td>
                                    <td className="px-6 py-4">{sender.phone}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sender.status === 'paired' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            <span className={`w-2 h-2 mr-1.5 rounded-full ${sender.status === 'paired' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            {sender.status === 'paired' ? 'Paired' : 'Unpaired'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {sender.aiAgent ? (
                                            // [PERBAIKAN] Mengganti button dengan Link
                                            <Link
                                                to={`/ai-agents/edit/${sender.aiAgent.id}`}
                                                className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-900 focus:outline-none"
                                                title={`Klik untuk mengedit ${sender.aiAgent.name}`}
                                            >
                                                <BrainCircuit size={16} />
                                                <span>{sender.aiAgent.name}</span>
                                            </Link>
                                        ) : (
                                            // [PERBAIKAN] Mengganti button dengan Link
                                            <Link
                                                to="/ai-agents"
                                                className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
                                            >
                                                <LinkIcon size={14} />
                                                Hubungkan
                                            </Link>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => openEditModal(sender)} className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded-md hover:bg-green-600">Edit</button>
                                            <button onClick={() => handleDeleteSender(sender.id)} className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600">Hapus</button>
                                            {sender.status === 'paired' ? (
                                                <button onClick={() => handleLogout(sender.id)} className="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">Logout</button>
                                            ) : (
                                                <button onClick={() => handleGenerateQr(sender)} className="px-3 py-1 text-xs font-medium text-white bg-purple-500 rounded-md hover:bg-purple-600">Generate QR</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className="text-center py-10"><p className="text-gray-500 font-semibold">Tidak ada sender ditemukan.</p></td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <AddSenderModal isOpen={isAddModalOpen} onClose={closeAddModal} onSave={handleAddSender} newSender={newSender} setNewSender={setNewSender} error={error} />
            <EditSenderModal isOpen={isEditModalOpen} onClose={closeEditModal} onSave={handleUpdateSenderName} senderToEdit={senderToEdit} setSenderToEdit={setSenderToEdit} />
            <QrCodeModal isOpen={isQrModalOpen} onClose={closeQrModal} onConfirm={handleConfirmScan} sender={currentSender} />
        </div>
    );
};
