import React from 'react';
import { MessageSquareText } from 'lucide-react';
import { mainMenuItems, bottomMenuItems } from '../../constants/navigation';

const NavLink = ({ item, isActive, onClick }) => (
    <a
        href="#"
        onClick={(e) => { e.preventDefault(); onClick(item.id); }}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
            isActive 
            ? 'bg-indigo-600 text-white shadow-lg' 
            : 'text-gray-300 hover:bg-indigo-800 hover:text-white'
        }`}
    >
        <item.icon className="w-5 h-5 mr-4" />
        <span>{item.label}</span>
    </a>
);

const Sidebar = ({ activePage, setActivePage }) => {
    return (
        <div className="w-64 bg-indigo-900 text-white flex flex-col h-screen">
            <div className="flex items-center justify-center h-20 border-b border-indigo-800">
                <MessageSquareText className="text-white" size={28} />
                <h1 className="text-2xl font-bold ml-3">WA-Man</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <p className="px-4 pt-4 pb-2 text-xs text-gray-400 uppercase">Utama</p>
                {mainMenuItems.map(item => (
                    <NavLink key={item.id} item={item} isActive={activePage === item.id} onClick={setActivePage} />
                ))}
            </nav>
            <div className="p-4 border-t border-indigo-800 space-y-2">
                {bottomMenuItems.map(item => (
                    <NavLink key={item.id} item={item} isActive={activePage === item.id} onClick={setActivePage} />
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
