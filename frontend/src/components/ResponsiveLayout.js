import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

/**
 * ResponsiveLayout component that adapts to different screen sizes
 * 
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Content to be rendered inside the layout
 * @param {React.ReactNode} props.sidebar Optional sidebar content
 * @param {boolean} props.fluid Whether the container should be fluid (full-width)
 * @param {string} props.className Additional CSS classes
 */
const ResponsiveLayout = ({ children, sidebar, fluid = false, className = '' }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Update isMobile state when window is resized
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle sidebar visibility on mobile
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <Container fluid={fluid} className={`responsive-layout ${className}`}>
      <Row>
        {/* Sidebar for desktop */}
        {sidebar && !isMobile && (
          <Col md={3} lg={2} className="sidebar">
            {sidebar}
          </Col>
        )}

        {/* Main content */}
        <Col md={sidebar && !isMobile ? 9 : 12} lg={sidebar && !isMobile ? 10 : 12}>
          {children}
        </Col>
      </Row>

      {/* Mobile sidebar toggle button */}
      {sidebar && isMobile && (
        <button 
          className="sidebar-toggle" 
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className={`fas ${sidebarVisible ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      )}

      {/* Mobile sidebar overlay */}
      {sidebar && isMobile && sidebarVisible && (
        <div className="sidebar-overlay" onClick={toggleSidebar}>
          <div className="sidebar-mobile" onClick={e => e.stopPropagation()}>
            {sidebar}
          </div>
        </div>
      )}
    </Container>
  );
};

export default ResponsiveLayout;
