const Subs = require('../model/Subs');
const User = require('../model/User');
const Trans = require('../model/Trans');
const bcrypt = require('bcryptjs');

exports.addSubs = (req, res, next) => {
    const { fullname, email, contactno, address, applicationno, plan} = req.body;
    if(!fullname || !email || !contactno || !address || !applicationno || !plan) return res.status(400).json({msg: 'Please input required fields'});

    Subs.findOne({fullname})
        .then(sub => {
            if(sub) {                
                User.findById(sub.agent)
                    .then(user => {
                        return res.status(400).json({msg: `Subscriber already exist encoded by: ${user.username}`});
                    })
                    .catch(() => {
                        return;
                    })
            }

            const newSubs = new Subs({...req.body, plan: req.body.plan.split(',')[0], packagename: req.body.plan.split(',')[1]});
        
            newSubs.save()
                .then(newSubs => {
                    res.status(200).json(newSubs);
                })
                .catch(err => {
                    return next(err);
                })
                .catch(() => {
                    return;
                })
        })

}

exports.checkSubs = (req, res, next) => {

    const item = req.body;
    Subs.findOne({$or:[
        {joborderno: item.JONO},
        {accountno: item.COMPLETEACCTNO}
    ]})
        .then(subs => {
            
            if(subs){
                    if(subs.isActive === true){
                        const data = {
                            status: 'Duplicate',
                            subscriber: item
                        }
                        return res.status(200).json(data);
                    }
                const data = {
                    status: 'Matched',
                    subscriber: item
                }
                return res.status(200).json(data);
            }

            if(!subs){
                const data = {
                    status: 'Not Matched',
                    subscriber: item
                }
                return res.status(200).json(data);
            }
        })
        .catch(err => {
            return next(err);
        })
}

exports.encodeAccount = (req, res, next) => {

    const {account, user} = req.body;

    Subs.findOne({accountno: account.COMPLETEACCTNO, joborderno: account.JONO})
        .then(sub => {
            if(sub) return res.status(400).json({msg: 'Account already encoded'});
            const name = account.SUBSCRIBERNAME.replace(',', '').split(' ');
            const newSubs = new Subs({
                isActive: true,
                fullname: name,
                email: account.EMAILADDRESS, 
                contactno: account.CONTACTNO, 
                address: account.COMPLETEADDRESS, 
                applicationno: `unclaimed - ${account.SERIALNO}`,
                plan: account.MLINECURRENTMONTHLYRATE, 
                remarks: 'Installed',
                agent: user._id,
                teamleader: user._id,
                accountno: account.COMPLETEACCTNO,
                joborderno: account.JONO,
                packagename: account.PACKAGENAME,
                installeddate: new Date(),
                remarks: "Installed",
            })

            newSubs.save();

            return res.status(200).json(newSubs);

        })
        .catch(err => {
            return next(err);
        })

}

exports.activateAccount = (req, res, next) => {

    const account = req.body;
    Subs.findOne({
        $or:[
            {joborderno: account.JONO},
            {accountno: account.COMPLETEACCTNO}
        ]
    })
    .then(sub => {
        if(!sub) return res.status(200).json({...account, STATUS: 'Error enocoding'});
        sub.isActive = true;
        sub.plan = account.MLINECURRENTMONTHLYRATE;
        sub.remarks = 'Installed';

        sub.save();
        
        return res.status(200).json(sub);
    })
    .catch(err => {
        return next(err);
    })

}

exports.removeIncentivesDeductions = (req, res, next) => {

    const { type, userId, remarks } = req.body;
    User.findById(userId)
        .then(user => {
            if(!user) return res.status(400).json({ msg: 'User does not exist!' });
            if(type === 'incentives'){
                user.incentives = user.incentives.filter(inc => inc.remarks !== remarks);
            }else if(type === 'deductions'){
                const [ forded ] = user.fordeductions?.filter(ded => ded.remarks === remarks);
                const lastIndex = forded.payment.length - 1;
                const [ lastIndexPayment ] = forded.payment.filter((a, i) => i === lastIndex);
                const lastIndexAmount = lastIndexPayment.amount;
                user.deductions = user.deductions.filter(ded => ded.remarks !== remarks);
                user.fordeductions = [...user.fordeductions.map(ded => ded.remarks === remarks ? {...ded, amount: parseFloat(ded.amount) + parseFloat(lastIndexAmount), payment:[...ded.payment.filter((pay, index) => index !== lastIndex)]} : ded)];
            }

            user.save();

            res.status(200).json(user);
        })
        .catch(err => {
            return next(err);
        })

}

