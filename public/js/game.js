const canvas = document.getElementById('game-canvas')
const ctx = canvas.getContext('2d')
const gameStatus = document.getElementById('game-status')
const scoreDisplay = document.getElementById('score')
const timeDisplay = document.getElementById('time')
const endGameInfo = document.getElementById('end-game-info')
const roundScoreDisplay = document.getElementById('round-score')
const remainingAttemptsDisplay = document.getElementById('remaining-attempts')

let circles = []
let score = 0
let gameInterval
let gameDuration = 40000 // 1 minute
let gameStartTime
let remainingGames = 3 // 3 games per day

// const tg = window.Telegram.WebApp;
// const user = tg.initDataUnsafe.user;

const img = new Image()
img.src = 'img/bpop.svg'

class Circle {
	constructor(x, y, radius, speed, backgroundSize = 1) {
		this.x = x
		this.y = y
		this.radius = radius
		this.speed = speed * 1.5 // Увеличение скорости падения в 1.5 раза
		this.alive = true
		this.rotationSpeed = (Math.random() * 2 - 1) * 1.5 // Скорость вращения
		this.rotationAngle = 0 // Начальный угол вращения
		this.backgroundSize = backgroundSize // Размер фона изображения
	}

	draw() {
		if (this.alive) {
			const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius)
			gradient.addColorStop(0, '#127E1F')
			gradient.addColorStop(1, '#0C0F0D')

			ctx.save()
			ctx.translate(this.x, this.y)
			ctx.rotate((this.rotationAngle * Math.PI) / 180) // Применение вращения
			ctx.beginPath()
			ctx.arc(0, 0, this.radius, 0, Math.PI * 2)
			ctx.fillStyle = gradient
			ctx.fill()
			ctx.closePath()

			// Проверка на наличие изображения
			if (img.complete && img.naturalHeight !== 0) {
				const size = this.radius * 2 * this.backgroundSize
				ctx.drawImage(img, -size / 2, -size / 2, size, size)
			} else {
				console.error('Image is not loaded yet or failed to load')
			}

			ctx.restore()
		}
	}

	update() {
		if (this.alive) {
			this.y += this.speed
			this.rotationAngle += this.rotationSpeed // Применение вращения
			if (this.y - this.radius > canvas.height) {
				this.alive = false
			}
		}
	}

	isClicked(mouseX, mouseY) {
		const clicked =
			Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2) < this.radius
		if (clicked) {
			this.pop() // Вызов функции "лопания"
		}
		return clicked
	}

	pop() {
		const popInterval = setInterval(() => {
			this.radius -= 1
			if (this.radius <= 0) {
				clearInterval(popInterval)
				this.alive = false
			}
		}, 16)
	}
}

function startGame() {
	if (remainingGames <= 0) {
		gameStatus.innerText = 'Все игры на сегодня использованы'
		return
	}

	remainingGames--
	score = 0
	circles = []
	gameStartTime = Date.now()
	gameStatus.innerText = `Игра началась. Оставшиеся игры: ${remainingGames}`
	endGameInfo.classList.add('hidden')

	gameInterval = setInterval(() => {
		const currentTime = Date.now()
		const timeLeft = Math.max(
			0,
			Math.ceil((gameDuration - (currentTime - gameStartTime)) / 1000)
		)
		timeDisplay.innerText = `⏰: ${timeLeft}s`

		if (currentTime - gameStartTime >= gameDuration) {
			endGame()
		} else {
			updateGame()
			drawGame()
		}
	}, 1000 / 60)
}

function endGame() {
	clearInterval(gameInterval)
	gameStatus.innerText = 'End'
	roundScoreDisplay.innerText = `Score: ${score}`
	remainingAttemptsDisplay.innerText = `Tickets: ${remainingGames}`
	endGameInfo.classList.remove('hidden')

	// Обновить очки пользователя на сервере
	fetch('/update-score', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ telegramId: user.id, score }),
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.success) {
				console.log('Очки обновлены успешно')
			} else {
				console.error('Не удалось обновить очки')
			}
		})
		.catch((error) => console.error('Ошибка:', error))
}

function updateGame() {
	circles.forEach((circle) => circle.update())
	circles = circles.filter((circle) => circle.alive)

	if (Math.random() < 0.05) {
		const radius = Math.random() * 20 + 10
		const speed = Math.random() * 2 + 1
		const x = Math.random() * (canvas.width - radius * 2) + radius
		const y = -radius
		const backgroundSize = Math.random() * 0.5 + 0.75 // Размер фона от 0.75 до 1.25 радиуса
		circles.push(new Circle(x, y, radius, speed, backgroundSize))
	}

	scoreDisplay.innerText = `${score}`
}

function drawGame() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	circles.forEach((circle) => circle.draw())
}

canvas.addEventListener('click', (event) => {
	const rect = canvas.getBoundingClientRect()
	const mouseX = event.clientX - rect.left
	const mouseY = event.clientY - rect.top

	circles.forEach((circle) => {
		if (circle.isClicked(mouseX, mouseY)) {
			score++
			scoreDisplay.innerText = `${score}`
		}
	})
})

document.addEventListener('DOMContentLoaded', startGame)
