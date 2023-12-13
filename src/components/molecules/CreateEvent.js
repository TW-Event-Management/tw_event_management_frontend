import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Input from '@/components/atoms/Input';
import LargeButton from '@/components/atoms/LargeButton';
import './molecules-style.css';
import '../atoms/atoms-style.css';

import mapboxgl from '!mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const CreateEvent = () => {

    const [_lat, setLat] = useState(21.2087);
    const [_lon, setLon] = useState(45.7489);
    const [_zoom, setZoom] = useState(10);
    const [locationName, setLocationName] = useState("");

    const mapContainer = useRef(null);
    const map = useRef(null);
    const router = useRouter();
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [organizer, setOrganizer] = useState('');
    const [date, setDate] = useState();
    const [time, setTime] = useState('');

    const [suggestionText, setSuggestionText] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);

    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState([]);
    const [eventFormError, setEventFormError] = useState('');

    const eventInfo = {
        location: {
            coordinates: [_lon, _lat],
            locName: locationName
        },
        selectedUsers: selectedUsers.map(user => user.userMail),
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setEventFormError('');

        console.log('Selected Users before form submission:', selectedUsers);

        if (eventName && description && eventInfo && organizer && date && time) {

            try {
                const response = await axios.post('http://localhost:3000/events/create-event', {
                    name: eventName,
                    description: description,
                    date: new Date(`${date}T${time}`),
                    organizer: organizer,
                    location: eventInfo.location,
                    invitations: eventInfo.selectedUsers,
                });

                location.reload();
            } catch (error) {
                console.error(error);

            }

        } else {
            setEventFormError('Please fill in all fields.');
        }
    };

    // Add this function to your component
    const handleUserClick = (user) => {
        const isSelected = selectedUsers.some((selectedUser) => selectedUser.userMail === user.userMail);

        if (isSelected) {
            // If user is already selected, remove from the list
            setSelectedUsers((prevSelectedUsers) =>
                prevSelectedUsers.filter((selectedUser) => selectedUser.userMail !== user.userMail)
            );
        } else {
            // If user is not selected, add to the list
            setSelectedUsers((prevSelectedUsers) => {
                const newSelectedUsers = [...prevSelectedUsers, user];
                console.log('Selected User:', user);
                console.log('All Selected Users:', newSelectedUsers);
                return newSelectedUsers;
            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:3000/users/get-all');
                const userData = res.data.map((user) => ({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userMail: user.email,
                }));
                setUsers(userData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

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

        console.log('Before setting state - Lat:', _lat, 'Lon:', _lon);

        setLat(parseFloat(suggestion[2]));
        setLon(parseFloat(suggestion[1]));

        console.log('After setting state - Lat:', _lat, 'Lon:', _lon);
        setSuggestionText(suggestion[0]); // Set suggestion text

        const marker = new mapboxgl.Marker({ element: markerElement })
            .setLngLat([parseFloat(suggestion[2]), parseFloat(suggestion[1])])
            .addTo(map.current);

        map.current.flyTo({
            center: [parseFloat(suggestion[2]), parseFloat(suggestion[1])],
            zoom: 15,
            duration: 3500,
        });
    }


    return (
        <div className="create-event-form">
            <h1>Create Event</h1>
            <form onSubmit={handleFormSubmit} className="create-ev-form">
                <div className="mid-fields">
                    {/* Event Name */}
                    <div className="form-group">
                        <label htmlFor="eventName">Event Name</label>
                        <Input
                            id="eventName"
                            _onInputChange={(value) => setEventName(value)}
                            _placeholder={"Event title"}
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <Input
                            id="description"
                            _onInputChange={(value) => setDescription(value)}
                            _placeholder={"Description"}
                        />
                    </div>

                    {/* Organizer */}
                    <div className="form-group">
                        <label htmlFor="organizer">Organizer</label>
                        <Input
                            id="organizer"
                            _onInputChange={(value) => setOrganizer(value)}
                            _placeholder={"Organizer"}
                        />
                    </div>

                    {/* Date and Time */}
                    <div className="form-group">
                        <div className="date-time-group">
                            <label htmlFor="date">Date</label>
                            <Input
                                id="date"
                                _onInputChange={(value) => setDate(value)}
                                _placeholder={"Date"}
                                type="date"
                            />
                        </div>
                        <div className="date-time-group">
                            <label htmlFor="time">Time</label>
                            <Input
                                id="time"
                                _onInputChange={(value) => setTime(value)}
                                _placeholder={"Time"}
                                type="time"
                            />
                        </div>
                    </div>

                    {/* Suggestions */}
                    <div className="suggestions">
                        {suggestions.map((suggestion) => (
                            suggestionText ? (
                                <div
                                    className="suggestion"
                                    key={suggestion[0]}
                                    onClick={() => clickSuggestion(suggestion)}
                                >
                                    {suggestion[0]}
                                </div>
                            ) : ""
                        ))}
                    </div>
                    {/* Location input and search button */}
                    <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <Input
                            id="location"
                            _onInputChange={(value) => setSuggestionText(value)}
                            _placeholder={"Location"}
                            _value={suggestionText}
                            className='input-style'
                        />
                    </div>
                    <div className="form-group location-group">
                        <button className="search-btn" onClick={() => computeSuggestion(suggestionText)}>
                            Find Location
                        </button>
                    </div>
                </div>
                <div className="user-list">
                    <h4>Select invitations</h4>
                    {users.map((user) => (
                        <div key={user.userMail} className="user-item" onClick={() => handleUserClick(user)}>
                            {user.userMail}
                        </div>
                    ))}
                </div>
                {/* Map container */}
                <div className="map-container-modal">
                    <div ref={mapContainer} className="map-modal" />
                </div>

                <div className="bottom-fields">
                    {/* Create event button */}
                    <LargeButton _label="Create Event" _type="submit" />
                </div>

                {eventFormError && <div className="error-message">{eventFormError}</div>}
            </form>
        </div>
    );
}
export default CreateEvent;
