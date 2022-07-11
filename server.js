// Declaring the dependencies
const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('===========================================================');
    console.log('');
    console.log('Welcome to the Employee Tracker!');
    console.log('');
    console.log('===========================================================');
    promptUser();
});

// Prompt the user for the action they want to take
const promptUser = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View Employee by Manager',
                'View Employees by Department',
                'Remove Department',
                'Remove Role',
                'Remove Employee',
                'View Department Budget',
                'Exit'
            ]
        }
    ]).then(answers => {
        switch (answers.action) {
            case 'View All Departments':
                viewDepartments();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'View All Employees':
                viewEmployees();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Update Employee Manager':
                updateEmployeeManager();
                break;
            case 'View Employee by Manager':
                viewEmployeeByManager();
                break;
            case 'View Employees by Department':
                viewEmployeesByDepartment();
                break;
            case 'Remove Department':
                removeDepartment();
                break;
            case 'Remove Role':
                removeRole();
                break;
            case 'Remove Employee':
                removeEmployee();
                break;
            case 'View Department Budget':
                viewDepartmentBudget();
                break;
            case 'Exit':
                db.end();
                break;
        }
    });
}

// View all departments
const viewDepartments = () => {
    db.query('SELECT department.id AS department_id, department.name AS department FROM department', (err, res) => {
        if (err) throw err;
        console.log('===========================================================');
        console.log('');
        console.table(res);
        console.log('===========================================================');
        promptUser();
    });
}

// View all roles
const viewRoles = () => {
    db.query('SELECT role.*, department.name AS department_name FROM role LEFT JOIN department ON role.department_id = department.id', (err, res) => {
        if (err) throw err;
        console.log('===========================================================');
        console.log('');
        console.table(res);
        console.log('===========================================================');
        promptUser();
    });
}

// View all employees
const viewEmployees = () => {
    db.query('SELECT employee.*, role.title, role.salary, department.name AS department_name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id', (err, res) => {
        if (err) throw err;
        console.log('===========================================================');
        console.log('');
        console.table(res);
        console.log('===========================================================');
        promptUser();
    });
}

// Add a department
const addDepartment = () => {
    db.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;

        const departments = res.map(department => {
            return department.name;
        }
        );

        inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the department you would like to add?',
                validate: input => {
                    if (input === '') {
                        console.log('===========================================================');
                        console.log('\n Please enter a department name.');
                        console.log('===========================================================');
                        return false;
                    } else if (departments.includes(input)) {
                        console.log('===========================================================');
                        console.log('\n That department already exists.');
                        console.log('===========================================================');
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        ]).then(answers => {
            db.query('INSERT INTO department SET ?', {
                name: answers.name
            }, (err, res) => {
                if (err) throw err;
                console.log('');
                console.log('===========================================================');
                console.log(`${answers.name} department added!`);
                console.log('===========================================================');
                viewDepartments();
            });
        });
    });
}

// Add a role
const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What role do you want to add?',
            validate: addRole => {
                if (addRole === '') {
                    console.log('===========================================================');
                    console.log('\n Please enter a role.');
                    console.log('===========================================================');
                    return false;
                } else {
                    return true;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of this role?',
            validate: addSalary => {
                if (isNaN(addSalary)) {
                    console.log('===========================================================');
                    console.log('\n Please enter a number.');
                    console.log('===========================================================');
                    return false;
                } else if (addSalary === '') {
                    console.log('===========================================================');
                    console.log('\n Please enter a salary.');
                    console.log('===========================================================');
                    return false;
                } else {
                    return true;
                }
            }
        },
    ]).then(answer => {
        const params = [answer.role, answer.salary];

        // grab dept from department table
        const roleSql = `SELECT name, id FROM department`;

        db.query(roleSql, (err, data) => {
            if (err) throw err;

            const dept = data.map(({ name, id }) => ({ name: name, value: id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'dept',
                    message: "What department is this role in?",
                    choices: dept
                }
            ]).then(deptChoice => {
                const dept = deptChoice.dept;
                params.push(dept);

                const sql = `INSERT INTO role (title, salary, department_id)
                            VALUES (?, ?, ?)`;

                db.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log('===========================================================');
                    console.log('Added' + answer.role + " to roles!");
                    console.log('===========================================================');

                    viewRoles();
                });
            });
        });
    });
}

