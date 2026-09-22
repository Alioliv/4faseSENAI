CREATE DATABASE IF NOT EXISTS desi_20251;

USE desi_20251;

CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(30) NOT NULL
);

INSERT INTO usuario (nome, email, senha, perfil)
VALUES
('Ana', 'ana@email.com', '$2b$10$X45xTZF5XUT4h5LfzemonOFlPquZSSajQyoIC7iFedoPMMS2CwBBq', 'admin'),
('Joao', 'joao@email.com', '$2b$10$X45xTZF5XUT4h5LfzemonOFlPquZSSajQyoIC7iFedoPMMS2CwBBq', 'usuario');