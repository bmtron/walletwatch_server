const express = require('express')
const AuthService = require('./auth-service')
const jwtRouter = express.Router()
const jwt = require('jsonwebtoken')
const jsonBodyParser = express.json()

jwtRouter.route('/')
.post(jsonBodyParser, (req, res, next) => {
    const {authToken} = req.body
    try {
                const payload = AuthService.verifyJwt(authToken)
        
                AuthService.getUserWithUserName(
                req.app.get('db'),
                payload.sub,
            )
                .then(user => {
                if (!user)
                    return res.status(401).json({ error: 'Unauthorized request' })
        
                  next()
                })
                .catch(err => {
                    console.error(err)
                    next(err)
                })
            } catch(error) {
              res.status(401).json({ error: 'Unauthorized request' })
            }
    res.json(201).end()
})

module.exports = jwtRouter
