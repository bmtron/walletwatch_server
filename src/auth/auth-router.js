const express = require('express')
const AuthService = require('./auth-service')
const authRouter = express.Router()
const jwt = require('jsonwebtoken')
const jsonBodyParser = express.json()

authRouter.route('/')
    .post(jsonBodyParser, (req, res, next) => {
        const {user_name, password } = req.body
        const loginUser = { user_name, password }

        for(const [key, value] of Object.entries(loginUser))
            if (value == null) 
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
        AuthService.getUserWithUserName(
            req.app.get('db'),
            loginUser.user_name
        )
        .then(dbUser => {
            if (!dbUser)
                return res.status(400).json({
                    error: 'Incorrect user_name or password'
                })
            return AuthService.comparePasswords(loginUser.password, dbUser.password)
                .then(compareMatch => {
                    if (!compareMatch)
                        return res.status(400).json({
                            error: 'Incorrect user_name or password'
                        })
                    const sub = dbUser.user_name
                    const payload = { user_id: dbUser.id }
                    res.send({
                        authToken: AuthService.createJwt(sub, payload)
                    })
                })
        })
        .catch(next)

    })
authRouter.route('/jwt_auth')
.post(jsonBodyParser, (req, res, next) => {
    const {authToken} = req.body
    let bearerToken = authToken.toString()
    console.log(AuthService.verifyJwt(authToken))
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
})

module.exports = authRouter