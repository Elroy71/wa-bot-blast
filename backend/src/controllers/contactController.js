// src/controllers/contactController.js
const prisma = require('../config/db');

// @desc    Create a new contact
// @route   POST /api/contacts
const createContact = async (req, res, next) => {
    try {
        // [PERUBAHAN] Menyesuaikan dengan field 'phone' dan 'gender'
        const { name, phone, email, gender } = req.body;

        if (!name || !phone) {
        return res.status(400).json({ msg: 'Name and phone number are required' });
    }

    const newContact = await prisma.contact.create({
        data: {
            name,
            phone, // Diubah dari phoneNumber
            email,
            gender, // Ditambahkan
        },
        });
        res.status(201).json(newContact);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all contacts
// @route   GET /api/contacts
const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await prisma.contact.findMany({
        orderBy: {
            createdAt: 'desc', // Mengurutkan dari yang terbaru
        },
        });
        res.status(200).json(contacts);
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single contact by ID
// @route   GET /api/contacts/:id
const getContactById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await prisma.contact.findUnique({
        where: { id: parseInt(id) },
        });

        if (!contact) {
        return res.status(404).json({ msg: `Contact with id ${id} not found` });
        }
        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a contact
// @route   PUT /api/contacts/:id
const updateContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        // [PERUBAHAN] Menyesuaikan dengan field 'phone' dan 'gender'
        const { name, phone, email, gender } = req.body;

        const updatedContact = await prisma.contact.update({
        where: { id: parseInt(id) },
        data: {
            name,
            phone, // Diubah dari phoneNumber
            email,
            gender, // Ditambahkan
        },
        });
        res.status(200).json(updatedContact);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma.contact.delete({
        where: { id: parseInt(id) },
        });
        res.status(200).json({ msg: `Contact with id ${id} has been deleted` });
    } catch (error) {
        next(error);
    }
};

// [FUNGSI BARU]
// @desc    Import multiple contacts from an array
// @route   POST /api/contacts/import
const importContacts = async (req, res, next) => {
    try {
        // Frontend akan mengirim array of contacts di body
        const contacts = req.body;

        if (!Array.isArray(contacts) || contacts.length === 0) {
        return res.status(400).json({ msg: 'Request body must be a non-empty array of contacts.' });
        }

        // Prisma's createMany sangat efisien untuk bulk inserts.
        // skipDuplicates akan mencegah error jika ada nomor telepon yang sama.
        const result = await prisma.contact.createMany({
        data: contacts,
        skipDuplicates: true,
        });

        res.status(201).json({
        message: `${result.count} contacts were successfully imported.`,
        count: result.count,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createContact,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact,
  importContacts, // [BARU] Ekspor fungsi baru
};