CREATE TABLE daily_items (
    id serial PRIMARY KEY,
    user_name TEXT NOT NULL,
    item_name TEXT NOT NULL,
    frequency INTEGER NOT NULL,
    price FLOAT NOT NULL
);