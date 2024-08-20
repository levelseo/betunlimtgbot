const TelegramBot = require('node-telegram-bot-api')
const token = '7223416937:AAFDeA4PH1lh38W7JdKg6SULMwFm92wcheY' // Замените на ваш реальный токен
const bot = new TelegramBot(token, { polling: true })

bot.onText(/\/start/, (msg) => {
	const chatId = msg.chat.id
	const webAppUrl = 'https://zingan.dev' // URL вашего веб-приложения

	bot.sendMessage(chatId, 'Запуск веб-приложения', {
		reply_markup: {
			inline_keyboard: [
				[{ text: 'Открыть веб-приложение', web_app: { url: webAppUrl } }],
			],
		},
	})
})

console.log('Бот запущен')
