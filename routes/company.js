const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company');

router.delete('/company', companyController.deleteCompany);

module.exports = router;