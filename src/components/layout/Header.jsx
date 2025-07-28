import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

const Header = () => (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="relative w-full max-w-xs">
            <input type="text" placeholder="Cari..." className="bg-gray-100 rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <div className="flex items-center space-x-6">
            <button className="text-gray-500 hover:text-indigo-600 relative">
                <Bell size={24} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </button>
            <div className="flex items-center space-x-3">
                <img src={`https://i.pravatar.cc/150?u=admin`} alt="User" className="w-10 h-10 rounded-full" />
                <div>
                    <p className="font-semibold text-sm text-gray-800">Admin</p>
                    <p className="text-xs text-gray-500">Super Admin</p>
                </div>
                <ChevronDown size={20} className="text-gray-500 cursor-pointer" />
            </div>
        </div>
    </header>
);

export default Header;
