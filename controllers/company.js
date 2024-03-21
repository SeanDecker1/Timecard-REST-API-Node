const companyModel = require('../models/company');

// DELETE company
const deleteCompany = (req, res, next) => {
    companyModel.deleteCompany(req, res);
}; // Ends deleteCompany

module.exports = {
    deleteCompany
};