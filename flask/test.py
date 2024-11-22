import sqlite3

# Connect to your database
conn = sqlite3.connect('users.db')
cursor = conn.cursor()

# Check if the Users table exists
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='pinheads';")
result = cursor.fetchone()
if result:
    print("Users table exists")
else:
    print("Users table does not exist")

 

conn.close()

