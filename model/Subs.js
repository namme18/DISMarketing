const mongoose = require('mongoose');

const SubsSchema = mongoose.Schema({
    fullname:{
        type: [String],
        require: [true, 'Please provide subscribers full name!']
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'Email already exist!'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email'
        ]
    },
    contactno: {
        type: String,
        require: true,
        minlength: 11
    },
    address: {
        type: String,
        required: true,
        minlength: 10
    },
    applicationno: {
        type: String,
        unique: [true, 'Application no. already exist!'],
        required: [true ,'Please provide complete application number']
    },
    plan: {
        type: String,
        default: null
    },
    packagename: {
        type: String,
        default: null
    },
    planinstalled: {
        type: String,
        default: null
    },
    remarks: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: false
    },
    agent: {
        type: String,
        required: true
    },
    teamleader: {
        type: String,
        required: true
    },
    joborderno: {
        type: String,
        default: null,
    },
    accountno: {
        type: String,
        default: null,
    },
    ispaidtoagent: {
        type: Boolean,
        default: false,
    },
    ispaidfromconverge: {
        type: Boolean,
        default: false
    },
    encodeddate: {
        type: Date,
        default: Date.now()
    },
    installeddate: {
        type: Date,
        default: null
    },
    datepaidtoagent: {
        type: Date,
        default: null
    }
});

const Subs = mongoose.model('Subs', SubsSchema);
module.exports = Subs;