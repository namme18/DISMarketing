import { Select, Avatar, IconButton, MenuItem, TableCell, TableRow, TextField, Tooltip, Typography, Grid, Badge, Collapse } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { useDispatch } from 'react-redux';
import { processApprovedUser } from '../../redux/reducers/authActions/processApprovedUser';
import { getErrors } from '../../redux/reducers/errorReducer';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    avatar:{
        width: theme.spacing(2.5),
        height: theme.spacing(2.5),
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.getContrastText(theme.palette.secondary.light),
        fontSize: 'small',
        margin: theme.spacing(0, 1, 0, 0)
    },
    arrowIcon: {
        height: theme.spacing(2),
        width: theme.spacing(2)
    },
    actionIcon:{
        width: theme.spacing(2),
        height: theme.spacing(2),
    },
    resSelect:{
        '& .MuiSelect-select.MuiSelect-select': {
            padding: 0,
            width: '140px',
            height: '20px',
            fontSize: 'small'   
        }
    }
}));

const Row = ({user, users}) => {
    
    const classes = useStyles();
    const dispatch = useDispatch();
    const teamleaders = users?.filter(users => users.restrictionlevel === 'teamleader');

    const [data, setData] = useState({
        edit: false,
        teamleader: null,
        restrictionlevel: null,
        isApproved: false,
    });

    useEffect(() => {
        if(data.restrictionlevel || user.isApproved){
            setData({...data, isApproved: true})
        }
    },[data.restrictionlevel]);

    const onChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const handleEdit = id => {
        setData({edit: true});
    }

    const handleSave = (id, e) => {
        const { teamleader, restrictionlevel, isApproved } = data;
        if(!id || !isApproved || !restrictionlevel){
            const errData={
                msg:'Please complete required field!',
                status: 404,
                id:'CANT_APPROVED'
            }
            return dispatch(getErrors(errData))
        }

        if(restrictionlevel === 'agent' && !teamleader){
            const errData={
                msg:'Please asign a team leader',
                status: 404,
                id:'CANT_APPROVED'
            }
            return dispatch(getErrors(errData))
        }

        const newData = {
            id,
            teamleader,
            restrictionlevel,
            isApproved
        }
        dispatch(processApprovedUser(newData));
        setData({edit: false, isApproved: true});
    }

    const handleCancel = () => {
        setData({edit: false});
    }

    const handleClick = () => {
        setData({
            ...data,
            edit: !data.edit
        })
    }

    const menuItem =[
        {
            name: 'Agent',
            value:'agent'
        },
        {
            name: 'Team leader',
            value:'teamleader'
        },
        {
            name: 'Sub Agent',
            value:'subagent'
        },
        {
            name: 'Operation Manager',
            value:'operation manager'
        },
        {
            name: 'Owner',
            value:'owner'
        },
    ]

    return(
        <TableRow>
            <TableCell>
                <Grid container direction='row' justify='space-between' alignItems='center'>
                    <Typography variant='subtitle2' onClick={handleClick}  style={{cursor:'pointer', fontWeight:'bold'}}>
                        {!data.edit ? <KeyboardArrowDownIcon size='small' className={classes.arrowIcon} /> : <KeyboardArrowUpIcon className={classes.arrowIcon} size='small'/>}
                        <Badge badgeContent={user.restrictionlevel?.split(' ').map(n => n[0].toUpperCase())} color='secondary' ><Avatar className={classes.avatar}>{user.username[0].toUpperCase()}</Avatar>
                        {user.username}
                        </Badge>
                    </Typography>
                    {data.edit ? (
                        <div>
                        <IconButton aria-label='edit' onClick={() => handleSave(user._id)} size='small'>
                            <Tooltip title='save'>
                                <SaveIcon color='primary' className={classes.actionIcon} />
                            </Tooltip>
                        </IconButton>
                        <IconButton aria-label='cancel' onClick={handleCancel} size='small'>
                        <Tooltip title='Cancel'>
                            <CancelIcon className={classes.actionIcon} />
                        </Tooltip>
                        </IconButton>
                        </div>
                        ): (
                        <IconButton aria-label='edit' onClick={() => handleEdit(user._id)} size='small'>
                            <Tooltip title='Edit'>
                            <EditIcon color='secondary' className={classes.actionIcon} />
                            </Tooltip>
                        </IconButton>
                        )}
                </Grid>
                <Collapse in={data.edit} timeout='auto' unmountOnExit>
                    <Grid container  direction='row' justify='flex-start' alignItems='center'>
                    <Typography style={{marginLeft:'5%'}} variant='body2' color='textSecondary'><strong>IsApproved?:</strong></Typography>
                    &nbsp;&nbsp;
                    {!data.isApproved ? <ClearIcon color='secondary' className={classes.arrowIcon} /> : <CheckIcon style={{color: 'green'}} className={classes.arrowIcon} />}
                    </Grid>

                    <Grid container  direction='row' justify='flex-start' alignItems='center'>
                    <Typography style={{marginLeft:'5%'}} variant='body2' color='textSecondary'><strong>Team Leader:</strong></Typography>
                    &nbsp;&nbsp;
                    {data.restrictionlevel === 'agent' ? (
                        <Select name='teamleader' displayEmpty className={classes.resSelect} onChange={onChange}>
                            <MenuItem disabled><Typography variant='body2' color='textSecondary'>Choose TL...</Typography></MenuItem>
                            {teamleaders?.filter(tl => tl._id != user._id).map(leader => (
                                <MenuItem value={leader._id}><Typography variant='body2' color='textSecondary'>{leader.username}</Typography></MenuItem>
                            ))
                            }
                        </Select>
                    ): (
                        <Typography variant='body2' color='textSecondary'>{users?.filter(tl => tl._id === user.teamleader)[0]?.username || 'None'}</Typography>
                    )}
                    </Grid>

                    <Grid container  direction='row' justify='flex-start' alignItems='center'>
                        <Typography style={{marginLeft:'5%'}} variant='body2' color='textSecondary'><strong>Restriction Level:</strong></Typography>
                    &nbsp;&nbsp;
                        <div>
                        <Select name='restrictionlevel' displayEmpty className={classes.resSelect} onChange={onChange}>
                                <MenuItem disabled><Typography variant='body2' color='textSecondary'>{user.restrictionlevel}</Typography></MenuItem>
                            {menuItem.map(item => (
                                <MenuItem key={item.name} value={item.value}><Typography variant='body2' color='textSecondary'>{item.name}</Typography></MenuItem>
                            ))}
                        </Select>
                        </div>
                    </Grid>
                </Collapse>
            </TableCell>
        </TableRow>
    )
}

export default Row;