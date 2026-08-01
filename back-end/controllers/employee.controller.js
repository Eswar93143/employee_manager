const employeeModel = require("../models/employee.model");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

// Add employee
exports.addEmployee = async (req, res) => {
    try {
        const {
            password,
            ...employeeData
        } = req.body;

        const hashedPassword = await bcrypt.hash(
            password || uuidv4(),
            10
        );

        const employee = new employeeModel({
            guid: uuidv4(),
            ...employeeData,
            password: hashedPassword,
        });

        await employee.save();

        const employeeResponse = employee.toObject();
        delete employeeResponse.password;

        res.status(201).json({
            success: true,
            message: "Employee created successfully.",
            data: employeeResponse,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


// Get all employees
exports.getEmployees = async (req, res) => {
    try {
        const employees = await employeeModel
            .find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: employees.length,
            data: employees,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


// Get single employee
exports.getEmployee = async (req, res) => {
    try {
        const employee = await employeeModel
            .findOne({
                guid: req.params.guid,
            })
            .select("-password");

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found.",
            });
        }

        res.json({
            success: true,
            data: employee,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


// Update employee
exports.updateEmployee = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Hash password if updating password
        if (updateData.password) {
            updateData.password = await bcrypt.hash(
                updateData.password,
                10
            );
        }

        const employee = await employeeModel.findOneAndUpdate(
            {
                guid: req.params.guid,
            },
            updateData,
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found.",
            });
        }

        res.json({
            success: true,
            message: "Employee updated successfully.",
            data: employee,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


// Delete employee
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await employeeModel.findOneAndDelete({
            guid: req.params.guid,
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found.",
            });
        }

        res.json({
            success: true,
            message: "Employee deleted successfully.",
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};