import { 
    Grow,
    Grid,
    Chip,
    Divider,
    IconButton,
    Tooltip,
} from '@material-ui/core';
import React, { useState } from 'react';
import { format } from 'date-fns';
import TodayIcon from '@material-ui/icons/Today';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { makeStyles } from '@material-ui/core';
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
}));

const MyAccount = () => {

    const classes = useStyles();
    const [openModal, setOpenModal] = useState(false);

    const handleOpen = () => {
        setOpenModal(true);
    };

    return (
        <Grow in>
            <div>
                <Grid container alignItems='center' justify='flex-start' >
                    <Chip
                        sm={12}
                        className={classes.chip}
                        label="My Account"
                        variant='outlined'
                        icon= {<AccountBoxIcon />}
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
                <Grid container spacing={2} direction='row' justify='flex-start'>
                    <Grid item>
                        <IconButton size='medium' onClick={handleOpen}>
                            <Tooltip title='Add Subscriber'>
                            <AddCircleOutlineIcon color='secondary' fontSize='large' />
                            </Tooltip>
                        </IconButton>
                    </Grid>
                </Grid>

                <AddSubsModal openModal={openModal} setOpenModal={setOpenModal} />
            </div>
        </Grow>
    )
}

export default MyAccount;