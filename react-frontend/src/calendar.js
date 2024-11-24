import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import axios from 'axios';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const Calendar1 = () => {
  const [events, setEvents] = useState([]);
  const [weather, setWeather] = useState([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationError, setLocationError] = useState('');
  const [loading, setLoading] = useState(false);


  // Fetch events when component loads
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/events')
      .then((response) => setEvents(response.data))
      .catch((error) => console.error('Error fetching events:', error));
  }, []);
  // Handle adding a new event
  const handleAddEvent = (newEvent) => {
    axios
      .post('http://localhost:5000/api/events', newEvent)
      .then((response) => {
        setEvents([...events, newEvent]); // Add the new event to the state
      })
      .catch((error) => console.error('Error adding event:', error));
  };

  // Handle updating an event
  const handleUpdateEvent = (updatedEvent) => {
    axios
      .put(`http://localhost:5000/api/events/${updatedEvent.id}`, updatedEvent)
      .then(() => {
        const updatedEvents = events.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        );
        setEvents(updatedEvents);
      })
      .catch((error) => console.error('Error updating event:', error));
  };

  // Handle deleting an event
  const handleDeleteEvent = (eventId) => {
    axios
      .delete(`http://localhost:5000/api/events/${eventId}`)
      .then(() => {
        setEvents(events.filter((event) => event.id !== eventId));
      })
      .catch((error) => console.error('Error deleting event:', error));
  };

  return (
    <div className="App">
      <h1>Calendar</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={(event) => console.log('Event clicked:', event)}
        onSelectSlot={(slotInfo) => {
          const title = prompt('Enter event title');
          if (title) {
            const newEvent = {
              title: title,
              start: slotInfo.start,
              end: slotInfo.end,
            };
            handleAddEvent(newEvent); // Add the new event
          }
        }}
        eventPropGetter={(event) => {
          return {
            style: {
              backgroundColor: '#ffcccb',
            },
          };
        }}

      />
    </div>
  );
};

export default Calendar1;
