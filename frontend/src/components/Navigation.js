import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';

const Navigation = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  // Determine which navigation items to show in the mobile bottom nav
  const getMobileNavItems = () => {
    if (!user) return null;
    
    if (user.role === 'farmer') {
      return (
        <div className="mobile-bottom-nav">
          <NavLink to="/farmer/dashboard" className={({ isActive }) => 
            `mobile-nav-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-home"></i>
            <span>Home</span>
          </NavLink>
          <NavLink to="/farmer/fields" className={({ isActive }) => 
            `mobile-nav-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-map-marked-alt"></i>
            <span>Fields</span>
          </NavLink>
          <NavLink to="/farmer/service-requests" className={({ isActive }) => 
            `mobile-nav-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-tasks"></i>
            <span>Requests</span>
          </NavLink>
          <NavLink to="/farmer/nearby-operators" className={({ isActive }) => 
            `mobile-nav-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-search-location"></i>
            <span>Find</span>
          </NavLink>
        </div>
      );
    } else if (user.role === 'operator') {
      return (
        <div className="mobile-bottom-nav">
          <NavLink to="/operator/dashboard" className={({ isActive }) => 
            `mobile-nav-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-home"></i>
            <span>Home</span>
          </NavLink>
          <NavLink to="/operator/available-requests" className={({ isActive }) => 
            `mobile-nav-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-clipboard-list"></i>
            <span>Available</span>
          </NavLink>
          <NavLink to="/operator/assigned-requests" className={({ isActive }) => 
            `mobile-nav-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-tasks"></i>
            <span>Assigned</span>
          </NavLink>
          <NavLink to="/operator/profile" className={({ isActive }) => 
            `mobile-nav-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-user"></i>
            <span>Profile</span>
          </NavLink>
        </div>
      );
    } else if (user.role === 'admin') {
      return (
        <div className="mobile-bottom-nav">
          <NavLink to="/admin/dashboard" className={({ isActive }) => 
            `mobile-nav-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-home"></i>
            <span>Home</span>
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => 
            `mobile-nav-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-users"></i>
            <span>Users</span>
          </NavLink>
          <NavLink to="/admin/service-requests" className={({ isActive }) => 
            `mobile-nav-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-tasks"></i>
            <span>Requests</span>
          </NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => 
            `mobile-nav-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </NavLink>
        </div>
      );
    }
    
    return null;
  };

  // Add floating action button for common actions
  const getFloatingActionButton = () => {
    if (!user) return null;
    
    if (user.role === 'farmer' && location.pathname === '/farmer/fields') {
      return (
        <Link to="/farmer/service-request-form" className="floating-action-btn">
          <i className="fas fa-plus"></i>
        </Link>
      );
    }
    
    return null;
  };

  return (
    <>
      <Navbar expand="lg" className="navbar">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <i className="fas fa-drone-alt me-2"></i>
            AgriDrone
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {!user ? (
                // Navigation for non-authenticated users
                <>
                  <Nav.Link as={NavLink} to="/" end>
                    Home
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/login">
                    Login
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/register">
                    Register
                  </Nav.Link>
                </>
              ) : user.role === 'farmer' ? (
                // Navigation for farmers
                <>
                  <Nav.Link as={NavLink} to="/farmer/dashboard">
                    Dashboard
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/farmer/fields">
                    My Fields
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/farmer/service-requests">
                    Service Requests
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/farmer/nearby-operators">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    Find Operators
                  </Nav.Link>
                  <NavDropdown title={`${user.first_name} ${user.last_name}`} id="farmer-dropdown">
                    <NavDropdown.Item as={Link} to="/profile">
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : user.role === 'operator' ? (
                // Navigation for operators
                <>
                  <Nav.Link as={NavLink} to="/operator/dashboard">
                    Dashboard
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/operator/available-requests">
                    Available Requests
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/operator/assigned-requests">
                    My Assignments
                  </Nav.Link>
                  <NavDropdown title={`${user.first_name} ${user.last_name}`} id="operator-dropdown">
                    <NavDropdown.Item as={Link} to="/operator/profile">
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                // Navigation for admins
                <>
                  <Nav.Link as={NavLink} to="/admin/dashboard">
                    Dashboard
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/admin/users">
                    User Management
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/admin/service-requests">
                    Service Requests
                  </Nav.Link>
                  <NavDropdown title={`${user.first_name} ${user.last_name}`} id="admin-dropdown">
                    <NavDropdown.Item as={Link} to="/profile">
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      {/* Mobile Bottom Navigation */}
      {getMobileNavItems()}
      
      {/* Floating Action Button */}
      {getFloatingActionButton()}
    </>
  );
};

export default Navigation;
