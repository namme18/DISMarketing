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
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import Row from './Row';

const useStyles = makeStyles((theme) => ({
    container:{
        maxHeight: 330,
    },
    table:{
        minWidth: 280,
    }
}));

const MasterlistTable = () => {

    const classes = useStyles();
    const { subscribers } = useSelector(state => state.subsReducer);
    const { allUsers } = useSelector(state => state.authReducer);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

const emptyRows = rowsPerPage - Math.min(rowsPerPage, subscribers?.length - page * rowsPerPage);

    return(
        <>
        <TableContainer component={Paper} className={classes.container}>
            <Table stickyHeader className={classes.table} aria-label='masterlist' size='small'>
                <TableHead>
                    <TableRow className={classes.tableHeaders}>
                        <TableCell align='left' key='APPLICATION'>
                            <strong>APPLICATION#</strong>
                        </TableCell>
                        <TableCell align='left' key='NAME'>
                            <strong>NAME</strong>
                        </TableCell>
                        <TableCell align='left' key='ADDRESS'>
                            <strong>ADDRESS</strong>
                        </TableCell>
                        <TableCell align='left' key='CONTACT'>
                            <strong>CONTACT#</strong>
                        </TableCell>
                        <TableCell align='left' key='AGENT'>
                            <strong>AGENT</strong>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {subscribers.map(subs => (
                        <Row key={subs._id} subs={subs} allUsers={allUsers}/>
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
            count={subscribers?.length -1}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        </>
    )
}

export default MasterlistTable;