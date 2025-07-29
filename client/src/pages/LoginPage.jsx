// D:/client/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Form, Button, Alert, Container } from 'react-bootstrap'; // Import Container

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/auth/login', { email, password });

      if (response.data.token && response.data.user) {
        login(response.data.user, response.data.token);
        alert('Login successful!'); // Consider a custom modal instead of alert
        if (response.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/places');
        }
      } else {
        setError(response.data.message || 'Login failed. Invalid response from server.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 112px)' }}>
      <div className="container-form"> {/* Uses styles from index.css */}
        <h2>Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label className="visually-hidden">Email:</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label className="visually-hidden">Password:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100 mt-3">Login</Button> {/* w-100 for full width */}
        </Form>
        <p className="mt-3">Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </Container>
  );
};

export default LoginPage;
