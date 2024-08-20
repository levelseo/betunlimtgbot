function startTask(button) {
	const taskElement = button.closest('.task')
	const url = taskElement.getAttribute('data-url')
	const reward = parseInt(taskElement.getAttribute('data-reward'))

	// Открытие ссылки в новой вкладке
	window.open(url, '_blank')

	// Изменение текста кнопки на лоадер
	button.classList.add('loading')
	button.disabled = true

	// Задержка для проверки выполнения задания
	const delay = Math.random() * 20000 + 20000 // Рандомное время от 20 до 40 секунд
	setTimeout(() => {
		button.classList.remove('loading')
		button.classList.add('take')
		button.disabled = false
		button.innerText = 'Take'
		button.onclick = () => takeReward(button, reward)
	}, delay)
}

function takeReward(button, reward) {
	const taskElement = button.closest('.task')
	taskElement.classList.add('completed')
	button.classList.remove('take')
	button.innerText = 'Выполнено'
	button.disabled = true

	// Обновление очков пользователя на сервере
	const telegramId = window.Telegram.WebApp.initDataUnsafe.user.id
	fetch('/claim-reward', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ telegramId, reward }),
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.success) {
				console.log('Награда успешно получена')
			} else {
				console.error('Не удалось получить награду')
			}
		})
		.catch((error) => console.error('Ошибка:', error))
}
