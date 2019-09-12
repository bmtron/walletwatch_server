const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/
const bcrypt = require('bcryptjs')

const UsersService = {
    getAllUsers(db) {
        return db.select('*').from('wallet_users')
    },
    addNewUser(db, newUser) {
        return db.insert(newUser).into('wallet_users').returning('*')
                .then(rows => {
                    return rows[0]
                })
    },
    getUserById(db, id) {
        return db.from('wallet_users')
            .select('*')
            .where('id', id)
            .first()
    },
    deleteUser(db, id) {
        return db('wallet_users')
            .select('*')
            .where('id', id)
            .delete()
    },
    validatePassword(password) {
        if(password.length < 8) {
            return 'Password must be longer than 8 characters.'
        }
        if(password.length > 36) {
            return 'Password must be less than 36 characters.'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password cannot start or end with spaces.'
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain at least one uppercase letter, one lowercase letter, a number, and a special character.'
        }
        return null
    },
    hasUserWithUserName(db, user_name) {
        return db('wallet_users')
            .where({user_name})
            .first()
            .then(user => !!user)
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    }
}

module.exports = UsersService