// D:/client/src/pages/AdminDashboardPage.jsx
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  return (
    <Container className="my-5 pt-4 text-center">
      <h2 className="mb-4">Admin Panel Overview</h2>
      <p className="lead text-light">Welcome to the administration dashboard. Select an option below to manage your travel system.</p>

      <Row className="justify-content-center mt-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Add New Places</Card.Title>
              <Card.Text>
                Add new breathtaking destinations to your travel offerings.
              </Card.Text>
              <Button as={Link} to="/admin/add-place" variant="primary">Go to Add Place</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Manage Places</Card.Title>
              <Card.Text>
                View, edit, and toggle availability of existing travel places.
              </Card.Text>
              <Button as={Link} to="/admin/manage-places" variant="info">Go to Manage Places</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>All User Bookings</Card.Title>
              <Card.Text>
                Review and manage all user bookings in the system.
              </Card.Text>
              <Button as={Link} to="/admin/all-bookings" variant="success">Go to Bookings</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* New Admin Feature Card (for user management) */}
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Manage Users</Card.Title>
              <Card.Text>
                View and manage all registered users.
              </Card.Text>
              <Button as={Link} to="/admin/manage-users" variant="warning">Go to User Management</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboardPage;
