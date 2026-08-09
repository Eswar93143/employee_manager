const { randomUUID } = require("crypto");
const Client = require("../models/client.model");

const createClient = async (req, res) => {
    try {
        const client = await Client.create({
            clientId: randomUUID(),
            name: req.body.name,
            description: req.body.description,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            status: req.body.status
        });

        res.status(201).json({
            success: true,
            message: "Client created successfully",
            data: client
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all clients
const getClients = async (req, res) => {
    try {
        const clients = await Client.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: clients.length,
            data: clients
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get client by ID
const getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        res.status(200).json({
            success: true,
            data: client
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update client
const updateClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Client updated successfully",
            data: client
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete client
const deleteClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Client deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient
};