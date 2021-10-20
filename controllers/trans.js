const Trans = require('../model/Trans');

exports.getUserTrans = (req, res, next) => {

    const userId = req.user._id;

    Trans.find({userId: userId})
    .limit(10)
    .sort({date: -1})
    .then(transImages => {
            if(transImages.length < 1) return res.status(400).json({msg: "Can't Retrieved Transactions!"});
            return res.status(200).json(transImages);
        })
        .catch(err => {
            return next(err);
        })
}

exports.getGrandTrans = (req, res, next) => {

    Trans.find({userId: 'GRAND'})
        .limit(10)
        .sort({date: -1})
        .then(transImages => {
            if(transImages.length < 1) return res.status(400).json({msg: "Can't Retrieved Transactions!"});
            return res.status(200).json(transImages);
        })
        .catch(err => {
            return next(err);
        })
}