import React, { useEffect } from 'react';
import {
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@material-ui/core';
import SubjectIcon from '@material-ui/icons/Subject';
import HomeIcon from '@material-ui/icons/Home';
import conlogo from '../../images/converge-logo.png';
import  useStyles  from './style';
import { useHistory, useLocation } from 'react-router-dom';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { useSelector } from 'react-redux';

const ResponsiveDrawer = ({handleDrawerToggle, onClickDislogo, mobileOpen}) => {

    const classes = useStyles();
    const location = useLocation();
    const history = useHistory();
    const restrictionlevel = useSelector(state => state.authReducer.user?.restrictionlevel);

    const menuItem = [
        {   
            for: 'public',
            text: 'Home',
            icon:  <AccountBoxIcon color='secondary'/>,
            path:  '/home/home'
        },
        {
            for: 'public',
            text: 'My Account',
            icon:  <HomeIcon color='secondary'/>,
            path:  '/home/myaccount'
        },
        {
            for: 'public',
            text: 'Master List',
            icon: <SubjectIcon color='secondary'/>,
            path: '/home/masterlist'
        },
        {
            for: 'private',
            text: 'Admin',
            icon: <TouchAppIcon color='secondary' />,
            path: '/home/admin'
        }
    ]

    return (
        <div>
                <div className={classes.toolbar} onClick={onClickDislogo}>
                    <img className={classes.conLogo} src={conlogo} alt='DISMarketing' />
                </div>
                <Divider />
                <List>
                   {restrictionlevel !== ('operation manager' || 'owner') ? (
                       menuItem.filter(item => item.for !== 'private').map((item, index) => (
                    <div key={index}>
                    {console.log(item.text)}
                    <ListItem
                    button
                    key={item.text}
                    onClick={() => {
                        history.push(item.path)
                        if(mobileOpen){
                            handleDrawerToggle();
                        }    
                    }}
                    className={location.pathname === item.path ? classes.active : null}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText
                            primary={item.text}
                        />
                    </ListItem>
                    <Divider />
                    </div>
                ))) : (
                    menuItem.map((item, index) => (
                        <div key={index}>
                        <ListItem
                        button
                        key={item.text}
                        onClick={() => {
                            history.push(item.path)
                            if(mobileOpen){
                                handleDrawerToggle();
                            }    
                        }}
                        className={location.pathname === item.path ? classes.active : null}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText
                                primary={item.text}
                            />
                        </ListItem>
                        <Divider />
                        </div>
                    )))}
                </List>
        </div>
    )
}

export default ResponsiveDrawer;