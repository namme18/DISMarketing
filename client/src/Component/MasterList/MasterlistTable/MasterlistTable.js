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
    Typography
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
        width: 'inherit'
    },
    tableHeaderCell: {
        fontWeight: 'bold',
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.getContrastText(theme.palette.primary.dark)
    }
}));

const MasterlistTable = ({show}) => {

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
        <TableContainer component={Paper} maxWidth='xl' className={classes.container}>
            <Table stickyHeader className={classes.table} aria-label='masterlist' size='small'>
                <TableHead>
                    <TableRow className={classes.tableHeaders}>
                        <TableCell align='left' className={classes.tableHeaderCell}>
                            NAME|ADd|CTC#|EMAIL
                        </TableCell>
                        <TableCell align='left' className={classes.tableHeaderCell}>
                            REMARKS
                        </TableCell>
                        <TableCell align='left' className={classes.tableHeaderCell}>
                            PACKAGE_INFO
                        </TableCell>
                        <TableCell align='left' className={classes.tableHeaderCell}>
                            STATUS
                        </TableCell>
                        <TableCell align='left' className={classes.tableHeaderCell}>
                            AGENT
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {subscribers.length < 1 ? (
                        <TableRow>
                        <TableCell colSpan={6}>
                            <Typography variant='h3' color='textSecondary' align='center'>No Records Found!</Typography>
                        </TableCell>
                        </TableRow>
                    ) : 
                        subscribers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(subs => (
                            <Row key={subs._id} subs={subs} allUsers={allUsers} subscribers={subscribers} show={show}/>
                        ))}
                        {emptyRows > 0 && (
                                <TableRow style={{height: 73 * emptyRows }}>
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