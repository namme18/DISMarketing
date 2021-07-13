import React from 'react';
import {
    Container,
    Typography,
    Grow,
    Grid,
    Button
} from '@material-ui/core';
import useStyles from './style';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/reducers/authReducer';
import{ useHistory } from 'react-router-dom'

const MasterList = () => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const logout = () => {
        dispatch(logoutUser());
        history.push('/');
    }

    return(
        <Grow in>
            <Container maxWidth='xl'>
                <Grid container>
                    <Typography variant='h1'>
                        this is home
                    </Typography>
                    <Button variant='contained' color='primary' onClick={logout}>Logout</Button>
                </Grid>
            </Container>
        </Grow>
    )
}

export default MasterList;