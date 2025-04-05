import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    farmers: 0,
    operators: 0,
    pendingRequests: 0,
    completedServices: 0
  });
  
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch users and service requests in parallel
        const [users, serviceRequests] = await Promise.all([
          adminService.getUsers(),
          adminService.getServiceRequests()
        ]);
        
        // Calculate stats
        const farmers = users.filter(user => user.role === 'farmer').length;
        const operators = users.filter(user => user.role === 'operator').length;
        const pendingRequests = serviceRequests.filter(req => req.status === 'pending').length;
        const completedServices = serviceRequests.filter(req => req.status === 'completed').length;
        
        setStats({
          totalUsers: users.length,
          farmers,
          operators,
          pendingRequests,
          completedServices
        });
        
        // Get the most recent users (up to 5)
        const sortedUsers = [...users].sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        }).slice(0, 5);
        
        setRecentUsers(sortedUsers);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to get role badge
  const getRoleBadge = (role) => {
    switch (role) {
      case 'farmer':
        return <Badge bg="success">Farmer</Badge>;
      case 'operator':
        return <Badge bg="info">Operator</Badge>;
      case 'admin':
        return <Badge bg="danger">Admin</Badge>;
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

  return (
    <Container className="py-4">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">Platform overview and management</p>
      </div>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      
      <Row className="dashboard-stats">
        <Col md={4} sm={6} className="mb-3">
          <Card className="h-100">
            <Card.Body className="text-center">
              <div className="mb-3 text-primary">
                <i className="fas fa-users fa-2x"></i>
              </div>
              <h3 className="mb-1">{stats.totalUsers}</h3>
              <p className="text-muted mb-0">Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={6} className="mb-3">
          <Card className="h-100">
            <Card.Body className="text-center">
              <div className="mb-3 text-primary">
                <i className="fas fa-user-tie fa-2x"></i>
              </div>
              <h3 className="mb-1">{stats.farmers}</h3>
              <p className="text-muted mb-0">Farmers</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={6} className="mb-3">
          <Card className="h-100">
            <Card.Body className="text-center">
              <div className="mb-3 text-primary">
                <i className="fas fa-drone fa-2x"></i>
              </div>
              <h3 className="mb-1">{stats.operators}</h3>
              <p className="text-muted mb-0">Drone Operators</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} sm={6} className="mb-3">
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
        <Col md={6} sm={6} className="mb-3">
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
        <Col lg={12}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Users</h5>
              <Button 
                as={Link} 
                to="/admin/users" 
                variant="outline-primary" 
                size="sm"
              >
                Manage Users
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              {recentUsers.length > 0 ? (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Premium</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map(user => (
                        <tr key={user.id}>
                          <td>{`${user.first_name} ${user.last_name}`}</td>
                          <td>{user.email}</td>
                          <td>{getRoleBadge(user.role)}</td>
                          <td>{new Date(user.created_at).toLocaleDateString()}</td>
                          <td>{user.is_premium ? 
                            <Badge bg="warning">Premium</Badge> : 
                            <Badge bg="light" text="dark">Free</Badge>}
                          </td>
                          <td>
                            <Button 
                              as={Link}
                              to={`/admin/users/edit/${user.id}`}
                              variant="outline-primary" 
                              size="sm"
                              className="me-2"
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No users found.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={6} className="mb-4 mb-md-0">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button 
                  as={Link} 
                  to="/admin/users/new" 
                  variant="primary"
                >
                  <i className="fas fa-user-plus me-2"></i> Add New User
                </Button>
                <Button 
                  as={Link} 
                  to="/admin/service-requests" 
                  variant="outline-primary"
                >
                  <i className="fas fa-clipboard-list me-2"></i> Manage Service Requests
                </Button>
                <Button 
                  as={Link} 
                  to="/admin/reports" 
                  variant="outline-primary"
                >
                  <i className="fas fa-chart-bar me-2"></i> View Reports
                </Button>
                <Button 
                  as={Link} 
                  to="/admin/settings" 
                  variant="outline-primary"
                >
                  <i className="fas fa-cog me-2"></i> System Settings
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">System Status</h5>
            </Card.Header>
            <Card.Body>
              <div className="system-status">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h6 className="mb-0">API Server</h6>
                    <small className="text-muted">Backend Services</small>
                  </div>
                  <Badge bg="success">Operational</Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h6 className="mb-0">Database</h6>
                    <small className="text-muted">Data Storage</small>
                  </div>
                  <Badge bg="success">Operational</Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h6 className="mb-0">Authentication</h6>
                    <small className="text-muted">User Access</small>
                  </div>
                  <Badge bg="success">Operational</Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">File Storage</h6>
                    <small className="text-muted">Documents & Images</small>
                  </div>
                  <Badge bg="success">Operational</Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
