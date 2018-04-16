const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
const sleep = require('system-sleep');
const log = console.log;


var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    user: 'root',
    password: 'goober',

    database: 'bamazon'
});

function displayProducts() {
    var query = 'SELECT * FROM products';

    console.log('Products Available:');
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; ++i) {
            log(chalk.redBright('ID: '
                + res[i].item_id) + chalk.yellow(' | ')
                + chalk.greenBright(res[i].product_name) + chalk.yellow(' | ')
                + chalk.blueBright(res[i].price) + chalk.yellow(' | ')
                + chalk.white('Stock: ' + res[i].stock_quantity));

            sleep(50);
        }
        startPrompt();
    });

}

function viewLowInventory() {
    var query = 'SELECT * FROM products WHERE stock_quantity < 5';

    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; ++i) {
            log(chalk.redBright('ID: '
                + res[i].item_id) + chalk.yellow(' | ')
                + chalk.greenBright(res[i].product_name) + chalk.yellow(' | ')
                + chalk.blueBright(res[i].price) + chalk.yellow(' | ')
                + chalk.white('Stock: ' + res[i].stock_quantity));

            sleep(50);
        }
        startPrompt();
    });
}

function addToInventory() {
    inquirer.prompt([{
        name: 'id',
        type: 'input',
        message: 'Enter item id'
    }]).then(function (answers) {
        var query = 'SELECT * FROM products WHERE item_id = ?'
        connection.query(query, [answers.id], function (err, res) {
            if (err) throw err;

            if (res.length < 1) {
                console.log('Item not found');
                sleep(2000);
                startPrompt();
            }

            addQuantity(answers.id);
        });
    });
}

function addQuantity(itemId) {
    inquirer.prompt([{
        name: 'quantity',
        type: 'input',
        message: 'Enter quantity to add'
    }]).then(function (answers) {
        if (isNaN(answers.quantity)) {
            console.log('That is not a number, silly.');
        } else if (answers.quantity < 1) {
            console.log('That is an invalid quantity to add');
        } else {
            var query = 'UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?';
            connection.query(query, [answers.quantity, itemId], function (err, res) {
                if (err) throw err;

                if (res.affectedRows > 0) {
                    console.log('Added ' + answers.quantity + ' to item id ' + itemId);
                }

                startPrompt();
            });
        }
    });


}

function startPrompt() {
    inquirer.prompt([{
        name: 'menu',
        type: 'list',
        message: 'Select a management function: ',
        choices: ['View Products For Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit'],
        default: 0
    }]).then(function (answers) {
        switch (answers.menu) {
            case 'View Products For Sale':
                displayProducts();
                break;
            case 'View Low Inventory':
                viewLowInventory();
                break;
            case 'Add to Inventory':
                addToInventory();
                break;
            case 'Add New Product':
                break;
            case 'Exit':
                process.exit(1);
                break;
            default:
                break;
        }

    });
}

connection.connect(function (err) {
    startPrompt();
});

