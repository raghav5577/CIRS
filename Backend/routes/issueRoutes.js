const express = require('express');
const router = express.Router();
const {createIssue, getIssues, assignWorker, updateIssueStatus, autofillIssue} = require('../controllers/issueController');
const {protect} = require('../middleware/authMiddleware');

router.post('/autofill', protect, autofillIssue);
router.post('/',protect,createIssue);
router.get('/',protect,getIssues);
router.put('/:id/assign', protect, assignWorker);
router.put('/:id/status', protect, updateIssueStatus);

module.exports = router;
