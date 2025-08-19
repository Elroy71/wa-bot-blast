// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// --- SERVICE ---
import * as contactService from './services/contactService';

// --- KOMPONEN LAYOUT ---
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import PagePlaceholder from './components/common/PagePlaceholder';

// --- DATA MOCK ---
import {
    contactGroups as initialGroupsData,
    recentBlasts as initialBlastsData
} from './data/mockData';

// --- HALAMAN (PAGES) ---
import DashboardPage from './pages/DashboardPage';
import ContactsPage from './pages/ContactsPage';
import GroupsPage from './pages/GroupsPage';
import CreateGroupPage from './pages/CreateGroupPage';
import EditGroupPage from './pages/EditGroupPage';
import { SenderPage } from './pages/SenderPage';
import { AiAgentsListPage } from './pages/AiAgentsListPage';
import { AiAgentEditPage } from './pages/AiAgentEditPage';
import { AiAgentCreatePage } from './pages/AiAgentCreatePage';
import BlastPage from './pages/BlastPage';
import BlastCreatePage from './pages/BlastCreatePage';
import BlastDetailPage from './pages/BlastDetailPage';

// --- FUNGSI HELPER UNTUK JUDUL HALAMAN ---
const getPageTitle = (pathname) => {
    const titles = {
        '/': 'Beranda',
        '/sender': 'Sender WhatsApp',
        '/contacts': 'Daftar Kontak',
        '/groups': 'Daftar Grup',
        '/groups/create': 'Buat Grup Baru',
        '/blasts': 'Riwayat Blast',
        '/blasts/create': 'Buat Blast Baru',
        '/ai-agents': 'Daftar Agen AI',
        '/ai-agents/create': 'Buat Agen AI Baru',
        '/notifications': 'Notifikasi',
        '/settings': 'Pengaturan Profil',
    };
    if (pathname.startsWith('/groups/edit/')) return 'Edit Grup';
    if (pathname.startsWith('/blasts/')) return 'Detail Blast';
    if (pathname.startsWith('/ai-agents/edit/')) return 'Edit Agen AI';
    return titles[pathname] || 'BlastBot AI';
};

// Komponen internal untuk membungkus layout dan mengakses context router
const AppContent = ({ contacts, groups, blasts, loadingContacts, errorContacts, handlers }) => {
    const location = useLocation();
    const [isDesktopExpanded, setIsDesktopExpanded] = useState(true);
    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {isMobileSidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setMobileSidebarOpen(false)}></div>
            )}

            <Sidebar
                isDesktopExpanded={isDesktopExpanded}
                toggleDesktopSidebar={() => setIsDesktopExpanded(prev => !prev)}
                isMobileOpen={isMobileSidebarOpen}
                setMobileOpen={setMobileSidebarOpen}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    onMenuClick={() => setMobileSidebarOpen(true)}
                    title={getPageTitle(location.pathname)}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 md:p-8">
                    {loadingContacts && location.pathname === '/contacts' ? (
                        <p className="text-center text-gray-500">Memuat data kontak...</p>
                    ) : errorContacts ? (
                        <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{errorContacts}</p>
                    ) : (
                        // [PERUBAHAN] Menambahkan rute untuk AI Agents
                        <Routes>
                            <Route index element={<DashboardPage />} />
                            <Route path="dashboard" element={<Navigate to="/" replace />} />
                            <Route path="sender" element={<SenderPage />} />
                            <Route path="contacts" element={<ContactsPage {...{ contacts, onAddContact: handlers.handleAddContact, onUpdateContact: handlers.handleUpdateContact, onDeleteContact: handlers.handleDeleteContact, onImportContacts: handlers.handleImportContacts }} />} />
                            
                            <Route path="groups" element={<GroupsPage groups={groups} handleDeleteGroup={handlers.handleDeleteGroup} />} />
                            <Route path="groups/create" element={<CreateGroupPage handleAddGroup={handlers.handleAddGroup} contacts={contacts} handleAddContact={handlers.handleAddContact} />} />
                            <Route path="groups/edit/:groupId" element={<EditGroupPage groups={groups} contacts={contacts} handleUpdateGroup={handlers.handleUpdateGroup} handleAddContact={handlers.handleAddContact} />} />

                            <Route path="blasts" element={<BlastPage blasts={blasts} handleDeleteBlast={handlers.handleDeleteBlast} />} />
                            <Route path="blasts/create" element={<BlastCreatePage handleAddBlast={handlers.handleAddBlast} groups={groups} />} />
                            <Route path="blasts/:blastId" element={<BlastDetailPage blasts={blasts} />} />

                            {/* --- RUTE BARU DITAMBAHKAN DI SINI --- */}
                            <Route path="ai-agents" element={<AiAgentsListPage />} />
                            <Route path="ai-agents/create" element={<AiAgentCreatePage />} />
                            <Route path="ai-agents/edit/:agentId" element={<AiAgentEditPage />} />
                            {/* ------------------------------------ */}

                            <Route path="notifications" element={<PagePlaceholder pageName="Notifikasi" />} />
                            <Route path="settings" element={<PagePlaceholder pageName="Setting Profile" />} />
                            <Route path="logout" element={<PagePlaceholder pageName="Logout" />} />

                            <Route path="*" element={<PagePlaceholder pageName="404: Halaman Tidak Ditemukan" />} />
                        </Routes>
                    )}
                </main>
            </div>
        </div>
    );
};


