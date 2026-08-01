const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
    {
        guid: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: String,
        department: String,
        role: String,
        status: {
            type: String,
            default: "active",
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Employee", employeeSchema);