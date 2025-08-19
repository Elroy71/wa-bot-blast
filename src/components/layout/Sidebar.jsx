// src/components/layout/Sidebar.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Send, Users, Group, MessageSquareText, Bell, Settings, LogOut, Menu, MessageSquareText as AppIcon } from 'lucide-react';

// [PERUBAHAN] Menambahkan path turunan untuk AI Agents
const mainMenuItems = [
    { id: 'dashboard', label: 'Beranda', icon: Home, path: '/' },
    {
        id: 'sender',
        label: 'Sender WhatsApp',
        icon: Send,
        path: '/sender',
        // Menambahkan '/ai-agents' agar menu ini aktif di semua halaman AI Agent
        childrenPaths: ['/ai-agents']
    },
    { id: 'contacts', label: 'Daftar Kontak', icon: Users, path: '/contacts' },
    {
        id: 'groups',
        label: 'Daftar Grup',
        icon: Group,
        path: '/groups',
        childrenPaths: ['/groups/create', '/groups/edit']
    },
    {
        id: 'blasts',
        label: 'Blast',
        icon: MessageSquareText,
        path: '/blasts',
        childrenPaths: ['/blasts/create']
    },
];

const bottomMenuItems = [
    { id: 'notifications', label: 'Notifikasi', icon: Bell, path: '/notifications' },
    { id: 'settings', label: 'Setting Profile', icon: Settings, path: '/settings' },
    { id: 'logout', label: 'Logout', icon: LogOut, path: '/logout' },
];

const NavLink = ({ item, isDesktopExpanded, setMobileOpen }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    // Logika isActive akan otomatis menangani path turunan
    // Contoh: jika currentPath adalah '/ai-agents/create', maka startsWith('/ai-agents') akan true.
    const isActive = currentPath === item.path ||
        (item.childrenPaths && item.childrenPaths.some(childPath => currentPath.startsWith(childPath)));

    return (
        <Link
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center py-3 rounded-lg transition-colors duration-200 ${
                isActive
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-300 hover:bg-indigo-800 hover:text-white'
            } ${isDesktopExpanded ? 'px-4' : 'md:px-3 md:justify-center'}`}
        >
            <item.icon className={`w-6 h-6 flex-shrink-0 ${isDesktopExpanded ? 'mr-4' : 'md:mr-0'}`} />
            <span className={`transition-all duration-200 whitespace-nowrap ${isDesktopExpanded ? 'opacity-100' : 'md:opacity-0 md:w-0'}`}>
                {item.label}
            </span>
        </Link>
    );
};

const Sidebar = ({
    isDesktopExpanded,
    toggleDesktopSidebar,
    isMobileOpen,
    setMobileOpen
}) => {
    const sidebarContainerClasses = `
        bg-indigo-900 text-white flex flex-col h-screen flex-shrink-0 
        transition-transform transform duration-300 ease-in-out z-40
        fixed inset-y-0 left-0 w-64 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:transition-all 
        ${isDesktopExpanded ? 'md:w-64' : 'md:w-20'}
    `;

    return (
        <div className={sidebarContainerClasses}>
            <div className={`flex items-center border-b border-indigo-800 h-20 flex-shrink-0 ${isDesktopExpanded ? 'justify-between px-4' : 'md:justify-center'}`}>
                {isDesktopExpanded && (
                    <div className="flex items-center overflow-hidden">
                        <AppIcon className="text-white flex-shrink-0" size={28} />
                        <h1 className="text-2xl font-bold ml-3 whitespace-nowrap">BlastBotAI</h1>
                    </div>
                )}
                <button onClick={toggleDesktopSidebar} className="p-2 rounded-full hover:bg-indigo-800 flex-shrink-0 hidden md:block" aria-label="Toggle sidebar">
                    <Menu size={24} />
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <p className={`pt-4 pb-2 text-xs text-gray-400 uppercase ${isDesktopExpanded ? 'px-4' : 'md:text-center md:text-[10px]'}`}>
                    {isDesktopExpanded ? 'Utama' : 'Menu'}
                </p>
                {mainMenuItems.map(item => <NavLink key={item.id} {...{ item, isDesktopExpanded, setMobileOpen }} />)}
            </nav>

            <div className="p-4 border-t border-indigo-800 space-y-2 flex-shrink-0">
                {bottomMenuItems.map(item => <NavLink key={item.id} {...{ item, isDesktopExpanded, setMobileOpen }} />)}
            </div>
        </div>
    );
};

export default Sidebar;
