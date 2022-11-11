import inquirer from "inquirer"
import { dbConnect } from "./db";

export const generate = () => {


    inquirer
        .prompt([
            {
                name: 'dbName',
                message: 'Database name:',
                // default: 'test',
                default: 'node_js_boilerplate_i'
            },
            {
                name: 'dbPort',
                message: 'Database port:',
                // default: 'test',
                default: '3306'
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
            // dbConnect(answers.dbName, answers.dbUser, answers.dbPassword, answers.dbHost, answers.dbDriver)
            dbConnect(answers)
        });

}    
