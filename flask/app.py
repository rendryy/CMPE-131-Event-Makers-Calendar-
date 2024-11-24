from flask import Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from services.weatherAPI import get_weather
from models.users import update_user_events
import sqlite3

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
    username = db.Column(db.Text, unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    userID = db.Column(db.Integer, primary_key=True, autoincrement = True)
    events = db.relationship('Events', backref='user', lazy=True)
class Events(db.Model):
    __tablename__ = 'Events'
    eventID = db.Column(db.Integer, primary_key = True, autoincrement = True)
    title = db.Column(db.Text, unique = False, nullable = False)
    description = db.Column(db.Text, nullable = True)
    userID = db.Column(db.Integer, db.ForeignKey('Users.userID'), nullable=False)
    StartTime = db.Column(db.DateTime, nullable = False)
    EndTime = db.Column(db.DateTime, nullable = False)
    location = db.Column(db.Text, nullable = True)

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

@app.route('/logout')
def logout():
    """Logout the user by clearing the session."""
    session.pop('user_id', None)  # Remove user_id from the session
    return jsonify({'message': 'Logout successful'}), 200
 
if __name__ == '__main__':
    app.run(debug=True, port = 5000)  