import React from 'react';
import { Card, CardHeader, Typography, Avatar, CardContent, CardMedia } from '@mui/material';
import { CardAvatar } from './styles'
import { format } from 'date-fns';

const UserCard = ({map, user, mapContainer}) => {

    const timein = new Date(user.inoutinfo[user.inoutinfo.length-1].timein);
    const timeout = new Date(user.inoutinfo[user.inoutinfo.length-1].timeout);

    const handleClickCard = () => {
        mapContainer.current.scrollIntoView({behavior: 'smooth', block: 'center'});
        map.easeTo({
            center: [user.inoutinfo[user.inoutinfo.length-1].longitude, user.inoutinfo[user.inoutinfo.length-1].latitude],
            zoom: 16,
            duration: 2000
        });
    }

    return(
        <Card raised sx={{width:'100%',borderRadius: 0, marginBottom: '8px', cursor: 'pointer', ':hover':{boxShadow: 6 }}} onClick={handleClickCard}>
            <CardHeader
                image={user.profilePicture}
                sx={{backgroundImage:`url(${user.profilePicture})`, backgroundBlendMode: 'darken', backgroundColor: 'rgba(0,0,0,0.5)', paddingTop: '10%', backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat'}}
                title={<Typography variant='body1' display='inline-block' noWrap sx={{color: theme => theme.palette.getContrastText('rgba(0,0,0,0.5)'), textTransform: 'capitalize',width: '80%'}}>{user.username}</Typography>}
                subheader={<Typography variant='body2' sx={{color: theme => theme.palette.getContrastText('rgba(0,0,0,0.5)'), textTransform: 'capitalize', }}>{user.restrictionlevel}</Typography>}
            />
            {/* <CardMedia 
                sx={{paddingTop:'30%', backgroundBlendMode: 'darken', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
                image={user.profilePicture}
                avatar={<CardAvatar restrictionlevel={user.restrictionlevel} src={user.profilePicture}>{user.username[0].toUpperCase()}</CardAvatar>}
                title={<Typography display='inline-block' noWrap sx={{textTransform: 'capitalize', fontSize:'small',width: '80%'}}>{user.username}</Typography>}
                subheader={<Typography color='textSecondary' sx={{textTransform: 'capitalize', fontSize:'x-small'}}>{user.restrictionlevel}</Typography>}
            > */}
            <CardContent>
                <Typography variant='body2'>Date: { format(timein, 'MMM. do, Y') }</Typography>
                <Typography variant='body2'>Time in: { format(timein, 'hh mm a') }</Typography>
                <Typography variant='body2'>Time out: { format(timeout, 'hh mm a') }</Typography>
            </CardContent>
        </Card>
    )
}

export default UserCard;