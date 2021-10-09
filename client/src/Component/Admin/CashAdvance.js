import React,{ useState } from 'react';
import {
    Card, 
    CardContent, 
    Divider, 
    Grid,
    Icon,
    IconButton,
    InputBase,
    Paper,
    TextField,
    Typography,
    Button
} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import DnsIcon from '@material-ui/icons/Dns';
import SearchIcon from '@material-ui/icons/Search';
import AddCashAdvanceModal from './AddCashAdvanceModal';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { useSelector } from 'react-redux';
import CACard from './CACard';
import Mansonry from 'react-masonry-css';

const useStyles = makeStyles(theme => ({
    card:{
        minHeight: '63vh'
    },
    paper:{
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 250,
        marginBottom: theme.spacing(1)
    },
    verticalDivider:{
        height: '28px'
    },
    input:{
        flexGrow: 1,
        fontSize: 'small',
    },
    iconButton:{
        padding: '5px',
        '& .MuiSvgIcon-root': {
            fontSize: theme.spacing(2),
        }
    },
    cardContainer:{
        marginTop: theme.spacing(1)
    },
    mymasonrygrid:{
        display: '-webkit-box', /* Not needed if autoprefixing */
        display: '-ms-flexbox', /* Not needed if autoprefixing */
        display: 'flex',
        marginLeft: '0px', /* gutter size offset */
        width: 'auto',
        paddingTop: '5px'
      },
      mymasonrygridcolumn:{
        paddingLeft: '30px', /* gutter size */
        backgroundClip: 'padding-box'
      },
      /* Style your items */
      mymasonrygridcolumn:{ /* change div to reference your elements you put in <Masonry> */
        '& div':{
            margin: theme.spacing(.5),
        }
      }
}));

const CashAdvance = () => {

    const classes = useStyles();
    const users = useSelector(state => state.authReducer?.allUsers);
    const currentUser = useSelector(state => state.authReducer?.user);
    
    const [openModal, setOpenModal] = useState(false);
    const [data, setData] = useState({
        search: '',
        isAddPayments: false,
        isAddCA: false
    });

    const userThatHasForDeductions = users?.filter(user => user.fordeductions.length > 0)?.filter(use => use.username.search(new RegExp(data.search, 'i')) !== -1);

    const handleClickAddCA = () => {
        setOpenModal(true);
        setData({
            ...data,
            isAddCA: true,
            isAddPaymets: false,
        });
    }

    const handleClickAddpayments = () => {
        setOpenModal(true);
        setData({
            ...data,
            isAddPayments: true,
            isAddCA: false
        });
    }

    const breakpointColumnsObj = {
        default: 3,
        1100: 3,
        700: 2,
        500: 1
      };

    const onChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    return(
        <Card elevation={6} className={classes.card}>
            <CardContent>
                <Grid container direction='row' justify='flex-start'>
                    <Paper component='form' className={classes.paper} sx={{width: {xs: '100%', sm: '100%', md:'25%'}, borderRadius: 0}}>
                        <IconButton className={classes.iconButton} aria-label='DNS'>
                            <DnsIcon />
                        </IconButton>
                        <InputBase
                            className={classes.input}
                            name='search'
                            placeholder='Search.....'
                            inputProps={{'aria-label': 'Search ...', style: {textTransform: 'capitalize'}}}
                            onChange={onChange}
                        />
                        <Divider orientation='vertical' className={classes.verticalDivider}/>
                        <IconButton className={classes.iconButton}>
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                
                    <Button variant='contained' onClick={handleClickAddCA} startIcon={<AddCircleOutlineIcon color='secondary'/>} sx={{
                        margin: {xs: '0 0 8px 0', sm: '0 0 8px 0', md: '0 8px'},
                        width: {xs: '100%', sm: '100%', md: 'auto'},
                        height: '100%',
                        borderRadius: 0,
                    }}>Add C.A</Button>

                    
                    <Button variant='contained' onClick={handleClickAddpayments} startIcon={<AddCircleOutlineIcon color='secondary'/>} sx={{
                        margin: {xs: '0 0 8px 0', sm: '0 0 8px 0', md: '0 8px'},
                        height: '100%',
                        width: {xs: '100%', sm: '100%', md: 'auto'},
                        borderRadius: 0,
                    }}>Add Payments</Button>

                    <AddCashAdvanceModal openModal={openModal} setOpenModal={setOpenModal} operation={data} setOperation={setData}/>
                </Grid>
                <Divider />
                    <Mansonry
                        breakpointCols={breakpointColumnsObj}
                        className={classes.mymasonrygrid}
                        columnClassName={classes.mymasonrygridcolumn}
                    >
                    {userThatHasForDeductions?.map(user => (
                        <div key={user._id}>
                            <CACard  user={user}/>
                        </div>
                    ))}
                    </Mansonry>
            </CardContent>
        </Card>
    )
}

export default CashAdvance;