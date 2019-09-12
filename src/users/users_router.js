const UsersService = require('./users_service')
const express = require('express')
const path = require('path')
const authService = require('../auth/auth-service')

const usersRouter = express.Router()
const jsonParser = express.json()

usersRouter.route('/')
.get((req, res, next) => {
    UsersService.getAllUsers(req.app.get('db'))
        .then(users => {
            if(!users) {
                res.json('There are no users in the database')
            }
            res.json(users)
        }).catch(next)
})
.post(jsonParser, (req, res, next) => {
    const { user_name, password, first_name, last_name} = req.body
    for (const field of ['user_name', 'password', 'first_name', 'last_name'])
        if(!req.body[field])
            return res.status(400).json({
                error: `Missing '${field}' in request body`
            })
        const passwordError = UsersService.validatePassword(password)

        if(passwordError)
            return res.status(400).json({error: passwordError})
        UsersService.hasUserWithUserName(req.app.get('db'), user_name)
            .then(hasUserWithUserName => {
                if(hasUserWithUserName)
                    return res.status(400).json({
                        error: `That user name is already taken`
                    })
                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            user_name,
                            password: hashedPassword,
                            first_name,
                            last_name
                        }
                        return UsersService.addNewUser(req.app.get('db'), newUser) 
                            .then(user => {
                                res
                                .status(201)
                                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                .json({
                                    id: user.id,
                                    user_name: user.user_name,
                                    first_name: user.first_name,
                                    last_name: user.last_name,
                                    authToken: authService.createJwt(user.user_name, {user_id: user.id})
                                })
                            })
                    })
            })
})

module.exports = usersRouter