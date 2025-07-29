// D:/client/src/pages/AvailablePlacesPage.jsx
import React, { useState, useEffect } from 'react';
import placeService from '../services/placeService';
import bookingService from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';

const AvailablePlacesPage = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const response = await placeService.getAllPlaces(user?.role !== 'admin');
        setPlaces(response.data);
      } catch (err) {
        console.error("Error fetching places:", err);
        setError(err.response?.data?.message || "Failed to load places.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, [user]);

  const handleBookPlace = async (placeId) => {
    if (!user) {
      alert('You must be logged in to book a place.');
      return;
    }

    try {
      const response = await bookingService.bookPlace(placeId);
      setMessage(response.data.message || 'Booking confirmed!');
    } catch (err) {
      console.error("Error booking place:", err);
      setMessage(err.response?.data?.message || "Booking failed. Please try again.");
      setError(true);
    } finally {
      setTimeout(() => {
        setMessage('');
        setError(false);
      }, 3000);
    }
  };

  if (loading) {
    return <Container className="text-center mt-5 text-light">Loading places...</Container>;
  }

  if (error) {
    return <Container className="text-center mt-5"><Alert variant="danger">{error}</Alert></Container>;
  }

  return (
    <Container className="my-5 pt-4">
      <h2 className="text-center mb-4">Available Places</h2>
      {message && <Alert variant={error ? "danger" : "success"} className="text-center">{message}</Alert>}
      <Row className="justify-content-center">
        {places.length === 0 ? (
          <Col><p className="text-center text-muted">No places available.</p></Col>
        ) : (
          <>
            {places.map(place => (
              <Col md={4} sm={6} xs={12} key={place.id} className="mb-4">
                <Card className="h-100 shadow-sm text-center">
                  <Card.Img
                    variant="top"
                    src={place.image_url || 'https://placehold.co/600x400/cccccc/000000?text=No+Image'}
                    alt={place.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/ff0000/ffffff?text=Image+Error'; }}
                  />
                  <Card.Body>
                    <Card.Title>{place.name}</Card.Title>
                    <Card.Text>Price: ${parseFloat(place.price).toFixed(2)}</Card.Text>

                    {user && user.role === 'user' ? (
                        place.is_available ? (
                            <Button variant="primary" onClick={() => handleBookPlace(place.id)}>
                                Book Now
                            </Button>
                        ) : (
                            <Button variant="secondary" disabled>Currently Unavailable</Button>
                        )
                    ) : (
                        !user && (
                            <Button variant="secondary" disabled>Login to Book</Button>
                        )
                    )}

                  </Card.Body>
                </Card>
              </Col>
            ))}
          </>
        )}
      </Row>
    </Container>
  );
};

export default AvailablePlacesPage;
