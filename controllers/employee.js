const employeeModel = require('../models/employee');

// GET employee
const getEmployee = (req, res, next) => {
    employeeModel.getEmployee(req, res);
}; // Ends getEmployee

// GET employees
const getEmployees = (req, res, next) => {
    employeeModel.getEmployees(req, res);
}; // Ends getEmployees

// POST employee
const insertEmployee = (req, res, next) => {
    employeeModel.insertEmployee(req, res);
}; // Ends insertEmployee

// PUT employee
const updateEmployee = (req, res, next) => {
    employeeModel.updateEmployee(req, res);
}; // Ends updateEmployee

// DELETE employee
const deleteEmployee = (req, res, next) => {
    employeeModel.deleteEmployee(req, res);
}; // Ends deleteEmployee

module.exports = {
    getEmployee,
    getEmployees,
    insertEmployee,
    updateEmployee,
    deleteEmployee
};