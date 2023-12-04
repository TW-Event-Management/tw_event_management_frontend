import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Input from '@/components/atoms/Input';
import LargeButton from '@/components/atoms/LargeButton';
import './molecules-style.css';
import '../atoms/atoms-style.css';

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';

const CreateEvent = () => {
    const [groups, setGroups] = useState([]);
    const [filterGroup, setFilterGroup] = useState("all");
    const [selectedGroup, setSelectedGroup] = useState("all");

    const [_lat, setLat] = useState(21.2087);
    const [_lon, setLon] = useState(45.7489);
    const [_zoom, setZoom] = useState(10);
    const [locationName, setLocationName] = useState("");

    const mapContainer = useRef(null);
    const map = useRef(null);
    const router = useRouter();
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [_coords, setCoords] = useState([]);

    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [organizer, setOrganizer] = useState('');
    const [date, setDate] = useState();
    const [time, setTime] = useState('');

    const [suggestionText, setSuggestionText] = useState('');

    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState([]);
    const [eventFormError, setEventFormError] = useState('');

    const eventInfo = {
        location: {
            coordinates: [_lon, _lat],
            name: locationName
        },
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setEventFormError('');
        if (eventName && description && eventInfo && date && time) {
            try {
                const response = await axios.post('http://localhost:3000/events/create-event', {
                    title: eventName,
                    date: new Date(`${date}T${time}`),
                    description: description,
                    organizer: organizer,
                    location: eventInfo.location,
                });
                location.reload();
            } catch (error) {
                console.error(error);
            }
        } else {
            setEventFormError('Please fill in all fields.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:3000/users/get-all');
                const userData = await Promise.all(
                    res.data.map(async (user) => {
                        return {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            userMail: user.email,
                        };
                    })
                );
                setUsers(userData);
            } catch (error) {
                console.error(error);
            }
        };

        mapboxgl.accessToken = 'pk.eyJ1IjoiZGFyaXVzYWxiYSIsImEiOiJjbHBxNnVrbjYxNXd1MnJsZTh3ZXVkdDFpIn0._o92jCkoQrJDvOA8qvKo7g';

        if (!map.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/dariusalba/clpq783c5013x01o98rs180lc',
                center: [21, 44],
                zoom: _zoom,
            });

            map.current.on('load', function () {
                map.current.resize();
            });
        }
    }, [])

    const computeSuggestion = async (value) => {
        try {
            const response = await axios.get(
                `https://geocode.maps.co/search?q=${value}`
            );
            const suggestions = response.data.map((item) => [item.display_name, item.lat, item.lon]);
            let name = response.data[0].display_name.split(",")[0];

            setLocationName(name);
            setSuggestions(suggestions);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const clickSuggestion = (suggestion) => {
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.style.backgroundColor = 'black';
        markerElement.style.color = 'white';
        markerElement.style.width = 'fit-content';
        markerElement.style.paddingRight = '20px';
        markerElement.style.paddingLeft = '20px';
        markerElement.style.height = '40px';
        markerElement.style.borderRadius = '50px';
        markerElement.style.display = 'flex';
        markerElement.style.justifyContent = 'center';
        markerElement.style.alignItems = 'center';
        markerElement.innerText = suggestion[0].split(",")[0];

        setLat(suggestion[2]);
        setLon(suggestion[1]);


        setSuggestionText(suggestion[0]); // Set suggestion text

        const marker = new mapboxgl.Marker({ element: markerElement }).setLngLat([parseFloat(suggestion[2]), parseFloat(suggestion[1])]).addTo(map.current);

        map.current.flyTo({
            center: [parseFloat(suggestion[2]), parseFloat(suggestion[1])],
            zoom: 15,
            duration: 3500,
        });
    }

    return (
        <div className="create-event-form">
            <h1>Create event</h1>
            <form onSubmit={handleFormSubmit} className="create-ev-form">
                <div className="mid-fields">
                    <Input _onInputChange={(value) => setEventName(value)} _placeholder={"Event title"} />
                    <Input _onInputChange={(value) => setDescription(value)} _placeholder={"Description"} />
                    <Input _onInputChange={(value) => setOrganizer(value)} _placeholder={"Organizer"} />
                    <div className="names">
                        <Input _onInputChange={(value) => setDate(value)} _placeholder={"Date"} />
                        <Input _onInputChange={(value) => setTime(value)} _placeholder={"Time"} />
                    </div>
                    <div className="suggestions">
                        {
                            suggestions.map((suggestion) => (
                                suggestionText ? <div className="suggestion" key={suggestion[0]} onClick={() => clickSuggestion(suggestion)}>{suggestion[0]}</div> : ""
                            ))
                        }
                    </div>
                    <Input
                        _onInputChange={(value) => {
                            setSuggestionText(value);
                        }}
                        _placeholder={"Location"}
                        _value={suggestionText}
                        className='input-style'
                    />
                    <button className="search-btn" onClick={() => computeSuggestion(suggestionText)}>
                        Find location
                    </button>
                </div>

                <div className="map-container-modal">
                    <div ref={mapContainer} className="map" />
                </div>
                <div className="bottom-fields">
                    <LargeButton _label="Create event" _type="submit" />
                </div>
                {eventFormError && <div className="error-message">{eventFormError} </div>}
            </form>
        </div>
    );
}

export default CreateEvent;
