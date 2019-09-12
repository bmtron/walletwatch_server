CREATE TABLE user_monthly_items (
    id serial PRIMARY KEY,
    category TEXT NOT NULL,
    amount INTEGER NOT NULL,
    user_name TEXT NOT NULL
);