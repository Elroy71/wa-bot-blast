import React, { useState, useMemo } from 'react';
import { UserPlus, FileUp, Link as LinkIcon, Edit, Trash2, Search } from 'lucide-react';
import * as XLSX from 'xlsx';

const initialContacts = [
    { id: 1, name: 'Andi Nugroho', phone: '081234567890', email: 'andi.n@example.com', gender: 'Pria' },
    { id: 2, name: 'Siti Aminah', phone: '082345678901', email: 'siti.a@example.com', gender: 'Wanita' },
    { id: 3, name: 'Budi Santoso', phone: '083456789012', email: 'budi.s@example.com', gender: 'Pria' },
    { id: 4, name: 'Dewi Lestari', phone: '084567890123', email: 'dewi.l@example.com', gender: 'Wanita' },
    { id: 5, name: 'Eko Prasetyo', phone: '085678901234', email: 'eko.p@example.com', gender: 'Pria' },
    { id: 6, name: 'Fitriani', phone: '086789012345', email: 'fitri@example.com', gender: 'Wanita' },
    { id: 7, name: 'Gilang Ramadhan', phone: '087890123456', email: 'gilang.r@example.com', gender: 'Pria' },
    { id: 8, name: 'Hana Yulita', phone: '088901234567', email: 'hana.y@example.com', gender: 'Wanita' },
    { id: 9, name: 'Irfan Hakim', phone: '089012345678', email: 'irfan.h@example.com', gender: 'Pria' },
    { id: 10, name: 'Jasmine Putri', phone: '081122334455', email: 'jasmine.p@example.com', gender: 'Wanita' },
    { id: 11, name: 'Kurniawan', phone: '082233445566', email: 'kurniawan@example.com', gender: 'Pria' },
    { id: 12, name: 'Lia Amelia', phone: '083344556677', email: 'lia.a@example.com', gender: 'Wanita' },
    { id: 13, name: 'Morgan Oey', phone: '084455667788', email: 'morgan.o@example.com', gender: 'Pria' },
    { id: 14, name: 'Nadia Zuhra', phone: '085566778899', email: 'nadia.z@example.com', gender: 'Wanita' },
    { id: 15, name: 'Omar Daniel', phone: '086677889900', email: 'omar.d@example.com', gender: 'Pria' },
];

const ITEMS_PER_PAGE = 10;

