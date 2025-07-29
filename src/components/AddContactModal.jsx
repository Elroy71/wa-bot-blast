import React, { useState } from 'react';

const AddContactModal = ({ isOpen, onClose, onSave }) => {
    // State untuk setiap input di dalam form modal
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('Lainnya');

    if (!isOpen) {
        return null; // Jangan render apapun jika modal tidak terbuka
    }

    const resetForm = () => {
        setName('');
        setNumber('');
        setEmail('');
        setGender('Lainnya');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !number.trim()) {
            alert('Nama dan Nomor Telepon wajib diisi.');
            return;
        }
        // Kirim data kontak baru ke parent component
        onSave({ name, number, email, gender });
        resetForm();
        onClose(); // Tutup modal setelah menyimpan
    };

    const handleCancel = () => {
        resetForm();
        onClose();
    };

    return (
        // Latar belakang overlay
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            {/* Konten Modal */}
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md m-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Tambah Kontak Baru</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input type="text" id="contact-name" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                        <label htmlFor="contact-number" className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                        <input type="tel" id="contact-number" value={number} onChange={e => setNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                        <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">Email (Opsional)</label>
                        <input type="email" id="contact-email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="contact-gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select id="contact-gender" value={gender} onChange={e => setGender(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                            <option>Pria</option>
                            <option>Wanita</option>
                            <option>Lainnya</option>
                        </select>
                    </div>
                    {/* Tombol Aksi */}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={handleCancel} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                            Batal
                        </button>
                        <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
                            Simpan Kontak
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddContactModal;
