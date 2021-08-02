const express = require('express');
const router = express.Router();
const { addSubs, deleteSubs, addMannySubs, getAllSubs, getUserSubs, agentUpdate } = require('../controllers/subs');
const auth = require('../middleware/auth');

router.post('/addsubs', auth, addSubs);
router.delete('/deletesubs', deleteSubs);
router.post('/addmannysubs', addMannySubs);
router.get('/getallsubs', auth, getAllSubs);
router.get('/usersubs', auth, getUserSubs);
router.put('/agentupdate', auth, agentUpdate);

module.exports = router;