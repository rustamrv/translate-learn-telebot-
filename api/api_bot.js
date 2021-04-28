import TelegramBot from "node-telegram-bot-api";
import translete_text from './utils.js'
import InterfaceLanguages from './utils_lang.js' 
import dotenv from 'dotenv'

dotenv.config()

function User(_user) {
    const user = _user 
    let language = null 

    function setLanguage(_language) {
        language = _language
    }
    function getLanguage(){
        return language
    }
    return Object.freeze({
        user,
        setLanguage,
        getLanguage
    });
}

function InterFaceBot(langs) {
    const bot = new TelegramBot(process.env.TOKEN,
        {
            webHook: {
                port: process.env.PORT
            }
        }
        )
    bot.setWebHook(`${process.env.webhook_url}` + bot.token)
    const interfaceLang_ = new InterfaceLanguages(langs)
     
    return Object.freeze({
        bot,
        interfaceLang_
    });
}

function TranslateBot(langs) {
    const obj = InterFaceBot(langs)
    let user = null
    function start() {
        obj.bot.onText(/\/start/, async function (msg) {
            try {
                const { chat: { id } } = msg
                let username = msg.from.first_name;
                if (!username) {
                    username = msg.from.username
                }
                user = await new User(msg.from) 
                let start_text = "Привет, " + username + " 👋🏻 Я бот-переводчик. 😎 \n" +
                    "Я умею переводить на " + Object.keys(langs).length + " языков. 🎓  \n" +
                    "Выбери команду: \n" +
                    "/translate - перевести текст \n" +
                    "/settings - настройка \n" +
                    "/about - о боте"   
               
                await obj.bot.sendMessage(id, start_text);

            } catch (err) {
                console.log(err)
            }
        })
        obj.bot.onText(/\/about/, async function (msg) {
            try {
                const { chat: { id } } = msg
                if (!user) {
                    user = await new User(msg.from)
                } 
                obj.bot.sendMessage(id, 'Bot beta-version 1.3 \n' + Object.keys(langs).length + ' languages.\nAuthor ' + process.env.author)
            } catch (err) {
                console.log(err);
            }
        })
        obj.bot.onText(/\/translate/, async function (msg) {
            try {
                const { chat: { id } } = msg
                if (!user) {
                    console.log('err');
                    return
                }
                let username = msg.from.first_name;
                if (!username) {
                    username = msg.from.username
                }
 
                let lang = await user.getLanguage()
                if (!lang) {
                    obj.bot.sendMessage(id, username + ', вы не выбрали язык.\nВыбрать язык /changeLanguage')
                } else {
                    obj.bot.sendMessage(id, 'Выбан язык ' + lang + '\nВведите текст для перевода:')
                    obj.bot.once("message", async function (msg) {
                        const { chat: { id } } = msg
                        const { text, document, entities } = msg
                        if(entities){
                            return
                        }
                        let result = await translete_text(text, lang)
                        obj.bot.sendMessage(id, result + "\nЕще раз? /translate\nИзменить язык /changeLanguage")
                    })
                }
            } catch (err) {
                console.log(err);
            }
        })

        obj.bot.onText(/\/settings/, async function (msg) {
            try {
                const { chat: { id } } = msg
                obj.bot.sendMessage(id,'Настройка языка /changeLanguage')
            } catch (err) {
                console.log(err);
            }
        })
        obj.bot.onText(/\/changeLanguage/, async function (msg) {
            try {
                const { chat: { id } } = msg
                let lang = await obj.interfaceLang_.getlang()
                obj.bot.sendMessage(id,'Выбери на какой язык переводить. Например English')
                obj.bot.sendMessage(id, lang)
            } catch (err) {
                console.log(err);
            }
        })
        obj.bot.onText(/\/ar/, async function (msg) {
            const { chat: { id } } = msg
            obj.bot.sendMessage(id, "Язык установлен " + obj.interfaceLang_.getCode("ar") + " /translate")
            try {
                if (!user) {
                    user = await new User(msg.from, "ar")
                }
                user.setLanguage("ar")
            } catch (err) {
                console.log(err)
            }
        })
        obj.bot.onText(/\/hy/, async function (msg) {
            const { chat: { id } } = msg
            obj.bot.sendMessage(id, "Язык установлен " + obj.interfaceLang_.getCode("hy") + " /translate")
            try {
                if (!user) {
                    user = await new User(msg.from, "hy")
                }
                user.setLanguage("hy")
            } catch (err) {
                console.log(err)
            }
        })
        obj.bot.onText(/\/az/, async function (msg) {
            const { chat: { id } } = msg
            obj.bot.sendMessage(id, "Язык установлен " + obj.interfaceLang_.getCode("az") + " /translate")
            try {
                if (!user) {
                    user = await new User(msg.from, "az")
                }
                user.setLanguage("az")
            } catch (err) {
                console.log(err)
            }
        })
        obj.bot.onText(/\/en/, async function (msg) {
            const { chat: { id } } = msg
            obj.bot.sendMessage(id, "Язык установлен " + obj.interfaceLang_.getCode("en") + " /translate")
            try {
                if (!user) {
                    user = await new User(msg.from, "en")
                }
                user.setLanguage("en")
            } catch (err) {
                console.log(err)
            }
        })
        obj.bot.onText(/\/fr/, async function (msg) {
            const { chat: { id } } = msg
            obj.bot.sendMessage(id, "Язык установлен " + obj.interfaceLang_.getCode("fr") + " /translate")
            try {
                if (!user) {
                    user = await new User(msg.from, "fr")
                }
                user.setLanguage("fr")
            } catch (err) {
                console.log(err)
            }
        })
        obj.bot.onText(/\/de/, async function (msg) {
            const { chat: { id } } = msg
            obj.bot.sendMessage(id, "Язык установлен " + obj.interfaceLang_.getCode("de") + " /translate")
            try {
                if (!user) {
                    user = await new User(msg.from, "de")
                }
                user.setLanguage("de")
            } catch (err) {
                console.log(err)
            }
        })
        obj.bot.onText(/\/ka/, async function (msg) {
            const { chat: { id } } = msg
            obj.bot.sendMessage(id, "Язык установлен " + obj.interfaceLang_.getCode("ka") + " /translate")
            try {
                if (!user) {
                    user = await new User(msg.from, "ka")
                }
                user.setLanguage("ka")
            } catch (err) {
                console.log(err)
            }
        })
        obj.bot.onText(/\/ru/, async function (msg) {
            const { chat: { id } } = msg
            obj.bot.sendMessage(id, "Язык установлен " + obj.interfaceLang_.getCode("ru") + " /translate")
            try {
                if (!user) {
                    user = await new User(msg.from, "ru")
                }
                user.setLanguage("ru")
            } catch (err) {
                console.log(err)
            }
        })
        obj.bot.onText(/\/turk/, async function (msg) {
            const { chat: { id } } = msg
            obj.bot.sendMessage(id, "Язык установлен " + obj.interfaceLang_.getCode("tr") + " /translate")
            try {
                if (!user) {
                    user = await new User(msg.from, "tr")
                }
                user.setLanguage("tr")
            } catch (err) {
                console.log(err)
            }
        })
        obj.bot.onText(/\/uk/, async function (msg) {
            const { chat: { id } } = msg
            obj.bot.sendMessage(id, "Язык установлен " + obj.interfaceLang_.getCode("uk") + " /translate")
            try {
                if (!user) {
                    user = await new User(msg.from, "uk")
                }
                user.setLanguage("uk")
            } catch (err) {
                console.log(err)
            }
        })
    }
    return Object.freeze({
        start
    });
}
export default TranslateBot;
