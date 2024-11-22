import requests

def get_weather(location):
    url = f"https://api.weather.gov/points/{location}/forecast"
    try:
        response = requests.get(url)
        data = response.json()
        return data["properties"]["periods"]
    except Exception as e:
        print(f"Error fetching weather data: {e}")
        return None
