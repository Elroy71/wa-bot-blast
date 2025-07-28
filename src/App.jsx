import React, { useState } from 'react';
import { Home, Send, Users, Group, MessageSquareText, Bell, User, Settings, LogOut, MessageSquareText as AppIcon } from 'lucide-react';

// Impor semua komponen halaman yang akan kita gunakan
import { SenderPage } from './pages/SenderPage';
import { AiAgentsListPage } from './pages/AiAgentsListPage';
import { AiAgentEditorPage } from './pages/AiAgentEditorPage';
import DashboardPage from './pages/DashboardPage';
import ContactsPage from './pages/ContactsPage';
import GroupsPage from './pages/GroupsPage';
import BlastPage from './pages/BlastPage';
import PagePlaceholder from './components/common/PagePlaceholder';

// Komponen Header dan Sidebar bisa tetap di sini atau dipindahkan ke /components/layout/
const Header = () => (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center z-20">
        <h1 className="text-xl font-bold text-gray-800">Selamat Datang!</h1>
        <div className="flex items-center space-x-4">
            <Bell size={24} className="text-gray-500" />
            <User size={24} className="text-gray-500" />
        </div>
    </header>
);

const Sidebar = ({ activePage, navigateTo }) => {
    const mainMenuItems = [
        { id: 'dashboard', label: 'Beranda', icon: Home },
        { id: 'sender', label: 'Sender WhatsApp', icon: Send },
        { id: 'contacts', label: 'Daftar Kontak', icon: Users },
        { id: 'groups', label: 'Daftar Grup', icon: Group },
        { id: 'blasts', label: 'Blast', icon: MessageSquareText },
    ];
    
    // [TAMBAHAN] Menu bagian bawah diaktifkan kembali
    const bottomMenuItems = [
        { id: 'notifications', label: 'Notifikasi', icon: Bell },
        { id: 'settings', label: 'Setting Profile', icon: Settings },
        { id: 'logout', label: 'Logout', icon: LogOut },
    ];

    const NavLink = ({ item }) => {
        // [PERBAIKAN] Logika untuk menentukan menu aktif
        const senderPages = ['sender', 'aiAgentsList', 'aiAgentEditor'];
        const isActive = item.id === 'sender' 
            ? senderPages.includes(activePage) 
            : activePage === item.id;

        return (
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo(item.id); }}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-indigo-800'}`}>
                <item.icon className="w-5 h-5 mr-4" />
                <span>{item.label}</span>
            </a>
        );
    };

    return (
        <div className="w-64 bg-indigo-900 text-white flex-col h-screen flex-shrink-0 hidden md:flex">
            <div className="flex items-center justify-center h-20 border-b border-indigo-800">
                <AppIcon className="text-white" size={28} />
                <h1 className="text-2xl font-bold ml-3">WA-Man</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <p className="px-4 pt-4 pb-2 text-xs text-gray-400 uppercase">Utama</p>
                {mainMenuItems.map(item => <NavLink key={item.id} item={item} />)}
            </nav>
            <div className="p-4 border-t border-indigo-800 space-y-2">
                 {bottomMenuItems.map(item => <NavLink key={item.id} item={item} />)}
            </div>
        </div>
    );
};

export default function App() {
  const [currentView, setCurrentView] = useState({ page: 'dashboard', params: {} });

  const navigateTo = (page, params = {}) => {
    setCurrentView({ page, params });
  };

  const renderPage = () => {
    switch (currentView.page) {
      case 'dashboard':
        return <DashboardPage navigateTo={navigateTo} />;
      case 'sender':
        return <SenderPage navigateTo={navigateTo} />;
      case 'contacts':
        return <ContactsPage navigateTo={navigateTo} />;
      case 'groups':
        return <GroupsPage navigateTo={navigateTo} />;
      case 'blasts':
        return <BlastPage navigateTo={navigateTo} />;
      
      // Halaman baru untuk alur AI Agent
      case 'aiAgentsList':
        return <AiAgentsListPage navigateTo={navigateTo} />;
      case 'aiAgentEditor':
        return <AiAgentEditorPage navigateTo={navigateTo} params={currentView.params} />;
      
      // [TAMBAHAN] Halaman placeholder diaktifkan kembali
      case 'notifications':
        return <PagePlaceholder pageName="Notifikasi" />;
      case 'settings':
        return <PagePlaceholder pageName="Setting Profile" />;
      case 'logout':
        return <PagePlaceholder pageName="Logout" />;
      
      default:
        return <DashboardPage navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar activePage={currentView.page} navigateTo={navigateTo} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 md:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}