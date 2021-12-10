import React from 'react'
import { Grid, Avatar, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

const StyledGrid = styled(Grid)(({theme}) => ({
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: '10px',
    cursor: 'pointer',
    color: 'rgba(0,0,0,0.7)',
    marginBottom:'5px',
    borderTop: '1px solid rgba(0,0,0,0.2)',
    '&:hover':{
        boxShadow: '2px 2px 2px 1px rgba(0, 0, 0, 0.5)'
    }
}))

const StyledTyp = styled(Typography)(({theme}) => ({
    display: 'inline',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('sm')]:{
        width:'50%'
    }
}))

function useQuery(){
    return new URLSearchParams(useLocation().search);
}

const List = ({sub}) => {

    const history = useHistory();
    const query = useQuery();
    const dateFrom = query.get('dateFrom');
    const dateTo = query.get('dateTo');
    const value = query.get('value');

    const allusers = useSelector(state => state.authReducer.allUsers);
    const agent = allusers?.filter(user => user._id === sub.agent)[0];

    const handleListClick = () => {
        history.push(`/home/encoder/details?value=${value}&dateFrom=${dateFrom}&dateTo=${dateTo}&subID=${sub._id}&agentID=${sub.agent}`);
    }

    return (
        <StyledGrid container onClick={handleListClick}>
            <Grid item container flexDirection='row' justifyContent='start' alignItems='flex-start' xs={8} sm={6} md={4}>
                <Avatar sx={{backgroundColor: 'teal', mr: 1}} src={agent?.profilePicture}>{agent?.username[0]}</Avatar>
                <StyledTyp noWrap variant='subtitle1'>{agent?.username.split(' ').map(name => name[0].toUpperCase()+name.substring(1)).join(' ')}</StyledTyp>
            </Grid>

            <Grid item container flexDirection='column' sx={{display: {xs: 'none', md:'inline'}}} md={6} justifyContent='flex-start' alignItems='flex-start'>
                    <Typography variant='subtitle1'>{sub.fullname.map(name => name[0].toUpperCase()+name.substring(1)).join(' ')} - <span style={{fontSize:'12px'}}>{`${sub.plan} ${sub.packagename}`}</span></Typography>
                    <Stack flexDirection='row'>
                        {sub.attachments?.map(att => (
                            <Avatar key={att.id} src={att.img} alt='image'>File</Avatar>
                        ))}
                    </Stack>
            </Grid>

            <Grid item container flexDirection='row' justifyContent='flex-end' alignItems='center' xs={4} sm={6} md={2}>
                <Typography variant='caption'>{format(new Date(sub.encodeddate), 'do MMMM Y')}</Typography>
            </Grid>
        </StyledGrid>
    )
}

export default List
