const inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  // Your username
  user: "root",

  password: "Platypus3!",
  database: "employee_tracker_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    console.log(titlePage)
    initQuestion();
    
  });

function initQuestion(){

    inquirer.prompt( {
        type: 'list',
        name: 'options',
        message: "what would you like to do?",
        choices: [
        "Add to a database", "View a Database", "Update employee", "Delete from a database"
        ]
    }).then(res => {
        switch (res.options){
            case "Add to a database":
            AddToDb();
            break;

            case "View a Database":
            viewDb();
            break;

            case "Update employee":
            updateEmployee()
            break;

            case "Delete from a database":
            deleteDb()
            break;
        }
    })
}

function AddToDb(){
    inquirer.prompt({
        type: 'list',
        name: 'add',
        message: "what would you like to add?",
        choices: [
        "Add department", "Add role", "Add employee"
        ]
    }).then(res => {
        switch (res.add){
            case "Add department":
                inquirer.prompt({
                    type: 'input',
                    name:'name',
                    message:"What is the name of the department you are adding?"
                }).then(result => {
                connection.query(`INSERT INTO department SET ?`,
                {
                   name: result.name 
                }, function(err,res){
                    if (err) throw err;
                    console.table(`adding ${result.name} into department database`); 
                    connection.end();
                }
            )
            })
            break;

            case "Add role":
                inquirer.prompt([{
                    type: 'input',
                    name:'title',
                    message:"What is the title of the role?"
                },
                {
                    type: 'input',
                    name:'salary',
                    message:"What is the salary of the role?"
                },
                {
                    type: 'input',
                    name:'department',
                    message:"What is the department id for the department of this role?"
                }
                ]).then(result => {
                connection.query(`INSERT INTO role SET ?`,
                {
                   title: result.title,
                   salary: parseInt(result.salary),
                   department_id: parseInt(result.department) 
                }, function(err,res){
                    if (err) throw err;
                    console.table(`adding ${result.title} into role database`); 
                    connection.end();
                }
            )
            })
            break;

            case "Add employee":
                inquirer.prompt([{
                    type: 'input',
                    name:'firstName',
                    message:"What is the employee's first name?"
                },
                {
                    type: 'input',
                    name:'lastName',
                    message:"What is the employee's last name?"
                },
                {
                    type: 'input',
                    name:'roleId',
                    message:"What is the role ID of thier position?"
                },
                {
                    type: 'input',
                    name:'managerId',
                    message:"What is thier manager's ID?"
                }
                ]).then(result => {
                connection.query(`INSERT INTO employee SET ?`,
                {
                   first_name: result.firstName,
                   last_name: result.lastName,
                   role_id: parseInt(result.roleId),
                   manager_id: parseInt(result.managerId)
                }, function(err,res){
                    if (err) throw err;
                    console.table(`adding ${result.firstName} into Employee database`); 
                    connection.end();
                }
            )
            })
                
            break;
        }   
});
}

function viewDb(){
    inquirer.prompt({
        type: 'list',
        name: 'view',
        message: "what would you like to view?",
        choices: [
        "View departments", "View roles", "View employees"
        ]
    }).then(result => {
        switch (result.view){
            case "View departments":
                console.log(`Departments: `)
                connection.query(`SELECT department.id, name AS 'Department', title AS "Job Titles" FROM department
                RIGHT JOIN role on role.department_id = department.id
                ORDER BY name`, function(err,res){
                    if (err) throw err;
                    console.table(res); 
                    connection.end();
            })
            break;

            case "View roles":
                console.log(`Roles: `)
                connection.query(`SELECT role.id, title, salary, name AS 'department' FROM role
                LEFT JOIN department on role.department_id = department.id`, function(err,res){
                    if (err) throw err;
                    console.table(res); 
                    connection.end();
            })
            break;

            case "View employees":
                console.log(`Employees: `)
                connection.query(`SELECT 
                CONCAT(e.first_name," ", e.last_name) AS 'employee', title, salary, CONCAT(m.first_name," ",m.last_name) AS manager
                FROM
                    employee e
                INNER JOIN employee m ON m.id = e.manager_id LEFT JOIN role on e.role_id = role.id ORDER BY manager; `, function(err,res){
                    if (err) throw err;
                    console.table(res); 
                    connection.end();
            })
            break;
        }
    })
}


