import React from 'react'
import { Grow, Grid, Avatar, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';

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
    const forspp = useSelector(state => state.subsReducer.forspp);
    const sub = forspp?.filter(sub => sub._id === subID)[0];
    const subArray = sub !== undefined ? Object.entries(sub):null;
    const item = subArray?.filter(objItem => objItem[0] !== 'attachments' && objItem[0] !== '_id' && objItem[0] !== '__v' && objItem[0] !== 'teamleader' && objItem[0] !== 'agent').map(obj => obj[0] === 'fullname' ? {name: obj[0], value: obj[1].join(' ')} : obj[0] === 'sppstatus' ? {name: obj[0], value: obj[1].status} : {name: obj[0], value: obj[1]});
    console.log(sub);
    return (
        <Grow in>
            <StyledContainer container>
                <Grid item container justifyContent='flex-start' alignItems='center'>
                    <Avatar sx={{mr: 1}} src={agent?.profilePicture} alt={agent?.username}></Avatar>
                    <Typography variant='subtitle1'>{agent?.username.split(' ')?.map(name => name[0].toUpperCase()+name.substring(1)).join(' ')}</Typography>
                </Grid>

                <Grid item container flexDirection='row' md={12} sx={{mt:1, ml:6}}>
                    <Grid item container flexDirection='row' justifyContent='flex-start' alignItems='center' sx={{marginBottom: '5px'}}>
                            <Typography variant='subtitle1' color='textSecondary'>Attachments: </Typography>
                        {sub?.attachments.map(obj => (
                            <Avatar src={obj.img} alt='file' sx={{height: '30px', width: '30px', ml: 1, cursor: 'pointer'}}>File</Avatar>
                        ))}
                            <IconButton sx={{color: theme => theme.palette.getContrastText(theme.palette.primary.light),bgcolor: theme => theme.palette.primary.light, height: '30px', width: '30px', ml: 1}}>
                                <DownloadIcon />
                            </IconButton>
                    </Grid>
                    {item?.map((item, index) => (
                        <Grid item container key={index} style={{padding: '1px'}} md={4} sm={6} xs={12}>
                            <Grid item container sx={{border: '1px solid lightgray', padding: '5px'}} justifyContent='flex-start' alignItems='center'>
                                <Typography variant='body2' color='textSecondary'>{item.name[0].toUpperCase()+item.name.substring(1)}:&nbsp;</Typography>
                                <Typography variant='body2' >{item.value}</Typography>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </StyledContainer>
        </Grow>
    )
}

export default Details
