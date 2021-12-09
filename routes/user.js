const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword, verifyEmail, emailVerified, validateUser, approvedUser, getAllUser, addDeductions, insertLocationInfo, addProfilePicture, updateInfo } = require('../controllers/user');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

//const upload = multer({dest: 'images/'})
//upload.single('image')

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
router.post('/addprofilepicture', auth, upload.single('image'), addProfilePicture);
router.put('/updateinfo', auth, updateInfo);

module.exports = router;