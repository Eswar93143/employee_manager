const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth.routes");
const employeeRoutes = require("./routes/employee.routes");
const clientRoutes = require("./routes/client.routes");
const projectRoutes = require("./routes/project.routes");

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);

const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();