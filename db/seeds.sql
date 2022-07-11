INSERT INTO department (name) 
VALUES ('Sales'), ('IT'), ('Finance'), ('Marketing'), ('HR'), ('Legal');

INSERT INTO role (title, salary, department_id) 
VALUES ('Sales Rep', '50000', 1), ('Sales Manager', '100000', 1), ('IT Manager', '100000', 2), ('IT Staff', '50000', 2), ('Finance Manager', '100000', 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ('John', 'Doe', 1, NULL), ('Jane', 'Doe', 2, 1), ('John', 'Smith', 3, NULL),('Mary', 'Smith', 4, 3), ('Bob', 'Smith', 5, NULL), ('Mary', 'Doe', 3, 1);