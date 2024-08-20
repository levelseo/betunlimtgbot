function buyItem(button) {
	const shopItem = button.closest('.shop-item')
	const cost = parseInt(shopItem.getAttribute('data-cost'))
	const promoCode = shopItem.getAttribute('data-promo')
	const telegramId = window.Telegram.WebApp.initDataUnsafe.user.id

	// Проверка поинтов пользователя
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
				const userPoints = data.points
				if (userPoints >= cost) {
					// Списываем поинты и показываем промокод
					fetch('/buy-item', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ telegramId, cost }),
					})
						.then((response) => response.json())
						.then((data) => {
							if (data.success) {
								alert(`Вы успешно купили товар! Ваш промокод: ${promoCode}`)
								button.disabled = true
								button.innerText = 'Куплено'
							} else {
								alert('Ошибка при покупке.')
							}
						})
				} else {
					alert('Недостаточно поинтов для покупки.')
				}
			} else {
				alert('Ошибка при проверке поинтов.')
			}
		})
		.catch((error) => console.error('Ошибка:', error))
}
