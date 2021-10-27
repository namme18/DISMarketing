import React,{ useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grow,
  Grid,
  Chip,
  Divider,
  Card,
  CardHeader,
  Avatar,
  TextField,
} from '@material-ui/core';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import { format } from 'date-fns';
import TodayIcon from '@material-ui/icons/Today';
import { useSelector, useDispatch } from 'react-redux';
import { getAllSubs } from '../../redux/reducers/subsActions/getAllSubs';
import { getAppsGen } from '../../redux/reducers/subsActions/getAppsGen';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import GetAppIcon from '@material-ui/icons/GetApp';
import Team from './Team';
import { useHistory } from 'react-router-dom';
import Loading from '../../helper/Loading';

const useStyles = makeStyles(theme => ({
    divider:{
        margin: theme.spacing(2, 0)
    },
    table:{
      minWidth: 280,
    },
    thead:{
      color: theme.palette.primary.main
    },
    chip:{
      marginRight: theme.spacing(2),
      borderRadius: '0',
      [theme.breakpoints.down('sm')]:{
        marginBottom: theme.spacing(2),
        width: '100%'
      }
    },
    ti:{
      background: theme.palette.warning.main
    },
    totalInstalled: {
      background: theme.palette.warning.main,
      top: '8px'
    },
    active:{
      background: theme.palette.info.main
    },
    activeAction: {
      background: theme.palette.info.main,
      top: '8px'
    },
    appsGen:{
      background: theme.palette.success.main
    },
    appsGenAction: {
      background: theme.palette.success.main,
      top: '8px'
    }
  }));

const Home = () => {
  
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const { allUsers } = useSelector(state => state.authReducer);
    const subscribers = useSelector(state => state.subsReducer.subscribers);
    const appsgen = useSelector(state => state.subsReducer.appsgen);
    const activeSubs = subscribers?.filter(sub => sub.isActive).length;
    const teams = allUsers?.filter(user => user.restrictionlevel !== 'agent');
    
    const [data, setData] = useState({
      dateFrom: format(new Date(), 'yyyy-MM-01'),
      dateTo: format(new Date(), 'yyyy-MM-dd'),
      isChange: false,
    });

    useEffect(() => {
      history.push(`/home/home?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`);
      if(appsgen && subscribers && data.isChange){
        dispatch(getAllSubs(data));
        dispatch(getAppsGen());
      }
    },[data]);

    const onChange = e =>{
      setData({
        ...data,
        isChange: true,
        [e.target.name]: e.target.value,
      });
    }

    if(!allUsers || !subscribers || !appsgen || !activeSubs){
      return(
      <Loading />    
      )
    }

  return (
    <Grow in>
        <div>
            <Grid container alignItems='flex-end' justify='flex-start' >
                <Chip
                    sm={12}
                    className={classes.chip}
                    label="Sale's Monitoring"
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

                <Grid item key='dateFrom' className={classes.chip}>
                        <TextField
                            name='dateFrom'
                            id='datefrom'
                            type='date'
                            label='Date From'
                            size='small'
                            defaultValue={data.dateFrom}
                                onChange={onChange}
                            className={classes.TextField}
                            fullWidth
                            inputProps={{
                                shrink: 'true'
                            }}
                        />
                    </Grid>

                    <Grid item key='dateTo' className={classes.chip}>
                        <TextField
                            name='dateTo'
                            id='date To'
                            type='date'
                            label='Date To'
                            size='small'
                            defaultValue={data.dateTo}
                            onChange={onChange}
                            className={classes.TextField}
                            fullWidth
                            inputProps={{
                                shrink: 'true'
                            }}
                        />
                    </Grid>
            </Grid>
            <Divider className={classes.divider} />

            <Grid container direction='row' justify='flex-start' spacing={2}>
              <Grid key='totalInstalled' item xs={12} lg={4} xl={4} md={4} sm={12}>
                <Card className={classes.card} elevation={5}>
                  <CardHeader 
                    className={classes.tiCard}
                    avatar={
                      <Avatar className={classes.ti}><AllInclusiveIcon /></Avatar>
                    }
                    action={
                      <Avatar className={classes.totalInstalled}>{subscribers?.length}</Avatar>
                    }
                    title='TOTAL INSTALLED'
                    subheader='All installed for current month'
                  />
                </Card>
              </Grid>

              <Grid key='totalActivation' item xs={12} lg={4} xl={4} md={4} sm={12}>
                <Card className={classes.card} elevation={5}>
                  <CardHeader 
                    className={classes.tiCard}
                    avatar={
                      <Avatar className={classes.active}><SpellcheckIcon /></Avatar>
                    }
                    action={
                      <Avatar className={classes.activeAction}>{activeSubs}</Avatar>
                    }
                    title='ACTIVE'
                    subheader='All activated for current month'
                  />
                </Card>
              </Grid>

              <Grid key='totalGenerated' item xs={12} lg={4} xl={4} md={4} sm={12}>
                <Card className={classes.card} elevation={5}>
                  <CardHeader 
                    className={classes.tiCard}
                    avatar={
                      <Avatar className={classes.appsGen}><GetAppIcon /></Avatar>
                    }
                    action={
                      <Avatar className={classes.appsGenAction}>{appsgen?.length}</Avatar>
                    }
                    title='APPS GENERATED'
                    subheader='Application generate for today'
                  />
                </Card>
              </Grid>
            </Grid>
            <Divider className={classes.divider} />

      <Grid container direction='row' spacing={2}>
            {teams?.map(team => (
              <Grid item key={team._id} xl={4} lg={4} md={3} sm={12} xs={12}>
                <Team team={team} subscribers={subscribers} appsgen={appsgen}/>
              </Grid>
            ))}
      </Grid>

        </div>
    </Grow>
  );
};

export default Home;
