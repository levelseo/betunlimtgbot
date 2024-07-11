window.Telegram.WebApp.ready()

const tg = window.Telegram.WebApp
const user = tg.initDataUnsafe.user

document.addEventListener('DOMContentLoaded', function () {
	registerUser(user.id)
})

function registerUser(telegramId) {
	fetch('/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ telegramId }),
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.success) {
				getUserPoints(telegramId)
			} else {
				console.error('Failed to register user')
			}
		})
		.catch((error) => console.error('Error:', error))
}

function getUserPoints(telegramId) {
	fetch('/points', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ telegramId }),
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.success) {
				document.getElementById(
					'points'
				).innerText = `У вас ${data.points} поинтов.`
			} else {
				console.error('Failed to get user points')
			}
		})
		.catch((error) => console.error('Error:', error))
}
