import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form, Modal, Alert } from 'react-bootstrap';
import adminService from '../../services/adminService';

const UserManagement = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    is_premium: false
  });
  const [filterRole, setFilterRole] = useState('all');
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersData = await adminService.getUsers();
        setUsers(usersData);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCurrentUser(null);
    setError('');
  };

  const handleShowEditModal = (user) => {
    setCurrentUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      is_premium: user.is_premium
    });
    setShowEditModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    try {
      setUpdating(true);
      setError('');
      // Update user using the API
      const response = await adminService.updateUser(currentUser.id, formData);
      
      // Update the users state
      const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) {
          return response.user;
        }
        return user;
      });
      
      setUsers(updatedUsers);
      handleCloseEditModal();
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.error || 'Failed to update user. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        setDeleting(userId);
        // Delete user using the API
        await adminService.deleteUser(userId);
        
        // Update the users state
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user. Please try again.');
      } finally {
        setDeleting(null);
      }
    }
  };

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

  // Filter users based on selected role
  const filteredUsers = filterRole === 'all' 
    ? users 
    : users.filter(user => user.role === filterRole);

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
            <h1 className="dashboard-title">User Management</h1>
            <p className="dashboard-subtitle">Manage platform users</p>
          </div>
        </div>
      </div>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Users</h5>
            <Form.Select 
              size="sm" 
              style={{ width: 'auto' }}
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="farmer">Farmers</option>
              <option value="operator">Operators</option>
              <option value="admin">Admins</option>
            </Form.Select>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted mb-0">No users found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Premium</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>{`${user.first_name} ${user.last_name}`}</td>
                      <td>{user.email}</td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>
                        {user.is_premium ? 
                          <Badge bg="warning">Premium</Badge> : 
                          <Badge bg="secondary">Standard</Badge>
                        }
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          className="me-2"
                          onClick={() => handleShowEditModal(user)}
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={deleting === user.id || user.id === currentUser?.id}
                        >
                          {deleting === user.id ? 
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 
                            <i className="fas fa-trash"></i>
                          }
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleUpdateUser}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="first_name">
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
                <Form.Group className="mb-3" controlId="last_name">
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
            
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="role">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="farmer">Farmer</option>
                <option value="operator">Operator</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="is_premium">
              <Form.Check
                type="checkbox"
                label="Premium User"
                name="is_premium"
                checked={formData.is_premium}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleUpdateUser}
            disabled={updating}
          >
            {updating ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserManagement;
