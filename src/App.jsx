import React, { useState } from 'react';
import { Home, Send, Users, Group, MessageSquareText, Bell, User, Settings, LogOut, MessageSquareText as AppIcon } from 'lucide-react';

// --- DATA & PAGES IMPORT ---
import { 
    contactGroups as initialGroupsData, 
    allContacts as initialContactsData,
    recentBlasts as initialBlastsData 
} from './data/mockData';

import DashboardPage from './pages/DashboardPage';
import GroupsPage from './pages/GroupsPage';
import CreateGroupPage from './pages/CreateGroupPage';
import EditGroupPage from './pages/EditGroupPage';
import { SenderPage } from './pages/SenderPage';
import { AiAgentsListPage } from './pages/AiAgentsListPage';
import { AiAgentEditorPage } from './pages/AiAgentEditorPage';
import ContactsPage from './pages/ContactsPage';
import BlastPage from './pages/BlastPage';
import CreateBlastPage from './pages/CreateBlastPage';
import BlastDetailPage from './pages/BlastDetailPage'; // <-- 1. Import diaktifkan
import PagePlaceholder from './components/common/PagePlaceholder';


// --- STATIC COMPONENTS ---
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
    const bottomMenuItems = [
        { id: 'notifications', label: 'Notifikasi', icon: Bell },
        { id: 'settings', label: 'Setting Profile', icon: Settings },
        { id: 'logout', label: 'Logout', icon: LogOut },
    ];
    
    const NavLink = ({ item }) => {
        const senderPages = ['sender', 'aiAgentsList', 'aiAgentEditor'];
        const groupPages = ['groups', 'createGroup', 'editGroup'];
        const blastPages = ['blasts', 'createBlast', 'blastDetail']; // <-- Tambahkan halaman blast
        
        let isActive = activePage === item.id;
        if (item.id === 'sender' && senderPages.includes(activePage)) isActive = true;
        if (item.id === 'groups' && groupPages.includes(activePage)) isActive = true;
        if (item.id === 'blasts' && blastPages.includes(activePage)) isActive = true; // <-- Logika untuk menu blast aktif

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


// --- MAIN APP COMPONENT ---
export default function App() {
  // State untuk navigasi
  const [currentView, setCurrentView] = useState({ page: 'blasts', params: {} });
  
  // State untuk data aplikasi
  const [groups, setGroups] = useState(initialGroupsData);
  const [contacts, setContacts] = useState(initialContactsData);
  const [blasts, setBlasts] = useState(initialBlastsData); // <-- State untuk data Blast

  // Fungsi navigasi
  const navigateTo = (page, params = {}) => {
    setCurrentView({ page, params });
  };

  // --- CRUD Handlers ---

  // Group Handlers
  const handleAddGroup = (newGroupData) => {
    const newGroup = { ...newGroupData, id: `group-${Date.now()}` };
    setGroups(prev => [newGroup, ...prev]);
  };
  const handleDeleteGroup = (groupIdToDelete) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus grup ini?")) {
        setGroups(prev => prev.filter(group => group.id !== groupIdToDelete));
    }
  };
  const handleUpdateGroup = (groupIdToUpdate, updatedData) => {
    setGroups(prev => prev.map(g => g.id === groupIdToUpdate ? { ...g, ...updatedData } : g));
  };
  
  // Contact Handlers
  const handleAddContact = (newContactData) => {
    const newContact = { ...newContactData, id: `contact-${Date.now()}` };
    setContacts(prev => [...prev, newContact]);
    return newContact;
  };
 
const handleAddBlast = (newBlastData) => {
    const group = groups.find(g => g.id === newBlastData.groupId);
    if (!group) return; // Guard clause if group not found

    const newBlast = {
        ...newBlastData,
        id: `blast-${Date.now()}`,
        status: 'Selesai', // Kita set 'Selesai' agar ada data dummy
        date: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
        group: group.name,
        recipients: group.members.map(phone => {
            const contact = contacts.find(c => c.phone === phone);
            // Membuat data dummy untuk status dan tanggal
            const statuses = ['Dibaca', 'Terkirim', 'Gagal'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            return {
                name: contact ? contact.name : phone,
                phone: phone,
                status: randomStatus,
                sentAt: randomStatus !== 'Gagal' ? new Date().toLocaleString('id-ID') : null,
            };
        }),
    };
    // Menghitung jumlah sukses dan gagal dari data dummy
    newBlast.sent = newBlast.recipients.filter(r => r.status === 'Dibaca' || r.status === 'Terkirim').length;
    newBlast.failed = newBlast.recipients.filter(r => r.status === 'Gagal').length;

    setBlasts(prev => [newBlast, ...prev]);
  };

  const handleDeleteBlast = (blastIdToDelete) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus riwayat blast ini?")) {
        setBlasts(prev => prev.filter(blast => blast.id !== blastIdToDelete));
    }
  };

  const renderPage = () => {
    switch (currentView.page) {
      case 'dashboard': return <DashboardPage navigateTo={navigateTo} />;
      case 'sender': return <SenderPage navigateTo={navigateTo} />;
      case 'contacts': return <ContactsPage navigateTo={navigateTo} />;
      
      case 'blasts': 
        return <BlastPage navigateTo={navigateTo} blasts={blasts} handleDeleteBlast={handleDeleteBlast} />;
      case 'createBlast':
        return <CreateBlastPage navigateTo={navigateTo} handleAddBlast={handleAddBlast} groups={groups} />;
      
      // --- 2. Rute Detail diaktifkan ---
      case 'blastDetail':
        return <BlastDetailPage 
                    navigateTo={navigateTo}
                    blasts={blasts}
                    params={currentView.params}
                />;

      case 'groups':
        return <GroupsPage navigateTo={navigateTo} groups={groups} handleDeleteGroup={handleDeleteGroup} />;
      case 'createGroup':
        return <CreateGroupPage navigateTo={navigateTo} handleAddGroup={handleAddGroup} contacts={contacts} handleAddContact={handleAddContact} />;
      case 'editGroup':
        return <EditGroupPage navigateTo={navigateTo} params={currentView.params} groups={groups} contacts={contacts} handleUpdateGroup={handleUpdateGroup} handleAddContact={handleAddContact} />;
      
      case 'aiAgentsList': return <AiAgentsListPage navigateTo={navigateTo} />;
      case 'aiAgentEditor': return <AiAgentEditorPage navigateTo={navigateTo} params={currentView.params} />;
      case 'notifications': return <PagePlaceholder pageName="Notifikasi" />;
      case 'settings': return <PagePlaceholder pageName="Setting Profile" />;
      case 'logout': return <PagePlaceholder pageName="Logout" />;
      
      default:
        return <DashboardPage navigateTo={navigateTo} />;
    }
  };

  // --- JSX RENDER ---
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
