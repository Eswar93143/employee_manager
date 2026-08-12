// routes/project.routes.js

const express = require("express");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require("../controllers/project.controller");

const router = express.Router();

router.post("/", createProject);

router.get("/", getProjects);

router.get("/:id", getProjectById);

router.put("/:id", updateProject);

router.delete("/:id", deleteProject);

module.exports = router;