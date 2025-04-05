import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Table, Form, Spinner, Alert } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import farmerService from '../../services/farmerService';
import { useNavigate } from 'react-router-dom';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const operatorIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper function to format location as an address
const formatLocationAsAddress = (operator) => {
  if (operator.address) {
    return operator.address;
  }
  
  // If no address is available, create a generic one based on coordinates
  if (operator.latitude && operator.longitude) {
    return `Location: ${operator.latitude.toFixed(4)}, ${operator.longitude.toFixed(4)}`;
  }
  
  return 'Address not available';
};

const NearbyOperators = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [position, setPosition] = useState(null);
  const [operators, setOperators] = useState([]);
  const [searchRadius, setSearchRadius] = useState(50);
  
  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          fetchNearbyOperators(latitude, longitude, searchRadius);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your current location. Please enable location services.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, [searchRadius]);
  
  const fetchNearbyOperators = async (latitude, longitude, radius) => {
    try {
      setLoading(true);
      const nearbyOperators = await farmerService.getNearbyOperators(latitude, longitude, radius);
      setOperators(nearbyOperators);
      setError(null);
    } catch (err) {
      console.error('Error fetching nearby operators:', err);
      setError(err.error || 'Failed to fetch nearby operators. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRadiusChange = (e) => {
    setSearchRadius(Number(e.target.value));
  };
  
  const requestService = (operatorId) => {
    // Navigate to the service request form with the selected operator pre-filled
    navigate('/farmer/service-request-form', { state: { selectedOperatorId: operatorId } });
  };
  
  if (loading && !position) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Getting your location...</p>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      <div className="dashboard-header">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="dashboard-title">Find Nearby Drone Operators</h1>
            <p className="dashboard-subtitle">Locate available drone operators in your area</p>
          </div>
        </div>
      </div>
      
      {error && (
        <Alert variant="danger">{error}</Alert>
      )}
      
      <Card className="mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Search Options</h5>
          </div>
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Search Radius (km)</Form.Label>
              <Form.Range 
                min={5} 
                max={100} 
                step={5} 
                value={searchRadius} 
                onChange={handleRadiusChange}
              />
              <div className="d-flex justify-content-between">
                <span>5 km</span>
                <span>{searchRadius} km</span>
                <span>100 km</span>
              </div>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
      
      {position && (
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Map View</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <div style={{ height: '400px', width: '100%' }}>
              <MapContainer 
                center={position} 
                zoom={12} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Your location */}
                <Marker position={position}>
                  <Popup>
                    Your location
                  </Popup>
                </Marker>
                
                {/* Search radius */}
                <Circle 
                  center={position} 
                  radius={searchRadius * 1000} 
                  pathOptions={{ fillColor: 'blue', fillOpacity: 0.1, color: 'blue', weight: 1 }}
                />
                
                {/* Operators */}
                {operators.map(operator => (
                  <Marker 
                    key={operator.id} 
                    position={[operator.latitude, operator.longitude]} 
                    icon={operatorIcon}
                  >
                    <Popup>
                      <div>
                        <h6>{operator.first_name} {operator.last_name}</h6>
                        <p className="mb-1">Distance: {operator.distance.toFixed(1)} km</p>
                        <p className="mb-1">Rating: {operator.rating} / 5</p>
                        <p className="mb-1">Address: {formatLocationAsAddress(operator)}</p>
                        <p className="mb-1"><strong>Hourly Rate:</strong> ₹{operator.hourly_rate ? operator.hourly_rate.toFixed(2) : '0.00'}/hour</p>
                        {operator.service_details && (
                          <div className="mb-2">
                            <strong>Service Details:</strong>
                            <p className="small text-muted mt-1">{operator.service_details}</p>
                          </div>
                        )}
                        <Button 
                          size="sm" 
                          variant="primary" 
                          onClick={() => requestService(operator.id)}
                          className="mt-2"
                        >
                          Request Service
                        </Button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </Card.Body>
        </Card>
      )}
      
      <Card>
        <Card.Header>
          <h5 className="mb-0">Available Operators</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-3">Searching for operators...</p>
            </div>
          ) : operators.length > 0 ? (
            <Table responsive hover className="mb-0">
              <thead>
                <tr>
                  <th>Operator Name</th>
                  <th>Address</th>
                  <th>Distance</th>
                  <th>Hourly Rate</th>
                  <th>Service Radius</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {operators.map(operator => (
                  <tr key={operator.id}>
                    <td>{operator.first_name} {operator.last_name}</td>
                    <td>{formatLocationAsAddress(operator)}</td>
                    <td>{operator.distance.toFixed(1)} km</td>
                    <td>₹{operator.hourly_rate ? operator.hourly_rate.toFixed(2) : '0.00'}/hr</td>
                    <td>{operator.service_radius} km</td>
                    <td>{operator.rating} / 5</td>
                    <td>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => requestService(operator.id)}
                      >
                        Request Service
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-4">
              <p className="mb-0">No operators found within {searchRadius} km of your location.</p>
              <p className="text-muted">Try increasing your search radius or check back later.</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NearbyOperators;
