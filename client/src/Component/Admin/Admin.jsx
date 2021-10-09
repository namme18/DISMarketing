import React,{ useState, useEffect } from 'react';
import {
    TabContext,
    TabList,
    TabPanel
 } from '@material-ui/lab';
import {
    Tab,
    Typography,
    AppBar,
    Grow,
    Chip,
    Grid,
    Divider,
 } from '@material-ui/core';
import { format } from 'date-fns';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import TodayIcon from '@material-ui/icons/Today';
import ApprovedUser from './ApprovedUser';
import { makeStyles } from '@material-ui/core/styles';
import Payroll from './Payroll/Payroll';
import Activation   from './Activation';
import CashAdvance from './CashAdvance';
import UnclaimedAcct from './UnclaimedAcct';
import { useDispatch } from 'react-redux';
import { getUnclaimedSubs } from '../../redux/reducers/subsActions/getUnclaimedSubs';
import UnclaimedModal from './UnclaimedModal';
import EmpTracker from './Map/EmpTracker'
import { useLocation, useHistory } from 'react-router-dom';

function useQuery(){
    return new URLSearchParams(useLocation().search);
}

const useStyles = makeStyles(theme => ({
    tabAppbar:{
        borderRadius: '5px 5px 0 0',
        padding: 0,
    },
    tabPanel1:{
        padding: '1px'
    },
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
}));

const Admin = () => {

    const history = useHistory();
    const query = useQuery();
    const dispatch = useDispatch();
    const classes = useStyles();

    const [value, setValue] = useState(query.get('value') || '1');

    const [data, setData] = useState({
        newData: null,
        applicationno: '',
        claimant: '',
    });

    const [openModal, setOpenModal] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        dispatch(getUnclaimedSubs());
    },[]);

    useEffect(() => {
        history.push(`/home/admin?value=${value}`);
    },[value]);

    return(
        <Grow in>
            <div>
            <UnclaimedModal openModal={openModal} setOpenModal={setOpenModal} newData={data.newData} />
            <Grid container alignItems='center' justify='flex-start' >
                <Chip
                    sm={12}
                    className={classes.chip}
                    label="For Approval of Agents"
                    variant='outlined'
                    icon= {<AccessibilityIcon />}
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
            <TabContext value={value}>
            <AppBar position="static" className={classes.tabAppbar} size='small'>
                <TabList 
                    value={value} 
                    onChange={handleChange} 
                    aria-label="simple tabs example"
                    variant='scrollable'
                    scrollButtons='on'
                >
                    <Tab value='1' label={<Typography className={classes.buttonLabel}>EMPLOYEE</Typography>} />
                    <Tab value='2' label={<Typography className={classes.buttonLabel}>PAYROLL</Typography>} />
                    <Tab value='3' label={<Typography className={classes.buttonLabel}>ACTIVATION</Typography>} />
                    <Tab value='4' label={<Typography className={classes.buttonLabel}>CA MONITORING</Typography>} />
                    <Tab value='5' label={<Typography className={classes.buttonLabel}>UNCLAIMED ACCT</Typography>} />
                    <Tab value='6' label={<Typography className={classes.buttonLabel}>EMP. MAP</Typography>} />
                </TabList>
            </AppBar>
                <TabPanel className={classes.tabPanel1} value='1'>
                    <ApprovedUser />
                </TabPanel>
                <TabPanel className={classes.tabPanel1} value='2'>
                    <Payroll />
                </TabPanel>
                <TabPanel className={classes.tabPanel1} value='3'>
                    <Activation />
                </TabPanel>
                <TabPanel className={classes.tabPanel1} value='4'>
                    <CashAdvance />
                </TabPanel>
                <TabPanel className={classes.tabPanel1} value='5'>
                    <UnclaimedAcct openModal={openModal} setOpenModal={setOpenModal} data={data} setData={setData}/>
                </TabPanel>
                <TabPanel className={classes.tabPanel1} value='6'>
                    <EmpTracker />
                </TabPanel>
            </TabContext>
            </div>
        </Grow>
    )
}

export default Admin;