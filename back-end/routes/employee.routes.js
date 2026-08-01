const express = require("express");
const router = express.Router();

const employeeController = require("../controllers/employee.controller");

router.get("/", employeeController.getEmployees);

router.get("/:guid", employeeController.getEmployee);

router.post("/", employeeController.addEmployee);

router.put("/:guid", employeeController.updateEmployee);

router.delete("/:guid", employeeController.deleteEmployee);

module.exports = router;