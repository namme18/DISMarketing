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
    bday: {
        type: Date,
        default: null
    },
    civilstatus: {
        type: String,
        default: null
    },
    mothersmaidenname: {
        type: String,
        default: null
    },
    gender: {
        type: String,
        default: null
    },
    spouse: {
        type: String,
        default: null
    },
    citizenship: {
        type: String,
        default: null
    },
    payment: {
        type: String,
        default: null
    },
    node: {
        type: String,
        default: null
    },
    agentcodename: {
        type: String,
        default: null
    },
    installationdate: {
        type: Date,
        default: null
    },
    attachments: {
        type: [Object],
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
    },
    lastmodified:{
        type: Date,
        default: Date.now()
    },
    sppstatus: {
        type: Object,
        default: {
            remarks:[
                {
                    id: 'sdgf987sd6fgsaduhfisadjgasdg987a8d5as87dfasd87f6',
                    position: 'agent',
                    msg: 'submit compliance',
                    attachments: ['https://iclick-dis-app.s3.amazonaws.com/2021-12-11T06-55-26.077Z034d659802435efa11f93c69e254c32967c2c3b0--image0.jpeg', 'https://iclick-dis-app.s3.amazonaws.com/2021-12-11T06-55-26.077Z034d659802435efa11f93c69e254c32967c2c3b0--image0.jpeg']
                },
                {
                    id: 'sdgf987sd6fgsaduhfisadjgasdg987a8d5as87dfasd87f6',
                    position: 'admin',
                    msg: 'submit compliance',
                    attachments: ['https://iclick-dis-app.s3.amazonaws.com/2021-12-11T06-55-26.077Z034d659802435efa11f93c69e254c32967c2c3b0--image0.jpeg', 'https://iclick-dis-app.s3.amazonaws.com/2021-12-11T06-55-26.077Z034d659802435efa11f93c69e254c32967c2c3b0--image0.jpeg']
                }
            ],
            status: 'encoding'
        }
    }
});

const Subs = mongoose.model('Subs', SubsSchema);
module.exports = Subs;