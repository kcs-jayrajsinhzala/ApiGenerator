import inquirer from "inquirer"
import { dbConnect } from "./db";


inquirer
    .prompt([
        {
            name: 'dbName',
            message: 'Database name:',
            // default: 'test',
            default: 'node_js_boilerplate_i'
        },
        {
            name: 'dbUser',
            message: 'Database user:',
            default: 'root'
        },
        {
            name: 'dbPassword',
            message: 'Database password:',
            default: ''
        },
        {
            name: 'dbHost',
            message: 'Database Host:',
            default: 'localhost'
        },
        {
            name: 'dbDriver',
            message: 'Database Driver:',
            default: 'mysql'
        },

    ])
    .then(answers => {
        dbConnect(answers.dbName, answers.dbUser, answers.dbPassword, answers.dbHost, answers.dbDriver)
        // console.info('Answer:', answers);
    });

