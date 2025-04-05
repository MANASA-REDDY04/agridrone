/**
 * Weather Service for Agridrone
 * Uses OpenWeatherMap API to fetch weather data directly
 */

// Get API key from environment variables or use the one from frontend .env
const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY || '2cf102967a4b9b30879aba137116cbe7';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Get current weather by coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} units - Units (metric, imperial, standard)
 * @returns {Promise} - Weather data
 */
export const getCurrentWeatherByCoords = async (lat, lon, units = 'metric') => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Weather data fetch failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

/**
 * Get 5-day forecast by coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} units - Units (metric, imperial, standard)
 * @returns {Promise} - Forecast data
 */
export const getForecastByCoords = async (lat, lon, units = 'metric') => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Forecast data fetch failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
};

/**
 * Get current weather by city name
 * @param {string} city - City name
 * @param {string} units - Units (metric, imperial, standard)
 * @returns {Promise} - Weather data
 */
export const getCurrentWeatherByCity = async (city, units = 'metric') => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&units=${units}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Weather data fetch failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

/**
 * Get weather icon URL
 * @param {string} iconCode - Weather icon code
 * @returns {string} - Icon URL
 */
export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

/**
 * Format temperature with degree symbol
 * @param {number} temp - Temperature
 * @param {string} units - Units (metric, imperial, standard)
 * @returns {string} - Formatted temperature
 */
export const formatTemperature = (temp, units = 'metric') => {
  const tempRounded = Math.round(temp);
  const unitSymbol = units === 'imperial' ? '°F' : '°C';
  return `${tempRounded}${unitSymbol}`;
};

/**
 * Get weather condition description
 * @param {object} weather - Weather object
 * @returns {string} - Weather description
 */
export const getWeatherDescription = (weather) => {
  return weather && weather.length > 0 ? 
    weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1) : 
    'Unknown';
};
