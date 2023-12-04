import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

const MapRender = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);

    useEffect(() => {
        console.log("map rendered");
        mapboxgl.accessToken = 'pk.eyJ1IjoiZGFyaXVzYWxiYSIsImEiOiJjbHBxNnVrbjYxNXd1MnJsZTh3ZXVkdDFpIn0._o92jCkoQrJDvOA8qvKo7g';

        if (!map.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/dariusalba/clpq783c5013x01o98rs180lc',
                center: [21, 44],
                zoom: 4
            });

            map.current.on('load', function () {
                map.current.resize();
            });
        }
    }, []);

    return <div ref={mapContainer} className="map" style={{ height: "700px" }} />;
};

export default MapRender;