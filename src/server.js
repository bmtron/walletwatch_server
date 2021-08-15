const app = require('./app')
const { PORT, DB_URL } = require('./config')
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: 'postgresql://bmtron:goalie30@localhost/walletwatch'
})

app.set('db', db)
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})