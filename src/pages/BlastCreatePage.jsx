// src/pages/CreateBlastPage.jsx

import React, { useState, useRef } from 'react';
import { ArrowLeft, Send, UploadCloud, FileText, X } from 'lucide-react';

// Daftar sender kita buat statis di sini untuk sementara
const availableSenders = [
    { id: 'sender-1', name: 'Marketing WA (+62812...001)' },
    { id: 'sender-2', name: 'Support WA (+62812...002)' },
    { id: 'sender-3', name: 'Info WA (+62812...003)' },
];

const BlastCreatePage = ({ navigateTo, handleAddBlast, groups }) => {
    // --- STATE UNTUK FORM ---
    const [campaignName, setCampaignName] = useState('');
    const [message, setMessage] = useState('');
    const [targetGroupId, setTargetGroupId] = useState('');
    const [senderId, setSenderId] = useState('');
    const [error, setError] = useState('');

    // --- STATE BARU UNTUK FILE ---
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null); // Ref untuk mereset input file

    // --- HANDLER BARU UNTUK FILE CHANGE ---
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Validasi ukuran file (30 MB)
            if (selectedFile.size > 30 * 1024 * 1024) {
                setError('Ukuran file maksimal adalah 30 MB.');
                setFile(null);
                if(fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            } else {
                setFile(selectedFile);
                setError(''); // Hapus pesan error jika file valid
            }
        }
    };
    
    // --- FUNGSI UNTUK MENGHAPUS FILE TERPILIH ---
    const handleRemoveFile = () => {
        setFile(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!campaignName || !message || !targetGroupId || !senderId) {
            setError('Semua field wajib diisi, kecuali file lampiran.');
            return;
        }

        const senderName = availableSenders.find(s => s.id === senderId)?.name;

        handleAddBlast({
            name: campaignName,
            message: message,
            groupId: targetGroupId,
            sender: senderName,
            attachment: file ? file.name : null, // Kirim nama file jika ada
        });

        // Kembali ke halaman daftar blast setelah berhasil
        navigateTo('blasts');
    };

    return (
        <div>
            <div className="flex items-center mb-6">
                <button onClick={() => navigateTo('blasts')} className="p-2 rounded-full hover:bg-gray-200 mr-4">
                    <ArrowLeft size={24} className="text-gray-700" />
                </button>
                <h2 className="text-3xl font-bold text-gray-800">Buat Blast Baru</h2>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md max-w-3xl mx-auto">
                <form onSubmit={handleSubmit}>
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
                    
                    <div className="mb-6">
                        <label htmlFor="campaignName" className="block text-gray-700 text-sm font-bold mb-2">
                            Judul
                        </label>
                        <input
                            type="text"
                            id="campaignName"
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-500"
                            placeholder="Contoh: Promo Kemerdekaan"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="sender" className="block text-gray-700 text-sm font-bold mb-2">
                                Pilih Sender
                            </label>
                            <select
                                id="sender"
                                value={senderId}
                                onChange={(e) => setSenderId(e.target.value)}
                                className="shadow border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="" disabled>-- Pilih Nomor Pengirim --</option>
                                {availableSenders.map(sender => (
                                    <option key={sender.id} value={sender.id}>{sender.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="group" className="block text-gray-700 text-sm font-bold mb-2">
                                Pilih Grup Target
                            </label>
                            <select
                                id="group"
                                value={targetGroupId}
                                onChange={(e) => setTargetGroupId(e.target.value)}
                                className="shadow border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="" disabled>-- Pilih Grup Penerima --</option>
                                {groups.map(group => (
                                    <option key={group.id} value={group.id}>{group.name} ({group.count} kontak)</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
                            Isi Pesan
                        </label>
                        <textarea
                            id="message"
                            rows="6"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-500"
                            placeholder="Tulis pesan Anda di sini... Anda bisa menggunakan sapaan seperti {name} untuk menyebut nama kontak."
                        ></textarea>
                    </div>

                    {/* --- BAGIAN BARU: UPLOAD FILE --- */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            File Lampiran (Opsional)
                        </label>
                        {!file ? (
                            <div 
                                className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 hover:border-indigo-500 transition-colors cursor-pointer"
                                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                            >
                                <div className="text-center">
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                        <p className="font-semibold text-indigo-600">Pilih file untuk diupload</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600">Format apapun hingga 30MB</p>
                                </div>
                                <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                            </div>
                        ) : (
                            // Tampilan setelah file dipilih
                            <div className="mt-2 flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                                <div className="flex items-center">
                                    <FileText className="h-6 w-6 text-indigo-600 mr-3" />
                                    <span className="text-sm font-medium text-gray-800">{file.name}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="p-1 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </div>
                    {/* --- AKHIR BAGIAN BARU --- */}


                    <div className="flex items-center justify-end space-x-4 mt-8">
                        <button
                            type="button"
                            onClick={() => navigateTo('blasts')}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-colors"
                        >
                            <Send size={18} className="mr-2" />
                            Buat Jadwal Blast
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlastCreatePage;
