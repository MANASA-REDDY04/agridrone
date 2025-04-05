import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <div className="footer-logo">
              <i className="fas fa-drone-alt me-2"></i> AgriDrone
            </div>
            <p className="text-muted">
              Connecting farmers with drone operators for efficient and sustainable agricultural practices.
            </p>
          </Col>
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="footer-link">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/login" className="footer-link">Login</Link>
              </li>
              <li className="mb-2">
                <Link to="/register" className="footer-link">Register</Link>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5 className="mb-3">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="fas fa-envelope me-2"></i> 21r11a1207@gcet.edu.in
              </li>
              <li className="mb-2">
                <i className="fas fa-phone me-2"></i> +91 9876543210
              </li>
              <li className="mb-2">
                <i className="fas fa-map-marker-alt me-2"></i> Geethanjali College of Engineering and Technology
              </li>
            </ul>
          </Col>
        </Row>
        <hr className="my-4" />
        <div className="text-center footer-copyright">
          <p className="mb-0">
            &copy; {currentYear} AgriDrone. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
