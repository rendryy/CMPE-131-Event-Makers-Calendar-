from flask import Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from services.weatherAPI import get_weather
from models.users import update_user_events
import sqlite3
from datetime import datetime
from dateutil.parser import parse

app = Flask(__name__)
CORS(app)
#Make sure that the db file is correctly routed 
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'  
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  
app.config['SECRET_KEY'] = 'your-secret-key'
#This is for the weather API which we can add later
# BASE_URL = "https://api.weather.gov/gridpoints"
db = SQLAlchemy(app)

class Users(db.Model):
    __tablename__ = 'Users'
    username = db.Column(db.Text,primary_key=True, unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    userID = db.Column(db.Integer, primary_key=True, autoincrement = True)
    events = db.relationship('Events', backref='user', lazy=True)
class Events(db.Model):
    __tablename__ = 'Events'
    eventID = db.Column(db.Integer, primary_key = True, autoincrement = True)
    title = db.Column(db.Text, unique = False, nullable = True)
    description = db.Column(db.Text, nullable = True)
    username = db.Column(db.Text, db.ForeignKey('Users.username'), nullable=True)
    StartTime = db.Column(db.DateTime, nullable = False)
    EndTime = db.Column(db.DateTime, nullable = False)
    location = db.Column(db.Text, nullable = True)
    def __repr__(self):
        return f'<Event {self.title} at {self.StartTime}>'

with app.app_context():
    db.create_all()
def get_user(username):
    user = User.query.filter_by(username=username).first()
    if user:
        return 
        {
            "username": user.username,
            "password": user.password
        }
    return None
def add_user(username, password):
    """Add a new user to the SQLite database."""
    try:
        with _connect_db() as connection:
            cursor = connection.cursor()
            cursor.execute("INSERT INTO Users (username, password) VALUES (?, ?)", (username, password))
            connection.commit()
            return cursor.lastrowid 
    except sqlite3.IntegrityError:
        return None      

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = Users.query.filter_by(username=username).first()
    if not username:
        return jsonify({"message": "Username is required"}), 400

    if not password:
        return jsonify({"message": "Password is required"}), 400
    if not user:
        return jsonify({"message": "Invalid username or password"}), 401
    session['username'] = user.username
    session['password'] = user.password

    return jsonify({'message': 'Login successful'}), 200


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if Users.query.filter_by(username=username).first():
        return jsonify({"message": "Error in user registration"}), 500
    new_user = Users(username = username, password = password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/events/<username>', methods=['GET', 'POST','DELETE'])
def events(username):
    # Fetch the user from the database
    user = Users.query.filter_by(username=username).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    if request.method == 'GET':
        # Fetch events linked to this user from the database
        events = Events.query.filter_by(username=username).all()
        event_list = [{
            'StartTime': event.StartTime,
            'EndTime': event.EndTime,
            'title': event.title,
            'description': event.description,
            'location': event.location,
        } for event in events]

        return jsonify({"events": event_list}), 200

    if request.method == 'POST':
        # Extract event data from the request
        event_data = request.json.get('event')
        if not event_data:
            return jsonify({"message": "No event data provided"}), 400
        try:
            start_time = parse(event_data['StartTime'])
            end_time = parse(event_data['EndTime'])
        except ValueError:
            return jsonify({"message": "Invalid date format"}), 400
        new_event = Events(
            title=event_data['title'],
            description=event_data.get('description'),
            StartTime=start_time,
            EndTime=end_time,
            location=event_data.get('location'),
            username=user.username
        )
        db.session.add(new_event)
        db.session.commit()

        return jsonify({"message": "Event created successfully","eventID": new_event.eventID}), 201
    return jsonify({"message": "Event creation failure"}), 500

@app.route('/events/<eventID>', methods=['DELETE'])
def delete_event(eventID):
    print(f"Received DELETE request for event ID: {eventID}")  # Debugging line
    
    username = get_current_user()  # Fetch the username of the logged-in user
    
    if not username:
        return jsonify({"message": "User not logged in"}), 401
    
    # Find the event by eventID and username
    event = Events.query.filter_by(eventID=eventID, username=username).first()
    if not event:
        return jsonify({"message": "Event not found"}), 404

    # Delete the event
    db.session.delete(event)
    db.session.commit()

    return jsonify({"message": "Event deleted successfully"}), 200

    
@app.route('/logout', methods=['POST'])
def logout():
    """Logout the user by clearing the session."""
    session.pop('username', None)  # Remove user_id from the session
    return jsonify({'message': 'Logout successful'}), 200
 
if __name__ == '__main__':
    app.run(debug=True, port = 5000)  