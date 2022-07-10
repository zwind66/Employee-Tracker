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
                'View All Employees',
                'View All Roles',
                'View All Departments',
                'View All Employees by Department',
                'View Department Budget',
                'Add Employee',
                'Add Role',
                'Add Department',
                'Update Employee Role',
                'update Employee Manager',
                'Remove Employee',
                'Remove Role',
                'Remove Department',
                'Exit'
            ]
        }
    ]).then(answer => {
        switch (answer.action) {
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Employees by Department':
                viewAllEmployeesByDepartment();
                break;
            case 'View Department Budget':
                viewDepartmentBudget();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'update Employee Manager':
                updateEmployeeManager();
                break;
            case 'Remove Employee':
                removeEmployee();
                break;
            case 'Remove Role':
                removeRole();
                break;
            case 'Remove Department':
                removeDepartment();
                break;
            case 'Exit':
                exit();
                break;
        }
    });
}

// View all employees
const viewAllEmployees = () => {
    



