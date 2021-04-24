import translatte from "translatte";

var translete_text = function(msg, to_lang) {
    return new Promise(function (resolve, reject) { 
        translatte(msg, { to: to_lang }).then(res => {
            resolve(res.text);
        }).catch(err => {
            resolve(err.message);
        });
    });
}

export default translete_text; 