// --- KOMPONEN UTAMA APLIKASI ---
function App() {
    // State dan handler tidak berubah
    const [groups, setGroups] = useState(initialGroupsData);
    const [blasts, setBlasts] = useState(initialBlastsData);
    const [contacts, setContacts] = useState([]);
    const [loadingContacts, setLoadingContacts] = useState(true);
    const [errorContacts, setErrorContacts] = useState(null);

    const fetchContacts = async () => {
        try {
            setLoadingContacts(true);
            const response = await contactService.getContacts();
            setContacts(response.data);
            setErrorContacts(null);
        } catch (err) {
            console.error("Gagal mengambil kontak:", err);
            setErrorContacts("Tidak dapat memuat data kontak. Pastikan server backend berjalan.");
        } finally {
            setLoadingContacts(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

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
    const handleAddContact = async (formData) => {
        try {
            await contactService.createContact(formData);
            fetchContacts();
        } catch (err) {
            console.error("Gagal menambah kontak:", err);
            alert("Gagal menyimpan kontak. Periksa kembali data Anda.");
        }
    };
    const handleUpdateContact = async (id, formData) => {
        try {
            await contactService.updateContact(id, formData);
            fetchContacts();
        } catch (err) {
            console.error("Gagal mengupdate kontak:", err);
            alert("Gagal mengupdate kontak.");
        }
    };
    const handleDeleteContact = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus kontak ini?')) {
            try {
                await contactService.deleteContact(id);
                fetchContacts();
            } catch (err) {
                console.error("Gagal menghapus kontak:", err);
                alert("Gagal menghapus kontak.");
            }
        }
    };
    const handleImportContacts = async (newContacts) => {
        try {
            const response = await contactService.importContacts(newContacts);
            alert(response.data.message);
            fetchContacts();
        } catch (err) {
            console.error("Gagal mengimpor kontak:", err);
            alert("Gagal mengimpor kontak. Pastikan format file benar.");
        }
    };
    
    const handlers = {
        handleAddContact, handleUpdateContact, handleDeleteContact, handleImportContacts,
        handleAddGroup, handleDeleteGroup, handleUpdateGroup,
        handleAddBlast, handleDeleteBlast,
    };

    return (
        <BrowserRouter>
            <AppContent
                contacts={contacts}
                groups={groups}
                blasts={blasts}
                loadingContacts={loadingContacts}
                errorContacts={errorContacts}
                handlers={handlers}
            />
        </BrowserRouter>
    );
}

export default App;
