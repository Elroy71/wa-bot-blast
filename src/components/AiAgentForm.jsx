import React, { useState, useEffect, useRef } from 'react';
import { Trash2, PlusCircle, Edit, Send, FileText, X } from 'lucide-react';
import Switch from './common/Switch';
import Modal from './common/Modal';

const API_URL = 'http://localhost:3000/api';

// --- Knowledge Base Modal ---
const KnowledgeBaseModal = ({ isOpen, onClose, onSave, kbData: initialKbData }) => {
    const defaultKbState = { title: '', category: 'Panduan', contentText: '', file: null };
    const [kbData, setKbData] = useState(initialKbData || defaultKbState);
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            const dataToEdit = {
                ...defaultKbState,
                ...(initialKbData || {}),
                contentText: initialKbData?.contentText || '',
                file: null, // Reset file input setiap kali modal dibuka
            };
            setKbData(dataToEdit);
            setFileName(initialKbData?.filePdf ? initialKbData.filePdf.split('/').pop() : '');
        }
    }, [initialKbData, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setKbData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Tipe file tidak didukung. Harap unggah file PDF.');
            return;
        }
        if (file.size > 2 * 1024 * 1024) { // 2MB
            alert('Ukuran dokumen PDF tidak boleh melebihi 2 MB.');
            return;
        }

        setKbData(prev => ({ ...prev, file: file }));
        setFileName(file.name);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSave(kbData);
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={kbData && kbData.id ? "Edit Knowledge Base" : "Tambah Knowledge Base"}>
            <form onSubmit={handleFormSubmit}>
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
                            <option>Best_Practice</option>
                            <option>Tips_Trik</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Konten</label>
                        <textarea name="contentText" rows="5" value={kbData.contentText} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Isi dengan pengetahuan..." required></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload File PDF (Opsional)</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                        <span>Upload sebuah file</span>
                                        <input id="file-upload" name="filePdf" ref={fileInputRef} type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" />
                                    </label>
                                    <p className="pl-1">atau tarik dan lepas</p>
                                </div>
                                <p className="text-xs text-gray-500">PDF hingga 2MB</p>
                                {fileName && <p className="text-sm font-semibold text-green-700 mt-2">{fileName}</p>}
                            </div>
                        </div>
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

