import os
import requests
from flask import Blueprint, jsonify, request
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

weather_bp = Blueprint('weather', __name__)

# Get API key from environment variable
API_KEY = os.environ.get('OPENWEATHER_API_KEY')
BASE_URL = 'https://api.openweathermap.org/data/2.5'

@weather_bp.route('/current', methods=['GET'])
def get_current_weather():
    """Get current weather by coordinates"""
    try:
        # Get query parameters
        lat = request.args.get('lat')
        lon = request.args.get('lon')
        units = request.args.get('units', 'metric')
        
        # Validate parameters
        if not lat or not lon:
            return jsonify({'error': 'Latitude and longitude are required'}), 400
        
        # Check if API key is available
        if not API_KEY:
            print("WARNING: OpenWeatherMap API key is not set in environment variables")
            return jsonify({'error': 'Weather API key is not configured'}), 500
        
        # Make request to OpenWeatherMap API
        url = f"{BASE_URL}/weather?lat={lat}&lon={lon}&units={units}&appid={API_KEY}"
        print(f"Making request to: {url.replace(API_KEY, 'API_KEY_HIDDEN')}")
        
        response = requests.get(url)
        
        # Check if request was successful
        if response.status_code != 200:
            print(f"OpenWeatherMap API error: Status {response.status_code}, Response: {response.text}")
            return jsonify({'error': 'Failed to fetch weather data'}), response.status_code
        
        # Return weather data
        return jsonify(response.json())
    
    except Exception as e:
        print(f"Exception in weather API: {str(e)}")
        return jsonify({'error': str(e)}), 500

@weather_bp.route('/forecast', methods=['GET'])
def get_forecast():
    """Get 5-day forecast by coordinates"""
    try:
        # Get query parameters
        lat = request.args.get('lat')
        lon = request.args.get('lon')
        units = request.args.get('units', 'metric')
        
        # Validate parameters
        if not lat or not lon:
            return jsonify({'error': 'Latitude and longitude are required'}), 400
        
        # Check if API key is available
        if not API_KEY:
            print("WARNING: OpenWeatherMap API key is not set in environment variables")
            return jsonify({'error': 'Weather API key is not configured'}), 500
            
        # Make request to OpenWeatherMap API
        url = f"{BASE_URL}/forecast?lat={lat}&lon={lon}&units={units}&appid={API_KEY}"
        print(f"Making request to: {url.replace(API_KEY, 'API_KEY_HIDDEN')}")
        
        response = requests.get(url)
        
        # Check if request was successful
        if response.status_code != 200:
            print(f"OpenWeatherMap API error: Status {response.status_code}, Response: {response.text}")
            return jsonify({'error': 'Failed to fetch forecast data'}), response.status_code
        
        # Return forecast data
        return jsonify(response.json())
    
    except Exception as e:
        print(f"Exception in weather API: {str(e)}")
        return jsonify({'error': str(e)}), 500
