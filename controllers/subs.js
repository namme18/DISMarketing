const Subs = require('../model/Subs');
const User = require('../model/User');

exports.addSubs = (req, res, next) => {
    const { fullname, email, contactno, address, applicationno, packagename} = req.body;
    if(!fullname || !email || !contactno || !address || !applicationno || !packagename) return res.status(400).json({msg: 'Please input required fields'});

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

            const newSubs = new Subs(req.body);
        
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