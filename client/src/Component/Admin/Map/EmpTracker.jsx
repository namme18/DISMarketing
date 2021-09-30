import React,{ useState, useRef, useEffect } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Markers from './Markers';
import bbox from "@turf/bbox";
import { multiPoint } from "@turf/helpers";

const EmpTracker = () => {
    
    const [ map, setMap ] = useState(null);
    const [location, setLocation] = useState({
        lng:'',
        lat:''
    });
    const mapContainer = useRef(null);

    const currentLocation = (position) => {
        setLocation({
            lng: position.coords.longitude,
            lat: position.coords.latitude
        });
    }

    const onError = () => {
        console.log("Can't Find Location!");
    }

    const places = [
        {
          name: "Empire State Building",
          longitude: -73.9856,
          latitude: 40.7497,
        },
        {
          name: "Birch Coffee",
          longitude: -73.9864,
          latitude: 40.7438,
        },
        {
          name: "B&H",
          longitude: -73.9961,
          latitude: 40.753,
        },
        {
            name: "TPCI-tarlac",
            longitude: 120.5866475,
            latitude: 15.4916125
        },
        {
            name: "TPCI-tarlac2",
            longitude: 120.5866778,
            latitude: 15.4916111
        }
      ]
    
    useEffect(() => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(currentLocation, onError, {enableHighAccuracy: true});
        }
        mapboxgl.accessToken = 'pk.eyJ1IjoibmFtbWVzZWxhcm9tIiwiYSI6ImNrdTUwcDlidDI5aWkybm9xODM3YWl4bGUifQ.02hxUVODo5RMTe23XMFCjw';
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            zoom: 14,
            center: location
        });

        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        setMap(map);

        return () => map.remove();
    },[location.lng]);

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
            console.log(box);
        }else{
            map.easeTo({
                center: location,
                zoom: 10,
                duration: 2000,
            })
        }
    },[map]);

    const buttonClick = () => {
        map.easeTo({
            center: [-73.9856, 40.7497],
            zoom: 10,
            duration: 10000
        })
    }

    const buttonClickMe = () => {
        map.easeTo({
            center: location,
            zoom: 14,
            duration: 10000
        })
    }

    return(
        <Grid container  direction='row'>
            <Grid item key='nav' xs={3}>
                <Button onClick={buttonClick}>Clickme</Button>
                <Button onClick={buttonClickMe}>Clickme</Button>
            </Grid>
            <Grid item key='map' ref={mapContainer} xs={9} sx={{height:'60vh', mt:1}}>
                {(places && map) && <Markers map={map} places={places} />}
            </Grid>
        </Grid>
    )
}

export default EmpTracker;