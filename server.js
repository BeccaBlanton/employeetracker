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
        "Add to database", "View Database", "Update employee"
        ]
    }).then(res => {
        switch (res.options){
            case "Add to database":
            AddToDb();
            break;

            case "View Database":
            viewDb();
            break;

            case "Update employee":
            updateEmployee()
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
                connection.query(`SELECT name FROM department`, function(err,res){
                    if (err) throw err;
                    console.table(res); 
                    connection.end();
            })
            break;

            case "View roles":
                console.log(`Roles: `)
                connection.query(`SELECT * FROM role`, function(err,res){
                    if (err) throw err;
                    console.table(res); 
                    connection.end();
            })
            break;

            case "View employees":
                console.log(`Employees: `)
                connection.query(`SELECT first_name, last_name, title, salary
                FROM employee 
                LEFT JOIN role on employee.role_id = role.id `, function(err,res){
                    if (err) throw err;
                    console.table(res); 
                    connection.end();
            })
            break;
        }
    })
}

function updateEmployee(){
    connection.query("SELECT * FROM employee", function(err, result){
        if(err) throw err;
    inquirer.prompt([{
        type: 'rawlist',
        name: 'employee',
        message: "which employee would you like to update?",
        choices: ()=>{
            return result.map(employee => employee.first_name)
        }
    },
    {
        type: 'input',
        name:'firstName',
        message:"First name:"
    },
    {
        type: 'input',
        name:'lastName',
        message:"Last name:"
    },
    {
        type: 'input',
        name:'roleId',
        message:"Role ID:"
    },
    {
        type: 'input',
        name:'managerId',
        message:"Manager ID:"
    }]).then(result => {
       connection.query("UPDATE employee SET ? WHERE ?",
       [
           {
            first_name: result.firstName,
            last_name: result.lastName,
            role_id: parseInt(result.roleId),
            manager_id: parseInt(result.managerId)
           },
           {
            first_name: result.employee
           }
       ], function(err){
           if(err) throw err;
           console.log(`${result.firstName} was successfully updated in the employee database`);
           connection.end();
       }
       )
    })
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