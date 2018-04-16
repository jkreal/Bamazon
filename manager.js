const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
const log = console.log;


var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    user: 'root',
    password: 'goober',

    database: 'bamazon'
});