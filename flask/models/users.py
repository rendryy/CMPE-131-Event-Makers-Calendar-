##SQLITE IS USED FOR DATABASE 
import os
import sqlite3
from flask_sqlalchemy import SQLAlchemy
DATABASE_FILE = 'users.db'


def _connect_db():
    return sqlite3.connect(DATABASE_FILE)



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


def update_user_events(username, events):
    """Update a user's events in the SQLite database."""
    with _connect_db() as connection:
        cursor = connection.cursor()

        cursor.execute("SELECT id FROM User WHERE username = ?", (username,))
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