import React, { useState, useEffect } from 'react';
import {
    CssBaseline,
    Grid,
    Backdrop,
    CircularProgress
} from '@material-ui/core';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import VerifyEmail  from '../Auth/VerifyEmail';
import { validateUser } from '../../redux/reducers/authActions/validateUser';
import useStyles from './style';
import ResponsiveNav from './ResponsiveNav';
import Appbar from './Appbar';
import ErrorSnackbar from '../../helper/ErrorSnackbar';
import SuccessSnackbar from '../../helper/SuccessSnackbar';
import { getAllUsers } from '../../redux/reducers/authActions/getAllUsers';
import { InsertLocation } from '../../redux/reducers/authActions/InsertLocation';

function useQuery(){
    return new URLSearchParams(useLocation().search);
}

const Layout = ({children}) => {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const query = useQuery();
 
    const { user, isLoading } = useSelector(state => state.authReducer);
    const dateFrom = query.get('dateFrom');

    const [dataLoc, setDataLoc] = useState({
        lng: '',
        lat: '',
        timein: new Date(),
        timeout: 0,
    });

    const myLocation = (position) => {
        setDataLoc({
            ...dataLoc,
            lng: position.coords.longitude,
            lat: position.coords.latitude
        });
    }
    useEffect(() => {
        dispatch(InsertLocation(dataLoc));
    },[dataLoc.lng, dataLoc.lat]);

    useEffect(() => {
        if(!JSON.parse(localStorage.getItem('token'))){
            history.push('/auth');
        }
    }, [user]);

    useEffect(() => {
        if(isLoading) {
            return setOpen(true);
        }
        setOpen(false);
    },[isLoading]);

    useEffect(() => {
        if(!dateFrom){
            dispatch(validateUser());
        }

        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(myLocation);
        }

    },[location]);

    useEffect(() => {
        dispatch(getAllUsers());
    },[dispatch]);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [open, setOpen] = useState(false);

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
            <SuccessSnackbar />
            <Appbar handleDrawerToggle={handleDrawerToggle} onClickDislogo={onClickDislogo} user={user}  data={dataLoc} />
            <ResponsiveNav handleDrawerToggle={handleDrawerToggle} onClickDislogo={onClickDislogo} mobileOpen={mobileOpen} />

            <Grid className={classes.page}>
                <Grid item>
                    <Backdrop open={open} className={classes.backdrop}>
                        <CircularProgress color='inherit' />
                    </Backdrop>
                    <VerifyEmail />
                    <Grid className={classes.toolbar} />
                    {children}
                </Grid>
            </Grid>
        </div>
    )

}

export default Layout;