const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const employeeModel = require("../models/employee.model");

const router = express.Router();

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.query;

        const employee = await employeeModel.findOne({ email });

        if (!employee) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, employee.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: employee.guid
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        return res.json({
            token
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

// Forget password