import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import operatorService from '../../services/operatorService';
import Weather from '../../components/Weather';

const OperatorDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    availableRequests: 0,
    assignedRequests: 0,
    completedServices: 0
  });
  
  const [assignedRequests, setAssignedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch available and assigned requests in parallel
        const [availableRequests, assignedRequestsData] = await Promise.all([
          operatorService.getAvailableRequests(),
          operatorService.getAssignedRequests()
        ]);
        
        // Calculate stats
        const completedServices = assignedRequestsData.filter(req => req.status === 'completed').length;
        
        setStats({
          availableRequests: availableRequests.length,
          assignedRequests: assignedRequestsData.filter(req => req.status === 'accepted').length,
          completedServices
        });
        
        // Get the most recent assigned requests (up to 5)
        const sortedRequests = [...assignedRequestsData]
          .filter(req => req.status === 'accepted')
          .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date))
          .slice(0, 5);
        
        setAssignedRequests(sortedRequests);
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

  const handleMarkComplete = async (requestId) => {
    try {
      setError('');
      await operatorService.completeServiceRequest(requestId);
      
      // Update the UI by removing the completed request from the list
      setAssignedRequests(prevRequests => 
        prevRequests.filter(req => req.id !== requestId)
      );
      
      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        assignedRequests: prevStats.assignedRequests - 1,
        completedServices: prevStats.completedServices + 1
      }));
    } catch (err) {
      console.error('Error completing service request:', err);
      setError(err.error || 'Failed to complete service request. Please try again.');
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

  return (
    <Container className="py-4">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome, {user?.first_name || 'Operator'}</h1>
        <p className="dashboard-subtitle">Here's an overview of your drone operations</p>
      </div>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      
      <Row className="dashboard-stats">
        <Col md={4} className="mb-3">
          <Card className="h-100">
            <Card.Body className="text-center">
              <div className="mb-3 text-primary">
                <i className="fas fa-clipboard-list fa-2x"></i>
              </div>
              <h3 className="mb-1">{stats.availableRequests}</h3>
              <p className="text-muted mb-0">Available Requests</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="h-100">
            <Card.Body className="text-center">
              <div className="mb-3 text-primary">
                <i className="fas fa-tasks fa-2x"></i>
              </div>
              <h3 className="mb-1">{stats.assignedRequests}</h3>
              <p className="text-muted mb-0">Assigned Requests</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
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
        <Col md={12}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Your Assigned Requests</h5>
              <div>
                <Button 
                  as={Link} 
                  to="/operator/available-requests" 
                  variant="outline-primary" 
                  size="sm"
                  className="me-2"
                >
                  View Available
                </Button>
                <Button 
                  as={Link} 
                  to="/operator/assigned-requests" 
                  variant="outline-primary" 
                  size="sm"
                >
                  View All Assigned
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {assignedRequests.length > 0 ? (
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
                      {assignedRequests.map(request => (
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
                              onClick={() => handleMarkComplete(request.id)}
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
                  <p className="text-muted mb-0">No assigned requests found.</p>
                  <Button 
                    as={Link} 
                    to="/operator/available-requests" 
                    variant="primary" 
                    size="sm"
                    className="mt-2"
                  >
                    View Available Requests
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={6} className="mb-4">
          <Weather showDetails={true} />
        </Col>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Equipment Status</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-0">DJI Agras T30</h6>
                  <small className="text-muted">Spraying Drone</small>
                </div>
                <Badge bg="success">Ready</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-0">DJI Phantom 4 RTK</h6>
                  <small className="text-muted">Mapping Drone</small>
                </div>
                <Badge bg="success">Ready</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Spraying Equipment</h6>
                  <small className="text-muted">Tanks & Pumps</small>
                </div>
                <Badge bg="success">Ready</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Upcoming Schedule</h5>
            </Card.Header>
            <Card.Body>
              {assignedRequests.length > 0 ? (
                <div className="schedule-list">
                  {assignedRequests.map(request => (
                    <div key={request.id} className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h6 className="mb-0">{request.field_name}</h6>
                        <small className="text-muted">{request.service_type} - {request.farmer_name}</small>
                      </div>
                      <div className="text-end">
                        <div>{request.scheduled_date}</div>
                        <small className="text-muted">Scheduled</small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted mb-0">No upcoming services scheduled.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OperatorDashboard;
