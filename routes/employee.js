const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee');

router.get('/employee', employeeController.getEmployee);
router.get('/employees', employeeController.getEmployees);
router.post('/employee', employeeController.insertEmployee);
router.put('/employee', employeeController.updateEmployee);
router.delete('/employee', employeeController.deleteEmployee);

module.exports = router;