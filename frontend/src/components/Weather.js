import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { 
  getCurrentWeatherByCoords, 
  getWeatherIconUrl, 
  formatTemperature,
  getWeatherDescription
} from '../services/WeatherService';

/**
 * Weather component that displays current weather information
 * @param {Object} props - Component props
 * @param {number} props.lat - Latitude (optional)
 * @param {number} props.lon - Longitude (optional)
 * @param {string} props.units - Units (metric, imperial) (optional)
 * @param {boolean} props.showDetails - Whether to show detailed weather info (optional)
 */
const Weather = ({ lat, lon, units = 'metric', showDetails = true }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define fetchWeather inside useEffect to avoid dependency issues
    const fetchWeather = async (latitude, longitude) => {
      try {
        setLoading(true);
        const data = await getCurrentWeatherByCoords(latitude, longitude, units);
        setWeather(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch weather data. Please try again later.");
        console.error("Weather fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    // If coordinates are provided, use them
    if (lat && lon) {
      fetchWeather(lat, lon);
      return;
    }

    // Otherwise try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (err) => {
          console.error("Error getting location:", err);
          setError("Unable to get your location. Please enable location services.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, [lat, lon, units]);

  // Function to determine if weather is suitable for drone operations
  const isDroneOperationSuitable = (weather) => {
    if (!weather) return false;
    
    // Check wind speed (less than 20 km/h or ~5.5 m/s is generally safe)
    const windTooStrong = weather.wind.speed > 5.5;
    
    // Check for rain or snow
    const hasPrecipitation = weather.weather.some(w => 
      w.main === 'Rain' || w.main === 'Snow' || w.main === 'Thunderstorm'
    );
    
    // Check visibility (should be good)
    const poorVisibility = weather.visibility < 5000; // less than 5km
    
    return !windTooStrong && !hasPrecipitation && !poorVisibility;
  };

  // Get drone operation recommendation
  const getDroneRecommendation = (weather) => {
    if (!weather) return null;
    
    const suitable = isDroneOperationSuitable(weather);
    
    if (suitable) {
      return {
        text: "Conditions are suitable for drone operations",
        color: "success"
      };
    } else {
      let reason = "Weather conditions are not ideal for drone operations";
      
      if (weather.wind.speed > 5.5) {
        reason = "Wind speed too high for safe drone operations";
      } else if (weather.weather.some(w => w.main === 'Rain' || w.main === 'Snow')) {
        reason = "Precipitation detected - not suitable for drone operations";
      } else if (weather.visibility < 5000) {
        reason = "Poor visibility - not suitable for drone operations";
      }
      
      return {
        text: reason,
        color: "warning"
      };
    }
  };

  if (loading) {
    return (
      <Card className="mb-4 weather-card">
        <Card.Body className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 mb-0">Loading weather data...</p>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="warning" className="mb-4">
        <i className="fas fa-exclamation-triangle me-2"></i> {error}
      </Alert>
    );
  }

  if (!weather) {
    return null;
  }

  const recommendation = getDroneRecommendation(weather);

  return (
    <Card className="mb-4 weather-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">
            <i className="fas fa-cloud-sun me-2"></i> 
            Current Weather
          </h5>
          <span className="text-muted small">
            {weather.name}, {weather.sys.country}
          </span>
        </div>

        <div className="d-flex align-items-center">
          <img 
            src={getWeatherIconUrl(weather.weather[0].icon)} 
            alt={weather.weather[0].description}
            style={{ width: '60px', height: '60px' }}
          />
          <div className="ms-3">
            <h2 className="mb-0">{formatTemperature(weather.main.temp, units)}</h2>
            <p className="mb-0">{getWeatherDescription(weather.weather)}</p>
          </div>
        </div>

        {showDetails && (
          <>
            <hr />
            <Row className="text-center">
              <Col xs={4}>
                <div className="weather-detail">
                  <i className="fas fa-wind mb-2"></i>
                  <p className="mb-0 small">Wind</p>
                  <p className="mb-0 fw-bold">
                    {Math.round(weather.wind.speed * 3.6)} km/h
                  </p>
                </div>
              </Col>
              <Col xs={4}>
                <div className="weather-detail">
                  <i className="fas fa-tint mb-2"></i>
                  <p className="mb-0 small">Humidity</p>
                  <p className="mb-0 fw-bold">{weather.main.humidity}%</p>
                </div>
              </Col>
              <Col xs={4}>
                <div className="weather-detail">
                  <i className="fas fa-eye mb-2"></i>
                  <p className="mb-0 small">Visibility</p>
                  <p className="mb-0 fw-bold">{(weather.visibility / 1000).toFixed(1)} km</p>
                </div>
              </Col>
            </Row>
            
            <Alert variant={recommendation.color} className="mt-3 mb-0">
              <i className={`fas fa-${recommendation.color === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
              {recommendation.text}
            </Alert>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default Weather;
