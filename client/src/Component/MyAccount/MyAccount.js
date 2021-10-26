import { 
    Grow,
    Grid,
    Chip,
    Divider,
    IconButton,
    Tooltip,
    Badge,
    Typography,
    TextField,
    Tab,
    AppBar,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    Paper,
    TableCell,
    TableBody,
    TablePagination,
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
import InstalledSubsRow from './installedSubsRow';
import Payout from './Payout';
import dislogo from '../../images/converge-logo.png'
import { useHistory, useLocation } from 'react-router-dom';
import Transactions from './Transactions';

function useQuery(){
    return new URLSearchParams(useLocation().search);
}

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
    buttonLabel:{
        fontWeight: 'bold',
    },
    date: {
        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },
    tabAppbar:{
        borderRadius: '5px 5px 0 0',
        padding: 0,
    },
    tabPanel1:{
        padding: '1px'
    },
    tableheaderCell:{
        fontWeight: 'bold',
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.getContrastText(theme.palette.primary.dark)
    },
    container:{
        maxHeight: '50vh',
    },
    table:{
        width: 'inherit'
    },
    avatarCard:{
        background: theme.palette.warning.light,
    },
    card:{
       
    }
}));

const MyAccount = () => {

    const classes = useStyles();
    const history = useHistory();
    const query = useQuery();
    const userTrans = useSelector(state => state.transReducer.userTrans);
    const usersubs1 = useSelector(state => state.subsReducer.usersubs);
    const usersubs = usersubs1?.filter(sub => sub.applicationno.search('unclaimed') === -1)?.filter(subs => subs.applicationno.search('inclaimed') === -1);
    const userId = useSelector(state => state.authReducer.user._id);
    const user = useSelector(state => state.authReducer.user);
    const installedCount = usersubs && usersubs.filter(sub => sub.remarks === 'installed')?.length;
    const installedSubs = usersubs && usersubs.filter(sub => sub.remarks === 'installed');
    const activePayout = usersubs?.filter(sub => sub.isActive && !sub.ispaidtoagent);
    const payoutFrom = activePayout?.map(sub => format(new Date(sub.installeddate), 'do MMMM Y')).reduce((a, b) => a < b && a !== format(new Date('01-01-1992'), 'do MMMM Y') ? a : b, format(new Date('01-01-1992'), 'do MMMM Y'));
    const payoutTo = activePayout?.map(sub => format(new Date(sub.installeddate), 'do MMMM Y')).reduce((a, b) => a > b && a !== format(new Date('01-01-1992'), 'do MMMM Y') ? a : b, format(new Date('01-01-1992'), 'do MMMM Y'));
    const dispatch = useDispatch();

    //commision declaration and computation
    const commiPercentage = activePayout?.length <= 4 ? .40 : activePayout?.length >= 5 ? .50 : null;
    const VAT = .05;
    const SSS = 0;
    const PHIC = 0;
    const HDMF = 0;
    const CA = user.cashadvance || 0;
    const commiArray = activePayout?.map(sub => parseFloat(sub.plan*commiPercentage));
    const totalCommi = commiArray?.reduce((a, b) => a + b, 0);
    const deductions = parseFloat(totalCommi - ((totalCommi*VAT)+SSS+PHIC+HDMF+CA)).toFixed(2);
    
    const [openModal, setOpenModal] = useState(false);

    const [data, setData] = useState({
        dateFrom: format(new Date(), 'yyyy-MM-01'),
        dateTo: format(new Date(), 'yyyy-MM-dd'),
        isChange: false,
    });

    const [value, setValue] = useState(query.get('value') || '1');

    useEffect(() => {
        history.push(`/home/myaccount?value=${value}&dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`);
    },[value, data]);

    useEffect(() => {
        if(usersubs1 && data.isChange){
            const userData = {
                dateFrom: data.dateFrom,
                dateTo: data.dateTo,
                userId,
            }
            dispatch(getUserSubs(userData));
        }
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
            isChange: true,
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
    const emptyRows2 = rowsPerPage - Math.min(rowsPerPage, installedSubs?.length - page * rowsPerPage);

    return (
        <Grow in>
            <div>
                <Grid container alignItems='flex-end' justify='flex-start'>
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

                    <Grid key="dateFrom" item className={classes.chip}>
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

                    <Grid key='dateTo' item className={classes.chip}>
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
                            <Tab label={<Typography className={classes.buttonLabel}><Badge badgeContent={activePayout?.length || '0'} color='secondary'>FOR PAYOUT</Badge></Typography>} value='3' />
                            <Tab label={<Typography className={classes.buttonLabel}><Badge badgeContent={userTrans?.length} color='secondary'>PAIDSUBS</Badge></Typography>} value='4' />
                        </TabList>
                    </AppBar>
                        <TabPanel className={classes.tabPanel1} value='1'>
                            <>
                            <TableContainer component={Paper} className={classes.container}>
                                <Table stickyHeader aria-label='allsubs' className={classes.table} size='small'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.tableheaderCell}>
                                                <Grid container direction='row' justify='space-between'>
                                                    <Typography className={classes.name}>Name</Typography>
                                                    <IconButton size='small' onClick={handleOpen}>
                                                        <Tooltip title='Add Subscriber'>
                                                        <AddCircleOutlineIcon color='secondary' size='medium' />
                                                        </Tooltip>
                                                    </IconButton>
                                                </Grid>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {usersubs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                  .map((sub, index) => (
                                            <UserSubsRow key={index} sub={sub} index={index + rowsPerPage * page}/>
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
                                count={usersubs?.length || 0}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                            </>
                        </TabPanel>
                        <TabPanel className={classes.tabPanel1} value='2'>
                        <>
                            <TableContainer component={Paper} className={classes.container}>
                                <Table stickyHeader aria-label='allsubs' className={classes.table} size='small'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.tableheaderCell}>
                                                <Grid container direction='row' justify='space-between'>
                                                    <Typography className={classes.name}>Name</Typography>
                                                </Grid>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {installedSubs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                  .map((sub, index) => (
                                            <InstalledSubsRow key={index} sub={sub} index={index + rowsPerPage * page}/>
                                            ))}
                                        {emptyRows2 > 0 && (
                                                <TableRow style={{height: 33 * emptyRows2 }}>
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
                                count={installedSubs?.length || 0}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                            </>
                        </TabPanel>
                        <TabPanel className={classes.tabPanel1} value='3'>
                            <Payout dislogo={dislogo} payoutFrom={payoutFrom} payoutTo={payoutTo} deductions={deductions} classes={classes} SSS={SSS} PHIC={PHIC} CA={CA} totalCommi={totalCommi} VAT={VAT} user={user} HDMF={HDMF} commiPercentage={commiPercentage} activePayout={activePayout}  />
                        </TabPanel>
                        <TabPanel className={classes.tabPanel1} value='4'>
                            <Transactions />
                        </TabPanel>
                </TabContext>
                <AddSubsModal openModal={openModal} setOpenModal={setOpenModal} />
            </div>
        </Grow>
    )
}

export default MyAccount;