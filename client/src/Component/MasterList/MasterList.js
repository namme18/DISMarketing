import React, { useEffect, useState } from 'react';
import {
    Grow,
    Chip,
    Grid,
    Divider,
    Paper,
    TextField,
    InputBase,
    IconButton,
    Checkbox,
    Badge,
} from '@material-ui/core';
import { format } from 'date-fns';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TodayIcon from '@material-ui/icons/Today';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import ListIcon from '@material-ui/icons/List';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import { getAllSubs } from '../../redux/reducers/subsActions/getAllSubs';
import MasterlistTable from './MasterlistTable/MasterlistTable';
import { styled } from '@mui/material/styles';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import { CSVLink } from 'react-csv';

const StyledBadge = withStyles((theme) => ({
    badge: {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }))(Badge);

const StyledGrow = styled(Grow)(({theme}) => ({
    [theme.breakpoints.up('lg')]:{
        maxWidth: '78vw'
    }
}));

const useStyles = makeStyles(theme => ({
    divider:{
        margin: theme.spacing(2, 0)
    },
    chip:{
      marginRight: theme.spacing(2),
      borderRadius: '0',
      [theme.breakpoints.down('sm')]:{
        marginBottom: theme.spacing(2),
        width: '100%'
      }
    },
    table: {
        minWidth: 280,
    },
    container:{
        maxHeight: 380
    },
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%' ,
        margin: theme.spacing(1 ,0)
      },
    search:{
        minWidth: 80
    },
    input:{
        marginLeft: theme.spacing(1),
        flexGrow: 1
    },
    iconButton: {
        padding: 5
    },
    textField:{
        margin: theme.spacing(1),
        width: 200
    },
    dividerSearch: {
        height: 28,
        margin: 4,
    },
  }));

  function useQuery(){
      return new URLSearchParams(useLocation().search);
  }

const MasterList = () => {

    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const query = useQuery();
    const subscribers = useSelector(state => state.subsReducer.subscribers);
    const subscriberThatChangeDate = subscribers.map(sub => {
        const modSub = {
            ...sub,
            encodeddate: format(new Date(sub.encodeddate), 'MM-d-yyyy'),
            installeddate: format(new Date(sub.installeddate), 'MM-d-yyyy'),
        }
        return modSub;
    })

    const [data, setData] = useState({
        dateFrom: query.get('dateFrom') || format(new Date(), 'yyyy-MM-01'),
        dateTo: query.get('dateTo') || format(new Date(), 'yyyy-MM-dd'),
        search: query.get('search')
    });

    const [show, setShow] = useState(false);

    useEffect(() => {
        history.push(`/home/masterlist?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}&search=${data.search || ''}`);
    },[data]);

    useEffect(() => {
        dispatch(getAllSubs(data));
    },[data.dateTo, data.dateFrom]);

    useEffect(() => {
        if(!data.search){
            dispatch(getAllSubs(data));
        }
    },[data.search]);
      
    const onSubmit = e => {
        e.preventDefault();
        dispatch(getAllSubs(data));
    }

    const onChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const showInfo = () => {
        setShow(!show);
    }

    return(
        <StyledGrow in>
            <div>
            <Grid container alignItems='center' justify='flex-start' >
                <Chip
                    sm={12}
                    className={classes.chip}
                    label="Master List"
                    variant='outlined'
                    icon= {<ListIcon />}
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

                <CSVLink data={subscriberThatChangeDate} filename={`From:${data.dateFrom}To:${data.dateTo}.csv`} style={{textDecoration: 'none'}} className={classes.chip}>
                <Chip
                    className={classes.chip}
                    label='Download'
                    variant='outlined'
                    icon= {<ArrowCircleDownIcon />}
                    clickable
                    color='secondary'
                />
                </CSVLink>

                
            </Grid>
            <Divider className={classes.divider} />
                <form noValidate onSubmit={onSubmit}>
                    <Grid spacing={2} container direction='row' >
                        <Grid item md={3} lg={3} xl={3} sm={12} xs={12}>
                            <TextField
                                name='dateFrom'
                                id='date from'
                                type='date'
                                label='Date From'
                                defaultValue={data.dateFrom}
                                onChange={onChange}
                                className={classes.TextField}
                                fullWidth
                                inputProps={{
                                    shrink: 'true'
                                }}
                            />
                        </Grid>
                        
                        <Grid item md={3} lg={3} xl={3} sm={12} xs={12}>
                            <TextField
                                name='dateTo'
                                id='date To'
                                type='date'
                                label='Date To'
                                defaultValue={data.dateTo}
                                onChange={onChange}
                                className={classes.TextField}
                                fullWidth
                                inputProps={{
                                    shrink: 'true'
                                }}
                            />
                        </Grid>

                        <Grid item md={5} lg={5} xl={5} sm={10} xs={10}>
                            <Paper className={classes.root}>
                                <InputBase 
                                    className={classes.input}
                                    placeholder='Search any: (Name, Application#, Joborder# and more... )'
                                    value={data.search}
                                    name='search'
                                    onChange={onChange}
                                    inputProps={{ "aria-label": "search names" }}
                                />
                                <IconButton type='submit' className={classes.iconButton} aria-label='Search'>
                                    <SearchIcon />
                                </IconButton>
                                <Divider className={classes.dividerSearch} orientation="vertical" />
                                <IconButton color="primary" className={classes.iconButton} aria-label="directions">
                                    <DirectionsIcon />
                                </IconButton>
                            </Paper>
                        </Grid>

                        <Grid item container md={1} lg={1} xl={1} sm={2} xs={2} justify='flex-start' >
                            <StyledBadge badgeContent={!show ? 'ShowDetails' : 'HideDetails'} color='secondary'>
                            <Checkbox color='secondary' name='info' onChange={showInfo} />
                            </StyledBadge>
                        </Grid>
                    </Grid>
                </form>
                <MasterlistTable show={show} />
            </div>
        </StyledGrow>
    )
}

export default MasterList;