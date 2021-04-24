import TranslateBot from './api/api_bot.js'
import langs from './api/languages.js' 
 
let bot = new TranslateBot(langs)  
bot.start()
bot.langs_commands()