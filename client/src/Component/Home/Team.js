import { 
    Avatar,
    Card, 
    CardContent, 
    CardHeader, 
    Grid, 
    IconButton,
    LinearProgress,
    Typography
} from '@mui/material';
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

    const installedPercenatge = parseInt(Math.round((subscribers?.filter(sub => sub.teamleader === team._id).length/target)*100));
    const activatedPercentage = parseInt(Math.round((subscribers?.filter(sub => sub.isActive && sub.teamleader === team._id).length/subscribers?.filter(sub => sub.teamleader === team._id).length)*100) || 0);
    const appgeneratedPercentage = parseInt(Math.round((appsgen?.filter(sub => sub.teamleader === team._id).length/appsGenTarget)*100)) || 0;

    return(
        <Card className={classes.card} elevation={5}>
            <CardHeader
                sx={{
                    backgroundImage: `url(${team.profilePicture})`,
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    backgroundBlendMode: 'darken',
                }} 
                avatar={<Avatar className={classes.avatar} sx={{backgroundColor: 'rgba(255,255,255,0.2)'}}>{team.username[0][0].toUpperCase()}</Avatar>}
                action={<IconButton size='small' className={classes.action} onClick={() => handleShowAgents(team._id)} sx={{color:'floralwhite', backgroundColor: 'rgba(255,255,255,0.2)'}}><MoreVertIcon /></IconButton>}
                title={<Typography variant='subtitle2' sx={{color: 'floralwhite'}}>{team.username.toUpperCase()}</Typography>}
                subheader={<Typography variant='subtitle2' sx={{color: 'floralwhite'}}>{team.restrictionlevel?.split(' ').map(name => name[0].toUpperCase() + name.substring(1)).join(' ') || 'None'}</Typography>}
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
                        <LinearProgress variant='determinate' value={installedPercenatge} /> 
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
                        <LinearProgress variant='determinate' value={activatedPercentage} /> 
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
                            <Typography variant='body2' color='textSecondary'>{`${appsgen?.filter(sub => sub.teamleader === team._id).length || 0} Out Of ${appsGenTarget}`}</Typography>
                       </Grid>
                   </Grid>
                   <Grid container item spacing={1} direction='row' alignItems='center'>
                       <Grid item xs={11}>
                        <LinearProgress variant='determinate' value={appgeneratedPercentage} /> 
                       </Grid>
                       <Grid item xs={1}>
                        <Typography variant='body2' color='textSecondary'>{`${Math.round((appsgen?.filter(sub => sub.teamleader === team._id).length/appsGenTarget)*100) || 0}%`}</Typography>
                       </Grid>
                   </Grid>
               </Grid>
            </CardContent>
        </Card>
    )
} 

export default Team;