import React, { useState } from 'react';
import { Home, Send, Users, Group, MessageSquareText, Bell, User, Settings, LogOut, MessageSquareText as AppIcon, Menu } from 'lucide-react';

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
// PERBARUAN: Impor file yang sudah dipisah
import { AiAgentEditPage } from './pages/AiAgentEditPage';
import { AiAgentCreatePage } from './pages/AiAgentCreatePage'; 
import ContactsPage from './pages/ContactsPage';
import BlastPage from './pages/BlastPage';
import CreateBlastPage from './pages/CreateBlastPage';
import BlastDetailPage from './pages/BlastDetailPage';
import PagePlaceholder from './components/common/PagePlaceholder';


// --- STATIC COMPONENTS ---
const Header = ({ onMenuClick }) => (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center z-30 sticky top-0">
        <button onClick={onMenuClick} className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-200">
            <Menu size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 md:ml-0">Selamat Datang!</h1>
        <div className="flex items-center space-x-4">
            <Bell size={24} className="text-gray-500" />
            <User size={24} className="text-gray-500" />
        </div>
    </header>
);

const Sidebar = ({ 
    activePage, 
    navigateTo, 
    isDesktopExpanded, 
    toggleDesktopSidebar,
    isMobileOpen,
    setMobileOpen
}) => {
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
        // PERBARUAN: Tambahkan rute baru ke dalam grup sender
        const senderPages = ['sender', 'aiAgentsList', 'aiAgentEdit', 'aiAgentCreate'];
        const groupPages = ['groups', 'createGroup', 'editGroup'];
        const blastPages = ['blasts', 'createBlast', 'blastDetail'];
        
        let isActive = activePage === item.id;
        if (item.id === 'sender' && senderPages.includes(activePage)) isActive = true;
        if (item.id === 'groups' && groupPages.includes(activePage)) isActive = true;
        if (item.id === 'blasts' && blastPages.includes(activePage)) isActive = true;

        const handleLinkClick = (e) => {
            e.preventDefault();
            navigateTo(item.id);
            setMobileOpen(false); 
        };

        return (
            <a href="#" onClick={handleLinkClick}
               className={`flex items-center py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-indigo-800'} ${isDesktopExpanded ? 'px-4' : 'md:px-3 md:justify-center'}`}>
                <item.icon className={`w-6 h-6 flex-shrink-0 ${isDesktopExpanded ? 'mr-4' : 'md:mr-0'}`} />
                <span className={`transition-all duration-200 whitespace-nowrap ${isDesktopExpanded ? 'opacity-100' : 'md:opacity-0 md:w-0'}`}>{item.label}</span>
            </a>
        );
    };

    return (
        <div className={`
            bg-indigo-900 text-white flex flex-col h-screen flex-shrink-0 
            transition-transform duration-300 ease-in-out z-40
            fixed inset-y-0 left-0 w-64 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
            md:relative md:translate-x-0 md:transition-all 
            ${isDesktopExpanded ? 'md:w-64' : 'md:w-20'}
        `}>
            <div className={`flex items-center border-b border-indigo-800 h-20 ${isDesktopExpanded ? 'justify-between px-4' : 'md:justify-center'}`}>
                {isDesktopExpanded && (
                    <div className="flex items-center overflow-hidden">
                        <AppIcon className="text-white flex-shrink-0" size={28} />
                        <h1 className="text-2xl font-bold ml-3 whitespace-nowrap">WA-Man</h1>
                    </div>
                )}
                <button onClick={toggleDesktopSidebar} className="p-2 rounded-full hover:bg-indigo-800 flex-shrink-0 hidden md:block">
                    <Menu size={24} />
                </button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <p className={`pt-4 pb-2 text-xs text-gray-400 uppercase ${isDesktopExpanded ? 'px-4' : 'md:text-center'}`}>
                    {isDesktopExpanded ? 'Utama' : 'Menu'}
                </p>
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
  const [currentView, setCurrentView] = useState({ page: 'dashboard', params: {} });
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [groups, setGroups] = useState(initialGroupsData);
  const [contacts, setContacts] = useState(initialContactsData);
  const [blasts, setBlasts] = useState(initialBlastsData);

  const navigateTo = (page, params = {}) => {
    setCurrentView({ page, params });
  };
  const toggleDesktopSidebar = () => {
      setIsDesktopExpanded(prev => !prev);
  };

  // --- CRUD Handlers (Tidak ada perubahan) ---
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
  const handleAddContact = (newContactData) => {
    const newContact = { ...newContactData, id: `contact-${Date.now()}` };
    setContacts(prev => [...prev, newContact]);
    return newContact;
  };
  const handleAddBlast = (newBlastData) => {
    const group = groups.find(g => g.id === newBlastData.groupId);
    if (!group) return;
    const newBlast = {
        ...newBlastData, id: `blast-${Date.now()}`, status: 'Selesai', date: new Date().toISOString().split('T')[0].replace(/-/g, '/'), group: group.name,
        recipients: group.members.map(phone => {
            const contact = contacts.find(c => c.phone === phone);
            const statuses = ['Dibaca', 'Terkirim', 'Gagal'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            return { name: contact ? contact.name : phone, phone: phone, status: randomStatus, sentAt: randomStatus !== 'Gagal' ? new Date().toLocaleString('id-ID') : null, };
        }),
    };
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
      case 'blasts': return <BlastPage navigateTo={navigateTo} blasts={blasts} handleDeleteBlast={handleDeleteBlast} />;
      case 'createBlast': return <CreateBlastPage navigateTo={navigateTo} handleAddBlast={handleAddBlast} groups={groups} />;
      case 'blastDetail': return <BlastDetailPage navigateTo={navigateTo} blasts={blasts} params={currentView.params} />;
      case 'groups': return <GroupsPage navigateTo={navigateTo} groups={groups} handleDeleteGroup={handleDeleteGroup} />;
      case 'createGroup': return <CreateGroupPage navigateTo={navigateTo} handleAddGroup={handleAddGroup} contacts={contacts} handleAddContact={handleAddContact} />;
      case 'editGroup': return <EditGroupPage navigateTo={navigateTo} params={currentView.params} groups={groups} contacts={contacts} handleUpdateGroup={handleUpdateGroup} handleAddContact={handleAddContact} />;
      
      // PERBARUAN: Rute untuk AI Agent
      case 'aiAgentsList': return <AiAgentsListPage navigateTo={navigateTo} />;
      case 'aiAgentCreate': return <AiAgentCreatePage navigateTo={navigateTo} params={currentView.params} />;
      case 'aiAgentEdit': return <AiAgentEditPage navigateTo={navigateTo} params={currentView.params} />;
      
      case 'notifications': return <PagePlaceholder pageName="Notifikasi" />;
      case 'settings': return <PagePlaceholder pageName="Setting Profile" />;
      case 'logout': return <PagePlaceholder pageName="Logout" />;
      default: return <DashboardPage navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
        {isMobileSidebarOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setMobileSidebarOpen(false)}></div>
        )}
        <Sidebar 
            activePage={currentView.page} 
            navigateTo={navigateTo} 
            isDesktopExpanded={isDesktopExpanded}
            toggleDesktopSidebar={toggleDesktopSidebar}
            isMobileOpen={isMobileSidebarOpen}
            setMobileOpen={setMobileSidebarOpen}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
            <Header onMenuClick={() => setMobileSidebarOpen(true)} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 md:p-8" onClick={() => { if(isMobileSidebarOpen) setMobileSidebarOpen(false) }}>
                {renderPage()}
            </main>
        </div>
    </div>
  );
}