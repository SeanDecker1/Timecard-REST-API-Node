const timecardModel = require('../models/timecard');

// GET timecard
const getTimecard = (req, res, next) => {
    timecardModel.getTimecard(req, res);
}; // Ends getTimecard

// GET timecards
const getTimecards = (req, res, next) => {
    timecardModel.getTimecards(req, res);
}; // Ends getTimecards

// POST timecard
const insertTimecard = (req, res, next) => {
    timecardModel.insertTimecard(req, res);
}; // Ends insertTimecard

// PUT timecard
const updateTimecard = (req, res, next) => {
    timecardModel.updateTimecard(req, res);
}; // Ends updateTimecard

// DELETE timecard
const deleteTimecard = (req, res, next) => {
    timecardModel.deleteTimecard(req, res);
}; // Ends deleteTimecard

module.exports = {
    getTimecard,
    getTimecards,
    insertTimecard,
    updateTimecard,
    deleteTimecard
};