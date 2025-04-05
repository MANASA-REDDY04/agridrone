import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Table, Badge, Form, Modal, Alert } from 'react-bootstrap';
import farmerService from '../../services/farmerService';

const ServiceRequests = ({ user }) => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    field_id: '',
    service_type: 'pesticide',
    scheduled_date: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch fields and service requests in parallel
        const [fieldsData, requestsData] = await Promise.all([
          farmerService.getFields(),
          farmerService.getServiceRequests()
        ]);
        
        setFields(fieldsData);
        setServiceRequests(requestsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  const handleShowAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      field_id: '',
      service_type: 'pesticide',
      scheduled_date: '',
      notes: ''
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

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleAddRequest = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      // Create new service request using the API
      const response = await farmerService.createServiceRequest(formData);
      
      // Add the new request to the state
      setServiceRequests([response.service_request, ...serviceRequests]);
      handleCloseAddModal();
    } catch (err) {
      setError(err.error || 'Failed to create service request. Please try again.');
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      // Cancel the service request using the API
      await farmerService.cancelServiceRequest(requestId);
      
      // Update the local state
      const updatedRequests = serviceRequests.map(request => {
        if (request.id === requestId) {
          return { ...request, status: 'cancelled' };
        }
        return request;
      });
      
      setServiceRequests(updatedRequests);
    } catch (err) {
      console.error('Error cancelling request:', err);
      alert('Failed to cancel request. Please try again.');
    }
  };

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

  // Filter service requests based on status
  const filteredRequests = statusFilter === 'all' 
    ? serviceRequests 
    : serviceRequests.filter(request => request.status === statusFilter);

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
            <h1 className="dashboard-title">Service Requests</h1>
            <p className="dashboard-subtitle">Manage your drone service requests</p>
          </div>
          <Button variant="primary" onClick={handleShowAddModal}>
            <i className="fas fa-plus-circle me-2"></i> New Service Request
          </Button>
        </div>
      </div>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Your Service Requests</h5>
            <div>
              <Form.Select 
                size="sm" 
                className="d-inline-block" 
                style={{ width: 'auto' }}
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted mb-0">No service requests found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Service Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Operator</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map(request => (
                    <tr key={request.id}>
                      <td>{request.field_name}</td>
                      <td>{request.service_type}</td>
                      <td>{request.scheduled_date}</td>
                      <td>{getStatusBadge(request.status)}</td>
                      <td>{request.operator_name || '-'}</td>
                      <td>
                        {request.notes ? 
                          (request.notes.length > 30 ? 
                            `${request.notes.substring(0, 30)}...` : 
                            request.notes) : 
                          '-'}
                      </td>
                      <td>
                        {request.status === 'pending' && (
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleCancelRequest(request.id)}
                          >
                            Cancel
                          </Button>
                        )}
                        {request.status === 'completed' && (
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                          >
                            Review
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Add Service Request Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>New Service Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleAddRequest}>
            <Form.Group className="mb-3" controlId="field_id">
              <Form.Label>Select Field</Form.Label>
              <Form.Select 
                name="field_id"
                value={formData.field_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a field</option>
                {fields.map(field => (
                  <option key={field.id} value={field.id}>
                    {field.name} ({field.crop_type})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="service_type">
              <Form.Label>Service Type</Form.Label>
              <Form.Select
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                required
              >
                <option value="pesticide">Pesticide Spraying</option>
                <option value="fertilizer">Fertilizer Application</option>
                <option value="imaging">Field Imaging</option>
                <option value="seeding">Precision Seeding</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="scheduled_date">
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
            
            <Form.Group className="mb-3" controlId="notes">
              <Form.Label>Notes (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any special instructions or requirements"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddRequest}>
            Create Request
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ServiceRequests;
