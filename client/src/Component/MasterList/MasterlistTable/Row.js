import { 
    Badge, 
    TableCell, 
    TableRow, 
    Typography,
    Avatar,
    Grid,
    Hidden,
    Tooltip,
    Link
} from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core";
import { format } from 'date-fns';

const useStyles = makeStyles(theme => ({
    nameAvatar:{
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.getContrastText(theme.palette.primary.light)
    },
    tableRowCell:{
        padding: theme.spacing(1)
    },
    address:{
        width: '200px'
    },
    name:{
        fontWeight: 'bold',
        width: 'inherit',
        color: theme.palette.secondary.dark
    },
    activated:{
        fontWeight: 'bold',
        width: 'inherit',
        color: theme.palette.success.main
    }
}));

const Row = ({subs, allUsers, subscribers, show}) => {

    const classes = useStyles();

    const handleModify = e => {
        e.preventDefault();
        alert('Click');
    }
    return(
        <TableRow>
            <TableCell align='left' size='small' className={classes.tableRowCell}>
                <Grid container alignItems='center' spacing={1}>
                    <Hidden mdDown implementation='css'>
                    <Grid item lg={2}>
                        <Avatar alt={subs.fullname[0].toUpperCase()} src='.' size='small' className={classes.nameAvatar} />
                    </Grid>
                    </Hidden>
                    <Grid item lg={2}>
                        <Typography className={classes.name} display='inline' noWrap>{subs.fullname.map(name => name[0].toUpperCase()+name.substring(1)).join(' ')}</Typography>
                        <br/>
                        {show && (
                            <>
                            <Tooltip title={subs.address}>
                            <Typography display='block' noWrap color='textSecondary' variant='body2' className={classes.address}>{subs.address.split(' ').map(name => name[0].toUpperCase()+name.substring(1)).join(' ')}</Typography>
                            </Tooltip>
                            <Typography color='textSecondary' variant='body2'>{subs.contactno}</Typography>
                            <Typography color='textSecondary' variant='body2'>{subs.email}</Typography>
                            </>
                        )
                        }
                    </Grid>
                </Grid>
            </TableCell>
            <TableCell align='left' size='small'>
                <Typography className={classes.name} display='inline' noWrap>{subs.remarks?.split(' ').map(name => name[0].toUpperCase()+name.substring(1)).join(' ')}</Typography>
                <br/>
                {show && (
                    <>
                    <Typography color='textSecondary' variant='body2' display='inline' noWrap >App#: {subs.applicationno}</Typography>
                    <Typography color='textSecondary' variant='body2' >JO#: {!subs.joborderno ? 'none' : subs.joborderno}</Typography>
                    <Typography color='textSecondary' variant='body2' >Acct#: {!subs.accountno ? 'none' : subs.accountno}</Typography>
                    </>
                )}
            </TableCell>
            <TableCell align='left' size='small'>
                <Typography className={classes.name} noWrap display='inline'>{subs.packagename}</Typography>
                {show && (
                    <>
                    <Typography color='textSecondary' variant='body2' >PlanEncode: {subs.plan}</Typography>
                    <Typography color='textSecondary' variant='body2' >PlanInstalled: {!subs.planinstalled ? 'None' : subs.planinstalled}</Typography>
                    <Badge badgeContent={`${new Date(subs.encodeddate).getHours()}:${new Date(subs.encodeddate).getMinutes()}`} color='primary'>
                    <Typography color='textSecondary' variant='body2' noWrap display='inline'>DateEncode: {format(new Date(subs.encodeddate), 'do MMMM Y')}</Typography>
                    </Badge>
                    </>
                )}
            </TableCell>
            <TableCell align='left' size='small'>
                <Typography className={!subs.isActive ? classes.name : classes.activated}>{!subs.isActive ? 'Inactive' : 'Activated'}</Typography>
                {show && (
                    <>
                    <Typography  color='textSecondary' variant='body2' display='inline' noWrap>DateInstalled: {!subs.installeddate ? 'none' : subs.installeddate}</Typography>
                    <Typography  color='textSecondary' variant='body2'>PTA: {!subs.ispaidtoagent ? 'NO' : 'YES'}</Typography>
                    <Typography  color='textSecondary' variant='body2'>PFC: {!subs.ispaidfromconverge ? 'NO' : 'YES'}</Typography>
                    </>
                )}
            </TableCell>
            <TableCell align='left' size='small'>
                <Typography className={classes.name}>{allUsers?.map(user => user._id === subs.agent ? user.username.split(' ')[0][0].toUpperCase()+user.username.split(' ')[0].substring(1) : '')}</Typography>
                {show && (
                    <>
                    <Typography color='textSecondary' variant='body2' display='inline' noWrap>TeamLeader: {allUsers?.map(user => user._id === subs.teamleader ? user.username.split(' ')[0][0].toUpperCase()+user.username.split(' ')[0].substring(1) : '')}</Typography>
                    <br/>
                    <Typography color='textSecondary' variant='body2'>Entry: {subscribers?.filter(sub => sub.agent === subs.agent).length}</Typography>
                    <Link href='#' onClick={handleModify} variant='body2'>Edit</Link>
                    </>
                )}
            </TableCell>
        </TableRow>
    )
}

export default Row;