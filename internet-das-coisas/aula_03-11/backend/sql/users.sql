-- Execute no banco configurado em DB_NAME antes de usar o cadastro.
-- Não cria contas prontas e não apaga uma tabela que já exista.
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user'
);

-- Se a tabela já existir, confira sua estrutura com SHOW CREATE TABLE users.
-- Ela precisa dos campos acima e de uma restrição UNIQUE para email.


CREATE TABLE IF NOT EXISTS `logs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario` INT NULL,
  `datahora` DATETIME DEFAULT current_timestamp,
  `acao` VARCHAR(150) NULL,
  `mensagem` TEXT NULL,
  `recurso_afetado` VARCHAR(150) NULL,
  `id_recurso_afetado` VARCHAR(45) NULL,
  -- TEXT permite guardar nome e categoria completos no JSON.
  `valor_antigo` TEXT NULL,
  `valor_novo` TEXT NULL,
  `campos_alterados` TEXT NULL,
  `ip` VARCHAR(45) NULL,
  `codigo_http` INT NULL,
  `status_acao` VARCHAR(45) NULL,
  PRIMARY KEY (`id`)
  );

  CREATE TABLE IF NOT EXISTS `materials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `category` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
) ;

