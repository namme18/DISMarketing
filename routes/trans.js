const express = require('express');
const { getUserTrans, getGrandTrans } = require('../controllers/trans');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/getusertransactions', auth, getUserTrans);
router.get('/getgrandtransactions', auth, getGrandTrans)

module.exports = router;