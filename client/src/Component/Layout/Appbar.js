import React, { useState } from 'react';
import dislogo from '../../images/dislogo-transparent.png';
import MenuIcon from '@material-ui/icons/Menu';
import useStyles from './style';
import {
    AppBar,
    Toolbar,
    IconButton,
    Avatar,
    Menu,
    MenuItem
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/reducers/authReducer';

const Appbar = ({handleDrawerToggle, onClickDislogo, user}) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const classes = useStyles();
    const dispatch = useDispatch();

    const handleMenu = e => {
        setAnchorEl(e.currentTarget);
    }

    const handleClose = () =>{
        setAnchorEl(null)
    }

    const handleLogout = () => {
        handleClose();
        dispatch(logoutUser());
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

                    <IconButton
                        aria-label={user?.username}
                        aria-controls='menu-appbar'
                        aria-haspopup='true'
                        color='primary'
                        onClick={handleMenu}
                    >
                        <Avatar>
                            {user?.username?.[0].toUpperCase()}
                        </Avatar>
                    </IconButton>

                    <Menu
                        id='menu=appbar'
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
                        <MenuItem key='Profile' onClick={handleClose}>Profile</MenuItem>
                        <MenuItem key='My account' onClick={handleClose}>My account</MenuItem>
                        <MenuItem key='logout' onClick={handleLogout}>Logout</MenuItem>
                    </Menu>

                </Toolbar>
            </AppBar>
    )
}


export default Appbar;