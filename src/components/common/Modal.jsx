// src/components/common/Modal.jsx

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    // [PENINGKATAN] Menambahkan useEffect untuk mendeteksi tekanan tombol 'Escape'
    useEffect(() => {
        // Fungsi yang akan dipanggil saat tombol ditekan
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                onClose(); // Panggil fungsi onClose jika tombol 'Escape' ditekan
            }
        };

        // Tambahkan event listener saat modal terbuka
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
        }

        // Fungsi cleanup: hapus event listener saat komponen dilepas atau modal ditutup
        // Ini penting untuk mencegah memory leak
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]); // Efek ini akan berjalan kembali jika isOpen atau onClose berubah

    if (!isOpen) return null;

    return (
        // Menambahkan event handler onClick pada latar belakang untuk menutup modal
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
            onClick={onClose} // Menutup modal jika area luar diklik
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-md"
                onClick={e => e.stopPropagation()} // Mencegah modal tertutup saat area di dalam modal diklik
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