function updateEmployee(){

    connection.query(`SELECT first_name, last_name, title,role_id
    FROM employee 
    LEFT JOIN role on employee.role_id = role.id`, function(err, result){
        if(err) throw err;
    inquirer.prompt([{
        type: 'list',
        name: 'employee',
        message: "which employee would you like to update?",
        choices: ()=>{
            return result.map(employee => employee.first_name)
        }
    },
    {
        type: 'list',
        name:'role',
        message:"New Role:",
        choices: ()=>{
            return result.map(role => role.title)
    }},
    ]).then(answers => {
        connection.query("SELECT title, id FROM role WHERE ?",
        [
            {
                title: answers.role
            }
        ], function(err, roleData){
            if(err) throw err;
            console.log(roleData)
            connection.query("UPDATE employee SET ? WHERE ?",[
           {
            role_id: roleData[0].id
           },
           {
            first_name: answers.employee
           }
       ], function(err){
           if(err) throw err;
           console.log(`${answers.employee} was successfully updated in the employee database`);
           connection.end();
       }
       )
    }
    )
    })
})
}

function deleteDb(){
    inquirer.prompt({
        type: 'list',
        name: 'delete',
        message: "what would you like to delete?",
        choices: [
        "department", "role", "employee"
        ]
    }).then(result => {
        switch (result.delete){
            case "department":
                connection.query(`SELECT name FROM department`, function(err, result){
        if(err) throw err;
    inquirer.prompt([{
        type: 'list',
        name: 'department',
        message: "which department would you like to delete?",
        choices: ()=>{
            return result.map(department => department.name)
        }
    },
    ]).then(result => {
       connection.query("DELETE FROM department WHERE ?",
       [
           {
            name: result.department,
            
           }
       ], function(err){
           if(err) throw err;
           console.log(`${result.department} was successfully deleted from the department database`);
           connection.end();
       }
       )
    })
})
            break;

            case "role":
                connection.query(`SELECT title FROM role`, function(err, result){
                    if(err) throw err;
                inquirer.prompt([{
                    type: 'list',
                    name: 'role',
                    message: "which role would you like to delete?",
                    choices: ()=>{
                        return result.map(role => role.title)
                    }
                },
                ]).then(result => {
                   connection.query("DELETE FROM role WHERE ?",
                   [
                       {
                        title: result.role,
                        
                       }
                   ], function(err){
                       if(err) throw err;
                       console.log(`${result.role} was successfully deleted from the role database`);
                       connection.end();
                   }
                   )
                })
            })
            break;

            case "employee":
                connection.query(`SELECT * FROM employee`, function(err, result){
                    if(err) throw err;
                inquirer.prompt([{
                    type: 'list',
                    name: 'employee',
                    message: "which employee would you like to delete?",
                    choices: ()=>{
                        return result.map(employee => employee.first_name)
                    }
                },
                ]).then(result => {
                   connection.query("DELETE FROM employee WHERE ?",
                   [
                       {
                        first_name: result.employee,
                        
                       }
                   ], function(err){
                       if(err) throw err;
                       console.log(`${result.employee} was successfully deleted from the employee database`);
                       connection.end();
                   }
                   )
                })
            })
            break;
        }
    })
}


var titlePage = 
`
---------------------------------------------------------------------------------
| **** *   * **** *   *** *   * **** ****  ***** ****   **   *** *  * **** ***  |
| *    ** ** *  * *  *   * * *  *    *       *   *   * *  * *    * *  *    *  * |
| ***  * * * ***  *  *   *  *   ***  ***     *   ****  **** *    **   ***  ***  |
| *    *   * *    *  *   *  *   *    *       *   *   * *  * *    * *  *    *  * |
| **** *   * *    *** ***   *   **** ****    *   *   * *  *  *** *  * **** *  * |
--------------------------------------------------------------------------------- `