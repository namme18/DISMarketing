import React,{ useState, useRef, useEffect } from 'react';
import { Grid, IconButton, InputBase, Divider, Stack, Typography  } from '@mui/material';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Markers from './Markers';
import bbox from "@turf/bbox";
import { multiPoint } from "@turf/helpers";
import {useDispatch, useSelector } from 'react-redux';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import { SearchPaper } from './styles';
import UserCard from './UserCard';

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const EmpTracker = () => {
    
    const [ map, setMap ] = useState(null);
    const [search, setSearch] = useState('');

    const mapContainer = useRef(null);
    const allUsers = useSelector(state => state.authReducer?.allUsers);
    const userWithLocation = allUsers?.filter(user => user.inoutinfo[user.inoutinfo.length-1]?.longitude > 0);
    const allUsersForSearch = userWithLocation.filter(user => user.username.search(new RegExp(search, 'i')) !== -1);
    const places = userWithLocation.map(user1 => {
        const currentIO = user1.inoutinfo[user1.inoutinfo.length-1];
        const data = {
            name: user1.username,
            longitude: currentIO.longitude,
            latitude: currentIO.latitude,
            profilePicture: user1.profilePicture
        }
        return data;
    });
    console.log(places);
    
    
    const onChange = e => {
        setSearch(e.target.value);
    }

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoibmFtbWVzZWxhcm9tIiwiYSI6ImNrdTUwcDlidDI5aWkybm9xODM3YWl4bGUifQ.02hxUVODo5RMTe23XMFCjw';
        
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            zoom: 14,
            center: [120.68158844273964, 15.576040746360363]
        });

        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        setMap(map);

        return () => map.remove();
    },[]);

    useEffect(() => {
        if(!map) return;

        if(places.length !== 0){
            const coords = [];
            places.map(place => {
                coords.push([place.longitude, place.latitude]);
            })
            const feature = multiPoint(coords);
            const box = bbox(feature);
            map.fitBounds(
                [
                  [box[0], box[1]],
                  [box[2], box[3]],
                ],
                {
                  padding: 20,
                  maxZoom: 14,
                  duration: 2000,
                }
              )
        }else{
            map.easeTo({
                center: [120.68158844273964, 15.576040746360363],
                zoom: 14,
                duration: 2000,
            })
        }
    },[map]);

    return(
        <Grid container  direction='row'>
            <Grid item container key='nav' direction='column' xs={12} sm={12} md={3}>
                <Stack sx={{padding: theme => theme.spacing(1, .5), height:'50px', width:'100%'}}>
                    <SearchPaper component='form'>
                        <IconButton>
                            <PersonIcon fontSize='small' color='primary'/>
                        </IconButton>
                        <InputBase
                            onChange={onChange}
                            className='inputBase'
                            name='search'
                            placeholder='Search.....'
                            inputProps={{'aria-label': 'Search....', style:{textTransform: 'capitalize'}}}
                            sx={{flexGrow: 1}}
                        />
                        <Divider orientation='vertical' className='divider' />
                        <IconButton>
                            <SearchIcon fontSize='small' color='primary' />
                        </IconButton>
                    </SearchPaper>
                </Stack>

                <Stack direction='column' alignItems='flex-start' sx={{padding: theme => theme.spacing(1, .5), width:'100%'}} elevation={3}>
                    {allUsersForSearch.length < 1 && (<Typography variant='h6' color='textSecondary'>No data found!</Typography>)}
                    {allUsersForSearch.length > 0 && allUsersForSearch.map(user => (
                        <UserCard user={user} key={user._id} map={map} mapContainer={mapContainer}/>
                    ))}
                </Stack>
            </Grid>
            <Grid item key='map' ref={mapContainer} xs={12} sm={12} md={9} sx={{height:'60vh', mt:1}}>
                {(places && map) && <Markers map={map} places={places} />}
            </Grid>
        </Grid>
    )
}

export default EmpTracker;