const express = require('express');
const router = express.Router();
const { addSubs, deleteSubs, addMannySubs, getAllSubs, getUserSubs, agentUpdate, getAppsGen, forPayout, paymentToAgent, removeIncentivesDeductions, addIncentivesDeductions, checkSubs, activateAccount, encodeAccount } = require('../controllers/subs');
const auth = require('../middleware/auth');

router.post('/addsubs', auth, addSubs);
router.delete('/deletesubs', deleteSubs);
router.post('/addmannysubs', addMannySubs);
router.get('/getallsubs', auth, getAllSubs);
router.get('/usersubs', auth, getUserSubs);
router.put('/agentupdate', auth, agentUpdate);
router.get('/appsgen', auth, getAppsGen);
router.get('/forpayout', auth, forPayout);
router.post('/paymenttoagent', auth, paymentToAgent);
router.put('/removeincentivesdeductions', auth, removeIncentivesDeductions);
router.put('/addincentivesdeductions', auth, addIncentivesDeductions);
router.post('/checksubs',auth, checkSubs);
router.put('/activateaccount', auth, activateAccount);
router.post('/encodeaccount', auth, encodeAccount);

module.exports = router;