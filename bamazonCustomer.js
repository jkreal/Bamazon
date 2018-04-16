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

const displayProducts = new Promise(function (resolve, reject) {
    var query = 'SELECT * FROM products';

    connection.connect(function (err) {
        console.log('Welcome to Bamazon\n');
        if (err) throw err;

        console.log('Products Available:')
        connection.query(query, function (err, res) {
            for (var i = 0; i < res.length; ++i) {
                log(chalk.redBright('ID: '
                    + res[i].item_id) + chalk.yellow(' | ')
                    + chalk.greenBright(res[i].product_name) + chalk.yellow(' | ')
                    + chalk.blueBright(res[i].price));
            }
            resolve('fine');
        });
    });
});

function promptID() {
    var id;
    var quantity;

    displayProducts.then(function (response) {

        inquirer.prompt([{

            name: 'id',
            type: 'input',
            message: 'Select Item By ID: '

        }]).then(function (answers) {

            this.id = answers.id;
            console.log('id selected: ' + this.id);

            var query = 'SELECT * FROM products WHERE item_id = ?';

            connection.query(query, [this.id], function (err, res) {
                if (err) throw err;

                if (!isNaN(this.id)) {
                    console.log('Enter a number only!');
                    connection.end();
                    process.exit(1);
                } else if (res.length < 1) {
                    console.log('Item not found');
                    connection.end();
                    process.exit(1);
                }

                inquirer.prompt([{
                    name: 'quantity',
                    type: 'input',
                    message: 'Select Quantity: '
                }]).then(function (answers) {
                    this.quantity = answers.quantity;

                    if (this.quantity < 1) {
                        console.log('Invalid quantity');
                        process.exit(1);
                    }

                    checkQuantity(this.id, this.quantity);

                });

            });

        });
    }).catch(function (err) {
        console.log(err);
    });
}

function checkQuantity(itemId, quantity) {
    var query = 'SELECT stock_quantity FROM products WHERE item_id = ? AND stock_quantity >= ?';

    connection.query(query, [itemId, quantity], function (err, res) {
        if (err) throw err;

        if (res.length < 1) {
            console.log('Insufficient quantity available. Sorey!');
            process.exit(1);
        } else {
            buyProduct(itemId, quantity);
        }

    });
}

function buyProduct(itemId, quantity) {
    var query = 'UPDATE products SET stock_quantity = stock_quantity - 1 WHERE item_id = ? AND stock_quantity >= ?';

    connection.query(query, [itemId, quantity], function (err, res) {
        if (err) throw err;

        if (res.affectedRows > 0) {
            chargeWithTax(itemId);
        }
        else {
            log(log.redBright('Database did not update. You have not been charged.'))
        }

    });

}

function chargeWithTax(itemId) {
    query = 'SELECT price, product_name FROM products WHERE item_id = ?';

    connection.query(query, [itemId], function (err, res) {
        if (err) throw err;

        inquirer.prompt([{
            name: 'choice',
            type: 'confirm',
            message: 'Purchase ' + res[0].product_name + ' for $' + res[0].price + ' plus tax?'
        }]).then(function (err) {
            log(chalk.green(res[0].product_name + ' purchased for $' + (res[0].price * 1.047).toFixed(2)) );
            process.exit(1);
        });

    });
}

promptID();