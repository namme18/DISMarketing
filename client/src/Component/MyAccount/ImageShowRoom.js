import React,{ useEffect } from 'react';
import { Stack } from '@mui/material';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { getUserTrans } from '../../redux/reducers/transActions/getUserTrans';
import { getGrandTrans } from '../../redux/reducers/transActions/getGrandTrans';
import { useLocation } from 'react-router-dom';

function useQuery(){
    return new URLSearchParams(useLocation().search);
}

const ImageShowRoom = () => {
    
    const { id } = useParams();
    const query = useQuery();
    const dispatch = useDispatch();

    const status = query.get('status');
    const userTrans = useSelector(state => state.transReducer.userTrans);
    const grandTrans = useSelector(state => state.transReducer.grandTrans);

    const user = userTrans.length > 0 ? userTrans.filter(trans => trans._id === id) : null;
    const grand = grandTrans.length > 0 ? grandTrans.filter(trans => trans._id === id): null;

    useEffect(() => {
        dispatch(getUserTrans());
        dispatch(getGrandTrans());
    },[]);

    if(userTrans.length < 1 && grandTrans.length < 1){
        return(
            <div>
                Loading....
            </div>
        )
    }

    return (
        <Stack sx={{m:3, p:2, boxShadow: 6}}>
            {status === 'agent' && userTrans.length > 0 && (
             <img alt={id} src={user[0].payout} />
            )}
            {status === 'admin' && grandTrans.length > 0 && (
             <img alt={id} src={grand[0].allPayout} />
            )}
        </Stack>
    )
}

export default ImageShowRoom;