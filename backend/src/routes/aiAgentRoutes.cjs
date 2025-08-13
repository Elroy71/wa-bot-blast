const express = require('express');
const router = express.Router();

// Import middleware upload
const upload = require('../middlewares/upload.cjs');

// [UPDATED] Import fungsi-fungsi baru dari controller
const {
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
    testAgentConversation
} = require('../controllers/aiAgentController.cjs');

// --- Rute untuk AiAgent ---
router.post('/', createAgent);
router.get('/', getAllAgents);
router.get('/:id', getAgentById);
router.put('/:id', updateAgent);
router.delete('/:id', deleteAgent);
router.post('/:agentId/test-chat', testAgentConversation);

// --- Rute untuk Koneksi ---
router.post('/:id/connect', connectAgentToSender);
router.post('/:id/disconnect', disconnectAgentFromSender);

// --- [ROUTE BARU] Rute untuk Knowledge Base ---
// POST /api/agents/:agentId/knowledge -> Menambah knowledge baru
// Middleware upload.single('filePdf') akan menangani file yang dikirim dengan field name 'filePdf'
router.post('/:agentId/knowledge', upload.single('filePdf'), addKnowledge);

// PUT /api/agents/:agentId/knowledge/:kbId -> Memperbarui knowledge
router.put('/:agentId/knowledge/:kbId', upload.single('filePdf'), updateKnowledge);

// DELETE /api/agents/:agentId/knowledge/:kbId -> Menghapus knowledge
router.delete('/:agentId/knowledge/:kbId', deleteKnowledge);


module.exports = router;
