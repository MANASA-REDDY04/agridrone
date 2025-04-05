import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <Container>
          <h1 className="hero-title">Precision Agriculture at Your Fingertips</h1>
          <p className="hero-subtitle">
            AgriDrone connects farmers with drone operators for efficient spraying of pesticides and fertilizers,
            optimizing crop yield while minimizing environmental impact.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/register" variant="primary" size="lg">
              Get Started
            </Button>
            <Button as={Link} to="/login" variant="outline-light" size="lg">
              Login
            </Button>
          </div>
        </Container>
      </section>

      <section className="features-section">
        <Container>
          <h2 className="features-title">Why Choose AgriDrone?</h2>
          <Row>
            <Col md={4}>
              <Card className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-leaf"></i>
                </div>
                <h3 className="feature-title">Efficient & Precise</h3>
                <p className="feature-description">
                  Drone spraying uses up to 90% less water and chemicals than traditional methods,
                  ensuring precise application exactly where needed.
                </p>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <h3 className="feature-title">Save Time & Labor</h3>
                <p className="feature-description">
                  Drones can cover large areas quickly, reducing the time and labor required for
                  spraying operations by up to 80%.
                </p>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3 className="feature-title">Safer Operations</h3>
                <p className="feature-description">
                  Minimize human exposure to chemicals and reduce the risk of accidents in
                  difficult terrain or hazardous conditions.
                </p>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="how-it-works py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 text-primary">How It Works</h2>
          <Row className="g-4">
            <Col lg={3} md={6}>
              <div className="text-center">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                  <h3 className="m-0">1</h3>
                </div>
                <h4>Register</h4>
                <p className="text-muted">Sign up as a farmer or drone operator</p>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="text-center">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                  <h3 className="m-0">2</h3>
                </div>
                <h4>Map Your Fields</h4>
                <p className="text-muted">Farmers can easily map their fields</p>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="text-center">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                  <h3 className="m-0">3</h3>
                </div>
                <h4>Request Service</h4>
                <p className="text-muted">Schedule drone spraying operations</p>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="text-center">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                  <h3 className="m-0">4</h3>
                </div>
                <h4>Get Results</h4>
                <p className="text-muted">Enjoy efficient and precise application</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="cta-section py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              <Card className="text-center p-5 shadow-lg border-0">
                <h2 className="mb-4">Ready to revolutionize your farming operations?</h2>
                <p className="lead mb-4">
                  Join AgriDrone today and experience the future of precision agriculture.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Button as={Link} to="/register" variant="primary" size="lg">
                    Sign Up Now
                  </Button>
                  <Button as={Link} to="/login" variant="outline-primary" size="lg">
                    Login
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default LandingPage;
