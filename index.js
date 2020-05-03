const { sendMessageKinds, sendFileKinds, getUpdates } = require('./utils/api-interaction');
const { User, Message, Chat, StickerSet, Context, TeleResponseError, InlineKeyboardMarkup, ReplyKeyboardMarkup, ReplyKeyboardRemove, ChatMember, UserProfilePhotos, FileType, MaskPosition } = require('./utils/types');
const fetch = require('node-fetch');
const chalk = require('chalk');


class Bot {

    #connectionState;

    constructor(botToken) {
        this._token = botToken;
        this.#connectionState = 'NO_CONNECTION';
    }

    get token() {
        return this._token;
    }

    set token(botToken) {
        throw new Error('You can not change the token after creation of instance!');
    }



    /**
     * @generator
     * @yields {Context}
     */
    async *[Symbol.asyncIterator]() {

        let offSet;
        let timeout = 0;

        while (true) {

            const updates = await getUpdates(this.token, offSet, timeout)
                .then(data => {
                    if (this.#connectionState === 'NO_CONNECTION') {
                        this.#connectionState = 'CONNECTED';
                        timeout = 60;
                        console.log(`\n${chalk.greenBright(new Date().toUTCString())} ${chalk.bgCyan.white.bold(' CONNECTED ')} Bot is Connected and we're getting updates!`);
                    }
                    return data;
                })
                .catch(err => {
                    if (this.#connectionState !== 'NO_CONNECTION') {
                        this.#connectionState = 'NO_CONNECTION';
                        timeout = 10;
                        console.log(`\n${chalk.greenBright(new Date().toUTCString())} ${chalk.bgRed.white.bold(' ERROR ')} We lost connection! we'll trying till we get connected again!\n${chalk.bold.white('REASON:')} ${chalk.red(err.message)}`);
                    }
                });

            if (updates && updates.length) {

                for (const update of updates) {

                    yield new Context(update, this);

                }

                offSet = updates[updates.length - 1].update_id + 1;
            }

        }

    }




    /**
     * A simple method for testing your bot's auth token. Requires no parameters. Returns basic information about the bot in form of a User object.
     * @returns {Promise<User>}
     * @example
     * bot.getMe()
            .then(botInfo => console.table(botInfo))
            .catch(err => console.log('something is wrong', err));
     */
    async getMe() {

        const connectionInfo = await sendMessageKinds(this.token, 'getMe');
        if (connectionInfo.ok)
            return new User(connectionInfo.result, this);
        else
            throw new TeleResponseError(connectionInfo.description, connectionInfo.error_code);

    }




