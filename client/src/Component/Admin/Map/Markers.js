import React,{ useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { styled } from '@mui/material/styles';

const StyledDiv = styled('div',{
    shouldForwardProp: prop => prop !== 'profilePicture'
})(({theme,profilePicture}) => ({
    backgroundImage: `url(${profilePicture})`,
    cursor: 'pointer',
    width: '25px',
    height: '25px',
    borderRadius: '50%',
    backgroundSize: 'cover',
    boxShadow: 6
}));

const Marker = ({map, place}) => {
    const markerRef = useRef();

    useEffect(() => {
        const marker = new mapboxgl.Marker(place.profilePicture ? markerRef.current: markerRef)
            .setLngLat([place.longitude, place.latitude])
            .addTo(map);

        return () => marker?.remove();
    });

    return <StyledDiv profilePicture={place.profilePicture} ref={markerRef} />;
}

const Markers = ({map, places}) => {
    return (
        <>
            {places && places.map(place => (
                <Marker key={place.name} map={map} place={place} />
            ))}
        </>
    )
}

export default Markers;