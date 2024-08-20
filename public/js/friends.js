document.addEventListener('DOMContentLoaded', () => {
	const telegramId = window.Telegram.WebApp.initDataUnsafe.user.id
	const referralLink = `https://zingan.dev/register?ref=${telegramId}`
	document.getElementById('referral-link').value = referralLink
})

function copyReferralLink() {
	const referralLinkInput = document.getElementById('referral-link')
	referralLinkInput.select()
	referralLinkInput.setSelectionRange(0, 99999) // Для мобильных устройств

	document.execCommand('copy')

	alert('Ссылка скопирована в буфер обмена')
}
