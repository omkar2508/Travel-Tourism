// D:/client/src/pages/admin/ManageUsersPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Table, Alert } from 'react-bootstrap';
import userService from '../../services/userService'; // Ensure this service file exists and is correct

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        const response = await userService.getAllUsers();
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching all users:", err);
        setError(err.response?.data?.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  if (loading) {
    return <Container className="text-center mt-5 text-light">Loading users...</Container>;
  }

  if (error) {
    return <Container className="text-center mt-5"><Alert variant="danger">{error}</Alert></Container>;
  }

  return (
    <Container className="my-5 pt-4">
      <h2 className="text-center mb-4">Manage Users</h2>
      {users.length === 0 ? (
        <p className="text-center text-light">No users found.</p>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              {/* Add more user details if needed */}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ManageUsersPage;
