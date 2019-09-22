  
const app = require('../src/app')
const knex = require('knex')

describe('Daily items service', function() {
    let db

    const testItems = [{
        id: 1,
        user_name: 'bmtron',
        item_name: 't4est',
        frequency: 5,
        price: 6
    },
    {
        id: 2,
        user_name: 'tmitch',
        item_name: 'test55',
        frequency: 2,
        price: 8
    },
    {
        id: 3,
        user_name: 'bmtron',
        item_name: 'test332',
        frequency: 2,
        price: 9
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

    before('cleanup', () => db.raw(`TRUNCATE daily_items RESTART IDENTITY CASCADE`))

    afterEach('cleanup', () => db.raw(`TRUNCATE daily_items RESTART IDENTITY CASCADE`))

    describe('GET /api/daily_items', () => {
        context('there are no users', () => {
            it('returns 200 and []', () => {
                return supertest(app)
                .get('/api/daily_items/bmtron')
                .expect(200, [])
            })
        })
        context('there are items in the db', () => {
            beforeEach('add itetms to db', () => db.into('daily_items').insert(testItems))
            const user1 = {
                user_name: 'bmtron'
            }
            const testResults = [{
                id: 1,
                user_name: 'bmtron',
                item_name: 't4est',
                frequency: 5,
                price: 6
            },{
                id: 3,
                user_name: 'bmtron',
                item_name: 'test332',
                frequency: 2,
                price: 9
            }
            ]
            it(`responds 200 with a list of items`, () => {
                return supertest(app)
                .get('/api/daily_items/bmtron')
                .expect(200, testResults)
            })
        })
    })
    context('happy path', () => {
        it(`responds 201 with item in db correct`, () => {
            const user= {
                user_name: 'bmtron',
                item_name: 't4est',
                frequency: 5,
                price: 6
            }
            return supertest(app)
                .post('/api/daily_items')
                .send(user)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.user_name).to.eql(user.user_name)
                    expect(res.body.item_name).to.eql(user.item_name)
                    expect(res.body.frequency).to.eql(user.frequency)
                    expect(res.body.price).to.eql(user.price)
                    expect(res.headers.location).to.eql(`/api/daily_items`)
                })
                .expect(res => 
                    db
                    .from('daily_items')
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