import sqlite3 
import requests

url = "http://127.0.0.1:5000/login"
payload = {
    "username": "test1",
    "password": "123"
}

response = requests.post(url, json=payload)
print("Status Code:", response.status_code)
print("Response:", response.json())



