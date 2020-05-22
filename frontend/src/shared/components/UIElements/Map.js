import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

import './Map.css';

mapboxgl.accessToken =
  'pk.eyJ1IjoibmV3dXNlcnJlYWN0b3IiLCJhIjoiY2thaTlteXppMDhhdzJxbzg1bjc5MXU4OCJ9.ZIdZ2ITEtCKVNRXHthKirQ';

const Map = (props) => {
  const mapRef = useRef();
  const { zoom, center } = props;

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: center, // starting position [lng, lat]
      zoom: zoom, // starting zoom
    });

    new mapboxgl.Marker(mapRef).setLngLat(center).addTo(map);
  }, [zoom, center]);

  return <div ref={mapRef} className={`map ${props.className}`} style={props.style}></div>;
};

export default Map;
