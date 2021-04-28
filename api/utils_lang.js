
class InterfaceLanguages {

    constructor(langs) {
        this.langs = langs
    }

    getlang() {
        let str_langs = ''
        for (var key in this.langs) {
            str_langs = str_langs + "/"+ key + '\t\t\t-\t\t\t' + this.langs[key] + " \n"
        }
        return str_langs
    }

    getCode(desiredLang) {
        if (!desiredLang) {
            return false;
        }
        desiredLang = desiredLang.toLowerCase();
        
        if (this.langs[desiredLang]) {
            return this.langs[desiredLang];
        }

        var keys = Object.keys(obj.langs).filter(function (key) {
            if (typeof this.langs[key] !== 'string') {
                return false;
            }

            return this.langs[key].toLowerCase() === desiredLang;
        });

        return keys[0] || false;
    }

    isSupported(desiredLang) {
        return Boolean(this.getCode(desiredLang));
    }

}

export default InterfaceLanguages;