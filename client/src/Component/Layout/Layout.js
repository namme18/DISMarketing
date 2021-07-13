import React, { useState, useEffect } from 'react';
import {
    CssBaseline,
    Grid,
} from '@material-ui/core';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import VerifyEmail  from '../Auth/VerifyEmail';
import { validateUser } from '../../redux/reducers/authActions/validateUser';
import useStyles from './style';
import ResponsiveNav from './ResponsiveNav';
import Appbar from './Appbar';
import ErrorSnackbar from '../../helper/ErrorSnackbar';


const Layout = ({children}) => {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.authReducer);

    useEffect(() => {
        if(!JSON.parse(localStorage.getItem('token'))){
            history.push('/auth');
        }
    }, [user]);

    useEffect(() => {
        dispatch(validateUser());
    },[location]);

    const [mobileOpen, setMobileOpen] = useState(false);

    const onClickDislogo = () => {
        history.push('/home');
        setMobileOpen(false);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <ErrorSnackbar />
            <Appbar handleDrawerToggle={handleDrawerToggle} onClickDislogo={onClickDislogo} user={user}  />
            <ResponsiveNav handleDrawerToggle={handleDrawerToggle} onClickDislogo={onClickDislogo} mobileOpen={mobileOpen} />

            <Grid className={classes.page}>
                <Grid item>
                <VerifyEmail />
                <Grid className={classes.toolbar} />
                {children}
                </Grid>
            </Grid>
        </div>
    )

}

export default Layout;