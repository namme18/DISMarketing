const express = require('express');
const router = express.Router();
const { addSubs, deleteSubs, addMannySubs, getAllSubs, getUserSubs, agentUpdate, getAppsGen, forPayout, paymentToAgent, removeIncentivesDeductions, addIncentivesDeductions, checkSubs, activateAccount, encodeAccount, getUnclaimedSubs, getSubsViaApplicationNo, replaceClaimedSubs, getForSpp, subsUpdateByAdmin, agentCompliance } = require('../controllers/subs');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/addsubs', auth, upload.array('images'), addSubs);
router.put('/replaceclaimedsubs', auth, replaceClaimedSubs);
router.put('/addmannysubs', addMannySubs);
router.get('/getallsubs', auth, getAllSubs);
router.get('/usersubs', auth, getUserSubs);
router.put('/agentupdate', auth, agentUpdate);
router.get('/appsgen', auth, getAppsGen);
router.get('/forpayout', auth, forPayout);
router.post('/paymenttoagent', auth, upload.array('images'), paymentToAgent);
router.put('/removeincentivesdeductions', auth, removeIncentivesDeductions);
router.put('/addincentivesdeductions', auth, addIncentivesDeductions);
router.post('/checksubs',auth, checkSubs);
router.put('/activateaccount', auth, activateAccount);
router.post('/encodeaccount', auth, encodeAccount);
router.get('/getunclaimedsubs', auth, getUnclaimedSubs);
router.get('/subsviaapplicationno', auth, getSubsViaApplicationNo);
router.get('/getforspp', auth, getForSpp);
router.put('/subsupdatebyadmin', auth, subsUpdateByAdmin);
router.put('/agentcompliance', auth, upload.array('images'), agentCompliance);

module.exports = router;