import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    setLoading(true);

    try {
      // Use the auth service to login
      const response = await authService.login(formData);
      onLogin(response.user, response.access_token);
    } catch (err) {
      setError(err.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <h2 className="text-center mb-4 text-primary">Login to AgriDrone</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit} className="auth-form">
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

            <Form.Group className="mb-4" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </Form.Group>

            <div className="d-grid">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading}
                className="py-2"
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </Form>
          
          <div className="text-center mt-4">
            <p className="mb-0">
              Don't have an account? <Link to="/register" className="text-primary">Register</Link>
            </p>
          </div>
        </Card.Body>
      </Card>
      
      <div className="text-center mt-4 text-muted">
        <p className="small">
          <strong>Demo accounts:</strong><br />
          farmer@example.com / farmer123<br />
          operator@example.com / operator123<br />
          admin@agridrone.com / admin123
        </p>
      </div>
    </div>
  );
};

export default Login;
