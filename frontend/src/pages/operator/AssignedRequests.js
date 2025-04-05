import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Table, Badge, Modal, Form, Alert } from 'react-bootstrap';
import operatorService from '../../services/operatorService';

const AssignedRequests = ({ user }) => {
  const [assignedRequests, setAssignedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const fetchAssignedRequests = async () => {
      try {
        setLoading(true);
        const requests = await operatorService.getAssignedRequests();
        setAssignedRequests(requests);
      } catch (err) {
        console.error('Error fetching assigned requests:', err);
        setError('Failed to load assigned requests. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedRequests();
  }, []);

  const handleShowCompleteModal = (request) => {
    setCurrentRequest(request);
    setCompletionNotes('');
    setShowCompleteModal(true);
  };

  const handleCloseCompleteModal = () => {
    setShowCompleteModal(false);
    setCurrentRequest(null);
    setCompletionNotes('');
  };

  const handleCompleteRequest = async () => {
    try {
      setCompleting(true);
      // Complete the service request using the API
      await operatorService.completeRequest(currentRequest.id);
      
      // Update the local state
      const updatedRequests = assignedRequests.map(request => {
        if (request.id === currentRequest.id) {
          return {
            ...request,
            status: 'completed',
            completion_notes: completionNotes
          };
        }
        return request;
      });
      
      setAssignedRequests(updatedRequests);
      handleCloseCompleteModal();
    } catch (err) {
      console.error('Error completing request:', err);
      setError('Failed to complete request. Please try again.');
    } finally {
      setCompleting(false);
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

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  // Filter requests by status
  const activeRequests = assignedRequests.filter(request => request.status === 'accepted');
  const completedRequests = assignedRequests.filter(request => request.status === 'completed');

  return (
    <Container className="py-4">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Assigned Requests</h1>
        <p className="dashboard-subtitle">Manage your accepted drone service requests</p>
      </div>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Active Requests</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {activeRequests.length > 0 ? (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Farmer</th>
                    <th>Service Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeRequests.map(request => (
                    <tr key={request.id}>
                      <td>{request.field_name}</td>
                      <td>{request.farmer_name}</td>
                      <td>{request.service_type}</td>
                      <td>{request.scheduled_date}</td>
                      <td>{getStatusBadge(request.status)}</td>
                      <td>
                        <Button 
                          variant="success" 
                          size="sm"
                          onClick={() => handleShowCompleteModal(request)}
                        >
                          Mark Complete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="mb-0">No active requests at the moment.</p>
            </div>
          )}
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header>
          <h5 className="mb-0">Completed Requests</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {completedRequests.length > 0 ? (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Farmer</th>
                    <th>Service Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Completion Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {completedRequests.map(request => (
                    <tr key={request.id}>
                      <td>{request.field_name}</td>
                      <td>{request.farmer_name}</td>
                      <td>{request.service_type}</td>
                      <td>{request.scheduled_date}</td>
                      <td>{getStatusBadge(request.status)}</td>
                      <td>{request.completion_notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="mb-0">No completed requests yet.</p>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Complete Request Modal */}
      <Modal show={showCompleteModal} onHide={handleCloseCompleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Mark Request as Completed</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentRequest && (
            <>
              <p>
                You are about to mark the following service request as completed:
              </p>
              <ul className="mb-3">
                <li><strong>Field:</strong> {currentRequest.field_name}</li>
                <li><strong>Service Type:</strong> {currentRequest.service_type}</li>
                <li><strong>Scheduled Date:</strong> {currentRequest.scheduled_date}</li>
              </ul>
              
              <Form.Group className="mb-3">
                <Form.Label>Completion Notes (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder="Add any notes about the service completion"
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCompleteModal}>
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handleCompleteRequest}
            disabled={completing}
          >
            {completing ? 'Submitting...' : 'Confirm Completion'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AssignedRequests;
