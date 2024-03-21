const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/department');

router.get('/department', departmentController.getDepartment);
router.get('/departments', departmentController.getDepartments);
router.post('/department', departmentController.insertDepartment);
router.put('/department', departmentController.updateDepartment);
router.delete('/department', departmentController.deleteDepartment);

module.exports = router;