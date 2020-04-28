const fetch = require('node-fetch');
const FormData = require('form-data');



/**
 * 
 * @param {string} botToken bot token
 * @param {string} endPoint endpoint like: sendMessage or sendPhoto
 * @param {Object} body parameters that must be send
 */
async function sendMessageKinds(botToken, endPoint, body) {

    const init = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(body)
    };

    const res = await fetch(`https://api.telegram.org/bot${botToken}/${endPoint}`, init);
    const sentInfo = await res.json();

    return sentInfo;

}


/**
 * 
 * @param {string} botToken bot token
 * @param {string} endPoint endpoint like: sendMessage or sendPhoto
 * @param {Object} 
 */
async function sendFileKinds(botToken, endPoint, body) {

    const form = new FormData();
    for (const [key, value] of Object.entries(body)) {

        if (value !== undefined) {
            form.append(key, value);
        }

    }

    const init = {
        headers: {
            'Accept': 'application/json',
        },
        method: 'POST',
        body: form,
    };

    const res = await fetch(`https://api.telegram.org/bot${botToken}/${endPoint}`, init);
    const sentInfo = await res.json();

    return sentInfo;

}


async function getUpdates(bot_token, offSet, timeout) {

    const body = {
        limit: 100,
        timeout,
        offset: offSet
    };

    const update = await sendMessageKinds(bot_token, 'getUpdates', body);

    if (update.ok) {
        return update.result;
    }
    else {
        throw new Error(update.description);
    }

}



module.exports.sendMessageKinds = sendMessageKinds;
module.exports.sendFileKinds = sendFileKinds;
module.exports.getUpdates = getUpdates;