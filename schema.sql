CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
	item_id INT(32) NOT NULL,
    product_name VARCHAR(255),
    department_name VARCHAR(255),
    price DEC(10,2),
    stock_quantity INT(32)
);