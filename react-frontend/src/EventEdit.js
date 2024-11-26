import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EventEdit = ({ event, onEventUpdated }) => {
    const [eventData, setEventData] = useState({
      title: event.title || '',
      description: event.description || '',
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      location: event.location || '',
    });
  
    // handle form change
    const handleChange = (e) => {
      const { name, value } = e.target;
      setEventData({
        ...eventData,
        [name]: value,
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      // Ensure the updated event data is in the correct format
      const updatedEvent = {
        id: event.id,
        title: eventData.title,
        description: eventData.description,
        start: new Date(eventData.startTime),
        end: new Date(eventData.endTime),
        location: eventData.location,
      };
  
      // Call the onEventUpdated function with the updated event
      onEventUpdated(updatedEvent);  // Ensure onEventUpdated is expecting the correct data format
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
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
          />
        </div>
        <div>
          <label>End Time:</label>
          <input
            type="datetime-local"
            name="endTime"
            value={eventData.endTime}
            onChange={handleChange}
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
        <button type="submit">Update Event</button>
      </form>
    );
  };
  
  export default EventEdit;
  