exports.addIncentivesDeductions = (req, res, next) => {

    const { type, userId, remarks, amount } = req.body;
    const newData = {
        remarks,
        amount
    }
    User.findById(userId)
        .then(user => {
            if(!user) return res.status(400).json({ msg: 'User does not exist!' });
            const index = type === 'incentives' ? user.incentives.findIndex(rem => rem.remarks === remarks) : user.deductions.findIndex(rem => rem.remarks === remarks) ;
            if(index > -1) return res.status(400).json({ msg: 'Please enter unique remarks' });
            if(type === 'incentives'){
                user.incentives =  [ ...user.incentives, newData]
            }else if(type === 'deductions'){
                user.deductions =  [ ...user.deductions, newData];
                user.fordeductions = [...user.fordeductions.map(ded => ded.remarks === remarks ? {...ded, amount: ded.amount - amount, payment:[...ded.payment, {amount: amount, date: new Date()}]} : ded)];
            }
            user.save();
            res.status(200).json(user);
        })
        .catch(err => {
            return next(err);
        })

}

exports.getUserSubs = (req, res, next) => {
    const { dateFrom, dateTo, userId } = req.query;
    const cDate = new Date();
    const To = new Date(`${dateTo},${cDate.getHours()}:${cDate.getMinutes()}:${cDate.getSeconds()}.${cDate.getUTCMilliseconds()}`);

    if(!dateFrom || !dateTo || !userId) return res.status(400).json({msg: 'No user found!'});

    Subs.find({
        agent: userId,
        $or:[
            {installeddate: null},
            {installeddate: {
                $gte: new Date(dateFrom),
                $lte: To
            }},
            {ispaidtoagent: false}
        ]
    })
    .sort({encodeddate: -1})
    .then(subscribers => {
        return res.status(200).json(subscribers);
    })
    .catch(err => {
        return next(err);
    })

}

exports.paymentToAgent = async(req, res, next) => {
    const {subscribers, password, myImage, imagePerAgent} = req.body;
    const userId = req.user._id;

    const Currentuser = await User.findById(userId).select('+password');
    if(!Currentuser) return res.status(400).json({msg:"Invalid user can't proceed!"});
    const isMatch = await bcrypt.compare(password, Currentuser.password);
    if(!isMatch) return res.status(400).json({msg:"Invalid user can't proceed!"});

    Subs.bulkWrite(
        subscribers.map(sub => ({
            updateOne:{
               filter:{_id: sub._id,},
               update:{$set:{ispaidtoagent: true, datepaidtoagent: new Date()}}
            }
        }))
    )
    .then(async result => {
        const users = await User.find({});
        users.map(user => {
            user.incentives = [];
            user.deductions = [];
            user.fordeductions = [...user.fordeductions.filter(ded => ded.amount > 0)];
            user.save();
        })

        const newTrans = new Trans({
            userId: 'GRAND',
            allPayout: myImage
        });

        newTrans.save();
        let userTrans = null;
        imagePerAgent.map(data => {
            const newData = new Trans({
                userId: data.id,
                payout: data.image
            });
            
            if(data.image.length > 30){
                newData.save();
                if(newData.userId === userId.toString()){
                    userTrans = newData;
                }
            }
        })

        return res.status(200).json({matched: result.nMatched, updated: result.nModified,grandTrans: newTrans, userTrans});
    })
    .catch(err => {
        return next(err);
    })
}

exports.agentUpdate = (req, res, next) => {
    const { installeddate, address, contactno, email, joborderno, accountno, remarks, plan, id } = req.body;

    Subs.findOne({joborderno})
        .then(subs => {
            if(subs && subs._id.toString() !== id) return res.status(400).json({msg: 'J.O# Already Exist!'});

            Subs.findOne({accountno})
                .then(subs => {
                    if(subs && subs._id.toString() !== id) return res.status(400).json({msg: 'Account# Already Exist!'});

                    Subs.findById(id)
                        .then(subs => {
                            if(!subs) return res.status(400).json({msg: 'Subscriber does not exist!'});
                            subs.address = address ? address : subs.address;
                            subs.contactno = contactno ? contactno : subs.contactno;
                            subs.email = email ? email : subs.email;
                            subs.joborderno = joborderno ? joborderno : subs.joborderno;
                            subs.accountno = accountno ? accountno : subs.accountno;
                            subs.remarks = remarks ? remarks : subs.remarks;
                            subs.plan = plan ? plan.split(',')[0] : subs.plan;
                            subs.packagename = plan ? plan.split(',')[1] : subs.packagename;
                            subs.installeddate = installeddate ? installeddate : subs.installeddate;
                
                            subs.save();
                
                            return res.status(200).json(subs);
                
                        })
                        .catch(err => {
                            return next(err);
                        })
                        .catch(() => {
                            return;
                        })
                    

                })
        })



}

