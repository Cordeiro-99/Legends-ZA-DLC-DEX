-- Run this in your MySQL (MAMP) to create database and tables
CREATE DATABASE IF NOT EXISTS pokedb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pokedb;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users_pokedex (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  pokemon_id INT NOT NULL,
  caught TINYINT(1) NOT NULL DEFAULT 0,
  UNIQUE KEY user_pokemon (user_id, pokemon_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
