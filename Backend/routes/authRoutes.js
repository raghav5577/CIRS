const express = require('express');
const router = express.Router();
const {registerUser,loginUser,getUniversityUsers} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/users', protect, getUniversityUsers);

module.exports = router;