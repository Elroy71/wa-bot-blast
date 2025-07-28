import React, { useState } from 'react';
import { 
    Home, Send, Users, Group, MessageSquareText, Bell, User, Settings, LogOut, ChevronDown, 
    PlusCircle, Search, BrainCircuit, ArrowLeft, Video, Image as ImageIcon, Paperclip, 
    Edit, Trash2, QrCode, Code, Power
} from 'lucide-react';

// --- [REVISI] /src/data/mockData.js ---
// Struktur data diperbarui untuk mendukung fitur baru
export const mockData = {
    senders: [
        { id: 1, name: 'CS Utama', phone: '+6281234567890', aiAgentId: 1, status: 'Aktif' },
        { id: 2, name: 'Marketing', phone: '+6281234567891', aiAgentId: 2, status: 'Aktif' },
        { id: 3, name: 'Support Teknis', phone: '+6281234567892', aiAgentId: null, status: 'Nonaktif' },
    ],
    aiAgents: [
        { 
            id: 1, 
            name: 'Bot Layanan Pelanggan',
            company: 'Toko Kita',
            behavior: 'Ramah, membantu, dan selalu mengarahkan ke solusi. Jangan pernah menjanjikan diskon.',
            status: 'Aktif',
            disableOnManualReply: true,
            canReadMessages: true,
            knowledgeBases: [
                { id: 'k1', title: 'Info Produk A', content: 'Produk A adalah produk unggulan kami...', photo: null, video: null, link: 'https://tokokita.com/produk-a' },
                { id: 'k2', title: 'Jam Operasional', content: 'Jam operasional kami adalah Senin-Jumat, 09:00 - 17:00 WIB.', photo: null, video: null, link: null },
            ]
        },
        { id: 2, name: 'Bot Promosi', company: 'Toko Kita', behavior: 'Antusias dan proaktif menawarkan promo.', status: 'Aktif', disableOnManualReply: false, canReadMessages: false, knowledgeBases: [] },
    ],
    // Data lain (contacts, groups, blasts) tetap sama
};


