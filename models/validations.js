const DataLayer = require("../companydata/index.js");
//
// GENERAL VALIDATION FUNCTIONS
//

function validateString(inputString, characterLimit) {

    inputString.replace(/\s/g, "");

    return !(inputString.trim().length === 0 || inputString.length > characterLimit);

} // Ends validateString

// Input should be a string
function validateDate(inputDate) {

    try {

        let myDate = new Date(Date.parse(inputDate));
        let sqlDate = myDate.toISOString().substring(0, 19).replace('T', ' ');
        return sqlDate;

    } catch (err) {
        return null;
    } // Ends try catch

} // Ends validateDate

// Input should be a string
function validateTimestamp(inputTimestamp) {

    try {
        let inputDate = new Date(Date.parse(inputTimestamp));
        inputDate.setHours(inputDate.getHours() - 5);
        return inputDate;
    } catch (err) {
        return null;
    } // Ends try catch

} // Ends validateTimestamp

//
// ADDITIONAL VALIDATION FUNCTIONS
//

function verifyDepartmentNoUnique(company, dept_no) {

    if ( !dept_no.includes(company) ) {
        dept_no = dept_no + company;
    }

    try {

        let dl = new DataLayer(company);
        let department = dl.getDepartmentNo(company, dept_no);

        if (department != null) {
            return "400";
        } else {
            return dept_no
        } // Ends check if dept_no already exists

    } catch (err) {
        return "400";
    } // Ends try catch

} // Ends verifyDepartmentNoUnique

function verifyEmployeeExists(company, emp_id) {

    try {
        let dl = new DataLayer(company);
        let employee = dl.getEmployee(emp_id);
        return (employee != null);
    } catch (err) {
        return false;
    } // Ends try catch

} // Ends verifyEmployeeExists

function verifyEmployeeDepartmentExists(company, dept_id) {

    try {

        let dl = new DataLayer(company);
        department = dl.getDepartment(company, dept_id);
        return (department != null);

    } catch (err) {
        return false;
    } // Ends try catch

} // Ends verifyEmployeeDepartmentExists

function verifyEmployeeHireDate(hire_date) {

    try {
        
        let todayDate = new Date(Date.now());
        let converted_hire_date = new Date(Date.parse(hire_date));

        todayDate.setHours(todayDate.getHours() - 5);
        //converted_hire_date.setHours(converted_hire_date.getHours() - 5);

        if (converted_hire_date > todayDate) {
            return false;
        } // Ends hire_date after today check

        let dayOfWeek = converted_hire_date.getDay();

        return !(dayOfWeek == 0 || dayOfWeek == 6);

    } catch (err) {
        return false
    } // Ends try catch

} // Ends verifyEmployeeHireDate

function verifyEmployeeNoUnique(company, emp_no) {

    if ( !emp_no.includes(company) ) {
        emp_no = emp_no + company;
    } // Ends if

    try {

        let dl = new DataLayer(company);
        let employees = dl.getAllEmployee(company);
        let emp_no_from_list = null;

        for (const employee of employees) {

            emp_no_from_list = employee.getEmpNo();
            if (emp_no === emp_no_from_list) {
                return "400";
            } // Ends if emp_no already exists

        } // Ends for

        return emp_no;

    } catch (err) {
        return "400";
    } // Ends try catch

} // Ends verifyEmployeeNoUnique

function verifyTimecardExists(company, timecard_id) {

    try {
        let dl = new DataLayer(company);
        let timecard = dl.getTimecard(timecard_id);
        return (timecard != null);
    } catch (err) {
        return false;
    } // Ends try catch

} // Ends verifyEmployeeExists

