const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'cms_db'
    },
    console.log(`Connected to the cms_db database.`)
);

const startApp = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'directory',
                message: 'What would you like to do?',
                choices:
                    ['View all departments',
                        'View all roles',
                        'View all employees',
                        'Add a department',
                        'Add a role',
                        'Add an employee',
                        'Update an employee role',
                        'Exit']
            },
        ])
        .then((answers) => {
            switch (answers.directory) {
                case 'View all departments':
                    viewDepartment();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployeeRole();
                    break;
                case 'Exit':
                    db.end();
                    console.log('Exiting the application');
                    break;
            };
        });
};

const viewDepartment = () => {
    db.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    });
};

const viewRoles = () => {
    db.query('SELECT title AS `Job Title`, role.id AS `Role ID`, department.name AS `Department`, salary AS `Salary` FROM role JOIN department ON role.department_id = department.id',
        (err, results) => {
            if (err) throw err;
            console.table(results);
            startApp();
        });
};

const viewEmployees = () => {
    db.query(`SELECT employee.id AS 'Employee ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Job Title', department.name AS 'Department', salary AS 'Salary', CONCAT(Manager.first_name, ' ', Manager.last_name) AS 'Manager' FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee AS Manager ON employee.manager_id = Manager.id ORDER BY employee.id ASC`,
        (err, results) => {
            if (err) throw err;
            console.table(results);
            startApp();
        });
};

const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'department',
                message: 'Enter the name of the department you would like to add'
            }
        ])
        .then((response) => {
            db.query(`INSERT INTO department (name) VALUES ('${response.department}')`, (err, results) => {
                if (err) throw err;
                console.log(`Success! ${response.department} added to Department`);
                startApp();

            });
        });
};

const addRole = () => {
    db.query(`SELECT id AS 'value', name FROM department`, (err, result) => {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'role',
                    message: 'Enter the name of the role you would like to add'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter the Salary for this role'
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Which department this role is affiliated with',
                    choices: result
                },
            ])
            .then((response) => {
                console.log(response);
                db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${response.role}', ${response.salary}, '${response.department}')`,
                    (err, results) => {
                        if (err) throw err;
                        console.log(` Success! ${response.roleName} added to Role`);
                        startApp();
                    });
            });

    })

};

const addEmployee = () => {
    db.query(`SELECT id AS 'value', title AS 'name' FROM role`, (err, result) => {
        db.query(`SELECT id AS 'value', CONCAT(first_name, ' ', last_name) AS 'name' FROM employee`, (err, result2) => {
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'first',
                        message: 'What is the employees FIRST name?'
                    },
                    {
                        type: 'input',
                        name: 'last',
                        message: 'What is the employees LAST name?'
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the employees role?',
                        choices: result
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Who is this employees manager?',
                        choices: result2
                    },
                ])
                .then((response) => {
                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${response.first}', '${response.last}', '${response.role}', '${response.manager}')`,
                        (err, results) => {
                            if (err) throw err;
                            console.log('Success! New employee has been added');
                            startApp();
                        });
                });
        });
    });
};

const updateEmployeeRole = () => {
    db.query(`SELECT id AS 'value',  CONCAT(first_name, ' ', last_name) AS 'name' FROM employee`, (err, result) => {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Select an employee',
                    choices: result
                }
            ])
            .then((employeeResponse) => {
                db.query(`SELECT id AS 'value', title AS 'name' FROM role`, (err, result) => {
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'role',
                                message: `What is this employee's new role?`,
                                choices: result
                            }
                        ])
                        .then((roleResponse) => {
                            db.query(`UPDATE employee SET role_id = '${roleResponse.role}' WHERE employee.id = ${employeeResponse.employee}`, (err, results) => {
                                if (err) throw err;
                                console.log('Success! Employee role was updated');
                                startApp();
                            });
                        });
                });
            });
    });
};

startApp();