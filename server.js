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
        "Add to a database", "View a Database", "Update employee", "Delete from a database","Exit Employee Tracker"
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

            case "Exit Employee Tracker":
            console.log("Good Bye")
            connection.end()
        }
    })
}

function AddToDb(){
    inquirer.prompt({
        type: 'list',
        name: 'add',
        message: "what would you like to add?",
        choices: [
        "Add department", "Add role", "Add employee", "exit"
        ]
    }).then(res => {
        switch (res.add){
            case "Add department":
                addDept();
            break;

            case "Add role":
                addRole();
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
                    initQuestion();
                }
            )
            })
                
            break;

            case "exit":
            console.log("Good Bye");
            connection.end();
        }   
});
}

function addDept(){
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
        initQuestion();
    }
)
})
}
function addRole(){
    connection.query(`SELECT * FROM department`, function(err, result){
        if(err) throw err;
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
        type: 'list',
        name:'department',
        message:"What department is this role in?",
        choices: ()=>{
            return result.map(department => department.name)
        }
    }
    ]).then(answers => {
    connection.query(`SELECT name, id FROM department WHERE ?`, 
    {name: answers.department},
    function(err, dept){
    connection.query(`INSERT INTO role SET ?`,
    {
       title: answers.title,
       salary: parseInt(answers.salary),
       department_id: parseInt(dept[0].id) 
    }, function(err){
        if (err) throw err;
        console.table(`adding ${answers.title} into role database`); 
        initQuestion();
    }
)
});
})
});
}

function viewDb(){
    inquirer.prompt({
        type: 'list',
        name: 'view',
        message: "what would you like to view?",
        choices: [
        "View departments", "View roles", "View employees", "exit"
        ]
    }).then(result => {
        switch (result.view){
            case "View departments":
                console.log(`Departments: `)
                connection.query(`SELECT department.id, name AS 'Department', title AS "Job Titles" FROM department
                LEFT JOIN role on role.department_id = department.id
                ORDER BY name`, function(err,res){
                    if (err) throw err;
                    console.table(res); 
                    initQuestion();
            })
            break;

            case "View roles":
                console.log(`Roles: `)
                connection.query(`SELECT role.id, title, salary, name AS 'department' FROM role
                LEFT JOIN department on role.department_id = department.id`, function(err,res){
                    if (err) throw err;
                    console.table(res); 
                    initQuestion();
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
                    initQuestion();
            })
            break;

            case "exit":
            console.log("Good Bye");
            connection.end();
        }
    })
}


function updateEmployee(){

    connection.query(`SELECT * FROM employee`, function(err, result){
        if(err) throw err;
    inquirer.prompt({
        type: 'list',
        name: 'employee',
        message: "which employee would you like to update?",
        choices: ()=>{
            return result.map(employee => employee.first_name)
        }
    }).then(employeeData => {
        connection.query(`SELECT * FROM role`, function(err, result2){
            if(err) throw err;
        inquirer.prompt({
        type: 'list',
        name:'role',
        message:"New Role:",
        choices: ()=>{
            return result2.map(role => role.title)
        }
    })
    .then(roleData => {
        connection.query("SELECT title, id FROM role WHERE ?",
        [
            {
                title: roleData.role
            }
        ], function(err, newRole){
            if(err) throw err;
            connection.query("UPDATE employee SET ? WHERE ?",[
           {
            role_id: newRole[0].id
           },
           {
            first_name: employeeData.employee
           }
       ], function(err){
           if(err) throw err;
           console.log(`${employeeData.employee} was successfully updated to ${roleData.role} in the employee database`);
           initQuestion();
       })
    })
    })})
}) })
}
function deleteDb(){
    inquirer.prompt({
        type: 'list',
        name: 'delete',
        message: "what would you like to delete?",
        choices: [
        "department", "role", "employee", "exit"
        ]
    }).then(result => {
        switch (result.delete){
            case "department":
                deleteDepartment();
            break;

            case "role":
               deleteRole();
            break;

            case "employee":
               deleteEmployee(); 
            break;

            case "exit":
            console.log("Good Bye");
            connection.end();
        }
    })
}
function deleteDepartment(){
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
       initQuestion();
   }
   )
})
})
}
function deleteRole(){
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
           initQuestion();
       }
       )
    })
})
}
function deleteEmployee(){
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
           initQuestion();
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
module.exports = connection