import React from 'react';
import { Search, Bell, ChevronDown, Menu } from 'lucide-react';

/**
 * Komponen Header aplikasi.
 * Menampilkan tombol menu mobile, judul halaman, dan kontrol pengguna.
 * @param {object} props
 * @param {function} props.onMenuClick - Fungsi untuk membuka sidebar di tampilan mobile.
 * @param {string} props.title - Judul halaman yang akan ditampilkan.
 */
const Header = ({ onMenuClick, title }) => {
    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-20 h-20 flex-shrink-0">
            {/* Sisi Kiri: Tombol Menu Mobile & Judul Halaman */}
            <div className="flex items-center">
                <button 
                    onClick={onMenuClick} 
                    className="md:hidden p-2 -ml-2 mr-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Buka menu"
                >
                    <Menu size={24} className="text-gray-700" />
                </button>
            </div>

            {/* Sisi Kanan: Search Bar dan Profil Pengguna */}
            <div className="flex items-center space-x-4 md:space-x-6">
                <button className="text-gray-500 hover:text-indigo-600 relative" aria-label="Notifikasi">
                    <Bell size={24} />
                    {/* Contoh notifikasi, bisa dikontrol dengan state */}
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">3</span>
                </button>

                <div className="flex items-center space-x-3 cursor-pointer group">
                    <img 
                        src={`https://i.pravatar.cc/150?u=admin`} 
                        alt="Avatar pengguna" 
                        className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-indigo-500 transition-colors" 
                    />
                    <div className="hidden md:block">
                        <p className="font-semibold text-sm text-gray-800">Admin</p>
                        <p className="text-xs text-gray-500">Super Admin</p>
                    </div>
                    <ChevronDown size={20} className="text-gray-500 transition-transform group-hover:rotate-180" />
                </div>
            </div>
        </header>
    );
};

export default Header;
