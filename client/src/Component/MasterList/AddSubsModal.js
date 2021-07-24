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
    StepContent
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import useStyles from './style';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import CancelIcon from '@material-ui/icons/Cancel';
import { useDispatch, useSelector } from 'react-redux';
import { addSubs } from '../../redux/reducers/subsActions/addSubs';
import { useHistory } from 'react-router-dom';

const AddSubsModal = ({openModal, setOpenModal}) => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const [activeStep, setActiveStep] = React.useState(0);
    const steps = ['Step 1', 'Step 2', 'Submit'];
    const { user } = useSelector(state => state.authReducer);
    const { id } = useSelector(state => state.successReducer);
    const { msg } = useSelector(state => state.errorReducer);

    const [data, setData] = useState({
        lastname: '',
        firstname: '',
        middlename: '',
        email: '',
        contactno: '',
        address: '',
        applicationno: '',
        plan: '',
        remarks: '',
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

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      };

    const onSubmit = e => {
        e.preventDefault();
        if(msg ==='jwt expire') return history.push('/auth/login');
        const fullname = [data.lastname, data.firstname, data.middlename];
        const { email, contactno, address, applicationno, plan, remarks } = data;

        const newSubscriber = {
            fullname,
            email, 
            contactno, 
            address, 
            applicationno, 
            plan, 
            remarks,
            agent: user._id,
            teamleader: user.restrictionlevel === 'operation manager' || 'teamleader' || 'owner' ? user._id : user.teamleader
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
                            className={classes.textField}
                            autoFocus
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
                            className={classes.textField}
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
                            className={classes.textField}
                            inputProps={{
                                style: {'textTransform': 'capitalize'}
                            }}
                        />
            </>
            )
            case 1:
                return (
                    <>
                    <TextField 
                            type='email'
                            name='email'
                            label='Email'
                            placeholder='Sample@gmail.com'
                            value={data.email}
                            onChange={onChange}
                            fullWidth
                            className={classes.textField}
                            autoFocus
                        />

                        <TextField 
                            type='text'
                            name='contactno'
                            label='Contact#'
                            placeholder='0900-0000-000'
                            value={data.contactno}
                            onChange={onChange}
                            fullWidth
                            className={classes.textField}
                        />

                        <TextField 
                            type='text'
                            name='address'
                            label='Address'
                            placeholder='House #, Brgy, Municipality, Province'
                            value={data.address}
                            onChange={onChange}
                            fullWidth
                            className={classes.textField}
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
                            name='applicationno'
                            label='Application #'
                            placeholder='000222233'
                            value={data.applicationno}
                            onChange={onChange}
                            fullWidth
                            className={classes.textField}
                            autoFocus
                        />

                        <Select 
                            name='plan'
                            inputProps={{ 'aria-label': 'Without label' }}
                            onChange={onChange}
                            fullWidth
                            displayEmpty
                            className={classes.textField}
                        >
                            <MenuItem disabled><Typography color='textSecondary' variant='body2'>Choose Plan...</Typography></MenuItem>
                            {plans.map(plan => (
                                <MenuItem value={[plan.plan,plan.name].join()}>{plan.name}</MenuItem>
                                ))}
                        </Select>

                        <Select
                            name='remarks'
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            onChange={onChange}
                            fullWidth
                            className={classes.textField}
                        >
                            <MenuItem disabled>Remarks</MenuItem>
                            <MenuItem value='for installation' >For Installation</MenuItem>
                            <MenuItem value='standby' >StandBy</MenuItem>
                        </Select>
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
                    <Paper className={classes.paper} elevation={6} >
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