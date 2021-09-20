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
    Typography
} from '@material-ui/core';
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
        search: ''
    });
    const userThatHasForDeductions = users?.filter(user => user.fordeductions.length > 0)?.filter(use => use.username.search(new RegExp(data.search, 'i')) !== -1);

    const handleClickAdd = () => {
        setOpenModal(true);
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
                <Grid container spacing={1} direction='row' justify='flex-start'>
                    <Paper component='form' className={classes.paper}>
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
                    <IconButton onClick={handleClickAdd}>
                        <AddCircleOutlineIcon color='secondary'/>
                    </IconButton>
                    <AddCashAdvanceModal openModal={openModal} setOpenModal={setOpenModal}/>
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