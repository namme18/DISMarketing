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
import React, { useState, useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { getErrors } from '../../redux/reducers/errorReducer';

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

const UnclaimedAccountRow = ({sub, index, allUsers, currentUser, openModal, setOpenModal, data, setData}) => {

    const classes = useStyles();
    const dispatch = useDispatch();

    const [showDetails, setShowDetails] = useState(false);
    const [editDetails, setEditDetails] = useState(false);

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

        const { applicationno, claimant } = data;

        if(!applicationno || !claimant){
            const errData = {
                msg: 'No changes made',
                status: 400,
                id: 'UPDATE_FAIL'
            }
            return dispatch(getErrors(errData));
        }

        const newData = {
            ...sub,
            applicationno2: data.applicationno,
            claimant: data.claimant
        }
        setOpenModal(true);
        setData({
            ...data,
            newData
        });
    }

    const onChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

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
                    {!editDetails ? (
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
                                )}
                </Grid>
                <Collapse in={showDetails} timeout='auto' unmountOnExit>
                    <form noValidate autoComplete='off'>
                    <Collapse in={editDetails} timeout='auto' unmountOnExit >
                        <Typography color='textSecondary' variant='body2' ><EventIcon color='secondary' className={classes.details} />&nbsp;<strong>Claimant:</strong> &nbsp;
                            <Select
                                name='claimant'
                                inputProps={{'aria-label': 'Without label'}}
                                displayEmpty
                                className={classes.textField}
                                style={{width:130}}
                                onChange={onChange}
                            >
                                <MenuItem key='disabled' disabled><Typography color='textSecondary' variant='body2'>Choose User...</Typography></MenuItem>
                                {allUsers?.filter(user => user._id !== currentUser._id)?.map(user2 => (
                                    <MenuItem key={user2._id} value={user2}>{user2.username.split(' ').map(name => name[0].toUpperCase()+name.substring(1)).join(' ')}</MenuItem>
                                ))}
                        </Select>
                            </Typography>
                    </Collapse>
                    <Typography color='textSecondary' variant='body2' ><FormatListNumberedIcon color='secondary' className={classes.details} /> <strong>App#:</strong> {editDetails ? (
                        <TextField 
                        type='text'
                        size='small'
                        name='applicationno'
                        placeholder={sub.applicationno}
                        onChange={onChange}
                        className={classes.textField}
                   />
                    ) : (sub.applicationno)}
                    </Typography>
                    <Typography color='textSecondary' variant='body2' ><HomeIcon color='secondary' className={classes.details} />&nbsp;<strong>Addr:</strong> {sub.address.split(' ').map(name => name[0].toUpperCase()+name.substring(1)).join(' ')}</Typography>
                    <Typography color='textSecondary' variant='body2' ><ContactPhoneIcon color='secondary' className={classes.details} />&nbsp;<strong>Ctc:</strong> {sub.contactno}</Typography>
                    <Typography color='textSecondary' variant='body2' ><MailIcon color='secondary' className={classes.details} /> &nbsp;<strong>Mail:</strong> {sub.email}</Typography>
                    <Typography color='textSecondary' variant='body2' ><FormatListNumberedIcon color='secondary' className={classes.details} /> &nbsp;<strong>Jo#:</strong> {sub.joborderno}</Typography>
                    <Typography color='textSecondary' variant='body2' ><FormatListNumberedIcon color='secondary' className={classes.details} /> <strong>Acct#:</strong> {sub.accountno}</Typography>
                    <Typography color='textSecondary' variant='body2' ><EventIcon color='secondary' className={classes.details} />&nbsp;<strong>Remarks:</strong> {sub.remarks?.split(' ').map(n => n[0].toUpperCase()+n.substring(1)).join(' ')}</Typography>
                    <Typography color='textSecondary' variant='body2' ><EventIcon color='secondary' className={classes.details} /> <strong>Date encoded:</strong> {format(new Date(sub.encodeddate), 'do MMMM y')}</Typography>
                    <Typography color='textSecondary' variant='body2' ><AirplanemodeInactiveIcon color='secondary' className={classes.details} /> &nbsp;<strong>Plan:</strong> {sub.packagename}</Typography>
                    </form>
                </Collapse>
                </TableCell>
        </TableRow>
    )
}

export default UnclaimedAccountRow;