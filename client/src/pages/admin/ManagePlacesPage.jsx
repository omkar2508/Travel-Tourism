    // D:/client/src/pages/admin/ManagePlacesPage.jsx
    import React, { useState, useEffect } from 'react';
    import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
    import placeService from '../../services/placeService';

    const ManagePlacesPage = () => {
      const [places, setPlaces] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [message, setMessage] = useState('');

      const fetchPlaces = async () => {
        try {
          setLoading(true);
          const response = await placeService.getAllPlaces(); // This gets all places for admin
          setPlaces(response.data);
        } catch (err) {
          console.error("Error fetching places:", err);
          setError(err.response?.data?.message || "Failed to load places.");
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchPlaces();
      }, []);

      const handleTogglePlaceAvailability = async (placeId, currentAvailability) => {
        setMessage('');
        setError(false);
        const newAvailability = !currentAvailability;
        const action = newAvailability ? 'activate' : 'freeze';
        if (window.confirm(`Are you sure you want to ${action} this place?`)) {
          try {
            const response = await placeService.togglePlaceAvailability(placeId, newAvailability);
            setMessage(response.data.message || `Place ${action}d successfully!`);
            fetchPlaces(); // Refresh places list
          } catch (err) {
            console.error(`Error ${action}ing place:`, err);
            setMessage(err.response?.data?.message || `Failed to ${action} place.`);
            setError(true);
          } finally {
            setTimeout(() => { setMessage(''); setError(false); }, 3000);
          }
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
          <h2 className="text-center mb-4">Manage Places</h2>
          {message && <Alert variant={error ? "danger" : "success"} className="text-center">{message}</Alert>}

          {places.length === 0 ? (
            <p className="text-center text-light">No places added yet.</p>
          ) : (
            <Row className="justify-content-center">
              {places.map(place => (
                <Col md={4} sm={6} xs={12} key={place.id} className="mb-4">
                  <Card className="h-100 shadow-sm text-center">
                    <Card.Img variant="top" src={place.image_url} alt={place.name} style={{ height: '240px', objectFit: 'cover' }} />
                    <Card.Body>
                      <Card.Title>{place.name}</Card.Title>
                      <Card.Text>Price: ${parseFloat(place.price).toFixed(2)}</Card.Text>
                      <Card.Text>
                        Status: <Badge bg={place.is_available ? 'success' : 'danger'}>
                                  {place.is_available ? 'Available' : 'Frozen'}
                                </Badge>
                      </Card.Text>
                      <Button
                        variant={place.is_available ? 'warning' : 'info'}
                        onClick={() => handleTogglePlaceAvailability(place.id, place.is_available)}
                      >
                        {place.is_available ? 'Freeze Place' : 'Unfreeze Place'}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      );
    };

    export default ManagePlacesPage;
    