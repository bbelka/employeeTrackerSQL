var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "password",
    database: "empl_tracker_db"
});

connection.connect((err) => {
    if (err) throw err;
    start();
});

const startQuestions = [
    {
        name: "begin",
        message: "WHAT WOULD YOU LIKE TO DO?",
        type:"list",
        choices: [
            "ADD",
            "VIEW",
            "UPDATE",
            "DELETE"
        ]
    },
    {
        name: "add_options",
        message: "WHAT WOULD YOU LIKE TO ADD?",
        type: "list",
        when: (answers) => answers.begin === "ADD",
        choices:[
            "DEPARTMENT",
            "ROLE",
            "EMPLOYEE"
        ]
    },
    {
        name: "view_options",
        message: "WHAT WOULD YOU LIKE TO VIEW?",
        type: "list",
        when: (answers) => answers.begin === "VIEW",
        choices:[
            "DEPARTMENTS",
            "ROLES",
            "EMPLOYEES",
            "EMPLOYEES BY MANAGER"
        ]
    },
    {
        name: "update_options",
        message: "WHAT WOULD YOU LIKE TO UPDATE?",
        type: "list",
        when: (answers) => answers.begin === "UPDATE",
        choices:[
            "EMPLOYEE ROLE",
            "EMPLOYEE MANAGER"
        ]
    },
    {
        name: "delete_options",
        message: "WHAT WOULD YOU LIKE TO DELETE?",
        type: "list",
        when: (answers) => answers.begin === "DELETE",
        choices:[
            "DEPARTMENT",
            "ROLE",
            "EMPLOYEE"
        ]
    }
]

const start = () => {
    inquirer.
        prompt(startQuestions)
        // .then((answers)=> )
}