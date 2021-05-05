import TelegramBot from "node-telegram-bot-api";
import translete_text from "./utils.js";
import InterfaceLanguages from "./utils_lang.js";
import dotenv from "dotenv";
import { data } from "./config/default.js";
import fetch from "node-fetch";
import fs from "fs";
import DB from "./server.js";

dotenv.config();

function User(_user) {
    const user = _user;
    let language = null;

    function setLanguage(_language) {
        language = _language;
    }
    function getLanguage() {
        return language;
    }
    return Object.freeze({
        user,
        setLanguage,
        getLanguage,
    });
}

function InterFaceBot(langs) {
    const bot = new TelegramBot(
        process.env.TOKEN,
        // { polling: true }
        {
            webHook: {
                port: process.env.PORT
            }
        }
    );
    bot.setWebHook(`${process.env.webhook_url}` + bot.token)
    const interfaceLang_ = new InterfaceLanguages(langs);
    // const mongoDB = new DB()
    return Object.freeze({
        bot,
        interfaceLang_
    });
}

function TranslateBot(langs) {
    const obj = InterFaceBot(langs);
    let user = null;
    function start() {
        obj.bot.onText(/\/start/, async function (msg) {
            try {
                const {
                    chat: { id },
                } = msg;
                let username = msg.from.first_name;
                if (!username) {
                    username = msg.from.username;
                } 
                // obj.mongoDB.saveUser(username) 
                user = await new User(msg.from);
                let start_text = data.start.replace("{username}", username);
                start_text = start_text.replace(
                    "{length}",
                    Object.keys(langs).length
                );
                obj.bot.sendMessage(id, start_text);
            } catch (err) {
                console.log(err);
            }
        });
        obj.bot.onText(/\/about/, async function (msg) {
            try {
                const {
                    chat: { id },
                } = msg;
                if (!user) {
                    user = await new User(msg.from);
                }
                let about_text = data.about.replace(
                    "{length}",
                    Object.keys(langs).length
                );
                obj.bot.sendMessage(id, about_text);
            } catch (err) {
                console.log(err);
            }
        });
        obj.bot.onText(/\/translate/, async function (msg) {
            try {
                const {
                    chat: { id },
                } = msg;
                if (!user) {
                    console.log("err");
                    return;
                }
                let username = msg.from.first_name;
                if (!username) {
                    username = msg.from.username;
                }
                if (!user) {
                    user = await new User(msg.from);
                }
                let lang = await user.getLanguage();
                if (!lang) {
                    let translate_do_not = data.translate_do_not.replace(
                        "{username}",
                        username
                    );
                    obj.bot.sendMessage(id, translate_do_not);
                } else {
                    let translate_choise = data.translate_choise.replace(
                        "{lang}",
                        obj.interfaceLang_.getCode(lang)
                    );
                    obj.bot.sendMessage(id, translate_choise);
                    obj.bot.once("message", async function (msg) {
                        const {
                            chat: { id },
                        } = msg;
                        const { text, entities, document } = msg;
                        if (entities) {
                            return;
                        }
                        if (document) {
                            const path = `./temp/${document.file_name}`;
                            let url = `https://api.telegram.org/bot${process.env.TOKEN}/getFile?file_id=${document.file_id}`;
                            let response = await fetch(url);

                            if (response.ok) {
                                let json = await response.json();
                                let url_file = `https://api.telegram.org/file/bot${process.env.TOKEN}/${json.result.file_path}`;

                                var response_file = await fetch(url_file);
                                if (response_file.ok) {
                                    const buffer = await response_file.buffer();
                                    fs.writeFile(
                                        path,
                                        buffer,
                                        async function () {
                                            try {
                                                let result_data = fs.readFileSync(
                                                    path,
                                                    "utf8"
                                                );
                                                let result = await translete_text(
                                                    result_data,
                                                    lang
                                                );
                                                let translate_msg = data.translate_msg.replace(
                                                    "{result}",
                                                    result
                                                );
                                                obj.bot.sendMessage(
                                                    id,
                                                    translate_msg
                                                );
                                                try {
                                                    fs.unlinkSync(path);
                                                } catch (err) {
                                                    console.error(err);
                                                }
                                            } catch (err) {
                                                console.error(err);
                                            }
                                        }
                                    );
                                } else {
                                    console.log(
                                        "Ошибка HTTP: " + response_file.status
                                    );
                                }
                            } else {
                                console.log("Ошибка HTTP: " + response.status);
                            }
                        } else {
                            let result = await translete_text(text, lang);
                            let translate_msg = data.translate_msg.replace(
                                "{result}",
                                result
                            );
                            obj.bot.sendMessage(id, translate_msg);
                        }
                    });
                }
            } catch (err) {
                console.log(err);
            }
        });

        obj.bot.onText(/\/settings/, async function (msg) {
            try {
                const {
                    chat: { id },
                } = msg;
                if (!user) {
                    user = await new User(msg.from);
                }
                let settings = data.settings;
                obj.bot.sendMessage(id, settings);
            } catch (err) {
                console.log(err);
            }
        });
        obj.bot.onText(/\/changeLanguage/, async function (msg) {
            try {
                const {
                    chat: { id },
                } = msg;
                if (!user) {
                    user = await new User(msg.from);
                }
                obj.bot.sendMessage(id, data.changeLanguage);
                let lang = obj.interfaceLang_.getlang();
                obj.bot.sendMessage(id, lang);
            } catch (err) {
                console.log(err);
            }
        });
        language();
    }
    function language() {
        // language
        obj.bot.onText(/\/ar/, async function (msg) {
            const {
                chat: { id },
            } = msg;
            let choise = data.choise_lang.replace(
                "{lang}",
                obj.interfaceLang_.getCode("ar")
            );
            obj.bot.sendMessage(id, choise);
            try {
                if (!user) {
                    user = await new User(msg.from, "ar");
                }
                user.setLanguage("ar");
            } catch (err) {
                console.log(err);
            }
        });
        obj.bot.onText(/\/hy/, async function (msg) {
            const {
                chat: { id },
            } = msg;
            let choise = data.choise_lang.replace(
                "{lang}",
                obj.interfaceLang_.getCode("hy")
            );
            obj.bot.sendMessage(id, choise);
            try {
                if (!user) {
                    user = await new User(msg.from, "hy");
                }
                user.setLanguage("hy");
            } catch (err) {
                console.log(err);
            }
        });
        obj.bot.onText(/\/az/, async function (msg) {
            const {
                chat: { id },
            } = msg;
            let choise = data.choise_lang.replace(
                "{lang}",
                obj.interfaceLang_.getCode("az")
            );
            obj.bot.sendMessage(id, choise);
            try {
                if (!user) {
                    user = await new User(msg.from, "az");
                }
                user.setLanguage("az");
            } catch (err) {
                console.log(err);
            }
        });
        obj.bot.onText(/\/en/, async function (msg) {
            const {
                chat: { id },
            } = msg;
            let choise = data.choise_lang.replace(
                "{lang}",
                obj.interfaceLang_.getCode("en")
            );
            obj.bot.sendMessage(id, choise);
            try {
                if (!user) {
                    user = await new User(msg.from, "en");
                }
                user.setLanguage("en");
            } catch (err) {
                console.log(err);
            }
        });
        obj.bot.onText(/\/fr/, async function (msg) {
            const {
                chat: { id },
            } = msg;
            let choise = data.choise_lang.replace(
                "{lang}",
                obj.interfaceLang_.getCode("fr")
            );
            obj.bot.sendMessage(id, choise);
            try {
                if (!user) {
                    user = await new User(msg.from, "fr");
                }
                user.setLanguage("fr");
            } catch (err) {
                console.log(err);
            }
        });
        obj.bot.onText(/\/de/, async function (msg) {
            const {
                chat: { id },
            } = msg;
            let choise = data.choise_lang.replace(
                "{lang}",
                obj.interfaceLang_.getCode("de")
            );
            obj.bot.sendMessage(id, choise);
            try {
                if (!user) {
                    user = await new User(msg.from, "de");
                }
                user.setLanguage("de");
            } catch (err) {
                console.log(err);
            }
        });
        obj.bot.onText(/\/ka/, async function (msg) {
            const {
                chat: { id },
            } = msg;
            let choise = data.choise_lang.replace(
                "{lang}",
                obj.interfaceLang_.getCode("ka")
            );
            obj.bot.sendMessage(id, choise);
            try {
                if (!user) {
                    user = await new User(msg.from, "ka");
                }
                user.setLanguage("ka");
            } catch (err) {
                console.log(err);
            }
        });
        obj.bot.onText(/\/de/, async function (msg) {
            const {
                chat: { id },
            } = msg;
            let choise = data.choise_lang.replace(
                "{lang}",
                obj.interfaceLang_.getCode("de")
            );
            obj.bot.sendMessage(id, choise);
            try {
                if (!user) {
                    user = await new User(msg.from, "de");
                }
                user.setLanguage("de");
            } catch (err) {
                console.log(err);
            }
        });
        obj.bot.onText(/\/it/, async function (msg) {
            const {
                chat: { id },
            } = msg;
            let choise = data.choise_lang.replace(
                "{lang}",
                obj.interfaceLang_.getCode("it")
            );
            obj.bot.sendMessage(id, choise);
            try {
                if (!user) {
                    user = await new User(msg.from, "it");
                }
                user.setLanguage("it");
            } catch (err) {
                console.log(err);
            }
        });
        obj.bot.onText(/\/pl/, async function (msg) {
            const {
                chat: { id },
            } = msg;
            let choise = data.choise_lang.replace(
                "{lang}",
                obj.interfaceLang_.getCode("pl")
            );
            obj.bot.sendMessage(id, choise);
            try {
                if (!user) {
                    user = await new User(msg.from, "pl");
                }
                user.setLanguage("pl");
            } catch (err) {
                console.log(err);
            }
        });
        obj.bot.onText(/\/ru/, async function (msg) {
            const {
                chat: { id },
            } = msg;
            let choise = data.choise_lang.replace(
                "{lang}",
                obj.interfaceLang_.getCode("ru")
            );
            obj.bot.sendMessage(id, choise);
            try {
                if (!user) {
                    user = await new User(msg.from, "ru");
                }
                user.setLanguage("ru");
            } catch (err) {
                console.log(err);
            }
        });
        obj.bot.onText(/\/es/, async function (msg) {
            const {
                chat: { id },
            } = msg;
            let choise = data.choise_lang.replace(
                "{lang}",
                obj.interfaceLang_.getCode("es")
            );
            obj.bot.sendMessage(id, choise);
            try {
                if (!user) {
                    user = await new User(msg.from, "es");
                }
                user.setLanguage("es");
            } catch (err) {
                console.log(err);
            }
        });
        obj.bot.onText(/\/turk/, async function (msg) {
            const {
                chat: { id },
            } = msg;
            let choise = data.choise_lang.replace(
                "{lang}",
                obj.interfaceLang_.getCode("turk")
            );
            obj.bot.sendMessage(id, choise);
            try {
                if (!user) {
                    user = await new User(msg.from, "turk");
                }
                user.setLanguage("turk");
            } catch (err) {
                console.log(err);
            }
        });
        obj.bot.onText(/\/uk/, async function (msg) {
            const {
                chat: { id },
            } = msg;
            let choise = data.choise_lang.replace(
                "{lang}",
                obj.interfaceLang_.getCode("uk")
            );
            obj.bot.sendMessage(id, choise);
            try {
                if (!user) {
                    user = await new User(msg.from, "uk");
                }
                user.setLanguage("uk");
            } catch (err) {
                console.log(err);
            }
        });
        obj.bot.onText(/\/zu/, async function (msg) {
            const {
                chat: { id },
            } = msg;
            let choise = data.choise_lang.replace(
                "{lang}",
                obj.interfaceLang_.getCode("zu")
            );
            obj.bot.sendMessage(id, choise);
            try {
                if (!user) {
                    user = await new User(msg.from, "zu");
                }
                user.setLanguage("zu");
            } catch (err) {
                console.log(err);
            }
        });
        // langugage end
    }

    return Object.freeze({
        start,
    });
}
export default TranslateBot;
