import React, { useState, useEffect, useRef } from 'react';
import { 
    Trash2, PlusCircle, Edit, Send, 
    Image as ImageIcon, Smile, FileText, Mic, Video, X
} from 'lucide-react';
import Switch from './common/Switch';
import Modal from './common/Modal';

// Komponen Modal dengan validasi ukuran file
const KnowledgeBaseModal = ({ isOpen, onClose, onSave, kbData: initialKbData }) => {
    const defaultKbState = { title: '', category: 'Panduan', content: '', files: [] };
    const [kbData, setKbData] = useState(initialKbData || defaultKbState);
    const fileInputRef = useRef(null);

    useEffect(() => {
        setKbData({ ...defaultKbState, ...(initialKbData || {}) });
    }, [initialKbData, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setKbData(prev => ({ ...prev, [name]: value }));
    };

    // [PERBAIKAN] Fungsi ini sekarang memiliki validasi ukuran file
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const IMAGE_MAX_SIZE_MB = 1;
        const PDF_MAX_SIZE_MB = 2;
        const imageLimitBytes = IMAGE_MAX_SIZE_MB * 1024 * 1024;
        const pdfLimitBytes = PDF_MAX_SIZE_MB * 1024 * 1024;

        // Validasi untuk gambar
        if (file.type.startsWith('image/')) {
            if (file.size > imageLimitBytes) {
                alert(`Ukuran gambar tidak boleh melebihi ${IMAGE_MAX_SIZE_MB} MB.`);
                return; // Hentikan proses jika file terlalu besar
            }
        } 
        // Validasi untuk PDF
        else if (file.type === 'application/pdf') {
            if (file.size > pdfLimitBytes) {
                alert(`Ukuran dokumen PDF tidak boleh melebihi ${PDF_MAX_SIZE_MB} MB.`);
                return; // Hentikan proses jika file terlalu besar
            }
        } 
        // Tolak file lain
        else {
            alert('Tipe file tidak didukung. Harap unggah gambar (jpg, png) atau PDF.');
            return;
        }

        // Jika validasi lolos, lanjutkan proses pembacaan file
        const reader = new FileReader();
        reader.onload = (e) => {
            const newFile = {
                id: `kb_file_${Date.now()}`,
                name: file.name,
                type: file.type,
                dataUrl: e.target.result
            };
            setKbData(prev => ({ ...prev, files: [...(prev.files || []), newFile] }));
        };
        reader.readAsDataURL(file);
        
        event.target.value = null;
    };

    const removeFile = (fileId) => {
        setKbData(prev => ({ ...prev, files: prev.files.filter(f => f.id !== fileId) }));
    };
    
    const handleFileToolbarClick = (accept) => fileInputRef.current && (fileInputRef.current.accept = accept, fileInputRef.current.click());
    const handleInsertText = (text) => setKbData(prev => ({ ...prev, content: prev.content + text }));

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={kbData && kbData.id ? "Edit Knowledge Base" : "Tambah Knowledge Base"}>
            <form onSubmit={(e) => { e.preventDefault(); onSave(kbData); }}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                        <input name="title" type="text" value={kbData.title} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                        <select name="category" value={kbData.category} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md">
                            <option>Panduan</option>
                            <option>Layanan</option>
                            <option>Produk</option>
                            <option>Best Practice</option>
                            <option>Tips & Trik</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Konten</label>
                        <div className="border border-gray-300 rounded-t-md p-2 flex items-center space-x-3 bg-gray-50">
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                            <button type="button" title="Sisipkan Gambar atau PDF" onClick={() => handleFileToolbarClick('image/*,application/pdf')} className="p-1 text-gray-600 hover:text-indigo-600"><FileText size={18} /></button>
                            <button type="button" title="Sisipkan Emoji" onClick={() => handleInsertText('💡✨✅')} className="p-1 text-gray-600 hover:text-indigo-600"><Smile size={18} /></button>
                        </div>
                        <textarea name="content" rows="5" value={kbData.content} onChange={handleInputChange} className="block w-full px-3 py-2 border-l border-r border-b border-gray-300 rounded-b-md" placeholder="Isi dengan pengetahuan..."></textarea>
                        {kbData.files && kbData.files.length > 0 && (
                            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {kbData.files.map(file => (
                                    <div key={file.id} className="relative group border rounded-lg overflow-hidden">
                                        {file.type.startsWith('image/') ? <img src={file.dataUrl} alt={file.name} className="h-24 w-full object-cover" /> : <div className="h-24 w-full flex flex-col items-center justify-center bg-gray-100 p-2"><FileText className="w-8 h-8 text-gray-500" /><span className="text-xs text-center text-gray-600 mt-2 truncate">{file.name}</span></div>}
                                        <button onClick={() => removeFile(file.id)} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"><X size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md">Batal</button>
                    <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded-md">Simpan</button>
                </div>
            </form>
        </Modal>
    );
};


// Komponen TestConversationUI (Tidak perlu diubah dari versi terakhir)
const TestConversationUI = ({ agentState }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const newUserMessage = { role: 'user', content: input };
        const newMessages = [...messages, newUserMessage];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        // [PENTING] Tidak ada lagi optimasi di sini. Kita kirim seluruh agentState
        // agar backend bisa mengakses dataUrl dari file PDF.
        try {
            const response = await fetch('http://localhost:5001/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userInput: input,
                    conversationHistory: messages.map(({ role, content }) => ({ role, content })), 
                    agentState: agentState, 
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Network response was not ok');
            }

            const data = await response.json();
            const botResponse = { role: 'assistant', content: data.reply };
            setMessages(prevMessages => [...prevMessages, botResponse]);

        } catch (error) {
            console.error("Error fetching AI response:", error);
            const errorResponse = { role: 'assistant', content: `Maaf, terjadi kesalahan: ${error.message}` };
            setMessages(prevMessages => [...prevMessages, errorResponse]);
        } finally {
            setIsTyping(false);
        }
    };
    
    return (
        <div className="border border-gray-200 rounded-xl flex flex-col h-[600px] bg-white">
            <div className="p-4 border-b">
                <h4 className="font-bold text-gray-800">Uji Coba Percakapan</h4>
                <p className="text-xs text-gray-500">Tes perilaku agent Anda secara langsung.</p>
            </div>
            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
                {messages.length === 0 && <p className="text-center text-sm text-gray-400">Mulai percakapan untuk melihat respon bot...</p>}
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg whitespace-pre-wrap ${msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg">
                            <span className="animate-pulse">Bot sedang mengetik...</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4 border-t bg-white flex items-center gap-2">
                <input 
                    type="text" 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyPress={e => e.key === 'Enter' && handleSend()} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
                    placeholder="Ketik pesan..." 
                    disabled={isTyping || agentState.status !== 'Aktif'} 
                />
                <button 
                    onClick={handleSend} 
                    className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed flex-shrink-0" 
                    disabled={!input.trim() || isTyping || agentState.status !== 'Aktif'}
                    title={agentState.status !== 'Aktif' ? 'Aktifkan status AI untuk memulai percakapan' : 'Kirim pesan'}
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
};


// Komponen Utama Form
const AiAgentForm = ({ initialData, onSubmit, onCancel, submitButtonText }) => {
    const defaultAgentState = { name: '', company: '', tone: 'Santai', behavior: '', status: 'Nonaktif', disableOnManualReply: true, canReadMessages: true, knowledgeBases: [], files: [] };
    const [agent, setAgent] = useState(initialData || defaultAgentState);
    const [activeTab, setActiveTab] = useState('behavior');
    
    const [isKbModalOpen, setIsKbModalOpen] = useState(false);
    const [currentKb, setCurrentKb] = useState(null);

    const fileInputRef = useRef(null);

    useEffect(() => { 
        const data = { ...defaultAgentState, ...(initialData || {}) };
        setAgent(data);
    }, [initialData]);

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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newFile = { id: `file_${Date.now()}`, name: file.name, type: file.type, dataUrl: e.target.result };
                setAgent(prev => ({ ...prev, files: [...(prev.files || []), newFile] }));
            };
            reader.readAsDataURL(file);
        }
        event.target.value = null; 
    };
    
    const removeFile = (fileId) => {
        setAgent(prev => ({ ...prev, files: prev.files.filter(f => f.id !== fileId) }));
    };

    const handleInsertText = (text) => setAgent(prev => ({ ...prev, behavior: prev.behavior + text }));
    const handleEmojiClick = () => handleInsertText(' 😊👍🎉 ');
    const handleFileToolbarClick = (accept) => fileInputRef.current && (fileInputRef.current.accept = accept, fileInputRef.current.click());

    const handleOpenKbModal = (kb = null) => {
        setCurrentKb(kb);
        setIsKbModalOpen(true);
    };

    const handleCloseKbModal = () => {
        setIsKbModalOpen(false);
        setCurrentKb(null);
    };

    const handleSaveKb = (savedKbData) => {
        let updatedKbs;
        if (savedKbData.id) {
            updatedKbs = (agent.knowledgeBases || []).map(kb => kb.id === savedKbData.id ? savedKbData : kb);
        } else {
            const newKb = { ...savedKbData, id: `kb_${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
            updatedKbs = [...(agent.knowledgeBases || []), newKb];
        }
        setAgent(prev => ({ ...prev, knowledgeBases: updatedKbs }));
        handleCloseKbModal();
    };
    
    const handleRemoveKb = (kbId) => {
        const updatedKbs = agent.knowledgeBases.filter(kb => kb.id !== kbId);
        setAgent(prev => ({ ...prev, knowledgeBases: updatedKbs }));
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
                <form onSubmit={handleSubmit} className={activeTab === 'test' ? 'hidden' : 'flex flex-col h-full'}>
                    <div className="flex-1">
                        {activeTab === 'behavior' && (
                             <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bot</label>
                                    <input type="text" name="name" value={agent.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Produk / Perusahaan</label>
                                    <input type="text" name="company" value={agent.company} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gaya Bahasa</label>
                                    <select name="tone" value={agent.tone} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                        <option>Formal</option>
                                        <option>Profesional</option>
                                        <option>Santai</option>
                                        <option>Humoris</option>
                                        <option>Percakapan sehari-hari</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Behavior</label>
                                    <div className="border border-gray-300 rounded-t-md p-2 flex items-center space-x-3 bg-gray-50">
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                        <button type="button" title="Sisipkan Gambar" onClick={() => handleFileToolbarClick('image/*')} className="p-1 text-gray-600 hover:text-indigo-600"><ImageIcon size={18} /></button>
                                        <button type="button" title="Sisipkan Video" onClick={() => handleFileToolbarClick('video/*')} className="p-1 text-gray-600 hover:text-indigo-600"><Video size={18} /></button>
                                        <button type="button" title="Sisipkan Dokumen (PDF)" onClick={() => handleFileToolbarClick('.pdf')} className="p-1 text-gray-600 hover:text-indigo-600"><FileText size={18} /></button>
                                        <button type="button" title="Sisipkan Suara" onClick={() => handleFileToolbarClick('audio/*')} className="p-1 text-gray-600 hover:text-indigo-600"><Mic size={18} /></button>
                                        <button type="button" title="Sisipkan Emoji" onClick={handleEmojiClick} className="p-1 text-gray-600 hover:text-indigo-600"><Smile size={18} /></button>
                                    </div>
                                    <textarea rows="6" name="behavior" value={agent.behavior} onChange={handleInputChange} className="block w-full px-3 py-2 border-l border-r border-b border-gray-300 rounded-b-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Jelaskan bagaimana bot harus bersikap..."></textarea>
                                    {agent.files && agent.files.length > 0 && (
                                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {agent.files.map(file => (
                                                <div key={file.id} className="relative group border rounded-lg overflow-hidden">
                                                    {file.type.startsWith('image/') ? <img src={file.dataUrl} alt={file.name} className="h-24 w-full object-cover" /> : <div className="h-24 w-full flex flex-col items-center justify-center bg-gray-100 p-2"><FileText className="w-8 h-8 text-gray-500" /><span className="text-xs text-center text-gray-600 mt-2 truncate">{file.name}</span></div>}
                                                    <button onClick={() => removeFile(file.id)} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
                                    <button type="button" onClick={() => handleOpenKbModal(null)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700">
                                        <PlusCircle size={18}/> Tambah Knowledge
                                    </button>
                                </div>
                                <div className="overflow-x-auto border rounded-lg">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                                            <tr>
                                                <th className="px-4 py-3">Judul</th>
                                                <th className="px-4 py-3">Kategori</th>
                                                <th className="px-4 py-3">Dibuat</th>
                                                <th className="px-4 py-3 text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {agent.knowledgeBases && agent.knowledgeBases.length > 0 ? agent.knowledgeBases.map((kb) => (
                                                <tr key={kb.id} className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-medium text-gray-900">{kb.title}</td>
                                                    <td className="px-4 py-3 text-gray-600">{kb.category}</td>
                                                    <td className="px-4 py-3 text-gray-500">{kb.createdAt}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex justify-center gap-2">
                                                            <button type="button" onClick={() => handleOpenKbModal(kb)} className="p-2 text-blue-600 hover:text-blue-800"><Edit size={16}/></button>
                                                            <button type="button" onClick={() => handleRemoveKb(kb.id)} className="p-2 text-red-600 hover:text-red-800"><Trash2 size={16}/></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
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
            
            <KnowledgeBaseModal isOpen={isKbModalOpen} onClose={handleCloseKbModal} onSave={handleSaveKb} kbData={currentKb} />
        </div>
    );
};

export default AiAgentForm;
