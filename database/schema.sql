CREATE DATABASE IF NOT EXISTS meal_management;
USE meal_management;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(20) UNIQUE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE meals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  breakfast BOOLEAN DEFAULT FALSE,
  lunch BOOLEAN DEFAULT FALSE,
  dinner BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_date (user_id, date)
);

CREATE TABLE tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  meal_date DATE NOT NULL,
  meal_type ENUM('breakfast', 'lunch', 'dinner') NOT NULL,
  token VARCHAR(20) UNIQUE NOT NULL,
  status ENUM('unused', 'used') DEFAULT 'unused',
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE bills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  month VARCHAR(7) NOT NULL,
  meal_count INT DEFAULT 0,
  meal_rate DECIMAL(10,2) DEFAULT 0,
  amount DECIMAL(10,2) DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_month (user_id, month)
);

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'dining_manager',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE hall_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  is_hall_closed BOOLEAN DEFAULT FALSE,
  is_meal_off BOOLEAN DEFAULT FALSE,
  note VARCHAR(255)
);

CREATE TABLE meal_rates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  breakfast_rate DECIMAL(10,2) DEFAULT 40.00,
  lunch_rate DECIMAL(10,2) DEFAULT 40.00,
  dinner_rate DECIMAL(10,2) DEFAULT 40.00
);

exit;