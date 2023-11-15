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
    options();
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
    options();
  });
};

function viewEmployees() {
    const sql = `SELECT * FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id`; // Add ' LEFT JOIN departments ON roles.department_id = department.id' at the end but for the manager
    console.log("viewEmployees running");

    db.query(sql, (err, rows) => {
      if (err) {
        console.error(err);
         return;
      }
    console.table(rows)
    options();
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

        console.log(`Department '${departmentName}' added successfully.`);
        options();
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

        console.log(`Role '${roleTitle}' added successfully.`);
        options();
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
        options();
        });
    })
    .catch((error) => {
        console.error('Error occurred:', error);
    });
};

// -- Update Paths --
// Gets Employees
const getEmployees = async () => {
    const sql = 'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
    })
};

// Gets Roles
const getRoles = async () => {
    const sql = 'SELECT id, title FROM roles';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

// Update Employee Roles
const updateEmployee = async () => {
    try {
        // Get Employees and Roles
        const employees = await getEmployees();
        const roles = await getRoles();

        // Create Choices for Questions
        const employeeChoices = employees.map(emp => ({
            name: emp.name,
            value: emp.id
        }));

        const roleChoices = roles.map(role => ({
            name: role.title,
            value: role.id
        }));

        // Update Questions

        // inquirer prompt
        // use the employee id and role id to update a user and their role
        // UPDATE table_name SET role_id = ?
        // WHERE employee.id = ?
        return inquirer.prompt([
            {
                type: 'list',
                message: 'Which employee?',
                name: 'updateEmployee',
                choices: employeeChoices,
            },
            {
                type: 'list',
                message: 'What role?',
                name: 'updateRole',
                choices: roleChoices,
            },
        ])
        .then(({ updateEmployee, updateRole }) => {

            const sql = 'UPDATE employees SET role_id = ? WHERE employees.id = ?';

            db.query(sql, [updateRole, updateEmployee], (err, res) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('Update Complete');
                options();
            })
        })
    } catch (err) {
        console.log(err);
    }
};

options();