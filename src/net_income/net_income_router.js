const IncomeService = require('./net_income_service')
const express = require('express')
const path = require('path')

const IncomeRouter = express.Router()
const jsonParser = express.json()

IncomeRouter.route('/')
.post(jsonParser, (req, res, next) => {
    const {amount, user_name} = req.body
    for (const field of ['amount', 'user_name']) {
        if (!req.body[field]) {
            return res.status(400).json({
                error: `Missing ${field} in request body.`
            })
        }
    }
    const item = {
        amount,
        user_name
    }
    IncomeService.addNewUserNetIncome(req.app.get('db'), item)
        .then(item => {
            res.status(201)
            .location(path.posix.join(req.originalUrl, `/${item.id}`))
            .json({
                id: item.id,
                amount: item.amount,
                user_name: item.user_name
            })
        })
})
IncomeRouter.route('/:user_name')
.get((req, res, next) => {
    IncomeService.getUserNetIncome(req.app.get('db'), req.params.user_name)
        .then(items => {
            if(!items) {
                res.json('There is no net income recorded for this user.')
            }
            res.json(items)
        })
        .catch(next)
})
IncomeRouter.route('/:item_id')
.patch(jsonParser, (req, res, next) => {
    const {amount} = req.body
    const itemToUpdate = {amount}
    const numberOfValues = Object.values(itemToUpdate).filter(Boolean).length

    if (numberOfValues === 0) {
        return res.status(400).json({
            error: {
                message: `Request body must contain an amount.`
            }
        })
    }
    IncomeService.updateUserItem(
        req.app.get('db'),
        req.params.item_id,
        itemToUpdate
    ).then(numRowsAffected => {
        res.status(204).end()
    })
    .catch(next)
})

module.exports = IncomeRouter