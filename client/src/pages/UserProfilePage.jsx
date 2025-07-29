// D:/client/src/pages/UserProfilePage.jsx
import React, { useState, useEffect } from 'react';
import bookingService from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { Container, Table, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UserProfilePage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!user || !user.id) {
        navigate('/login'); // Should be handled by PrivateRoute, but good for robustness
        return;
      }

      try {
        setLoading(true);
        const response = await bookingService.getUserBookings();
        setBookings(response.data);
      } catch (err) {
        console.error("Error fetching user bookings:", err);
        setError(err.response?.data?.message || "Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [user, navigate]); // Depend on user and navigate

  if (loading) {
    return <Container className="text-center mt-5 text-light">Loading your bookings...</Container>;
  }

  if (error) {
    return <Container className="text-center mt-5"><Alert variant="danger">{error}</Alert></Container>;
  }

  return (
    <Container className="my-5 pt-4">
      <h2 className="text-center mb-4">Welcome, {user?.name || 'User'}!</h2>
      <h3 className="text-center mb-4">Your Bookings</h3>
      {bookings.length === 0 ? (
        <p className="text-center text-light">No bookings found.</p>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead>
            <tr>
              <th>Place</th>
              <th>Price</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.booking_id}>
                <td>{booking.place_name}</td>
                <td>${parseFloat(booking.price).toFixed(2)}</td>
                <td>{new Date(booking.booking_date).toLocaleDateString()}</td>
                <td><span className={`badge ${booking.status === 'Confirmed' ? 'bg-success' : 'bg-warning text-dark'}`}>{booking.status}</span></td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default UserProfilePage;
