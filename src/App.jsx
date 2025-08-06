import React, { useState } from 'react';

// --- KOMPONEN LAYOUT (SEKARANG DIIMPOR DARI FILENYA MASING-MASING) ---
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import PagePlaceholder from './components/common/PagePlaceholder';

// --- DATA MOCK ---
import { 
    contactGroups as initialGroupsData, 
    allContacts as initialContactsData,
    recentBlasts as initialBlastsData 
} from './data/mockData';

// --- HALAMAN (PAGES) ---
import DashboardPage from './pages/DashboardPage';
import GroupsPage from './pages/GroupsPage';
import CreateGroupPage from './pages/CreateGroupPage';
import EditGroupPage from './pages/EditGroupPage';
import { SenderPage } from './pages/SenderPage';
import { AiAgentsListPage } from './pages/AiAgentsListPage';
import { AiAgentEditPage } from './pages/AiAgentEditPage';
import { AiAgentCreatePage } from './pages/AiAgentCreatePage'; 
import ContactsPage from './pages/ContactsPage';
import BlastPage from './pages/BlastPage';
import CreateBlastPage from './pages/CreateBlastPage';
import BlastDetailPage from './pages/BlastDetailPage';

// --- FUNGSI HELPER UNTUK JUDUL HALAMAN ---
const getPageTitle = (pageId) => {
    const titles = {
        dashboard: 'Beranda',
        sender: 'Sender WhatsApp',
        contacts: 'Daftar Kontak',
        groups: 'Daftar Grup',
        blasts: 'Riwayat Blast',
        notifications: 'Notifikasi',
        settings: 'Pengaturan Profil',
        logout: 'Logout',
        aiAgentsList: 'Daftar Agen AI',
        aiAgentCreate: 'Buat Agen AI Baru',
        aiAgentEdit: 'Edit Agen AI',
        createGroup: 'Buat Grup Baru',
        editGroup: 'Edit Grup',
        createBlast: 'Buat Blast Baru',
        blastDetail: 'Detail Blast',
    };
    return titles[pageId] || 'BlastBot AI';
};


// --- KOMPONEN UTAMA APLIKASI ---
export default function App() {
    // State untuk navigasi dan tampilan UI
    const [currentView, setCurrentView] = useState({ page: 'dashboard', params: {} });
    const [isDesktopExpanded, setIsDesktopExpanded] = useState(true);
    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // State untuk data aplikasi
    const [groups, setGroups] = useState(initialGroupsData);
    const [contacts, setContacts] = useState(initialContactsData);
    const [blasts, setBlasts] = useState(initialBlastsData);

    // Fungsi navigasi
    const navigateTo = (page, params = {}) => {
        setCurrentView({ page, params });
        window.scrollTo(0, 0); // Selalu scroll ke atas saat pindah halaman
    };
    
    const toggleDesktopSidebar = () => setIsDesktopExpanded(prev => !prev);

    // --- HANDLERS UNTUK OPERASI CRUD ---
    // (Tidak ada perubahan pada logika CRUD ini)
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
    const handleAddContact = (newContactData) => {
        const newContact = { ...newContactData, id: `contact-${Date.now()}` };
        setContacts(prev => [newContact, ...prev]);
        return newContact;
    };
    const handleUpdateContact = (contactId, updatedData) => {
        setContacts(prev => prev.map(c => c.id === contactId ? { ...updatedData, id: contactId } : c));
    };
    const handleDeleteContact = (contactId) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus kontak ini?")) {
            setContacts(prev => prev.filter(c => c.id !== contactId));
        }
    };
    const handleImportContacts = (importedContacts) => {
        const newContacts = importedContacts.map((contact, index) => ({
            ...contact,
            id: `imported-${Date.now()}-${index}`,
        }));
        setContacts(prev => [...prev, ...newContacts]);
        alert(`${newContacts.length} kontak berhasil diimpor!`);
    };

    // --- RENDER HALAMAN BERDASARKAN STATE ---
    const renderPage = () => {
        const { page, params } = currentView;
        switch (page) {
            case 'dashboard': return <DashboardPage navigateTo={navigateTo} />;
            case 'sender': return <SenderPage navigateTo={navigateTo} />;
            case 'contacts': return <ContactsPage {...{ contacts, onAddContact: handleAddContact, onUpdateContact: handleUpdateContact, onDeleteContact: handleDeleteContact, onImportContacts: handleImportContacts }} />;
            case 'blasts': return <BlastPage navigateTo={navigateTo} blasts={blasts} handleDeleteBlast={handleDeleteBlast} />;
            case 'createBlast': return <CreateBlastPage navigateTo={navigateTo} handleAddBlast={handleAddBlast} groups={groups} />;
            case 'blastDetail': return <BlastDetailPage navigateTo={navigateTo} blasts={blasts} params={params} />;
            case 'groups': return <GroupsPage navigateTo={navigateTo} groups={groups} handleDeleteGroup={handleDeleteGroup} />;
            case 'createGroup': return <CreateGroupPage navigateTo={navigateTo} handleAddGroup={handleAddGroup} contacts={contacts} handleAddContact={handleAddContact} />;
            case 'editGroup': return <EditGroupPage navigateTo={navigateTo} params={params} groups={groups} contacts={contacts} handleUpdateGroup={handleUpdateGroup} handleAddContact={handleAddContact} />;
            case 'aiAgentsList': return <AiAgentsListPage navigateTo={navigateTo} />;
            case 'aiAgentCreate': return <AiAgentCreatePage navigateTo={navigateTo} params={params} />;
            case 'aiAgentEdit': return <AiAgentEditPage navigateTo={navigateTo} params={params} />;
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
                <Header 
                    onMenuClick={() => setMobileSidebarOpen(true)}
                    title={getPageTitle(currentView.page)}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 md:p-8">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
}
