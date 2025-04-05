import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form, Modal, Alert } from 'react-bootstrap';
import adminService from '../../services/adminService';

const AdminServiceRequests = ({ user }) => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch service requests and operators in parallel
      const [requests, operatorsData] = await Promise.all([
        adminService.getServiceRequests(),
        adminService.getOperators()
      ]);
      
      setServiceRequests(requests);
      setOperators(operatorsData);
      setError('');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.error || 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setCurrentRequest(null);
    setSelectedOperator('');
  };

  const handleShowAssignModal = (request) => {
    setCurrentRequest(request);
    setSelectedOperator('');
    setShowAssignModal(true);
  };

  const handleAssignOperator = async () => {
    try {
      setError('');
      
      if (!selectedOperator) {
        setError('Please select an operator to assign.');
        return;
      }
      
      await adminService.assignOperatorToRequest(currentRequest.id, parseInt(selectedOperator));
      
      // Refresh the service requests list
      const updatedRequests = await adminService.getServiceRequests();
      setServiceRequests(updatedRequests);
      
      handleCloseAssignModal();
    } catch (err) {
      console.error('Error assigning operator:', err);
      setError(err.error || 'Failed to assign operator. Please try again.');
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      setError('');
      await adminService.cancelServiceRequest(requestId);
      
      // Refresh the service requests list
      const updatedRequests = await adminService.getServiceRequests();
      setServiceRequests(updatedRequests);
    } catch (err) {
      console.error('Error cancelling request:', err);
      setError(err.error || 'Failed to cancel request. Please try again.');
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

  // Filter service requests based on selected status
  const filteredRequests = filterStatus === 'all' 
    ? serviceRequests 
    : serviceRequests.filter(request => request.status === filterStatus);

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
            <p className="dashboard-subtitle">Manage all drone service requests</p>
          </div>
        </div>
      </div>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-clipboard-list"></i>
            </div>
            <h3 className="stat-value">
              {serviceRequests.filter(r => r.status === 'pending').length}
            </h3>
            <p className="stat-label">Pending</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-tasks"></i>
            </div>
            <h3 className="stat-value">
              {serviceRequests.filter(r => r.status === 'accepted').length}
            </h3>
            <p className="stat-label">Accepted</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3 className="stat-value">
              {serviceRequests.filter(r => r.status === 'completed').length}
            </h3>
            <p className="stat-label">Completed</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-times-circle"></i>
            </div>
            <h3 className="stat-value">
              {serviceRequests.filter(r => r.status === 'cancelled').length}
            </h3>
            <p className="stat-label">Cancelled</p>
          </Card>
        </Col>
      </Row>
      
      <Card className="mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Service Requests</h5>
            <Form.Select 
              className="status-filter" 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Form.Select>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredRequests.length > 0 ? (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Field</th>
                    <th>Farmer</th>
                    <th>Service Type</th>
                    <th>Date</th>
                    <th>Operator</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map(request => (
                    <tr key={request.id}>
                      <td>{request.id}</td>
                      <td>{request.field_name}</td>
                      <td>{request.farmer_name}</td>
                      <td>{request.service_type}</td>
                      <td>{request.scheduled_date}</td>
                      <td>{request.operator_name || '-'}</td>
                      <td>{getStatusBadge(request.status)}</td>
                      <td>
                        {request.status === 'pending' && (
                          <>
                            <Button 
                              variant="primary" 
                              size="sm"
                              className="me-2"
                              onClick={() => handleShowAssignModal(request)}
                            >
                              Assign
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => handleCancelRequest(request.id)}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {request.status === 'accepted' && (
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleCancelRequest(request.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted mb-0">No service requests found with the selected filter.</p>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Assign Operator Modal */}
      <Modal show={showAssignModal} onHide={handleCloseAssignModal}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Operator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {currentRequest && (
            <div className="mb-3">
              <p><strong>Field:</strong> {currentRequest.field_name}</p>
              <p><strong>Farmer:</strong> {currentRequest.farmer_name}</p>
              <p><strong>Service Type:</strong> {currentRequest.service_type}</p>
              <p><strong>Date:</strong> {currentRequest.scheduled_date}</p>
              {currentRequest.notes && (
                <p><strong>Notes:</strong> {currentRequest.notes}</p>
              )}
            </div>
          )}
          
          <Form.Group controlId="operatorSelect">
            <Form.Label>Select Operator</Form.Label>
            <Form.Select 
              value={selectedOperator}
              onChange={(e) => setSelectedOperator(e.target.value)}
              required
            >
              <option value="">Select an operator...</option>
              {operators.map(operator => (
                <option key={operator.id} value={operator.id}>
                  {operator.first_name} {operator.last_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAssignModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAssignOperator}>
            Assign Operator
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminServiceRequests;
