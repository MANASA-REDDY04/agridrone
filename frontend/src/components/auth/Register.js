import React, { useState } from 'react';
import { Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'farmer' // Default role
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);

    try {
      // Remove confirmPassword as it's not needed for the API
      const { confirmPassword, ...registrationData } = formData;
      
      // Register user using the auth service
      const response = await authService.register(registrationData);
      
      // Login the user with the returned data
      onLogin(response.user, response.access_token);
    } catch (err) {
      setError(err.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: '600px' }}>
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <h2 className="text-center mb-4 text-primary">Join AgriDrone</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit} className="auth-form">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="first_name">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter your first name"
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
                    placeholder="Enter your last name"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="role">
              <Form.Label>I am a</Form.Label>
              <div className="d-flex gap-4">
                <Form.Check
                  type="radio"
                  id="role-farmer"
                  label="Farmer"
                  name="role"
                  value="farmer"
                  checked={formData.role === 'farmer'}
                  onChange={handleChange}
                />
                <Form.Check
                  type="radio"
                  id="role-operator"
                  label="Drone Operator"
                  name="role"
                  value="operator"
                  checked={formData.role === 'operator'}
                  onChange={handleChange}
                />
              </div>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4" controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid mt-2">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading}
                className="py-2"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </Form>
          
          <div className="text-center mt-4">
            <p className="mb-0">
              Already have an account? <Link to="/login" className="text-primary">Login</Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;
