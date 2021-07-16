import React, { useEffect, useState } from 'react';
import {
    Grow,
    Chip,
    Grid,
    Divider,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    TablePagination,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputBase,
    IconButton,
    Tooltip
} from '@material-ui/core';
import { format } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import TodayIcon from '@material-ui/icons/Today';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getAllUsers } from '../../redux/reducers/authActions/getAllUsers';
import ListIcon from '@material-ui/icons/List';
import SearchIcon from '@material-ui/icons/Search';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AddSubsModal from './AddSubsModal';


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
    }
  }));

const MasterList = () => {

    const classes = useStyles();

    const [openModal, setOpenModal] = useState(false)
    const [search, setSearch] = useState({
        search: null
    });

    const handleOpen = () => {
        setOpenModal(true);
      };

      const handleCloseModal = () => {
        setOpenModal(false);
      };

      
    const onSubmit = e => {
        e.preventDefault();
    }

    const onChange = e => {
        alert(e.target.value);
    }

    return(
        <Grow in>
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
            </Grid>
            <Divider className={classes.divider} />
                <form noValidate onSubmit={onSubmit}>
                    <Grid spacing={2} container direction='row'>
                        <Grid item md={3} lg={3} xl={3} sm={12} xs={12}>
                            <TextField 
                                id='date from'
                                type='date'
                                label='Date From'
                                defaultValue={format(new Date, 'yyyy-MM-01')}
                                onChange={onChange}
                                className={classes.TextField}
                                fullWidth
                                inputProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>
                        
                        <Grid item md={3} lg={3} xl={3} sm={12} xs={12}>
                            <TextField 
                                id='Date To'
                                type='date'
                                label='Date To'
                                defaultValue={format(new Date, 'yyyy-MM-dd')}
                                onChange={onChange}
                                className={classes.TextField}
                                fullWidth
                                inputProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        <Grid item md={5} lg={5} xl={5} sm={10} xs={10}>
                            <Paper className={classes.root}>
                                <Select 
                                name='Search' 
                                className={classes.search}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                    <MenuItem disabled>Search</MenuItem>
                                    <MenuItem value='fullname'>Full Name</MenuItem>
                                    <MenuItem value='applicationno'>Application No.</MenuItem>
                                </Select>
                                <InputBase 
                                    className={classes.input}
                                    placeholder='Sample Search'
                                    inputProps={{ "aria-label": "search names" }}
                                />
                                <IconButton type='submit' className={classes.iconButton} aria-label='Search'>
                                    <SearchIcon />
                                </IconButton>
                            </Paper>
                        </Grid>

                        <Grid item container md={1} lg={1} xl={1} sm={2} xs={2} justify='flex-end' >
                            <IconButton size='medium' onClick={handleOpen}>
                                <Tooltip title='Add Subscriber'>
                                <AddCircleOutlineIcon color='secondary' fontSize='large' />
                                </Tooltip>
                            </IconButton>
                        </Grid>
                    </Grid>
                </form>
                <AddSubsModal openModal={openModal} handleCloseModal={handleCloseModal} />
            </div>
        </Grow>
    )
}

export default MasterList;