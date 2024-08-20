window.Telegram.WebApp.ready()

const tg = window.Telegram.WebApp
const user = tg.initDataUnsafe.user

document.addEventListener('DOMContentLoaded', function () {
	registerUser(user.id)
})

document.addEventListener('DOMContentLoaded', () => {
	// Получаем параметры URL для проверки реферальной ссылки
	const urlParams = new URLSearchParams(window.location.search)
	const referrerId = urlParams.get('ref') // Получаем ID реферала, если есть
	const telegramId = window.Telegram.WebApp.initDataUnsafe.user.id // Получаем ID текущего пользователя

	// Отправляем данные на сервер для регистрации
	fetch('/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ telegramId, referrerId }), // Передаем ID пользователя и ID реферала
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.success) {
				console.log('Регистрация прошла успешно')
			} else {
				console.error('Ошибка регистрации')
			}
		})
		.catch((error) => console.error('Ошибка:', error))
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

function performTask(taskId, url) {
	window.open(url, '_blank')

	const button = document.querySelector(`#task-${taskId} .task-button`)
	button.innerText = 'Проверка...'
	button.disabled = true

	setTimeout(() => {
		checkSubscription(taskId, button)
	}, 5000) // Имитируем задержку для проверки подписки
}

function checkSubscription(taskId, button) {
	// Здесь вы должны реализовать реальную проверку подписки
	// Для упрощения примера мы просто меняем состояние кнопки

	button.innerText = 'Забрать награду'
	button.classList.add('reward')
	button.onclick = () => claimReward(taskId, button)
}

function claimReward(taskId, button) {
	fetch('/claim-reward', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ telegramId: user.id, taskId }),
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.success) {
				button.innerText = 'Выполнено'
				button.classList.add('completed')
				button.disabled = true
				document.getElementById(`task-${taskId}`).classList.add('completed')
				getUserPoints(user.id)
			} else {
				console.error('Failed to claim reward')
			}
		})
		.catch((error) => console.error('Error:', error))
}
