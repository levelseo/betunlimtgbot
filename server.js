const express = require('express')
const bodyParser = require('body-parser')
const db = require('./database')

const app = express()
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html')
})

app.get('/play', (req, res) => {
	res.sendFile(__dirname + '/public/play.html')
})

app.get('/tasks', (req, res) => {
	res.sendFile(__dirname + '/public/tasks.html')
})

app.get('/friends', (req, res) => {
	res.sendFile(__dirname + '/public/friends.html')
})

app.get('/shop', (req, res) => {
	res.sendFile(__dirname + '/public/shop.html')
})

// Маршрут для регистрации с проверкой реферальной ссылки
app.post('/register', (req, res) => {
	const { telegramId, referrerId } = req.body

	// Регистрируем нового пользователя
	db.run(
		'INSERT INTO users (telegram_id, points, games_left) VALUES (?, 500, 3)',
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

				// Если есть реферальная ссылка, добавляем 200 поинтов пригласившему
				if (referrerId) {
					db.run(
						'UPDATE users SET points = points + 200 WHERE telegram_id = ?',
						[referrerId],
						function (err) {
							if (err) {
								console.error(err)
							}
						}
					)
				}
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

// Функция получения награды
app.post('/claim-reward', (req, res) => {
	const { telegramId, reward } = req.body
	db.run(
		'UPDATE users SET points = points + ? WHERE telegram_id = ?',
		[reward, telegramId],
		function (err) {
			if (err) {
				console.error(err)
				res.status(500).json({ success: false, error: err.message })
			} else {
				res.json({ success: true })
			}
		}
	)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})
