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

-- may need to be asynch
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Olivia', 'Smith', 2, NULL),
('Emma', 'Williams', 4, NULL),
('Ava', 'Taylor', 6, NULL),
('Isabella', 'Martinez', 8, NULL),
('Sophia', 'Anderson', 10, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Liam', 'Johnson', 1, 2),
('Noah', 'Brown', 3, 4),
('Ethan', 'Jones', 5, 6),
('Lucas', 'Davis', 7, 8),
('Oliver', 'Wilson', 9, 10);