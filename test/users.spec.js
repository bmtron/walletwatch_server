  
const app = require('../src/app')
const knex = require('knex')

describe('Users service', function() {
    let db

    const testUsers = [{
        id: 1,
        user_name: 'bmtron',
        password: 'Goalie#30',
        first_name: 'brendan',
        last_name: 'meehan'
    },
    {
        id: 2,
        user_name: 'tmitch',
        password: 'Tyler#111',
        first_name: 'tyler',
        last_name: 'mitchell'
    }
]
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

    describe('GET /api/users', () => {
        context('there are no users', () => {
            it('returns 200 and []', () => {
                return supertest(app)
                .get('/api/users')
                .expect(200, [])
            })
        })
        context('there are users in the db', () => {
            beforeEach('add users to db', () => db.into('wallet_users').insert(testUsers))
            it(`responds 200 with a list of users`, () => {
                return supertest(app)
                .get('/api/users')
                .expect(200, testUsers)
            })
        })
    })
    context('happy path', () => {
        it(`responds 200 storing bcrypted password`, () => {
            const newUser = {

                user_name: 'test user_name',
                password: '11AAaa!!',
                first_name: 'hello',
                last_name: 'hello1'
            }
            return supertest(app)
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.user_name).to.eql(newUser.user_name)
                    expect(res.body.first_name).to.eql(newUser.first_name)
                    expect(res.body.last_name).to.eql(newUser.last_name)
                    expect(res.body).to.not.have.property('password')
                    expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
                })
                .expect(res => 
                    db
                    .from('wallet_users')
                    .select('*')
                    .where({id: res.body.id})
                    .first()
                    .then(row => {
                        expect(row.user_name).to.eql(newUser.user_name)
                    })
                )
        })
    })
})