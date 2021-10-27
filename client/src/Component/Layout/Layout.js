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
import { getUserTrans } from '../../redux/reducers/transActions/getUserTrans';
import { getGrandTrans } from '../../redux/reducers/transActions/getGrandTrans';
import { getUserSubs } from '../../redux/reducers/subsActions/getuserSubs';
import { getAllSubs } from '../../redux/reducers/subsActions/getAllSubs';
import { getUnclaimedSubs } from '../../redux/reducers/subsActions/getUnclaimedSubs';
import { format } from 'date-fns';
import { getAppsGen } from '../../redux/reducers/subsActions/getAppsGen';

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
    const dateFrom = query.get('dateFrom') || format(new Date(), 'yyyy-MM-01');
    const dateTo = query.get('dateTo') || format(new Date(), 'yyyy-MM-dd');
    const usersubs = useSelector(state => state.subsReducer.usersubs);
    const allusers = useSelector(state => state.authReducer.allUsers);
    const userTrans = useSelector(state => state.transReducer.userTrans);
    const grandTrans = useSelector(state => state.transReducer.grandTrans);
    const subscribers = useSelector(state => state.subsReducer.subscribers);
    const unclaimedSubs = useSelector(state => state.subsReducer.unclaimedSubs);
    const appsgen = useSelector(state => state.subsReducer.appsgen);

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
        if(!unclaimedSubs){
            dispatch(getUnclaimedSubs());
        }
        if(!subscribers){
            const data = {
                dateFrom,
                dateTo,
            }
            dispatch(getAllSubs(data));
        }
        if(!appsgen){
            dispatch(getAppsGen());
        }
        if(!usersubs){
            const userData = {
                dateFrom,
                dateTo,
                userId: user._id
            }
            dispatch(getUserSubs(userData));
        }
        if(!userTrans && !grandTrans){
            dispatch(getUserTrans());
            dispatch(getGrandTrans());
        }
        if(!allusers ){
            dispatch(getAllUsers());
        }
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
            <Appbar dateFrom={dateFrom} dateTo={dateTo} handleDrawerToggle={handleDrawerToggle} onClickDislogo={onClickDislogo} user={user}  data={dataLoc} />
            <ResponsiveNav dateFrom={dateFrom} dateTo={dateTo} handleDrawerToggle={handleDrawerToggle} onClickDislogo={onClickDislogo} mobileOpen={mobileOpen} />

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