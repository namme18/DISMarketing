import React,{ useState, useEffect } from 'react';
import {
    Grid, 
    Typography, 
    Divider,
    Box,
    Avatar,
    Collapse
} from '@material-ui/core';
import PerAgent from './PerAgent';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const useStyles = makeStyles(theme => ({
    teamleader:{
        fontWeight: 'bold',
    [theme.breakpoints.down('sm')]:{
        fontSize: 'small'
    }
    },
    payout:{
        fontWeight: 'bold',
        [theme.breakpoints.down('sm')]:{
            fontSize: 'small'
        }
    },
    avatar:{
        height: theme.spacing(2.5),
        width: theme.spacing(2.5),
        fontSize: 'small',
        marginRight: theme.spacing(1),
        backgroundColor: theme.palette.warning.light
    },
    restrictionlevel:{
        [theme.breakpoints.down('sm')]:{
            display: 'none'
        }
    },
    container:{
        marginTop: theme.spacing(1),
        backgroundColor: theme.palette.info.light,
        paddingRight: theme.spacing(1)
    },
    arrow:{
        width: theme.spacing(2),
        height: theme.spacing(2)
    }
}));


const PerTeam = ({teamleader, allusers, forpayout, setData, data}) => {

    const classes = useStyles();
    const [showAgents, setShowAgents] = useState(true);
    const [teamPayout, setTeamPayout] = useState([]);
    const totalTeamPayout = teamPayout.map(pay => parseFloat(pay)).reduce((a, b) => a + b, 0).toFixed(2);
    const agents = allusers?.filter(user => user.teamleader === teamleader._id || user._id === teamleader._id);
    const payout = forpayout?.filter(sub => teamleader._id === sub.teamleader).map(sub => parseInt(sub.plan)).reduce((a, b) => a + b, 0).toFixed(2);

    // const [ team ] = allusers?.filter(user => user._id === teamleader);
    // const payout = forpayout?.filter(sub => teamleader === sub.teamleader).map(sub => parseInt(sub.plan)).reduce((a, b) => a + b, 0);

    const handleClickteam = () => {
        setShowAgents(!showAgents);
    }


    return(
        <div>
            {payout > 1 && (
                <>
                <Grid container direction='row' justify='space-between' alignItems='center' className={classes.container}>
                    <Box display='flex' direction='column' alignItems='center' justifyContent='flex-start' style={{cursor:'pointer'}} onClick={handleClickteam}>
                        {showAgents ? <KeyboardArrowUpIcon className={classes.arrow} /> : <KeyboardArrowDownIcon className={classes.arrow} />}
                        <Avatar className={classes.avatar}>{teamleader.username[0].toUpperCase()}</Avatar>
                        <Typography className={classes.teamleader} variant='subtitle1'>{teamleader?.username?.split(' ').map(name => name[0].toUpperCase()+name.substring(1)).join(' ')}</Typography>
                        <Typography className={classes.restrictionlevel} variant='caption' color='textSecondary'>&nbsp;- {teamleader.restrictionlevel?.split(' ').map(name => name[0].toUpperCase()+name.substring(1)).join(' ')}</Typography>
                    </Box>
                    <Typography className={classes.payout} variant='subtitle1'>{totalTeamPayout}</Typography>
                </Grid>
                <Collapse in={showAgents} timeout='auto' unmountOnExit>
                    {agents.map(agent => (
                        <PerAgent agent={agent} forpayout={forpayout} setTeamPayout={setTeamPayout} teamPayout={teamPayout} />
                    ))}
                </Collapse>
                 <Divider/>
                </>
            )}
        </div>
    )
}

export default PerTeam;