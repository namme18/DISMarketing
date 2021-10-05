const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide username']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    restrictionlevel:{
        type: String,
        default: null
    },
    teamleader: {
        type: String,
        default: null
    },
    registerDate: {
        type: Date,
        default: Date.now()
    },
    emailVerified:{
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    verifyEmailToken: String,
    verifyEmailExpire: Date,
    incentives:{
        type: [Object],
        default: null
    },
    deductions:{
        type: [Object],
        default: null
    },
    inoutinfo:{
        type: [Object],
        default: [null]
    },
    profilePicture: {
        type: Object,
        default: null
    },
    fordeductions:{
        type: [Object],
        default: null
        // [ 
        //     {
        //         remarks: 'sample 1',
        //         amount: 1000,
        //         payment:[],
        //         date: Date.now()
        //     },
        //     {
        //         remarks: 'sample 2',
        //         amount: 500,
        //         payment:[],
        //         date: Date.now()
        //     },
        //     {
        //         remarks: 'sample 3',
        //         amount: 300,
        //         payment:[],
        //         date: Date.now()
        //     }
        // ]
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;