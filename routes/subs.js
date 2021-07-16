const express = require('express');
const router = express.Router();
const { addSubs, deleteSubs, addMannySubs } = require('../controllers/subs');

router.post('/addsubs', addSubs);
router.delete('/deletesubs', deleteSubs);
router.post('/addmannysubs', addMannySubs);

module.exports = router;