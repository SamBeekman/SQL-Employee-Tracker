// import packages
const inquirer = require('inquirer');
const mysql = require('mysql2');

// connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'cms_db'
    },
    console.log(`Connected to the cms_db database.`)
);

// function to start the app which will display the homepage interface
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
                        'View employees by manager',
                        'View employees by department',
                        'View budget',
                        'Add a department',
                        'Add a role',
                        'Add an employee',
                        'Update an employee role',
                        'Update employee manager',
                        'Delete departments, roles or employees',
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
                case 'View employees by manager':
                    viewEmployeesByManager();
                    break;
                case 'View employees by department':
                    viewEmployeesByDepartment();
                    break;
                case 'View budget':
                    viewBudget();
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
                case 'Update employee manager':
                    updateEmployeeManagers();
                    break;
                case 'Delete departments, roles or employees':
                    deleteX();
                    break;
                case 'Exit':
                    db.end();
                    console.log('Exiting the application');
                    break;
            };
        });
};

// functions to be run that will query the database and prompt the user
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
        if (err) throw err;
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
                    message: 'Enter the Salary for this role',
                    validate: function (input) {
                        if (isNaN(input)) {
                            return 'enter only as whole numbers without spaces, commas or special characters';
                        } else {
                            return true;
                        }
                    }
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
        if (err) throw err;
        db.query(`SELECT id AS 'value', CONCAT(first_name, ' ', last_name) AS 'name' FROM employee`, (err, result2) => {
            if (err) throw err;
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
        if (err) throw err;
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
                    if (err) throw err;
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

// bonus questions
const updateEmployeeManagers = () => {
    db.query(`SELECT id AS 'value', CONCAT(first_name, ' ', last_name) AS 'name' FROM employee`, (err, result) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Select employee',
                    choices: result
                }
            ])
            .then((employeeResponse) => {
                db.query(`SELECT id AS 'value', CONCAT(first_name, ' ', last_name) AS 'name' FROM employee`, (err, result2) => {
                    if (err) throw err;
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'manager',
                                message: 'Select manager',
                                choices: result2
                            }
                        ])
                        .then((managerResponse) => {
                            db.query(`UPDATE employee SET manager_id = ${managerResponse.manager} WHERE employee.id = ${employeeResponse.employee}`, (err, result) => {
                                if (err) throw (err);
                                console.log('Success! Employee manager has been updated');
                                startApp();
                            });
                        });

                });
            });
    });
};

const viewEmployeesByManager = () => {
    db.query(`SELECT CONCAT(Manager.first_name, ' ', Manager.last_name) AS 'Manager Name', GROUP_CONCAT(CONCAT(employee.first_name, ' ', employee.last_name)) AS 'Employees' FROM employee LEFT JOIN employee AS Manager ON employee.manager_id = Manager.id GROUP BY Manager.first_name, Manager.last_name`, (err, result) => {
        if (err) throw err;
        console.table(result);
        startApp();
    })
}

const viewEmployeesByDepartment = () => {
    db.query(`SELECT d.name AS 'Department', GROUP_CONCAT(CONCAT(e.first_name, ' ', e.last_name) ORDER BY e.last_name, e.first_name SEPARATOR ', ') AS 'Employees' FROM employee e JOIN role r ON r.id = e.role_id JOIN department d ON d.id = r.department_id GROUP BY d.name ORDER BY d.name`, (err, result) => {
        if (err) throw err;
        console.table(result);
        startApp();
    })
}

const viewBudget = () => {
    db.query(`SELECT d.name AS 'Department', SUM(salary) AS 'Budget' FROM employee e JOIN role r ON r.id = e.role_id JOIN department d ON d.id = r.department_id GROUP BY d.name ORDER BY d.name`, (err, result) => {
        if (err) throw err;
        console.table(result);
        startApp();
    })
}

const deleteX = () => {
    db.query(`SELECT id AS 'value', title AS 'name' FROM role`, (err, rResult) => {
        if (err) throw err;
        db.query(`SELECT id AS 'value', CONCAT(first_name, ' ', last_name) AS 'name' FROM employee`, (err, eResult) => {
            if (err) throw err;
            db.query(`SELECT id AS 'value', name FROM department`, (err, dResult) => {
                if (err) throw err;

                inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'delete',
                            message: 'What would you like to delete?',
                            choices: ['department', 'role', 'employee', 'return']
                        }
                    ])
                    .then((choiceResponse) => {
                        if (choiceResponse.delete === 'department') {
                            inquirer
                                .prompt([
                                    {
                                        type: 'list',
                                        name: 'department',
                                        message: 'Which department would you like to delete?',
                                        choices: dResult
                                    }
                                ])
                                .then((deleteResponse) => {
                                    const departmentId = deleteResponse.department;
                                    db.query(`DELETE FROM department WHERE id = ?`, departmentId, (err, results) => {
                                        if (err) throw err;
                                        console.log(`Deleted department with ID: ${departmentId}`);
                                        startApp();
                                    });
                                });
                        } else if (choiceResponse.delete === 'role') {
                            inquirer
                                .prompt([
                                    {
                                        type: 'list',
                                        name: 'role',
                                        message: 'Which role would you like to delete?',
                                        choices: rResult
                                    }
                                ])
                                .then((deleteResponse) => {
                                    const roleId = deleteResponse.role;
                                    db.query(`DELETE FROM role WHERE id = ?`, roleId, (err, results) => {
                                        if (err) throw err;
                                        console.log(`Deleted role with ID: ${roleId}`);
                                        startApp();
                                    });
                                });
                        } else if (choiceResponse.delete === 'employee') {
                            inquirer
                                .prompt([
                                    {
                                        type: 'list',
                                        name: 'employee',
                                        message: 'Which employee would you like to delete?',
                                        choices: eResult
                                    }
                                ])
                                .then((deleteResponse) => {
                                    const employeeId = deleteResponse.employee;
                                    db.query(`DELETE FROM employee WHERE id = ?`, employeeId, (err, results) => {
                                        if (err) throw err;
                                        console.log(`Deleted employee with ID: ${employeeId}`);
                                        startApp();
                                    });
                                });
                        } else {
                            startApp();
                        }
                    });
            });
        });
    });
}

// initiating the app
startApp();

