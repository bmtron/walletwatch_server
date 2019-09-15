const DailyService = require('./daily_items_service')
const express = require('express')
const path = require('path')

const DailyRouter = express.Router()
const jsonParser = express.json()

DailyRouter.route('/')
.post(jsonParser, (req, res, next) => {
    const {item_name, frequency, price, user_name } = req.body
    for (const field of ['item_name', 'frequency', 'price', 'user_name']) {
        if (!req.body[field]) {
            return res.status(400).json({
                error: {
                    message: `Missing '${field}' in request body.`
                }
            })
        }
    }
    const newItem = {item_name, frequency, price, user_name}

    DailyService.addNewUserDailyItem(req.app.get('db'), newItem)
        .then(item => {
            res.status(201)
            .location(path.posix.join(req.originalUrl), `/${item.id}`)
            .json({
                id: item.id,
                item_name: item.item_name,
                frequency: item.frequency,
                price: item.price,
                user_name: item.user_name
            })
        })
})
DailyRouter.route('/:user_name')
.get((req, res, next) => {

    DailyService.getAllUserDailyItems(req.app.get('db'), req.params.user_name)
        .then(items => {
            if(!items) {
                res.status(400).json({
                    error: `No items for user found`
                })
            }
            res.json(items)
        }).catch(next)
})
DailyRouter.route('/:item_id')
.delete((req, res, next) => {
    DailyService.deleteDailyItem(req.app.get('db'), req.params.item_id)
    .then(() => {
        res.status(204).end()
    })
    .catch(next)
})

module.exports = DailyRouter