// --- Test Conversation UI ---
const TestConversationUI = ({ agentId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const newUserMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, newUserMessage]);
        const currentInput = input;
        setInput('');
        setIsTyping(true);

        try {
            const response = await fetch(`${API_URL}/agents/${agentId}/test-chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userInput: currentInput,
                    conversationHistory: messages.map(({ role, content }) => ({ role, content })),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Network response was not ok');
            }

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: `Maaf, terjadi kesalahan: ${error.message}` }]);
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
                {messages.length === 0 && <p className="text-center text-sm text-gray-400">Mulai percakapan...</p>}
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg whitespace-pre-wrap ${msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isTyping && <div className="flex justify-start"><div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg"><span className="animate-pulse">Bot sedang mengetik...</span></div></div>}
            </div>
            <div className="p-4 border-t bg-white flex items-center gap-2">
                <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Ketik pesan..." disabled={isTyping} />
                <button onClick={handleSend} className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300" disabled={!input.trim() || isTyping}><Send size={20} /></button>
            </div>
        </div>
    );
};

// --- Komponen Utama Form ---
const AiAgentForm = ({ initialData, onSubmit, onCancel, submitButtonText }) => {
    const defaultAgentState = { id: null, name: '', company: '', languageStyle: 'Santai', behavior: '', status: 'Nonaktif', knowledgeBases: [] };
    const [agent, setAgent] = useState(initialData || defaultAgentState);
    const [activeTab, setActiveTab] = useState('behavior');
    const [isKbModalOpen, setIsKbModalOpen] = useState(false);
    const [currentKb, setCurrentKb] = useState(null);

    useEffect(() => {
        setAgent(initialData || defaultAgentState);
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAgent(prev => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (name, value) => {
        setAgent(prev => ({ ...prev, [name]: value }));
    };

    const handleOpenKbModal = (kb = null) => {
        setCurrentKb(kb);
        setIsKbModalOpen(true);
    };

    const handleCloseKbModal = () => {
        setIsKbModalOpen(false);
        setCurrentKb(null);
    };

    const handleSaveKb = async (savedKbData) => {
        const formData = new FormData();
        formData.append('title', savedKbData.title);
        formData.append('category', savedKbData.category);
        formData.append('contentText', savedKbData.contentText);
        if (savedKbData.file) {
            formData.append('filePdf', savedKbData.file);
        }

        const isEditing = !!savedKbData.id;
        const url = isEditing
            ? `${API_URL}/agents/${agent.id}/knowledge/${savedKbData.id}`
            : `${API_URL}/agents/${agent.id}/knowledge`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, { method, body: formData });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Gagal menyimpan knowledge base.');
            }
            const result = await response.json();
            
            setAgent(prev => {
                const updatedKbs = isEditing
                    ? prev.knowledgeBases.map(kb => kb.id === result.id ? result : kb)
                    : [...prev.knowledgeBases, result];
                return { ...prev, knowledgeBases: updatedKbs };
            });

            handleCloseKbModal();
        } catch (error) {
            alert(`Terjadi kesalahan: ${error.message}`);
        }
    };
    
    const handleRemoveKb = async (kbId) => {
        if (window.confirm("Yakin ingin menghapus knowledge base ini?")) {
            try {
                const response = await fetch(`${API_URL}/agents/${agent.id}/knowledge/${kbId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Gagal menghapus.');
                
                setAgent(prev => ({ ...prev, knowledgeBases: prev.knowledgeBases.filter(kb => kb.id !== kbId) }));
            } catch (error) {
                alert(error.message);
            }
        }
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-md p-6 flex flex-col">
            <div className="flex justify-center border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-4 sm:space-x-8">
                    <button onClick={() => setActiveTab('behavior')} className={`whitespace-nowrap py-4 px-2 sm:px-4 border-b-2 font-medium text-sm ${activeTab === 'behavior' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Bot Behavior</button>
                    <button onClick={() => setActiveTab('knowledge')} className={`whitespace-nowrap py-4 px-2 sm:px-4 border-b-2 font-medium text-sm ${activeTab === 'knowledge' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Bot Knowledge</button>
                    <button onClick={() => setActiveTab('test')} className={`whitespace-nowrap py-4 px-2 sm:px-4 border-b-2 font-medium text-sm ${activeTab === 'test' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Test Conversation</button>
                </nav>
            </div>

            <div className="flex-1">
                <div className={activeTab === 'test' ? 'hidden' : 'flex flex-col h-full'}>
                    <div className="flex-1">
                        {activeTab === 'behavior' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bot</label>
                                    <input type="text" name="name" value={agent.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Produk / Perusahaan</label>
                                    <input type="text" name="company" value={agent.company} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gaya Bahasa</label>
                                    <select name="languageStyle" value={agent.languageStyle} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md">
                                        <option>Formal</option>
                                        <option>Profesional</option>
                                        <option>Santai</option>
                                        <option>Humoris</option>
                                        <option>Percakapan_sehari_hari</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Behavior</label>
                                    <textarea rows="6" name="behavior" value={agent.behavior} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Jelaskan bagaimana bot harus bersikap..."></textarea>
                                </div>
                                <div className="border-t pt-6 space-y-4">
                                    <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-700">Status AI</span><Switch enabled={agent.status === 'Aktif'} setEnabled={(val) => handleSwitchChange('status', val ? 'Aktif' : 'Nonaktif')} /></div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'knowledge' && (
                            <div className="space-y-4">
                                <div className="flex justify-end">
                                    <button type="button" onClick={() => handleOpenKbModal(null)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"><PlusCircle size={18}/> Tambah Knowledge</button>
                                </div>
                                <div className="overflow-x-auto border rounded-lg">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                                            <tr>
                                                <th className="px-4 py-3">Judul</th>
                                                <th className="px-4 py-3">Kategori</th>
                                                <th className="px-4 py-3">File</th>
                                                <th className="px-4 py-3 text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {agent.knowledgeBases && agent.knowledgeBases.length > 0 ? agent.knowledgeBases.map((kb) => (
                                                <tr key={kb.id} className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-medium text-gray-900">{kb.title}</td>
                                                    <td className="px-4 py-3 text-gray-600">{kb.category}</td>
                                                    <td className="px-4 py-3 text-gray-600">{kb.filePdf ? <a href={`${API_URL}${kb.filePdf}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Lihat File</a> : 'Tidak ada'}</td>
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
                        <button type="button" onClick={() => onSubmit(agent)} className="bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700">{submitButtonText}</button>
                    </div>
                </div>

                {activeTab === 'test' && agent.id && (
                    <TestConversationUI agentId={agent.id} />
                )}
            </div>
            
            <KnowledgeBaseModal isOpen={isKbModalOpen} onClose={handleCloseKbModal} onSave={handleSaveKb} kbData={currentKb} />
        </div>
    );
};

export default AiAgentForm;
