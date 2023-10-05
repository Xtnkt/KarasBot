const TelegramApi = require('node-telegram-bot-api')
const {againOptions, gameOptions} = require('./options')
const token = '6658408279:AAFXzfNneoHw1bSufEMF-zrMTAfEHDp06kg'

const bot = new TelegramApi(token, {polling: true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Я загадал число от 0 до 9, угадай его!`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай число', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Информация о пользователе'},
        {command: '/game', description: 'Сыграем в игру?'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/d06/e20/d06e2057-5c13-324d-b94f-9b5a0e64f2da/11.webp')
            return bot.sendMessage(chatId, `Дарова,отец!`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Вот ты и попался, ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Wtf?')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data == chats[chatId]) {
            return  bot.sendMessage(chatId, `Поздравляю,угадал! Цифра ${chats[chatId]}`, againOptions)
        } else {
            return  bot.sendMessage(chatId, `Не угадал, Я загадал ${chats[chatId]}.`, againOptions)
        }

    })

}
start()