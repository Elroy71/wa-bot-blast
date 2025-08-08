// File: src/services/group.service.js
// (Kode ini sama seperti sebelumnya, pastikan berada di folder yang benar)

const prisma = require('../config/db'); // Mengasumsikan prisma client diekspor dari sini

/**
 * Mengambil semua grup dengan jumlah anggotanya.
 */
const getAllGroups = async () => {
    const groups = await prisma.group.findMany({
        include: {
        _count: {
            select: { members: true },
        },
        },
        orderBy: {
        updatedAt: 'desc',
        }
    });

    return groups.map(group => ({
        id: group.id,
        name: group.name,
        description: group.description,
        member_count: group._count.members, 
    }));
};

/**
 * Mengambil satu grup berdasarkan ID, termasuk daftar lengkap ID anggotanya.
 */
const getGroupById = async (id) => {
    const group = await prisma.group.findUnique({
        where: { id: parseInt(id) },
        include: {
        members: {
            select: {
            contactId: true,
            },
        },
        },
    });

    if (!group) {
        throw new Error('Grup tidak ditemukan');
    }

    return {
        ...group,
        members: group.members.map(member => member.contactId),
    };
};

/**
 * Membuat grup baru beserta anggotanya.
 * @param {object} groupData - { name, description, members: [1, 2, 3] }
 */
const createGroup = async (groupData) => {
    const { name, description, members } = groupData;

    return prisma.$transaction(async (tx) => {
        const newGroup = await tx.group.create({
        data: {
            name,
            description,
        },
    });

    if (members && members.length > 0) {
        const groupMembersData = members.map(contactId => ({
            groupId: newGroup.id,
            contactId: contactId,
        }));

        await tx.groupMember.createMany({
            data: groupMembersData,
        });
        }

        return newGroup;
    });
};

/**
 * Memperbarui grup yang ada, termasuk menambah/menghapus anggota.
 * @param {string} id - ID grup yang akan diupdate
 * @param {object} groupData - { name, description, members: [1, 3, 4] }
 */
const updateGroup = async (id, groupData) => {
    const { name, description, members } = groupData;
    const groupId = parseInt(id);

    return prisma.$transaction(async (tx) => {
    const updatedGroup = await tx.group.update({
        where: { id: groupId },
        data: { name, description },
    });

    const currentMembers = await tx.groupMember.findMany({
        where: { groupId: groupId },
        select: { contactId: true },
    });
    const currentMemberIds = currentMembers.map(m => m.contactId);

    const newMemberIds = new Set(members || []);
    const membersToDelete = currentMemberIds.filter(id => !newMemberIds.has(id));
    const membersToAdd = (members || []).filter(id => !currentMemberIds.includes(id));

    if (membersToDelete.length > 0) {
        await tx.groupMember.deleteMany({
            where: {
            groupId: groupId,
            contactId: { in: membersToDelete },
            },
        });
    }

    if (membersToAdd.length > 0) {
        const newGroupMembersData = membersToAdd.map(contactId => ({
            groupId: groupId,
            contactId: contactId,
        }));
        await tx.groupMember.createMany({
            data: newGroupMembersData,
        });
        }

        return updatedGroup;
    });
};

/**
 * Menghapus grup berdasarkan ID.
 */
const deleteGroup = async (id) => {
    return prisma.group.delete({
        where: { id: parseInt(id) },
    });
};

// Ekspor semua fungsi service
module.exports = {
    getAllGroups,
    getGroupById,
    createGroup,
    updateGroup,
    deleteGroup,
};
