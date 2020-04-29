<div align="center" style="margin-top:20px">
    <img width="200" src="https://github.com/tashimato/tf-images/blob/master/TF4.png?raw=true"><br/>

<h1 style="margin: 0 0;font-family:sans-serif;font-weight:300;font-size: 45px;background: -webkit-linear-gradient(40deg, #e91e63,#e91e63,#2196f3, #29b6f6);-webkit-background-clip: text;-webkit-text-fill-color: transparent;" align="center">TeleFaith</h1>
    TeleFaith is a Node.js module for interacting with the <a href="https://core.telegram.org/bots/api">Telegram Bot API</a>.<br>

<!-- [![Bot API](https://img.shields.io/badge/Bot%20API-v.4.4.0-00aced.svg?style=flat-square&logo=telegram)](https://core.telegram.org/bots/api) -->
[![npm package](https://img.shields.io/npm/v/telefaith?logo=npm&style=flat-square)](https://www.npmjs.org/package/telefaith)

</div>



## Install

```bash
npm i telefaith
```

## Complete Guide
 - [Quick View](#Quick-View)
 - [Creating new bot with BotFather](#Creating-new-bot-with-BotFather)
 - [Working with Faith](#Working-with-Faith)
 - [Messages](#Mesages)
 - [Order with Async Await](#Order-with-Async-Await) <b>(Important⚠️⚠️)</b>
 - [Sending Methods](#Sending-Methods)
    * [sendText](#sendText)
    * [sendPhoto](#sendPhoto)
    * [sendAnimation](#sendAnimation)
    * [sendSticker](#sendSticker)
    * [sendLocation](#sendLocation)
    * [sendVenue](#sendVenue)
    * [sendContact](#sendContact)
    * [sendDice](#sendDice)
    * [sendPoll](#sendPoll)
    * [sendAudio](#sendAudio)
    * [sendVideo](#sendVideo)
    * [sendDocument](#sendDocument)
    * [sendMediaGroup](#sendMediaGroup)
    * [sendVoice](#sendVoice)
    * [sendVideoNote](#sendVideoNote)
 - [Replying Methods](#Replying-Methods)
    * [replyWithText](#replyWithText)
    * [replyWithPhoto](#replyWithPhoto)
    * [replyWithAnimation](#replyWithAnimation)
    * [replyWithSticker](#replyWithSticker)
    * [replyWithLocation](#replyWithLocation)
    * [replyWithVenue](#replyWithVenue)
    * and so on... all sending methods are available as reply methods in `Message` class
 - [Editing Methods](#Editing-Methods)
    * [editMessageText](#editMessageText)
    * [editMessageCaption](#editMessageCaption)
    * [editMessageMedia](#editMessageMedia)
    * [editMessageReplyMarkup](#editMessageReplyMarkup)
    * [deleteMessage](#deleteMessage)
 - [Chat Methods](#Chat-Methods)
 - Missing Methods
    * [Payments](https://core.telegram.org/bots/api#payments)
    * [Telegram passport](https://core.telegram.org/bots/api#telegram-passport)
    * [Games](https://core.telegram.org/bots/api#games)


<a name="Quick-View"></a>
## Quick View

```javascript
const teleBot = require('telefaith');
const BOT_TOKEN = 'your_bot_token';

const bot = new teleBot(BOT_TOKEN);


async function start() {

    const botInfo = await bot.testBot();
    console.table(botInfo);

    for await (const ctx of bot) {

        if (ctx.content === 'message') {
            messageHandler(ctx.message);
        }

        if (ctx.content === 'inlineQuery') {
            inlineQueryHandler(ctx.inlineQuery);
        }

        if (ctx.content === 'callbackQuery') {
            callbackQueryHandler(ctx.callbackQuery);
        }

    }

}

start().catch(err => console.log(err));



async function messageHandler(msg) {

    bot.sendPhoto(msg.chat.id, 'https://upload.wikimedia.org/wikipedia/en/5/5c/Metallica_-_Kill_%27Em_All_cover.jpg', {
        caption: `<b>📀 Album Name: Kill 'Em All \n\n 🎙 Artist: Metallica \n\n 📅 Released: 1982</b>`,
        parseMode: 'html',
        replyMarkup: {
            inline_keyboard: [
                [
                    {
                        text: 'Like❤',
                        callback_data: '#Like:dhFjs74Y5r'
                    },
                    {
                        text: 'DisLike👎',
                        callback_data: '#DisLike:dhFjs74Y5r'
                    }
                ],
                [
                    {
                        text: 'About Artist 🎙',
                        url: 'https://en.wikipedia.org/wiki/Metallica'
                    }
                ],
                [
                    {
                        text: 'Album Tracks 💿',
                        switch_inline_query_current_chat: '#Tracks:dhFjs74Y5r'
                    }
                ],
                [
                    {
                        text: 'Send a Demo 🎶',
                        callback_data: '#DEMO:dhFjs74Y5r'
                    }
                ]
            ]
        }
    }).catch(err => console.log(err))

}


async function inlineQueryHandler(inlineQuery) {
    try {

        if (inlineQuery.query === '#Tracks:dhFjs74Y5r') {

            const killEmAllAlbumCover = 'https://upload.wikimedia.org/wikipedia/en/5/5c/Metallica_-_Kill_%27Em_All_cover.jpg';

            inlineQuery.answer([
                {
                    type: 'article',
                    id: 'efg1',
                    title: 'Hit the Lights',
                    input_message_content: {
                        message_text: '/abcd1'
                    },
                    description: 'duration: 4:21',
                    thumb_url: killEmAllAlbumCover
                },
                {
                    type: 'article',
                    id: 'efg2',
                    title: 'The Four Horseman',
                    input_message_content: {
                        message_text: '/abcd2'
                    },
                    description: 'duration: 7:13',
                    thumb_url: killEmAllAlbumCover
                },
                {
                    type: 'article',
                    id: 'efg3',
                    title: 'Motorbreath',
                    input_message_content: {
                        message_text: '/abc3'
                    },
                    description: 'duration: 3:26',
                    thumb_url: killEmAllAlbumCover
                },
                {
                    type: 'article',
                    id: 'efg4',
                    title: 'Jump in the Fire',
                    input_message_content: {
                        message_text: '/abc4'
                    },
                    description: 'duration: 4:42',
                    thumb_url: killEmAllAlbumCover
                },
            ], {
                cacheTime: 0, //for developing set it to zero, cache can be bothering you during development, but in productions set some time
                switchPmText: 'Back to bot 🔙',
                switchPmParameter: 'Revenant'
            });

        }

    }
    catch (err) {
        console.log(err);
    }
}


async function callbackQueryHandler(callbackQuery) {
    try {

        if (callbackQuery.data.startsWith('#Like:')) {

            callbackQuery.answer({
                text: 'You Liked The Album 😍',
            });

        }
        else if (callbackQuery.data.startsWith('#DisLike:')) {

            callbackQuery.answer({
                text: 'You DisLiked The Album 😕'
            });

        }
        else if (callbackQuery.data.startsWith('#DEMO:')) {

            await bot.sendChatAction(callbackQuery.message.chat.id, 'upload_audio');
            const sentMsg = await bot.sendVoice(callbackQuery.message.chat.id, 'https://upload.wikimedia.org/wikipedia/en/6/60/The_Four_Horsemen.ogg');
            sentMsg.replyWithAnimation('https://media.giphy.com/media/k3k4SgEfiBejm/giphy.gif');

        }

    }
    catch (err) {
        console.log(err)
    }
}

```


 <a name="#Creating-new-bot-with-BotFather"></a>
## Creating new bot with BotFather
The following steps describe how to create a new bot:
- Contact @BotFather in your Telegram messenger
- To get a token, send BotFather a message that says <code>/newbot</code>
- When asked for a name for your new bot choose something that ends with the word <code>bot</code>. For example, <code>my_test_bot</code>
- If your chosen name is available, BotFather will send you a token
- Save the token

<img src="https://github.com/tashimato/tf-images/blob/master/create-bot.png?raw=true" width="400">

you can see your created bots using `/mybots` command.

<img src="https://github.com/tashimato/tf-images/blob/master/my-bots.png?raw=true" width="400">

if you wanna change your bots settings and infos, just click on your bot name.

<img src="https://github.com/tashimato/tf-images/blob/master/edit-bot.png?raw=true" width="400">

 <a name="#Working-with-Faith"></a>
## Working with Faith
Ok, you created the bot, now we need Faith.
First create a node project and install telefaith:
```bash
npm i telefaith
```
Create a file index.js (or any other name) and inside the file require telefaith:
```javascript
const teleBot = require('telefaith');
```
then store your token in a variable or something...

```javascript
const BOT_TOKEN = 'your_bot_token';
```
Now, create a bot

```javascript
const bot = new teleBot(BOT_TOKEN);
```
OK, we need a async function for getting message, because comming message(messages, edited messages, inline queries, polls and ...) came throw the "async iterator", and we need `for await` and it works in async function.<br>if you don't know what the heck is "async iterator", dont worry just follow the syntax:
```javascript
async function start() {

    for await(const ctx of bot) {

        if(ctx.content === 'message') {
            console.log(ctx.message);
            ctx.message.replyWithText('Hello Human 😃😉');
        }

    }

}
```

finally call the function!

```javascript
start().catch(err => console.log(err));
```

<b>Full vision:</b>

```javascript
const teleBot = require('telefaith');
const BOT_TOKEN = 'your_bot_token';

const bot = new teleBot(BOT_TOKEN);

async function start() {

    for await(const ctx of bot) {

        if(ctx.content === 'message') {
            console.log(ctx.message);
            ctx.message.replyWithText('Hello Human 😃😉');
        }

    }

}

start().catch(err => console.log(err));

```
To make sure `BOT_TOKEN` is correct and we can connect to our bot we can use `testBot` method at the Beginning of the start function.<br>
If token wasn't correct its gonna throw error and `catch()` method runs.
```javascript
const teleBot = require('telefaith');
const BOT_TOKEN = 'your_bot_token';

const bot = new teleBot(BOT_TOKEN);

async function start() {

    //check bot Correctness 👇👇👇👇👇
    const botInfo = await bot.testBot();
    console.table(botInfo);

    for await(const ctx of bot) {

        if(ctx.content === 'message') {
            console.log(ctx.message);
            ctx.message.replyWithText('Hello Human 😃😉');
        }

    }

}

start().catch(err => console.log(err));

```

### what the hell is `ctx`?
Telegram bot doesn't limited to messages only, bots can answer inline queries, resive poll answers and ...<br>
So, all of these things(messages, polls, inline queries,...) came throw `ctx`. you can check the `ctx` type with `ctx.content`.

```javascript
if(ctx.content === 'message') {
    //do something
    console.log(ctx.message);
}

if(ctx.content === 'inlineQuery') {
    //do something
    console.log(ctx.inlineQuery);
}

if(ctx.content === 'poll') {
    //do something
    console.log(ctx.poll);
}

if(ctx.content === 'editedMessage') {
    //do something
    console.log(ctx.editedMessage);
}

if(ctx.content === 'callbackQuery') {
    //do something
    console.log(ctx.callbackQuery);
}

if(ctx.content === 'chosenInlineResult') {
    //do something
    console.log(ctx.chosenInlineResult);
}
```

check these types at <a href="https://core.telegram.org/bots/api#update">Comming updates</a>.

<a name="#Mesages"></a>
## Mesages
What can we do with messages🤔? well, we can answer them😜.<br>
Every user or better to say "chat" in telegram has an unique id. you can get this id from comming messages using this command: `ctx.message.chat.id`.<br>
yes! yes! why i need to know that😒? well, bot should know who do you want to send a message to, sooo! pass the chat id to it like example bellow! And one more thing, if sending was successfull the sent message gonna return.

```javascript
if (ctx.content === 'message') {

    bot.sendText(ctx.message.chat.id, 'hello')
        .then(sentMessage => console.log(sentMessage));

    bot.sendPhoto(ctx.message.chat.id, 'https://wallpapercave.com/wp/wp5876162.jpg')
        .then(sentMessage => console.log(sentMessage));

    bot.sendPoll(ctx.message.chat.id, 'hey, do you love me?', ['Yes i do😍', 'Maybe🙄', 'No i dont 😒'])
    .then(sentMessage => console.log(sentMessage));

    bot.sendAnimation(ctx.message.chat.id, 'https://media.giphy.com/media/14nR89kC0mcYU0/giphy.gif', { caption: 'Zark Muckerberg' })
        .then(sentMessage => console.log(sentMessage));

    bot.sendLocation(ctx.message.chat.id, 48.8584, 2.2945)
    .then(sentMessage => console.log(sentMessage));

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/messaging.png?raw=true" width="400">

### Carefull ⚠️⚠️<br>
- first: these methods are all async, so there is no guarantee that these messages sent in order. see this chapter for having order : [Order with Async Await](#Order-with-Async-Await).
- second: these methods are all async, sooooooo, use `.catch()` on them or put try catch or something to prevent error and crash in the `for await` loop.
- third: logging is an expensive process and takes a lot of time! so do not log `sentMessage` in production app. logging is for testing and learning purposes. just log errors and important things!

### Replying
If you don't like this whole "chat id" thing, well! you can use replying methods that are Embedded in `message` object but its gonna have this replying mark on the message.
if replying was successfull the sent message gonna return.

```javascript
if(ctx.content === 'message') {
    ctx.message.replyWithText('Hey ✌')
    ctx.message.replyWithPhoto('https://wallpapercave.com/wp/wp5876163.jpg')
    ctx.message.replyWithPoll('do you like pineapple on pizza?', ['Yes i do 🍍🍕', 'No, absolutely not🤢🤮🤮', 'never tried it🤔'])
    ctx.message.replyWithAnimation('https://media.giphy.com/media/TI9HiyUqRm75jPyKQ5/giphy.gif')
    ctx.message.replyWithLocation(48.8584, 2.2945);
}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/replying.png?raw=true" width="400">

### Some Tricks with sent messages
These "send methods" on success, returns the sent message and we can do some cool things with it:

```javascript
if (ctx.content === 'message') {

    bot.sendPhoto(ctx.message.chat.id, 'https://upload.wikimedia.org/wikipedia/en/c/c1/The_Weeknd_-_After_Hours.png',
        {
            caption: '🎙️ <b>The Weeknd</b> \n\n📀 <b>After Houres</b>',
            parseMode: 'html'
        })
        .then(sentMessage => {
            sentMessage.replyWithPoll('After Hours best tracks?',
                [
                    'Alone Again',
                    'Hardest to Love',
                    'Faith',
                    'Scared to Live',
                    'Heartless',
                    'Blinding Lights',
                    'In Your Eyes',
                    'Save Your Tears',
                    'Repeat After Me',
                    'After Hours'
                ],
                { allowsMultipleAnswers: false }
            ).catch(err => console.log(err))
        });

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/reply-tricks1.png?raw=true" width="400">


<a name="#Order-with-Async-Await"></a>
## Order with Async Await
huh! why is this important🤔? well im gonna tell you!<br>
⛔ <u><b>Do not use `await` directly to achive order! Like:</b></u>

```javascript
for await (const ctx of bot) {

    if (ctx.content === 'message') {

        await bot.sendText(ctx.message.chat.id, 'Hey ✌')
        await bot.sendPhoto(ctx.message.chat.id, 'https://wallpapercave.com/wp/wp5876163.jpg')
        await bot.sendPoll(ctx.message.chat.id, 'do you like pineapple on pizza?', ['Yes i do 🍍🍕', 'No, absolutely not🤢🤮🤮', 'never tried it🤔'])
        await bot.sendAnimation(ctx.message.chat.id, 'https://media.giphy.com/media/TI9HiyUqRm75jPyKQ5/giphy.gif')

    }

}
```
<b>Why?</b><br>
Because it's gonna pause the whole `for await` loop for <u>each</u> `await` and other users must wait in the queue till one user gets all these messages. For example:<br>
200 people send message to the bot at the same time and bot gonna answer them like this:<br>
- send text to USER_1
- send photo to USER_1
- send poll to USER_1
- send animation to USER_1
<br> THEN
- send text to USER_2
- send photo to USER_2
- send poll to USER_2
- send animation to USER_2
<br> THEN
- USER_3 , USER_4 , ...... USER_199
<br> THEN
- send text to USER_200
- send photo to USER_200
- send poll to USER_200
- send animation to USER_200

<br>
Well, as you can see, the 200th user must wait till other 199 users recive message😨😱😱😳!!!

<b>another Example:</b><br>
Let's say you need some delay between sending messages(I don't know why, but let's just say we need it 🙄). with async await we probebly gonna write something like this:

```javascript
const delay = sec => new Promise(resolve => setTimeout(resolve, sec * 1000));

for await (const ctx of bot) {
    
    if (ctx.content === 'message') {

        const msg = await bot.sendText(ctx.message.chat.id, 'Timer started⏱');

        //10 second delay
        await delay(10);

        await msg.editText('<b>Timer stoped</b>⏱: <u>10 second delay</u>', {
            parseMode: 'html'
        });

    }
    
}
```
Well, It's gonna be a disaster😑, the whole `for await` loop gonna blocked for 10 second for <u>Each Message</u> 🤦‍♂️😵.

<b>OK, What do we do now😰?</b><br>
Well, we just need an async handler:

```javascript
async function start() {

    const botInfo = await bot.testBot();
    console.table(botInfo);

    for await (const ctx of bot) {

        if (ctx.content === 'message') {
            messageHandler(ctx.message);
        }

    }

}

start().catch(err => console.log(err));


async function messageHandler(msg) {

    await bot.sendText(msg.chat.id, 'Hey ✌');
    await bot.sendPhoto(msg.chat.id, 'https://wallpapercave.com/wp/wp5876163.jpg');
    await bot.sendPoll(msg.chat.id, 'do you like pineapple on pizza?', ['Yes i do 🍍🍕', 'No, absolutely not🤢🤮🤮', 'never tried it🤔']);
    await bot.sendAnimation(msg.chat.id, 'https://media.giphy.com/media/TI9HiyUqRm75jPyKQ5/giphy.gif');

}

```
In this way `for await` loop is not gonna pause anymore and `messageHandler` gonna invoke for users Immediately. Now no ones gonna wait in queue anymore and you achived the order that you wanted 🥳🥳🎈🎉🎊. <br>
Oh, and as always, add `.catch()` or use `try catch` to prevent Errors!

### Reply and Async Await
With this async handler we can work with replying and prevent `.then()` chains.

```javascript
async function messageHandler(msg) {

    try {
        const sentMessage = await bot.sendPhoto(msg.chat.id, 'https://upload.wikimedia.org/wikipedia/en/2/2a/Cover_of_Will_to_Power_by_Arch_Enemy.jpg',
            {
                caption: '🎙️ <b>Arch Enemy</b> \n\n📀 <b>Will To Power</b>',
                parseMode: 'html'
            });

        const sentPoll = await sentMessage.replyWithPoll('Will To Power best track?',
            [
                'Set Flame to the Night',
                'The Race',
                'Blood in the Water',
                'The World Is Yours',
                'The Eagle Flies Alone',
                'Reason To Believe',
                'Murder Scene',
                'First Day in Hell',
                'Saturnine',
                'Dreams of Retribution'
            ],
            { allowsMultipleAnswers: false });

        console.log(sentPoll);
    }
    catch (err) {
        console.log(err)
    }

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/reply-async-await.png?raw=true" width="400">


<a name="#Sending-Methods"></a>
## Sending Methods
OK, Here's some examples for sending methods that exists on `Bot` class, im gonna write code inside the messageHandler functions:

```javascript
const teleBot = require('telefaith');
const BOT_TOKEN = 'your_bot_token';

const bot = new teleBot(BOT_TOKEN);


async function start() {

    const botInfo = await bot.testBot();
    console.table(botInfo);

    for await (const ctx of bot) {

        if (ctx.content === 'message') {
            messageHandler(ctx.message);
        }

    }
}

start().catch(err => console.log(err));



async function messageHandler(msg) {
    //for the bellow examples im gonna write codes here
}
```

<a name="sendText"></a>
### sendText
Use this method to send text messages. On success, the sent Message is returned.

```javascript
async function messageHandler(msg) {

    try {

        await bot.sendText(msg.chat.id, 'howdy-do 🤠');
    
        await bot.sendText(msg.chat.id, '<b>This text is bold</b> <u>this one has underline</u> <s>and whatever this one is</s>', {
            parseMode: 'html' //or markdown
        });
        // visit this link for formating syntaxes: https://core.telegram.org/bots/api#formatting-options

        await bot.sendText(msg.chat.id, 'thrash metal bands', {
            replyMarkup: {
                inline_keyboard: [
                    [
                        { text: 'Metallica', url: 'https://en.wikipedia.org/wiki/Metallica' }
                    ],
                    [
                        { text: 'Slayer', url: 'https://en.wikipedia.org/wiki/Slayer' }
                    ],
                    [
                        { text: 'Megadeath', url: 'https://en.wikipedia.org/wiki/Megadeth' }
                    ],
                ]
            }
        });

        await bot.sendText(msg.chat.id, 'Your favorite color?', {
            replyMarkup: {
                keyboard: [
                    [
                        { text: 'RED ❤' }, { text: 'BLUE 💙' }
                    ],
                    [
                        { text: 'ORANGE 🧡' }, { text: 'GREEN 💚' }
                    ],
                    [
                        { text: 'YELLOW 💛' }, { text: 'PURPLE 💜' }
                    ]
                ]
            }
        });

    }
    catch(err) {
        console.log(err.message);
    }

}

```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/sendTextMethod.png?raw=true" width="400">

<a name="#sendPhoto"></a>
### sendPhoto
Use this method to send photos. On success, the sent Message is returned.

```javascript
async function messageHandler(msg) {

    try {

        //send local file (NOT Recommended at all, it's so slow)
        await bot.sendPhoto(msg.chat.id, fs.createReadStream('./public/tashimato.jpg'));

        //send image by link
        await bot.sendPhoto(msg.chat.id, 'https://wallpapercave.com/wp/wp2508454.jpg');

        //send image by file id
        await bot.sendPhoto(msg.chat.id, 'AgACAgQAAxkBAAIHG16YN1uo6wduKtf0PFTVBPBgGaRUAAJZsjEbn-65UL8wucwhyJ6OY3H3Il0AAwEAAwIAA3kAA8jUAAIYBA', {
            caption: 'از فردا ساعت 8 صبح بیدار میشم میرم ورزش \n\n<b>ساعت 12 ظهر :</b>',
            parseMode: 'html',
            replyMarkup: {
                inline_keyboard: [
                    [
                        { text: '😂', callback_data: 'FUN:dhwbe323d8bed' },
                        { text: '😐', callback_data: 'WHAT:dhwbe323d8bed' },
                        { text: '🥱', callback_data: 'BORING:dhwbe323d8bed' },
                        { text: '😒', callback_data: 'NOTCOOL:dhwbe323d8bed' },
                    ]
                ]
            }
        });

    }
    catch (err) {
        console.log(err.message);
    }

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/sendPhotoMethod.png?raw=true" width="400">

<a name="#sendAnimation"></a>
### sendAnimation
Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent Message is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.

```javascript
async function messageHandler(msg) {

    try {

        //send local file (NOT Recommended at all, it's so slow)
        await bot.sendAnimation(msg.chat.id, fs.createReadStream('./public/jerry.gif'));

        //send with Gif link
        await bot.sendAnimation(msg.chat.id, 'https://media.giphy.com/media/wOzfGOVG5oapW/giphy.gif');

        //send with gif file id
        await bot.sendAnimation(msg.chat.id, 'CgACAgQAAxkBAAIHQ16YRt8oLCtQ5Gs-lYnfRVarDdNXAAJqAgACQKhUUNU0WMpK5tz8GAQ', {
            caption: '<b>Covid-19 has arrived! 🙂</b>',
            parseMode: 'html',
            replyMarkup: {
                inline_keyboard: [
                    [
                        { text: 'Whats Covid-19 ??', url: 'https://en.wikipedia.org/wiki/Coronavirus_disease_2019' }
                    ]
                ]
            }
        });

    }
    catch (err) {
        console.log(err.message);
    }

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/sendAnimationMethod.png?raw=true" width="400">


<a name="#sendSticker"></a>
### sendSticker
Use this method to send static .WEBP or animated .TGS stickers. On success, the sent Message is returned.

```javascript
const fs = require('fs');

async function messageHandler(msg) {

    try {

        //get some sticker    Some stickerSet name: 'MrCat' , 'Miss_Bunny', 'FroggoInLove', 'ValentineCat'
        const stickerSet = await bot.getStickerSet('FunkyGoose');

        //send them to user
        for (const sticker of stickerSet.stickers) {
            await bot.sendSticker(msg.chat.id, sticker.fileId);
        }

        //download them all
        for (const sticker of stickerSet.stickers) {
            const file = await sticker.download();
            await fs.promises.writeFile(`./public/stickers/${sticker.fileUniqueId}.${file.fileExtension}`, file.data)
                .catch(err => console.log(err.message));
        }

        //send downloaded ones to user again🤨🤨. you know, i'm doing these stuff to show you some different patterns and codes
        const downloadedStickers = await fs.promises.readdir('./public/stickers/');
        for (const fileName of downloadedStickers) {
            await bot.sendSticker(msg.chat.id, fs.createReadStream(`./public/stickers/${fileName}`));
        }

    }
    catch (err) {
        console.log(err.message);
    }

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/sendStickerMethod.png?raw=true" width="400">



<a name="#sendLocation"></a>
### sendLocation
Use this method to send point on the map. On success, the sent Message is returned.

```javascript
async function messageHandler(msg) {

    try {

        //bot.sendLocation(chatId, latitude, longitude)
        const sentMsg = await bot.sendLocation(msg.chat.id, 35.7448, 51.3753);

        sentMsg.replyWithPhoto('https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Milad_tower_-_panoramio_%281%29.jpg/800px-Milad_tower_-_panoramio_%281%29.jpg', {
            caption: `<b>Milad Tower</b> \n Milad Tower, also known as the Tehran Tower, is a multi-purpose tower in Tehran, Iran`,
            parseMode: 'html'
        });

    }
    catch (err) {
        console.log(err.message);
    }

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/sendLocationMethod.png?raw=true" width="400">

<a name="#sendVenue"></a>
### sendVenue
Use this method to send information about a venue. On success, the sent Message is returned.

```javascript
async function messageHandler(msg) {

    try {

        //bot.sendLocation(chatId, latitude, longitude, title, address)
        const sentMsg = await bot.sendVenue(msg.chat.id, 35.7543, 51.4205, 'Tabiat Bridge', 'Tehran, Modares Hwy, Iran');

        sentMsg.replyWithPhoto('https://upload.wikimedia.org/wikipedia/commons/5/53/Tabiat_Bridge_by_Nasimonline_1.jpg', {
            caption: 'Yeap, this is it 🙂'
        })

    }
    catch (err) {
        console.log(err.message);
    }

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/sendVenueMethod.png?raw=true" width="400">


<a name="#sendContact"></a>
### sendContact
Use this method to send phone contacts. On success, the sent Message is returned.

```javascript
async function messageHandler(msg) {

    try {

        //bot.sendContact(chatId, phone_number, name, options)
        const sentMsg = await bot.sendContact(msg.chat.id, '+447789873588', 'George', { lastName: 'Ezra' });
        sentMsg.replyWithAnimation('https://media.giphy.com/media/8vRibDFn6QrEqUsMAX/giphy.gif');

    }
    catch (err) {
        console.log(err.message);
    }

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/sendContactMethod.png?raw=true" width="400">



<a name="#sendDice"></a>
### sendDice
Use this method to send a dice, which will have a random value from 1 to 6. On success, the sent Message is returned.

```javascript
async function messageHandler(msg) {

    try {

        if (msg.text === 'Dice') {

            //bot.sendDice(chatId, options)  well, it's kinda useful for games and chances
            const sentMsg = await bot.sendDice(msg.chat.id);
            //get the value of dice like this:
            console.log(sentMsg.dice.value);

        }

    }
    catch (err) {
        console.log(err.message);
    }

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/sendDiceMethod.gif?raw=true" width="400">


<b>April 24, 2020 UPDATE:</b>
You can set emoji “🎲” or “🎯” to be send as Dice. Defaults to “🎲”.

```javascript
const delay = sec => new Promise(resolve => setTimeout(resolve, sec * 1000));

async function messageHandler(msg) {

    try {

        if (msg.text === 'Dart') {

            //you can set emoji to either “🎲” or “🎯”. Defaults to “🎲”
            const sentMsg = await bot.sendDice(msg.chat.id, { emoji: '🎯' });
            //get the value of dice like this:
            console.log(sentMsg.dice.value);

            if (sentMsg.dice.value === 6) {
                await delay(2.5);
                sentMsg.replyWithText('bullseye!😎😎');
            }

        }
        else if (msg.text === 'Dice') {

            //Defaults to 🎲
            const sentMsg = await bot.sendDice(msg.chat.id);
            console.log(sentMsg.dice.value);

        }

    }
    catch (err) {
        console.log(err.message);
    }

}
```

<img src="https://github.com/tashimato/tf-images/blob/master/sendDiceMethod-update.gif?raw=true" width="400">




<a name="#sendPoll"></a>
### sendPoll
Use this method to send a native poll. On success, the sent Message is returned.

```javascript
async function messageHandler(msg) {

    try {

        //answer items must be 2-10 strings 1-100 characters each
        await bot.sendPoll(msg.chat.id, 'Are you a cat person or dog person?',
            [
                '🐶 person',
                '😺 person',
                'Both 😍',
                'None 😒'
            ]);

        //quiz kind
        await bot.sendPoll(msg.chat.id, '2 + 2 x 4 = ?',
            [
                '16', // optionsId: 0
                '15', // optionsId: 1
                '14', // optionsId: 2
                '10'  // optionsId: 3
            ], { type: 'quiz', correctOptionId: 3 });

    }
    catch (err) {
        console.log(err.message);
    }

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/sendPollMethod.png?raw=true" width="400">



<a name="#sendAudio"></a>
### sendAudio
Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent Message is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.

```javascript
const fs = require('fs');
async function messageHandler(msg) {

    try {

        await bot.sendAudio(msg.chat.id, 'CQACAgQAAxkBAAIO7l6khl21DrRTnghib8_G3897TnlGAAKRAgACwb5oAhzDunzOlCFWGQQ');

        await bot.sendAudio(msg.chat.id, 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Ludwig_van_Beethoven_-_Symphonie_5_c-moll_-_1._Allegro_con_brio.ogg');

        await bot.sendAudio(msg.chat.id, fs.createReadStream('./public/Variations and Fugue.mp3'));

        await bot.sendPhoto(msg.chat.id, 'AgACAgQAAxkBAAIO-l6lXmBsUJNJiRz319CAVq-hskPoAAIstDEbkyYoUX586pYhQqVfC9LSIl0AAwEAAwIAA3gAAy1DAQABGQQ');

    }
    catch (err) {
        console.log(err.message);
    }

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/sendAudioMethod.png?raw=true" width="400">



<a name="#sendVideo"></a>
### sendVideo
Use this method to send video files, Telegram clients support mp4 videos (other formats may be sent as Document). On success, the sent Message is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.

```javascript
const fs = require('fs');
async function messageHandler(msg) {

    try {

        //send local file
        await bot.sendVideo(msg.chat.id, fs.createReadStream('./public/tom-&-jerry.mp4'));

        //send by file_id
        await bot.sendVideo(msg.chat.id, 'BAACAgEAAxkBAAIJVF6Zhl_MRn9HnCai8_vdCVnSBVyRAAIDAQACDpsAAUTzAcKL006OIBgE', {
            caption: 'video taken from: @Memesta'
        });

        //send by url
        await bot.sendVideo(msg.chat.id, 'https://www.w3schools.com/html/mov_bbb.mp4', {
            parseMode: 'html',
            caption: 'video taken from: <a href="https://www.w3schools.com/html/html5_video.asp">w3schools</a> and <a href="https://www.bigbuckbunny.org/">Big Buck Bunny</a>'
        });

    }
    catch (err) {
        console.log(err.message);
    }

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/sendVideoMethod.png?raw=true" width="400">



<a name="#sendDocument"></a>
### sendDocument
Use this method to send general files. On success, the sent Message is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.

```javascript
const fs = require('fs');
async function messageHandler(msg) {

    try {

        // Any file can be sent as document 📂

        //send local file
        await bot.sendDocument(msg.chat.id, fs.createReadStream('./public/something.pdf'));

        //send by file_id
        await bot.sendDocument(msg.chat.id, 'BQACAgQAAxkBAAIJbF6ZlW1XHV6GofCLNU1qnDkKTgkPAAKWBgACX5bIUPrU1x85nl5pGAQ');

        //send by url
        await bot.sendDocument(msg.chat.id, 'https://cdn.sqlitetutorial.net/wp-content/uploads/2018/03/chinook.zip', {
            caption: 'Learn sqlite here: https://www.sqlitetutorial.net/sqlite-sample-database/'
        });

        //add thumb for files
        await bot.sendDocument(msg.chat.id, fs.createReadStream('./public/learn javascript async await.pdf'), {
            caption: `There’s a special syntax to work with promises in a more comfortable fashion, called “async/await”. It’s surprisingly easy to understand and use.`,
            thumb: fs.createReadStream('./public/learn-async-await-logojpg.jpg')
        });

        await bot.sendDocument(msg.chat.id, fs.createReadStream('./public/Firefox Installer.exe'), {
            thumb: fs.createReadStream('./public/firefox-logo.jpg')
        });


    }
    catch (err) {
        console.log(err.message);
    }

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/sendDocumentMethod.png?raw=true" width="600">



<a name="#sendMediaGroup"></a>
### sendMediaGroup
Use this method to send a group of photos or videos as an album. On success, an array of the sent Messages is returned.

```javascript
const fs = require('fs');
async function messageHandler(msg) {

    try {

        const sentMsges = await bot.sendMediaGroup(msg.chat.id, [

            {
                type: 'photo',
                media: fs.createReadStream('./public/midnight-madonna.jpg')
            },
            {
                type: 'photo',
                media: fs.createReadStream('./public/sacrament-of-sin-cover.jpg')
            },
            {
                type: 'photo',
                media: 'AgACAgQAAxkDAAIKOl6agawpJhlgdDWtI1PyD7v-ZoHpAAJDqzEb3IrUUJpi0onYPw6UPYDdIl0AAwEAAwIAA20AA33jAAIYBA'
            },
            {
                type: 'photo',
                media: 'https://upload.wikimedia.org/wikipedia/en/3/32/Blood_of_the_Saints.jpg'
            }

        ]);

        sentMsges.forEach(msg => {
            //console.log(msg)
            // msg.replyWithAnimation('https://media.giphy.com/media/cloudJewy8RUlDm5eG/giphy.gif');
        });

    }
    catch (err) {
        console.log(err.message);
    }

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/sendMediaGroupMethod.png?raw=true" width="400">

Another example:

```javascript
const fs = require('fs');
async function messageHandler(msg) {

    try {

        const sentMsges = await bot.sendMediaGroup(msg.chat.id, [

            {
                type: 'video',
                media: fs.createReadStream('./public/video1.mp4')
            },
            {
                type: 'video',
                media: fs.createReadStream('./public/video2.mp4')
            },
            {
                type: 'video',
                media: fs.createReadStream('./public/drumer.mp4')
            },
            {
                type: 'video',
                media: 'BAACAgEAAxkBAAIJVF6Zhl_MRn9HnCai8_vdCVnSBVyRAAIDAQACDpsAAUTzAcKL006OIBgE'
            }

        ]);

        sentMsges.forEach(msg => {
            //console.log(msg)
            // msg.replyWithAnimation('https://media.giphy.com/media/cloudJewy8RUlDm5eG/giphy.gif');
        });

    }
    catch (err) {
        console.log(err.message);
    }

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/sendMediaGroupMethod2.png?raw=true" width="400">

you can send video and photos together

```javascript
const fs = require('fs');
async function messageHandler(msg) {

    try {

        const sentMsges = await bot.sendMediaGroup(msg.chat.id, [

            {
                type: 'video',
                media: 'BAACAgQAAxkBAAIKmF6bMm6JrNkH2M3VgQ5SEg8nSV9CAAK0uAACW2rYUPJ38WFQtDuFGAQ'
            },
            {
                type: 'photo',
                media: fs.createReadStream('./public/mr-poopybutthole.jpg')
            },
            {
                type: 'photo',
                media: fs.createReadStream('./public/rick-&-birdperson.jpg')
            },
            {
                type: 'video',
                media: fs.createReadStream('./public/drumer.mp4')
            },
            {
                type: 'video',
                media: fs.createReadStream('./public/video2.mp4')
            }

        ]);

        sentMsges.forEach(msg => {
            //console.log(msg)
            // msg.replyWithAnimation('https://media.giphy.com/media/cloudJewy8RUlDm5eG/giphy.gif');
        });

    }
    catch (err) {
        console.log(err.message);
    }

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/sendMediaGroupMethod3.png?raw=true" width="400">




<a name="#sendVoice"></a>
### sendVoice
Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS (other formats may be sent as Audio or Document). On success, the sent Message is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.

```javascript
const fs = require('fs');
async function messageHandler(msg) {

    try {

        await bot.sendVoice(msg.chat.id, fs.createReadStream('./public/something.ogg'));

        //send by file_id
        await bot.sendVoice(msg.chat.id, 'AwACAgQAAxkBAAILGF6dz1D7WHBlDzymNApLfF1M1R6oAAJJcQACxXbxUB75u8hfHCw-GAQ');
        await bot.sendVoice(msg.chat.id, 'AwACAgQAAxkBAAILGl6d0IBmKdxeaItMK9effynYuPrwAALScgACxXbxUObmIJEHcR2_GAQ');

        //send by url
        await bot.sendVoice(msg.chat.id, 'http://example.com/voice.ogg');

    }
    catch (err) {
        console.log(err.message);
    }

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/sendVoiceMethod.png?raw=true" width="400">



<a name="#sendVoice"></a>
### sendVideoNote
As of v.4.0, Telegram clients support rounded square mp4 videos of up to 1 minute long. Use this method to send video messages. On success, the sent Message is returned.

```javascript
const fs = require('fs');
const delay = sec => new Promise(resolve => setTimeout(resolve, sec * 1000));

async function messageHandler(msg) {

    try {

        //donwload videoNote
        if (msg.videoNote) {
            const file = await msg.videoNote.download();
            await fs.promises.writeFile(`./public/${msg.videoNote.fileUniqueId}.${file.fileExtension}`, file.data);
        }

        //send by fileId
        await bot.sendVideoNote(msg.chat.id, 'DQACAgQAAxkBAAIOOF6iyjM7ZQ8j82naurlHIMycb7MUAALWBwACGXQZUe5ChllcID8cGQQ');

        //send local videoNote
        await bot.sendVideoNote(msg.chat.id, fs.createReadStream('./public/Tehran.mp4'));

        //send by url
        await bot.sendVideoNote(msg.chat.id, 'http://example.com/videoNote.mp4');

    }
    catch (err) {
        console.log(err.message);
    }

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/sendVideoNoteMethod.png?raw=true" width="400">




<a href="#Replying-Methods"></a>
## Replying Methods
replying methods are embeded in `Message` class, so, comming messages and returned messages have these methods

```javascript
async function messageHandler(msg) {

        await msg.replyWithText('Hello my friend');
        await msg.replyWithPhoto(fs.createReadStream('./public/photo.jpg'));
        await msg.replyWithAnimation('url')
        // ...

        const sentMsg = await bot.sendPhoto(msg.chat.id, fs.createReadStream('./public/im-in.jpg'));

        await sentMsg.replyWithText(`hello my friend`);
        await sentMsg.replyWithPhoto(fs.createReadStream('./public/photo.jpg'));
        await sentMsg.replyWithAnimation('url')
        // ...

}
```



<a name="#replyWithText"></a>
### replyWithText
Use this method to reply with text messages. On success, the sent Message is returned.

```javascript
const fs = require('fs');
async function messageHandler(msg) {

    try {


        const sentMsg = await bot.sendPhoto(msg.chat.id, fs.createReadStream('./im-in.jpg'));

        await sentMsg.replyWithText(`You Son of a Bitch, I'm In.`);

    }
    catch (err) {
        console.log(err.message);
    }

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/replyWithText.png?raw=true" width="400">



<a name="#replyWithPhoto"></a>
### replyWithPhoto
Use this method to reply with photos. On success, the sent Message is returned.

```javascript
const fs = require('fs');
async function messageHandler(msg) {

    try {

        if (msg.text.includes('meme'))
            await msg.replyWithPhoto(fs.createReadStream('./public/smoking-kills.jpg'));
        
        const sentMsg = await bot.sendText(msg.chat.id, 'mr meeseeks');
        sentMsg.replyWithPhoto(fs.createReadStream('./public/Meeseeks.png'))

    }
    catch (err) {
        console.log(err.message);
    }

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/replyWithPhoto.png?raw=true" width="400">



<a name="#replyWithAnimation"></a>
### replyWithAnimation
Use this method to reply with animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent Message is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.

```javascript
async function messageHandler(msg) {

    try {

        if (msg.text.includes('corona')) {
            await msg.replyWithAnimation('CgACAgQAAxkBAAIHQ16YRt8oLCtQ5Gs-lYnfRVarDdNXAAJqAgACQKhUUNU0WMpK5tz8GAQ');
        }
        else if (msg.text.includes('what should i do now?')) {
            msg.replyWithAnimation('CgACAgQAAxkBAAILU16exD3LWdas3Q_6UM7VZIh4tx09AAIhAgACJVd0UK-BMz9hUkuOGAQ')
        }

    }
    catch (err) {
        console.log(err.message);
    }

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/replyWithAnimation.png?raw=true" width="400">




<a name="#replyWithSticker"></a>
### replyWithSticker
Use this method to reply with static .WEBP or animated .TGS stickers. On success, the sent Message is returned.

```javascript
async function messageHandler(msg) {

    try {

        if (msg.text.includes('i love cats')) {
            await msg.replyWithSticker('CAACAgUAAxkBAAILXV6eyG5s7T7rmxFONPK5nozYEYgjAAKPAANxffwUu8m8iT0olvcYBA');
        }
        else if (msg.text.startsWith('STICKER:')) {

            const stickerSetName = msg.text.split(':')[1];

            //get sticker set    Some stickerSet name: 'MrCat' , 'Miss_Bunny', 'FroggoInLove', 'ValentineCat'
            const set = await bot.getStickerSet(stickerSetName);

            for (const sticker of set.stickers) {
                await msg.replyWithSticker(sticker.fileId);
            }

        }

    }
    catch (err) {
        console.log(err.message);
    }

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/replyWithSticker.png?raw=true" width="400">



<a name="#replyWithLocation"></a>
### replyWithLocation
Use this method to reply with point on the map. On success, the sent Message is returned.

```javascript
async function messageHandler(msg) {

    try {

        const sentMsg = await msg.replyWithLocation(38.8977, -77.0365);
        sentMsg.replyWithAnimation('https://media.giphy.com/media/l3q2TGhB8qZhs1tny/giphy.gif');

    }
    catch (err) {
        console.log(err.message);
    }

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/replyWithLocation.png?raw=true" width="400">




<a name="#replyWithVenue"></a>
### replyWithVenue
Use this method to reply with information about a venue. On success, the sent Message is returned.

```javascript
async function messageHandler(msg) {

    try {

        const sentMsg = await msg.replyWithVenue(29.7303278, -95.4346238, 'Lakewood Church', `3700 Southwest Fwy (1,224.99 mi)
        Houston, Texas 77027`);

        sentMsg.replyWithText('https://www.lakewoodchurch.com/');


    }
    catch (err) {
        console.log(err.message);
    }

}
```

<b>RESULT:</b>

<img src="https://github.com/tashimato/tf-images/blob/master/replyWithVenue.png?raw=true" width="400">


## Editing-Methods
Use these methods to edit sent message. these methods are available one bot instance and `Message` class(returned messages from send or reply methods).

<a name="#editMessageText"></a>
### editMessageText
Use this method to edit text and game messages. On success, if edited message is sent by the bot, the edited Message is returned, otherwise True is returned.

Timer example⏱:

```javascript
const delay = sec => new Promise(resolve => setTimeout(resolve, sec * 1000));

async function messageHandler(msg) {

    try {

        let time = 0;
        const sentMsg = await bot.sendText(msg.chat.id, `Timer⏱ : ${time} second`);

        //
        await delay(2).then(_ => time += 2);
        await bot.editMessageText(sentMsg.chat.id, sentMsg.messageId, `Timer⏱ : ${time} second`);

        //easy solution: embeded method
        await delay(2).then(_ => time += 2);
        await sentMsg.editText(`Timer⏱ : ${time} second`, {
            replyMarkup: {
                inline_keyboard: [
                    [
                        { text: 'Restart Timer⏱', callback_data: 'RESET_TIMER' }
                    ]
                ]
            }
        });

    }
    catch (err) {
        console.log(err.message);
    }

}
```

I Love You Example😍:

```javascript
const delay = sec => new Promise(resolve => setTimeout(resolve, sec * 1000));

async function messageHandler(msg) {

    try {

        const sentMsg = await bot.sendText(msg.chat.id, `Hey, Did you know that...`);

        let txt = 'I'

        await delay(2);
        await sentMsg.editText(txt);

        await delay(2).then(_ => txt += ' Love');
        await sentMsg.editText(txt);

        await delay(2).then(_ => txt += ' You');
        await sentMsg.editText(txt);

        await delay(2).then(_ => txt = '😍😍😍😍😍😍😍');
        await sentMsg.editText(txt);

    }
    catch (err) {
        console.log(err.message);
    }

}
```



<a name="#editMessageCaption"></a>
### editMessageCaption
Use this method to edit captions of messages. On success, if edited message is sent by the bot, the edited Message is returned, otherwise True is returned.

Sneeze Example 🤧: 

```javascript
const delay = sec => new Promise(resolve => setTimeout(resolve, sec * 1000));

async function messageHandler(msg) {

    try {

        const sentMsg = await bot.sendPhoto(msg.chat.id, 'AgACAgQAAxkBAAIOX16i7NQk4wwedsEvlT_hC_kXbaZqAAIutDEbeowZUSRxz_swgs4-A4z9Il0AAwEAAwIAA3kAA74rAQABGQQ', {
            caption: '<b>sneezing process</b>',
            parseMode: 'html'
        });

        await delay(0.5);
        await sentMsg.editCaption('<b>😐😐😐😐😐😐😐</b>', { parseMode: 'html' });
        await delay(0.5);
        await sentMsg.editCaption('<b>😦😦😦😦😦😦😦</b>', { parseMode: 'html' });
        await delay(0.5);
        await sentMsg.editCaption('<b>😟😟😟😟😟😟😟</b>', { parseMode: 'html' });
        await delay(0.5);
        await sentMsg.editCaption('<b>😩😩😩😩😩😩😩</b>', { parseMode: 'html' });
        await delay(0.5);
        await sentMsg.editCaption('<b>😫😫😫😫😫😫😫</b>', { parseMode: 'html' });
        await delay(0.5);
        await sentMsg.editCaption('<b>😖😖😖😖😖😖😖</b>', { parseMode: 'html' });
        await delay(0.5);
        await sentMsg.editCaption('<b>😪😪😪😪😪😪😪</b>', { parseMode: 'html' });
        await delay(0.5);
        await sentMsg.editCaption('<b>🤧🤧🤧🤧🤧🤧🤧</b>', { parseMode: 'html' });
        await delay(0.5);
        await sentMsg.editCaption('<b>😌😌😌😌😌😌😌</b>', { parseMode: 'html' });

        //or this hard way
        //bot.editMessageCaption(sentMsg.chat.id, sentMsg.messageId, 'you just sneezed 😂');

    }
    catch (err) {
        console.log(err.message);
    }

}
```


Another Example:

```javascript
async function start() {

    const botInfo = await bot.testBot();
    console.table(botInfo);

    for await (const ctx of bot) {

        if (ctx.content === 'message') {
            messageHandler(ctx.message);
        }
        else if (ctx.content === 'callbackQuery') {
            callBackQueryHandler(ctx.callbackQuery);
        }

    }
}

start().catch(err => console.log(err.message));

async function messageHandler(msg) {

    try {

        bot.sendPhoto(msg.chat.id, 'AgACAgQAAxkBAAIORF6i3VTwd9XCnUSzIh-kkmpwDLFpAAIOtDEbeowZUXwb1VX5pgXb8bUGI10AAwEAAwIAA3kAA9jIAAIZBA', {
            caption: '<b>🎙 Artist: Pink Floyd \n\n🎵 Track: Keep Talking</b>',
            parseMode: 'html',
            replyMarkup: {
                inline_keyboard: [
                    [
                        { text: 'Show Lyrics', callback_data: `LYRICS:Keep-talking` }
                    ]
                ]
            }
        });

    }
    catch (err) {
        console.log(err.message);
    }

}


async function callBackQueryHandler(query) {

    try {

        if (query.data.includes('LYRICS:Keep-talking')) {

            query.message.editCaption(`<b>Keep Talking Lyrics:</b> \n
            There's a silence surrounding me
            I can't seem to think straight
            I sit in the corner
            And no one can bother me
            I think I should speak now (why won't you talk to me?)
            I can't seem to speak now (you never talk to me)
            My words won't come out right (what are you thinking?)
            I feel like I'm drowning (what are you feeling?)
            I'm feeling weak now (why won't you talk to me?)
            But I can't show my weakness (you never talk to me)
            I sometimes wonder (what are you thinking?)
            Where do we go from here (what are you feeling?)
            I feel like I'm drowning
            (You never talk to me) you know I can't breathe now
            (What are you thinking?) We're going nowhere
            (What are you feeling?) We're going nowhere`, { parseMode: 'html' });

        }

    }
    catch (err) {
        console.log(err.message)
    }

}
```



<a name="#editMessageMedia"></a>
### editMessageMedia
Use this method to edit animation, audio, document, photo, or video messages. If a message is a part of a message album, then it can be edited only to a photo or a video. Otherwise, message type can be changed arbitrarily. When inline message is edited, new file can't be uploaded. Use previously uploaded file via its fileId or specify a URL. On success, if the edited message was sent by the bot, the edited Message is returned, otherwise True is returned.

Example:

```javascript
const fs = require('fs');
const delay = sec => new Promise(resolve => setTimeout(resolve, sec * 1000));

async function messageHandler(msg) {

    try {

        const sentMsg = await bot.sendPhoto(msg.chat.id, 'AgACAgQAAxkBAAIN716hyU7uxmEKSwOhLbr6mubNYaFEAAJksjEbht4QUQdt5PZxpmjvewRoIl0AAwEAAwIAA3kAA66YAQABGAQ',
            {
                caption: '<b>🎙 Artist: King Diamond \n\n📀 Album: Fatal Portrait</b>',
                parseMode: 'html'
            });

        await delay(7);

        await bot.editMessageMedia(sentMsg.chat.id, sentMsg.messageId, {
            type: 'photo',
            media: 'AgACAgQAAxkBAAIN9F6hy4779oM8uGgDmX9tDE3vnERpAALQszEb0lAQUSpzeifqVVPsqg6IIl0AAwEAAwIAA3kAA42NAgABGAQ',
            caption: '<b>🎙 Artist: King Diamond \n\n📀 Album: Abigail</b>',
            parseMode: 'html'
        });

        await delay(7);

        //easy way
        await sentMsg.editMedia({
            type: 'photo',
            media: fs.createReadStream('./images/Them.JPG'),
            caption: '<b>🎙 Artist: King Diamond \n\n📀 Album: Them</b>',
            parseMode: 'html',
        });

    }
    catch (err) {
        console.log(err.message);
    }

}
```



<a name="#editMessageCaption"></a>
### editMessageCaption
Use this method to edit captions of messages. On success, if edited message is sent by the bot, the edited Message is returned, otherwise True is returned.

```javascript
const delay = sec => new Promise(resolve => setTimeout(resolve, sec * 1000));

async function messageHandler(msg) {

    try {

        const sentMsg = await bot.sendPhoto(msg.chat.id, 'AgACAgQAAxkBAAIPFF6lr_ZpbfrMcNJKrIfQMLSctrtIAAKBtDEbkyYoUWKcYPNCmc1VDPrbIl0AAwEAAwIAA3gAAztGAQABGQQ', {
            replyMarkup: {
                inline_keyboard: [
                    [
                        { text: '🤣', callback_data: '🤣' }
                    ]
                ]
            }
        });

        await delay(4);

        bot.editMessageReplyMarkup(sentMsg.chat.id, sentMsg.messageId, {
            inline_keyboard: [
                [
                    { text: '🤣', callback_data: '🤣' },
                    { text: '😄', callback_data: '😄' }
                ]
            ]
        });

        await delay(4);

        sentMsg.editReplyMarkup({
            inline_keyboard: [
                [
                    { text: '🤣', callback_data: '🤣' },
                    { text: '😄', callback_data: '😄' },
                    { text: '😐', callback_data: '😐' }
                ]
            ]
        });

        await delay(4);

        sentMsg.editReplyMarkup({
            inline_keyboard: [
                [
                    { text: '🤣', callback_data: '🤣' },
                    { text: '😄', callback_data: '😄' },
                    { text: '😐', callback_data: '😐' },
                    { text: '🥱', callback_data: '🥱' }
                ]
            ]
        });


    }
    catch (err) {
        console.log(err.message);
    }

}

```



<a name="#deleteMessage"></a>
### deleteMessage
Use this method to delete a message, including service messages, with the following limitations:
- A message can only be deleted if it was sent less than 48 hours ago.
- A dice message in a private chat can only be deleted if it was sent more than 24 hours ago.
- Bots can delete outgoing messages in private chats, groups, and supergroups.
- Bots can delete incoming messages in private chats.
- Bots granted can_post_messages permissions can delete outgoing messages in channels.
- If the bot is an administrator of a group, it can delete any message there.
- If the bot has can_delete_messages permission in a supergroup or a channel, it can delete any message there.
Returns True on success.

```javascript
const delay = sec => new Promise(resolve => setTimeout(resolve, sec * 1000));

async function messageHandler(msg) {

    try {

        const sentMsg1 = await bot.sendText(msg.chat.id, 'this message gonna deleted after 5 seconds');
        
        await delay(5);

        bot.deleteMessage(sentMsg1.chat.id, sentMsg1.messageId);

        const sentMsg2 = await bot.sendPhoto(msg.chat.id, 'AgACAgQAAxkBAAIN716hyU7uxmEKSwOhLbr6mubNYaFEAAJksjEbht4QUQdt5PZxpmjvewRoIl0AAwEAAwIAA3kAA66YAQABGAQ');

        await delay(5);

        //easy way
        sentMsg2.delete();

        //you can even delete the user's message
        msg.delete();
        

    }
    catch (err) {
        console.log(err.message);
    }

}

```


<a name="#Chat-Methods"></a>
## Chat Methods

```javascript
const delay = sec => new Promise(resolve => setTimeout(resolve, sec * 1000));

async function messageHandler(msg) {

    try {

        if (msg.text == 'hi') {

            await msg.chat.exportInviteLink().then(link => console.log(link));
            //await bot.exportChatInviteLink(msg.chat.id).then(link => console.log(link));

            await msg.chat.setPhoto(fs.createReadStream('./public/image.jpg'));
            //await bot.setChatPhoto(msg.chat.id, fs.createReadStream('./public/image.jpg'));

            await msg.chat.deletePhoto();
            //await bot.deleteChatPhoto(msg.chat.id);

            await msg.chat.setTitle('CATHARSIS');
            //await bot.setChatTitle(msg.chat.id, 'CATHARSIS');

            await msg.chat.setDescription(`Whenever I fall\nIf ever at all\nYou're there to watch me crumble`);
            //await bot.setChatDescription(msg.chat.id, `Whenever I fall\nIf ever at all\nYou're there to watch me crumble`);

            await msg.chat.pinMessage(msg.messageId);
            //await bot.pinChatMessage(msg.chat.id, msg.messageId);

            await delay(4);

            await msg.chat.unpinMessage();
            //await bot.unpinChatMessage(msg.chat.id);

            await msg.chat.setPermissions({
                can_send_polls: true,
                can_pin_messages: false,
                can_invite_users: true,
                can_send_messages: true
            });
            // await bot.setChatPermissions(msg.chat.id, {
            //     can_send_polls: true,
            //     can_pin_messages: false,
            //     can_invite_users: true,
            //     can_send_messages: true
            // });

            await msg.chat.getAdministrators().then(admins => console.log(admins));
            //await bot.getChatAdministrators(msg.chat.id).then(admins => console.log(admins));

            await msg.chat.getMembersCount().then(count => console.log(count));
            //await bot.getChatMembersCount(msg.chat.id, msg.messageId).then(count => console.log(count));

            await msg.chat.getMember(msg.from.id).then(member => console.log(member));
            //await bot.getChatMember(msg.chat.id, msg.from.id).then(member => console.log(member));

            await msg.chat.setStickerSet('RickAndMorty').catch(err => console.log(err));
            //await bot.setChatStickerSet('RickAndMorty').catch(err => console.log(err));

            await msg.chat.deleteStickerSet().catch(err => console.log(err));
            //await bot.deleteChatStickerSet(msg.chat.id).catch(err => console.log(err));

        }

    }
    catch (err) {
        console.log(err);
    }

}
```


## What about other methods?😐🤨

<div align="center" style="margin-top:40px">
<h2 style="font-family:sans-serif;font-weight:300;font-size: 30px;background: -webkit-linear-gradient(60deg, #e91e63,#e91e63,#2196f3, #29b6f6);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">WORKING ON IT...</h2>
<img src="https://github.com/tashimato/tf-images/blob/master/climbing-the-infity.gif?raw=true">
</div>

## Licence
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)