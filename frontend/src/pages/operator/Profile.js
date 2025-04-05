import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const OperatorProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    latitude: null,
    longitude: null,
    service_radius: 50,
    hourly_rate: 0,
    service_details: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        latitude: user.latitude || null,
        longitude: user.longitude || null,
        service_radius: user.service_radius || 50,
        hourly_rate: user.hourly_rate || 0,
        service_details: user.service_details || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'service_radius' || name === 'hourly_rate' ? Number(value) : 
              (name === 'latitude' || name === 'longitude') ? parseFloat(value) : value
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            latitude,
            longitude
          }));
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your current location. Please enable location services or enter coordinates manually.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.put('/auth/profile', formData);
      updateUser(response.data.user);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format coordinates as a readable address-like string
  const formatCoordinates = () => {
    if (formData.latitude && formData.longitude) {
      return `Lat: ${formData.latitude.toFixed(6)}, Long: ${formData.longitude.toFixed(6)}`;
    }
    return 'No location set';
  };

  return (
    <Container className="py-4">
      <div className="dashboard-header">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="dashboard-title">Operator Profile</h1>
            <p className="dashboard-subtitle">Update your personal information and service settings</p>
          </div>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card>
        <Card.Header>
          <h5 className="mb-0">Profile Information</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>

            <Card className="mb-3 bg-light">
              <Card.Body>
                <h6>Your Location</h6>
                <p className="mb-3">
                  Your location is used to match you with nearby farmers. Farmers will see your location displayed as coordinates.
                </p>
                <p className="mb-2">
                  <strong>Current Location: </strong> 
                  {formatCoordinates()}
                </p>
                <Button 
                  variant="secondary" 
                  onClick={getCurrentLocation}
                  disabled={loading}
                  className="mb-3"
                >
                  {loading ? 'Getting Location...' : 'Use My Current Location'}
                </Button>

                <Row className="mt-3">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Latitude</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.000001"
                        name="latitude"
                        value={formData.latitude || ''}
                        onChange={handleChange}
                        placeholder="Enter latitude"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Longitude</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.000001"
                        name="longitude"
                        value={formData.longitude || ''}
                        onChange={handleChange}
                        placeholder="Enter longitude"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Text className="text-muted">
                  You can manually enter your coordinates if you prefer not to use your current location.
                </Form.Text>
              </Card.Body>
            </Card>

            <Card className="mb-3 bg-light">
              <Card.Body>
                <h6>Service Details</h6>
                
                <Form.Group className="mb-3">
                  <Form.Label>Hourly Rate (₹/hour)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    name="hourly_rate"
                    value={formData.hourly_rate}
                    onChange={handleChange}
                    placeholder="Enter your hourly rate"
                  />
                  <Form.Text className="text-muted">
                    This is the rate you charge per hour for your drone services.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Service Details</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="service_details"
                    value={formData.service_details}
                    onChange={handleChange}
                    placeholder="Describe your services, equipment, experience, etc."
                  />
                  <Form.Text className="text-muted">
                    Provide details about your drone services, equipment specifications, experience, and any specializations.
                  </Form.Text>
                </Form.Group>
              </Card.Body>
            </Card>

            <Form.Group className="mb-3">
              <Form.Label>Service Radius (km) - {formData.service_radius} km</Form.Label>
              <Form.Range
                name="service_radius"
                min={5}
                max={100}
                step={5}
                value={formData.service_radius}
                onChange={handleChange}
              />
              <div className="d-flex justify-content-between">
                <span>5 km</span>
                <span>100 km</span>
              </div>
              <Form.Text className="text-muted">
                This is the maximum distance you're willing to travel for service requests.
              </Form.Text>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
              className="mt-3"
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Updating...
                </>
              ) : 'Update Profile'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OperatorProfile;
