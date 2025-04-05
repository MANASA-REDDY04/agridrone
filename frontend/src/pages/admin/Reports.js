import React from 'react';
import { Container, Card, Row, Col, Alert } from 'react-bootstrap';

const Reports = () => {
  return (
    <Container className="py-4">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Reports</h1>
        <p className="dashboard-subtitle">View system reports and analytics</p>
      </div>
      
      <Alert variant="info" className="mb-4">
        <Alert.Heading>Coming Soon</Alert.Heading>
        <p>
          The reports feature is currently under development. This section will provide detailed analytics 
          on service requests, user activity, and platform usage.
        </p>
      </Alert>
      
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Service Request Summary</h5>
            </Card.Header>
            <Card.Body className="text-center py-5">
              <i className="fas fa-chart-bar fa-3x text-muted mb-3"></i>
              <h6>Service Request Analytics</h6>
              <p className="text-muted">Coming soon</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">User Activity</h5>
            </Card.Header>
            <Card.Body className="text-center py-5">
              <i className="fas fa-users fa-3x text-muted mb-3"></i>
              <h6>User Engagement Metrics</h6>
              <p className="text-muted">Coming soon</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Revenue Reports</h5>
            </Card.Header>
            <Card.Body className="text-center py-5">
              <i className="fas fa-dollar-sign fa-3x text-muted mb-3"></i>
              <h6>Financial Analytics</h6>
              <p className="text-muted">Coming soon</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Operator Performance</h5>
            </Card.Header>
            <Card.Body className="text-center py-5">
              <i className="fas fa-drone fa-3x text-muted mb-3"></i>
              <h6>Operator Metrics</h6>
              <p className="text-muted">Coming soon</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;
