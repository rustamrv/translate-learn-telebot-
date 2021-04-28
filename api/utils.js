import translatte from "translatte";

var translete_text = async function(msg, to_lang) {
    let res = await translatte(msg, { to: to_lang }) 
    return res.text
}

export default translete_text; 