// --- [BARU] /src/components/common/Switch.jsx ---
// Komponen Switch Toggle untuk digunakan di form
export const Switch = ({ enabled, setEnabled }) => (
    <button
      type="button"
      className={`${enabled ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
      onClick={() => setEnabled(!enabled)}
    >
      <span className={`${enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
    </button>
);


// --- [REVISI] /src/pages/SendersPage.jsx ---
// Dirombak total sesuai deskripsi dan screenshot baru
export const SendersPage = ({ navigateTo }) => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Daftar Sender</h2>
            <div className="flex items-center space-x-3">
                <div className="relative">
                    <input type="text" placeholder="Cari..." className="bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <button onClick={() => navigateTo('aiAgentsList')} className="flex items-center bg-yellow-400 text-gray-800 font-semibold px-4 py-2 rounded-md shadow hover:bg-yellow-500 transition-colors">
                    <BrainCircuit size={20} className="mr-2" />
                    AI Agent
                </button>
                <button onClick={() => navigateTo('addSender')} className="flex items-center bg-blue-500 text-white font-semibold px-4 py-2 rounded-md shadow hover:bg-blue-600 transition-colors">
                    <PlusCircle size={20} className="mr-2" />
                    Tambah Sender
                </button>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
             <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th className="px-6 py-3">No</th>
                        <th className="px-6 py-3">Nama</th>
                        <th className="px-6 py-3">Nomor Telepon</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {mockData.senders.map((sender, index) => (
                        <tr key={sender.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4">{index + 1}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{sender.name}</td>
                            <td className="px-6 py-4">{sender.phone}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sender.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    <span className={`w-2 h-2 mr-1.5 rounded-full ${sender.status === 'Aktif' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    {sender.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                    <button className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded-md hover:bg-green-600">Edit</button>
                                    <button className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600">Hapus</button>
                                    <button className="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">Logout</button>
                                    <button 
                                        onClick={() => navigateTo('aiAgentEditor', { senderId: sender.id })} 
                                        className="px-3 py-1 text-xs font-medium text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
                                    >
                                        AI Agent
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);


// --- [BARU] /src/pages/AiAgentsListPage.jsx ---
// Halaman untuk menampilkan daftar AI Agent dalam bentuk kartu
export const AiAgentsListPage = ({ navigateTo }) => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">AI Agent</h2>
            <button onClick={() => navigateTo('aiAgentEditor', { isCreating: true })} className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors">
                <PlusCircle size={20} className="mr-2" />
                Tambah AI Agent
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockData.aiAgents.map(agent => (
                <div key={agent.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                        <BrainCircuit className="text-indigo-500" size={32} />
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${agent.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{agent.status}</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 mt-4">{agent.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">Perusahaan: {agent.company}</p>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <button onClick={() => navigateTo('aiAgentEditor', { aiAgentId: agent.id })} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                            Kelola Agent
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


// --- [BARU] /src/pages/AiAgentEditorPage.jsx ---
// Halaman untuk membuat atau mengedit AI Agent
export const AiAgentEditorPage = ({ navigateTo, params }) => {
    // Menentukan apakah ini mode membuat baru atau mengedit
    const isCreating = params.isCreating;
    
    // Mencari data sender dan agent berdasarkan parameter
    const sender = mockData.senders.find(s => s.id === params.senderId);
    const agent = isCreating 
        ? { name: 'Agent Baru', company: '', behavior: '', status: 'Nonaktif', disableOnManualReply: true, canReadMessages: true, knowledgeBases: [] }
        : mockData.aiAgents.find(a => a.id === (sender?.aiAgentId || params.aiAgentId)) || { name: 'Agent Tidak Ditemukan', knowledgeBases: [] };

    const [activeTab, setActiveTab] = useState('behavior');
    const [botName, setBotName] = useState(agent.name);
    const [isAiActive, setIsAiActive] = useState(agent.status === 'Aktif');
    const [disableOnManual, setDisableOnManual] = useState(agent.disableOnManualReply);
    const [aiCanRead, setAiCanRead] = useState(agent.canReadMessages);
    
    // Menentukan tujuan tombol kembali
    const backDestination = params.senderId ? 'senders' : 'aiAgentsList';

    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 mb-6">
                <button onClick={() => navigateTo(backDestination)} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                    <ArrowLeft size={16} className="mr-2" />
                    Kembali ke Daftar {backDestination === 'senders' ? 'Sender' : 'AI Agent'}
                </button>
            </div>
            <div className="flex-1 lg:flex gap-6">
                {/* Editor Utama */}
                <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-md p-6 flex flex-col mb-6 lg:mb-0">
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8">
                            <button onClick={() => setActiveTab('behavior')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'behavior' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                Bot Behavior
                            </button>
                            <button onClick={() => setActiveTab('knowledge')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'knowledge' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                Bot Knowledge
                            </button>
                        </nav>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {activeTab === 'behavior' && (
                            <form className="space-y-6">
                                {/* Form fields for Bot Behavior */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nama Bot</label>
                                    <input type="text" value={botName} onChange={e => setBotName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Produk / Perusahaan</label>
                                    <input type="text" defaultValue={agent.company} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Behavior</label>
                                    <textarea rows="4" defaultValue={agent.behavior} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Status AI</span>
                                    <Switch enabled={isAiActive} setEnabled={setIsAiActive} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Matikan AI jika dibalas manual</span>
                                    <Switch enabled={disableOnManual} setEnabled={setDisableOnManual} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">AI baca pesan</span>
                                    <Switch enabled={aiCanRead} setEnabled={setAiCanRead} />
                                </div>
                            </form>
                        )}
                        {activeTab === 'knowledge' && (
                            <div className="space-y-4">
                                {agent.knowledgeBases.map(kb => (
                                    <div key={kb.id} className="border border-gray-200 rounded-lg p-4">
                                        <input type="text" defaultValue={kb.title} placeholder="Judul Knowledge" className="text-md font-bold w-full border-0 p-0 focus:ring-0" />
                                        <textarea rows="3" defaultValue={kb.content} placeholder="Isi dengan teks pengetahuan, FAQ, atau info produk..." className="mt-2 text-sm w-full border-gray-200 rounded-md"></textarea>
                                        <div className="mt-3 flex items-center gap-4 text-gray-500">
                                            <button className="flex items-center gap-1 hover:text-indigo-600"><ImageIcon size={16}/> Foto</button>
                                            <button className="flex items-center gap-1 hover:text-indigo-600"><Video size={16}/> Video</button>
                                            <button className="flex items-center gap-1 hover:text-indigo-600"><Paperclip size={16}/> Link</button>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full text-center py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-indigo-500 hover:text-indigo-600">
                                    + Tambah Knowledge Base
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="mt-6 flex-shrink-0 flex justify-end gap-3">
                        <button className="bg-white py-2 px-4 border border-gray-300 rounded-md">Batal</button>
                        <button className="bg-indigo-600 text-white py-2 px-4 rounded-md">Simpan Perubahan</button>
                    </div>
                </div>
                {/* Kartu Profil Sender */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h4 className="font-bold text-gray-800 mb-4">Sender Terhubung</h4>
                        {sender ? (
                            <div className="flex items-center gap-4">
                                <img src={`https://i.pravatar.cc/150?u=${sender.phone}`} alt="Sender" className="w-16 h-16 rounded-full" />
                                <div>
                                    <p className="font-bold text-lg">{sender.name}</p>
                                    <p className="text-gray-500">{sender.phone}</p>
                                    <span className={`mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${sender.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{sender.status}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">Agent ini belum terhubung ke sender manapun.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- [REVISI] /src/App.jsx ---
// Logika navigasi diperbarui untuk mendukung alur baru
export default function App() {
  const [currentView, setCurrentView] = useState({ page: 'senders', params: {} });

  const navigateTo = (page, params = {}) => {
    setCurrentView({ page, params });
  };

  const renderPage = () => {
    switch (currentView.page) {
      case 'senders':
        return <SendersPage navigateTo={navigateTo} />;
      case 'aiAgentsList':
        return <AiAgentsListPage navigateTo={navigateTo} />;
      case 'aiAgentEditor':
        return <AiAgentEditorPage navigateTo={navigateTo} params={currentView.params} />;
      // Tambahkan case untuk halaman lain (Dashboard, Contacts, dll) di sini saat Anda siap
      // case 'dashboard':
      //   return <DashboardPage />;
      default:
        return <SendersPage navigateTo={navigateTo} />; // Default ke halaman sender
    }
  };

  // Anda perlu komponen Sidebar dan Header di sini
  // Saya akan menambahkannya untuk kelengkapan
  const Sidebar = ({ activePage, navigateTo }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Beranda', icon: Home },
        { id: 'senders', label: 'Sender WhatsApp', icon: Send },
        { id: 'contacts', label: 'Daftar Kontak', icon: Users },
        { id: 'groups', label: 'Daftar Grup', icon: Group },
        { id: 'blasts', label: 'Blast', icon: MessageSquareText },
    ];
    return (
        <div className="w-64 bg-indigo-900 text-white flex-col h-screen flex-shrink-0 hidden md:flex">
            <div className="flex items-center justify-center h-20 border-b border-indigo-800">
                <MessageSquareText className="text-white" size={28} />
                <h1 className="text-2xl font-bold ml-3">WA-Man</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map(item => (
                    <a key={item.id} href="#" onClick={(e) => { e.preventDefault(); navigateTo(item.id); }}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activePage === item.id ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-indigo-800'}`}>
                        <item.icon className="w-5 h-5 mr-4" />
                        <span>{item.label}</span>
                    </a>
                ))}
            </nav>
        </div>
    );
  };
  const Header = () => (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center z-20">
        {/* Konten Header */}
    </header>
  );

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
