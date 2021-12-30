import { 
    TableCell, 
    TableRow, 
    Typography, 
    Badge, 
    IconButton, 
    Grid, 
    TextField,
    Select,
    MenuItem,
    Avatar,
    Collapse
} from '@material-ui/core';
import React, { useState, useEffect, useReducer } from 'react';
import HomeIcon from '@material-ui/icons/Home';
import { makeStyles } from '@material-ui/core';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import MailIcon from '@material-ui/icons/Mail';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import AirplanemodeInactiveIcon from '@material-ui/icons/AirplanemodeInactive';
import EventIcon from '@material-ui/icons/Event';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { format } from 'date-fns';
import { useDispatch } from 'react-redux';
import { getErrors } from '../../redux/reducers/errorReducer';
import { updateSingleSubs } from '../../redux/reducers/subsActions/updateSingleSubs';
import AttachmentsModal from './AttachmentsModal';
import { styled } from '@mui/material/styles';
import { Stack, Box, TextareaAutosize } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import { complianceOfAgent } from '../../redux/reducers/subsActions/complianceOfAgent';

const useStyles = makeStyles(theme => ({
    details: {
        height: theme.spacing(2),
        width: theme.spacing(2)
    },
    textField:{
        '& .MuiInputBase-input': {
            padding: 0,
            height: theme.spacing(2.5),
            fontSize: 'small'
        }
    },
    avatar:{
        width: theme.spacing(2),
        height: theme.spacing(2),
        backgroundColor: theme.palette.secondary.light,
        margin: theme.spacing(0, 1, 0, 0),
        fontSize: 'small'
    },
}))

const StyledTextarea = styled(TextareaAutosize)(({theme}) => ({
    resize:'none', 
    outline:'none', 
    width: '100%', 
    borderRadius: '5px', 
    border: 'none', 
    padding: '5px'
}));

const StyledSendIcon = styled(SendIcon)(({theme}) => ({
    fontSize: '20px', 
    cursor: 'pointer',
    ':hover':{
        transform: 'scale(1.1)',
        color: theme.palette.secondary.main
    }
}))

const StyledAvatar = styled(Avatar)(({theme}) => ({
    ':hover': {
        transform: 'scale(1.1)'
    },
    height: '20px', 
    width: '20px', 
    marginLeft: '5px', 
    cursor:'pointer'
}));

const StyledGrid = styled(Grid)(({theme}) => ({
    padding:'5px', 
    border:`1px solid ${theme.palette.info.light}`, 
    borderRadius: '5px',
    [theme.breakpoints.down('sm')]:{
        width:'100%'
    },
    [theme.breakpoints.up('md')]:{
        width:'40%'
    }
}));

const StyledStack = styled(Stack)(({theme}) => ({
    margin: '5px 5px', 
    backgroundColor: theme.palette.primary.main, 
    color: theme.palette.getContrastText(theme.palette.primary.main),
    borderRadius: '10px',
    padding: '10px',
}));

const reducer = (attachedFile, action) => {
    switch(action.type){
        case "ADDIMAGE":
            return [...attachedFile, action.payload]
        case "DELETEIMAGE":
            return []
        default:
            return attachedFile
    }
}

