import React,{ useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grow,
  Grid,
  Chip,
  Divider,
  Card,
  CardHeader,
  Avatar,
  IconButton,
  TextField
} from '@material-ui/core';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import Row from './Row';
import { format } from 'date-fns';
import TodayIcon from '@material-ui/icons/Today';
import { useSelector, useDispatch } from 'react-redux';
import { getAllSubs } from '../../redux/reducers/subsActions/getAllSubs';
import { getAppsGen } from '../../redux/reducers/subsActions/getAppsGen';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import GetAppIcon from '@material-ui/icons/GetApp';

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
    const { allUsers } = useSelector(state => state.authReducer);
    const subscribers = useSelector(state => state.subsReducer.subscribers);
    const appsgen = useSelector(state => state.subsReducer.appsgen);
    const activeSubs = subscribers.filter(sub => sub.isActive).length;
    
    const [data, setData] = useState({
      dateFrom: format(new Date, 'yyyy-MM-01'),
      dateTo: format(new Date, 'yyyy-MM-dd'),
      search: ''
    });

    useEffect(() => {
      dispatch(getAllSubs(data));
      dispatch(getAppsGen());
    },[data]);

    const onChange = e =>{
      setData({
        ...data,
        [e.target.name]: e.target.value
      });
    }

  return (
    <Grow in>
        <div>
            <Grid container alignItems='center' justify='flex-start' >
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

                <Grid item className={classes.chip}>
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
                                shrink: true
                            }}
                        />
                    </Grid>

                    <Grid item className={classes.chip}>
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
                                shrink: true
                            }}
                        />
                    </Grid>
            </Grid>
            <Divider className={classes.divider} />

            <Grid container direction='row' justify='flex-start' spacing={2}>
              <Grid item lg={4} xl={4} md={4} sm={12}>
                <Card className={classes.card}>
                  <CardHeader 
                    className={classes.tiCard}
                    avatar={
                      <Avatar className={classes.ti}><AllInclusiveIcon /></Avatar>
                    }
                    action={
                      <Avatar className={classes.totalInstalled}>{subscribers.length}</Avatar>
                    }
                    title='TOTAL INSTALLED'
                    subheader='All installed for current month'
                  />
                </Card>
              </Grid>

              <Grid item lg={4} xl={4} md={4} sm={12}>
                <Card className={classes.card}>
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

              <Grid item lg={4} xl={4} md={4} sm={12}>
                <Card className={classes.card}>
                  <CardHeader 
                    className={classes.tiCard}
                    avatar={
                      <Avatar className={classes.appsGen}><GetAppIcon /></Avatar>
                    }
                    action={
                      <Avatar className={classes.appsGenAction}>{appsgen.length}</Avatar>
                    }
                    title='APPS GENERATED'
                    subheader='Application generate for today'
                  />
                </Card>
              </Grid>
            </Grid>
            <Divider className={classes.divider} />

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="collapsible table" size="small">
          <TableHead className={classes.thead}>
            <TableRow>
              <TableCell />
              <TableCell align='center'><strong>TEAMS</strong></TableCell>
              <TableCell align='center'><strong>INSTALLED</strong></TableCell>
              <TableCell align='center'><strong>APPSGEN</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allUsers
            ?.filter(user => user.restrictionlevel === 'teamleader')
            .map(tl => (
              <Row key={tl._id} tl={tl} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
        </div>
    </Grow>
  );
};

export default Home;
