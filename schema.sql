DROP DATABASE IF EXISTS empl_tracker_db;
CREATE DATABASE empl_tracker_db;

USE empl_tracker_db;

CREATE TABLE department(
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE role(
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE employee(
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id)
);

INSERT INTO department (name)
VALUES ("Engineering"), 
("Marketing"),
("Finanace"),
("Distrbution");

INSERT INTO role(title, salary, department_id)
VALUES("Manager", 100000.00, 1),
("Manager", 100000.00, 2),
("Manager", 100000.00, 3),
("Manager", 100000.00, 4),
("Accountant", 75000.00, 3),
("Account Specialist", 50000.00, 2),
("Driver", 35000.00, 4),
("Junior Developer", 60000.00, 1),
("Senior Developer", 120000.00, 1);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES("Brett", "Belka", 8, 2),
("Joe", "Rhefus", 2, NULL),
("That", "Guy", 9, 2),
("Other", "Guy", 2, NULL),
("Mr", "Specialist", 2, NULL);