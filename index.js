const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_user,
        password: process.env.DB_password,
        database: process.env.DB_name
    },
    console.log(`Connected to the ppi_db database.`)
);

const options = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'What would you like to do?', 
            choices: ['View all departments.', 'View all roles.', 'View all employees.', 'Add a department.', 'Add a role.', 'Add an employee.', 'Update an employee role.'],
        },
    ])
    .then((answers) => {
        if (answers.option === "View all departments.") {
            viewDepartments();
        } else if (answers.option == "View all roles.") {
            viewRoles();
        } else if (answers.option == "View all employees.") {
            viewEmployees();
        } else if (answers.option == "Add a department.") {
            addDepartment();
        } else if (answers.option == "Add a role.") {
            addRole();
        } else if (answers.option == "Add an employee.") {
            addEmployee();
        } else if (answers.option == "Update an employee role.") {
            updateEmployee();
        }
    })
};

function viewDepartments() {
    const sql = `SELECT * FROM departments`;
    // console.log("viewDepartments running");

    db.query(sql, (err, rows) => {
      if (err) {
        console.error(err);
         return;
      }
    console.table(rows)
  });
};

function viewRoles() {
    const sql = `SELECT departments.name, roles.salary, roles.title FROM roles LEFT JOIN departments ON roles.department_id = departments.id`;
    console.log("viewRoles running");

    db.query(sql, (err, rows) => {
      if (err) {
        console.error(err);
         return;
      }
    console.table(rows)
  });
};

function viewEmployees() {
    const sql = `SELECT * FROM employees LEFT JOIN roles ON employees.role_id = role.id LEFT JOIN departments ON roles.department_id = departments.id`; // Add ' LEFT JOIN departments ON roles.department_id = department.id' at the end but for the manager
    console.log("viewEmployees running");

    db.query(sql, (err, rows) => {
      if (err) {
        console.error(err);
         return;
      }
    console.table(rows)
  });
};

function addDepartment() {
    console.log("addDepartment running");
    return inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department?',
        },
    ])
    .then((answers) => {
        const departmentName = answers.department;
        const sql = `INSERT INTO departments (name) VALUES ('${departmentName}')`;

        db.query(sql, (err, rows) => {
            if (err) {
                console.error(err);
            return;
        }

        console.log(`Department ${departmentName} added successfully.`);
        });
    })
    .catch((error) => {
        console.error('Error occurred:', error);
    });
};

function addRole() {
    console.log("addRole running");
    return inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the role?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?',
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'What is the department_id of the role?',
        },
    ])
    .then((answers) => {
        const roleTitle = answers.title;
        const roleSalary = answers.salary;
        const roleDepartmentId = answers.department_id;
        const sql = `INSERT INTO roles (title, salary, department_id) VALUES ('${roleTitle}', '${roleSalary}', '${roleDepartmentId}')`;

        db.query(sql, (err, rows) => {
            if (err) {
                console.error(err);
            return;
        }

        console.log(`Role ${roleTitle} added successfully.`);
        });
    })
    .catch((error) => {
        console.error('Error occurred:', error);
    });
};

function addEmployee() {
    console.log("addEmployee running");
    return inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: `What is the employee's first name?`,
        },
        {
            type: 'input',
            name: 'last_name',
            message: `What is the employee's last name?`,
        },
        { // Find out how if/how to find the role_id by the actual role name.
            type: 'input',
            name: 'role_id',
            message: 'What is the role_id of the employee?',
        },
        { // Find out how if/how to find the manager_id by the actual manager name.
            type: 'input',
            name: 'manager_id',
            message: 'What is the manager_id of the employee?',
        },
    ])
    .then((answers) => {
        const employeeFirstName = answers.first_name;
        const employeeLastName = answers.last_name;
        const employeeRoleId = answers.role_id;
        const employeeManagerId = answers.manager_id;
        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('${employeeFirstName}', '${employeeLastName}', '${employeeRoleId}', '${employeeManagerId}')`;

        db.query(sql, (err, rows) => {
            if (err) {
                console.error(err);
            return;
        }

        console.log(`Employee ${employeeFirstName} ${employeeLastName} added successfully.`);
        });
    })
    .catch((error) => {
        console.error('Error occurred:', error);
    });
};

function updateEmployee() {

};

options();

        // {
        //     type: 'checkbox',
        //     name: 'badges',
        //     message: 'What badges should be added to the README?',
        //     choices: ['HTML', 'CSS', 'JavaScript'],
        // },
        // {
        //     type: 'input',
        //     name: 'screenshot',
        //     message: 'What is the name of the project screenshot?',
        // },
        // {
        //     type: 'list',
        //     name: 'video',
        //     message: 'Does their need to be a video section?', 
        //     choices: ['yes', 'no'],
        // },