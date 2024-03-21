const DataLayer = require("../companydata/index.js");
const validationsModel = require("../models/validations");
//const dl = new DataLayer("sxd7342");

function getDepartment(req, res) {

    if ( !(validationsModel.validateString(req.query.company, 10)) ) {
        return res.status(400).json({error: "Invalid input for company."});
    } // Ends company check

    try {
        
        const dl = new DataLayer(req.query.company);
        let department = dl.getDepartment(req.query.company, req.query.dept_id);

        if (department == null) {
            return res.status(404).json({error: "No department exists with the specified department ID. Correct this field and try again."});
        } else {
            return res.json({
                department
            });
        } // Ends if department null

    } catch (err) {
        return res.status(400).json({error: "Could not retrieve the specified department. Correct fields and try again"});
    } // Ends try catch

} // Ends getDepartment

function getDepartments(req, res) {

    if ( !(validationsModel.validateString(req.query.company, 10)) ) {
        return res.status(400).json({error: "Invalid input for company."});
    } // Ends company check

    try {
        
        const dl = new DataLayer(req.query.company);
        let departments = dl.getAllDepartment(req.query.company);

        if (departments.length > 0) {
            return res.json({
                departments
            });
        } else {
            return res.status(404).json({error: "No departments exist for specified company."});
        } // Ends list check

    } catch (err) {
        return res.status(400).json({error: "Could not retrieve the departments for the specified company. Correct fields and try again."});
    } // Ends try catch

} // Ends getDepartments

function insertDepartment(req, res) {

    unique_dept_no = validationsModel.verifyDepartmentNoUnique(req.body.company, req.body.dept_no);

    if ( 
        !validationsModel.validateString(req.body.company, 10) ||
        !validationsModel.validateString(req.body.dept_name, 255) ||
        !validationsModel.validateString(unique_dept_no, 20) ||
        !validationsModel.validateString(req.body.location, 255)
    ) {
        return res.status(400).json({error: "Invalid input. Correct fields and try again."});
    } else if (unique_dept_no === "400") {
        return res.status(400).json({error: "Department number must be unique."});
    } // Ends validation if

    try {
        
        const dl = new DataLayer(req.body.company);
        let department = new dl.Department(req.body.company, req.body.dept_name, req.body.dept_no, req.body.location);
        let insertedDepartment = dl.insertDepartment(department);

        return res.status(201).json({
            insertedDepartment
        });

    } catch (err) {
        return res.status(400).json({error: "Could not add the specified department. Correct fields and try again"});
    } // Ends try catch

} // Ends insertDepartment

function updateDepartment(req, res) {

    if ( !(validationsModel.validateString(req.body.company, 10)) ) {
        return res.status(400).json({error: "Invalid input for company."});
    } // Ends company check

    try {
        
        const dl = new DataLayer(req.body.company);
        let department = dl.getDepartment(req.body.company, req.body.dept_id);
        
        if (department == null) {
            return res.status(404).json({error: "Specified department does not exist."});
        } // Ends department null check

        if ( req.body.hasOwnProperty('dept_name') ) {
            
            if ( !(validationsModel.validateString(req.body.dept_name, 255)) ) {
                return res.status(400).json({error: "Invalid input for department name."});
            } // Ends dept_no check
            department.setDeptName(req.body.dept_name);

        } // Ends dept_name check
        
        if ( req.body.hasOwnProperty('dept_no') ) {
            
            unique_dept_no = validationsModel.verifyDepartmentNoUnique(req.body.company, req.body.dept_no);

            if ( !(validationsModel.validateString(unique_dept_no, 20)) ) {
                return res.status(400).json({error: "Invalid input for department name."});
            } else if (unique_dept_no === "400") {
                return res.status(400).json({error: "Department number must be unique."});
            } // Ends dept_no check

            department.setDeptNo(unique_dept_no);

        } // Ends dept_no check

        if ( req.body.hasOwnProperty('location') ) {
            
            if ( !(validationsModel.validateString(req.body.location, 255)) ) {
                return res.status(400).json({error: "Invalid input for location."});
            } // Ends location check
            department.setLocation(req.body.location);

        } // Ends location check

        let updatedDepartment = dl.updateDepartment(department);

        return res.json({
            updatedDepartment
        });

    } catch (err) {
        return res.status(400).json({error: "Could not update the specified department. Correct fields and try again"});
    } // Ends try catch

} // Ends updateDepartment

function deleteDepartment(req, res) {
    
    if ( !(validationsModel.validateString(req.query.company, 10)) ) {
        return res.status(400).json({error: "Invalid input for company."});
    } // Ends company check

    try {
        
        const dl = new DataLayer(req.query.company);

        if (!validationsModel.verifyEmployeeDepartmentExists(req.query.company, req.query.dept_id)) {
            return res.status(404).json({error: "Department does not exist."});
        } // Ends department exists check

        // Loop through all employees under department
        let employees = dl.getAllEmployee(req.query.company);
        for (const employee of employees) {
            if (employee.getDeptId() == req.query.dept_id) {
                dl.deleteEmployee(req.query.company, employee.getId());
            } // Ends if
        } // Ends for

        let rowsDeleted = dl.deleteDepartment(req.query.company, req.query.dept_id);

        if (rowsDeleted == 0) {
            return res.status(418).json({
                error: "No departments were deleted"
            });
        } else {
            return res.json({
                success: "Department " + req.query.dept_id + " from " + req.query.company + " deleted."
            });
        }

    } catch (err) {
        return res.status(400).json({error: "Could not delete the specified department. Correct fields and try again"});
    } // Ends try catch

} // Ends deleteDepartment

module.exports = {
    getDepartment,
    getDepartments,
    insertDepartment,
    updateDepartment,
    deleteDepartment
};