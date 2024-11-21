import os

class Config:
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY', 'default_secret')
    WEATHER_API_KEY = os.getenv('WEATHER_API_KEY')