// Add an employee
const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: "What is the employee's first name?",
            validate: firstName => {
                if (firstName === '') {
                    console.log('===========================================================');
                    console.log('\n Please enter a first name.');
                    console.log('===========================================================');
                    return false;
                } else {
                    return true;
                }
            }
        },
        {
            type: 'input',
            name: 'last_name',
            message: "What is the employee's last name?",
            validate: lastName => {
                if (lastName === '') {
                    console.log('===========================================================');
                    console.log('\n Please enter a last name. \n');
                    console.log('===========================================================');
                    return false;
                } else {
                    return true;
                }
            }
        }
    ]).then(answers => {
        const params = [answers.first_name, answers.last_name];

        // grab role from role table
        const roleSql = `SELECT title, id FROM role`;

        db.query(roleSql, (err, data) => {
            if (err) throw err;

            const role = data.map(({ title, id }) => ({ name: title, value: id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's role?",
                    choices: role
                }
            ]).then(roleChoice => {
                const role = roleChoice.role;
                params.push(role);

                // grab manager from employee table
                const managerSql = `SELECT * FROM employee`;

                db.query(managerSql, (err, data) => {
                    if (err) throw err;

                    const managers = data.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who is the employee's manager?",
                            choices: managers
                        }
                    ]).then(managerChoice => {
                        const manager = managerChoice.manager;
                        params.push(manager);

                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?, ?)`;

                        db.query(sql, params, (err, result) => {
                            if (err) throw err;
                            console.log('===========================================================');
                            console.log('\n Added' + answers.first_name + " " + answers.last_name + " to employees! \n");
                            console.log('===========================================================');

                            viewEmployees();
                        });
                    });
                });
            });
        });
    });
}

// Update an employee role
const updateEmployeeRole = () => {
    // grab employee from employee table
    const employeeSql = `SELECT * FROM employee`;

    db.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Which employee's role would you like to update?",
                choices: employees
            }
        ]).then(employeeChoice => {
            const employee = employeeChoice.employee;

            // grab role from role table
            const roleSql = `SELECT title, id FROM role`;

            db.query(roleSql, (err, data) => {
                if (err) throw err;

                const role = data.map(({ title, id }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the employee's new role?",
                        choices: role
                    }
                ]).then(roleChoice => {
                    const role = roleChoice.role;

                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                    db.query(sql, [role, employee], (err, result) => {
                        if (err) throw err;
                        console.log('===========================================================');
                        console.log('\n Updated employee role! \n');
                        console.log('===========================================================');

                        viewEmployees();
                    });
                });
            });
        });
    });
}

// Update an employee manager
const updateEmployeeManager = () => {
    // grab employee from employee table
    const employeeSql = `SELECT * FROM employee`;

    db.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Which employee's manager would you like to update?",
                choices: employees
            }
        ]).then(employeeChoice => {
            const employee = employeeChoice.employee;

            // grab manager from employee table
            const managerSql = `SELECT * FROM employee`;

            db.query(managerSql, (err, data) => {
                if (err) throw err;

                const managers = data.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Who is the employee's new manager?",
                        choices: managers
                    }
                ]).then(managerChoice => {
                    const manager = managerChoice.manager;

                    const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

                    db.query(sql, [manager, employee], (err, result) => {
                        if (err) throw err;
                        console.log('===========================================================');
                        console.log('\n Updated employee manager! \n');
                        console.log('===========================================================');

                        viewEmployees();
                    });
                });
            });
        });
    });
}

// view employee by manager
const viewEmployeeByManager = () => {
    // grab manager from employee table
    const managerSql = `SELECT * FROM employee`;

    db.query(managerSql, (err, data) => {
        if (err) throw err;

        const managers = data.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'manager',
                message: "Which manager's employees would you like to view?",
                choices: managers
            }
        ]).then(managerChoice => {
            const manager = managerChoice.manager;

            const sql = `SELECT * FROM employee WHERE manager_id = ?`;

            db.query(sql, [manager], (err, data) => {
                if (err) throw err;

                const employees = data.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
                if (employees.length === 0) {
                    console.log('===========================================================');
                    console.log('\n This is not a manager! \n');
                    console.log('===========================================================');
                    promptUser();
                } else {
                    console.log('===========================================================');
                    console.log('\n they are: ' + employees.map(({ name }) => name).join(', ') + '\n');
                    console.log('===========================================================');

                    promptUser();
                }
            });
        });
    });
}

// view employee by department
const viewEmployeesByDepartment = () => {
    // grab department from department table
    const departmentSql = `SELECT * FROM department`;

    db.query(departmentSql, (err, data) => {
        if (err) throw err;

        const departments = data.map(({ id, name }) => ({ name: name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: "Which department's employees would you like to view?",
                choices: departments
            }
        ]).then(departmentChoice => {
            const department = departmentChoice.department;

            const sql = `SELECT * FROM employee JOIN role ON employee.role_id = role.id WHERE role.department_id = ?`;
            db.query(sql, [department], (err, data) => {
                if (err) throw err;

                const employees = data.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
                if (employees.length === 0) {
                    console.log('===========================================================');
                    console.log('\n This is an empty department! \n');
                    console.log('===========================================================');
                    promptUser();
                } else {
                    console.log('===========================================================');
                    console.log('\n they are: ' + employees.map(({ name }) => name).join(', ') + '\n');
                    console.log('===========================================================');

                    promptUser();
                }
            });
        });
    });
}

// remove department
const removeDepartment = () => {
    // grab department from department table
    const departmentSql = `SELECT * FROM department`;

    db.query(departmentSql, (err, data) => {
        if (err) throw err;

        const departments = data.map(({ id, name }) => ({ name: name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: "Which department would you like to remove?",
                choices: departments
            }
        ]).then(departmentChoice => {
            const department = departmentChoice.department;

            const sql = `DELETE FROM department WHERE id = ?`;

            db.query(sql, [department], (err, result) => {
                if (err) throw err;
                console.log('===========================================================');
                console.log('\n Removed department! \n');
                console.log('===========================================================');

                viewDepartments();
            });
        });
    });
}

// remove role
const removeRole = () => {
    // grab role from role table
    const roleSql = `SELECT * FROM role`;

    db.query(roleSql, (err, data) => {
        if (err) throw err;

        const roles = data.map(({ id, title }) => ({ name: title, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: "Which role would you like to remove?",
                choices: roles
            }
        ]).then(roleChoice => {
            const role = roleChoice.role;

            const sql = `DELETE FROM role WHERE id = ?`;

            db.query(sql, [role], (err, result) => {
                if (err) throw err;
                console.log('===========================================================');
                console.log('\n Removed role! \n');
                console.log('===========================================================');

                viewRoles();
            });
        });
    });
}

// remove employee
const removeEmployee = () => {
    // grab employee from employee table
    const employeeSql = `SELECT * FROM employee`;

    db.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Which employee would you like to remove?",
                choices: employees
            }
        ]).then(employeeChoice => {
            const employee = employeeChoice.employee;

            const sql = `DELETE FROM employee WHERE id = ?`;

            db.query(sql, [employee], (err, result) => {
                if (err) throw err;
                console.log('===========================================================');
                console.log('\n Removed employee! \n');
                console.log('===========================================================');

                viewEmployees();
            });
        });
    });
}

// view department budget
const viewDepartmentBudget = () => {
    console.log('Showing budget by department...\n');

    const sql = `SELECT department_id AS id, 
                        department.name AS department,
                        SUM(salary) AS budget
                 FROM  role  
                 JOIN department ON role.department_id = department.id GROUP BY  department_id`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.log('===========================================================');
        console.table(rows);
        console.log('===========================================================');

        promptUser();
    });
};