const ContactsPage = () => {
    const [contacts, setContacts] = useState(initialContacts);
    const [isManualModalOpen, setManualModalOpen] = useState(false);
    const [isExcelModalOpen, setExcelModalOpen] = useState(false);
    const [isGSheetModalOpen, setGSheetModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', gender: 'Pria' });
    const [editingContactId, setEditingContactId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [excelFile, setExcelFile] = useState(null);

    const filteredContacts = useMemo(() => {
        if (!searchTerm) return contacts;
        const term = searchTerm.toLowerCase();
        return contacts.filter(contact =>
            contact.name.toLowerCase().includes(term) ||
            contact.phone.toLowerCase().includes(term)
        );
    }, [contacts, searchTerm]);

    const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);
    const paginatedContacts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredContacts.slice(startIndex, endIndex);
    }, [filteredContacts, currentPage]);

    const goToPage = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleAddClick = () => {
        setEditingContactId(null);
        setFormData({ name: '', phone: '', email: '', gender: 'Pria' });
        setManualModalOpen(true);
    };

    const handleEditClick = (contact) => {
        setEditingContactId(contact.id);
        setFormData({ ...contact });
        setManualModalOpen(true);
    };

    const closeModal = () => {
        setManualModalOpen(false);
        setExcelModalOpen(false);
        setGSheetModalOpen(false);
        setEditingContactId(null);
        setFormData({ name: '', phone: '', email: '', gender: 'Pria' });
        setExcelFile(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSaveContact = (e) => {
        e.preventDefault();
        if (!formData.phone) {
            alert('Nomor Telepon wajib diisi!');
            return;
        }

        if (editingContactId) {
            setContacts(contacts.map(contact =>
                contact.id === editingContactId ? { ...formData, id: editingContactId } : contact
            ));
        } else {
            setContacts(prevContacts => [
                ...prevContacts,
                { id: (prevContacts[prevContacts.length - 1]?.id || 0) + 1, ...formData }
            ]);
        }
        closeModal();
    };

    const handleDeleteContact = (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus kontak ini?')) {
            setContacts(contacts.filter(contact => contact.id !== id));
        }
    };

    const handleFileChange = (e) => {
        setExcelFile(e.target.files[0]);
    };

    const handleImportExcel = () => {
        if (!excelFile) {
            alert('Silakan pilih file Excel terlebih dahulu.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: ['name', 'phone', 'email', 'gender'] });
                const jsonData = json.slice(1);

                let lastId = contacts[contacts.length - 1]?.id || 0;
                const newContacts = jsonData.map((contact, index) => {
                    if (!contact.phone || contact.phone.toString().trim() === '') {
                        throw new Error(`Kontak di baris ${index + 2} tidak memiliki nomor telepon.`);
                    }
                    return {
                        id: ++lastId,
                        name: contact.name || 'No Name',
                        phone: contact.phone.toString(),
                        email: contact.email || '',
                        gender: ['Pria', 'Wanita'].includes(contact.gender) ? contact.gender : 'Pria',
                    };
                }).filter(Boolean);

                setContacts(prev => [...prev, ...newContacts]);
                alert(`${newContacts.length} kontak berhasil diimpor!`);
                closeModal();

            } catch (error) {
                console.error("Error parsing Excel file:", error);
                alert(`Gagal memproses file. Pastikan format benar. Error: ${error.message}`);
            }
        };
        reader.onerror = (error) => {
            console.error("FileReader Error:", error);
            alert("Gagal membaca file.");
        };
        reader.readAsArrayBuffer(excelFile);
    };

    const handleImportGSheet = () => { alert('Sinkronisasi dengan Google Sheet berhasil! (Simulasi)'); closeModal(); };

    return (
        <div>
            {/* --- Bagian Header --- */}
            {/* [MODIFIKASI] Kelas diubah untuk responsivitas. Dari 'flex' menjadi 'flex flex-col md:flex-row' dst. */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <h2 className="text-3xl font-bold text-gray-800 w-full md:w-auto">Daftar Kontak</h2>
                {/* [MODIFIKASI] Grup tombol juga dibuat responsif */}
                <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2">
                    <button onClick={handleAddClick} className="flex justify-center items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors w-full md:w-auto">
                        <UserPlus size={20} className="mr-2" />
                        Tambah Manual
                    </button>
                    <button onClick={() => setExcelModalOpen(true)} className="flex justify-center items-center bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition-colors w-full md:w-auto">
                        <FileUp size={20} className="mr-2" />
                        Import Excel
                    </button>
                    <button onClick={() => setGSheetModalOpen(true)} className="flex justify-center items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors w-full md:w-auto">
                        <LinkIcon size={20} className="mr-2" />
                        Import G-Sheet
                    </button>
                </div>
            </div>

            {/* --- Bar Pencarian --- */}
            <div className="mb-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search size={20} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama atau nomor telepon..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            goToPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* --- Tabel Kontak --- */}
            <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 w-16">No</th>
                            <th scope="col" className="px-6 py-3">Nama</th>
                            <th scope="col" className="px-6 py-3">Nomor Telepon</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Gender</th>
                            <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedContacts.map((contact, index) => (
                            <tr key={contact.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{contact.name}</td>
                                <td className="px-6 py-4">{contact.phone}</td>
                                <td className="px-6 py-4">{contact.email}</td>
                                <td className="px-6 py-4">{contact.gender}</td>
                                <td className="px-6 py-4 flex justify-center space-x-2">
                                    <button onClick={() => handleEditClick(contact)} className="flex items-center bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors text-xs">
                                        <Edit size={14} className="mr-1" /> Edit
                                    </button>
                                    <button onClick={() => handleDeleteContact(contact.id)} className="flex items-center bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-xs">
                                        <Trash2 size={14} className="mr-1" /> Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- Kontrol Paginasi --- */}
            {/* [MODIFIKASI] Dibuat responsif agar tidak bertabrakan di layar kecil */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-4">
                <span className="text-sm text-gray-700">
                    Menampilkan <span className="font-semibold">{paginatedContacts.length}</span> dari <span className="font-semibold">{filteredContacts.length}</span> Kontak
                </span>
                <div className="inline-flex items-center -space-x-px">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Sebelumnya
                    </button>
                    <span className="px-4 py-2 text-gray-700 bg-white border-t border-b border-gray-300">
                        Halaman {currentPage} dari {totalPages}
                    </span>
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Berikutnya
                    </button>
                </div>
            </div>

            {/* --- Modals --- */}
            {isManualModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">
                            {editingContactId ? 'Edit Kontak' : 'Tambah Kontak Manual'}
                        </h3>
                        <form onSubmit={handleSaveContact}>
                            {/* Form fields ... */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nama</label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">Nomor HP <span className="text-red-500">*</span></label>
                                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                                <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">Gender</label>
                                <select name="gender" id="gender" value={formData.gender} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                    <option>Pria</option>
                                    <option>Wanita</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={closeModal} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Batal</button>
                                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isExcelModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                        <h3 className="text-xl font-semibold mb-4">Import Kontak dari Excel</h3>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="excel-file">Upload File Excel</label>
                            <input onChange={handleFileChange} type="file" id="excel-file" accept=".xlsx, .xls" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>
                        <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md">
                            <p className="font-bold">Format Kolom Excel (Tanpa Header):</p>
                            <ul className="list-disc list-inside text-sm mt-2">
                                <li><b>Kolom A:</b> Nama (opsional)</li>
                                <li><b>Kolom B:</b> Phone (wajib)</li>
                                <li><b>Kolom C:</b> Email (opsional)</li>
                                <li><b>Kolom D:</b> Jenis Kelamin (opsional, 'Pria'/'Wanita')</li>
                            </ul>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button type="button" onClick={closeModal} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Batal</button>
                            <button type="button" onClick={handleImportExcel} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Upload</button>
                        </div>
                    </div>
                </div>
            )}

            {isGSheetModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                        <h3 className="text-xl font-semibold mb-4">Import Kontak dari Google Sheet</h3>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gsheet-link">Link Google Sheet</label>
                            <input type="url" id="gsheet-link" placeholder="https://docs.google.com/spreadsheets/d/..." className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button type="button" onClick={closeModal} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Batal</button>
                            <button type="button" onClick={handleImportGSheet} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Import</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactsPage;