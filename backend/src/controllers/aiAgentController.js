// Import Prisma Client
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs'); // File sistem module untuk menghapus file
const path = require('path');
const OpenAI = require('openai');
const pdf = require('pdf-parse'); // <-- Import pdf-parse

// Inisialisasi client OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


// Fungsi untuk memetakan status dari Frontend (String) ke Backend (Enum)
const mapStatusToEnum = (statusString) => {
    if (statusString.toLowerCase() === 'aktif') return 'active';
    if (statusString.toLowerCase() === 'nonaktif') return 'inactive';
    return 'inactive'; // Default value
};

// 1. CREATE a new AiAgent
const createAgent = async (req, res) => {
    const { name, company, languageStyle, behavior, status } = req.body;

    // Validasi input dasar
    if (!name || !behavior) {
        return res.status(400).json({ error: 'Nama dan Behavior harus diisi.' });
    }

    try {
        const newAgent = await prisma.aiAgent.create({
            data: {
                name,
                company,
                languageStyle, // Enum di Prisma sudah sesuai dengan nilai dari frontend
                behavior,
                // Map string "Aktif"/"Nonaktif" dari frontend ke enum 'active'/'inactive'
                status: mapStatusToEnum(status),
            },
        });
        res.status(201).json(newAgent);
    } catch (error) {
        console.error("Error saat membuat agent:", error);
        res.status(500).json({ error: 'Gagal membuat AI Agent baru.' });
    }
};

// 2. READ all AiAgents
const getAllAgents = async (req, res) => {
    try {
        const agents = await prisma.aiAgent.findMany({
            // Sertakan data sender yang terhubung untuk ditampilkan di frontend
            include: {
                connectedSender: true,
            },
            orderBy: {
                createdAt: 'desc', // Tampilkan yang terbaru di atas
            },
        });
        res.status(200).json(agents);
    } catch (error) {
        console.error("Error saat mengambil semua agent:", error);
        res.status(500).json({ error: 'Gagal mengambil data AI Agents.' });
    }
};

// 3. READ a single AiAgent by ID
const getAgentById = async (req, res) => {
    const { id } = req.params;
    try {
        const agent = await prisma.aiAgent.findUnique({
            where: { id: parseInt(id) },
            // Sertakan juga semua data relasi untuk halaman edit
            include: {
                connectedSender: true,
                knowledge: true,
                testConversations: true,
            },
        });

        if (!agent) {
            return res.status(404).json({ error: 'AI Agent tidak ditemukan.' });
        }

        res.status(200).json(agent);
    } catch (error) {
        console.error(`Error saat mengambil agent dengan ID ${id}:`, error);
        res.status(500).json({ error: 'Gagal mengambil data AI Agent.' });
    }
};

// 4. UPDATE an existing AiAgent
const updateAgent = async (req, res) => {
    const { id } = req.params;
    const { name, company, languageStyle, behavior, status } = req.body;

    try {
        const updatedAgent = await prisma.aiAgent.update({
            where: { id: parseInt(id) },
            data: {
                name,
                company,
                languageStyle,
                behavior,
                status: mapStatusToEnum(status),
            },
        });
        res.status(200).json(updatedAgent);
    } catch (error) {
        console.error(`Error saat memperbarui agent dengan ID ${id}:`, error);
        // Cek jika error karena data tidak ditemukan
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'AI Agent tidak ditemukan untuk diperbarui.' });
        }
        res.status(500).json({ error: 'Gagal memperbarui AI Agent.' });
    }
};

// 5. DELETE an AiAgent
const deleteAgent = async (req, res) => {
    const { id } = req.params;
    try {
        // Prisma akan menghapus agent dan semua relasinya (knowledge, test conversations)
        // karena kita menggunakan onDelete: Cascade di skema.
        await prisma.aiAgent.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send(); // No Content
    } catch (error) {
        console.error(`Error saat menghapus agent dengan ID ${id}:`, error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'AI Agent tidak ditemukan untuk dihapus.' });
        }
        res.status(500).json({ error: 'Gagal menghapus AI Agent.' });
    }
};

// 6. CONNECT an AiAgent to a WhatsappSender
const connectAgentToSender = async (req, res, next) => {
    const { id: agentId } = req.params;
    const { senderId } = req.body;

    if (!senderId) {
        return res.status(400).json({ error: 'senderId harus disertakan dalam body request.' });
    }

    try {
        // Gunakan transaksi untuk memastikan kedua update berhasil atau gagal bersamaan
        const result = await prisma.$transaction(async (tx) => {
            // 1. Cek apakah sender ada dan belum terhubung
            const sender = await tx.whatsappSender.findUnique({
                where: { id: parseInt(senderId) },
            });

            if (!sender) {
                // Buat error custom untuk ditangkap di blok catch
                throw { code: 'CUSTOM', status: 404, message: 'Whatsapp Sender tidak ditemukan.' };
            }
            if (sender.status === 'paired') {
                throw { code: 'CUSTOM', status: 409, message: 'Whatsapp Sender ini sudah terhubung dengan agent lain.' };
            }

            // 2. Update status sender menjadi 'paired'
            await tx.whatsappSender.update({
                where: { id: parseInt(senderId) },
                data: { status: 'paired' },
            });

            // 3. Hubungkan agent ke sender
            const updatedAgent = await tx.aiAgent.update({
                where: { id: parseInt(agentId) },
                data: {
                    connectedSender: {
                        connect: { id: parseInt(senderId) },
                    },
                },
                include: {
                    connectedSender: true,
                },
            });

            return updatedAgent;
        });

        res.status(200).json(result);

    } catch (error) {
        // Menangkap error custom dari transaksi
        if (error.code === 'CUSTOM') {
            return res.status(error.status).json({ error: error.message });
        }
        // Teruskan error lain (misal: agent tidak ditemukan oleh Prisma) ke errorHandler
        next(error);
    }
};

// 7. DISCONNECT an AiAgent from a WhatsappSender
const disconnectAgentFromSender = async (req, res, next) => {
    const { id: agentId } = req.params;

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Cari agent dan ID sender yang terhubung
            const agent = await tx.aiAgent.findUnique({
                where: { id: parseInt(agentId) },
                select: { senderId: true },
            });

            if (!agent) {
                throw { code: 'CUSTOM', status: 404, message: 'AI Agent tidak ditemukan.' };
            }

            if (!agent.senderId) {
                throw { code: 'CUSTOM', status: 400, message: 'AI Agent ini tidak sedang terhubung dengan sender manapun.' };
            }

            const senderIdToDisconnect = agent.senderId;

            // 2. Putuskan koneksi agent (set senderId menjadi null)
            const updatedAgent = await tx.aiAgent.update({
                where: { id: parseInt(agentId) },
                data: {
                    connectedSender: {
                        disconnect: true,
                    },
                },
            });

            // 3. Update status sender kembali menjadi 'unpaired'
            await tx.whatsappSender.update({
                where: { id: senderIdToDisconnect },
                data: { status: 'unpaired' },
            });

            return updatedAgent;
        });

        res.status(200).json(result);

    } catch (error) {
        if (error.code === 'CUSTOM') {
            return res.status(error.status).json({ error: error.message });
        }
        next(error);
    }
};

// 8. ADD a Knowledge Base to an AiAgent
const addKnowledge = async (req, res, next) => {
    const { agentId } = req.params;
    const { title, category, contentText } = req.body;

    if (!title || !contentText) {
        return res.status(400).json({ error: 'Judul dan Konten harus diisi.' });
    }

    try {
        let fileUrl = null;
        // Cek apakah ada file yang di-upload
        if (req.file) {
            // Buat URL yang bisa diakses publik
            fileUrl = `/uploads/${req.file.filename}`;
        }

        const newKnowledge = await prisma.aiKnowledge.create({
            data: {
                title,
                category, // Enum di Prisma sudah sesuai
                contentText,
                filePdf: fileUrl, // Simpan path URL file, bukan path sistem
                aiAgent: {
                    connect: { id: parseInt(agentId) }
                }
            }
        });

        res.status(201).json(newKnowledge);
    } catch (error) {
        next(error);
    }
};

