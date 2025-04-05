import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import adminService from '../../services/adminService';

const UserForm = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const isEditMode = !!userId;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'farmer',
    is_premium: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const userData = await adminService.getUser(userId);
          // Remove password as it shouldn't be pre-filled
          const { password, ...userDataWithoutPassword } = userData;
          setFormData(userDataWithoutPassword);
        } catch (err) {
          console.error('Error fetching user:', err);
          setError('Failed to load user data. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [userId, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isEditMode) {
        // If editing, only send password if it was changed (not empty)
        const dataToSend = { ...formData };
        if (!dataToSend.password) {
          delete dataToSend.password;
        }
        
        await adminService.updateUser(userId, dataToSend);
        setSuccess('User updated successfully!');
      } else {
        await adminService.createUser(formData);
        setSuccess('User created successfully!');
        // Reset form after successful creation
        setFormData({
          email: '',
          password: '',
          first_name: '',
          last_name: '',
          phone: '',
          role: 'farmer',
          is_premium: false
        });
      }
    } catch (err) {
      console.error('Error saving user:', err);
      setError(err.error || 'Failed to save user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <div className="dashboard-header">
        <h1 className="dashboard-title">{isEditMode ? 'Edit User' : 'Add New User'}</h1>
        <p className="dashboard-subtitle">{isEditMode ? 'Update user information' : 'Create a new user account'}</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
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
                    <Form.Group className="mb-3">
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

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{isEditMode ? 'New Password (leave blank to keep current)' : 'Password'}</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!isEditMode}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="farmer">Farmer</option>
                    <option value="operator">Drone Operator</option>
                    <option value="admin">Administrator</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Premium Account"
                    name="is_premium"
                    checked={formData.is_premium}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="d-flex justify-content-between mt-4">
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/admin/users')}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : isEditMode ? 'Update User' : 'Create User'}
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

export default UserForm;
