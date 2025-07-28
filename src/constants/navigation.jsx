import { Home, Send, Users, Group, MessageSquareText, Bell, Settings, LogOut } from 'lucide-react';

export const mainMenuItems = [
    { id: 'dashboard', label: 'Beranda', icon: Home, page: 'DashboardPage' },
    { id: 'sender', label: 'Sender WhatsApp', icon: Send, page: 'SenderPage' },
    { id: 'contacts', label: 'Daftar Kontak', icon: Users, page: 'ContactsPage' },
    { id: 'groups', label: 'Daftar Grup', icon: Group, page: 'GroupsPage' },
    { id: 'blast', label: 'Blast', icon: MessageSquareText, page: 'BlastPage' },
];

export const bottomMenuItems = [
    { id: 'notifications', label: 'Notifikasi', icon: Bell, page: 'PagePlaceholder' },
    { id: 'settings', label: 'Setting Profile', icon: Settings, page: 'PagePlaceholder' },
    { id: 'logout', label: 'Logout', icon: LogOut, page: 'PagePlaceholder' },
];
