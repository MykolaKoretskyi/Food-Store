CREATE TABLE IF NOT EXISTS users
(
    id                  int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
    username            varchar(125) NOT NULL UNIQUE,
    email               varchar(125) NOT NULL UNIQUE,
    password            varchar(255) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS roles
(
    id    int4         NOT NULL GENERATED ALWAYS AS IDENTITY,
    name  varchar(125) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS users_roles
(
    user_id   int8 REFERENCES users (id),
    role_id   int4 REFERENCES roles (id),
    PRIMARY KEY (user_id, role_id)
);


CREATE TABLE IF NOT EXISTS refresh_tokens
(
    id             int8         NOT NULL GENERATED ALWAYS AS IDENTITY,
    user_id        int8         REFERENCES users (id),
    token          varchar(255) NOT NULL,
--     expired        boolean,
--     revoked        boolean,
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
    id    int8         NOT NULL GENERATED ALWAYS AS IDENTITY,
    name  varchar(255) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS url_images
(
    id         int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
    name       varchar(255) NOT NULL,
    url        varchar(255) NOT NULL UNIQUE,
--     food_id    int8 REFERENCES foods (id),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS foods
(
    id           int8         NOT NULL GENERATED ALWAYS AS IDENTITY,
    name         varchar(255) NOT NULL UNIQUE,
    description  varchar(1000) NOT NULL,
    price        double precision NOT NULL,
    cook_time    varchar(255) NOT NULL,
    favorite     boolean NOT NULL,
--     origin_id int8 REFERENCES origins (id),
    stars        float8,
--     image_url    varchar(255) NOT NULL,
    image_url    int8 REFERENCES url_images (id),
--     tag_id    int8 REFERENCES tags (id),
--     user_id   int8 REFERENCES users (id),
    is_deleted   boolean,
    PRIMARY KEY (id)
    );

CREATE TABLE IF NOT EXISTS foods_users
(
    food_id   int8 REFERENCES foods (id),
    user_id   int8 REFERENCES users (id),
    PRIMARY KEY (food_id, user_id)
);


CREATE TABLE IF NOT EXISTS foods_origins
(
    food_id    int8 REFERENCES foods (id),
    origin_id  int8 REFERENCES origins (id),
    PRIMARY KEY (food_id, origin_id)
);

CREATE TABLE IF NOT EXISTS foods_tags
(
    food_id   int8 REFERENCES foods (id),
    tag_id    int8 REFERENCES tags (id),
    PRIMARY KEY (food_id, tag_id)
);


CREATE TABLE IF NOT EXISTS items
(
    id        int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
    food_id   int8 REFERENCES foods (id),
    quantity  int4,
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
    order_id   int8 REFERENCES orders (id),
    item_id   int8 REFERENCES items (id),
    PRIMARY KEY (order_id, item_id)
    );

CREATE TABLE IF NOT EXISTS url_images
(
    id         int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
    name       varchar(255) NOT NULL,
    url        varchar(255) NOT NULL,
    food_name  varchar(255) NOT NULL,
    PRIMARY KEY (id)
);




--
-- CREATE TABLE IF NOT EXISTS languages
-- (
--     id   varchar(2) PRIMARY KEY,
--     name varchar(255) NOT NULL UNIQUE
-- );
--
--
-- CREATE TABLE IF NOT EXISTS categories
-- (
--     id       int4         NOT NULL GENERATED ALWAYS AS IDENTITY,
--     name     varchar(255) NOT NULL UNIQUE,
--     priority int4 DEFAULT 0,
--     PRIMARY KEY (id)
-- );
--
--
-- CREATE TABLE IF NOT EXISTS chitchats
-- (
--     id          int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
--     author_id   int4 REFERENCES users (id),
--     header      varchar(100) NOT NULL,
--     category_id int4 REFERENCES categories (id),
--     description varchar(255),
--     language_id varchar(2) REFERENCES languages (id),
--     level       varchar(6)  NOT NULL,
--     capacity    int4        NOT NULL,
--     time        TIMESTAMP WITHOUT TIME ZONE,
--     link        varchar(50),
--     PRIMARY KEY (id)
-- );
--
--
-- CREATE TABLE IF NOT EXISTS chitchat_users
-- (
--     chitchat_id int4 REFERENCES chitchats (id),
--     user_id     int4 REFERENCES users (id),
--     PRIMARY KEY (chitchat_id, user_id)
-- );
--
--
-- CREATE TABLE IF NOT EXISTS refresh_tokens
-- (
--     id             int8         NOT NULL GENERATED ALWAYS AS IDENTITY,
--     user_id        int4         UNIQUE,
--     refresh_tokens varchar(255) NOT NULL,
--     PRIMARY KEY (id),
--     CONSTRAINT fk_participating_users FOREIGN KEY (user_id) REFERENCES users (id)
-- );
--
--
-- CREATE TABLE IF NOT EXISTS user_data
-- (
--     user_id   int4 PRIMARY KEY,
--     firstname varchar(20) NOT NULL,
--     lastname varchar(20) NOT NULL,
--     avatar varchar(100) NULL,
--     gender varchar(6) NOT NULL,
--     dob DATE NOT NULL,
--     native_language varchar(2) NOT NULL,
--     FOREIGN KEY(user_id) REFERENCES users(id)
--     );
--
--
-- CREATE TABLE IF NOT EXISTS messages
-- (
--     id                 int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
--     author_id          int8 REFERENCES users (id),
--     chitchat_id        int8 REFERENCES chitchats (id),
--     message            varchar(255) NOT NULL,
--     created_time       TIMESTAMP WITHOUT TIME ZONE,
--     subscription_type  varchar(50),
--     PRIMARY KEY (id)
-- );
--
--
-- CREATE TABLE IF NOT EXISTS message_users
-- (
--     messages_id   int8 REFERENCES messages (id),
--     user_id       int4 REFERENCES users (id),
--     read_status   boolean,
--     PRIMARY KEY (messages_id, user_id)
-- );
--
--
-- CREATE TABLE IF NOT EXISTS permissions
-- (
--     id      int4 GENERATED ALWAYS AS IDENTITY,
--     name    varchar(20),
--     PRIMARY KEY (id)
-- );
--
--
-- CREATE TABLE IF NOT EXISTS users_permissions
-- (
--     user_id        int4 REFERENCES users (id),
--     permission_id  int4 REFERENCES permissions (id),
--     PRIMARY KEY (user_id, permission_id)
-- );
--
--
-- CREATE TABLE IF NOT EXISTS reminder_data
-- (
--     chitchat_id   int8 REFERENCES chitchats (id),
--     time          TIMESTAMP WITHOUT TIME ZONE,
--     link          varchar(255),
--     reminded      boolean,
--     locale        varchar(2),
--     PRIMARY KEY (chitchat_id)
-- );
--
--
-- CREATE TABLE IF NOT EXISTS reminder_emails
-- (
--     data_id        int8 REFERENCES reminder_data (chitchat_id),
--     email          varchar(255)
-- );
--
--
-- CREATE TABLE IF NOT EXISTS translation
-- (
--     id               int4 PRIMARY KEY,
--     message_key      varchar(100),
--     locale           varchar(2),
--     message          varchar(2000)
-- );