    /**
     * 
     * @typedef {Object} TextOptions
     * @property {'html'|'markdown'} parseMode Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
     * @property {boolean} disableWebPagePreview Disables link previews for links in this message
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {number} replyToMessageId If the message is a reply, ID of the original message
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to send text messages. On success, the sent Message is returned.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {string} textMessage Text of the message to be sent, 1-4096 characters after entities parsing
     * @param {TextOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * bot.sendText(ctx.message.chat.id, 'hey, whats up? 😃😃🤟🤟')
            .then(sentMessage => console.log(sentMessage))
            .catch(err => console.log(err));
     */
    async sendText(chatId, textMessage, options = {}) {

        const body = {
            chat_id: chatId,
            text: textMessage,
            parse_mode: options.parseMode,
            disable_web_page_preview: options.disableWebPagePreview,
            disable_notification: options.disableNotification,
            reply_to_message_id: options.replyToMessageId,
            reply_markup: options.replyMarkup
        };

        const sentInfo = await sendMessageKinds(this.token, 'sendMessage', body);
        if (sentInfo.ok)
            return new Message(sentInfo.result, this);
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * 
     * @typedef {Object} PollOptions
     * @property {boolean} isAnonymous True, if the poll needs to be anonymous, defaults to True
     * @property {'quiz'|'regular'} type Poll type, “quiz” or “regular”, defaults to “regular”
     * @property {boolean} allowsMultipleAnswers True, if the poll allows multiple answers, ignored for polls in quiz mode, defaults to False
     * @property {number} correctOptionId 0-based identifier of the correct answer option, required for polls in quiz mode
     * @property {string} explanation Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters with at most 2 line feeds after entities parsing
     * @property {'html'|'markdown'} explanationParseMode Mode for parsing entities in the explanation.
     * @property {number} openPeriod Amount of time in seconds the poll will be active after creation, 5-600. Can't be used together with closeDate.
     * @property {Date} closeDate Point in time when the poll will be automatically closed. Must be at least 5 and no more than 600 seconds in the future. Can't be used together with openPeriod.
     * @property {boolean} isClosed Pass True, if the poll needs to be immediately closed. This can be useful for poll preview.
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {number} replyToMessageId If the message is a reply, ID of the original message
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to send a native poll. On success, the sent Message is returned.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {string} question Poll question, 1-255 characters
     * @param {string[]} answerOptions Array of answer options, 2-10 strings 1-100 characters each
     * @param {PollOptions} [methodOptions]
     * @returns {Promise<Message>}
     * @example
     * bot.sendPoll(ctx.message.chat.id, 'do you love me?', ['Yes I do😍', 'Maybe🙄'])
            .then(sentMessage => console.log(sentMessage))
            .catch(err => console.log(err));
     */
    async sendPoll(chatId, question, answerOptions, methodOptions = {}) {

        const body = {
            chat_id: chatId,
            question,
            options: answerOptions,
            is_anonymous: methodOptions.isAnonymous,
            type: methodOptions.type,
            allows_multiple_answers: methodOptions.allowsMultipleAnswers,
            correct_option_id: methodOptions.correctOptionId,
            explanation: methodOptions.explanation,
            explanation_parse_mode: methodOptions.explanationParseMode,
            open_period: methodOptions.openPeriod,
            close_date: methodOptions.closeDate / 1000,
            is_closed: methodOptions.isClosed,
            disable_notification: methodOptions.disableNotification,
            reply_to_message_id: methodOptions.replyToMessageId,
            reply_markup: methodOptions.replyMarkup
        };

        const sentInfo = await sendMessageKinds(this.token, 'sendPoll', body);
        if (sentInfo.ok)
            return new Message(sentInfo.result, this);
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * 
     * @typedef {Object} PhotoOptions
     * @property {string} caption Audio caption, 0-1024 characters after entities parsing
     * @property {'html'|'markdown'} parseMode Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {number} replyToMessageId If the message is a reply, ID of the original message
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to send photos. On success, the sent Message is returned.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {string|ReadableStream} photo fileId or url or fs.createReadStream
     * @param {PhotoOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * bot.sendPhoto(ctx.message.chat.id, 'photo_file_id').then().catch()
     * //or
     * bot.sendPhoto(ctx.message.chat.id, 'http://example.com/photo.jpg').then().catch()
     * //or
     * const fs = require('fs');
     * bot.sendPhoto(ctx.message.chat.id, fs.createReadStream('./photo.jpg')).then().catch()
     */
    async sendPhoto(chatId, photo, options = {}) {

        const body = {
            chat_id: chatId,
            photo,
            caption: options.caption,
            parse_mode: options.parseMode,
            disable_notification: options.disableNotification,
            reply_to_message_id: options.replyToMessageId,
            reply_markup: options.replyMarkup
        };

        if (typeof photo !== 'string') {

            const sentInfo = await sendFileKinds(this.token, 'sendPhoto', body);

            if (sentInfo.ok)
                return new Message(sentInfo.result, this);
            else
                throw new TeleResponseError(sentInfo.description, sentInfo.error_code);
        }
        else {

            const sentInfo = await sendMessageKinds(this.token, 'sendPhoto', body);

            if (sentInfo.ok)
                return new Message(sentInfo.result, this);
            else
                throw new TeleResponseError(sentInfo.description, sentInfo.error_code);
        }

    }




    /**
     * 
     * @typedef {Object} AnimationOptions
     * @property {string} caption Audio caption, 0-1024 characters after entities parsing
     * @property {'html'|'markdown'} parseMode Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
     * @property {number} width Video width
     * @property {number} height Video height
     * @property {number} duration Duration of the audio in seconds
     * @property {string} thumb 
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {number} replyToMessageId If the message is a reply, ID of the original message
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent Message is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.
     * @param chatId Unique identifier for the target chat or username of the target channel
     * @param {string} animation fileId or url or fs.createReadStream
     * @param {AnimationOptions} [options]
     * @returns {Message}
     * @example
     * bot.sendAnimation(ctx.message.chat.id, 'gif_file_id').then().catch()
     * //or
     * bot.sendAnimation(ctx.message.chat.id, 'https://example.com/giphy.gif').then().catch();
     * //or
     * const fs = require('fs');
     * bot.sendAnimation(ctx.message.chat.id, fs.createReadStream('./giphy.gif')).then().catch()
     */
    async sendAnimation(chatId, animation, options = {}) {

        const body = {
            chat_id: chatId,
            animation,
            width: options.width,
            height: options.height,
            caption: options.caption,
            parse_mode: options.parseMode,
            duration: options.duration,
            thumb: options.thumb,
            disable_notification: options.disableNotification,
            reply_to_message_id: options.replyToMessageId,
            reply_markup: options.replyMarkup
        };

        if (typeof animation !== 'string' || body.thumb) {

            const sentInfo = await sendFileKinds(this.token, 'sendAnimation', body);

            console.log(body)

            if (sentInfo.ok)
                return new Message(sentInfo.result, this);
            else
                throw new TeleResponseError(sentInfo.description, sentInfo.error_code);
        }
        else {

            const sentInfo = await sendMessageKinds(this.token, 'sendAnimation', body);

            if (sentInfo.ok)
                return new Message(sentInfo.result, this);
            else
                throw new TeleResponseError(sentInfo.description, sentInfo.error_code);
        }

    }



    /**
     * 
     * @typedef {Object} VideoOptions
     * @property {string} caption Video caption, 0-1024 characters after entities parsing
     * @property {'html'|'markdown'} parseMode Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
     * @property {boolean} supportsStreaming Pass True, if the uploaded video is suitable for streaming
     * @property {number} width Video width
     * @property {number} height Video height
     * @property {number} duration Duration of sent video in seconds
     * @property {string} thumb 
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {number} replyToMessageId If the message is a reply, ID of the original message
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to send video files, Telegram clients support mp4 videos (other formats may be sent as Document). On success, the sent Message is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {string|ReadableStream} video fileId or url or fs.createReadStream
     * @param {VideoOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * bot.sendVideo(ctx.message.chat.id, 'video_file_id').then().catch()
     * //or
     * bot.sendVideo(ctx.message.chat.id, 'http://example.com/video.mp4').then().catch()
     * //or
     * const fs = require('fs');
     * bot.sendVideo(ctx.message.chat.id, fs.createReadStream('./video.mp4')).then().catch()
     */
    async sendVideo(chatId, video, options = {}) {

        const body = {
            chat_id: chatId,
            video,
            width: options.width,
            height: options.height,
            caption: options.caption,
            parse_mode: options.parseMode,
            duration: options.duration,
            thumb: options.thumb,
            supports_streaming: options.supportsStreaming,
            disable_notification: options.disableNotification,
            reply_to_message_id: options.replyToMessageId,
            reply_markup: options.replyMarkup
        };

        if (typeof video !== 'string' || body.thumb) {

            const sentInfo = await sendFileKinds(this.token, 'sendVideo', body);

            if (sentInfo.ok)
                return new Message(sentInfo.result, this);
            else
                throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

        }
        else {

            const sentInfo = await sendMessageKinds(this.token, 'sendVideo', body);
            if (sentInfo.ok)
                return new Message(sentInfo.result, this);
            else
                throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

        }

    }




    /**
     * 
     * @typedef {Object} VideoNoteOptions
     * @property {number} duration Duration of sent video in seconds
     * @property {string} thumb 
     * @property {number} length Video width and height, i.e. diameter of the video message
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {number} replyToMessageId If the message is a reply, ID of the original message
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * As of v.4.0, Telegram clients support rounded square mp4 videos of up to 1 minute long. Use this method to send video messages. On success, the sent Message is returned.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {string|ReadableStream} video fileId or url or fs.createReadStream
     * @param {VideoNoteOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * bot.sendVideoNote(ctx.message.chat.id, 'video_file_id').then().catch()
     * //or
     * bot.sendVideoNote(ctx.message.chat.id, 'http://example.com/video.mp4').then().catch()
     * //or
     * const fs = require('fs');
     * bot.sendVideoNote(ctx.message.chat.id, fs.createReadStream('./video.mp4')).then().catch()
     */
    async sendVideoNote(chatId, videoNote, options = {}) {

        const body = {
            chat_id: chatId,
            video_note: videoNote,
            duration: options.duration,
            length: options.length,
            thumb: options.thumb,
            disable_notification: options.disableNotification,
            reply_to_message_id: options.replyToMessageId,
            reply_markup: options.replyMarkup
        };

        if (typeof video !== 'string' || body.thumb) {

            const sentInfo = await sendFileKinds(this.token, 'sendVideoNote', body);

            if (sentInfo.ok)
                return new Message(sentInfo.result, this);
            else
                throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

        }
        else {

            const sentInfo = await sendMessageKinds(this.token, 'sendVideoNote', body);
            if (sentInfo.ok)
                return new Message(sentInfo.result, this);
            else
                throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

        }

    }




    /**
     * 
     * @typedef {Object} DocumentOptions
     * @property {string} caption Audio caption, 0-1024 characters after entities parsing
     * @property {'html'|'markdown'} parseMode Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
     * @property {string} thumb 
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {number} replyToMessageId If the message is a reply, ID of the original message
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to send general files. On success, the sent Message is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {string|ReadableStream} document fileId or url or fs.createReadStream
     * @param {DocumentOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * bot.sendDocument(ctx.message.chat.id, 'file_id').then().catch()
     * //or
     * bot.sendDocument(ctx.message.chat.id, 'http://example.com/something.pdf').then().catch()
     * //or
     * const fs = require('fs');
     * bot.sendDocument(ctx.message.chat.id, fs.createReadStream('./something.html')).then().catch()
     */
    async sendDocument(chatId, document, options = {}) {

        const body = {
            chat_id: chatId,
            document,
            caption: options.caption,
            parse_mode: options.parseMode,
            thumb: options.thumb,
            disable_notification: options.disableNotification,
            reply_to_message_id: options.replyToMessageId,
            reply_markup: options.replyMarkup
        };

        if (typeof document !== 'string' || body.thumb) {

            const sentInfo = await sendFileKinds(this.token, 'sendDocument', body);

            if (sentInfo.ok)
                return new Message(sentInfo.result, this);
            else
                throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

        }
        else {

            const sentInfo = await sendMessageKinds(this.token, 'sendDocument', body);
            if (sentInfo.ok)
                return new Message(sentInfo.result, this);
            else
                throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

        }

    }




    /**
     * 
     * @typedef {Object} AudioOptions
     * @property {string} caption Audio caption, 0-1024 characters after entities parsing
     * @property {'html'|'markdown'} parseMode Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
     * @property {number} duration Duration of the audio in seconds
     * @property {string} performer Performer
     * @property {string} title Track name
     * @property {string} thumb 
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {number} replyToMessageId If the message is a reply, ID of the original message
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent Message is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {string|ReadableStream} audio fileId or url or fs.createReadStream
     * @param {AudioOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * bot.sendAudio(ctx.message.chat.id, 'audio_file_id').then().catch()
     * //or
     * bot.sendAudio(ctx.message.chat.id, 'http://example.com/audio.mp3').then().catch()
     * //or
     * const fs = require('fs');
     * bot.sendAudio(ctx.message.chat.id, fs.createReadStream('./audio.mp3')).then().catch()
     */
    async sendAudio(chatId, audio, options = {}) {

        const body = {
            chat_id: chatId,
            audio,
            caption: options.caption,
            parse_mode: options.parseMode,
            duration: options.duration,
            performer: options.performer,
            title: options.title,
            thumb: options.thumb,
            disable_notification: options.disableNotification,
            reply_to_message_id: options.replyToMessageId,
            reply_markup: options.replyMarkup
        };

        if (typeof audio !== 'string' || body.thumb) {

            const sentInfo = await sendFileKinds(this.token, 'sendAudio', body);

            if (sentInfo.ok)
                return new Message(sentInfo.result, this);
            else
                throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

        }
        else {

            const sentInfo = await sendMessageKinds(this.token, 'sendAudio', body);

            if (sentInfo.ok)
                return new Message(sentInfo.result, this);
            else
                throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

        }

    }




    /**
     * 
     * @typedef {Object} VoiceOptions
     * @property {string} caption Audio caption, 0-1024 characters after entities parsing
     * @property {'html'|'markdown'} parseMode Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
     * @property {number} duration Duration of the voice message in seconds
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {number} replyToMessageId If the message is a reply, ID of the original message
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS (other formats may be sent as Audio or Document). On success, the sent Message is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {string|ReadableStream} voice fileId or url or fs.createReadStream
     * @param {VoiceOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * bot.sendVocie(ctx.message.chat.id, 'audio_file_id').then().catch()
     * //or
     * bot.sendVoice(ctx.message.chat.id, 'http://example.com/audio.ogg').then().catch()
     * //or
     * const fs = require('fs');
     * bot.sendVoice(ctx.message.chat.id, fs.createReadStream('./audio.ogg')).then().catch()
     */
    async sendVoice(chatId, voice, options = {}) {

        const body = {
            chat_id: chatId,
            voice,
            caption: options.caption,
            parse_mode: options.parseMode,
            duration: options.duration,
            disable_notification: options.disableNotification,
            reply_to_message_id: options.replyToMessageId,
            reply_markup: options.replyMarkup
        };

        if (typeof voice !== 'string') {

            const sentInfo = await sendFileKinds(this.token, 'sendVoice', body);

            if (sentInfo.ok)
                return new Message(sentInfo.result, this);
            else
                throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

        }
        else {

            const sentInfo = await sendMessageKinds(this.token, 'sendVoice', body);

            if (sentInfo.ok)
                return new Message(sentInfo.result, this);
            else
                throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

        }

    }




    /**
     * 
     * @typedef {Object} StickerOptions
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {number} replyToMessageId If the message is a reply, ID of the original message
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to send static .WEBP or animated .TGS stickers. On success, the sent Message is returned.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {string|ReadableStream} sticker fileId or url or fs.createReadStream
     * @param {StickerOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * bot.sendSticker(ctx.message.chat.id, 'sticker_file_id')
            .then(sentMessage => console.log(sentMessage))
            .catch(err => console.log(err));
     */
    async sendSticker(chatId, sticker, options = {}) {

        const body = {
            chat_id: chatId,
            sticker,
            disable_notification: options.disableNotification,
            reply_to_message_id: options.replyToMessageId,
            reply_markup: options.replyMarkup
        };

        if (typeof sticker !== 'string') {

            const sentInfo = await sendFileKinds(this.token, 'sendSticker', body);

            if (sentInfo.ok)
                return new Message(sentInfo.result, this);
            else
                throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

        }
        else {

            const sentInfo = await sendMessageKinds(this.token, 'sendSticker', body);

            if (sentInfo.ok)
                return new Message(sentInfo.result, this);
            else
                throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

        }

    }




    /**
     * @typedef {Object} MediaSendTYPE
     * @property {'photo'|'video'} type Type of the result
     * @property {string|ReadableStream} media fileId or URL or fs.createReadStream()
     * @property {'string'} [caption] Optional. Caption of the photo to be sent, 0-1024 characters after entities parsing
     * @property {'html'|'markdown'} [parseMode] Optional. Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in the media caption.
     * @property {string|ReadableStream} [thumb]
     * @property {number} [width] width
     * @property {number} [height] height
     * @property {number} [duration] video or audio or animation duration
     * @property {boolean} [supportsStreaming] Optional. Pass True, if the uploaded video is suitable for streaming
     * @property {string} [performer]  Performer of the audio
     * @property {string} [title]  title of the audio
     */

    /**
     * 
     * @typedef {Object} sendMediaGroupOptions
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {number} replyToMessageId If the message is a reply, ID of the original message
     */

    /**
     * 
     * Use this method to send a group of photos or videos as an album. On success, an array of the sent Messages is returned.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel 
     * @param {MediaSendTYPE[]} media A JSON-serialized array describing photos and videos to be sent, must include 2–10 items
     * @param {sendMediaGroupOptions} options 
     * @returns {Message[]}
     */
    async sendMediaGroup(chatId, media, options = {}) {

        const body = {
            chat_id: chatId,
            disable_notification: options.disableNotification,
            reply_to_message_id: options.replyToMessageId
        };

        const equipped = media.map(file => {

            if (file.parseMode) {
                file.parse_mode = file.parseMode;
                delete file.parseMode;
            }

            if (file.supportsStreaming) {
                file.supports_streaming = file.supportsStreaming;
                delete file.supportsStreaming;
            }

            if (typeof file.media !== 'string') {
                const fileName = file.media.path.split('/').pop();
                body[fileName] = file.media;
                file.media = `attach://${fileName}`;
            }

            return file;

        });

        body.media = JSON.stringify(equipped);


        const sentInfo = await sendFileKinds(this.token, 'sendMediaGroup', body);

        if (sentInfo.ok)
            return sentInfo.result.map(msg => new Message(msg, this))
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * 
     * @typedef {Object} LocationOptions
     * @property {number} livePeriod Period in seconds for which the location will be updated (see Live Locations, should be between 60 and 86400.
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {number} replyToMessageId If the message is a reply, ID of the original message
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to send point on the map. On success, the sent Message is returned.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {number} latitude Latitude of the location
     * @param {number} longitude Longitude of the location
     * @param {LocationOptions} [options] 
     * @returns {Promise<Message>}
     * @example
     * bot.sendLocation(ctx.message.chat.id, 48.8584, 2.2945)
            .then(sentMessage => console.log(sentMessage))
            .catch(err => console.log(err));
     */
    async sendLocation(chatId, latitude, longitude, options = {}) {


        const body = {
            chat_id: chatId,
            latitude,
            longitude,
            live_period: options.livePeriod,
            disable_notification: options.disableNotification,
            reply_to_message_id: options.replyToMessageId,
            reply_markup: options.replyMarkup
        };

        const sentInfo = await sendMessageKinds(this.token, 'sendLocation', body);

        if (sentInfo.ok)
            return new Message(sentInfo.result, this);
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * 
     * @typedef {Object} editMessageLiveLocationOptions
     * @property {boolean} inlineMessageId Required if chatId and messageId are not specified. Identifier of the inline message
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to edit live location messages. A location can be edited until its live_period expires or editing is explicitly disabled by a call to stopMessageLiveLocation. On success, if the edited message was sent by the bot, the edited Message is returned, otherwise True is returned.
     * @param {number|string} chatId Required if inlineMessageId is not specified. Unique identifier for the target chat or username of the target channel
     * @param {number} messageId Required if inlineMessageId is not specified. Identifier of the message to edit
     * @param {number} latitude Latitude of new location
     * @param {number} longitude Longitude of new location
     * @param {editMessageLiveLocationOptions} [options] 
     * @returns {Promise<Message>}
     * @example
     * const sentMsg = await bot.sendLocation(msg.chat.id, 48.8584, 2.2945, {
            livePeriod: 180
        });
        await delay(5); //wait for 5 seconds
        await bot.editMessageLiveLocation(sentMsg.chat.id, sentMsg.messageId, 49, 3);
     */
    async editMessageLiveLocation(chatId, messageId, latitude, longitude, options = {}) {


        const body = {
            chat_id: chatId,
            message_id: messageId,
            inline_message_id: options.inlineMessageId,
            latitude,
            longitude,
            reply_markup: options.replyMarkup
        };

        const sentInfo = await sendMessageKinds(this.token, 'editMessageLiveLocation', body);

        if (sentInfo.ok)
            return new Message(sentInfo.result, this);
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * 
     * @typedef {Object} editMessageLiveLocationOptions
     * @property {boolean} inlineMessageId Required if chatId and messageId are not specified. Identifier of the inline message
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to stop updating a live location message before livePeriod expires. On success, if the message was sent by the bot, the sent Message is returned, otherwise True is returned.
     * @param {number|string} chatId Required if inlineMessageId is not specified. Unique identifier for the target chat or username of the target channel
     * @param {number} messageId Required if inlineMessageId is not specified. Identifier of the message to edit
     * @param {editMessageLiveLocationOptions} [options] 
     * @returns {Promise<Message>}
     * @example
     * const sentMsg = await bot.sendLocation(msg.chat.id, 48.8584, 2.2945, {
            livePeriod: 180
        });
        await delay(5); //wait for 5 seconds
        const y = await bot.stopMessageLiveLocation(sentMsg.chat.id, sentMsg.messageId);
     */
    async stopMessageLiveLocation(chatId, messageId, options = {}) {


        const body = {
            chat_id: chatId,
            message_id: messageId,
            inline_message_id: options.inlineMessageId,
            reply_markup: options.replyMarkup
        };

        const sentInfo = await sendMessageKinds(this.token, 'stopMessageLiveLocation', body);

        if (sentInfo.ok)
            return new Message(sentInfo.result, this);
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * 
     * @typedef {Object} VenueOptions
     * @property {string} foursquareId Foursquare identifier of the venue
     * @property {string} foursquareType Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.)
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {number} replyToMessageId If the message is a reply, ID of the original message
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to send information about a venue. On success, the sent Message is returned.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {number} latitude Latitude of the venue
     * @param {number} longitude Longitude of the venue
     * @param {string} title Name of the venue
     * @param {string} address Address of the venue
     * @param {VenueOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * bot.sendVenue(ctx.message.chat.id, 48.8584, 2.2945, 'Eiffel Tower', 'Eiffel Tower address')
            .then(sentMessage => console.log(sentMessage))
            .catch(err => console.log(err));
     */
    async sendVenue(chatId, latitude, longitude, title, address, options = {}) {

        const body = {
            chat_id: chatId,
            latitude,
            longitude,
            title,
            address,
            foursquare_id: options.foursquareId,
            foursquare_type: options.foursquareType,
            disable_notification: options.disableNotification,
            reply_to_message_id: options.replyToMessageId,
            reply_markup: options.replyMarkup
        };

        const sentInfo = await sendMessageKinds(this.token, 'sendVenue', body);

        if (sentInfo.ok)
            return new Message(sentInfo.result, this);
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }



    /**
     * 
     * @typedef {Object} ContactOptions
     * @property {string} lastName Contact's last name
     * @property {string} vcard Additional data about the contact in the form of a vCard, 0-2048 bytes
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {number} replyToMessageId If the message is a reply, ID of the original message
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to send phone contacts. On success, the sent Message is returned.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {string} phoneNumber Contact's phone number
     * @param {string} firstName 
     * @param {ContactOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * bot.sendContact(ctx.message.chat.id, '09129994444', 'James', { lastName: 'May' })
            .then(sentMessage => console.log(sentMessage))
            .catch(err => console.log(err));
     */
    async sendContact(chatId, phoneNumber, firstName, options = {}) {

        const body = {
            chat_id: chatId,
            phone_number: phoneNumber,
            first_name: firstName,
            last_name: options.lastName,
            vcard: options.vcard,
            disable_notification: options.disableNotification,
            reply_to_message_id: options.replyToMessageId,
            reply_markup: options.replyMarkup
        };

        const sentInfo = await sendMessageKinds(this.token, 'sendContact', body);

        if (sentInfo.ok)
            return new Message(sentInfo.result, this);
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * 
     * @typedef {Object} DiceOptions
     * @property {'🎲' | '🎯'} emoji Emoji on which the dice throw animation is based. Currently, must be one of “🎲” or “🎯”. Defaults to “🎲”
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {number} replyToMessageId If the message is a reply, ID of the original message
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */
    /**
     * Use this method to send a dice, which will have a random value from 1 to 6. On success, the sent Message is returned.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {DiceOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * bot.sendDice(ctx.message.chat.id)
            .then(sentMessage => console.log(sentMessage))
            .catch(err => console.log(err));
     */
    async sendDice(chatId, options = {}) {

        const body = {
            chat_id: chatId,
            emoji: options.emoji,
            disable_notification: options.disableNotification,
            reply_to_message_id: options.replyToMessageId,
            reply_markup: options.replyMarkup
        };

        const sentInfo = await sendMessageKinds(this.token, 'sendDice', body);
        if (sentInfo.ok)
            return new Message(sentInfo.result, this);
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * 
     * @typedef {Object} forwardMessageOptions
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     */

    /**
     * 
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param {number|string} fromChatId Unique identifier for the chat where the original message was sent (or channel username in the format @channelusername)
     * @param {number} messageId Message identifier in the chat specified in from_chat_id
     * @param {forwardMessageOptions} options 
     */
    async forwardMessage(chatId, fromChatId, messageId, options = {}) {

        const body = {
            chat_id: chatId,
            from_chat_id: fromChatId,
            message_id: messageId,
            disable_notification: options.disable_notification
        };

        const sentInfo = await sendMessageKinds(this.token, 'forwardMessage', body);
        if (sentInfo.ok)
            return new Message(sentInfo.result, this);
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
    * Use this method to delete a message, including service messages, with the following limitations:
    - A message can only be deleted if it was sent less than 48 hours ago.
    - A dice message in a private chat can only be deleted if it was sent more than 24 hours ago.
    - Bots can delete outgoing messages in private chats, groups, and supergroups.
    - Bots can delete incoming messages in private chats.
    - Bots granted can_post_messages permissions can delete outgoing messages in channels.
    - If the bot is an administrator of a group, it can delete any message there.
    - If the bot has can_delete_messages permission in a supergroup or a channel, it can delete any message there.
    Returns True on success.
    * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
    * @property {number} messageId Identifier of the message to delete
    * @returns {Promise<boolean>}
    * @example
    * bot.deleteMessage(ctx.message.chat.id, ctx.message.messageId)
    *      .then(isDeleted => console.log(isDeleted))
    *      .catch(err => console.log(err))
    */
    async deleteMessage(chatId, messageId) {

        const body = {
            chat_id: chatId,
            message_id: messageId
        };

        const sentInfo = await sendMessageKinds(this.token, 'deleteMessage', body);
        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * 
     * @typedef {Object} EditMessageTextOptions
     * @property {string} inlineMessageId Required if chatId and messageId are not specified. Identifier of the inline message
     * @property {'html'|'markdown'} parseMode Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
     * @property {boolean} disableWebPagePreview Disables link previews for links in this message
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to edit text and game messages. On success, if edited message is sent by the bot, the edited Message is returned, otherwise True is returned.
     * @param {number|string} chatId Required if inlineMessageId is not specified. Unique identifier for the target chat or username of the target channel
     * @property {number} messageId Required if inlineMessageId is not specified. Identifier of the message to edit
     * @param {string} text Text of the message to be sent, 1-4096 characters after entities parsing
     * @param {EditMessageTextOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * 
     */
    async editMessageText(chatId, messageId, text, options = {}) {

        const body = {
            chat_id: chatId,
            message_id: messageId,
            inline_message_id: options.inlineMessageId,
            text,
            parse_mode: options.parseMode,
            disable_web_page_preview: options.disableWebPagePreview,
            reply_markup: options.replyMarkup
        };

        const sentInfo = await sendMessageKinds(this.token, 'editMessageText', body);
        if (sentInfo.ok)
            return new Message(sentInfo.result, this);
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * 
     * @typedef {Object} EditMessageCaptionOptions
     * @property {string} inlineMessageId Required if chatId and messageId are not specified. Identifier of the inline message
     * @property {'html'|'markdown'} parseMode Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to edit captions of messages. On success, if edited message is sent by the bot, the edited Message is returned, otherwise True is returned.
     * @param {number|string} chatId Required if inlineMessageId is not specified. Unique identifier for the target chat or username of the target channel 
     * @property {number} messageId Required if inlineMessageId is not specified. Identifier of the message to edit
     * @param {string} caption New caption of the message, 0-1024 characters after entities parsing
     * @param {EditMessageCaptionOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * bot.editMessageCaption(ctx.message.chat.id, ctx.message.messageId, 'we edited the caption')
     *      .then(editedMessage => console.log(editedMessage));
     */
    async editMessageCaption(chatId, messageId, caption, options = {}) {

        const body = {
            chat_id: chatId,
            message_id: messageId,
            inline_message_id: options.inlineMessageId,
            caption,
            parse_mode: options.parseMode,
            reply_markup: options.replyMarkup
        };

        const sentInfo = await sendMessageKinds(this.token, 'editMessageCaption', body);
        if (sentInfo.ok)
            return new Message(sentInfo.result, this);
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * @typedef {Object} MediaTYPE
     * @property {'photo'|'video'|'animation'|'audio'|'document'} type Type of the result
     * @property {string|ReadableStream} media fileId or URL or fs.createReadStream()
     * @property {'string'} [caption] Optional. Caption of the photo to be sent, 0-1024 characters after entities parsing
     * @property {'html'|'markdown'} [parseMode] Optional. Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in the media caption.
     * @property {string|ReadableStream} [thumb]
     * @property {number} [width] width
     * @property {number} [height] height
     * @property {number} [duration] video or audio or animation duration
     * @property {boolean} [supportsStreaming] Optional. Pass True, if the uploaded video is suitable for streaming
     * @property {string} [performer]  Performer of the audio
     * @property {string} [title]  title of the audio
     */

    /**
     * 
     * @typedef {Object} EditMessageMediaOptions
     * @property {string} inlineMessageId Required if chatId and messageId are not specified. Identifier of the inline message
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to edit animation, audio, document, photo, or video messages. If a message is a part of a message album, then it can be edited only to a photo or a video. Otherwise, message type can be changed arbitrarily. When inline message is edited, new file can't be uploaded. Use previously uploaded file via its file_id or specify a URL. On success, if the edited message was sent by the bot, the edited Message is returned, otherwise True is returned.
     * @param {number|string} chatId Required if inlineMessageId is not specified. Unique identifier for the target chat or username of the target channel 
     * @property {number} messageId Required if inlineMessageId is not specified. Identifier of the message to edit
     * @param {MediaTYPE} media A JSON-serialized object for a new media content of the message
     * @param {EditMessageMediaOptions} [options]
     * @returns {Promise<Message>}
     */
    async editMessageMedia(chatId, messageId, media, options = {}) {

        if (media.parseMode) {
            media.parse_mode = media.parseMode;
            delete media.parseMode;
        }

        if (media.supportsStreaming) {
            media.supports_streaming = media.supportsStreaming;
            delete media.supportsStreaming;
        }

        const body = {
            chat_id: chatId,
            message_id: messageId,
            inline_message_id: options.inlineMessageId,
            media,
            reply_markup: options.replyMarkup
        };

        if (typeof media.media !== 'string') {
            const fileName = media.media.path.split('/').pop();
            body[fileName] = media.media;
            media.media = `attach://${fileName}`;
        }

        if (media.thumb && typeof media.thumb !== 'string') {
            const fileName = media.thumb.path.split('/').pop();
            body[fileName] = media.thumb;
            media.thumb = `attach://${fileName}`;
        }

        body.media = JSON.stringify(body.media);


        const sentInfo = await sendFileKinds(this.token, 'editMessageMedia', body);
        if (sentInfo.ok)
            return new Message(sentInfo.result, this);
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * 
     * @typedef {Object} EditMessageReplyMarkupOptions
     * @property {string} inlineMessageId Required if chatId and messageId are not specified. Identifier of the inline message
     */

    /**
     * Use this method to edit only the reply markup of messages. On success, if edited message is sent by the bot, the edited Message is returned, otherwise True is returned.
     * @param {number|string} chatId Required if inlineMessageId is not specified. Unique identifier for the target chat or username of the target channel 
     * @property {number} messageId Required if inlineMessageId is not specified. Identifier of the message to edit
     * @param {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup A JSON-serialized object for an inline keyboard.
     * @param {EditMessageReplyMarkupOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * bot.editMessageReplyMarkup(ctx.message.chat.id, ctx.message.messageId, {
                inline_keyboard: [
                    [
                        { text: 'Thanks for the vote🥰', callback_data: 'NOT_IMPORTANT' }
                    ]
                ]
            })
     *      .then(editedMessage => console.log(editedMessage));
     */
    async editMessageReplyMarkup(chatId, messageId, replyMarkup, options = {}) {

        const body = {
            chat_id: chatId,
            message_id: messageId,
            inline_message_id: options.inlineMessageId,
            reply_markup: replyMarkup
        };

        const sentInfo = await sendMessageKinds(this.token, 'editMessageReplyMarkup', body);
        if (sentInfo.ok)
            return new Message(sentInfo.result, this);
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns True on success.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {'typing'|'upload_photo'|'record_video'|'upload_video'|'record_audio'|'upload_audio'|'upload_document'|'find_location'|'record_video_note'|'upload_video_note'} action Type of action to broadcast. Choose one, depending on what the user is about to receive: typing for text messages, upload_photo for photos, record_video or upload_video for videos, record_audio or upload_audio for audio files, upload_document for general files, find_location for location data, record_video_note or upload_video_note for video notes.
     * @returns {Promise<boolean>}
     * @example
     * bot.sendChatAction(ctx.message.chat.id, 'upload_photo')
            .then(ok => {
                if (ok) {
                    bot.sendPhoto(ctx.message.chat.id, 'https://example.com/photo.jpg');
                }
            });
     */
    async sendChatAction(chatId, action) {

        const body = {
            chat_id: chatId,
            action
        };

        const sentInfo = await sendMessageKinds(this.token, 'sendChatAction', body);
        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * Use this method to get up to date information about the chat (current name of the user for one-on-one conversations, current username of a user, group or channel, etc.). Returns a Chat object on success.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @returns {Promise<Chat>}
     * @example
     * bot.getChat(chatId)
            .then(chat => {
                console.log(chat);
            });
     */
    async getChat(chatId) {

        const body = {
            chat_id: chatId
        };

        const sentInfo = await sendMessageKinds(this.token, 'getChat', body);
        if (sentInfo.ok)
            return new Chat(sentInfo.result, this);
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * 
     * @typedef {Object} kickChatMemberOptions
     * @property {Date} untilDate Date when the user will be unbanned. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever
     */

    /**
     * Use this method to kick a user from a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the group on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Returns True on success.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {number} userId Unique identifier of the target user
     * @param {kickChatMemberOptions} options
     * @returns {Promise<boolean>}
     * @example
     * bot.kickChatMember(chatId, userId)
            .then(isKicked => {
                console.log(isKicked);
            });
     */
    async kickChatMember(chatId, userId, options = {}) {

        const body = {
            chat_id: chatId,
            user_id: userId,
            until_date: options.untilDate / 1000
        };

        const sentInfo = await sendMessageKinds(this.token, 'kickChatMember', body);
        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * 
     * @typedef {Object} promoteChatMemberOptions
     * @property {boolean} canChangeInfo Pass True, if the administrator can change chat title, photo and other settings
     * @property {boolean} canPostMessages Pass True, if the administrator can create channel posts, channels only
     * @property {boolean} canEditMessages Pass True, if the administrator can edit messages of other users and can pin messages, channels only
     * @property {boolean} canDeleteMessages Pass True, if the administrator can delete messages of other users
     * @property {boolean} canInviteUsers Pass True, if the administrator can invite new users to the chat
     * @property {boolean} canRestrictMembers Pass True, if the administrator can restrict, ban or unban chat members
     * @property {boolean} canPinMessages Pass True, if the administrator can pin messages, supergroups only
     * @property {boolean} canPromoteMembers Pass True, if the administrator can add new administrators with a subset of his own privileges or demote administrators that he has promoted, directly or indirectly (promoted by administrators that were appointed by him)
     */

    /**
     * Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Pass False for all boolean parameters to demote a user. Returns True on success.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {number} userId Unique identifier of the target user
     * @param {promoteChatMemberOptions} options
     * @returns {Promise<boolean>}
     * @example
     */
    async promoteChatMember(chatId, userId, options = {}) {

        const body = {
            chat_id: chatId,
            user_id: userId,
            can_change_info: options.canChangeInfo,
            can_post_messages: options.canPostMessages,
            can_edit_messages: options.canEditMessages,
            can_delete_messages: options.canDeleteMessages,
            can_invite_users: options.canInviteUsers,
            can_restrict_members: options.canRestrictMembers,
            can_pin_messages: options.canPostMessages,
            can_promote_members: options.canPromoteMembers,
        };

        const sentInfo = await sendMessageKinds(this.token, 'promoteChatMember', body);
        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * Use this method to unban a previously kicked user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. Returns True on success.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {number} userId Unique identifier of the target user
     * @returns {Promise<boolean>}
     * @example
     * bot.unbanChatMember(chatId, userId)
            .then(isUnban => {
                console.log(isUnban);
            });
     */
    async unbanChatMember(chatId, userId) {

        const body = {
            chat_id: chatId,
            user_id: userId,
        };

        const sentInfo = await sendMessageKinds(this.token, 'unbanChatMember', body);
        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * 
     * @typedef {Object} chatPermisions
     * @property {boolean} [can_send_messages] Optional. True, if the user is allowed to send text messages, contacts, locations and venues
     * @property {boolean} [can_send_media_messages] Optional. True, if the user is allowed to send audios, documents, photos, videos, video notes and voice notes, implies can_send_messages
     * @property {boolean} [can_send_polls] Optional. True, if the user is allowed to send polls, implies can_send_messages
     * @property {boolean} [can_send_other_messages] Optional. True, if the user is allowed to send animations, games, stickers and use inline bots, implies can_send_media_messages
     * @property {boolean} [can_add_web_page_previews] Optional. True, if the user is allowed to add web page previews to their messages, implies can_send_media_messages
     * @property {boolean} [can_change_info] Optional. True, if the user is allowed to change the chat title, photo and other settings. Ignored in public supergroups
     * @property {boolean} [can_invite_users] Optional. True, if the user is allowed to invite new users to the chat
     * @property {boolean} [can_pin_messages] Optional. True, if the user is allowed to pin messages. Ignored in public supergroups
     */

    /**
     * 
     * @typedef {Object} restrictChatMemberOptions
     * @property {Date} untilDate Date when restrictions will be lifted for the user, unix time. If user is restricted for more than 366 days or less than 30 seconds from the current time, they are considered to be restricted forever
     */

    /**
     * Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate admin rights. Pass True for all permissions to lift restrictions from a user. Returns True on success.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target supergroup
     * @param {number} userId Unique identifier of the target user
     * @param {chatPermisions} permissions New user permissions
     * @param {restrictChatMemberOptions} options
     * @returns {Promise<boolean>}
     * @example
     * 
     */
    async restrictChatMember(chatId, userId, permissions, options = {}) {

        const body = {
            chat_id: chatId,
            user_id: userId,
            permissions,
            until_date: options.untilDate / 1000
        };

        const sentInfo = await sendMessageKinds(this.token, 'restrictChatMember', body);
        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns True on success.
     * @param {string|number} chatId Unique identifier for the target chat or username of the target supergroup
     * @param {number} userId Unique identifier of the target user
     * @param {string} customTitle New custom title for the administrator; 0-16 characters, emoji are not allowed
     * @returns {boolean}
     */
    async setChatAdministratorCustomTitle(chatId, userId, customTitle) {

        const body = {
            chat_id: chatId,
            user_id: userId,
            custom_title: customTitle
        };

        const sentInfo = await sendMessageKinds(this.token, 'setChatAdministratorCustomTitle', body);
        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the can_restrict_members admin rights. Returns True on success.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {chatPermisions} permissions New default chat permissions
     * @returns {Promise<boolean>}
     * @example
     */
    async setChatPermissions(chatId, permissions) {

        const body = {
            chat_id: chatId,
            permissions
        };

        const sentInfo = await sendMessageKinds(this.token, 'setChatPermissions', body);
        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * Use this method to generate a new invite link for a chat; any previously generated link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Returns the new invite link as String on success.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @returns {Promise<string>}
     * @example
     * bot.exportChatInviteLink(ctx.message.chat.id)
            .then(link => {
                return ctx.message.replyWithText(link);
            })
            .then(sentMessage => console.log(sentMessage))
            .catch(err => console.log(err.message))
     */
    async exportChatInviteLink(chatId) {

        const body = {
            chat_id: chatId
        };

        const sentInfo = await sendMessageKinds(this.token, 'exportChatInviteLink', body);
        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * Use this method to set a new profile photo for the chat. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Returns True on success.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {ReadableStream} photo New chat photo using fs.createReadStream()
     * @returns {Promise<boolean>}
     * @example
     * bot.setChatPhoto(chatId, fs.createReadStream('./cat.jpg'))
            .then(isSet => {
                console.log(isSet);
            });
     */
    async setChatPhoto(chatId, photo) {

        const body = {
            chat_id: chatId,
            photo
        };

        const sentInfo = await sendFileKinds(this.token, 'setChatPhoto', body);

        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }





    /**
     * Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Returns True on success.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @returns {Promise<boolean>}
     * @example
     * bot.deleteChatPhoto(chatId)
            .then(deleted => {
                console.log(deleted);
            });
     */
    async deleteChatPhoto(chatId) {

        const body = {
            chat_id: chatId
        };

        const sentInfo = await sendMessageKinds(this.token, 'deleteChatPhoto', body);
        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * 
     * @typedef {Object} pinChatMessage
     * @property {boolean} disableNotification Pass True, if it is not necessary to send a notification to all chat members about the new pinned message. Notifications are always disabled in channels.
     */

    /**
     * Use this method to pin a message in a group, a supergroup, or a channel. The bot must be an administrator in the chat for this to work and must have the ‘can_pin_messages’ admin right in the supergroup or ‘can_edit_messages’ admin right in the channel. Returns True on success.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {number} messageId Identifier of a message to pin
     * @param {pinChatMessage} [options] 
     * @returns {Promise<boolean>}
     */
    async pinChatMessage(chatId, messageId, options = {}) {

        const body = {
            chat_id: chatId,
            message_id: messageId,
            disable_notification: options.disableNotification
        };

        const sentInfo = await sendMessageKinds(this.token, 'pinChatMessage', body);
        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * Use this method to unpin a message in a group, a supergroup, or a channel. The bot must be an administrator in the chat for this to work and must have the ‘can_pin_messages’ admin right in the supergroup or ‘can_edit_messages’ admin right in the channel. Returns True on success.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @returns {Promise<boolean>}
     * @example
     * bot.unpinChatMessage(ctx.message.chat.id)
            .then(isUnPinned => console.log(isUnPinned))
            .catch(err => console.log(err.message))
     */
    async unpinChatMessage(chatId) {

        const body = {
            chat_id: chatId
        };

        const sentInfo = await sendMessageKinds(this.token, 'unpinChatMessage', body);
        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Returns True on success.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {string} [description] New chat description, 0-255 characters
     * @returns {Promise<boolean>}
     * @example
     * bot.setChatDescription(ctx.message.chat.id, 'The only way to do a thing, is to do it!')
            .then(isSet => console.log(isSet))
            .catch(err => console.log(err.message));
     */
    async setChatDescription(chatId, description) {

        const body = {
            chat_id: chatId,
            description
        };

        const sentInfo = await sendMessageKinds(this.token, 'setChatDescription', body);
        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Returns True on success.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {string} title New chat title, 1-255 characters
     * @returns {Promise<boolean>}
     * @example
     * bot.setChatTitle(ctx.message.chat.id, '🐉 Depressed Dragons 🐉')
            .then(isSet => console.log(isSet))
            .catch(err => console.log(err.message));
     */
    async setChatTitle(chatId, title) {

        const body = {
            chat_id: chatId,
            title
        };

        const sentInfo = await sendMessageKinds(this.token, 'setChatTitle', body);
        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
    * Use this method for your bot to leave a group, supergroup or channel. Returns True on success.
    * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
    * @returns {Promise<boolean>}
    * @example
    * bot.leaveChat(ctx.message.chat.id)
           .then(isOk => console.log(isOk))
           .catch(err => console.log(err.message))
    */
    async leaveChat(chatId) {

        const body = {
            chat_id: chatId
        };

        const sentInfo = await sendMessageKinds(this.token, 'leaveChat', body);
        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * Use this method to get information about a member of a chat. Returns a ChatMember object on success.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {number} userId Unique identifier of the target user
     * @returns {Promise<ChatMember>}
     * @example
     * bot.getChatMember(chatId, userId)
            .then(member => {
                console.log(member);
            });
     */
    async getChatMember(chatId, userId) {

        const body = {
            chat_id: chatId,
            user_id: userId
        };

        const sentInfo = await sendMessageKinds(this.token, 'getChatMember', body);
        if (sentInfo.ok)
            return new ChatMember(sentInfo.result, this);
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * Use this method to get the number of members in a chat. Returns Int on success.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @returns {Promise<number>}
     * @example
     * bot.getChatMembersCount(chatId)
            .then(count => {
                console.log(count);
            });
     */
    async getChatMembersCount(chatId) {

        const body = {
            chat_id: chatId
        };

        const sentInfo = await sendMessageKinds(this.token, 'getChatMembersCount', body);
        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * Use this method to get a list of administrators in a chat. On success, returns an Array of ChatMember objects that contains information about all chat administrators except other bots. If the chat is a group or a supergroup and no administrators were appointed, only the creator will be returned.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @returns {Promise<ChatMember[]>}
     * @example
     * bot.getChatAdministrators(chatId)
            .then(admins => {
                console.log(admins);
            });
     */
    async getChatAdministrators(chatId) {

        const body = {
            chat_id: chatId
        };

        const sentInfo = await sendMessageKinds(this.token, 'getChatAdministrators', body);
        if (sentInfo.ok)
            return sentInfo.result.map(member => new ChatMember(member, this));
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Use the field can_set_sticker_set optionally returned in getChat requests to check if the bot can use this method. Returns True on success.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @param {string} stickerSetName Name of the sticker set to be set as the group sticker set
     * @returns {Promise<boolean>}
     * @example
     * bot.setChatStickerSet(chatId, 'Shpooky')
            .then(isSet => {
                console.log(isSet);
            });
     */
    async setChatStickerSet(chatId, stickerSetName) {

        const body = {
            chat_id: chatId,
            sticker_set_name: stickerSetName
        };

        const sentInfo = await sendMessageKinds(this.token, 'setChatStickerSet', body);
        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Use the field can_set_sticker_set optionally returned in getChat requests to check if the bot can use this method. Returns True on success.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @returns {Promise<boolean>}
     * @example
     * bot.deleteChatStickerSet(chatId)
            .then(deleted => {
                console.log(deleted);
            });
     */
    async deleteChatStickerSet(chatId) {

        const body = {
            chat_id: chatId
        };

        const sentInfo = await sendMessageKinds(this.token, 'deleteChatStickerSet', body);
        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }



    /**
     * Use this method to get a sticker set. On success, a StickerSet object is returned.
     * @param {string} stikerSetName Name of the sticker set
     * @returns {Promise<StickerSet>}
     * @example
     * bot.getStickerSet('Shpooky')
            .then(set => {
                console.log(set.stickers[0].emoji);
            });
     */
    async getStickerSet(stikerSetName) {

        const body = {
            name: stikerSetName
        };

        const set = await sendMessageKinds(this.token, 'getStickerSet', body);

        if (set.ok)
            return new StickerSet(set.result, this);
        else
            throw new TeleResponseError(set.description, set.error_code);

    }




    /**
     * Use this method to upload a .PNG file with a sticker for later use in createNewStickerSet and addStickerToSet methods (can be used multiple times). Returns the uploaded File on success.
     * @param {number} userId User identifier of sticker file owner
     * @param {ReadableStream} pngSticker PNG image with the sticker, must be up to 512 kilobytes in size, dimensions must not exceed 512px, and either width or height must be exactly 512px.
     * @returns {Promise<FileType>}
     */
    async uploadStickerFile(userId, pngSticker) {

        const body = {
            user_id: userId,
            png_sticker: pngSticker
        };

        const sentInfo = await sendFileKinds(this.token, 'uploadStickerFile', body);

        if (sentInfo.ok)
            return new FileType(sentInfo.result);
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * @typedef {Object} createNewStickerSetParams
     * @property {number} userId User identifier of sticker set owner
     * @property {string} name Short name of sticker set, to be used in t.me/addstickers/ URLs (e.g., animals). Can contain only english letters, digits and underscores. Must begin with a letter, can't contain consecutive underscores and must end in “_by_<bot username>”. <bot_username> is case insensitive. 1-64 characters.
     * @property {string} title Sticker set title, 1-64 characters
     * @property {string|ReadableStream} [pngSticker] PNG image with the sticker, must be up to 512 kilobytes in size, dimensions must not exceed 512px, and either width or height must be exactly 512px. Pass a fileId as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one
     * @property {string} emojis One or more emoji corresponding to the sticker
     * @property {ReadableStream} [tgsSticker] TGS animation with the sticker
     * @property {boolean} [containsMasks] Pass True, if a set of mask stickers should be created
     * @property {MaskPosition} [maskPosition] object for position where the mask should be placed on faces
     */

    /**
     * 
     * Use this method to create a new sticker set owned by a user. The bot will be able to edit the sticker set thus created. You must use exactly one of the fields pngSticker or tgsSticker. Returns True on success.
     * @param {createNewStickerSetParams} setParams
     * @returns {Promise<boolean>}
     */
    async createNewStickerSet(setParams) {

        const body = {
            user_id: setParams.userId,
            name: setParams.name,
            title: setParams.title,
            png_sticker: setParams.pngSticker,
            emojis: setParams.emojis,
            tgs_sticker: setParams.tgsSticker,
            contains_masks: setParams.containsMasks,
            mask_position: setParams.maskPosition
        };

        const sentInfo = await sendFileKinds(this.token, 'createNewStickerSet', body);

        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * @typedef {Object} addStickerToSetParams
     * @property {number} userId User identifier of sticker set owner
     * @property {string} name Sticker set name
     * @property {string|ReadableStream} [pngSticker] PNG image with the sticker, must be up to 512 kilobytes in size, dimensions must not exceed 512px, and either width or height must be exactly 512px. Pass a fileId as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one
     * @property {string} emojis One or more emoji corresponding to the sticker
     * @property {ReadableStream} [tgsSticker] TGS animation with the sticker
     * @property {MaskPosition} [maskPosition] object for position where the mask should be placed on faces
     */

    /**
     * 
     * Use this method to add a new sticker to a set created by the bot. You must use exactly one of the fields png_sticker or tgs_sticker. Animated stickers can be added to animated sticker sets and only to them. Animated sticker sets can have up to 50 stickers. Static sticker sets can have up to 120 stickers. Returns True on success.
     * @param {addStickerToSetParams} setParams
     * @returns {Promise<boolean>}
     */
    async addStickerToSet(setParams) {

        const body = {
            user_id: setParams.userId,
            name: setParams.name,
            png_sticker: setParams.pngSticker,
            emojis: setParams.emojis,
            tgs_sticker: setParams.tgsSticker,
            mask_position: setParams.maskPosition
        };

        const sentInfo = await sendFileKinds(this.token, 'addStickerToSet', body);

        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * Use this method to move a sticker in a set created by the bot to a specific position. Returns True on success.
     * @param {string} sticker File identifier of the sticker
     * @param {number} position New sticker position in the set, zero-based
     * @returns {Promise<boolean>}
     */
    async setStickerPositionInSet(sticker, position) {

        const body = {
            sticker,
            position
        };

        const sentInfo = await sendMessageKinds(this.token, 'setStickerPositionInSet', body);

        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * 
     * Use this method to delete a sticker from a set created by the bot. Returns True on success.
     * @param {string} sticker File identifier of the sticker
     * @returns {Promise<boolean>}
     */
    async deleteStickerFromSet(sticker) {

        const body = {
            sticker
        };

        const sentInfo = await sendMessageKinds(this.token, 'deleteStickerFromSet', body);

        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * @typedef {Object} setStickerSetThumbParams
     * @property {string} name Sticker set name
     * @property {number} userId User identifier of the sticker set owner
     * @property {string|ReadableStream} thumb A PNG image with the thumbnail, must be up to 128 kilobytes in size and have width and height exactly 100px, or a TGS animation with the thumbnail up to 32 kilobytes in size; see https://core.telegram.org/animated_stickers#technical-requirements for animated sticker technical requirements.
     */
    /**
     * 
     * Use this method to set the thumbnail of a sticker set. Animated thumbnails can be set for animated sticker sets only. Returns True on success.
     * @param {setStickerSetThumbParams} params
     * @returns {Promise<boolean>}
     */
    async setStickerSetThumb(params) {

        const body = {
            name: params.name,
            user_id: params.userId,
            thumb: params.thumb
        };

        const sentInfo = await sendFileKinds(this.token, 'setStickerSetThumb', body);

        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * 
     * @typedef {Object} getUserProfilePhotosOptions
     * @property {number} offset Sequential number of the first photo to be returned. By default, all photos are returned.
     * @property {number} limit Limits the number of photos to be retrieved. Values between 1—100 are accepted. Defaults to 100.
     */

    /**
     * Use this method to get a list of profile pictures for a user. Returns a UserProfilePhotos object.
     * @param {string} userId Unique identifier of the target user
     * @param {getUserProfilePhotosOptions} options 
     * @returns {Promise<UserProfilePhotos>}
     * @example
     * const profilephotos = await bot.getUserProfilePhotos(ctx.message.from.id);
     * console.log(profilephotos);
     */
    async getUserProfilePhotos(userId, options = {}) {

        const body = {
            user_id: userId,
            offset: options.offset,
            limit: options.limit
        };

        const sentInfo = await sendMessageKinds(this.token, 'getUserProfilePhotos', body);

        if (sentInfo.ok)
            return new UserProfilePhotos(sentInfo.result, this);
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * 
     * @typedef {Object} BotCommand
     * @property {string} command Text of the command, 1-32 characters. Can contain only lowercase English letters, digits and underscores.
     * @property {string} description Description of the command, 3-256 characters.
     */

    /**
    * Use this method to change the list of the bot's commands. Returns True on success.
    * @param {BotCommand[]} commands A JSON-serialized list of bot commands to be set as the list of the bot's commands. At most 100 commands can be specified.
    * @returns {Promise<boolean>}
    * @example
    * bot.setMyCommands([
            {
                command: 'sayhello',
                description: 'bot gonna say hello'
            },
            {
                command: 'saygoodbye',
                description: 'bot gonna say goodbye'
            }
        ]).then(isSet => console.log(isSet));
    */
    async setMyCommands(commands) {

        const body = {
            commands
        };

        const sentInfo = await sendMessageKinds(this.token, 'setMyCommands', body);

        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * Use this method to get the current list of the bot's commands. Requires no parameters. Returns Array of BotCommand on success.
     * @returns {Promise<BotCommand[]>}
     * @example
     * bot.getMyCommands()
            .then(commands => {
                console.log(commands);
            });
     */
    async getMyCommands() {

        const sentInfo = await sendMessageKinds(this.token, 'getMyCommands');

        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * 
     * @typedef {Object} InlineQueryOptions
     * @property {number} cacheTime The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300.
     * @property {number} isPersonal Pass True, if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query
     * @property {string} nextOffset Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don‘t support pagination. Offset length can’t exceed 64 bytes.
     * @property {string} switchPmText If passed, clients will display a button with specified text that switches the user to a private chat with the bot and sends the bot a start message with the parameter switch_pm_parameter
     * @property {string} switchPmParameter Deep-linking parameter for the /start message sent to the bot when user presses the switch button. 1-64 characters, only A-Z, a-z, 0-9, _ and - are allowed.
     */

    /**
     * Use this method to send answers to an inline query. On success, True is returned. No more than 50 results per query are allowed.
     * @param {string} inlineQueryId Unique identifier for the answered query
     * @param {Array} results A JSON-serialized array of results for the inline query
     * @param {InlineQueryOptions} [options] 
     * @returns {Promise<Array>}
     */
    async answerInlineQuery(inlineQueryId, results, options = {}) {

        const body = {
            inline_query_id: inlineQueryId,
            results,
            cache_time: options.cacheTime,
            is_personal: options.isPersonal,
            next_offset: options.nextOffset,
            switch_pm_text: options.switchPmText,
            switch_pm_parameter: options.switchPmParameter
        };

        const sentInfo = await sendMessageKinds(this.token, 'answerInlineQuery', body);

        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }




    /**
     * 
     * @typedef {Object} CallbackQueryOptions
     * @property {string} text Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters
     * @property {boolean} showAlert If true, an alert will be shown by the client instead of a notification at the top of the chat screen. Defaults to false.
     * @property {number} cacheTime The maximum amount of time in seconds that the result of the callback query may be cached client-side. Telegram apps will support caching starting in version 3.14. Defaults to 0.
     * @property {string} url URL that will be opened by the user's client. If you have created a Game and accepted the conditions via @Botfather, specify the URL that opens your game – note that this will only work if the query comes from a callback_game button.
     */

    /**
     * Use this method to send answers to callback queries sent from inline keyboards. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, True is returned.
     * @param {string} callbackQueryId 	Unique identifier for the query to be answered
     * @param {CallbackQueryOptions} options
     * @returns {Promise<boolean>}
     */
    async answerCallbackQuery(callbackQueryId, options = {}) {

        const body = {
            callback_query_id: callbackQueryId,
            text: options.text,
            show_alert: options.showAlert,
            url: options.url,
            cache_time: options.cacheTime
        };

        const sentInfo = await sendMessageKinds(this.token, 'answerCallbackQuery', body);

        if (sentInfo.ok)
            return sentInfo.result;
        else
            throw new TeleResponseError(sentInfo.description, sentInfo.error_code);

    }



    /**
     * For the moment, bots can download files of up to 20MB in size.
     * @param {string} fileId 
     * @returns {Promise<{data:Buffer, fileExtension:string}>}
     */
    async downloadFile(fileId) {

        const fileInfo = await sendMessageKinds(this.token, 'getFile', { file_id: fileId });
        if (fileInfo.ok) {
            const res = await fetch(`https://api.telegram.org/file/bot${this.token}/${fileInfo.result.file_path}`);
            const data = await res.buffer();
            return {
                data,
                fileExtension: fileInfo.result.file_path.split('.').pop()
            };
        }
        else {
            throw new TeleResponseError(fileInfo.description, fileInfo.error_code);
        }

    }



    /**
     * @param {string} fileId File identifier to get info about
     * @returns {Promise<{link:string, fileExtension:string}>}
     */
    async getFileDownloadLink(fileId) {
        const fileInfo = await sendMessageKinds(this.token, 'getFile', { file_id: fileId });
        if (fileInfo.ok) {
            return {
                link: `https://api.telegram.org/file/bot${this.token}/${fileInfo.result.file_path}`,
                fileExtension: fileInfo.result.file_path.split('.').pop()
            };
        }
        else {
            throw new TeleResponseError(fileInfo.description, fileInfo.error_code);
        }

    }


}


module.exports = Bot;