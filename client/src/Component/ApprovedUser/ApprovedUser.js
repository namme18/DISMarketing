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
    TablePagination
} from '@material-ui/core';
import { format } from 'date-fns';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import { makeStyles } from '@material-ui/core/styles';
import TodayIcon from '@material-ui/icons/Today';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Row from './Row';
import { getAllUsers } from '../../redux/reducers/authActions/getAllUsers';

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
    }
  }));

const ApprovedUser = () => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.authReducer);
    const allUsers = useSelector(state => state.authReducer.allUsers);

    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

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
            <TableContainer component={Paper} className={classes.container}>
                <Table stickyHeader className={classes.table} aria-label='For Approval' size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell align='left'>
                                <strong>NAME</strong>
                            </TableCell>
                            <TableCell align='left'>
                                <strong>ISAPPROVED?</strong>
                            </TableCell>
                            <TableCell align='left'>
                                <strong>TEAMLEADER?</strong>
                            </TableCell>
                            <TableCell align='left'>
                                <strong>RESTRICTION LEVEL</strong>
                            </TableCell>
                            <TableCell align='left'>
                                <strong>ACTION</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allUsers?.filter(currentUser => currentUser._id !== user._id)
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map(user => (
                            <Row key={user._id} user={user} allUsers={allUsers} />
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
                    rowsPerPageOptions={[5, 10, 15]}
                    component='div'
                    count={allUsers?.length -1}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </div>
        </Grow>
    )
}

export default ApprovedUser;