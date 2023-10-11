INSERT INTO origins
VALUES (DEFAULT, 'ITALY'),
       (DEFAULT, 'PERSIA'),
       (DEFAULT, 'MIDDLE_EAST'),
       (DEFAULT, 'CHINA'),
       (DEFAULT, 'GERMANY'),
       (DEFAULT, 'US'),
       (DEFAULT, 'BELGIUM'),
       (DEFAULT, 'FRANCE'),
       (DEFAULT, 'INDIA'),
       (DEFAULT, 'ASIA');

INSERT INTO tags
VALUES (DEFAULT, 'FAST_FOOD'),
       (DEFAULT, 'PIZZA'),
       (DEFAULT, 'LUNCH'),
       (DEFAULT, 'SLOW_FOOD'),
       (DEFAULT, 'HAMBURGER'),
       (DEFAULT, 'FRY'),
       (DEFAULT, 'SOUP'),
       (DEFAULT, 'DESSERT');

INSERT INTO url_images
VALUES (DEFAULT, '0_food-0.jpg', '/assets/images/foods/0_food-0.jpg'),
       (DEFAULT, '1_food-1.jpg', '/assets/images/foods/1_food-1.jpg'),
       (DEFAULT, '2_food-2.jpg', '/assets/images/foods/2_food-2.jpg'),
       (DEFAULT, '3_food-3.jpg', '/assets/images/foods/3_food-3.jpg'),
       (DEFAULT, '4_food-4.jpg', '/assets/images/foods/4_food-4.jpg'),
       (DEFAULT, '5_food-5.jpg', '/assets/images/foods/5_food-5.jpg'),
       (DEFAULT, '6_food-6.jpg', '/assets/images/foods/6_food-6.jpg'),
       (DEFAULT, '7_food-7.jpg', '/assets/images/foods/7_food-7.jpg'),
       (DEFAULT, '8_food-8.jpg', '/assets/images/foods/8_food-8.jpg'),
       (DEFAULT, '9_food-9.jpg', '/assets/images/foods/9_food-9.jpg'),
       (DEFAULT, '10_food-10.jpg', '/assets/images/foods/10_food-10.jpg'),
       (DEFAULT, '11_food-11.jpg', '/assets/images/foods/11_food-11.jpg'),
       (DEFAULT, '12_food-12.jpg', '/assets/images/foods/12_food-12.jpg');


INSERT INTO foods
VALUES (DEFAULT, 'Pizza Pepperoni', 'Description of what the dish is made of', 10, '10-20', false, 0.0, 2, false),
       (DEFAULT, 'Meat with vegetables', 'Description of what the dish is made of', 12, '15-25', false, 0.0, 3, false),
       (DEFAULT, 'Pasta with seafood', 'Description of what the dish is made of', 9, '10-20', false, 0.0, 4, false),
       (DEFAULT, 'Vegetables with mango', 'Description of what the dish is made of', 8, '10-15', false, 0.0, 5, false),
       (DEFAULT, 'Fried potatoes', 'Description of what the dish is made of', 8, '10-20', false, 0.0, 6, false),
       (DEFAULT, 'Vegetable Soup', 'Description of what the dish is made of', 7, '10-20', false, 0.0, 7, false),
       (DEFAULT, 'Sandwich with cheese and salad', 'Description of what the dish is made of', 7, '10-20', false, 0.0, 8, false),
       (DEFAULT, 'Peanut dessert', 'Description of what the dish is made of', 7, '5-15', false, 0.0, 9, false),
       (DEFAULT, 'Pepsi cola', 'Description of what the dish is made of', 2, '5-15', false, 0.0, 10, false),
       (DEFAULT, 'Apple juice', 'Description of what the dish is made of', 2, '5-15', false, 0.0, 11, false),
       (DEFAULT, 'Buckwheat with chicken and vegetables', 'Buckwheat with fried chicken, tomato, corn, cucumber and greens', 8, '15-20', false, 0.0, 12, false),
       (DEFAULT, 'Vegetables in a creamy sauce', 'Arugula, bell pepper, cucumber, olives and onion in a creamy sauce', 6, '10-15', false, 0.0, 13, false);

INSERT INTO foods_origins
VALUES (1, 1),
       (2, 2),
       (2, 3),
       (2, 4),
       (3, 1),
       (4, 1),
       (4, 6),
       (5, 7),
       (5, 8),
       (6, 9),
       (6, 10),
       (7, 5),
       (7, 6),
       (8, 7),
       (8, 8),
       (9, 6),
       (10, 5),
       (10, 6),
       (10, 7),
       (10, 8),
       (11, 3),
       (11, 5),
       (12, 1),
       (12, 7);

INSERT INTO foods_tags
VALUES (1, 1),
       (1, 2),
       (1, 3),
       (2, 3),
       (2, 4),
       (3, 3),
       (3, 4),
       (4, 3),
       (4, 4),
       (5, 1),
       (5, 6),
       (6, 4),
       (6, 7),
       (7, 1),
       (7, 5),
       (8, 8),
       (9, 1),
       (9, 3),
       (10, 1),
       (10, 3),
       (11, 3),
       (11, 4),
       (12, 3),
       (12, 4);

INSERT INTO roles
VALUES (DEFAULT, 'ADMIN'),
       (DEFAULT, 'USER'),
       (DEFAULT, 'MANAGER');

INSERT INTO users
VALUES (DEFAULT, 'testUser2', 'useremail2@gmail.com',
        '$2a$12$jT.nKuZmve3EWeKLlmuLYeNFCNh9ezb7zSXYSjKrHTwilPSKu.1LS',
        true, true, true, true),
       (DEFAULT, 'testUser1', 'useremail1@gmail.com',
        '$2a$12$jT.nKuZmve3EWeKLlmuLYeNFCNh9ezb7zSXYSjKrHTwilPSKu.1LS',
        true, true, true, true),
       (DEFAULT, 'testUser3', 'useremail3@gmail.com',
        '$2a$12$jT.nKuZmve3EWeKLlmuLYeNFCNh9ezb7zSXYSjKrHTwilPSKu.1LS',
        true, true, true, true);


INSERT INTO users_roles
VALUES (1, 1),
       (1, 2),
       (2, 2),
       (3, 2);
