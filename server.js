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
            
            
            break;

            case "Add role":
            break;

            case "Add employee":
            break;
        }
    })
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
                connection.query(`SELECT * FROM department`, function(err,res){
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
                connection.query(`SELECT * FROM employee`, function(err,res){
                    if (err) throw err;
                    console.table(res); 
                    connection.end();
            })
            break;
        }
    })
}

function updateEmployee(){
    inquirer.prompt([{
        type: 'input',
        name: 'employee',
        message: "which employee would you like to update?"
    },
    {
        type: 'input',
        name: 'role',
        message: "what would you like thier role to be now?"
    }]).then(res => {
       
    })
}

function viewDepartments(){
    console.log(`Departments: `)
    connection.query(`SELECT * FROM department`, function(err,res){
        if (err) throw err;
        console.table(res);
    
})
}
