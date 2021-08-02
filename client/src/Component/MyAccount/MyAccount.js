import { 
    Grow,
    Grid,
    Chip,
    Divider,
    IconButton,
    Tooltip,
    Badge,
    Typography,
    Button,
    TextField,
    Box,
    Tabs,
    Tab,
    AppBar,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    Paper,
    TableCell,
    TableBody,
    TablePagination
} from '@material-ui/core';
import {
    TabContext,
    TabList,
    TabPanel
 } from '@material-ui/lab';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import TodayIcon from '@material-ui/icons/Today';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { makeStyles } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AddSubsModal from './AddSubsModal';
import { useSelector, useDispatch } from 'react-redux';
import { getUserSubs } from '../../redux/reducers/subsActions/getuserSubs';
import UserSubsRow from './UserSubsRow';

const useStyles = makeStyles(theme => ({
    divider:{
        margin: theme.spacing(2, 0)
    },
    chip:{
      marginRight: theme.spacing(2),
      [theme.breakpoints.down('sm')]:{
        marginBottom: theme.spacing(2),
        width: '100%'
      }
    },
    buttonLabel:{
        fontWeight: 'bold',
    },
    date: {
        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },
    tabAppbar:{
        borderRadius: '30px',
        padding: 0,
    },
    tableheaderCell:{
        fontWeight: 'bold',
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.getContrastText(theme.palette.primary.dark)
    },
    container:{
        maxHeight: '45vh',
    },
    table:{
        width: 'inherit'
    }
}));

const MyAccount = () => {

    const classes = useStyles();
    const usersubs = useSelector(state => state.subsReducer?.usersubs);
    const userId = useSelector(state => state.authReducer.user._id);
    const installedCount = usersubs && usersubs.filter(sub => sub.remarks === 'installed')?.length;
    const dispatch = useDispatch();
    
    const [openModal, setOpenModal] = useState(false);

    const [data, setData] = useState({
        dateFrom: format(new Date, 'yyyy-MM-01'),
        dateTo: format(new Date, 'yyyy-MM-dd'),
    });

    const [value, setValue] = useState('1');

    useEffect(() => {
        const userData = {
            dateFrom: data.dateFrom,
            dateTo: data.dateTo,
            userId,
        }
        dispatch(getUserSubs(userData));
    },[data]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleOpen = () => {
        setOpenModal(true);
    };

    const onChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, usersubs?.length - page * rowsPerPage);

    return (
        <Grow in>
            <div>
                <Grid container alignItems='center' justify='flex-start'>
                    <Chip
                        sm={12}
                        className={classes.chip}
                        label="My Account"
                        variant='outlined'
                        icon= {<AccountBoxIcon />}
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

                <TabContext value={value}>
                    <AppBar position="static" className={classes.tabAppbar} size='small'>
                        <TabList 
                        value={value} 
                        onChange={handleChange} 
                        aria-label="simple tabs example"
                        variant='scrollable'
                        scrollButtons='on'
                        >
                            <Tab label={<Typography className={classes.buttonLabel}><Badge badgeContent={usersubs?.length} color='secondary'>AllSUBS</Badge></Typography>} value='1' />
                            <Tab label={<Typography className={classes.buttonLabel}><Badge badgeContent={installedCount ? installedCount : '0'} color='secondary'>INSTALLED</Badge></Typography>} value='2' />
                            <Tab label={<Typography className={classes.buttonLabel}><Badge badgeContent={5} color='secondary'>FOR PAYOUT</Badge></Typography>} value='3' />
                            <Tab label={<Typography className={classes.buttonLabel}><Badge badgeContent={5} color='secondary'>PAIDSUBS</Badge></Typography>} value='4' />
                        </TabList>
                    </AppBar>
                        <TabPanel value='1'>
                            <>
                            <TableContainer component={Paper} className={classes.container} maxWidth='xl'>
                                <Table stickyHeader aria-label='allsubs' classname={classes.table} size='small'>
                                    <TableHead fullWidth    >
                                        <TableRow>
                                            <TableCell className={classes.tableheaderCell}>
                                                <Grid container direction='row' justify='space-between'>
                                                    <Typography className={classes.name}>Name</Typography>
                                                    <IconButton size='small' onClick={handleOpen}>
                                                        <Tooltip title='Add Subscriber'>
                                                        <AddCircleOutlineIcon color='secondary' fontSize='medium' />
                                                        </Tooltip>
                                                    </IconButton>
                                                </Grid>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {usersubs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                  .map((sub, index) => (
                                            <UserSubsRow sub={sub} index={index + rowsPerPage * page}/>
                                            ))}
                                        {emptyRows > 0 && (
                                                <TableRow style={{height: 33 * emptyRows }}>
                                                    <TableCell colSpan={6} />
                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination 
                                rowsPerPageOptions={[10, 15, 20]}
                                component='div'
                                count={usersubs?.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                            </>
                        </TabPanel>
                        <TabPanel value='2'>item2</TabPanel>
                        <TabPanel value='3'>item3</TabPanel>
                        <TabPanel value='4'>item4</TabPanel>
                </TabContext>
                <AddSubsModal openModal={openModal} setOpenModal={setOpenModal} />
            </div>
        </Grow>
    )
}

export default MyAccount;