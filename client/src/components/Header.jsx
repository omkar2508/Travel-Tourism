// D:/client/src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="fixed-top">
      <Container>
        <Navbar.Brand as={Link} to="/">Travel Booking</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <NavDropdown title="Admin Panel" id="admin-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/admin">Admin Dashboard</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/add-place">Add New Place</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/manage-places">Manage Places</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/all-bookings">All User Bookings</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/manage-users">Manage Users</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>Logout ({user.name})</NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/places">Available Places</Nav.Link>
                    <Nav.Link as={Link} to="/profile">My Profile</Nav.Link>
                    <Nav.Link onClick={handleLogout}>Logout ({user.name})</Nav.Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
