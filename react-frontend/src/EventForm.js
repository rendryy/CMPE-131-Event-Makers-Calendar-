import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EventForm = ({ onEventCreated }) => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = sessionStorage.getItem("username");
    if (!username) {
      setErrorMessage("You must be logged in to create an event.");
      return;
    }

    const eventPayload = {
      event: {
        title: eventData.title,
        description: eventData.description,
        StartTime: new Date(eventData.startTime).toISOString(),
        EndTime: new Date(eventData.endTime).toISOString(),
        location: eventData.location,
        id: eventData.eventID
      },
    };
    

    try {
      const response = await axios.post(`http://localhost:5000/events/${username}`, eventPayload);
      if (response.status === 201) {
        onEventCreated();
        setEventData({
          title: '',
          description: '',
          startTime: '',
          endTime: '',
          location: '',
        });
      } else {
        setErrorMessage('Error creating event.');
      }
    } catch (error) {
      setErrorMessage('Error creating event.');
      console.error('Error creating event:', error);
    }
  };

  return (
    <div>
      <h2>Create Event</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={eventData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Start Time:</label>
          <input
            type="datetime-local"
            name="startTime"
            value={eventData.startTime}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>End Time:</label>
          <input
            type="datetime-local"
            name="endTime"
            value={eventData.endTime}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={eventData.location}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default EventForm;
