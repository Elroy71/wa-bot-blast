import React, { useState, useMemo } from 'react';
import { PlusCircle, Search, BrainCircuit } from 'lucide-react';
import { mockData } from '../data/mockData';

// Komponen Modal Tambah (Tidak ada perubahan)
const AddSenderModal = ({ isOpen, onClose, onSave, newSender, setNewSender }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
                <h3 className="text-xl font-bold mb-4">Tambah Sender Baru</h3>
                <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
                    <div className="mb-4"><label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Sender</label><input type="text" id="name" value={newSender.name} onChange={(e) => setNewSender({ ...newSender, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Contoh: CS Marketing" required /></div>
                    <div className="mb-6"><label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label><input type="text" id="phone" value={newSender.phone} onChange={(e) => setNewSender({ ...newSender, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Contoh: 6281234567890" required /></div>
                    <div className="flex justify-end space-x-3"><button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Batal</button><button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Simpan</button></div>
                </form>
            </div>
        </div>
    );
};

// Komponen Modal Edit (Tidak ada perubahan)
const EditSenderModal = ({ isOpen, onClose, onSave, senderToEdit, setSenderToEdit }) => {
    if (!isOpen) return null;
    const handleNameChange = (e) => setSenderToEdit({ ...senderToEdit, name: e.target.value });
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
                <h3 className="text-xl font-bold mb-4">Edit Nama Sender</h3>
                <p className="text-sm text-gray-500 mb-4">Anda hanya dapat mengubah nama. Nomor telepon tidak dapat diubah.</p>
                <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
                    <div className="mb-4"><label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">Nama Sender</label><input type="text" id="edit-name" value={senderToEdit?.name || ''} onChange={handleNameChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required /></div>
                    <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label><p className="w-full px-3 py-2 bg-gray-100 text-gray-500 border border-gray-200 rounded-md">{senderToEdit?.phone || 'Nomor tidak tersedia'}</p></div>
                    <div className="flex justify-end space-x-3"><button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Batal</button><button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Simpan Perubahan</button></div>
                </form>
            </div>
        </div>
    );
};

// Komponen Modal QR Code (Tidak ada perubahan)
const QrCodeModal = ({ isOpen, onClose, onConfirm, sender }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm text-center mx-4">
                <h3 className="text-xl font-bold mb-2">Scan QR Code</h3>
                <p className="text-sm text-gray-600 mb-4">Scan dengan aplikasi WhatsApp di ponsel Anda untuk menghubungkan nomor <span className="font-bold">{sender?.phone}</span>.</p>
                <div className="flex justify-center items-center bg-gray-100 p-4 rounded-lg mb-4"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${sender?.phone}`} alt="QR Code" className="w-48 h-48"/></div>
                <p className="text-xs text-gray-500 mb-4">Status akan otomatis berubah menjadi "Aktif" setelah Anda mengklik tombol di bawah ini (simulasi scan berhasil).</p>
                <div className="flex justify-center space-x-3"><button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Tutup</button><button onClick={onConfirm} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Saya Sudah Scan</button></div>
            </div>
        </div>
    );
};

export const SenderPage = ({ navigateTo }) => {
    const [senders, setSenders] = useState(mockData.senders);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [newSender, setNewSender] = useState({ name: '', phone: '' });
    const [currentSender, setCurrentSender] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSenders = useMemo(() => {
        if (!searchTerm) return senders;
        return senders.filter(sender =>
            sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sender.phone.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, senders]);

    // Handlers Tambah (Tidak ada perubahan)
    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => { setIsAddModalOpen(false); setNewSender({ name: '', phone: '' }); };
    const handleAddSender = () => {
        if (!newSender.name || !newSender.phone) return;
        const senderToAdd = { id: `sender-${Date.now()}`, name: newSender.name, phone: newSender.phone, status: 'Tidak Aktif' };
        setSenders(prev => [senderToAdd, ...prev]);
        closeAddModal();
    };

    // Handlers Edit (Tidak ada perubahan)
    const openEditModal = (sender) => { setCurrentSender(sender); setIsEditModalOpen(true); };
    const closeEditModal = () => { setIsEditModalOpen(false); setCurrentSender(null); };
    const handleUpdateSender = () => {
        if (!currentSender || !currentSender.name) return;
        setSenders(prev => prev.map(s => s.id === currentSender.id ? currentSender : s));
        closeEditModal();
    };

    // Handlers Aksi (Tidak ada perubahan)
    const handleDeleteSender = (senderId) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus sender ini? Aksi ini tidak dapat dibatalkan.")) {
            setSenders(prev => prev.filter(s => s.id !== senderId));
        }
    };
    const handleLogout = (senderId) => {
        if (window.confirm("Anda yakin ingin logout dari nomor ini? Status akan menjadi tidak aktif.")) {
            setSenders(prev => prev.map(s => s.id === senderId ? { ...s, status: 'Tidak Aktif' } : s));
        }
    };
    const handleGenerateQr = (sender) => { setCurrentSender(sender); setIsQrModalOpen(true); };
    const handleConfirmScan = () => {
        if (!currentSender) return;
        setSenders(prev => prev.map(s => s.id === currentSender.id ? { ...s, status: 'Aktif' } : s));
        setIsQrModalOpen(false);
        setCurrentSender(null);
    };
    const closeQrModal = () => { setIsQrModalOpen(false); setCurrentSender(null); };

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                <h2 className="text-3xl font-bold text-gray-800">Daftar Sender</h2>
                <div className="flex items-center space-x-3">
                    <button onClick={() => navigateTo('aiAgentsList')} className="flex items-center bg-yellow-400 text-gray-800 font-semibold px-4 py-2 rounded-md shadow hover:bg-yellow-500 transition-colors">
                        <BrainCircuit size={20} className="mr-2" />
                        <span>AI Agent</span>
                    </button>
                    <button onClick={openAddModal} className="flex items-center bg-blue-500 text-white font-semibold px-4 py-2 rounded-md shadow hover:bg-blue-600 transition-colors">
                        <PlusCircle size={20} className="mr-2" />
                        <span>Tambah Sender</span>
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search size={20} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama atau nomor telepon..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr><th className="px-6 py-3">No</th><th className="px-6 py-3">Nama</th><th className="px-6 py-3">Nomor Telepon</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Aksi</th></tr>
                    </thead>
                    <tbody>
                        {filteredSenders.map((sender, index) => (
                            <tr key={sender.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{index + 1}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{sender.name}</td>
                                <td className="px-6 py-4">{sender.phone}</td>
                                <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sender.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}><span className={`w-2 h-2 mr-1.5 rounded-full ${sender.status === 'Aktif' ? 'bg-green-500' : 'bg-red-500'}`}></span>{sender.status}</span></td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => openEditModal(sender)} className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded-md hover:bg-green-600">Edit</button>
                                        <button onClick={() => handleDeleteSender(sender.id)} className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600">Hapus</button>
                                        {sender.status === 'Aktif' ? (
                                            <button onClick={() => handleLogout(sender.id)} className="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">Logout</button>
                                        ) : (
                                            <button onClick={() => handleGenerateQr(sender)} className="px-3 py-1 text-xs font-medium text-white bg-purple-500 rounded-md hover:bg-purple-600">Generate QR</button>
                                        )}
                                        {/* PERBARUAN: Mengarah ke halaman aiAgentEdit dengan membawa ID sender */}
                                        <button onClick={() => navigateTo('aiAgentEdit', { senderId: sender.id })} className="px-3 py-1 text-xs font-medium text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300">AI Agent</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <AddSenderModal isOpen={isAddModalOpen} onClose={closeAddModal} onSave={handleAddSender} newSender={newSender} setNewSender={setNewSender} />
            <EditSenderModal isOpen={isEditModalOpen} onClose={closeEditModal} onSave={handleUpdateSender} senderToEdit={currentSender} setSenderToEdit={setCurrentSender} />
            <QrCodeModal isOpen={isQrModalOpen} onClose={closeQrModal} onConfirm={handleConfirmScan} sender={currentSender} />


            
        </div>
    );
};
export default SenderPage;