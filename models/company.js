const DataLayer = require("../companydata/index.js");
const validationsModel = require("../models/validations");
//const dl = new DataLayer("sxd7342");

function deleteCompany(req, res) {
    
    if ( !(validationsModel.validateString(req.query.company, 10)) ) {
        return res.status(400).json({error: "Invalid input for company."});
    } // Ends company check

    try {
        
        let dl = new DataLayer(req.query.company);

        let rowsDeleted = dl.deleteCompany(req.query.company);

        if (rowsDeleted == 0) {
            return res.status(404).json({
                error: "No companies deleted."
            });
        } else {
            return res.json({
                success: req.query.company + "\'s information deleted."
            });
        } // Ends deleted check

    } catch (err) {
        return res.status(400).json({error: "Could not delete the specified company. Correct fields and try again"});
    } // Ends try catch

} // Ends deleteCompany

module.exports = {
    deleteCompany
};