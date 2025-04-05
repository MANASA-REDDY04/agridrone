import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form, Modal, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import farmerService from '../../services/farmerService';
import Weather from '../../components/Weather';

const FarmerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalFields: 0,
    totalArea: 0,
    pendingRequests: 0,
    completedServices: 0
  });
  
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    area: '',
    crop_type: '',
    coordinates: ''
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch fields and service requests in parallel
        const [fields, serviceRequests] = await Promise.all([
          farmerService.getFields(),
          farmerService.getServiceRequests()
        ]);
        
        // Calculate stats
        const totalArea = fields.reduce((sum, field) => sum + parseFloat(field.area), 0);
        const pendingRequests = serviceRequests.filter(req => req.status === 'pending').length;
        const completedServices = serviceRequests.filter(req => req.status === 'completed').length;
        
        setStats({
          totalFields: fields.length,
          totalArea: totalArea.toFixed(1),
          pendingRequests,
          completedServices
        });
        
        // Get the most recent service requests (up to 5)
        const sortedRequests = [...serviceRequests].sort((a, b) => {
          return new Date(b.scheduled_date) - new Date(a.scheduled_date);
        }).slice(0, 5);
        
        setRecentRequests(sortedRequests);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning" className="badge-pending">Pending</Badge>;
      case 'accepted':
        return <Badge bg="info" className="badge-accepted">Accepted</Badge>;
      case 'completed':
        return <Badge bg="success" className="badge-completed">Completed</Badge>;
      case 'cancelled':
        return <Badge bg="danger" className="badge-cancelled">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  // Field modal handlers
  const handleCloseAddFieldModal = () => {
    setShowAddFieldModal(false);
    resetForm();
  };

  const handleShowAddFieldModal = () => {
    resetForm();
    setShowAddFieldModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      area: '',
      crop_type: '',
      coordinates: ''
    });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddField = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      // Create new field using the API
      await farmerService.createField({
        ...formData,
        area: parseFloat(formData.area)
      });
      
      // Navigate to the fields page after successful creation
      handleCloseAddFieldModal();
      navigate('/farmer/fields');
    } catch (err) {
      console.error('Error creating field:', err);
      setError(err.error || 'Failed to create field. Please try again.');
    }
  };

  // Function to get current location and update the coordinates field
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Display just the center point in the text area for better readability
        setFormData({
          ...formData,
          coordinates: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        });
        setLocationLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setError(`Error getting location: ${error.message}`);
        setLocationLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome, {user?.first_name || 'Farmer'}</h1>
        <p className="dashboard-subtitle">Here's an overview of your farming operations</p>
      </div>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      
      <Row className="dashboard-stats">
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100">
            <Card.Body className="text-center">
              <div className="mb-3 text-primary">
                <i className="fas fa-map-marked-alt fa-2x"></i>
              </div>
              <h3 className="mb-1">{stats.totalFields}</h3>
              <p className="text-muted mb-0">Total Fields</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100">
            <Card.Body className="text-center">
              <div className="mb-3 text-primary">
                <i className="fas fa-ruler-combined fa-2x"></i>
              </div>
              <h3 className="mb-1">{stats.totalArea}</h3>
              <p className="text-muted mb-0">Total Area (acres)</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100">
            <Card.Body className="text-center">
              <div className="mb-3 text-primary">
                <i className="fas fa-clock fa-2x"></i>
              </div>
              <h3 className="mb-1">{stats.pendingRequests}</h3>
              <p className="text-muted mb-0">Pending Requests</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100">
            <Card.Body className="text-center">
              <div className="mb-3 text-primary">
                <i className="fas fa-check-circle fa-2x"></i>
              </div>
              <h3 className="mb-1">{stats.completedServices}</h3>
              <p className="text-muted mb-0">Completed Services</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Service Requests</h5>
              <Button 
                as={Link} 
                to="/farmer/service-requests" 
                variant="outline-primary" 
                size="sm"
              >
                View All
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              {recentRequests.length > 0 ? (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead>
                      <tr>
                        <th>Field</th>
                        <th>Service Type</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Operator</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRequests.map(request => (
                        <tr key={request.id}>
                          <td>{request.field_name}</td>
                          <td>{request.service_type}</td>
                          <td>{request.scheduled_date}</td>
                          <td>{getStatusBadge(request.status)}</td>
                          <td>{request.operator_name || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No service requests found.</p>
                  <Button 
                    as={Link} 
                    to="/farmer/service-requests" 
                    variant="primary" 
                    size="sm"
                    className="mt-2"
                  >
                    Create Your First Request
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  onClick={handleShowAddFieldModal}
                >
                  <i className="fas fa-plus-circle me-2"></i> Add New Field
                </Button>
                <Button 
                  as={Link} 
                  to="/farmer/service-requests" 
                  variant="outline-primary"
                >
                  <i className="fas fa-drone me-2"></i> Request Drone Service
                </Button>
                <Button 
                  as={Link} 
                  to="/farmer/fields" 
                  variant="outline-primary"
                >
                  <i className="fas fa-map-marked-alt me-2"></i> Manage Fields
                </Button>
                <Button 
                  as={Link} 
                  to="/farmer/nearby-operators" 
                  variant="outline-primary"
                >
                  <i className="fas fa-search-location me-2"></i> Find Nearby Operators
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={6} className="mb-4 mb-md-0">
          <Weather showDetails={true} />
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Tips & Recommendations</h5>
            </Card.Header>
            <Card.Body>
              <div className="tips-list">
                <div className="tip-item d-flex mb-3">
                  <div className="tip-icon me-3">
                    <i className="fas fa-lightbulb text-warning"></i>
                  </div>
                  <div className="tip-content">
                    <h6 className="mb-1">Optimal Spraying Conditions</h6>
                    <p className="mb-0 text-muted">Schedule pesticide applications during low wind conditions for better coverage.</p>
                  </div>
                </div>
                <div className="tip-item d-flex mb-3">
                  <div className="tip-icon me-3">
                    <i className="fas fa-calendar-alt text-primary"></i>
                  </div>
                  <div className="tip-content">
                    <h6 className="mb-1">Plan Ahead</h6>
                    <p className="mb-0 text-muted">Book drone services at least 1 week in advance to ensure availability.</p>
                  </div>
                </div>
                <div className="tip-item d-flex">
                  <div className="tip-icon me-3">
                    <i className="fas fa-map-marked-alt text-success"></i>
                  </div>
                  <div className="tip-content">
                    <h6 className="mb-1">Field Mapping</h6>
                    <p className="mb-0 text-muted">Accurate field boundaries help optimize drone flight paths and coverage.</p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Add Field Modal */}
      <Modal show={showAddFieldModal} onHide={handleCloseAddFieldModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Field</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleAddField}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Field Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter field name"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the field"
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="area">
                  <Form.Label>Area (acres)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0.01"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="Field size in acres"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="crop_type">
                  <Form.Label>Crop Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="crop_type"
                    value={formData.crop_type}
                    onChange={handleChange}
                    placeholder="e.g., Wheat, Corn, etc."
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3" controlId="coordinates">
              <Form.Label>Field Location</Form.Label>
              <div className="location-input-container mb-2">
                <Form.Control
                  type="text"
                  name="coordinates"
                  value={formData.coordinates}
                  onChange={handleChange}
                  placeholder="Latitude, Longitude"
                  className="mb-2"
                />
                <Button 
                  variant="primary"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="w-100 d-flex align-items-center justify-content-center"
                >
                  {locationLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Detecting Location...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-map-marker-alt me-2"></i>
                      Use My Current Location
                    </>
                  )}
                </Button>
              </div>
              {formData.coordinates && (
                <div className="current-location-display p-2 bg-light rounded border mb-2">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    <span className="text-muted">Current location detected:</span>
                  </div>
                  <div className="mt-1 d-flex align-items-center">
                    <i className="fas fa-map-pin text-primary me-2"></i>
                    <strong>{formData.coordinates}</strong>
                  </div>
                </div>
              )}
              <Form.Text className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                Click "Use My Current Location" to automatically detect your position, or manually enter coordinates as "latitude, longitude"
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddFieldModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddField}>
            Add Field
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FarmerDashboard;
