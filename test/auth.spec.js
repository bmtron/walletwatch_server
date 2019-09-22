const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const bcrypt = require('bcryptjs')

describe('Auth Endpoints', function() {
    let db

    const Users = [
    {
        id: 1,
        user_name: 'bmtron',
        password: 'goalie',
        first_name: 'brendan',
        last_name: 'meehan'
    },
    {
        id: 2,
        user_name: 'tmitch',
        password: 'r',
        first_name: 'tyler',
        last_name: 'mitchell'
    }
]
function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('wallet_users').insert(preppedUsers)
        .then(() => {
            db.raw(`SELECT setval('wallet_users_id_seq', ?)`,
            [users[users.length - 1].id])
        })
}
    const testUser = Users[0]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => db.raw(`TRUNCATE wallet_users RESTART IDENTITY CASCADE`))

    afterEach('cleanup', () => db.raw(`TRUNCATE wallet_users RESTART IDENTITY CASCADE`))

    describe('POST /api/auth/login', () => {
        beforeEach('insert users', () => seedUsers(db, Users))
        const requiredFields = ['user_name', 'password']

        requiredFields.forEach(field => {
            const loginAttemptBody = {
                user_name: testUser.user_name,
                password: testUser.password,
                
            }
            it(`responds with 400 required error when '${field}' is missing`, () => {
                delete loginAttemptBody[field]

                return supertest(app)
                    .post('/api/login')
                    .send(loginAttemptBody)
                    .expect(400, {
                        error: `Missing '${field}' in request body`
                    })
            })
        })
        it(`responds 400 'invalid user_name or password' when bad creds`, () => {
            const userInvalidUser = { user_name: 'user_nnot', password: 'badpass'}
            return supertest(app)
                .post('/api/login')
                .send(userInvalidUser)
                .expect(400, { error: `Incorrect user_name or password`})
        })
        it(`responds 400 'invalid user_name or password' when bad password`, () => {
            const userInvalidPass = {user_name: testUser.user_name, password: 'badpass'}
            return supertest(app)
                .post('/api/login')
                .send(userInvalidPass)
                .expect(400, { error: `Incorrect user_name or password`})
        })
        it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
            const userValidCreds = {
                user_name: testUser.user_name,
                password: testUser.password
            }
            const expectedToken = jwt.sign(
                {user_id: testUser.id},
                process.env.JWT_SECRET,
                {
                    subject: testUser.user_name,
                    algorithm: 'HS256'
                }
            )
            return supertest(app)
                .post('/api/login')
                .send(userValidCreds)
                .expect(200, {
                    authToken: expectedToken
                })
        })
    })
})