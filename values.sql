USE bamazon;

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES 
(101, "Giant Clam", "Agriculture", 154.99, 14),
(111, "iPhone XVII", "Electronics", 4999.99, 77),
(112, "14 in Cucumber", "Agriculture", 7.69, 12),
(133, "Diamondium Ring", "Jewellery", 45999.99, 2),
(122, "Diamondillium Pendant", "Jewellery", 79999.99, 2),
(144, "Final Fantasy CVIX", "Video Games", 79.99, 25),
(233, "Monster Hunter: Unvierse", "Video Games", 59.99, 25),
(145, "Mountain Dew Vinegar", "Soft Drinks", 2.49, 117),
(633, "Mountain Dew Baking Soda", "Soft Drinks", 2.49, 158),
(123, "The Legend of Zelda: Ocarina of Time 4k", "Video Games", 69.99, 5),
(644, "Nautical Themed Pashmina Afghan", "Clothing", 14.99, 14),
(233, "14LB Sodium Fluoride", "Chemicals", 189.99, 14),
(433, "Liquid Nitrogen", "Chemicals", 159.99, 14);

SELECT * FROM products;