// 9. UPDATE a Knowledge Base
const updateKnowledge = async (req, res, next) => {
    const { kbId } = req.params;
    const { title, category, contentText } = req.body;

    try {
        // 1. Dapatkan data knowledge yang ada untuk memeriksa file lama
        const existingKnowledge = await prisma.aiKnowledge.findUnique({
            where: { id: parseInt(kbId) }
        });

        if (!existingKnowledge) {
            return res.status(404).json({ error: 'Knowledge Base tidak ditemukan.' });
        }

        const updateData = {
            title,
            category,
            contentText,
        };

        // 2. Jika ada file baru yang di-upload
        if (req.file) {
            // Hapus file lama jika ada
            if (existingKnowledge.filePdf) {
                const oldFilePath = path.join(__dirname, '../../public', existingKnowledge.filePdf);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
            // Set path file yang baru
            updateData.filePdf = `/uploads/${req.file.filename}`;
        }

        // 3. Update data di database
        const updatedKnowledge = await prisma.aiKnowledge.update({
            where: { id: parseInt(kbId) },
            data: updateData
        });

        res.status(200).json(updatedKnowledge);

    } catch (error) {
        next(error);
    }
};

// 10. DELETE a Knowledge Base
const deleteKnowledge = async (req, res, next) => {
    const { kbId } = req.params;

    try {
        // 1. Cari knowledge untuk mendapatkan path file sebelum dihapus dari DB
        const knowledgeToDelete = await prisma.aiKnowledge.findUnique({
            where: { id: parseInt(kbId) }
        });

        if (!knowledgeToDelete) {
            return res.status(404).json({ error: 'Knowledge Base tidak ditemukan.' });
        }

        // 2. Hapus record dari database
        await prisma.aiKnowledge.delete({
            where: { id: parseInt(kbId) }
        });

        // 3. Hapus file fisik dari server jika ada
        if (knowledgeToDelete.filePdf) {
            const filePath = path.join(__dirname, '../../public', knowledgeToDelete.filePdf);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        res.status(204).send(); // No Content
    } catch (error) {
        next(error);
    }
};

// 11. TEST an Agent's Conversation
const testAgentConversation = async (req, res, next) => {
    const { agentId } = req.params;
    const { userInput, conversationHistory = [] } = req.body;

    if (!userInput) {
        return res.status(400).json({ error: 'userInput tidak boleh kosong.' });
    }

    try {
        // 1. Ambil data agent beserta seluruh knowledge base-nya
        const agent = await prisma.aiAgent.findUnique({
            where: { id: parseInt(agentId) },
            include: { knowledge: true },
        });

        if (!agent) {
            return res.status(404).json({ error: 'AI Agent tidak ditemukan.' });
        }

        // 2. Kumpulkan semua pengetahuan menjadi satu konteks
        let comprehensiveKnowledge = [];
        if (agent.behavior) {
            comprehensiveKnowledge.push(`Perilaku Dasar Bot: ${agent.behavior}`);
        }

        for (const kb of agent.knowledge) {
            let kbText = `Judul Pengetahuan: ${kb.title}\nKategori: ${kb.category}\nKonten: ${kb.contentText}`;
            
            // Jika ada file PDF, baca dan tambahkan isinya ke konteks
            if (kb.filePdf) {
                const pdfPath = path.join(__dirname, '../../public', kb.filePdf);
                if (fs.existsSync(pdfPath)) {
                    const dataBuffer = fs.readFileSync(pdfPath);
                    const pdfData = await pdf(dataBuffer);
                    kbText += `\n\n--- Isi Dokumen Terlampir (${path.basename(pdfPath)}) ---\n${pdfData.text}\n--- Akhir Dokumen ---`;
                }
            }
            comprehensiveKnowledge.push(kbText);
        }

        const knowledgeContext = comprehensiveKnowledge.length > 0 
            ? comprehensiveKnowledge.join('\n\n---\n\n') 
            : 'Tidak ada pengetahuan yang tersedia.';

        // 3. Susun System Message dan User Prompt untuk OpenAI
        const systemMessage = `
            Anda adalah seorang asisten AI bernama "${agent.name}". Anda mewakili "${agent.company || 'perusahaan'}".
            Gaya bahasa Anda adalah "${agent.languageStyle}".
            
            PERATURAN PALING PENTING:
            1. Jawablah salam dan sapaan dari user dengan baik, jika dia memujimu maka ucapkan terima kasih.
            2. Bersikaplah seperti kamu adalah seorang pemilik usaha tersebut, jadi jangan mengungkit sesuatu jika anda tidak diberi tahu. Melainkan jawablah dengan profesional.
            3. Jawab pertanyaan pengguna HANYA berdasarkan informasi yang ada di dalam "KONTEKS PENGETAHUAN LENGKAP" di bawah.
            4. JANGAN PERNAH menggunakan pengetahuan eksternal atau informasi dari luar konteks yang diberikan kecuali dalam etika dasar dalam manusia.
            5. Jika jawaban tidak dapat ditemukan di dalam konteks, jawab dengan jujur: "Maaf, saya tidak bisa menjawab pertanyaan tersebut berdasarkan informasi yang saya miliki."
            6. Jangan mengarang jawaban. Tetap berpegang teguh pada fakta dari konteks.
        `;
        
        const userPrompt = `
--- KONTEKS PENGETAHUAN LENGKAP ---
${knowledgeContext}
------------------------------------

Berdasarkan konteks di atas, jawab pertanyaan berikut: "${userInput}"
        `;

        const messages = [
            { role: 'system', content: systemMessage },
            ...conversationHistory, // Riwayat percakapan sebelumnya
            { role: 'user', content: userPrompt }
        ];

        // 4. Kirim request ke OpenAI
        const chatCompletion = await openai.chat.completions.create({
            messages: messages,
            model: 'gpt-3.5-turbo',
        });

        const botResponse = chatCompletion.choices[0].message.content;

        // 5. Simpan percakapan tes ke database (tanpa menunggu selesai)
        prisma.aiTestConversation.create({
            data: {
                userMessage: userInput, // Simpan hanya pertanyaan asli pengguna
                aiResponse: botResponse,
                aiAgent: { connect: { id: parseInt(agentId) } }
            }
        }).catch(err => console.error("Gagal menyimpan percakapan tes:", err)); // Log error jika gagal

        // 6. Kirim balasan ke frontend
        res.status(200).json({ reply: botResponse });

    } catch (error) {
        console.error("Error di testAgentConversation:", error);
        next(error);
    }
};


// Export semua fungsi agar bisa digunakan di file routes
module.exports = {
    createAgent,
    getAllAgents,
    getAgentById,
    updateAgent,
    deleteAgent,
    connectAgentToSender,     
    disconnectAgentFromSender,  
    addKnowledge,
    updateKnowledge,
    deleteKnowledge,
    testAgentConversation,
};

