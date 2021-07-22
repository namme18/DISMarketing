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
import { useSelector } from 'react-redux';

const ResponsiveDrawer = ({handleDrawerToggle, onClickDislogo, mobileOpen}) => {

    const classes = useStyles();
    const location = useLocation();
    const history = useHistory();
    const { restrictionlevel } = useSelector(state => state.authReducer?.user);

    const menuItem = [
        {   
            for: 'public',
            text: 'Home',
            icon:  <HomeIcon color='secondary'/>,
            path:  '/home/home'
        },
        {
            for: 'public',
            text: 'Master List',
            icon: <SubjectIcon color='secondary'/>,
            path: '/home/masterlist'
        },
        {
            for: 'private',
            text: 'Approve Agents',
            icon: <TouchAppIcon color='secondary' />,
            path: '/home/approveduser'
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
                       menuItem.filter(item => item.for !== 'private').map(item => (
                    <>
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
                    </>
                ))) : (
                    menuItem.map(item => (
                        <>
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
                        </>
                    )))}
                </List>
        </div>
    )
}

export default ResponsiveDrawer;