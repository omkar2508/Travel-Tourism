// D:/client/src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-4"> {/* Increased padding */}
      <p>&copy; {new Date().getFullYear()} Travel Booking. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
