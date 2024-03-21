const DataLayer = require("companydata");
const { get } = require("../routes/department");
const validationsModel = require("./validations");
//const dl = new DataLayer("sxd7342");

function getEmployee(req, res) {

    if ( !(validationsModel.validateString(req.query.company, 10)) ) {
        return res.status(400).json({error: "Invalid input for company."});
    } // Ends company check

    try {
        
        const dl = new DataLayer(req.query.company);
        let employee = dl.getEmployee(req.query.emp_id);

        if (employee == null) {
            return res.status(404).json({error: "No employee exists with the specified employee ID. Correct this field and try again."});
        } else {
            return res.json({employee});
        } // Ends if employee null

    } catch (err) {
        return res.status(400).json({error: "Could not retrieve the specified employee. Correct fields and try again"});
    } // Ends try catch

} // Ends getEmployee

function getEmployees(req, res) {

    if ( !(validationsModel.validateString(req.query.company, 10)) ) {
        return res.status(400).json({error: "Invalid input for company."});
    } // Ends company check

    try {
        
        const dl = new DataLayer(req.query.company);
        let employees = dl.getAllEmployee(req.query.company);

        if (employees.length > 0) {
            return res.json({
                employees
            });
        } else {
            return res.status(404).json({error: "No employees exist for specified company."});
        } // Ends list check

    } catch (err) {
        return res.status(400).json({error: "Could not retrieve the employees for the specified company. Correct fields and try again."});
    } // Ends try catch

} // Ends getEmployees

function insertEmployee(req, res) {

    let unique_emp_no = validationsModel.verifyEmployeeNoUnique(req.body.company, req.body.emp_no);

    if ( 
        !validationsModel.validateString(req.body.company, 10) ||
        !validationsModel.validateString(req.body.emp_name, 50) ||
        !validationsModel.validateString(unique_emp_no, 20) ||
        !validationsModel.validateString(req.body.job, 30)
    ) {
        return res.status(400).json({error: "Invalid input. Correct fields and try again."});
    } else if (!validationsModel.verifyEmployeeExists(req.body.company, req.body.mng_id)) {
        req.body.mng_id = 0;
    }
    
    if (!validationsModel.verifyEmployeeDepartmentExists(req.body.company, req.body.dept_id)) {
        return res.status(404).json({error: "No department exists with the specified department ID. Correct this field and try again."});
    } else if (unique_emp_no === "400") {
        return res.status(400).json({error: "Employee number must be unique."});
    } // Ends validation if

    try {
        
        const dl = new DataLayer(req.body.company);

        let formatted_hire_date = validationsModel.validateDate(req.body.hire_date);
        if (formatted_hire_date == null) {
            return res.status(400).json({error: "Invalid format for hire date."});
        } else if (!validationsModel.verifyEmployeeHireDate(formatted_hire_date)) {
            return res.status(400).json({error: "Invalid input for hire date"});
        } // Ends formatted_hire_date check

        let employee = new dl.Employee(req.body.emp_name, unique_emp_no, formatted_hire_date, req.body.job, req.body.salary, req.body.dept_id, req.body.mng_id);
        let insertedEmployee = dl.insertEmployee(employee);

        return res.status(201).json({
            insertedEmployee
        });

    } catch (err) {
        return res.status(400).json({error: "Could not add the specified employee. Correct fields and try again"});
    } // Ends try catch

} // Ends insertEmployee

