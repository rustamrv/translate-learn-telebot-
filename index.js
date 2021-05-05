import TranslateBot from './api/api_bot.js'
import {langs} from './api/config/default.js' 
 
let bot = new TranslateBot(langs)  
bot.start() 