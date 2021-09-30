const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword, verifyEmail, emailVerified, validateUser, approvedUser, getAllUser, addDeductions, insertLocationInfo } = require('../controllers/user');
const auth = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);
router.post('/verifyemail',auth, verifyEmail);
router.put('/emailverified/:verifyToken',auth, emailVerified);
router.post('/validate', auth, validateUser);
router.put('/approveduser', auth, approvedUser);
router.get('/allusers', auth, getAllUser);
router.post('/adddeductions', auth, addDeductions);
router.post('/insertlocationinfo', auth, insertLocationInfo);


module.exports = router;