import { 
    Avatar,
    Card, 
    CardContent, 
    CardHeader, 
    Grid, 
    IconButton,
    LinearProgress,
    Typography
} from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    avatar:{
        background: theme.palette.primary.light
    },
    action:{
        background: theme.palette.error.light
    }
}));

const Team = ({team, subscribers, appsgen}) => {

    const classes = useStyles();
    const history = useHistory();
    const target = 200;
    const appsGenTarget = 15;

    const handleShowAgents = (id) => {
        history.push(`/home/home/agents/${id}`);
    }

    return(
        <Card className={classes.card} elevation={5}>
            <CardHeader 
                avatar={<Avatar className={classes.avatar}>{team.username[0][0].toUpperCase()}</Avatar>}
                action={<IconButton size='small' className={classes.action} onClick={() => handleShowAgents(team._id)}><MoreVertIcon /></IconButton>}
                title={team.username.toUpperCase()}
                subheader='Team Leader'
            />
            <CardContent>
                {/* Total installed */}
               <Grid container direction='column'>
                   <Grid item container direction='row' justify='flex-start' spacing={1} alignItems='center'>
                       <Grid item>
                            <Typography>Total Installed :</Typography>
                       </Grid>
                       <Grid item>
                            <Typography variant='body2' color='textSecondary'>{`${subscribers?.filter(sub => sub.teamleader === team._id).length} Out Of ${target}`}</Typography>
                       </Grid>
                   </Grid>
                   <Grid container item spacing={1} direction='row' alignItems='center'>
                       <Grid item xs={11}>
                        <LinearProgress variant='determinate' value={(subscribers.length/200)*100} /> 
                       </Grid>
                       <Grid item xs={1}>
                        <Typography variant='body2' color='textSecondary'>{`${Math.round((subscribers?.filter(sub => sub.teamleader === team._id).length/target)*100)}%`}</Typography>
                       </Grid>
                   </Grid>
               </Grid>
               {/* activated */}
               <Grid container direction='column'>
                   <Grid item container direction='row' justify='flex-start' spacing={1} alignItems='center'>
                       <Grid item>
                            <Typography>Activated :</Typography>
                       </Grid>
                       <Grid item>
                            <Typography variant='body2' color='textSecondary'>{`${subscribers?.filter(sub => sub.isActive && sub.teamleader === team._id).length} Out Of ${subscribers?.filter(sub => sub.teamleader === team._id).length}`}</Typography>
                       </Grid>
                   </Grid>
                   <Grid container item spacing={1} direction='row' alignItems='center'>
                       <Grid item xs={11}>
                        <LinearProgress variant='determinate' value={Math.round((subscribers?.filter(sub => sub.isActive && sub.teamleader === team._id).length/subscribers.filter(sub => sub.teamleader === team._id).length)*100)|| 0} /> 
                       </Grid>
                       <Grid item xs={1}>
                        <Typography variant='body2' color='textSecondary'>{`${Math.round((subscribers?.filter(sub => sub.isActive && sub.teamleader === team._id).length/subscribers?.filter(sub => sub.teamleader === team._id).length)*100) || 0}%`}</Typography>
                       </Grid>
                   </Grid>
               </Grid>
               {/* appsgen */}
               <Grid container direction='column'>
                   <Grid item container direction='row' justify='flex-start' spacing={1} alignItems='center'>
                       <Grid item>
                            <Typography>Apps Generated :</Typography>
                       </Grid>
                       <Grid item>
                            <Typography variant='body2' color='textSecondary'>{`${appsgen?.filter(sub => sub.teamleader === team._id).length} Out Of ${appsGenTarget}`}</Typography>
                       </Grid>
                   </Grid>
                   <Grid container item spacing={1} direction='row' alignItems='center'>
                       <Grid item xs={11}>
                        <LinearProgress variant='determinate' value={Math.round((appsgen?.filter(sub => sub.teamleader === team._id).length/appsGenTarget)*100)} /> 
                       </Grid>
                       <Grid item xs={1}>
                        <Typography variant='body2' color='textSecondary'>{`${Math.round((appsgen?.filter(sub => sub.teamleader === team._id).length/appsGenTarget)*100)}%`}</Typography>
                       </Grid>
                   </Grid>
               </Grid>
            </CardContent>
        </Card>
    )
} 

export default Team;