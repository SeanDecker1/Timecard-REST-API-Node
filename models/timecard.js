const DataLayer = require("../companydata/index.js");
const validationsModel = require("../models/validations");
//const dl = new DataLayer("sxd7342");

function getTimecard(req, res) {

    if ( !(validationsModel.validateString(req.query.company, 10)) ) {
        return res.status(400).json({error: "Invalid input for company."});
    } // Ends company check

    try {
        
        let dl = new DataLayer(req.query.company);
        let timecard = dl.getTimecard(req.query.timecard_id);

        if (timecard == null) {
            return res.status(404).json({error: "No timecard exists with the specified timecard ID. Correct this field and try again."});
        } else {
            return res.json({timecard});
        } // Ends timecard null

    } catch (err) {
        console.log(err);
        return res.status(400).json({error: "Could not retrieve the specified timecard. Correct fields and try again."});
    } // Ends try catch

} // Ends getTimecard

function getTimecards(req, res) {

    if ( !(validationsModel.validateString(req.query.company, 10)) ) {
        return res.status(400).json({error: "Invalid input for company."});
    } // Ends company check

    try {
        
        let dl = new DataLayer(req.query.company);
        let timecards = dl.getAllTimecard(req.query.emp_id);

        if (timecards.length > 0) {
            return res.json({
                timecards
            });
        } else {
            return res.status(404).json({error: "No timecards exist for specified employee."});
        } // Ends list check

    } catch (err) {
        return res.status(400).json({error: "Could not retrieve the timecards for the specified employee. Correct fields and try again."});
    } // Ends try catch

} // Ends getTimecards

function insertTimecard(req, res) {

    if ( !validationsModel.validateString(req.body.company, 10) ) {
        return res.status(400).json({error: "Invalid input for company."});
    } else if ( !validationsModel.verifyEmployeeExists(req.body.company, req.body.emp_id) ) {
        return res.status(400).json({error: "Specified employee does not exist."});
    } // Ends validation if

    try {
        
        let dl = new DataLayer(req.body.company);

        let formatted_start_time = validationsModel.validateTimestamp(req.body.start_time);
        if (formatted_start_time == null) {
            return res.status(400).json({error: "Invalid format for start time."});
        } else if (!validationsModel.verifyTimecardStartTime(formatted_start_time)) {
            return res.status(400).json({error: "Invalid input for start time."});
        } else if (!validationsModel.verifyTimecardNoStartTimeMatch(req.body.company, req.body.emp_id, formatted_start_time)) {
            return res.status(409).json({error: "Timecard already exists on this day for specified employee."});
        } // Ends start_time check

        let formatted_end_time = validationsModel.validateTimestamp(req.body.end_time);
        if (formatted_end_time == null) {
            return res.status(400).json({error: "Invalid format for end time."});
        } else if (!validationsModel.verifyTimecardEndTime(req.body.end_time, req.body.start_time)) {
            return res.status(400).json({error: "Invalid input for end time."});
        } // Ends end_time check

        let timecard = new dl.Timecard(req.body.start_time, req.body.end_time, req.body.emp_id);
        let insertedTimecard = dl.insertTimecard(timecard);

        return res.status(201).json({
            insertedTimecard
        });

    } catch (err) {
        return res.status(400).json({error: "Could not add the specified timecard. Correct fields and try again."});
    } // Ends try catch

} // Ends insertTimecard

function updateTimecard(req, res) {

    if ( !(validationsModel.validateString(req.body.company, 10)) ) {
        return res.status(400).json({error: "Invalid input for company."});
    } // Ends company check

    try {
        
        let dl = new DataLayer(req.body.company);
        let timecard = dl.getTimecard(req.body.timecard_id);
        
        if (timecard == null) {
            return res.status(404).json({error: "Specified timecard does not exist."});
        } // Ends timecard null check

        if ( req.body.hasOwnProperty('start_time') ) {

            let formatted_start_time = validationsModel.validateTimestamp(req.body.start_time);

            if (formatted_start_time == null) {
                return res.status(400).json({error: "Invalid format for start time."});
            } else if (!validationsModel.verifyTimecardStartTime(formatted_start_time)) {
                return res.status(400).json({error: "Invalid input for start time."});
            } // Ends start_time inner check
            
            timecard.setStartTime(req.body.start_time);
            
        } // Ends start_time outer check
        
        if ( req.body.hasOwnProperty('end_time') ) {
            
            let formatted_end_time = validationsModel.validateTimestamp(req.body.end_time);

            if (formatted_end_time == null) {
                return res.status(400).json({error: "Invalid format for end time."});
            } else if (!validationsModel.verifyTimecardEndTime(req.body.end_time, timecard.getStartTime())) {  
                return res.status(400).json({error: "Invalid input for end time."});
            } // Ends end_time inner check

            timecard.setEndTime(req.body.end_time);

        } // Ends end_time outer check

        if ( req.body.hasOwnProperty('emp_id') ) {
            
            try {

                if (!validationsModel.verifyEmployeeExists(req.body.company, req.body.emp_id)) {
                    return res.status(400).json({error: "No employee exists with the specified employee ID"});
                } else {
                    timecard.setEmpId(req.body.emp_id);
                } // Ends if

            } catch (err) {
                return res.status(400).json({error: "Invalid input for employee ID."});
            } // Ends try catch

        } // Ends emp_id check

        if (!validationsModel.verifyTimecardNoStartTimeMatch(req.body.company, timecard.getEmpId(), timecard.getStartTime())) {
            return res.status(409).json({error: "Timecard already exists on this day for specified employee."});
        } // Ends start time match check

        let updatedTimecard = dl.updateTimecard(timecard);

        return res.json({
            updatedTimecard
        });

    } catch (err) {
        return res.status(400).json({error: "Could not update the specified timecard. Correct fields and try again"});
    } // Ends try catch

} // Ends updateTimecard

function deleteTimecard(req, res) {
    
    if ( !(validationsModel.validateString(req.query.company, 10)) ) {
        return res.status(400).json({error: "Invalid input for company."});
    } // Ends company check

    try {
        
        let dl = new DataLayer(req.query.company);
        if (!validationsModel.verifyTimecardExists(req.query.emp_id)) {
            return res.status(404).json({error: "Timecard does not exist."});
        } // Ends timecard exists check

        let rowsDeleted = dl.deleteTimecard(req.query.timecard_id);

        if (rowsDeleted == 0) {
            return res.status(418).json({
                error: "No timecards were deleted."
            });
        } else {
            return res.json({
                success: "Timecard " + req.query.timecard_id + " deleted."
            });
        } // Ends rowsDeleted if

    } catch (err) {
        return res.status(400).json({error: "Could not delete the specified timecard. Correct fields and try again"});
    } // Ends try catch

} // Ends deleteTimecard

module.exports = {
    getTimecard,
    getTimecards,
    insertTimecard,
    updateTimecard,
    deleteTimecard
};