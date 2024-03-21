const express = require('express');
const router = express.Router();
const timecardController = require('../controllers/timecard');

router.get('/timecard', timecardController.getTimecard);
router.get('/timecards', timecardController.getTimecards);
router.post('/timecard', timecardController.insertTimecard);
router.put('/timecard', timecardController.updateTimecard);
router.delete('/timecard', timecardController.deleteTimecard);

module.exports = router;