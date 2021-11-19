import { 
    Avatar, 
    Container, 
    Modal, 
    Paper, 
    TextField, 
    Typography, 
    Grid, 
    IconButton, 
    Tooltip, 
    MenuItem, 
    Select, 
    Button,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@material-ui/core';
import { styled } from '@mui/material/styles';
import React, { useState, useEffect, useReducer } from 'react';
import useStyles from '../MasterList/style';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import CancelIcon from '@material-ui/icons/Cancel';
import { useDispatch, useSelector } from 'react-redux';
import { addSubs } from '../../redux/reducers/subsActions/addSubs';
import { useHistory } from 'react-router-dom';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { getErrors } from '../../redux/reducers/errorReducer';
import ClearIcon from '@mui/icons-material/Clear';
import { v4 as uuid } from 'uuid';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const reducer = (attached, action) => {
    switch(action.type){
        case "ADDIMAGE":
            return [...attached, action.payload]
        case "CLEARIMAGE":
            return []
        case "DELETEIMAGE":
            return [...attached.filter(data => data.id !== action.payload)]
        default:
            return [...attached]
    }
}

const validationReducer = (validation, action) => {
    switch(action.type){
        case "SETSTEP1FALSE":
            return {...validation, step1: {...validation.step1, [action.payload]: false}}
        case "SETSTEP1TRUE":
            return {...validation, step1: {...validation.step1, [action.payload]: true}}
        case "SETAGETRUE":
            return {...validation, step1: {...validation.step1, bday: true}}
        case "SETAGEFALSE":
            return {...validation, step1: {...validation.step1, bday: false}}
        case "SETEMAILFALSE":
            return {...validation, step2: {...validation.step2, email: false}}
        case "SETEMAILTRUE":
            return {...validation, step2: {...validation.step2, email: true}}
        case "SETSTEP2FALSE":
            return {...validation, step2: {...validation.step2, [action.payload]: false}}
        case "SETSTEP2TRUE":
            return {...validation, step2: {...validation.step2, [action.payload]: true}}
        case "SETSPOUSE":
            return {...validation, step2: {...validation.step2, spouse: false}}
        case "SETSTEP3FALSE":
            return {...validation, step3: {...validation.step3, [action.payload]: false}}
        case "SETSTEP3TRUE":
            return {...validation, step3: {...validation.step3, [action.payload]: true}}
        case "SETSINSTALLDATE":
            return {...validation, step3: {...validation.step3, installationdate: false}}
        case "SETINSTALLFALSE":
            return {...validation, step3: {...validation.step3, installationdate: false}}
        case "SETINSTALLTRUE":
            return {...validation, step3: {...validation.step3, installationdate: true}}
        default:
            return {...validation}
    }
}

const StyledClearIcon = styled(ClearIcon)(({theme}) => ({
    width: '10px', 
    height: '10px', 
    position: 'absolute',
    color: 'red',
    top: '0', 
    right: '1px', 
    padding: '0',
    cursor: 'pointer', 
    "&:hover":{
        transform: 'scale(1.1)'
    }
}))

const AddSubsModal = ({openModal, setOpenModal}) => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const [activeStep, setActiveStep] = React.useState(0);
    const steps = ['Step 1', 'Step 2', 'Submit'];
    const { user } = useSelector(state => state.authReducer);
    const { id } = useSelector(state => state.successReducer);
    const { msg } = useSelector(state => state.errorReducer);

    const [validation, setValidation] = useReducer(validationReducer, {
        step1: {
            lastname: true,
            firstname: true,
            middlename: true,
            bday: true,
            gender: true,
            civilstatus: true
        },
        step2: {
            mothersmaidenname: true,
            citizenship: false,
            email: true,
            contactno: true,
            address: true,
            spouse: true,
        },
        step3: {
            payment: true,
            node: true,
            agentcodename: true,
            applicationno: true,
            plan: true,
            remarks: true,
            installationdate: true

        }
    });

    const [attached, setAttached] = useReducer(reducer, []);
    const clearattahchements = () => {
        setAttached({
            type:"CLEARIMAGE"
        });
    }
    
    const deleteImage = id => {
        setAttached({
            type: "DELETEIMAGE",
            payload: id
        });
    }
    
    const [data, setData] = useState({
        lastname: '',
        firstname: '',
        middlename: '',
        email: '',
        contactno: '',
        address: '',
        applicationno: '',
        mothersmaidenname: '',
        plan: '',
        remarks: '',
        bday: '',
        civilstatus: '',
        gender: '',
        spouse: '',
        citizenship: 'filipino',
        payment: '',
        node: '',
        agentcodename: '',
        installationdate: ''
    })
    
    const onChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const clearFields = () => {
        setData({
            lastname: '',
            firstname: '',
            middlename: '',
            email: '',
            contactno: '',
            address: '',
            applicationno: '',
            plan: '',
            remarks: '',
            bday: '',
            civilstatus: '',
            mothersmaidenname: '',
            gender: '',
            spouse: '',
            citizenship: '',
            payment: '',
            node: '',
            agentcodename: '',
            installationdate: ''
        });
    }

    useEffect(() => {
        if(id === 'ADD_SUCCESS'){
            setOpenModal(false);
            clearFields();
            setActiveStep(0);
        }
    },[id]);

    const handleCloseModal = (e, reason) => {
        if(reason === 'backdropClick'){
            return;
        }
        setOpenModal(false);
        clearFields();
        setActiveStep(0);
    }

    const validateInput = (e) => {
        if(isNaN(e.key)){
            e.preventDefault();
        }
    }

    const subsAge = new Date().getFullYear() - new Date(data.bday).getFullYear();
    const isEmailValid = data.email.search(/@gmail.com|@yahoo.com|@hotmail.com|@outlook.com/) > 0 ? true : false;
    const isInstallDateValid = new Date(data.installationdate).getDate() > new Date().getDate() ? true : false;

    useEffect(() => {
        Object.keys(activeStep === 0 ? validation.step1 : activeStep === 1 ? validation.step2 : validation.step3).map(key => {
            const pointers = Object.entries(data).filter(item => item[0] === key);
            const textCount = pointers[0][1]?.length;
            if(textCount < 1){
                setValidation({type: activeStep === 0 ? "SETSTEP1TRUE" : activeStep === 1 ? "SETSTEP2TRUE" : "SETSTEP3TRUE", payload: key});
            }
            if(textCount > 0){
                setValidation({type: activeStep === 0 ? "SETSTEP1FALSE" : activeStep === 1 ? "SETSTEP2FALSE" : "SETSTEP3FALSE", payload: key});
            }
        })

        if(data.civilstatus !== 'married'){
            setValidation({type: "SETSPOUSE"});
        }
        
        if(data.remarks !== 'for installation'){
            setValidation({type: "SETINSTALLDATE"});
        }

        if(subsAge > 17){
            setValidation({type: "SETAGEFALSE"});
        }else{
            setValidation({type: "SETAGETRUE"});
        }

        if(isEmailValid){
            setValidation({type: "SETEMAILFALSE"});
        }else{
            setValidation({type: "SETEMAILTRUE"});
        }

        if(isInstallDateValid){
            setValidation({type: "SETINSTALLDATEFALSE"});
        }else{
            setValidation({type: "SETINSTALLDATETRUE"});
        }

    },[data]);

    useEffect(() => {
        if(data.civilstatus !== 'married'){
            setData(data => ({...data, spouse: ''}));
        }
        if(data.remarks !== 'for installation'){
            setData(data => ({...data, installationdate: ''}));
        }
    },[data.civilstatus, data.remarks]);

    const isNotCompleteStepOne = Object.values(validation.step1).some(res => res === true);
    const isNotCompleteStepTwo = Object.values(validation.step2).some(res => res === true);
    const isNotCompleteStepThree = Object.values(validation.step3).some(res => res === true);


    const handleNext = () => {
        if(activeStep === 0 && isNotCompleteStepOne){
            const errData = {
                msg: 'Please fillout all fields',
                status: 400,
                id: 'ERROR'
            }
            dispatch(getErrors(errData));
        }

        if(activeStep === 0 && !isNotCompleteStepOne){
            setActiveStep((prevActiveStep) => prevActiveStep + 1 );
        }

        if(activeStep === 1 && isNotCompleteStepTwo){
            const errData = {
                msg: 'Please fillout all fields',
                status: 400,
                id: 'ERROR'
            }
            dispatch(getErrors(errData));
        }

        if(activeStep === 1 && !isNotCompleteStepTwo){
            setActiveStep((prevActiveStep) => prevActiveStep + 1 );
        }
      };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      };

    const onSubmit = e => {
        e.preventDefault();

        if((activeStep === 2 && isNotCompleteStepThree) || attached.length < 1){
            const errData = {
                msg: 'Please fillout all fields',
                status: 400,
                id: 'ERROR'
            }
            return dispatch(getErrors(errData));
        }

        if(msg ==='jwt expire') return history.push('/auth/login');
        const fullname = [data.lastname, data.firstname, data.middlename];
        const { email, contactno, address, applicationno, plan, remarks, bday, civilstatus, mothersmaidenname, gender, spouse, citizenship, payment, node, agentcodename, installationdate } = data;

        const newSubscriber = {
            fullname,
            email, 
            contactno, 
            address, 
            applicationno, 
            plan, 
            remarks,
            agent: user._id,
            teamleader: user.restrictionlevel === 'agent' ? user.teamleader : user._id,
            bday: new Date(bday),
            civilstatus,
            mothersmaidenname,
            gender,
            spouse,
            citizenship,
            payment,
            node,
            agentcodename,
            installationdate: new Date(installationdate),
            attachments: attached,
        }

       dispatch(addSubs(newSubscriber));

    }

    const plans = [
        {
            name: 'FiberX 35Mbps',
            plan: 1500
        },
        {
            name: 'FiberX 100Mbps',
            plan: 2500
        },
        {
            name: 'FiberX 200mbps',
            plan: 3500
        },
        {
            name: 'Air Internet 5Mbps',
            plan: 1000
        },
        {
            name: ' Air Internet 10Mbps',
            plan: 1250
        },
        {
            name: 'Air 299 + Internet 5Mbps',
            plan: 1299
        },
        {
            name: 'Air 499 + Internet 5Mbps',
            plan: 1499
        },
        {
            name: 'Air 699 + Internet 5Mbps',
            plan: 1699
        },
        {
            name: 'Air 299 + Internet 10Mbps',
            plan: 1549
        },
        {
            name: 'Air 499 + Internet 10Mbps',
            plan: 1749
        },
        {
            name: 'Air 699 + Internet 10Mbps',
            plan: 1949
        }
    ]

    const uploadAttached = e => {
        const files = Object.values(e.target.files);
        const isError = files.map(file => {
            if(file.type.search('image') === -1){
                const errData = {
                    msg: 'Invalid Attachments, types should be image only',
                    status: 400,
                    id: 'ERROR'
                }
                dispatch(getErrors(errData));
                return 'error';
            }
        }).some(res => res === 'error');
        if(!isError){
            files.map(img => {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(img);
                fileReader.onload = e => {
                    const data = {
                        id: uuid(),
                        img: e.target.result 
                    }
                    setAttached({type: "ADDIMAGE", payload: data})
                }
            })
        }
    }

    const getStepContent = step => {
        switch (step) {
            case 0: 
            return (
                <>
                <TextField 
                            type='text'
                            name='lastname'
                            label='Last Name'
                            placeholder='Last Name'
                            value={data.lastname}
                            onChange={onChange}
                            fullWidth
                            className={classes.textFieldModal}
                            autoFocus
                            required
                            error={validation.step1.lastname}
                            inputProps={{
                                style: {'textTransform': 'capitalize'}
                            }}
                        />

                        <TextField 
                            type='text'
                            name='firstname'
                            label='First Name'
                            placeholder='First Name'
                            value={data.firstname}
                            onChange={onChange}
                            fullWidth
                            required
                            className={classes.textFieldModal}
                            error={validation.step1.firstname}
                            inputProps={{
                                style: {'textTransform': 'capitalize'}
                            }}
                        />

                        <TextField 
                            type='text'
                            name='middlename'
                            label='Middle Name'
                            placeholder='Last Name'
                            value={data.middlename}
                            onChange={onChange}
                            fullWidth
                            className={classes.textFieldModal}
                            error={validation.step1.middlename}
                            required
                            inputProps={{
                                style: {'textTransform': 'capitalize'}
                            }}
                        />

                        {subsAge < 18 && (
                            <Typography variant='body2' color='error' >Must be 18 yrs old above!</Typography>
                        )}

                        <TextField 
                            type='date'
                            name='bday'
                            label='Birth Day'
                            placeholder='Birth Day'
                            value={data.bday}
                            onChange={onChange}
                            fullWidth
                            className={classes.textFieldModal}
                            error={validation.step1.bday}
                            required
                            inputProps={{
                                style: {'textTransform': 'capitalize'},

                            }}
                            InputLabelProps = {{
                                shrink: true
                            }}
                        />

                        <FormControl component='fieldset' style={{margin: '5px 0', border: '1px solid lightgray', padding: '5px'}} fullWidth required error={validation.step1.gender}>
                            <FormLabel component='legend'>Gender</FormLabel>
                            <RadioGroup row aria-label='gender' name='gender' onChange={onChange} defaultValue={data.gender}>
                                <FormControlLabel value='female' control={<Radio />} label='FeMale' />
                                <FormControlLabel value='male' control={<Radio />} label='Male' />
                            </RadioGroup>
                        </FormControl>

                        <FormControl component='fieldset' style={{margin: '5px 0', border: '1px solid lightgray', padding: '5px'}} fullWidth required error={validation.step1.civilstatus}>
                            <FormLabel component='legend'>Civil Status</FormLabel>
                            <RadioGroup row aria-label='civilstatus' name='civilstatus' onChange={onChange} defaultValue={data.civilstatus}>
                                <FormControlLabel value='single' control={<Radio />} label='Single' />
                                <FormControlLabel value='married' control={<Radio />} label='Married' />
                                <FormControlLabel value='widow' control={<Radio />} label='Widow' />
                            </RadioGroup>
                        </FormControl>
            </>
            )
            case 1:
                return (
                    <>
                        <TextField 
                            type='text'
                            name='mothersmaidenname'
                            label="Full Mother's Maiden Name"
                            placeholder='FirstName, MidName, Lastname'
                            value={data.mothersmaidenname}
                            onChange={onChange}
                            fullWidth
                            className={classes.textFieldModal}
                            autoFocus
                            required
                            error={validation.step2.mothersmaidenname}
                            inputProps={{
                                style: {'textTransform': 'capitalize'}
                            }}
                        />

                        {data.civilstatus === 'married' && (
                            <TextField 
                            type='text'
                            name='spouse'
                            label="Name of Spouse"
                            placeholder='FirstName, MidName, Lastname'
                            value={data.spouse}
                            onChange={onChange}
                            fullWidth
                            required
                            error={validation.step2.spouse}
                            className={classes.textFieldModal}
                            />
                        )}

                            <TextField 
                            type='text'
                            name='citizenship'
                            label="Citizenship"
                            placeholder='Filipino'
                            value={data.citizenship}
                            onChange={onChange}
                            fullWidth
                            required
                            error={validation.step2.citizenship}
                            className={classes.textFieldModal}
                            inputProps={{
                                style: {'textTransform': 'capitalize'}
                            }}
                            />

                        {!isEmailValid && (
                            <Typography variant='body2' color='error'>Please input valid email!</Typography>
                        )}

                        <TextField 
                            type='email'
                            name='email'
                            label='Email'
                            placeholder='Sample@gmail.com'
                            value={data.email}
                            onChange={onChange}
                            fullWidth
                            required
                            error={validation.step2.email}
                            className={classes.textFieldModal}
                        />

                        <TextField 
                            type='text'
                            name='contactno'
                            label='Contact#'
                            placeholder='0900-0000-000'
                            value={data.contactno}
                            onChange={onChange}
                            fullWidth
                            required
                            onKeyPress={validateInput}
                            error={validation.step2.contactno}
                            className={classes.textFieldModal}
                        />

                        <TextField 
                            type='text'
                            name='address'
                            label='Address'
                            placeholder='House #, Brgy, Municipality, Province'
                            value={data.address}
                            onChange={onChange}
                            fullWidth
                            required
                            error={validation.step2.address}
                            className={classes.textFieldModal}
                            inputProps={{
                                style: {'textTransform': 'capitalize'}
                            }}
                        />
                    </>
                )
                case 2:
                    return (
                        <>
                        <TextField 
                            type='text'
                            name='payment'
                            label='Payment'
                            placeholder='$amount advance payment'
                            value={data.payment}
                            onChange={onChange}
                            fullWidth
                            required
                            error={validation.step3.payment}
                            className={classes.textFieldModal}
                            autoFocus
                        />

                        <TextField 
                            type='text'
                            name='node'
                            label='Node'
                            placeholder='SIT-001 LP44 NP3'
                            value={data.node}
                            onChange={onChange}
                            fullWidth
                            required
                            error={validation.step3.node}
                            className={classes.textFieldModal}
                            inputProps={{
                                style: {'textTransform': 'uppercase'}
                            }}
                        />

                        <TextField 
                            type='text'
                            name='agentcodename'
                            label='Agent Code Name'
                            placeholder='Agent Code Name'
                            value={data.agentcodename}
                            onChange={onChange}
                            fullWidth
                            required
                            error={validation.step3.agentcodename}
                            className={classes.textFieldModal}
                            inputProps={{
                                style: {'textTransform': 'uppercase'}
                            }}
                        />

                        <TextField 
                            type='text'
                            name='applicationno'
                            label='Application #'
                            placeholder='000222233'
                            value={data.applicationno}
                            onChange={onChange}
                            fullWidth
                            required
                            error={validation.step3.applicationno}
                            className={classes.textFieldModal}
                        />

                        <Select 
                            name='plan'
                            inputProps={{ 'aria-label': 'Without label' }}
                            onChange={onChange}
                            fullWidth
                            displayEmpty
                            required
                            error={validation.step3.plan}
                            className={classes.textFieldModal}
                        >
                            <MenuItem disabled><Typography color='textSecondary' variant='body2'>Choose Plan...</Typography></MenuItem>
                            {plans.map((plan, index) => (
                                <MenuItem key={index} value={[plan.plan,plan.name].join()}>{plan.name}</MenuItem>
                                ))}
                        </Select>

                        <Select
                            name='remarks'
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            onChange={onChange}
                            fullWidth
                            required
                            error={validation.step3.remarks}
                            className={classes.textFieldModal}
                        >
                            <MenuItem disabled><Typography color='textSecondary' variant='body2'>Remarks</Typography></MenuItem>
                            <MenuItem value='for installation' >For Installation</MenuItem>
                            <MenuItem value='standby' >StandBy</MenuItem>
                        </Select>

                        {!isInstallDateValid && (
                            <Typography variant='body2' color='error'>Invalid installation date</Typography>
                        )}

                        {data.remarks === 'for installation' && (
                            <TextField 
                            type='date'
                            name='installationdate'
                            label='Installation Schedule'
                            placeholder='Installation Schedule'
                            value={data.installationdate}
                            onChange={onChange}
                            fullWidth
                            required
                            error={validation.step3.installationdate}
                            className={classes.textFieldModal}
                            InputLabelProps={{
                                shrink: true
                            }}
                            />
                        )}

                        <input type='file' name='filebase64' id='filebase64' multiple style={{display: 'none'}} onChange={uploadAttached} />
                        <label htmlFor='filebase64'>
                                <Button variant='contained' component='span' style={{margin:'10px 0', backgroundColor: 'teal', color: 'white', borderRadius: '0'}} fullWidth startIcon={attached.length > 0 ? <AddCircleIcon/> : <FileUploadIcon />}>
                                    {attached.length > 0 ? 'Add Attachments' : 'Upload Attachments'}
                                </Button>
                        </label>
                                <Grid container justify='space-between' style={{padding: '0px 2px'}}>
                                    <Typography variant='body2' color='textSecondary'>Attachments:</Typography>
                                    {attached.length > 0 && (
                                        <Typography variant='body2' style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}} onClick={clearattahchements}>Clear</Typography>
                                    )}
                                </Grid>
                                {attached.length > 0 && (
                                    <Grid container style={{border: '1px solid lightgray', padding: '5px'}}>
                                        {attached.map(data => (
                                            <Grid key={data.id} item xs={3} style={{padding: '2px 2px'}}>
                                                <div style={{position:'relative', height: '70px', backgroundColor:'#f4f4f4', border:'1px solid #c4c4c4', cursor: 'pointer'}}>
                                                <StyledClearIcon onClick={() => deleteImage(data.id)} />
                                                <img src={data.img} style={{height:'100%', width:'100%', objectFit: 'cover', borderRadius: '2px'}} />
                                                </div>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}

                        </>
                    )
            default:
                return 'unknown step'
        }
    }

    return(
        <div>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="Subscribers Info"
                aria-describedby="Subscribers Info"
                className={classes.modal}
            >
               <Container component='main' maxWidth='xs'>
                    <Paper className={classes.paper} elevation={6} style={{maxHeight: '90vh', overflowY: 'scroll'}} >
                    <Grid container className={classes.closeModal} justify='flex-end'>
                        <IconButton onClick={handleCloseModal} style={{padding: '0'}}>
                            <Tooltip title='Close'>
                                <CancelIcon color='error' />
                            </Tooltip>
                        </IconButton>
                    </Grid>
                        <Avatar>
                            <FormatAlignJustifyIcon color='secondary' />
                        </Avatar>
                        <Typography variant='h6'>Subscribers Form</Typography>
                        
                        <form noValidate onSubmit={onSubmit}>
                        <Stepper activeStep={activeStep} orientation='vertical'>
                            {steps.map((label, index) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                    <StepContent>
                                        <Typography>{getStepContent(index)}</Typography>
                                        <div className={classes.actionsContainer}>
                                            <div>
                                                <Button 
                                                    disabled={activeStep === 0}
                                                    onClick={handleBack}
                                                    className={classes.button}
                                                >
                                                    Back
                                                </Button>
                                                <Button 
                                                    variant='contained'
                                                    color='primary'
                                                    onClick={activeStep === steps.length - 1 ? onSubmit : handleNext}
                                                    className={classes.button}
                                                >
                                                    {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                                                </Button>
                                            </div>
                                        </div>
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                        </form>
                    </Paper>
               </Container>
            </Modal>
        </div>
    )
}

export default AddSubsModal;