const UserSubsRow = ({sub, index}) => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [img, setImg] = useState('');
    const [showDetails, setShowDetails] = useState(false);
    const [editDetails, setEditDetails] = useState(false);
    const [attachedFile, setAttachedFile] = useReducer(reducer, []);
    
    const [msgData, setMsgData] = useState({
        files: [],
        msg: '',
        subID:  sub._id
    });

    
    const [data, setData] = useState({
        address: '',
        contactno: '',
        email: '',
        joborderno: sub.joborderno,
        accountno: sub.accountno,
        remarks: '',
        plan: '',
        installeddate:'',
    });

    useEffect(() => {
        if(data.remarks === 'installed'){
            setData(data => ({
                ...data,
                installeddate: new Date()
            }));
        }
    },[data.remarks]);

    const handleClickSend = () => {
        const data = {
            details: {
                msg: msgData.msg,
                subID: msgData.subID
            },
            files: msgData.files
        }

        dispatch(complianceOfAgent(data));
    }

    const types = ['image/jpeg', 'image/png', 'image/gif'];

    const hanldeUploadFile = e => {
        const files = Object.values(e.target.files);
        setMsgData({...msgData, files: e.target.files})
        const invalidFile = files?.map(file => types.includes(file.type) ? true : false).some(item => item === false);
        const fileArray = files?.map(file => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = e => {
                const data = {
                    base64: e.target.result,
                    file
                }
                return setAttachedFile({type: "ADDIMAGE", payload: data})
            } 
        })

        if(invalidFile){
            const errData = {
                msg: 'Invalid File Type',
                status: 400,
                id: 'ERROR'
            }
            return dispatch(getErrors(errData));
        }
    }

    const handleClickUploadFile = () => {
        setAttachedFile({type: "DELETEIMAGE"});
        setMsgData({...msgData, files: []});
    }

    const handleOpenModal = (img) => {
        setOpen(true);
        setImg(img);
    }

    const handleClick = () => {
        setShowDetails(!showDetails);
        setEditDetails(false);
    }

    const handleEdit = () => {
        setShowDetails(true);
        setEditDetails(true);
    }

    const handleCancel = () => {
        setShowDetails(false);
        setEditDetails(false);
    }

    const handleSave = id => {

        const { address, contactno, email, joborderno, accountno, remarks, plan } = data;

        if(!address && !contactno && !email && (!joborderno || joborderno === sub.joborderno) && (!accountno || accountno === sub.accountno) && !remarks && !plan){
            const errData = {
                msg: 'No changes made',
                status: 400,
                id: 'UPDATE_FAIL'
            }
            return dispatch(getErrors(errData));
        }

        if(data.remarks === 'installed'){
            if(data.joborderno === '' || data.accountno === ''){
                const errData = {
                    msg:'Please Provide J.O and Account#',
                    status:400,
                    id: 'UPDATE_FAIL'
                }
               return dispatch(getErrors(errData));
            }
        }
        const updatedSubs = ({
            ...data,
            id,
        });
        dispatch(updateSingleSubs(updatedSubs));
            setEditDetails(false);
            clearFields();
    }

    const clearFields = () => {
        setData({
            address: '',
            contactno: '',
            email: '',
            joborderno: '',
            accountno: '',
            remarks: '',
            plan: '',
            installeddate:'',
        });
    }

    const onChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
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

    return(
        <TableRow key={sub._id}>
            <TableCell>
                <Grid container direction='row' justify='space-between' display='inline' >
                <Typography onClick={handleClick} style={{cursor: 'pointer', fontWeight:'bold'}} variant='subtitle2'>
                    {showDetails ? <KeyboardArrowUpIcon color='secondary' className={classes.details} /> : <KeyboardArrowDownIcon color='secondary' className={classes.details} /> } 
                    <Badge badgeContent={sub.isActive ? 'A' : sub.remarks?.split(' ').map(i => i[0].toUpperCase())} color={sub.isActive ? 'primary' : 'secondary'}>
                    <Avatar className={classes.avatar}>{index+1}</Avatar>{` ${sub.fullname.map(name => name.toLowerCase()).map(name => name[0].toUpperCase()+name.substring(1)).join(' ')}`}
                    </Badge>
                </Typography>
                    {!sub.isActive || sub.remarks !== 'for compliance' || sub.remarks !== 'spp done' && (
                        !editDetails ? (
                                <>
                                <IconButton size='small' onClick={handleEdit}>
                                    <EditIcon color='primary' className={classes.details} />
                                </IconButton>
                                </>
                            ) : (
                                <>
                                <Grid item>
                                <IconButton size='small' onClick={handleCancel}>
                                    <CancelIcon color='secondary' className={classes.details} />
                                </IconButton>
                                <IconButton size='small' onClick={() => handleSave(sub._id)}>
                                    <SaveIcon color='primary' className={classes.details} />
                                </IconButton>
                                </Grid>
                                </>
                                )
                    )}
                </Grid>
                <Collapse in={showDetails} timeout='auto' unmountOnExit>
                    <form noValidate autoComplete='off'>
                    <Typography color='textSecondary' variant='body2' >
                        <HomeIcon color='secondary' className={classes.details} /> 
                        &nbsp;
                        <strong>Addr:</strong> {editDetails ? (
                            <TextField 
                                type='text'
                                size='small'
                                name='address'
                                placeholder={sub.address?.split(' ')?.map(name => name[0]?.toUpperCase()+name.substring(1)).join(' ')}
                                onChange={onChange}
                                className={classes.textField}
                            />
                        ) : (
                            sub.address.split(' ')?.map(name => name[0]?.toUpperCase()+name.substring(1)).join(' ')
                        )}
                    </Typography>
                    <Typography color='textSecondary' variant='body2' >
                        <ContactPhoneIcon color='secondary' className={classes.details} />
                        &nbsp;
                        <strong>Ctc:</strong> {editDetails ? (
                            <TextField 
                                type='text'
                                size='small'
                                name='contactno'
                                placeholder={sub.contactno}
                                onChange={onChange}
                                className={classes.textField}
                            />
                        ) : (
                            sub.contactno
                        )}
                        </Typography>
                    <Typography color='textSecondary' variant='body2' >
                        <MailIcon color='secondary' className={classes.details} /> 
                        &nbsp;
                        <strong>Mail:</strong> {editDetails ? (
                            <TextField 
                                type='text'
                                size='small'
                                name='email'
                                placeholder={sub.email}
                                onChange={onChange}
                                className={classes.textField}
                            />
                        ) : (
                            sub.email
                        )}
                        </Typography>
                    <Typography color='textSecondary' variant='body2' ><FormatListNumberedIcon color='secondary' className={classes.details} /> <strong>App#:</strong> {sub.applicationno}</Typography>
                    <Typography color='textSecondary' variant='body2' >
                        <FormatListNumberedIcon color='secondary' className={classes.details} /> 
                        &nbsp;
                        <strong>Jo#:</strong> {editDetails ? (
                            <TextField 
                                type='text'
                                size='small'
                                name='joborderno'
                                placeholder={sub.joborderno}
                                onChange={onChange}
                                className={classes.textField}
                           />
                        ) : (
                            sub.joborderno
                         )}
                        </Typography>
                    <Typography color='textSecondary' variant='body2' >
                        <FormatListNumberedIcon color='secondary' className={classes.details} /> 
                        <strong>Acct#:</strong> {editDetails ? (
                            <TextField 
                                type='text'
                                size='small'
                                name='accountno'
                                placeholder={sub.accountno}
                                onChange={onChange}
                                className={classes.textField}
                            />
                        ) : (
                            sub.accountno
                        )}
                        </Typography>
                    <Typography color='textSecondary' variant='body2' >
                        <EventIcon color='secondary' className={classes.details} />
                        &nbsp;
                        <strong>Remarks:</strong> {editDetails ? (
                            <Select
                                name='remarks'
                                inputProps={{'aria-label': 'Without label'}}
                                displayEmpty
                                className={classes.textField}
                                style={{width:130}}
                                onChange={onChange}
                            >
                                <MenuItem disabled><Typography color='textSecondary' variant='body2'>Choose remarks</Typography></MenuItem>
                                <MenuItem value='installed'><Typography color='textSecondary' variant='body2'>installed</Typography></MenuItem>
                                <MenuItem value='standby'><Typography color='textSecondary' variant='body2'>StandBy</Typography></MenuItem>
                                <MenuItem value='for installation'><Typography color='textSecondary' variant='body2'>For Installation</Typography></MenuItem>
                                <MenuItem value='cancel'><Typography color='textSecondary' variant='body2'>Cancel</Typography></MenuItem>
                            </Select>
                        ): (
                            sub.remarks?.split(' ').map(n => n[0].toUpperCase()+n.substring(1)).join(' ')
                        )}</Typography>
                    <Typography color='textSecondary' variant='body2' ><EventIcon color='secondary' className={classes.details} /> <strong>Date encoded:</strong> {format(new Date(sub.encodeddate), 'do MMMM y')}</Typography>
                    <Typography color='textSecondary' variant='body2' >
                        <AirplanemodeInactiveIcon color='secondary' className={classes.details} /> 
                        &nbsp;
                        <strong>Plan:</strong> {editDetails ? (
                            <Select
                                name='plan'
                                inputProps={{'aria-label': 'Without label'}}
                                displayEmpty
                                className={classes.textField}
                                style={{width: 130}}
                                onChange={onChange}
                            >
                                <MenuItem disabled><Typography color='textSecondary' variant='body2'>{sub.packagename}</Typography></MenuItem>
                                {plans.map(item => (
                                    <MenuItem value={[item.plan,item.name].join()}><Typography color='textSecondary' variant='body2'>{item.name}</Typography></MenuItem>
                                ))}
                            </Select>
                        ) : (
                            sub.packagename
                        )}
                        </Typography>
                    </form>
                    <AttachmentsModal open={open} setOpen={setOpen} img={img}/>
                    {sub.remarks === 'for compliance' && (
                        <Grid container justify='flex-start' direction='column' style={{padding:'5px'}}>
                            <Grid item container direction='row' style={{padding: '2px'}}>
                                <Typography variant='subtitle2'>Attachments: </Typography>
                                {sub?.attachments?.map(data => (
                                    <StyledAvatar key={data.id} onClick={() => handleOpenModal(data.img)} key={data.id} src={data.img} alt='file' >file</StyledAvatar>
                                ))}
                            </Grid>
                            
                            <StyledGrid item container direction='column' justifyContent='flex-start'>
                                    <Typography variant='caption' color='textSecondary' style={{fontWeight:'600'}}>Remarks Trail:</Typography>
                                    
                                    {sub?.sppstatus?.remarks?.map((data) => (
                                        <Grid key={data.dispatch} item container direction={data.position === 'admin' ? 'row-reverse': 'row'}>
                                            <Typography variant='caption' color='primary' style={{fontWeight:'600'}}>{data.position === 'agent'? 'Agent: ' : ' :Admin'}</Typography>
                                            <StyledStack direction='column'>
                                                <Typography>{data.msg}</Typography>
                                                <Stack direction='row'>
                                                   {data?.attachments?.map((attached, index) => (
                                                       <Box key={index} style={{marginLeft:'5px'}}>
                                                           <a href={attached} download ><Avatar src={attached} style={{width:'20px', height: '20px'}}>file</Avatar></a>
                                                       </Box>
                                                   ))}
                                                </Stack>
                                            </StyledStack>
                                        </Grid>
                                    ))}

                                    <Stack direction='row'>
                                        {attachedFile.map((file, index) => (
                                            <Box key={index} style={{width: '20px', height: '25px', padding: '2px'}}>
                                                <img src={file.base64} alt='file' style={{height: '100%', width: '100%', objectFit: 'cover'}} />
                                            </Box>
                                        ))}
                                    </Stack>

                                    <Grid item container direction='row' alignItems='center' style={{backgroundColor: 'skyblue', padding: '5px', borderRadius: '5px'}}>
                                        <Stack alignItems='center' justifyContent='center' sx={{width: '10%'}}>
                                           <input type='file' multiple name='attachmentFile' id='attachmentFile' onClick={handleClickUploadFile} onChange={hanldeUploadFile} style={{display: 'none'}} />
                                            <label htmlFor='attachmentFile'>
                                                <AttachFileIcon color='secondary' style={{fontSize: '20px', cursor: 'pointer'}} />
                                            </label>
                                        </Stack>

                                        <Stack direction='column' justifyContent='center' alignItems='center' sx={{width: '70%', }}>
                                            <StyledTextarea onChange={(e) => setMsgData({...msgData, msg: e.target.value})} placeholder='Aa' name='msg' rows='1' />
                                        </Stack>

                                        <Stack justifyContent='center' alignItems='center' sx={{width: '20%'}}>
                                            <StyledSendIcon color='primary' onClick={handleClickSend} />
                                        </Stack>
                                    </Grid>
                            </StyledGrid>
                        </Grid>
                    )}
                </Collapse>
                </TableCell>
        </TableRow>
    )
}

export default UserSubsRow;