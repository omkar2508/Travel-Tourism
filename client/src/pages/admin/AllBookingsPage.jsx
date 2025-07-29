    // D:/client/src/pages/admin/AllBookingsPage.jsx
    import React, { useState, useEffect } from 'react';
    import { Container, Table, Alert } from 'react-bootstrap';
    import bookingService from '../../services/bookingService';

    const AllBookingsPage = () => {
      const [bookings, setBookings] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchAllBookings = async () => {
          try {
            setLoading(true);
            const response = await bookingService.getAllBookings();
            setBookings(response.data);
          } catch (err) {
            console.error("Error fetching all bookings:", err);
            setError(err.response?.data?.message || "Failed to load all bookings.");
          } finally {
            setLoading(false);
          }
        };
        fetchAllBookings();
      }, []);

      if (loading) {
        return <Container className="text-center mt-5 text-light">Loading all bookings...</Container>;
      }

      if (error) {
        return <Container className="text-center mt-5"><Alert variant="danger">{error}</Alert></Container>;
      }

      return (
        <Container className="my-5 pt-4">
          <h2 className="text-center mb-4">All User Bookings</h2>
          {bookings.length === 0 ? (
            <p className="text-center text-light">No bookings found.</p>
          ) : (
            <Table striped bordered hover responsive className="shadow-sm">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>User Name</th>
                  <th>User Email</th>
                  <th>Place</th>
                  <th>Price</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.booking_id}>
                    <td>{booking.booking_id}</td>
                    <td>{booking.user_name}</td>
                    <td>{booking.user_email}</td>
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

    export default AllBookingsPage;
    