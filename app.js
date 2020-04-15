const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
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
        type: "list",
        choices: [
            "ADD",
            "VIEW",
            "UPDATE",
            "DELETE"
        ]
    },
    {
        name: "create_options",
        message: "WHAT WOULD YOU LIKE TO ADD?",
        type: "list",
        when: (answers) => answers.begin === "ADD",
        choices: [
            "DEPARTMENT",
            "ROLE",
            "EMPLOYEE"
        ]
    },
    {
        name: "read_options",
        message: "WHAT WOULD YOU LIKE TO VIEW?",
        type: "list",
        when: (answers) => answers.begin === "VIEW",
        choices: [
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
        choices: [
            "EMPLOYEE ROLE",
            "EMPLOYEE MANAGER"
        ]
    },
    {
        name: "delete_options",
        message: "WHAT WOULD YOU LIKE TO DELETE?",
        type: "list",
        when: (answers) => answers.begin === "DELETE",
        choices: [
            "DEPARTMENT",
            "ROLE",
            "EMPLOYEE"
        ]
    }
]

const start = () => {
    inquirer.
        prompt(startQuestions)
        .then((answers) => {
            switch (answers.begin) {
                case "ADD":
                    createStuff(answers);
                    break;
                case "VIEW":
                    readStuff(answers);
                    break;
                case "UPDATE":
                    updateStuff(answers);
                    break;
                case "DELETE":
                    //deleteStuff;
                    break;

            }
        })
}

const createDeptQ = [
    {
        name: "add_dept",
        type: "input",
        message: "WHAT IS THE NAME OF THE DEPARTMENT?",
    }];
const createRoleQ = [
    {
        name: "add_role",
        type: "input",
        message: "WHAT IS THE NAME OF THE ROLE?",
    }];
const createEmpQ = [
    {
        name: "firstname",
        type: "input",
        message: "WHAT IS THE FIRST NAME OF THE EMPLOYEE?",
    },
    {
        name: "lastname",
        type: "input",
        message: "LAST NAME?",
    },
    {
        name: "roleid",
        type: "number",
        message: "ROLE ID?",
    },
    {
        name: "managerid",
        type: "number",
        message: "MANAGER'S ID? (optional)",
    }];
const createStuff = (answers) => {
    switch (answers.create_options) {
        case "DEPARTMENT":
            inquirer.prompt(createDeptQ).then((answer) => {
                const add_dept = answer.add_dept;
                connection.query("INSERT INTO department SET ?",
                    { name: add_dept },
                    function (err, res) {
                        if (err) throw err;
                        // connection.query("SELECT id, name FROM department")
                    })
            });
            break;

        case "ROLE":
            inquirer.prompt(createRoleQ).then((answer) => {
                const add_role = answer.add_role;
                connection.query("INSERT INTO role SET ?",
                    { title: add_role },
                    function (err, res) {
                        if (err) throw err;
                        // connection.query("SELECT id, name FROM role")
                    })
            });
            break;

        case "EMPLOYEE":
            inquirer.prompt(createEmpQ).then((answer) => {
                const firstname = answer.firstname;
                const lastname = answer.lastname;
                const roleid = answer.roleid;
                const managerid = answer.managerid
                connection.query("INSERT INTO employee SET ?",
                    {
                        first_name: firstname,
                        last_name: lastname,
                        role_id: roleid,
                        manager_id: managerid
                    },
                    function (err, res) {
                        if (err) throw err;
                        start();
                    })
            });
            // connection.query("SELECT id, first_name, last_name, role_id, manager_id FROM employee",
            //     function (err, res) { if (err) throw err })
            break;
    }
}

const readStuff = (answers) => {
    switch (answers.read_options) {
        case "DEPARTMENTS":
            connection.query("SELECT id, name FROM department",
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    start();
                });
            break;

        case "ROLES":
            connection.query("SELECT id, title, salary, department_id FROM role",
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    start();
                });
            break;

        case "EMPLOYEES":
            connection.query("SELECT id, first_name, last_name, role_id, manager_id FROM employee",
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    start();
                });


            break;
            case "EMPLOYEES BY MANAGER":
                connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id FROM employee INNER JOIN role ON employee.role_id=role.id WHERE role.title = 'Manager'",
                // { id: selection },
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    start();
                });


            break;

    }
}

const updateStuff = (answers) => {
    switch (answers.update_options) {
        case "EMPLOYEE ROLE":
            connection.query("SELECT id, first_name, last_name, role_id, manager_id FROM employee",
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    inquirer.prompt(
                        {
                            name: "update_id",
                            message: "PLEASE SELECT WHICH EMPLOYEE YOU'D LIKE TO UPDATE, BY THEIR ID.",
                            type: "number"
                        }).then((answer) => {
                            const selection = answer.update_id;
                            connection.query("SELECT id, title FROM role",
                                // { id: selection },
                                function (err, res) {
                                    if (err) throw err;
                                    console.table(res);
                                    inquirer.prompt(
                                        {
                                            name: "update_selections",
                                            message: "WHAT WOULD YOU LIKE THE EMPLOYEE'S NEW ROLE ID TO BE?",
                                            type: "number"
                                        }
                                    ).then((answer) => {
                                        const roleid = answer.update_selections;

                                        connection.query("UPDATE employee SET ? WHERE ?",
                                            [{ role_id: roleid }, { id: selection }],
                                            function (err, res) {
                                                if (err) throw err;
                                                connection.query("SELECT id, first_name, last_name, role_id, manager_id FROM employee WHERE ?",
                                                    { id: selection },
                                                    function (err, res) {
                                                        if (err) throw err;
                                                        console.table(res);
                                                        start();

                                                    })
                                            })
                                    })
                                })
                        })

                });
            break;
        case "EMPLOYEE MANAGER":
            connection.query("SELECT id, first_name, last_name, manager_id FROM employee",
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    inquirer.prompt(
                        {
                            name: "update_id",
                            message: "PLEASE SELECT WHICH EMPLOYEE YOU'D LIKE TO UPDATE, BY THEIR ID.",
                            type: "number"
                        }).then((answer) => {
                            const selection = answer.update_id;
                            connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.department_id FROM employee INNER JOIN role ON employee.role_id=role.id WHERE role.title = 'Manager'",
                                function (err, res) {
                                    if (err) throw err;
                                    console.table(res);
                                    inquirer.prompt(
                                        {
                                            name: "update_selections",
                                            message: "WHO WOULD YOU LIKE THE EMPLOYEE'S NEW MANAGER TO BE? (SELECT BY ID)",
                                            type: "number"
                                        }
                                    ).then((answer) => {
                                        const managerid = answer.update_selections;

                                        connection.query("UPDATE employee SET ? WHERE ?",
                                            [{ manager_id: managerid }, { id: selection }],
                                            function (err, res) {
                                                if (err) throw err;
                                                connection.query("SELECT id, first_name, last_name, role_id, manager_id FROM employee WHERE ?",
                                                    { id: selection },
                                                    function (err, res) {
                                                        if (err) throw err;
                                                        console.table(res);
                                                        start();

                                                    })
                                            })
                                    })
                                })
                        })

                });
            break;
    }
}