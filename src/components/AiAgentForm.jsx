import React, { useState, useEffect, useRef } from 'react';
import { 
    Trash2, PlusCircle, Edit, Send, 
    Image as ImageIcon, Smile, FileText, Mic, Video
} from 'lucide-react';
import Switch from './common/Switch';
import Modal from './common/Modal';

// Komponen Modal Knowledge Base (Tidak ada perubahan)
const KnowledgeBaseModal = ({ isOpen, onClose, onSave, kbData, setKbData }) => {
    if (!isOpen) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={kbData && kbData.id ? "Edit Knowledge Base" : "Tambah Knowledge Base"}>
            <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                    <input type="text" value={kbData.title} onChange={(e) => setKbData({...kbData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Konten</label>
                    <textarea rows="4" value={kbData.content} onChange={(e) => setKbData({...kbData, content: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" required></textarea>
                </div>
                <div className="flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md">Batal</button>
                    <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded-md">Simpan</button>
                </div>
            </form>
        </Modal>
    );
};

// Komponen Test Conversation (Tidak ada perubahan)
const TestConversationUI = ({ agentState }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        const newUserMessage = { sender: 'user', text: input };
        
        const botBehavior = agentState.behavior || "belum diatur";
        const botResponse = { 
            sender: 'bot', 
            text: `(Respon Tes) Pesan Anda: "${input}".\n\nPerilaku bot saat ini: "${botBehavior}"` 
        };

        setMessages([...messages, newUserMessage, botResponse]);
        setInput('');
    };
    
    return (
        <div className="border border-gray-200 rounded-xl flex flex-col h-[550px] bg-white">
            <div className="p-4 border-b">
                <h4 className="font-bold text-gray-800">Uji Coba Percakapan</h4>
                <p className="text-xs text-gray-500">Tes perilaku agent Anda secara langsung.</p>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
                {messages.length === 0 && <p className="text-center text-sm text-gray-400">Mulai percakapan untuk melihat respon bot...</p>}
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t bg-white flex items-center gap-2">
                <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="Ketik pesan..." />
                <button onClick={handleSend} className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 flex-shrink-0" disabled={!input.trim()}>
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}

const AiAgentForm = ({ initialData, onSubmit, onCancel, submitButtonText }) => {
    const defaultAgentState = { name: '', company: '', behavior: '', status: 'Nonaktif', disableOnManualReply: true, canReadMessages: true, knowledgeBases: [] };
    const [agent, setAgent] = useState(initialData || defaultAgentState);
    const [activeTab, setActiveTab] = useState('behavior');
    
    const [isKbModalOpen, setIsKbModalOpen] = useState(false);
    const [currentKb, setCurrentKb] = useState({ title: '', content: ''});

    const fileInputRef = useRef(null);

    useEffect(() => { setAgent(initialData || defaultAgentState); }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAgent(prev => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (name, value) => {
        setAgent(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(agent);
    };

    // --- Logika untuk Toolbar di Textarea Behavior ---
    const handleInsertText = (textToInsert) => {
        setAgent(prev => ({
            ...prev,
            behavior: prev.behavior + textToInsert
        }));
    };

    const handleEmojiClick = () => {
        // Simulasi menyisipkan beberapa emoji
        handleInsertText(' 😊👍🎉 ');
    };

    const handleFileToolbarClick = (acceptType) => {
        if (fileInputRef.current) {
            fileInputRef.current.accept = acceptType;
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Simulasi: menyisipkan nama file sebagai placeholder ke dalam textarea
            handleInsertText(` [file: ${file.name}] `);
        }
        // Reset file input agar bisa memilih file yang sama lagi
        event.target.value = null; 
    };

    // --- Logika untuk Knowledge Base ---
    const handleOpenKbModal = (kb = null) => {
        setCurrentKb(kb || { title: '', content: '' });
        setIsKbModalOpen(true);
    };

    const handleCloseKbModal = () => {
        setIsKbModalOpen(false);
        setCurrentKb(null);
    };

    const handleSaveKb = () => {
        let updatedKbs;
        if (currentKb && currentKb.id) {
            updatedKbs = agent.knowledgeBases.map(kb => kb.id === currentKb.id ? currentKb : kb);
        } else {
            const newKb = { ...currentKb, id: `kb_${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
            updatedKbs = [...agent.knowledgeBases, newKb];
        }
        setAgent(prev => ({ ...prev, knowledgeBases: updatedKbs }));
        handleCloseKbModal();
    };
    
    const handleRemoveKb = (kbId) => {
        if(window.confirm('Anda yakin ingin menghapus knowledge base ini?')) {
            const updatedKbs = agent.knowledgeBases.filter(kb => kb.id !== kbId);
            setAgent(prev => ({ ...prev, knowledgeBases: updatedKbs }));
        }
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-md p-6 flex flex-col">
            <div className="flex justify-center border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-4 sm:space-x-8">
                    <button onClick={() => setActiveTab('behavior')} className={`whitespace-nowrap py-4 px-2 sm:px-4 border-b-2 font-medium text-sm ${activeTab === 'behavior' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Bot Behavior
                    </button>
                    <button onClick={() => setActiveTab('knowledge')} className={`whitespace-nowrap py-4 px-2 sm:px-4 border-b-2 font-medium text-sm ${activeTab === 'knowledge' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Bot Knowledge
                    </button>
                    <button onClick={() => setActiveTab('test')} className={`whitespace-nowrap py-4 px-2 sm:px-4 border-b-2 font-medium text-sm ${activeTab === 'test' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Test Conversation
                    </button>
                </nav>
            </div>

            <div className="flex-1">
                <form onSubmit={handleSubmit} className={activeTab === 'test' ? 'hidden' : 'flex flex-col'}>
                    <div className="flex-1">
                        {activeTab === 'behavior' && (
                             <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bot</label>
                                    <input type="text" name="name" value={agent.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Contoh: Bot Layanan Pelanggan" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Produk / Perusahaan</label>
                                    <input type="text" name="company" value={agent.company} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Contoh: PT Maju Jaya" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Behavior</label>
                                    <div className="border border-gray-300 rounded-t-md p-2 flex items-center space-x-3 bg-gray-50">
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                        <button type="button" title="Sisipkan Gambar" onClick={() => handleFileToolbarClick('image/*')} className="p-1 text-gray-600 hover:text-indigo-600"><ImageIcon size={18} /></button>
                                        <button type="button" title="Sisipkan Video" onClick={() => handleFileToolbarClick('video/*')} className="p-1 text-gray-600 hover:text-indigo-600"><Video size={18} /></button>
                                        <button type="button" title="Sisipkan Dokumen" onClick={() => handleFileToolbarClick('.pdf,.doc,.docx,.txt')} className="p-1 text-gray-600 hover:text-indigo-600"><FileText size={18} /></button>
                                        <button type="button" title="Sisipkan Suara" onClick={() => handleFileToolbarClick('audio/*')} className="p-1 text-gray-600 hover:text-indigo-600"><Mic size={18} /></button>
                                        <button type="button" title="Sisipkan Emoji" onClick={handleEmojiClick} className="p-1 text-gray-600 hover:text-indigo-600"><Smile size={18} /></button>
                                    </div>
                                    <textarea 
                                        rows="6" 
                                        name="behavior" 
                                        value={agent.behavior} 
                                        onChange={handleInputChange} 
                                        className="block w-full px-3 py-2 border-l border-r border-b border-gray-300 rounded-b-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                                        placeholder="Jelaskan bagaimana bot harus bersikap..."
                                    ></textarea>
                                </div>
                                <div className="border-t pt-6 space-y-4">
                                    <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-700">Status AI</span><Switch enabled={agent.status === 'Aktif'} setEnabled={(val) => handleSwitchChange('status', val ? 'Aktif' : 'Nonaktif')} /></div>
                                    <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-700">Matikan AI jika dibalas manual</span><Switch enabled={agent.disableOnManualReply} setEnabled={(val) => handleSwitchChange('disableOnManualReply', val)} /></div>
                                    <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-700">AI baca pesan</span><Switch enabled={agent.canReadMessages} setEnabled={(val) => handleSwitchChange('canReadMessages', val)} /></div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'knowledge' && (
                            <div className="space-y-4">
                                <div className="flex justify-end">
                                    <button type="button" onClick={() => handleOpenKbModal()} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700">
                                        <PlusCircle size={18}/> Tambah Knowledge
                                    </button>
                                </div>
                                <div className="overflow-x-auto border rounded-lg">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                                            <tr>
                                                <th className="px-4 py-3">No</th>
                                                <th className="px-4 py-3">Judul</th>
                                                <th className="px-4 py-3">Dibuat</th>
                                                <th className="px-4 py-3 text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {agent.knowledgeBases.map((kb, index) => (
                                                <tr key={kb.id} className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-3">{index + 1}</td>
                                                    <td className="px-4 py-3 font-medium text-gray-900">{kb.title}</td>
                                                    <td className="px-4 py-3 text-gray-500">{kb.createdAt}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex justify-center gap-2">
                                                            <button type="button" onClick={() => handleOpenKbModal(kb)} className="p-2 text-blue-600 hover:text-blue-800"><Edit size={16}/></button>
                                                            <button type="button" onClick={() => handleRemoveKb(kb.id)} className="p-2 text-red-600 hover:text-red-800"><Trash2 size={16}/></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {agent.knowledgeBases.length === 0 && (
                                                <tr><td colSpan="4" className="text-center py-8 text-gray-500">Belum ada knowledge base.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-6 flex-shrink-0 flex justify-end gap-3">
                        <button type="button" onClick={onCancel} className="bg-white py-2 px-4 border border-gray-300 rounded-md">Batal</button>
                        <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700">{submitButtonText}</button>
                    </div>
                </form>

                {activeTab === 'test' && (
                    <TestConversationUI agentState={agent} />
                )}
            </div>
            
            {activeTab === 'knowledge' && <KnowledgeBaseModal isOpen={isKbModalOpen} onClose={handleCloseKbModal} onSave={handleSaveKb} kbData={currentKb} setKbData={setCurrentKb} />}
        </div>
    );
};

export default AiAgentForm;
