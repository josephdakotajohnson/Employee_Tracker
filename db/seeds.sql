USE ppi_db;

INSERT INTO departments (name)
VALUES ("Manager"),
        ("Assistant Manager"),
        ("Hidden");

INSERT INTO roles (title, salary, department_id)
VALUES ("Writer of the code", 20.00, 1),
        ("Checker of the code", 20.00, 2),
        ("User of the code", 20.00, 2),
        ("Secret of the code", 5.00, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Joseph", "Johnson", 1, null),
        ("Dylan", "Johnson", 2, 1),
        ("Autumn", "Watson", 3, 1),
        ("Keifer", "Johnson", 3, 1),
        ("Easter", "Egg", 4, 1);