import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Tab, Nav, Image } from 'react-bootstrap';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate saving settings
    setTimeout(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };
  
  return (
    <Container className="py-4">
      <div className="dashboard-header">
        <h1 className="dashboard-title">System Settings</h1>
        <p className="dashboard-subtitle">Configure platform settings and preferences</p>
      </div>
      
      {saved && (
        <Alert variant="success" className="mb-4">
          Settings saved successfully!
        </Alert>
      )}
      
      <Row>
        <Col md={3} className="mb-4">
          <Card>
            <Card.Body className="p-0">
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'profile'} 
                    onClick={() => setActiveTab('profile')}
                    className="rounded-0"
                  >
                    Admin Profile
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'general'} 
                    onClick={() => setActiveTab('general')}
                    className="rounded-0"
                  >
                    General
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'notifications'} 
                    onClick={() => setActiveTab('notifications')}
                    className="rounded-0"
                  >
                    Notifications
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'security'} 
                    onClick={() => setActiveTab('security')}
                    className="rounded-0"
                  >
                    Security
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'pricing'} 
                    onClick={() => setActiveTab('pricing')}
                    className="rounded-0"
                  >
                    Pricing
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'integrations'} 
                    onClick={() => setActiveTab('integrations')}
                    className="rounded-0"
                  >
                    Integrations
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'api'} 
                    onClick={() => setActiveTab('api')}
                    className="rounded-0"
                  >
                    API Keys
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={9}>
          <Card>
            <Card.Body>
              <Tab.Content>
                <Tab.Pane active={activeTab === 'profile'}>
                  <h5 className="mb-4">Admin Profile</h5>
                  <Row>
                    <Col md={4} className="text-center mb-4">
                      <Card className="border-0 shadow-sm">
                        <Card.Body>
                          <div className="mb-3">
                            <Image 
                              src="https://via.placeholder.com/150" 
                              roundedCircle 
                              className="img-thumbnail mb-3"
                              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />
                            <h5 className="mb-0">Anish B </h5>
                            <p className="text-muted">System Administrator</p>
                          </div>
                          <Button variant="outline-primary" size="sm" className="mb-2">
                            Update Photo
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={8}>
                      <Card className="border-0 shadow-sm">
                        <Card.Body>
                          <h6 className="text-primary mb-3">Student Details</h6>
                          <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                              <Form.Label>Full Name</Form.Label>
                              <Form.Control 
                                type="text" 
                                defaultValue="Anish B" 
                              />
                            </Form.Group>
                            
                            <Form.Group className="mb-3">
                              <Form.Label>Student ID</Form.Label>
                              <Form.Control 
                                type="text" 
                                defaultValue="21R11A1208" 
                              />
                            </Form.Group>
                            
                            <Form.Group className="mb-3">
                              <Form.Label>University/Institution</Form.Label>
                              <Form.Control 
                                type="text" 
                                defaultValue="Geethanjali College of Engineering and Technology" 
                              />
                            </Form.Group>
                            
                            <Form.Group className="mb-3">
                              <Form.Label>Program/Degree</Form.Label>
                              <Form.Control 
                                type="text" 
                                defaultValue="B.Tech Information Technology" 
                              />
                            </Form.Group>
                            
                            <Form.Group className="mb-3">
                              <Form.Label>Bio</Form.Label>
                              <Form.Control 
                                as="textarea" 
                                rows={3}
                                defaultValue="Student developer. This Agridrone project is part of my portfolio showcasing skills in full-stack development." 
                              />
                            </Form.Group>
                            
                            <Form.Group className="mb-3">
                              <Form.Label>Contact Email</Form.Label>
                              <Form.Control 
                                type="email" 
                                defaultValue="21r11a1208@gcet.edu.in" 
                              />
                            </Form.Group>
                            
                            <Button type="submit" variant="primary">
                              Save Profile
                            </Button>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab.Pane>
                
                <Tab.Pane active={activeTab === 'general'}>
                  <h5 className="mb-4">General Settings</h5>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Platform Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        defaultValue="Agridrone" 
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Contact Email</Form.Label>
                      <Form.Control 
                        type="email" 
                        defaultValue="support@agridrone.com" 
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Default Service Radius (km)</Form.Label>
                      <Form.Control 
                        type="number" 
                        defaultValue="50" 
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="switch"
                        id="maintenance-mode"
                        label="Maintenance Mode"
                      />
                    </Form.Group>
                    
                    <Button type="submit" variant="primary">
                      Save Changes
                    </Button>
                  </Form>
                </Tab.Pane>
                
                <Tab.Pane active={activeTab === 'notifications'}>
                  <h5 className="mb-4">Notification Settings</h5>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="switch"
                        id="email-notifications"
                        label="Email Notifications"
                        defaultChecked
                      />
                      <Form.Text className="text-muted">
                        Send email notifications for important system events
                      </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="switch"
                        id="sms-notifications"
                        label="SMS Notifications"
                      />
                      <Form.Text className="text-muted">
                        Send SMS notifications for critical alerts
                      </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Admin Email Recipients</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3}
                        placeholder="Enter email addresses, one per line"
                        defaultValue="admin@agridrone.com"
                      />
                    </Form.Group>
                    
                    <Button type="submit" variant="primary">
                      Save Changes
                    </Button>
                  </Form>
                </Tab.Pane>
                
                <Tab.Pane active={activeTab === 'security'}>
                  <h5 className="mb-4">Security Settings</h5>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password Policy</Form.Label>
                      <Form.Select defaultValue="medium">
                        <option value="low">Basic (minimum 6 characters)</option>
                        <option value="medium">Medium (8+ chars, mixed case)</option>
                        <option value="high">Strong (12+ chars, mixed case, numbers, symbols)</option>
                      </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Session Timeout (minutes)</Form.Label>
                      <Form.Control 
                        type="number" 
                        defaultValue="60" 
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="switch"
                        id="two-factor-auth"
                        label="Enable Two-Factor Authentication"
                      />
                    </Form.Group>
                    
                    <Button type="submit" variant="primary">
                      Save Changes
                    </Button>
                  </Form>
                </Tab.Pane>
                
                <Tab.Pane active={activeTab === 'pricing'}>
                  <h5 className="mb-4">Pricing Settings</h5>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Base Price per Acre (INR)</Form.Label>
                      <Form.Control 
                        type="number" 
                        defaultValue="500" 
                      />
                      <Form.Text className="text-muted">
                        Base price for standard spraying service per acre
                      </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Premium Service Multiplier</Form.Label>
                      <Form.Control 
                        type="number" 
                        step="0.1"
                        defaultValue="1.5" 
                      />
                      <Form.Text className="text-muted">
                        Multiplier for premium services (e.g., 1.5 = 50% more than base price)
                      </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Distance Fee per km (INR)</Form.Label>
                      <Form.Control 
                        type="number" 
                        defaultValue="10" 
                      />
                      <Form.Text className="text-muted">
                        Additional fee per kilometer for travel distance
                      </Form.Text>
                    </Form.Group>
                    
                    <Button type="submit" variant="primary">
                      Save Changes
                    </Button>
                  </Form>
                </Tab.Pane>
                
                <Tab.Pane active={activeTab === 'integrations'}>
                  <h5 className="mb-4">Integration Settings</h5>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="switch"
                        id="google-maps-integration"
                        label="Google Maps Integration"
                        defaultChecked
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="switch"
                        id="payment-gateway"
                        label="Payment Gateway"
                        defaultChecked
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="switch"
                        id="sms-gateway"
                        label="SMS Gateway"
                      />
                    </Form.Group>
                    
                    <Button type="submit" variant="primary">
                      Save Changes
                    </Button>
                  </Form>
                </Tab.Pane>

                <Tab.Pane active={activeTab === 'api'}>
                  <h5 className="mb-4">API Key Settings</h5>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label>OpenWeatherMap API Key</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Enter your OpenWeatherMap API key"
                        defaultValue=""
                      />
                      <Form.Text className="text-muted">
                        Get a free API key from <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer">OpenWeatherMap</a>. 
                        This is used for weather forecasts and drone operation recommendations.
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Google Maps API Key</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Enter your Google Maps API key"
                        defaultValue=""
                      />
                      <Form.Text className="text-muted">
                        Used for mapping and location services throughout the application.
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>SMS Gateway API Key</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Enter your SMS gateway API key"
                        defaultValue=""
                      />
                      <Form.Text className="text-muted">
                        Required for sending SMS notifications to farmers and operators.
                      </Form.Text>
                    </Form.Group>
                    
                    <Button type="submit" variant="primary">
                      Save API Keys
                    </Button>
                  </Form>
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
