CREATE TABLE IF NOT EXISTS users
(
    id       int8         NOT NULL GENERATED ALWAYS AS IDENTITY,
    username varchar(125) NOT NULL UNIQUE,
    email    varchar(125) NOT NULL UNIQUE,
    password varchar(255) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS roles
(
    id   int4         NOT NULL GENERATED ALWAYS AS IDENTITY,
    name varchar(125) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS users_roles
(
    user_id int8 REFERENCES users (id),
    role_id int4 REFERENCES roles (id),
    PRIMARY KEY (user_id, role_id)
);


CREATE TABLE IF NOT EXISTS refresh_tokens
(
    id      int8         NOT NULL GENERATED ALWAYS AS IDENTITY,
    user_id int8 REFERENCES users (id),
    token   varchar(255) NOT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS origins
(
    id   int8         NOT NULL GENERATED ALWAYS AS IDENTITY,
    name varchar(255) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS tags
(
    id   int8         NOT NULL GENERATED ALWAYS AS IDENTITY,
    name varchar(255) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS url_images
(
    id   int8         NOT NULL GENERATED ALWAYS AS IDENTITY,
    name varchar(255) NOT NULL,
    url  varchar(255) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS foods
(
    id          int8             NOT NULL GENERATED ALWAYS AS IDENTITY,
    name        varchar(255)     NOT NULL UNIQUE,
    description varchar(1000)    NOT NULL,
    price       double precision NOT NULL,
    cook_time   varchar(255)     NOT NULL,
    favorite    boolean          NOT NULL,
    stars       float8,
    image_url   int8 REFERENCES url_images (id),
    is_deleted  boolean,
    PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS foods_users
(
    food_id int8 REFERENCES foods (id),
    user_id int8 REFERENCES users (id),
    PRIMARY KEY (food_id, user_id)
);


CREATE TABLE IF NOT EXISTS foods_origins
(
    food_id   int8 REFERENCES foods (id),
    origin_id int8 REFERENCES origins (id),
    PRIMARY KEY (food_id, origin_id)
);


CREATE TABLE IF NOT EXISTS foods_tags
(
    food_id int8 REFERENCES foods (id),
    tag_id  int8 REFERENCES tags (id),
    PRIMARY KEY (food_id, tag_id)
);


CREATE TABLE IF NOT EXISTS items
(
    id       int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
    food_id  int8 REFERENCES foods (id),
    quantity int4,
    PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS orders
(
    id                 int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
    username           varchar(125),
    full_name          varchar(125),
    total_price        float8,
    delivery_address   varchar(255),
    phone_number       varchar(125),
    status             varchar(125),
    date_time          TIMESTAMP WITHOUT TIME ZONE,
    manager_name       varchar(125),
    change_status_date TIMESTAMP WITHOUT TIME ZONE,
    date_completed     TIMESTAMP WITHOUT TIME ZONE,
    PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS items_orders
(
    order_id int8 REFERENCES orders (id),
    item_id  int8 REFERENCES items (id),
    PRIMARY KEY (order_id, item_id)
);


CREATE TABLE IF NOT EXISTS url_images
(
    id        int4         NOT NULL GENERATED ALWAYS AS IDENTITY,
    name      varchar(255) NOT NULL,
    url       varchar(255) NOT NULL,
    food_name varchar(255) NOT NULL,
    PRIMARY KEY (id)
);
