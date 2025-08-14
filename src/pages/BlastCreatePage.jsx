// src/pages/CreateBlastPage.jsx

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, UploadCloud, FileText, X, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:3000/api';

const BlastCreatePage = ({ navigateTo }) => {
    // State untuk form
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetGroupIds, setTargetGroupIds] = useState([]); // Sekarang bisa array
    const [senderId, setSenderId] = useState('');
    const [file, setFile] = useState(null);
    
    // State untuk data dropdown, loading, dan error
    const [availableSenders, setAvailableSenders] = useState([]);
    const [availableGroups, setAvailableGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const fileInputRef = useRef(null);

    // Fetch data untuk dropdown saat komponen dimuat
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                // Ambil data sender
                const sendersRes = await fetch(`${API_URL}/senders`);
                const sendersData = await sendersRes.json();
                setAvailableSenders(sendersData);

                // Ambil data grup
                const groupsRes = await fetch(`${API_URL}/groups`);
                const groupsData = await groupsRes.json();
                setAvailableGroups(groupsData);

            } catch (err) {
                setError(`Gagal memuat data: ${err.message}`);
            }
        };
        fetchDropdownData();
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 30 * 1024 * 1024) {
                setError('Ukuran file maksimal adalah 30 MB.');
                setFile(null);
                if(fileInputRef.current) fileInputRef.current.value = "";
            } else {
                setFile(selectedFile);
                setError('');
            }
        }
    };
    
    const handleRemoveFile = () => {
        setFile(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !message || targetGroupIds.length === 0 || !senderId) {
            setError('Semua field wajib diisi, kecuali file lampiran.');
            return;
        }

        setLoading(true);
        setError('');

        // Gunakan FormData untuk mengirim file dan teks bersamaan
        const formData = new FormData();
        formData.append('title', title);
        formData.append('message', message);
        formData.append('whatsappSenderId', senderId);
        // Kirim array ID grup sebagai string JSON
        formData.append('targetGroupIds', JSON.stringify(targetGroupIds)); 
        if (file) {
            formData.append('attachment', file);
        }

        try {
            const response = await fetch(`${API_URL}/blasts`, {
                method: 'POST',
                body: formData, // Tidak perlu header Content-Type, browser akan set otomatis
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Gagal membuat blast.');
            }

            alert('Blast berhasil dibuat dan dijadwalkan!');
            navigateTo('blasts'); // Kembali ke halaman daftar

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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
                        <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Judul</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700" placeholder="Contoh: Promo Kemerdekaan" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="sender" className="block text-gray-700 text-sm font-bold mb-2">Pilih Sender</label>
                            <select id="sender" value={senderId} onChange={(e) => setSenderId(e.target.value)} className="shadow border rounded w-full py-3 px-4 text-gray-700">
                                <option value="" disabled>-- Pilih Nomor Pengirim --</option>
                                {availableSenders.map(sender => (
                                    <option key={sender.id} value={sender.id}>{sender.name} ({sender.phone})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="group" className="block text-gray-700 text-sm font-bold mb-2">Pilih Grup Target</label>
                            {/* Menggunakan 'multiple' untuk memilih lebih dari satu grup */}
                            <select id="group" multiple value={targetGroupIds} onChange={(e) => setTargetGroupIds(Array.from(e.target.selectedOptions, option => option.value))} className="shadow border rounded w-full py-3 px-4 text-gray-700 h-24">
                                {availableGroups.map(group => (
                                    <option key={group.id} value={group.id}>{group.name} ({group.memberCount} kontak)</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Isi Pesan</label>
                        <textarea id="message" rows="6" value={message} onChange={(e) => setMessage(e.target.value)} className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700" placeholder="Tulis pesan Anda... Gunakan {name} untuk personalisasi."></textarea>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">File Lampiran (Opsional)</label>
                        {!file ? (
                            <div onClick={() => fileInputRef.current && fileInputRef.current.click()} className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 hover:border-indigo-500 cursor-pointer">
                                <div className="text-center">
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-4 font-semibold text-indigo-600">Pilih file untuk diupload</p>
                                    <p className="text-xs text-gray-600">Format apapun hingga 30MB</p>
                                </div>
                                <input ref={fileInputRef} id="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                            </div>
                        ) : (
                            <div className="mt-2 flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                                <div className="flex items-center"><FileText className="h-6 w-6 text-indigo-600 mr-3" /> <span className="text-sm font-medium text-gray-800">{file.name}</span></div>
                                <button type="button" onClick={handleRemoveFile} className="p-1 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600"><X className="h-5 w-5" /></button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end space-x-4 mt-8">
                        <button type="button" onClick={() => navigateTo('blasts')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg">Batal</button>
                        <button type="submit" disabled={loading} className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow disabled:bg-indigo-300">
                            {loading ? <Loader2 className="animate-spin mr-2" /> : <Send size={18} className="mr-2" />}
                            {loading ? 'Menjadwalkan...' : 'Buat Jadwal Blast'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlastCreatePage;
