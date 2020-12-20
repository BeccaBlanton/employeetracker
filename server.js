const inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  // Your username
  user: "root",

  password: "",
  database: "employee_tracker_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    connection.end()
    initQuestion()
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
    }).then(res => {
        switch (res.view){
            case "View departments":
            break;

            case "View roles":
            break;

            case "View employees":
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