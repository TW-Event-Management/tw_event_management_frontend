import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import './MapRender.css'; // Import the CSS file for styling

const MapRender = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);

    useEffect(() => {
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

        const handleScroll = () => {
            const mapDiv = mapContainer.current;
            const rect = mapDiv.getBoundingClientRect();
            const scrollTop = window.scrollY || document.documentElement.scrollTop;

            if (scrollTop <= 355) {
                mapDiv.classList.remove('fixed-map');
            } else if (rect.top <= 200) {
                mapDiv.classList.add('fixed-map');
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return <div ref={mapContainer} className="map" style={{ height: "550px", width: "700px" }} />;
};

export default MapRender;
