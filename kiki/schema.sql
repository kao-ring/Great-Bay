DROP DATABASE IF EXISTS great_bayDB;

CREATE DATABASE great_bayDB;

USE great_bayDB;

CREATE TABLE post
(
    id INT NOT NULL
    AUTO_INCREMENT,
  item VARCHAR
    (45) NULL,
  conditional VARCHAR
    (45) NULL,
  category VARCHAR
    (45) NULL,
  startingBid INT NOT NULL,
  PRIMARY KEY
    (id)
);