function verifyTimecardStartTime(start_time) {

    try {
        
        let myDate = new Date(Date.now());
        myDate.setHours(myDate.getHours() - 5);
        let todayDayOfYear = Math.floor((myDate.getTime() - Date.UTC(myDate.getUTCFullYear(), 0, 0)) / 86400000);
        let todayWeekOfYear = Math.floor((myDate.getTime() - Date.UTC(myDate.getUTCFullYear(), 0, 0)) / 604800000);
        let todayDayOfWeek = myDate.getDay();

        let start_time_date = new Date(Date.parse(start_time));
        start_time_date.setHours(start_time_date.getHours() + 5);
        let hourOfDay = start_time_date.getHours();
        let dayOfWeek = start_time_date.getDay();
        
        if (hourOfDay < 8 || hourOfDay >= 18) {
            return false;
        } else if (dayOfWeek == 0 || dayOfWeek == 6) {
            return false;
        } // Ends hour and weekday check

        start_time_date.setHours(start_time_date.getHours() - 5);
        let dayOfYear = Math.floor((start_time_date.getTime() - Date.UTC(start_time_date.getUTCFullYear(), 0, 0)) / 86400000);
        let weekOfYear = Math.floor((start_time_date.getTime() - Date.UTC(start_time_date.getUTCFullYear(), 0, 0)) / 604800000);

        if (dayOfYear != todayDayOfYear) {
            return (weekOfYear == todayWeekOfYear || (todayDayOfWeek == 0 && weekOfYear == (todayWeekOfYear - 1)));
        } else {
            return true;
        } // Ends today comparison

    } catch (err) {
        return false;
    } // Ends try catch

} // Ends verifyTimecardStartTime

function verifyTimecardNoStartTimeMatch(company, emp_id, start_time) {

    try {
        
        let dl = new DataLayer(company);
        let timecards = dl.getAllTimecard(emp_id);
        
        if (timecards.length === 0) {
            return true;
        } // Ends if timecards is empty

        let start_time_date = new Date(Date.parse(start_time));
        start_time_date.setHours(start_time_date.getHours() - 5);
        let year = start_time_date.getYear();
        let dayOfYear = Math.floor((start_time_date.getTime() - Date.UTC(start_time_date.getUTCFullYear(), 0, 0)) / 86400000);

        for (const timecard of timecards) {

            let myDate = new Date(Date.parse(timecard.getStartTime()));
            let timecardDayOfYear = Math.floor((myDate.getTime() - Date.UTC(myDate.getUTCFullYear(), 0, 0)) / 86400000);
            if (dayOfYear == timecardDayOfYear && year == myDate.getYear()) {
                return false;
            } // Ends if

        } // Ends for

        // Returns true if no matches are found until here
        return true;

    } catch (err) {
        return false;
    } // Ends try catch

} // Ends verifyTimecardNoStarTimeMatch

function verifyTimecardEndTime(end_time, start_time) {

    try {

        let start_time_date = new Date(Date.parse(start_time));
        let startDayOfYear = Math.floor((start_time_date.getTime() - Date.UTC(start_time_date.getUTCFullYear(), 0, 0)) / 86400000);

        let end_time_date = new Date(Date.parse(end_time));
        let endHourOfDay = end_time_date.getHours();
        let endDayOfYear = Math.floor((end_time_date.getTime() - Date.UTC(end_time_date.getUTCFullYear(), 0, 0)) / 86400000);

        if (endHourOfDay < 8 || endHourOfDay >= 18 || endDayOfYear != startDayOfYear) {
            return false;
        } // Ends end_time check

        start_time_date.setHours(start_time_date.getHours() + 1);
        //console.log("ST: " + start_time_date + " STT: " + start_time_date.getTime());
        //console.log("ET: " + end_time_date + " ETT: " + end_time_date.getTime());
        return (start_time_date.getTime() < end_time_date.getTime());

    } catch (err) {
        return false;
    } // Ends try catch

} // Ends verifyTimecardEndTime

module.exports = {
    validateString,
    validateDate,
    validateTimestamp,
    verifyDepartmentNoUnique,
    verifyEmployeeExists,
    verifyEmployeeDepartmentExists,
    verifyEmployeeHireDate,
    verifyEmployeeNoUnique,
    verifyTimecardExists,
    verifyTimecardStartTime,
    verifyTimecardNoStartTimeMatch,
    verifyTimecardEndTime
};