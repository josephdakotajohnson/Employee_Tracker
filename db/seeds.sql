USE ppi_db;

INSERT INTO departments (name)
VALUES ("Joseph"),
        ("Dylan");

INSERT INTO roles (title, salary, department_id)
VALUES ("Writer of the code", 20.00, 1),
        ("Checker of the code", 20.00, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Joseph", "Johnson", 1, null),
        ("Dylan", "Johnson", 1, 1);