const { getTime, getMinutes, getMilliseconds, getHours } = require('date-fns');
const { query, application } = require('express');
const Subs = require('../model/Subs');
const User = require('../model/User');

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

exports.deleteSubs = (req, res, next) => {
    Subs.deleteMany()
        .then(result => {
           return res.status(200).json({msg: `${result.deletedCount} is successfully deleted!`});
        })
        .catch(err => {
            return next(err);
        })
        .catch(() => {
            return;
        })
}

exports.getAllSubs = (req, res, next) => {
   
    const { dateFrom, dateTo, search } = req.query;
    const currentDate = new Date();
    const To = new Date(`${dateTo}, ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}.${currentDate.getUTCMilliseconds()}`);
    if(dateFrom > dateTo) return res.status(400).json({msg: "Invalid date selected, 'Date From' should not be greater than 'Date To'"});

    if(search === 'null' || search === ''){
    return Subs.find({encodeddate:{
            $gte:dateFrom,
            $lte:To
            }
        })
        .sort({encodeddate: -1})
        .then(allsubs => {
            return res.status(200).json(allsubs);
        })
        .catch(err => {
            return next(err);
        })
        .catch(() => {
            return;
        })
    }

    if(search){
    return Subs.find({encodeddate:{
            $gte: dateFrom,
            $lte: To
            },
            $or: [
                {fullname:{$in : new RegExp(search.split(' '),'i')}},
                {applicationno: search},
                {email: search},
                {contactno: search},
                {joborderno: search},
                {accountno: search}
            ]
        })
        .then(allsubs => {
            return res.status(200).json(allsubs);
        })
        .catch(err => {
            return next(err);
        })
        .catch(() => {
            return;
        })
    }

}

exports.addMannySubs = (req, res, next) => {

    const mannyData = req.body;
    const names = [];
    mannyData.map(sub => {
        if(sub){
            Subs.findOne({fullname: sub.fullname})
            .then(existingSub => {
                console.log(existingSub);
            })
        }
    });
    console.log(names);


    Subs.insertMany(mannyData)
        .then(result => {
           return res.status(200).json(result);
        })
        .catch(err => {
            return res.status(400).json({msg: err.message});
        })
        .catch(() => {
            return;
        })

}