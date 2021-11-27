import React from 'react'
import { Grow, Grid, Avatar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

function useQuery(){
    return new URLSearchParams(useLocation().search);
}

const StyledContainer = styled(Grid)(({theme}) => ({
    padding: '10px'
}));

const Details = () => {

    const query= useQuery();
    const subID = query.get('subID');
    const agentID = query.get('agentID');
    const agent1 = useSelector(state => state.authReducer.allUsers);
    const agent = agent1?.filter(agent => agent._id === agentID)[0];

    return (
        <Grow in>
            <StyledContainer container>
                <Grid item container justifyContent='flex-start' alignItems='center'>
                    <Avatar sx={{mr: 1}} src={agent.profilePicture} alt={agent.username}></Avatar>
                    <Typography variant='subtitle1'>{agent.username.split(' ')?.map(name => name[0].toUpperCase()+name.substring(1)).join(' ')}</Typography>
                </Grid>
            </StyledContainer>
        </Grow>
    )
}

export default Details
