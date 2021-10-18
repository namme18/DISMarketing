import React, { useState } from 'react';
import dislogo from '../../images/dislogo-transparent.png';
import MenuIcon from '@material-ui/icons/Menu';
import useStyles from './style';
import { styled } from '@mui/material/styles';
import {
    AppBar,
    Toolbar,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Typography
} from '@mui/material';
import { Divider } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/reducers/authReducer';
import { useHistory } from 'react-router-dom';
import { InsertLocation } from '../../redux/reducers/authActions/InsertLocation';

const StyledDivider = styled(Divider)(({theme}) => ({
    height: theme.spacing(2),
    margin: theme.spacing(0, 1),
    width: '2px',
    color: theme.palette.getContrastText(theme.palette.primary.dark),
}));

const Appbar = ({handleDrawerToggle, onClickDislogo, user, data}) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const handleMenu = e => {
        setAnchorEl(e.currentTarget);
    }

    const handleClose = () =>{
        setAnchorEl(null)
    }

    const handleLogout = () => {
        const dataLoc = {
            ...data,
            timeout: new Date()
        }
        dispatch(InsertLocation(dataLoc));
        handleClose();
        dispatch(logoutUser());
        history.push('/');
    }

    const handleClickProfile = () => {
        handleClose();
        history.push('/home/myprofile');
    }

    return(
        <AppBar position='fixed' className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        edge='start'
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <div onClick={onClickDislogo} className={classes.dislogo}>
                    <img alt='DISMarketing' src={dislogo} style={{height:'inherit'}} />
                    </div>

                    <Typography variant='caption' sx={{display: {xs: 'none', sm:'none', md: 'block'}}}>{`${user?.restrictionlevel?.split(' ').map(name => name[0].toUpperCase()+name.substring(1)).join(' ')}`}</Typography>
                    <StyledDivider orientation='vertical' sx={{display: {xs: 'none', sm:'none', md: 'block'}}}/>
                    <Typography onClick={handleClickProfile} style={{cursor: 'pointer'}}>{user?.username?.split(' ').map(name => name[0].toUpperCase()+name.substring(1)).join(' ')}</Typography>
                    <IconButton
                        aria-label={user?.username}
                        aria-controls='menu-appbar'
                        aria-haspopup='true'
                        color='primary'
                        onClick={handleMenu}
                    >
                        <Avatar src={user?.profilePicture}>
                            {user?.username?.[0].toUpperCase()}
                        </Avatar>
                    </IconButton>

                    <Menu
                        id='menu-appbar'
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical:'top',
                            horizontal: 'right'
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem key='Profile' onClick={handleClickProfile}>Profile</MenuItem>
                        <MenuItem key='My account' onClick={handleClose}>My account</MenuItem>
                        <MenuItem key='logout' onClick={handleLogout}>Logout</MenuItem>
                    </Menu>

                </Toolbar>
            </AppBar>
    )
}


export default Appbar;