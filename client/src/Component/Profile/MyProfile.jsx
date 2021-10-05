import React,{ useReducer, useState } from 'react';
import {
    Avatar,
    Grid,
    Button,
    Stack,
    Divider,
    TextField,
    Typography,
    Box,
    IconButton,
    Tooltip
} from '@mui/material';
import { useSelector } from 'react-redux';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { PointersTypography, ValuesTypography } from './style';
import DnsIcon from '@mui/icons-material/Dns';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import TitleIcon from '@mui/icons-material/Title';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { format } from 'date-fns';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SaveIcon from '@mui/icons-material/Save';
import { useDispatch } from 'react-redux';
import { addProfilePicture } from '../../redux/reducers/authActions/addProfilePicture';
import { getErrors } from '../../redux/reducers/errorReducer';

const reducer = (data, action) => {
    switch(action.type){
        case "ADDIMAGE":
            return {...data , profilePicture: [...data.profilePicture, action.payload]};
        case "CLEARIMAGE":
            return {...data, profilePicture: []}
    }
}

const MyProfile = () => {
    
    const dispatch = useDispatch();
    const user = useSelector(state => state.authReducer?.user);
    const allUsers = useSelector(state => state.authReducer?.allUsers);

    const regData = format(new Date(user.registerDate), 'MMMM d, Y');
    const [ teamLeader ] = allUsers?.filter(account => account._id === user.teamleader);
    const fordeduction = user?.fordeductions?.map(item => parseFloat(item.amount)).reduce((a, b) => a + b, 0).toFixed(2);
    
    const [data, setData] = useReducer(reducer, {
        profilePicture: [user.profilePicture]
    });

    const [profile, setProfile] = useState(false);

    console.log(fordeduction);

    const onChange =(e) => {
        setData({type: "CLEARIMAGE"});
        const images = Object.values(e.target.files);
        images?.map(img => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(img);
            fileReader.onload = e => {
                setData({
                    type: "ADDIMAGE", payload: e.target.result
                })
            }
        })
        setProfile(true);
    }

    const handleClickSave = () => {
        if(profile){
            dispatch(addProfilePicture(data.profilePicture[0]));
        }else{
            const errData = {
                msg: 'No change made!',
                status: 400,
                id: 'FAILED!'
            }
            dispatch(getErrors(errData));
        }
        setProfile(false);
    }

    const updateInfo = e => {
        console.log(e.target.value);
    }

    const onSubmit = e => {
        e.preventDefault();
        alert(e);
    }
    
    return(
        <Grid container spacing={2}>
            <Grid item container direction='column' xs={12} sm={12} md={5} key='avatar' spacing={1} justify='center' alignItems='center'>
                <Grid item key='userAvatar'>
                    <Avatar 
                    src={data?.profilePicture[0]}
                    sx={{
                        width: 150, height: 150, 
                        backgroundColor: 'success.light',
                        fontSize: 'xxx-large'
                        }}>
                            {user?.username[0]?.toUpperCase()}
                    </Avatar>
                </Grid>

                <Grid item container key='upload-save-wrapper' direction='row' justifyContent='center' alignItems='center'>
                    <Grid item key='uploadButton'>
                        <input name='filebase64' multiple type='file' id='filebase64' style={{display:'none'}} onChange={onChange} />
                        <label htmlFor='filebase64'>
                            <Button sx={{
                                borderRadius: 0,
                                fontSize: 'x-small',
                                px: 0.5,
                                py: 0.2
                            }} variant='contained' component='span' startIcon={<ChangeCircleIcon />}>Change</Button>
                        </label>
                    </Grid>

                    <Grid item key='savePic'>
                        <Tooltip title='Save'>
                            <IconButton onClick={handleClickSave}>
                                <SaveIcon color='success'/>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
                
                <Divider sx={{width: '100%', my: 2, lineHeight: 0}}>
                    Current Information
                </Divider>

                <Grid item container direction='column' alignItems='flex-start' key='information'>
                    <Stack direction='row' spacing={1} alignItems='center' sx={{marginBottom: 1, width: '100%'}}>
                            <PointersTypography variant='body2'><DnsIcon sx={{fontSize:'small'}} />Name:</PointersTypography>
                            <ValuesTypography variant='body2' >{user.username}</ValuesTypography>
                    </Stack>

                    <Stack direction='row' spacing={1} alignItems='center' sx={{marginBottom: 1, width: '100%'}}>
                            <PointersTypography variant='body2'><AlternateEmailIcon sx={{fontSize:'small'}}/>Email:</PointersTypography>
                            <ValuesTypography variant='body2' sx={{textTransform: 'none'}}>{user.email}</ValuesTypography>
                    </Stack>

                    <Stack direction='row' spacing={1} alignItems='center' sx={{marginBottom: 1,  width: '100%'}}>
                            <PointersTypography variant='body2'><TitleIcon sx={{fontSize:'small'}}/>Position:</PointersTypography>
                            <ValuesTypography variant='body2' >{user.restrictionlevel}</ValuesTypography>
                    </Stack>

                    <Stack direction='row' spacing={1} alignItems='center' sx={{marginBottom: 1,  width: '100%'}}>
                            <PointersTypography variant='body2'><EventAvailableIcon sx={{fontSize:'small'}}/>RegDate:</PointersTypography>
                            <ValuesTypography variant='body2' >{regData}</ValuesTypography>
                    </Stack>

                    <Stack direction='row' spacing={1} alignItems='center' sx={{marginBottom: 1,  width: '100%'}}>
                            <PointersTypography variant='body2'><LeaderboardIcon sx={{fontSize:'small'}}/>TeamLeader:</PointersTypography>
                            <ValuesTypography variant='body2' >{teamLeader?.username || 'none'}</ValuesTypography>
                    </Stack>

                    <Stack direction='row' spacing={1} alignItems='center' sx={{marginBottom: 1,  width: '100%'}}>
                            <PointersTypography variant='body2'><CreditCardIcon sx={{fontSize:'small'}}/>For Deduction:</PointersTypography>
                            <ValuesTypography variant='body2' >PHP{fordeduction || 0}</ValuesTypography>
                    </Stack>
                </Grid>
            </Grid>
            
            <Grid item direction='column' container xs={12} sm={12} md={7} key='details' alignItems='flex-start' sx={{mt: {xs: 0, sm: 0, md: 5}}}>
                    <Typography variant='h5' color='textSecondary'> Update Information</Typography>
                    <Box component='form' noValidate autoComplete='off' onSubmit={onSubmit} sx={{width:'100%', '& > :not(style)':{width:{xs:'100%',sm:'100%', md:'70%' }, margin:{xs:'8px 0%', sm: '8px 0%', md:'8px 10%'}}}}>
                        <TextField inputProps={{style:{textTransform:'capitalize'}}} InputLabelProps={{shrink: true}} name='username' variant='standard' onChange={updateInfo} label='Full Name' placeholder={user.username} />
                        <TextField InputLabelProps={{shrink: true}} name='gmail' variant='standard' onChange={updateInfo} label='Email' placeholder={user.email} />
                        <TextField InputLabelProps={{shrink: true}} name='currentpassword' variant='standard' onChange={updateInfo} label='Current Password' type='password' placeholder='password'/>
                        <TextField InputLabelProps={{shrink: true}} name='newpassword' variant='standard' onChange={updateInfo} label='New Password' type='password' placeholder='New Password' />
                        <TextField InputLabelProps={{shrink: true}} name='confirmnewpassword' variant='standard' onChange={updateInfo} label='Confirm New Password' type='password' placeholder='Confirm New Password' />
                        <Button variant='contained' startIcon={<SaveIcon sx={{width:theme =>  theme.spacing(2), height:theme => theme.spacing(2)}} />} type='submit' fullWidth sx={{margin:'0 10%', padding: 0, borderRadius: 0}} >
                            Save
                        </Button>
                    </Box>
            </Grid>

        </Grid>
    )
}

export default MyProfile;