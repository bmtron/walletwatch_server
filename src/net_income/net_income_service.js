const IncomeService = {
    getUserNetIncome(db, user) {
        return db.select('*').from('net_income').where('user_name', user)
    },
    addNewUserNetIncome(db, item) {
        return db.insert(item).into('net_income').returning('*')
                .then(rows => {
                    return rows[0]
                })
    },
    updateUserItem(db, id, newAmount) {
        return db('net_income')
        .where({id})
        .update(newAmount)
    }
}

module.exports = IncomeService