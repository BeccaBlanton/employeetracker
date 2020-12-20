INSERT INTO employee_tracker_db.department (name) VALUES ("HR"), ("Engineering"), ("sales");


INSERT INTO employee_tracker_db.employee (first_name, last_name, role_id, manager_id) VALUES 
("Han","Solo",1,1), ("Luke","Skywalker",2,1), ("Anakin","skywalker",3,1);

INSERT INTO employee_tracker_db.role (title, salary, department_id) VALUES ("Smuggler",100000,3), ("Jedi",10000,2), ("Sith Lord",1000000,1 )