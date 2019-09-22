  
const app = require('../src/app')
const knex = require('knex')

describe('Daily items service', function() {
    let db

    const testItems = [{
        id: 1,
        user_name: 'bmtron',
        amount: 2500
    },
    {
        id: 2,
        user_name: 'tmitch',
        amount: 4500
    },
    
]
    before('make knex instance', () => {    
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => db.raw(`TRUNCATE net_income RESTART IDENTITY CASCADE`))

    afterEach('cleanup', () => db.raw(`TRUNCATE net_income RESTART IDENTITY CASCADE`))

    describe('GET /api/net_income', () => {
        context('there are no users', () => {
            it('returns 200 and []', () => {
                return supertest(app)
                .get('/api/net_income/bmtron')
                .expect(200, [])
            })
        })
        context('there are items in the db', () => {
            beforeEach('add itetms to db', () => db.into('net_income').insert(testItems))
            const user1 = {
                user_name: 'bmtron'
            }
            const testResults = [{
                id: 1,
                user_name: 'bmtron',
                amount: 2500
            }
            ]
            it(`responds 200 with a list of items`, () => {
                return supertest(app)
                .get('/api/net_income/bmtron')
                .expect(200, testResults)
            })
        })
    })
    context('happy path', () => {
        it(`responds 201 with item in db correct`, () => {
            const user= {
                user_name: 'bmtron',
                amount: 2500
            }
            return supertest(app)
                .post('/api/net_income')
                .send(user)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.user_name).to.eql(user.user_name)
                    expect(res.body.amount).to.eql(user.amount)
                    expect(res.body.price).to.eql(user.price)
                    expect(res.headers.location).to.eql(`/api/net_income/1`)
                })
                .expect(res => 
                    db
                    .from('net_income')
                    .select('*')
                    .where({id: res.body.id})
                    .first()
                    .then(row => {
                        expect(row.user_name).to.eql(user.user_name)
                    })
                )
        })
    })
})