const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword, verifyEmail, emailVerified, validateUser, approvedUser, getAllUser } = require('../controllers/user');
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

module.exports = router;