function updateEmployee(req, res) {

    if ( !(validationsModel.validateString(req.body.company, 10)) ) {
        return res.status(400).json({error: "Invalid input for company."});
    } // Ends company check

    try {
        
        const dl = new DataLayer(req.body.company);
        let employee = dl.getEmployee(req.body.emp_id);
        
        if (employee == null) {
            return res.status(404).json({error: "Specified employee does not exist."});
        } // Ends employee null check

        if ( req.body.hasOwnProperty('emp_name') ) {
            
            if ( !(validationsModel.validateString(req.body.emp_name, 50)) ) {
                return res.status(400).json({error: "Invalid input for employee name."});
            } // Ends emp_no check
            employee.setEmpName(req.body.emp_name);

        } // Ends emp_name check
        
        if ( req.body.hasOwnProperty('emp_no') ) {
            
            unique_emp_no = validationsModel.verifyEmployeeNoUnique(req.body.company, req.body.emp_no);

            if ( !(validationsModel.validateString(unique_emp_no, 20)) ) {
                return res.status(400).json({error: "Invalid input for employee number."});
            } else if (unique_emp_no === "400") {
                return res.status(400).json({error: "Employee number must be unique."});
            } // Ends emp_no check

            employee.setEmpNo(unique_emp_no);

        } // Ends emp_no outer check

        if ( req.body.hasOwnProperty('hire_date') ) {
            
            let formatted_hire_date = validationsModel.validateDate(req.body.hire_date);
            if (formatted_hire_date == null) {
                return res.status(400).json({error: "Invalid format for hire date."});
            } else if (!validationsModel.verifyEmployeeHireDate(formatted_hire_date)) {
                return res.status(400).json({error: "Invalid input for hire date."});
            } // Ends hire_date inner check
            employee.setHireDate(formatted_hire_date);

        } // Ends hire_date outer check

        if ( req.body.hasOwnProperty('job') ) {
            
            if ( !(validationsModel.validateString(req.body.job, 30)) ) {
                return res.status(400).json({error: "Invalid input for employee job."});
            } // Ends job inner check
            employee.setJob(req.body.job);

        } // Ends job outer check

        if ( req.body.hasOwnProperty('salary') ) {
            
            try {
                employee.setSalary(req.body.salary);
            } catch (err) {
                return res.status(400).json({error: "Invalid input for employee salary."});
            } // Ends try catch

        } // Ends salary check

        if ( req.body.hasOwnProperty('dept_id') ) {
            
            try {

                if (!validationsModel.verifyEmployeeDepartmentExists(req.body.company, req.body.dept_id)) {
                    return res.status(404).json({error: "Specified department does not exist."});
                } // Ends if
                employee.setDeptId(req.body.dept_id);

            } catch (err) {
                return res.status(400).json({error: "Invalid input for department ID."});
            } // Ends try catch

        } // Ends dept_id check

        if ( req.body.hasOwnProperty('mng_id') ) {
            
            try {

                if (!validationsModel.verifyEmployeeExists(req.body.company, req.body.mng_id)) {
                    employee.setMngId(0);
                } else {
                    employee.setMngId(req.body.mng_id);
                } // Ends if

            } catch (err) {
                return res.status(400).json({error: "Invalid input for manager ID."});
            } // Ends try catch

        } // Ends mng_id check

        let updatedEmployee = dl.updateEmployee(employee);

        return res.json({
            updatedEmployee
        });

    } catch (err) {
        return res.status(400).json({error: "Could not update the specified employee. Correct fields and try again"});
    } // Ends try catch

} // Ends updateEmployee

function deleteEmployee(req, res) {
    
    if ( !(validationsModel.validateString(req.query.company, 10)) ) {
        return res.status(400).json({error: "Invalid input for company."});
    } // Ends company check

    try {
        
        let dl = new DataLayer(req.query.company);

        if (!validationsModel.verifyEmployeeExists(req.query.company, req.query.emp_id)) {
            return res.status(404).json({error: "Employee does not exist."});
        } // Ends employee exists check

        // Loop through all timecards under employee
        let timecards = dl.getAllTimecard(req.query.emp_id);
        for (const timecard of timecards) {
            dl.deleteTimecard(timecard.getId());
        } // Ends for

        // Loop through all employees that have deleted employee as manager and set mng_id to 0
        let employees = dl.getAllEmployee(req.query.company);
        for (const employee of employees) {
            if (employee.getMngId() == req.query.emp_id) {
                employee.setMngId(0);
                dl.updateEmployee(employee);
            } // Ends if
        } // Ends for

        let rowsDeleted = dl.deleteEmployee(req.query.emp_id);

        if (rowsDeleted == 0) {
            return res.status(418).json({
                error: "No employees were deleted"
            });
        } else {
            return res.json({
                success: "Employee " + req.query.emp_id + " deleted."
            });
        } // Ends rowsDeleted if

    } catch (err) {
        return res.status(400).json({error: "Could not delete the specified employee. Correct fields and try again"});
    } // Ends try catch

} // Ends deleteEmployee

module.exports = {
    getEmployee,
    getEmployees,
    insertEmployee,
    updateEmployee,
    deleteEmployee
};