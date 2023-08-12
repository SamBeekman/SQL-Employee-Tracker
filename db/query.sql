-- WHEN I choose to view all departments
-- THEN I am presented with a formatted table showing department names and department ids
SELECT id AS `Department ID`, name AS `Department Name` FROM department;

-- WHEN I choose to view all roles
-- THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
SELECT * FROM role JOIN department ON role.department_id = department.id;
SELECT title AS `Job Title`, role.id AS `Role ID`, department.name AS 'Department', salary AS 'Salary' FROM role JOIN department ON role.department_id = department.id;

-- WHEN I choose to view all employees
-- THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
-- Not sure how to select managers name instead of just their reference number???
SELECT employee.id AS `Employee ID`, first_name AS `First Name`, last_name AS `Last Name`, role.title AS `Job Title`, department.name AS 'Department', salary AS 'Salary', employee.manager_id AS 'Manager' FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id ASC;

-- WHEN I choose to add a department
-- THEN I am prompted to enter the name of the department and that department is added to the database
INSERT INTO department (name) VALUES ('xxx');

-- WHEN I choose to add a role
-- THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
-- do i make a new table with all the details in 1?
INSERT INTO role (title, salary) VALUES ('position', 0);
INSERT INTO department (name) VALUES ('depname');

-- WHEN I choose to add an employee
-- THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
--same as above, how do i get  managers name etc
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('first', 'last', 1, 2);

-- WHEN I choose to update an employee role
-- THEN I am prompted to select an employee to update and their new role and this information is updated in the database
UPDATE employee
SET role_id = 0
WHERE employee.id = 1;