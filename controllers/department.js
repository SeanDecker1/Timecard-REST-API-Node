const departmentModel = require('../models/department');

// GET department
const getDepartment = (req, res, next) => {
    departmentModel.getDepartment(req, res);
}; // Ends getDepartment

// GET departments
const getDepartments = (req, res, next) => {
    departmentModel.getDepartments(req, res);
}; // Ends getDepartments

// POST department
const insertDepartment = (req, res, next) => {
    departmentModel.insertDepartment(req, res);
}; // Ends insertDepartment

// PUT department
const updateDepartment = (req, res, next) => {
    departmentModel.updateDepartment(req, res);
}; // Ends updateDepartment

// DELETE department
const deleteDepartment = (req, res, next) => {
    departmentModel.deleteDepartment(req, res);
}; // Ends deleteDepartment

module.exports = {
    getDepartment,
    getDepartments,
    insertDepartment,
    updateDepartment,
    deleteDepartment
};