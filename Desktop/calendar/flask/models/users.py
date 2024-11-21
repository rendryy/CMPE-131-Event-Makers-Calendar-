import json
import os

# Path to the JSON file where user data will be stored
USERS_FILE = 'flask/models/users.json'

def _load_users():
    """Load users from the JSON file."""
    if not os.path.exists(USERS_FILE):
        return {}
    with open(USERS_FILE, 'r') as file:
        return json.load(file)

def _save_users(users):
    """Save the users dictionary to the JSON file."""
    with open(USERS_FILE, 'w') as file:
        json.dump(users, file, indent=4)

def get_user(username):
    """Fetch a user by username."""
    users = _load_users()
    return users.get(username)

def add_user(username, password):
    """Add a new user to the JSON storage."""
    users = _load_users()
    if username in users:
        return False  # User already exists
    users[username] = {"password": password, "events": []}
    _save_users(users)
    return True

def update_user_events(username, events):
    """Update a user's events in the JSON storage."""
    users = _load_users()
    if username not in users:
        return False  # User not found
    users[username]["events"] = events
    _save_users(users)
    return True
