// D:/client/src/components/PlaceCard.jsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const PlaceCard = ({ place, onBook }) => {
  const { user } = useAuth();

  return (
    <Card className="h-100 shadow-sm text-center">
      <Card.Img variant="top" src={place.image_url} alt={place.name} style={{ height: '200px', objectFit: 'cover' }} />
      <Card.Body>
        <Card.Title>{place.name}</Card.Title>
        <Card.Text>Price: ${parseFloat(place.price).toFixed(2)}</Card.Text>
        {user && user.role === 'user' && (
          <Button variant="primary" onClick={() => onBook(place.id)}>
            Book Now
          </Button>
        )}
        {!user && (
          <Button variant="secondary" disabled>Login to Book</Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default PlaceCard;