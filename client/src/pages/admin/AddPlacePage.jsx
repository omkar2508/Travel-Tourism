// D:/client/src/pages/admin/AddPlacePage.jsx
import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import placeService from '../../services/placeService';

const AddPlacePage = () => {
  const [addPlaceForm, setAddPlaceForm] = useState({ name: '', price: '', image_url: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const handleAddPlaceChange = (e) => {
    setAddPlaceForm({ ...addPlaceForm, [e.target.name]: e.target.value });
  };

  const handleAddPlaceSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError(false);
    try {
      const response = await placeService.addPlace(addPlaceForm.name, parseFloat(addPlaceForm.price), addPlaceForm.image_url);
      setMessage(response.data.message || 'Place added successfully!');
      setAddPlaceForm({ name: '', price: '', image_url: '' }); // Clear form
    } catch (err) {
      console.error("Error adding place:", err);
      setMessage(err.response?.data?.message || "Failed to add place.");
      setError(true);
    } finally {
        setTimeout(() => { setMessage(''); setError(false); }, 3000);
    }
  };

  return (
    <Container className="my-5 pt-4">
      <h2 className="text-center mb-4">Add New Place</h2>
      {message && <Alert variant={error ? "danger" : "success"} className="text-center">{message}</Alert>}

      <Card className="mb-5 shadow-sm">
        <Card.Header as="h3">Place Details</Card.Header>
        <Card.Body>
          <Form onSubmit={handleAddPlaceSubmit}>
            <Form.Group className="mb-3" controlId="formPlaceName">
              <Form.Label>Place Name:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={addPlaceForm.name}
                onChange={handleAddPlaceChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPlacePrice">
              <Form.Label>Price:</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={addPlaceForm.price}
                onChange={handleAddPlaceChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPlaceImage">
              <Form.Label>Image URL:</Form.Label>
              <Form.Control
                type="text"
                name="image_url"
                value={addPlaceForm.image_url}
                onChange={handleAddPlaceChange}
                required
              />
            </Form.Group>
            <Button variant="success" type="submit">Add Place</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddPlacePage;
