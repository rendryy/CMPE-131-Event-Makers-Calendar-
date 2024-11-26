import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EventForm from './EventForm'; 
import EventEdit from './EventEdit'
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
  const [isEditing, setIsEditing] = useState(false);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEditing(false);
  };

  useEffect(() => {
    const username = sessionStorage.getItem("username");

    if (!username) {
      navigate("/login");
      return;
    }

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

  const handleEventCreated = () => {
    const username = sessionStorage.getItem("username");
    axios.get(`http://localhost:5000/events/${username}`).then(response => {
      if (response.status === 200) {
        const eventList = response.data.events.map(event => ({
          start: new Date(event.StartTime),
          end: new Date(event.EndTime),
          title: event.title,
          description: event.description,
          location: event.location,
          id: event.eventID
        }));
        setEvents(eventList);
      }
    });
  };

  const toggleEventForm = () => {
    setShowEventForm(!showEventForm);
  };

  if (loading) {
    return <div>Loading events...</div>;
  }
  const handleEventUpdate = async (updatedEvent) => {
    const eventPayload = {
      title: updatedEvent.title,
      description: updatedEvent.description,
      StartTime: updatedEvent.start.toISOString(),
      EndTime: updatedEvent.end.toISOString(),
      location: updatedEvent.location,
    };
  
    try {
      const response = await axios.put(`http://localhost:5000/events/${updatedEvent.id}`, eventPayload);
  
      if (response.status === 200) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === updatedEvent.id
              ? { ...event, ...updatedEvent, start: new Date(updatedEvent.start), end: new Date(updatedEvent.end) }
              : event
          )
        );
        setSelectedEvent(null); 
        setIsEditing(false); 
      } else {
        setErrorMessage("Failed to update the event.");
        console.error("Failed to update event:", response.data);
      }
    } catch (error) {
      setErrorMessage("An error occurred while updating the event.");
      console.error("Error updating event:", error);
    }
  };
  
  

  const handleEventDelete = async (eventID) => {
    console.log("Deleting event with ID:", eventID);
    
    if (!eventID) {
      console.error("Event ID is missing!");
      setErrorMessage("Event ID is missing.");
      return;
    }
    
    try {
      const response = await axios.delete(`http://localhost:5000/events/${eventID}`);
      console.log("Response from backend:", response);
  
      if (response.status === 200) {
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventID));
        setSelectedEvent(null); 
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setErrorMessage("Failed to delete event.");
    }
  };
  
  

  return (
    <div className="App">
      <h2>Welcome, {sessionStorage.getItem("username")}!</h2>
      <h1>Your Calendar</h1>
      {errorMessage && <div className="error">{errorMessage}</div>}
      {showEventForm && <EventForm onEventCreated={handleEventCreated} />}
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={events}
        style={{ height: "50vh" }}
        onSelectEvent={handleEventClick}
      />
      <button onClick={toggleEventForm}>
        {showEventForm ? "Cancel" : "Create Event"}
      </button>

      {selectedEvent && (
        <div className="event-modal">
          <h2>Event Details</h2>
          <p><strong>Title:</strong> {selectedEvent.title}</p>
          <p><strong>Description:</strong> {selectedEvent.description}</p>
          <p><strong>Location:</strong> {selectedEvent.location}</p>
          <p><strong>Start:</strong> {selectedEvent.start.toLocaleString()}</p>
          <p><strong>End:</strong> {selectedEvent.end.toLocaleString()}</p>
          <p><strong>Event ID:</strong> {selectedEvent.id}</p>
          <button onClick={() => setIsEditing(true)}
           style={{ marginTop: "10px", backgroundColor: "green", color: "white" }} 
            >Edit Event</button> 
          <button
            onClick={() => handleEventDelete(selectedEvent.id)}
            style={{ marginTop: "10px", backgroundColor: "red", color: "white" }}
          >
            Delete Event
          </button>
          <button onClick={() => setSelectedEvent(null)}>Close</button>
          
          {isEditing && (
            <div>
              <h2>Edit Event</h2>
              <EventEdit
                event={selectedEvent}
                onEventUpdated={handleEventUpdate}
              />
              <button onClick={() => setIsEditing(false)}>Cancel Edit</button> 
            </div>
          )}
        </div>
      )}
      <LogoutButton />
    </div>
  );
};
export default Calendar1;
