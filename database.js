const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./betunlim.db')

db.serialize(() => {
	db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        telegram_id TEXT UNIQUE NOT NULL,
        points INTEGER DEFAULT 0,
        games_left INTEGER DEFAULT 3
    )`)
})

module.exports = db
