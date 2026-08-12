// controllers/project.controller.js

const Project = require("../models/project.model");

const createProject = async (req, res) => {
    try {
        const {
            name,
            description,
            clientId,
            projectManagerId,
            startDate,
            expectedEndDate,
            participants
        } = req.body;

        // Basic validation
        if (
            !name ||
            !clientId ||
            !projectManagerId ||
            !startDate ||
            !expectedEndDate
        ) {
            return res.status(400).json({
                success: false,
                message: "Required project fields are missing"
            });
        }

        // Validate date
        if (new Date(expectedEndDate) < new Date(startDate)) {
            return res.status(400).json({
                success: false,
                message: "Expected end date cannot be before start date"
            });
        }

        const project = await Project.create({
            name,
            description,
            clientId,
            projectManagerId,
            startDate,
            expectedEndDate,
            participants
        });

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: project
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create project",
            error: error.message
        });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate(
                "clientId",
                "name email phone"
            )
            .populate(
                "projectManagerId",
                "employeeId name email department"
            )
            .populate(
                "participants.employeeId",
                "employeeId name email department"
            );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        res.status(200).json({
            success: true,
            data: project
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to get project",
            error: error.message
        });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate(
                "clientId",
                "name"
            )
            .populate(
                "projectManagerId",
                "employeeId name email"
            )
            .populate(
                "participants.employeeId",
                "employeeId name email department"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to get projects",
            error: error.message
        });
    }
};

const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
            .populate(
                "clientId",
                "name email phone"
            )
            .populate(
                "projectManagerId",
                "employeeId name email department"
            )
            .populate(
                "participants.employeeId",
                "employeeId name email department"
            );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: project
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update project",
            error: error.message
        });
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete project",
            error: error.message
        });
    }
};

module.exports = {
    createProject,
    getProjectById,
    getProjects,
    updateProject,
    deleteProject
};