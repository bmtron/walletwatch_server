module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DATABASE_URL || 'postgresql://bmtron@localhost/walletwatch',
    JWT_SECRET: process.env.JWT_SECRET || 'this-is-a-secret',
}