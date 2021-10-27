import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { 
    Grid,
    Divider,
    IconButton,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    Paper,
    TableCell,
    TableBody,
    TablePagination,
    InputBase
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import UnclaimedAccountRow from './UnclaimedAccountRow';
import DnsIcon from '@material-ui/icons/Dns';
import SearchIcon from '@material-ui/icons/Search';
import Loading from '../../helper/Loading';

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
    },
    paper:{
        padding: '2px 2px',
        display: 'flex',
        alignItems: 'center',
        width: 250,
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
    }
}));

const UnclaimedAcct = ({openModal, setOpenModal, data, setData}) => {

    const classes = useStyles();
    const unclaimedSubsUnfiltered = useSelector(state => state.subsReducer?.unclaimedSubs);
    const allUsers = useSelector(state => state.authReducer.allUsers);
    const currentUser = useSelector(state => state.authReducer.user);
    
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');

    const unclaimedSubs = unclaimedSubsUnfiltered?.filter(sub => sub.fullname.join(' ').search(new RegExp(search, 'i')) !== -1);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    const onChange = e => {
        setSearch(e.target.value)
    }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, unclaimedSubs?.length - page * rowsPerPage);

    if(!unclaimedSubsUnfiltered || !allUsers || !currentUser){
        return(
            <Loading />
        )
    }

    return(
        <>
        <TableContainer component={Paper} className={classes.container}>
            <Table stickyHeader aria-label='allsubs' className={classes.table} size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableheaderCell}>
                            <Grid container direction='row' justify='flex-start' alignItems='center'>
                                <Grid item key='search'>
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
                                </Grid>
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