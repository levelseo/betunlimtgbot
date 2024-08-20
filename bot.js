const TelegramBot = require('node-telegram-bot-api')
const token = '7483176886:AAEdc3z3oh-_9ht_f_R85gV2EKh4cOKvenw'
const bot = new TelegramBot(token, { polling: true })

bot.onText(/\/start/, (msg) => {
	const chatId = msg.chat.id
	const webAppUrl = 'https://zingan.tech'
	bot.sendMessage(chatId, 'Запуск веб-приложения', {
		reply_markup: {
			inline_keyboard: [
				[{ text: 'Открыть веб-приложение', web_app: { url: webAppUrl } }],
			],
		},
	})
})

console.log('Бот запущен')
