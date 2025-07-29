CREATE DATABASE IF NOT EXISTS tourism;
USE tourism;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user' NOT NULL -- ADDED 'role' COLUMN for role-based access
);

-- Places Table
CREATE TABLE places (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255) NOT NULL
);

-- Bookings Table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    place_id INT,
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP, -- ADDED 'booking_date' for tracking when the booking was made
    status ENUM('Pending', 'Confirmed', 'Cancelled') DEFAULT 'Pending', -- ADDED 'Cancelled' status option
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE
);
