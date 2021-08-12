import { Grid, Grow, Chip, Divider } from '@material-ui/core';
import React from 'react';
import { format } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import TodayIcon from '@material-ui/icons/Today';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import APRow from './APRow';

const useStyles = makeStyles(theme => ({
    chip:{
        marginRight: theme.spacing(2),
        [theme.breakpoints.down('sm')]:{
          marginBottom: theme.spacing(2),
          width: '100%'
        }
    },
    divider:{
        margin: theme.spacing(2, 0)
    },

}));

const AgentsPerformance = () => {

    const classes = useStyles();
    const { teamleader } = useParams();
    const { allUsers } = useSelector(state => state.authReducer);
    const agents = allUsers?.filter(user => teamleader === user._id || teamleader === user.teamleader);

    return(
        <Grow in>
            <div>
                <Grid container alignItems='center' justify='flex-start' >
                    <Chip
                        sm={12}
                        className={classes.chip}
                        label="Agents Performance"
                        variant='outlined'
                        icon= {<ImportantDevicesIcon />}
                        clickable
                        color='secondary'
                    />

                    <Chip
                        className={classes.chip}
                        label={`Today is ${format(new Date(), 'do MMMM Y')}`}
                        variant='outlined'
                        icon= {<TodayIcon />}
                        clickable
                        color='secondary'
                    />
                </Grid>
                <Divider className={classes.divider} />

                <Grid container spacing={2} direction='row'>
                    {agents?.map(agent => (
                        <>
                        <Grid item key={agent._id} xl={4} lg={4} md={3} sm={12} xs={12}>
                            <APRow agent={agent} />
                        </Grid>
                        </>
                    ))}
                </Grid>

            </div>
        </Grow>
    )
}


export default AgentsPerformance;