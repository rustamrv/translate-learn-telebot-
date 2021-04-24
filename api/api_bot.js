import botgram from "botgram";
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
    const bot = botgram(process.env.TOKEN)
    const interfaceLang_ = new InterfaceLanguages(langs)
    function msg(user) {
        bot.message(true, async function (msg, reply, text) { 
            if (!user.getLanguage()) {
                await reply.text('Установите язык /setLanguage');
            } else {
                try {
                    let result = await translete_text(msg.text, user.getLanguage())
                    reply.text(result)
                } catch (err) {
                    console.log(err)
                }
            }
        })
    }
    return Object.freeze({
        bot,
        interfaceLang_,
        msg
    });
}

function TranslateBot(langs) {
    const obj = InterFaceBot(langs)
    let user = null
    function start() {
        obj.bot.command('start', async function (msg, reply) {
            try {  
                await reply.text('Привет, меня зовут Бот-Иванко\nЯ умею переводить на '+Object.keys(langs).length+' языков.\nНу что начнем, выбери команду \n /translate \n /settings')
                user = new User(msg.user)
            } catch (err) {
                console.log(err)
            }
        })
        obj.bot.command("translate", async function (msg, reply) {
            try {
                reply.action("typing");
                let result = await reply.text('Вводите текст для перевода')
            } catch (err) {
                console.log(err)
            } finally { 
                obj.msg(user)
            }
        })
        obj.bot.command("settings", async function (msg, reply) {
            try {
                let result = await reply.text('Настройка языка /setLanguage')
            } catch (err) {
                console.log(err)
            }
        })

        obj.bot.command("setLanguage", async function (msg, reply) {
            let result;
            try {
                result = await reply.text('Выбери на какой язык переводить. Например English')
            } catch (err) {
                console.log(err)
            } finally {
                reply.text(obj.interfaceLang_.getlang())
            }
        })

    }
    function langs_commands() {
        obj.bot.command("ar", async function (msg, reply) {
            let result;
            try {
                result = await reply.text("Язык установлен  " + obj.interfaceLang_.getCode("ar") + " /translate")
            } catch (err) {
                console.log(err)
            } finally {
                user.setLanguage("ar")
            }
        })
        obj.bot.command("hy", async function (msg, reply) {
            let result;
            try {
                result = await reply.text("Язык установлен  " + obj.interfaceLang_.getCode("hy") + " /translate")
            } catch (err) {
                console.log(err)
            } finally {
                user.setLanguage("hy")
            }
        })
        obj.bot.command("az", async function (msg, reply) {
            let result;
            try {
                result = await reply.text("Язык установлен  " + obj.interfaceLang_.getCode("az") + " /translate")
            } catch (err) {
                console.log(err)
            } finally {
                user.setLanguage("az")
            }
        })
        obj.bot.command("en", async function (msg, reply) {
            let result;
            try {
                result = await reply.text("Язык установлен  " + obj.interfaceLang_.getCode("en") + " /translate")
            } catch (err) {
                console.log(err)
            } finally {
                user.setLanguage("en")
            }
        })
        obj.bot.command("fr", async function (msg, reply) {
            let result;
            try {
                result = await reply.text("Язык установлен  " + obj.interfaceLang_.getCode("fr") + " /translate")
            } catch (err) {
                console.log(err)
            } finally {
                user.setLanguage("fr")
            }
        })
        obj.bot.command("de", async function (msg, reply) {
            let result;
            try {
                result = await reply.text("Язык установлен  " + obj.interfaceLang_.getCode("de") + " /translate")
            } catch (err) {
                console.log(err)
            } finally {
                user.setLanguage("de")
            }
        })
        obj.bot.command("ka", async function (msg, reply) {
            let result;
            try {
                result = await reply.text("Язык установлен  " + obj.interfaceLang_.getCode("ka") + " /translate")
            } catch (err) {
                console.log(err)
            } finally {
                user.setLanguage("ka")
            }
        })
        obj.bot.command("ru", async function (msg, reply) {
            let result;
            try {
                result = await reply.text("Язык установлен  " + obj.interfaceLang_.getCode("ru") + " /translate")
            } catch (err) {
                console.log(err)
            } finally {
                user.setLanguage("ru")
            }
        })
        obj.bot.command("tr", async function (msg, reply) {
            let result;
            try {
                result = await reply.text("Язык установлен  " + obj.interfaceLang_.getCode("tr") + " /translate")
            } catch (err) {
                console.log(err)
            } finally {
                user.setLanguage("tr")
            }
        })
        obj.bot.command("uk", async function (msg, reply) {
            let result;
            try {
                result = await reply.text("Язык установлен  " + obj.interfaceLang_.getCode("uk") + " /translate")
            } catch (err) {
                console.log(err)
            } finally {
                user.setLanguage("uk")
            }
        })
    }
    return Object.freeze({
        start,
        langs_commands
    });
}

export default TranslateBot;
