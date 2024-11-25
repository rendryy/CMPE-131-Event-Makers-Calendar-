import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EventForm from './EventForm'; 
import LogoutButton from "./loggout";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css"

const localizer = momentLocalizer(moment);

const Calendar1 = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = (event) => {
    setSelectedEvent(event); // Set the clicked event as selected
  };

  useEffect(() => {
    const username = sessionStorage.getItem("username");

    // Check if the user is logged in
    if (!username) {
      navigate("/login");
      return;
    }

    // Fetch events from Flask backend
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/events/${username}`)
        if (response.status === 200) {
          const eventList = response.data.events.map(events => ({
            start: new Date(events.StartTime),
            end: new Date(events.EndTime),
            title: events.title,
            description: events.description,
            location: events.location,
            id: events.eventID,
          }));
          setEvents(eventList);
        }
      } catch (error) {
        setErrorMessage('Error fetching events');
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [navigate]);

  const handleEventCreated = async (eventData) => {
    const username = sessionStorage.getItem("username");
  
    if (!username) {
      console.error("User is not logged in");
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/events', {
        title: eventData.title,
        description: eventData.description,
        start_time: eventData.start_time,
        end_time: eventData.end_time,
        location: eventData.location,
        username: username,  // Assuming you pass the username if needed
      });
  
      if (response.status === 201) {
        const createdEvent = response.data;
        console.log("Event created successfully:", createdEvent);
  
        // Optionally: add the new event to the calendar state
        setEvents([...events, {
          start: new Date(eventData.start_time),
          end: new Date(eventData.end_time),
          title: eventData.title,
          description: eventData.description,
          location: eventData.location,
          id: createdEvent.eventID,  // Set the new event ID returned from backend
        }]);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };
  

  const toggleEventForm = () => {
    setShowEventForm(!showEventForm);
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  const handleEventUpdate = async (updatedEvent) => {
    try {
      await axios.put(`http://localhost:5000/events/${updatedEvent.id}`, updatedEvent);
      setSelectedEvent(null);
      handleEventCreated(); // Refresh events
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleEventDelete = async (eventID) => {
    console.log("Deleting event with ID:", eventID);  // Debugging line
    
    if (!eventID) {
      console.error("Event ID is missing!");
      setErrorMessage("Event ID is missing.");
      return;
    }
  
    try {
      const response = await axios.delete(`http://localhost:5000/events/${eventID}`);
      console.log("Response from backend:", response);
  
      if (response.status === 200) {
        setSelectedEvent(null);
        handleEventCreated(); // Refresh events
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setErrorMessage("Failed to delete event");
    }
  };


  return (
    <div className="App">
      <h1>Your Calendar</h1>
      {errorMessage && <div className="error">{errorMessage}</div>}

      {showEventForm && <EventForm onEventCreated={handleEventCreated} />}
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={events}
        style={{ height: "50vh" }}
        onSelectEvent={handleEventClick} // Handle event click
      />
      <button onClick={toggleEventForm}>
        {showEventForm ? "Cancel" : "Create Event"}
      </button>

    {selectedEvent && (
    <div className="event-modal">
      <h2>Edit Event</h2>
      <EventForm
        event={selectedEvent}
        onEventUpdated={handleEventUpdate}
        onEventDeleted={() => handleEventDelete(selectedEvent.id)} // Pass eventID here
      />
      <button onClick={() => setSelectedEvent(null)}>Close</button>
      
      {/* Delete Button */}
      <button onClick={() => handleEventDelete(selectedEvent.id)} 
      style={{ marginTop: "10px", backgroundColor: "red", color: "white" }}>
        Delete Event
      </button>
    </div>
  )}

      <LogoutButton />
    </div>
  );
};

export default Calendar1;
