const express = require('express')
const bodyParser = require('body-parser')
const db = require('./database')

const app = express()
app.use(bodyParser.json())
app.use(express.static('public'))

// Функция регистрации пользователя
app.post('/register', (req, res) => {
	const { telegramId } = req.body
	db.run(
		'INSERT INTO users (telegram_id, points) VALUES (?, 500)',
		[telegramId],
		function (err) {
			if (err) {
				if (err.code === 'SQLITE_CONSTRAINT') {
					// Пользователь уже существует
					res.json({ success: true })
				} else {
					console.error(err)
					res.status(500).json({ success: false, error: err.message })
				}
			} else {
				res.json({ success: true })
			}
		}
	)
})

// Функция получения поинтов пользователя
app.post('/points', (req, res) => {
	const { telegramId } = req.body
	db.get(
		'SELECT points FROM users WHERE telegram_id = ?',
		[telegramId],
		(err, row) => {
			if (err) {
				console.error(err)
				res.status(500).json({ success: false, error: err.message })
			} else if (row) {
				res.json({ success: true, points: row.points })
			} else {
				res.status(404).json({ success: false, error: 'User not found' })
			}
		}
	)
})

app.listen(3000, () => {
	console.log('Server is running on http://localhost:3000')
})
