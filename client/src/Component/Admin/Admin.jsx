import React,{ useState } from 'react';
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

    const classes = useStyles();
    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return(
        <Grow in>
            <div>
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
            </TabContext>
            </div>
        </Grow>
    )
}

export default Admin;