create schema 'desi_20251' ;
use `desi_20251` ;


CREATE TABLE `desi_20251`.`usuario` (
  `idusuario` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `email` VARCHAR(150) NULL,
  `senha` VARCHAR(80) NULL,
  `cpf` VARCHAR(11) NULL,
  `logradouro` VARCHAR(150) NULL,
  `bairro` VARCHAR(100) NULL,
  `estado` VARCHAR(45) NULL,
  `numero` VARCHAR(2) NULL,
  `cidade` VARCHAR(100) NULL,
  PRIMARY KEY (`idusuario`));
