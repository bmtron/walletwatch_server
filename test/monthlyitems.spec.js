  
const app = require('../src/app')
const knex = require('knex')

describe('Daily items service', function() {
    let db

    const testItems = [{
        id: 1,
        user_name: 'bmtron',
        category: 'mortgage',
        amount: 1200
    },
    {
        id: 2,
        user_name: 'tmitch',
        category: 'mortgage',
        amount: '1300'
    },
    {
        id: 3,
        user_name: 'bmtron',
        category: 'gas',
        amount: 165
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

    before('cleanup', () => db.raw(`TRUNCATE user_monthly_items RESTART IDENTITY CASCADE`))

    afterEach('cleanup', () => db.raw(`TRUNCATE user_monthly_items RESTART IDENTITY CASCADE`))

    describe('GET /api/daily_items', () => {
        context('there are no users', () => {
            it('returns 200 and []', () => {
                return supertest(app)
                .get('/api/budget_items/bmtron')
                .expect(200, [])
            })
        })
        context('there are items in the db', () => {
            beforeEach('add itetms to db', () => db.into('user_monthly_items').insert(testItems))
            const user1 = {
                user_name: 'bmtron'
            }
            const testResults = [{
                id: 1,
                user_name: 'bmtron',
                category: 'mortgage',
                amount: 1200
            },{
                id: 3,
                user_name: 'bmtron',
                category: 'gas',
                amount: 165
            }
            ]
            it(`responds 200 with a list of items`, () => {
                return supertest(app)
                .get('/api/budget_items/bmtron')
                .expect(200, testResults)
            })
        })
    })
    context('happy path', () => {
        it(`responds 201 with item in db correct`, () => {
            const user= {
                user_name: 'bmtron',
                category: 'mortgage',
                amount: 1200
            }
            return supertest(app)
                .post('/api/budget_items')
                .send(user)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.user_name).to.eql(user.user_name)
                    expect(res.body.category).to.eql(user.category)
                    expect(res.body.amount).to.eql(user.amount)
                    expect(res.headers.location).to.eql(`/api/budget_items/1`)
                })
                .expect(res => 
                    db
                    .from('user_monthly_items')
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