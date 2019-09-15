const DailyService = {
    getAllUserDailyItems(db, user) {
        return db.select('*').from('daily_items').where('user_name', user)
    },
    addNewUserDailyItem(db, item) {
        return db.insert(item).into('daily_items').returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteDailyItem(db, id) {
        return db('daily_items').select('*').where('id', id).delete()
    }
}

module.exports = DailyService