import React,{ useEffect } from 'react';
import { Stack, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { getUserTrans } from '../../redux/reducers/transActions/getUserTrans';
import { getGrandTrans } from '../../redux/reducers/transActions/getGrandTrans';
import { useLocation } from 'react-router-dom';
import Loading from '../../helper/Loading';

function useQuery(){
    return new URLSearchParams(useLocation().search);
}
const Image = styled('img')(({theme}) => ({
    height: '100%',
    width: '100%',
    objectFit: 'contain'
}));

const ImageShowRoom = () => {
    
    const { id } = useParams();
    const query = useQuery();
    const dispatch = useDispatch();

    const status = query.get('status');
    const userTrans = useSelector(state => state.transReducer.userTrans);
    const grandTrans = useSelector(state => state.transReducer.grandTrans);

    const user = userTrans ? userTrans.filter(trans => trans._id === id) : null;
    const grand = grandTrans ? grandTrans.filter(trans => trans._id === id): null;

    useEffect(() => {
        dispatch(getUserTrans());
        dispatch(getGrandTrans());
    },[]);

    if(!userTrans && !grandTrans){
        return(
            <Loading />
        )
    }

    return (
        <Grid container justifyContent='center' alignItems='center' sx={{height: '100vh'}}>
            <Stack sx={{boxShadow: 6, width: '80vw', height: '80vh'}}>
                {status === 'agent' && userTrans.length > 0 && (
                <img alt={id} src={user[0].payout} />
                )}
                {status === 'admin' && grandTrans && (
                <Image alt={id} src={grand[0].allPayout} />
                )}
            </Stack>
        </Grid>
    )
}

export default ImageShowRoom;