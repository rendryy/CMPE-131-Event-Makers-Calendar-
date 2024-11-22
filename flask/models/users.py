##SQLITE IS USED FOR DATABASE 
import os
import sqlite3

DATABASE_FILE = 'users.db'

def _connect_db():
    return sqlite3.connect(DATABASE_FILE)

def get_user(username):
    """Retrieve a user by username."""
    with _connect_db() as connection:
        cursor = connection.cursor()
        cursor.execute("SELECT username, password, userID FROM Users WHERE username = ?", (username,))
        user = cursor.fetchone()
        if user:
            return 
            {
                "username": row[0],
                "password": row[1], 
                "userID": row[2]
            }
        return None


def add_user(username, password):
    """Add a new user to the SQLite database."""
    try:
        with _connect_db() as connection:
            cursor = connection.cursor()
            # Exclude userID since it auto-increments
            cursor.execute("INSERT INTO Users (username, password) VALUES (?, ?)", (username, password))
            connection.commit()
            return cursor.lastrowid  # Return the new user's ID
    except sqlite3.IntegrityError:
        return None  # Return None if the username already exists


def update_user_events(username, events):
    """Update a user's events in the SQLite database."""
    with _connect_db() as connection:
        cursor = connection.cursor()

        cursor.execute("SELECT id FROM Users WHERE username = ?", (username,))
        user = cursor.fetchone()
        if not user:
            return False  
        user_id = user[0]

        cursor.execute("DELETE FROM Events WHERE user_id = ?", (user_id,))

        for event in events:
            cursor.execute("""
                INSERT INTO Events (user_id, title, description, start_time, end_time)
                VALUES (?, ?, ?, ?, ?)
            """, (user_id, event['title'], event.get('description', ''), event['start_time'], event['end_time']))

        connection.commit()
        return True