exports.forPayout = (req, res, next) => {

    Subs.find({isActive: true, ispaidtoagent: false})
        .then(subs => {
            const filtered = subs.filter(sub => sub.applicationno.search('unclaimed') === -1).filter(sub => sub.applicationno.search('inclaimed') === -1)
            return res.status(200).json(filtered);
        })
        .catch(err => {
            return next(err);
        })
        .finally(() => {
            return;
        })

}

exports.replaceClaimedSubs = (req, res, next) => {
    
    const newData = req.body;

    Subs.findOne({applicationno: new RegExp(newData.applicationno2, 'i'), ispaidtoagent: false, agent: newData.claimant._id, isActive: false})
        .then(sub => {
            if(!sub) return res.status(400).json({msg: 'Invalid Subscriber'});
            sub.remove().then(() => {
                Subs.findById(newData._id)
                    .then(unclaimedSubs => {
                        if(!sub) return res.status(400).json({msg: 'Invalid Subscriber'});
                        unclaimedSubs.applicationno = newData.applicationno2;
                        unclaimedSubs.agent = newData.claimant._id;
                        unclaimedSubs.teamleader = newData.claimant.teamleader !== null ? newData.claimant.teamleader : newData.claimant._id;

                        unclaimedSubs.save();

                        return res.status(200).json(unclaimedSubs);
                    })
                    .catch(err => {
                        return next(err);
                    })
            })
            .catch(err => {
                return next(err);
            })
        })

}

exports.getAllSubs = (req, res, next) => {
   
    const { dateFrom, dateTo } = req.query;
    const currentDate = new Date();
    const To = new Date(`${dateTo}, ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}.${currentDate.getUTCMilliseconds()}`);
    if(dateFrom > dateTo) return res.status(400).json({msg: "Invalid date selected, 'Date From' should not be greater than 'Date To'"});

    Subs.find({installeddate: {$gte: dateFrom, $lte: To}})
        .sort({encodeddate: -1})    
        .then(allsubs => {
            return res.status(200).json(allsubs);
        })
        .catch(err => {
            return next(err);
        })

}

exports.getUnclaimedSubs = (req, res, next) => {

    Subs.find({ispaidtoagent: false})
        .then(allSubs => {
            const filteredsubs = allSubs.filter(sub => sub.applicationno.search('claimed') !== -1);
            return res.status(200).json(filteredsubs);
        })
        .catch(err => {
            return next(err);
        });

}

exports.getSubsViaApplicationNo = (req, res, next) => {

    const { applicationno, userId } = req.query;

    Subs.findOne({applicationno: new RegExp(applicationno, 'i'), agent: userId})
        .then(sub => {
            if(!sub) return res.status(400).json({msg: 'No Subscriber found!'});
            return res.status(200).json(sub);
        })
        .catch(err => {
            return next(err);
        })

}

exports.getAppsGen = (req, res, next) => {

    
    const { todayDate } = req.query;
    const today = new Date(todayDate);
    console.log(`${today}-appsgen date`);
    Subs.find({encodeddate: {
        $gte: today
    }})
    .then(appsgen => {
        return res.status(200).json(appsgen);
    })
    .catch(err => {
        return next(err);
    })
    .finally(err => {
        return;
    })

}

exports.addMannySubs = async (req, res, next) => {
    const allSubs = await Subs.find({ispaidtoagent: true});
    
    Subs.bulkWrite(
        allSubs.map(sub => ({
            updateOne:{
                filter:{_id: sub._id},
                update:{$set:{ispaidtoagent: false, datepaidtoagent: null}}
            }
        }))
    )
    .then(subs => {
        return res.status(200).json(subs);
    })
    .catch(err => {
        return next(err);
    })

}