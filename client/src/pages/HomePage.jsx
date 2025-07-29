// D:/client/src/pages/HomePage.jsx
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import LightRays from '../components/LightRays'; // Import the LightRays component
import ImageTrail from '../components/ImageTrail'; // Import the ImageTrail component
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const { user } = useAuth();
  const heroImageRef = useRef(null);
  const heroContentRef = useRef(null);

  useEffect(() => {
    const heroImage = heroImageRef.current;
    const heroContent = heroContentRef.current;

    if (!heroImage || !heroContent) return;

    // Animation for the image opacity (kept as it's a nice effect with LightRays)
    gsap.to(heroImage, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: heroContent,
        start: 'top center',
        end: 'bottom top',
        scrub: true,
        // markers: true // TEMPORARY: For debugging ScrollTrigger positions - remove in production
      },
    });

    // Animate button in (kept as it's a nice effect)
    gsap.fromTo(heroContent.querySelector('.btn'),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: heroContent,
          start: 'bottom center+=50',
          toggleActions: 'play none none reverse',
          // markers: true // TEMPORARY: For debugging ScrollTrigger positions - remove in production
        }
      }
    );

    // Initial state for text (make it immediately visible and styled by CSS)
    gsap.set(heroContent.querySelectorAll('h2, p'), { opacity: 1, filter: 'blur(0px)', transform: 'none' });


    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Array of image URLs for ImageTrail
  const imageTrailItems = [
    '/rishikesh.jpg',
    '/Golden Temple.jpg',
    '/Kashmir.jpg',
    '/Kutubminar.jpg',
    '/Munnar.jpg',
    '/Taj(2).jpg',
    '/gateway.jpg',
    '/mahabaleshwar.jpg',
    '/Darjeeling.jpg',
    '/Mysore.jpg',
    '/pandharpur.jpg',
    '/Red Fort.jpg',
  ];


  return (
    <div className="home-page">
      {/* Image Hero Section */}
      <section className="parallax">
        <div className="overlay"></div>
       

        {/* LightRays Component - Positioned to cover the hero section */}
        <LightRays
          raysOrigin="top" // Rays coming from bottom
          raysColor="#200ba9ff" // Accent color for rays
          raysSpeed={1}
          lightSpread={0.4}
          rayLength={3}
          pulsating={false}
          fadeDistance={1}
          saturation={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.05}
          distortion={0.02}
          className="hero-light-rays"
        />

        <div ref={heroContentRef} className="parallax-text text-center p-4 rounded">
          <h2 className="display-3 fw-bold text-light mb-3">
            Discover Breathtaking Destinations
          </h2>

          <p className="lead text-light mb-5">
            Your next adventure is just a click away. Explore the world with us.
          </p>

          <Button as={Link} to="/places" variant="primary" size="lg" className="mt-4">
            Explore Now
          </Button>
        </div>
      </section>


      {/* NEW: Image Trail Section */}
<section className="image-trail-section" style={{backgroundColor:"rgba(130, 133, 211, 0.39)"}}>
  <div className='imgtrail-container' style={{
  height: '600px',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '10px'
}}>

  {/* Centered text block */}
  <div className="text-overlay">
    <h1 className="text-center mb-3" style={{ color: 'black' }}>Explore Our Destinations</h1>
    <p className="text-center lead mb-3" style={{ color: 'black' }}>
      Move your mouse over the area to reveal stunning travel moments!
    </p>
  </div>

  {/* LightRays for this section */}
  <LightRays
  raysOrigin="bottom-center"
  raysColors=	'#edefe5ff' // yellow-green hybrid
  raysSpeed={1}
  lightSpread={0.7}
  rayLength={1}
  pulsating={true}
  fadeDistance={0.5}
  saturation={3.5}
  followMouse={true}
  mouseInfluence={0.3}
  noiseAmount={0.1}
  distortion={0.05}
  className="imgtrail-light-rays"
/>

  
  <ImageTrail
    items={imageTrailItems}
    variant={2}
  />

</div>
      </section>


      {/* Why Choose Us Section */}
      <section className="info-section py-5 px-3">
        <Container>
          <h2 className="text-center mb-5">Why Choose Us?</h2>
          <Row className="justify-content-center text-center">
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm feature-card">
                <Card.Body>
                  <i className="bi bi-currency-dollar feature-icon mb-3"></i>
                  <Card.Title>Best Deals</Card.Title>
                  <Card.Text>We provide unbeatable prices on the best destinations worldwide, ensuring value for your money.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm feature-card">
                <Card.Body>
                  <i className="bi bi-headset feature-icon mb-3"></i>
                  <Card.Title>24/7 Support</Card.Title>
                  <Card.Text>Our dedicated team is always ready to assist you with your travel needs, anytime, anywhere.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm feature-card">
                <Card.Body>
                  <i className="bi bi-check-circle feature-icon mb-3"></i>
                  <Card.Title>Easy Bookings</Card.Title>
                  <Card.Text>Seamless and hassle-free booking process for a smooth travel experience from start to finish.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Customer Testimonials */}
      <section className="testimonials py-5 px-3">
        <Container>
          <h2 className="text-center mb-5">What Our Customers Say</h2>
          <Row className="justify-content-center">
            <Col md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm testimonial-card">
                <Card.Body>
                  <blockquote className="blockquote mb-0">
                    <p className="mb-0">"An unforgettable journey! The service was top-notch and made my trip truly special. Highly recommended!"</p>
                    <footer className="blockquote-footer mt-2">Riya Sharma</footer>
                  </blockquote>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm testimonial-card">
                <Card.Body>
                  <blockquote className="blockquote mb-0">
                    <p className="mb-0">"Best vacation ever! Highly recommend this travel service for their amazing deals and exceptional support."</p>
                    <footer className="blockquote-footer mt-2">John Doe</footer>
                  </blockquote>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm testimonial-card">
                <Card.Body>
                  <blockquote className="blockquote mb-0">
                    <p className="mb-0">"The booking process was so easy, and the destinations were incredible. I'll definitely book again!"</p>
                    <footer className="blockquote-footer mt-2">Priya Singh</footer>
                  </blockquote>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      
    </div>
  );
};

export default HomePage;
