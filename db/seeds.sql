-- fill the 3 tables with their respective seed data
INSERT INTO department (name)
VALUES
('IT'),
('Science'),
('Math'),
('History'),
('Arts');

INSERT INTO role (title, salary, department_id)
VALUES
('Junior Software Developer', 80000, 1),
('Senior Software Engineer', 120000, 1),
('Junior Research Assistant', 70000, 2),
('Senior Researcher', 100000, 2),
('Junior Numbers Guy', 55000, 3),
('Senior Pythagoras', 95000, 3),
('Junior History Gal', 50000, 4),
('Senior Historian', 85000, 4),
('Junior Finger Painter', 20000, 5),
('Senior Arts and Crafts', 40000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Olivia', 'Smith', 1, NULL),
('Emma', 'Williams', 2, NULL),
('Ava', 'Taylor', 3, NULL),
('Isabella', 'Martinez', 4, NULL),
('Sophia', 'Anderson', 5, NULL),
('Liam', 'Johnson', 6, 1),
('Noah', 'Brown', 7, 2),
('Ethan', 'Jones', 8, 3),
('Lucas', 'Davis', 9, 4),
('Oliver', 'Wilson', 10, 5);

