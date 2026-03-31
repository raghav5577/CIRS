const express = require('express');
const router = express.Router();
const {createIssue, getIssues} = require('../controllers/issueController');
const {protect} = require('../middleware/authMiddleware');

router.post('/',protect,createIssue);
router.get('/',protect,getIssues);

module.exports = router;