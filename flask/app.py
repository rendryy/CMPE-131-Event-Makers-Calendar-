from flask import Flask, jsonify, request
from flask_cors import CORS
from services.weatherAPI import get_weather
from models.users import get_user, add_user, update_user_events

app = Flask(__name__)
CORS(app) 

@app.route('/login', methods=['POST'])
def login():
    """Login route for authenticating a user."""
    username = request.json.get('username')
    password = request.json.get('password')

    user = get_user(username)
    if user and user["password"] == password:
        return jsonify({"message": "Login successful", "username": username}), 200
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/register', methods=['POST'])
def register():
    """Register route for creating a new user."""
    username = request.json.get('username')
    password = request.json.get('password')

    if get_user(username):
        return jsonify({"message": "User already exists"}), 400
    success = add_user(username, password)
    if success:
        return jsonify({"message": "User registered successfully"}), 201
    return jsonify({"message": "Error in user registration"}), 500

@app.route('/events/<username>', methods=['GET', 'POST'])
def events(username):
    """Manage events for the logged-in user."""
    user = get_user(username)
    if not user:
        return jsonify({"message": "User not found"}), 404

    if request.method == 'GET':
        return jsonify(user["events"]), 200

    event = request.json.get('event')
    user["events"].append(event)
    success = update_user_events(username, user["events"])
    if success:
        return jsonify({"message": "Event added successfully"}), 201
    return jsonify({"message": "Error updating events"}), 500

@app.route('/weather/<location>', methods=['GET'])
def weather(location):
    """Fetch weather data for a given location using the Weather.gov API."""
    weather_data = get_weather(location)
    if weather_data:
        return jsonify(weather_data), 200
    return jsonify({"message": "Weather data not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)  
