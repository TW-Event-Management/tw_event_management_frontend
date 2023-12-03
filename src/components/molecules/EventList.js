import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import './event-list.css';

const EventCard = ({ event, onCardClick }) => (
    <div className="event-card" onClick={() => onCardClick(event)}>
      <div className="event-header">
        <h2>{event.name}</h2>
      </div>
      <div className="event-details">
        <p>{event.description}</p>
        <p>Date: {event.date}</p>
        <p>Location: {event.location}</p>
        {/* Add more details as needed */}
      </div>
    </div>
  );

  const EventModal = ({ selectedEvent, onClose }) => {
    const handleOverlayClick = (e) => {
      if (e.target.classList.contains('event-modal-overlay')) {
        onClose();
      }
    };
  
    return (
      <div className="event-modal-overlay" onClick={handleOverlayClick}>
        <div className="event-modal">
          <h2>{selectedEvent.name}</h2>
          <p>{selectedEvent.description}</p>
          <p>Date: {selectedEvent.date}</p>
          <p>Location: {selectedEvent.location}</p>
          {/* Add more details as needed */}
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };
  
const EventList = () => {
    const router = useRouter();

    const [events, setEvents] = useState([]);

    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleCardClick = (event) => {
        setSelectedEvent(event);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
    };

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

    return (
        <div className="eventnmap">
          <div className="events-body">
            <h1>Event List</h1>
            <ul>
              {events.map((event) => (
                <EventCard key={event.id} event={event} onCardClick={handleCardClick} />
              ))}
            </ul>
          </div>
          {selectedEvent && <EventModal selectedEvent={selectedEvent} onClose={handleCloseModal} />}
          <div className="map-body">
            <h1>harta</h1>
          </div>
        </div>
      );
         
}

export default EventList;