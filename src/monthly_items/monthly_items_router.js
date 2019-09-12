const MonthlyService = require('./monthly_items_service')
const express = require('express')
const path = require('path')

const MonthlyRouter = express.Router()
const jsonParser = express.json()

MonthlyRouter.route('/')
.post(jsonParser, (req, res, next) => {
    const { category, amount, user_name } = req.body
    for (const field of ['category', 'amount', 'user_name'])
        if (!req.body[field])
            return res.status(400).json({
                error: `Missing '${field}' in request body`
            })
    const item = {
        category,
        amount,
        user_name
    }
    MonthlyService.addNewUserItem(req.app.get('db'), item)
        .then(item => {
            res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${item.id}`))
            .json({
                id: item.id,
                category: item.category,
                amount: item.amount,
                user_name: item.user_name
            })
        })
})
MonthlyRouter.route('/:user_name')
.get((req, res, next) => {
    
    MonthlyService.getAllUserItems(req.app.get('db'), req.params.user_name)
    .then(items => {
        if(!items) {
            res.json('There are no monthly budget items yet added for this user.')
        }
        res.json(items)
    }).catch(next)
})
MonthlyRouter.route('/:user_name/:item_id')
.delete((req, res, next) => {
    MonthlyService.deleteUserItem(req.app.get('db'), req.params.item_id)
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
})

module.exports = MonthlyRouter