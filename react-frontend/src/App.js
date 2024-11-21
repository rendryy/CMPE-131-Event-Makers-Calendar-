import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import axios from 'axios';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const App = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/events') 
      .then((response) => setEvents(response.data))
      .catch((error) => console.error('Error fetching events:', error));
  }, []);


  const handleAddEvent = (newEvent) => {
    axios
      .post('http://localhost:5000/api/events', newEvent)
      .then((response) => {
        setEvents([...events, newEvent]);
      })
      .catch((error) => console.error('Error adding event:', error));
  };

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
      <h1>React Big Calendar with Flask</h1>
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
            handleAddEvent(newEvent);
          }
        }}
      />
    </div>
  );
};

export default App;
