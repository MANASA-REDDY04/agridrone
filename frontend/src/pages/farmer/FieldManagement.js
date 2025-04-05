import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, ListGroup, Alert } from 'react-bootstrap';
import farmerService from '../../services/farmerService';

const FieldManagement = ({ user }) => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [error, setError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    area: '',
    crop_type: '',
    coordinates: ''
  });

  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoading(true);
        const fieldsData = await farmerService.getFields();
        setFields(fieldsData);
      } catch (err) {
        console.error('Error fetching fields:', err);
        setError('Failed to load fields. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  const handleShowAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCurrentField(null);
    resetForm();
  };

  const handleShowEditModal = (field) => {
    setCurrentField(field);
    setFormData({
      name: field.name,
      description: field.description,
      area: field.area,
      crop_type: field.crop_type,
      coordinates: field.coordinates
    });
    setShowEditModal(true);
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
      const response = await farmerService.createField({
        ...formData,
        area: parseFloat(formData.area)
      });
      
      // Add the new field to the state
      setFields([...fields, response.field]);
      handleCloseAddModal();
    } catch (err) {
      setError(err.error || 'Failed to create field. Please try again.');
    }
  };

  const handleEditField = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      // Update field using the API
      const response = await farmerService.updateField(currentField.id, {
        ...formData,
        area: parseFloat(formData.area)
      });
      
      // Update the fields state
      const updatedFields = fields.map(field => {
        if (field.id === currentField.id) {
          return response.field;
        }
        return field;
      });
      
      setFields(updatedFields);
      handleCloseEditModal();
    } catch (err) {
      setError(err.error || 'Failed to update field. Please try again.');
    }
  };

  const handleDeleteField = async (fieldId) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      try {
        // Delete field using the API
        await farmerService.deleteField(fieldId);
        
        // Update the fields state
        const updatedFields = fields.filter(field => field.id !== fieldId);
        setFields(updatedFields);
      } catch (err) {
        console.error('Error deleting field:', err);
        alert('Failed to delete field. Please try again.');
      }
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
        
        // Create a simple polygon around the current point (approximately 100m square)
        // This is a simplified approach - in a real app, you might want to use a map to draw the actual field boundaries
        const offset = 0.001; // roughly 100 meters at the equator
        const polygonCoords = [
          [latitude - offset, longitude - offset],
          [latitude - offset, longitude + offset],
          [latitude + offset, longitude + offset],
          [latitude + offset, longitude - offset],
          [latitude - offset, longitude - offset] // Close the polygon
        ];
        
        setFormData({
          ...formData,
          coordinates: JSON.stringify(polygonCoords)
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="dashboard-title">Field Management</h1>
            <p className="dashboard-subtitle">Manage your farm fields</p>
          </div>
          <Button variant="primary" onClick={handleShowAddModal}>
            <i className="fas fa-plus-circle me-2"></i> Add New Field
          </Button>
        </div>
      </div>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      
      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Your Fields</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {fields.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No fields found. Add your first field to get started.</p>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {fields.map(field => (
                    <ListGroup.Item key={field.id} className="field-list-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="field-info">
                          <h5 className="field-name">{field.name}</h5>
                          <p className="mb-1">{field.description}</p>
                          <div className="field-details">
                            <span className="me-3"><i className="fas fa-ruler-combined me-1"></i> {field.area} acres</span>
                            <span><i className="fas fa-seedling me-1"></i> {field.crop_type}</span>
                          </div>
                        </div>
                        <div className="field-actions">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            className="me-2"
                            onClick={() => handleShowEditModal(field)}
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDeleteField(field.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Field Statistics</h5>
            </Card.Header>
            <Card.Body>
              <div className="stat-item mb-3">
                <div className="d-flex justify-content-between">
                  <span>Total Fields:</span>
                  <strong>{fields.length}</strong>
                </div>
              </div>
              <div className="stat-item mb-3">
                <div className="d-flex justify-content-between">
                  <span>Total Area:</span>
                  <strong>{fields.reduce((sum, field) => sum + parseFloat(field.area), 0).toFixed(2)} acres</strong>
                </div>
              </div>
              <div className="stat-item">
                <div className="d-flex justify-content-between">
                  <span>Crop Types:</span>
                  <strong>{new Set(fields.map(field => field.crop_type)).size}</strong>
                </div>
              </div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Tips</h5>
            </Card.Header>
            <Card.Body>
              <p className="mb-2">
                <i className="fas fa-info-circle me-2 text-primary"></i>
                Add all your fields to manage them efficiently.
              </p>
              <p className="mb-2">
                <i className="fas fa-info-circle me-2 text-primary"></i>
                Keep field information up to date for accurate service requests.
              </p>
              <p className="mb-0">
                <i className="fas fa-info-circle me-2 text-primary"></i>
                You can create service requests for any of your registered fields.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Add Field Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
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
              <Form.Label>Field Coordinates (GeoJSON)</Form.Label>
              <div className="d-flex mb-2">
                <Button 
                  variant="outline-primary" 
                  onClick={getCurrentLocation} 
                  className="me-2"
                  disabled={locationLoading}
                >
                  {locationLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-map-marker-alt me-2"></i>
                      Use Current Location
                    </>
                  )}
                </Button>
              </div>
              <Form.Control
                as="textarea"
                rows={3}
                name="coordinates"
                value={formData.coordinates}
                onChange={handleChange}
                placeholder="[[lat, lng], [lat, lng], ...]"
              />
              <Form.Text className="text-muted">
                Enter coordinates as a GeoJSON polygon array or use your current location
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddField}>
            Add Field
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Edit Field Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Field</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleEditField}>
            <Form.Group className="mb-3" controlId="edit-name">
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
            
            <Form.Group className="mb-3" controlId="edit-description">
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
                <Form.Group className="mb-3" controlId="edit-area">
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
                <Form.Group className="mb-3" controlId="edit-crop_type">
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
            
            <Form.Group className="mb-3" controlId="edit-coordinates">
              <Form.Label>Field Coordinates (GeoJSON)</Form.Label>
              <div className="d-flex mb-2">
                <Button 
                  variant="outline-primary" 
                  onClick={getCurrentLocation} 
                  className="me-2"
                  disabled={locationLoading}
                >
                  {locationLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-map-marker-alt me-2"></i>
                      Use Current Location
                    </>
                  )}
                </Button>
              </div>
              <Form.Control
                as="textarea"
                rows={3}
                name="coordinates"
                value={formData.coordinates}
                onChange={handleChange}
                placeholder="[[lat, lng], [lat, lng], ...]"
              />
              <Form.Text className="text-muted">
                Enter coordinates as a GeoJSON polygon array or use your current location
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditField}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FieldManagement;
