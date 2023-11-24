import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useRouter } from 'next/navigation';


const EventList = () => {
    const router = useRouter();

    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:3000/events/get-all')
                setEvents(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching events: ', error);
            }
        }
        fetchEvents();
    }, []);
}

export default EventList;
