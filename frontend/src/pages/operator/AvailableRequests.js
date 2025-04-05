import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Alert } from 'react-bootstrap';
import operatorService from '../../services/operatorService';

const AvailableRequests = ({ user }) => {
  const [availableRequests, setAvailableRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);

  useEffect(() => {
    const fetchAvailableRequests = async () => {
      try {
        setLoading(true);
        const requests = await operatorService.getAvailableRequests();
        setAvailableRequests(requests);
      } catch (err) {
        console.error('Error fetching available requests:', err);
        setError('Failed to load available requests. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableRequests();
  }, []);

  const handleShowDetails = async (request) => {
    try {
      // Get detailed information about the request
      const detailedRequest = await operatorService.getServiceRequest(request.id);
      setCurrentRequest(detailedRequest);
      setShowDetailsModal(true);
    } catch (err) {
      console.error('Error fetching request details:', err);
      alert('Failed to load request details. Please try again.');
    }
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setCurrentRequest(null);
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      setAcceptingId(requestId);
      // Accept the service request using the API
      await operatorService.acceptRequest(requestId);
      
      // Remove the accepted request from the available list
      const updatedRequests = availableRequests.filter(request => request.id !== requestId);
      setAvailableRequests(updatedRequests);
      
      if (showDetailsModal && currentRequest && currentRequest.id === requestId) {
        handleCloseDetails();
      }
    } catch (err) {
      console.error('Error accepting request:', err);
      alert('Failed to accept request. Please try again.');
    } finally {
      setAcceptingId(null);
    }
  };

  // Calculate estimated job details
  const calculateEstimatedDuration = (area) => {
    // Simple calculation: 1 hour per 10 acres
    return Math.ceil(area / 10);
  };

  const calculateEstimatedEarnings = (area, serviceType) => {
    // Base rate depends on service type
    let baseRate = 25; // Default rate per acre
    
    if (serviceType === 'pesticide') {
      baseRate = 30;
    } else if (serviceType === 'fertilizer') {
      baseRate = 25;
    } else if (serviceType === 'imaging') {
      baseRate = 20;
    } else if (serviceType === 'seeding') {
      baseRate = 35;
    }
    
    return Math.ceil(area * baseRate);
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
        <h1 className="dashboard-title">Available Service Requests</h1>
        <p className="dashboard-subtitle">Browse and accept new drone service opportunities</p>
      </div>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Available Requests</h5>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {availableRequests.length > 0 ? (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Farmer</th>
                    <th>Service Type</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {availableRequests.map(request => (
                    <tr key={request.id}>
                      <td>{request.field_name}</td>
                      <td>{request.farmer_name}</td>
                      <td>{request.service_type}</td>
                      <td>{request.scheduled_date}</td>
                      <td>{request.location || 'N/A'}</td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          className="me-2"
                          onClick={() => handleShowDetails(request)}
                        >
                          Details
                        </Button>
                        <Button 
                          variant="success" 
                          size="sm"
                          onClick={() => handleAcceptRequest(request.id)}
                          disabled={acceptingId === request.id}
                        >
                          {acceptingId === request.id ? 'Accepting...' : 'Accept'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-clipboard-check fs-1 text-muted mb-3"></i>
              <h5>No Available Requests</h5>
              <p className="text-muted">There are currently no pending service requests available.</p>
              <p className="text-muted">Check back later for new opportunities.</p>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Request Details Modal */}
      <Modal show={showDetailsModal} onHide={handleCloseDetails} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Service Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentRequest && (
            <Row>
              <Col md={6}>
                <h5 className="mb-3">Field Information</h5>
                <p><strong>Name:</strong> {currentRequest.field.name}</p>
                <p><strong>Area:</strong> {currentRequest.field.area} acres</p>
                <p><strong>Crop Type:</strong> {currentRequest.field.crop_type}</p>
                <p><strong>Location:</strong> {currentRequest.field.location || 'Not specified'}</p>
              </Col>
              <Col md={6}>
                <h5 className="mb-3">Service Information</h5>
                <p><strong>Service Type:</strong> {currentRequest.service_request.service_type}</p>
                <p><strong>Scheduled Date:</strong> {currentRequest.service_request.scheduled_date}</p>
                <p><strong>Farmer:</strong> {currentRequest.service_request.farmer_name}</p>
                <p><strong>Notes:</strong> {currentRequest.service_request.notes || 'No notes provided'}</p>
              </Col>
              <Col xs={12} className="mt-3">
                <div className="border rounded p-3 bg-light">
                  <h6 className="mb-2">Estimated Job Details</h6>
                  <Row>
                    <Col sm={4}>
                      <p className="mb-1"><strong>Duration:</strong></p>
                      <p className="text-muted">~{calculateEstimatedDuration(currentRequest.field.area)} hours</p>
                    </Col>
                    <Col sm={4}>
                      <p className="mb-1"><strong>Distance:</strong></p>
                      <p className="text-muted">Calculating...</p>
                    </Col>
                    <Col sm={4}>
                      <p className="mb-1"><strong>Estimated Earnings:</strong></p>
                      <p className="text-success fw-bold">
                        ${calculateEstimatedEarnings(
                          currentRequest.field.area, 
                          currentRequest.service_request.service_type
                        )}
                      </p>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetails}>
            Close
          </Button>
          <Button 
            variant="success" 
            onClick={() => currentRequest && handleAcceptRequest(currentRequest.service_request.id)}
            disabled={acceptingId !== null}
          >
            {acceptingId !== null ? 'Accepting...' : 'Accept Request'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AvailableRequests;
