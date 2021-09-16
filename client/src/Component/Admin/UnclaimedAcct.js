import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { 
    Grow,
    Grid,
    Chip,
    Divider,
    IconButton,
    Tooltip,
    Badge,
    Typography,
    TextField,
    Tab,
    AppBar,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    Paper,
    TableCell,
    TableBody,
    TablePagination,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import UnclaimedAccountRow from './UnclaimedAccountRow';

const useStyles = makeStyles(theme => ({
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
    date: {
        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },
    tabAppbar:{
        borderRadius: '5px 5px 0 0',
        padding: 0,
    },
    tabPanel1:{
        padding: '1px'
    },
    tableheaderCell:{
        fontWeight: 'bold',
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.getContrastText(theme.palette.primary.dark)
    },
    container:{
        maxHeight: '50vh',
    },
    table:{
        width: 'inherit'
    },
    avatarCard:{
        background: theme.palette.warning.light,
    },
    card:{
        maxHeight: '60vh',
        overflowY: 'scroll'
    }
}));

const UnclaimedAcct = ({openModal, setOpenModal, data, setData}) => {

    const classes = useStyles();
    const unclaimedSubs = useSelector(state => state.subsReducer?.unclaimedSubs);
    const allUsers = useSelector(state => state.authReducer.allUsers);
    const currentUser = useSelector(state => state.authReducer.user);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, unclaimedSubs?.length - page * rowsPerPage);

    return(
        <>
        <TableContainer component={Paper} className={classes.container}>
            <Table stickyHeader aria-label='allsubs' className={classes.table} size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableheaderCell}>
                            <Grid container direction='row' justify='space-between'>
                                <Typography className={classes.name}>Name</Typography>
                            </Grid>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {unclaimedSubs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((sub, index) => (
                        <UnclaimedAccountRow key={index} sub={sub} index={index} allUsers={allUsers} currentUser={currentUser} openModal={openModal} setOpenModal={setOpenModal} data={data} setData={setData}/> 
                        ))}
                    {emptyRows > 0 && (
                            <TableRow style={{height: 33 * emptyRows }}>
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
            count={unclaimedSubs?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
        />
    </>
    )
}

export default UnclaimedAcct;