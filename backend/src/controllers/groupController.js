// File: src/controllers/groupController.js

const groupService = require('../services/group.service');

const getGroups = async (req, res) => {
    try {
        const groups = await groupService.getAllGroups();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data grup', error: error.message });
    }
};

const getGroupDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await groupService.getGroupById(id);
        res.status(200).json(group);
    } catch (error) {
        // Jika service melempar error 'Grup tidak ditemukan'
        if (error.message === 'Grup tidak ditemukan') {
        return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Gagal mengambil detail grup', error: error.message });
    }
};

const createNewGroup = async (req, res) => {
    try {
        // Frontend mengirim 'members', bukan 'memberIds'
        const groupData = req.body; 
        const newGroup = await groupService.createGroup(groupData);
        res.status(201).json({ message: 'Grup berhasil dibuat', data: newGroup });
    } catch (error) {
        res.status(500).json({ message: 'Gagal membuat grup baru', error: error.message });
    }
};

const updateExistingGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const groupData = req.body;
        await groupService.updateGroup(id, groupData);
        res.status(200).json({ message: 'Grup berhasil diperbarui' });
    } catch (error) {
        if (error.message === 'Grup tidak ditemukan') {
        return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Gagal memperbarui grup', error: error.message });
    }
};

const deleteExistingGroup = async (req, res) => {
    try {
        const { id } = req.params;
        await groupService.deleteGroup(id);
        res.status(200).json({ message: 'Grup berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus grup', error: error.message });
    }
};

module.exports = {
    getGroups,
    getGroupDetails,
    createNewGroup,
    updateExistingGroup,
    deleteExistingGroup,
};
