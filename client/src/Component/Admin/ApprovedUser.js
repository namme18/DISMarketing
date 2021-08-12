import React, { useEffect, useState } from 'react';
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    TablePagination,
    Box,
    Typography,
    IconButton,
    Divider,
    InputBase,
    Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Row from './Row';
import { getAllUsers } from '../../redux/reducers/authActions/getAllUsers';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';

const useStyles = makeStyles(theme => ({
    table: {
        minWidth: 280,
    },
    container:{
        maxHeight: '50vh'
    },
    buttonLabel:{
        fontWeight: 'bold',
    },
    tableheaderCell:{
        fontWeight: 'bold',
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.getContrastText(theme.palette.primary.dark)
    },
    dividerSearch: {
        height: 28,
        margin: 4,
    }, 
    search:{
        minWidth: 80
    },
    input:{
        marginLeft: '5px'
    },
    iconButton: {
        padding: 5
    },
    name:{
        [theme.breakpoints.down('sm')]:{
            display: 'none'
        }
    }
  }));

const ApprovedUser = () => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.authReducer);
    const users = useSelector(state => state.authReducer.allUsers);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const [data, setData] = useState({
        search:''
    });

    const allUsers = users?.filter(agent => agent.username.search(new RegExp(data.search, 'i')) !== -1 && agent._id !== user._id);

    const onChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value 
        });
    }

    useEffect(() => {
        if(user.restrictionlevel === ('operation manager' || 'owner')){
            dispatch(getAllUsers());
        }
    },[user.restrictionlevel]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, allUsers?.length - page * rowsPerPage);

    return(
        <>
            <TableContainer component={Paper} className={classes.container}>
                <Table stickyHeader className={classes.table} aria-label='For Approval' size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableheaderCell} align='left'>
                                <Box display='flex' justifyContent='space-between' alignItems='center' >
                                    <Typography className={classes.name}>Name</Typography>
                                    <Paper className={classes.root}>
                                        <Grid container direction='row'>
                                        <InputBase 
                                            className={classes.input}
                                            placeholder='Search any:'
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
                                        </Grid>
                                     </Paper>
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allUsers?.filter(currentUser => currentUser._id !== user._id)
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map(user => (
                            <Row key={user._id} user={user} users={users} />
                        ))}
                        {emptyRows > 0 && (
                            <TableRow style={{height: 73 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
                <TablePagination 
                    rowsPerPageOptions={[10, 15, 20]}
                    component='div'
                    count={allUsers?.length -1}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
        </>
    )
}

export default ApprovedUser;