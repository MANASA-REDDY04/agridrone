import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import farmerService from '../../services/farmerService';

const ServiceRequestForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedOperatorId = location.state?.selectedOperatorId;

  const [loading, setLoading] = useState(false);
  const [loadingOperator, setLoadingOperator] = useState(true);
  const [loadingFields, setLoadingFields] = useState(true);
  const [error, setError] = useState(null);
  const [operator, setOperator] = useState(null);
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({
    field_id: '',
    service_type: 'spraying',
    scheduled_date: '',
    notes: '',
    estimated_hours: 1
  });

  // Fetch operator details
  useEffect(() => {
    const fetchOperator = async () => {
      if (!selectedOperatorId) {
        navigate('/farmer/nearby-operators');
        return;
      }

      try {
        setLoadingOperator(true);
        const operatorData = await farmerService.getOperatorById(selectedOperatorId);
        setOperator(operatorData);
      } catch (err) {
        console.error('Error fetching operator details:', err);
        setError('Failed to load operator details. Please try again.');
      } finally {
        setLoadingOperator(false);
      }
    };

    fetchOperator();
  }, [selectedOperatorId, navigate]);

  // Fetch farmer's fields
  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoadingFields(true);
        const fieldsData = await farmerService.getFields();
        setFields(fieldsData);
        
        // Set default field if available
        if (fieldsData.length > 0) {
          setFormData(prev => ({
            ...prev,
            field_id: fieldsData[0].id
          }));
        }
      } catch (err) {
        console.error('Error fetching fields:', err);
        setError('Failed to load your fields. Please try again.');
      } finally {
        setLoadingFields(false);
      }
    };

    fetchFields();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimated_hours' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Add operator_id to the form data
      const requestData = {
        ...formData,
        operator_id: selectedOperatorId
      };

      await farmerService.createServiceRequest(requestData);
      navigate('/farmer/service-requests', { 
        state: { 
          success: 'Service request submitted successfully!' 
        } 
      });
    } catch (err) {
      console.error('Error creating service request:', err);
      setError(err.response?.data?.error || 'Failed to create service request. Please try again.');
      setLoading(false);
    }
  };

  // Calculate estimated cost
  const calculateEstimatedCost = () => {
    if (!operator || !formData.estimated_hours) return 0;
    return operator.hourly_rate * formData.estimated_hours;
  };

  // Format coordinates as a readable address
  const formatCoordinates = (lat, lng) => {
    if (lat && lng) {
      return `Lat: ${lat.toFixed(6)}, Long: ${lng.toFixed(6)}`;
    }
    return 'Location not available';
  };

  if (loadingOperator || loadingFields) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading service request details...</p>
      </Container>
    );
  }

  if (!operator) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          Operator not found or could not be loaded. Please try selecting another operator.
        </Alert>
        <Button 
          variant="primary" 
          onClick={() => navigate('/farmer/nearby-operators')}
          className="mt-3"
        >
          Back to Nearby Operators
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="dashboard-header">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="dashboard-title">Request Drone Service</h1>
            <p className="dashboard-subtitle">Create a new service request with {operator.first_name} {operator.last_name}</p>
          </div>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Operator Details</h5>
            </Card.Header>
            <Card.Body>
              <h6>{operator.first_name} {operator.last_name}</h6>
              <p className="mb-2"><strong>Phone:</strong> {operator.phone || 'Not provided'}</p>
              <p className="mb-2"><strong>Location:</strong> {formatCoordinates(operator.latitude, operator.longitude)}</p>
              <p className="mb-2"><strong>Service Radius:</strong> {operator.service_radius} km</p>
              <p className="mb-2"><strong>Hourly Rate:</strong> ₹{operator.hourly_rate ? operator.hourly_rate.toFixed(2) : '0.00'}/hour</p>
              
              {operator.service_details && (
                <div className="mt-3">
                  <h6>Service Details:</h6>
                  <p className="small text-muted">{operator.service_details}</p>
                </div>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Cost Estimate</h5>
            </Card.Header>
            <Card.Body>
              <p className="mb-2"><strong>Hourly Rate:</strong> ₹{operator.hourly_rate ? operator.hourly_rate.toFixed(2) : '0.00'}</p>
              <p className="mb-2"><strong>Estimated Hours:</strong> {formData.estimated_hours}</p>
              <hr />
              <p className="mb-0 fw-bold">Estimated Total: ₹{calculateEstimatedCost().toFixed(2)}</p>
              <small className="text-muted">Final cost may vary based on actual service duration</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Service Request Details</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Field</Form.Label>
                  {fields.length > 0 ? (
                    <Form.Select
                      name="field_id"
                      value={formData.field_id}
                      onChange={handleChange}
                      required
                    >
                      {fields.map(field => (
                        <option key={field.id} value={field.id}>
                          {field.name} ({field.area} acres, {field.crop_type || 'No crop specified'})
                        </option>
                      ))}
                    </Form.Select>
                  ) : (
                    <div className="text-center py-3">
                      <p>You don't have any fields registered.</p>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => navigate('/farmer/fields')}
                      >
                        Add a Field
                      </Button>
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Service Type</Form.Label>
                  <Form.Select
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="spraying">Pesticide Spraying</option>
                    <option value="fertilizing">Fertilizer Application</option>
                    <option value="imaging">Field Imaging/Monitoring</option>
                    <option value="mapping">Field Mapping</option>
                    <option value="other">Other (specify in notes)</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Scheduled Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="scheduled_date"
                    value={formData.scheduled_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Estimated Hours Needed</Form.Label>
                  <Form.Control
                    type="number"
                    name="estimated_hours"
                    min="1"
                    step="0.5"
                    value={formData.estimated_hours}
                    onChange={handleChange}
                    required
                  />
                  <Form.Text className="text-muted">
                    Estimate how many hours you think the service will take. This will affect the cost estimate.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Additional Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any specific requirements or details about the service..."
                  />
                </Form.Group>

                <div className="d-flex justify-content-between mt-4">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate('/farmer/nearby-operators')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={loading || fields.length === 0}
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
                        Submitting...
                      </>
                    ) : 'Submit Request'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ServiceRequestForm;
