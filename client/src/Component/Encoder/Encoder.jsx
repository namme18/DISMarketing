import React,{ useState, useEffect } from 'react';
import InputIcon from '@material-ui/icons/Input';
import TodayIcon from '@material-ui/icons/Today';
import { Grow, Grid, Chip, Divider, Stack, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { useLocation, useHistory } from 'react-router-dom';
import { AppBar, Badge, Tab, Typography } from '@material-ui/core';
import InboxIcon from '@mui/icons-material/Inbox';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

function useQuery(){
    return new URLSearchParams(useLocation().search)
}

const StyledChip = styled(Chip)(({theme}) => ({
    border: '1px solid #f50057',
    borderRadius: '0',
    color: '#f50057',
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]:{
        marginBottom: theme.spacing(2),
        width: '100%'
      }
}));

const StyledTabPanel = styled(TabPanel)(({theme}) => ({
    padding: '1px',
    border: '1px solid lightgray',
    minHeight: '60vh',
}))

const Encoder = ({children}) => {

    const query = useQuery();
    const history = useHistory();
    const location = useLocation();
    console.log(location.pathname)

    const [value, setValue] = useState(query.get('value') || '1');
    const dateFrom = query.get('dateFrom');
    const dateTo = query.get('dateTo');

    const handleChange = (event, newValue) => {
        console.log(newValue);
        setValue(newValue)
    }

    const handleClickBack = () => {
        history.push(`/home/encoder/forspplist?value=${value}&dateFrom=${dateFrom}&dateTo=${dateTo}`);
    }

    useEffect(() => {
        history.push(`/home/encoder/forspplist?value=${value}&dateFrom=${dateFrom}&dateTo=${dateTo}`);
    },[value]);

    return(
        <Grow in>
            <div>
                <Grid container justifyContent='flex-start' alignItems='flex-end'> 
                    <StyledChip 
                        label='Encoder'
                        variant='outlined'
                        icon={<InputIcon style={{color: '#f50057'}} />}
                        clickable
                    />

                    <StyledChip 
                        label={`Today is ${format(new Date(), 'do MMMM Y')}`}
                        variant='outlined'
                        icon={<TodayIcon style={{color: '#f50057'}} />}
                        clickable
                    />
                </Grid>
                <Divider sx={{margin: theme => theme.spacing(2, 0)}} />

                <TabContext value={value}>
                    <AppBar position='static' size='small' style={{borderRadius: '5px 5px 0 0'}}>
                        <TabList 
                            value={value} 
                            onChange={handleChange} 
                            aria-label="simple tabs example"
                            variant='scrollable'
                            scrollButtons='on'
                        >
                            <Tab label={<Typography style={{fontWeight: 'bold'}}><Badge badgeContent={6} color='secondary'>FOR ENCODING</Badge></Typography>} value='1' />
                            <Tab label='tab2' value='2' />
                            <Tab label='tab3' value='3' />
                            <Tab label='tab4' value='4' />
                            <Tab label='tab4' value='5' />
                        </TabList>
                    </AppBar>   
                        <StyledTabPanel value='1'>
                            <Stack sx={{padding: '5px 10px'}}>
                                    {location.pathname === '/home/encoder/forspplist' && (
                                        <Grid container sx={{height: '50px', padding:'0px 5px', color:'rgba(0,0,0,0.7)'}} justifyContent='flex-start' alignItems='center'>
                                            <InboxIcon sx={{marginRight: '5px'}} />
                                            <Typography>Inbox</Typography>
                                        </Grid>
                                    )}
                                     {location.pathname === '/home/encoder/details' && (
                                        <Grid container onClick={handleClickBack} sx={{height: '50px', padding:'0px 5px', color:'rgba(0,0,0,0.7)', cursor: 'pointer'}} justifyContent='flex-start' alignItems='center'>
                                            <ArrowBackIosNewIcon sx={{marginRight: '5px'}} />
                                            <Typography>Back</Typography>
                                        </Grid>
                                    )}
                                {children}
                            </Stack>
                        </StyledTabPanel>
                        <StyledTabPanel value='2'>
                            content 2
                        </StyledTabPanel>
                        <StyledTabPanel value='3'>
                            content 3
                        </StyledTabPanel>
                        <StyledTabPanel value='4'>
                            content 4
                        </StyledTabPanel>
                        <StyledTabPanel value='5'>
                            content 5
                        </StyledTabPanel>

                </TabContext>
            </div>
        </Grow>
    )
}

export default Encoder;