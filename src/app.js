require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const usersRouter = require('./users/users_router')
const authRouter = require('./auth/auth-router')
const itemsRouter = require('./monthly_items/monthly_items_router')
const incomeRouter = require('./net_income/net_income_router')
const dailyItemsRouter = require('./daily_items/daily_items_router')
const app = express()

const morganOption = (NODE_ENV === 'production' ? 'tiny' : 'common')

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())

app.get('/', (req, res) => {
    res.send('Hello, boilerplate!')
})
app.use('/api/users', usersRouter)
app.use('/api/login', authRouter)
app.use('/api/budget_items', itemsRouter)
app.use('/api/net_income', incomeRouter)
app.use('/api/daily_items', dailyItemsRouter)
app.use(function errorHandler(error, req, res, next) {
    let response
    if (process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    }
    else {
        console.log(error)
        response = { message: error.message, error}
    }
    res.status(500).json(response)
})
module.exports = app