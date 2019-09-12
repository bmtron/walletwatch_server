const MonthlyService = {
    getAllUserItems(db, user) {
        return db.select('*').from('user_monthly_items').where('user_name', user)
    },
    addNewUserItem(db, item) {
        return db.insert(item).into('user_monthly_items').returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteUserItem(db, id) {
        return db('user_monthly_items').select('*').where('id', id).delete()
    }
}

module.exports = MonthlyService