class Context {

    constructor(update, bot) {
        /**
         * @type {Message}
         */
        this.message = update.message ? new Message(update.message, bot) : undefined;
        /**
         * @type {Message}
         */
        this.editedMessage = update.edited_message ? new Message(update.edited_message, bot) : undefined;
        /**
         * @type {InlineQuery}
         */
        this.inlineQuery = update.inline_query ? new InlineQuery(update.inline_query, bot) : undefined;
        /**
         * @type {CallbackQuery}
         */
        this.callbackQuery = update.callback_query ? new CallbackQuery(update.callback_query, bot) : undefined;
        /**
         * @type {PollType}
         */
        this.poll = update.poll ? new PollType(update.poll) : undefined;
        /**
         *  @type {ChosenInlineResult}
         */
        this.chosenInlineResult = update.chosen_inline_result ? new ChosenInlineResult(update.chosen_inline_result) : undefined;
    }


    /**
     * @returns {'message' | 'editedMessage' | 'inlineQuery' | 'poll' | 'callbackQuery'|'chosenInlineResult'}
     */
    get content() {
        if (this.message)
            return 'message';

        if (this.editedMessage)
            return 'editedMessage';

        if (this.inlineQuery)
            return 'inlineQuery';

        if (this.poll)
            return 'poll';

        if (this.callbackQuery)
            return 'callbackQuery';

        if (this.chosenInlineResult)
            return 'chosenInlineResult';
    }


    set content(input) {
        throw new Error('You can not change the content type');
    }

}




class Message {

    #bot;

    constructor(message, bot) {
        this.#bot = bot;
        /**
         * Unique message identifier inside this chat
         * @type {string}
         */
        this.messageId = message.message_id;
        /**
         * Sender, empty for messages sent to channels
         * @type {User}
         */
        this.from = message.from ? new User(message.from, bot) : undefined;
        /**
         * Date the message was sent
         * @type {Date}
         */
        this.date = new Date(message.date * 1000);
        /**
         * Conversation the message belongs to
         * @type {Chat}
         */
        this.chat = new Chat(message.chat, bot);
        /**
         * For forwarded messages, sender of the original message
         * @type {User}
         */
        this.forwardFrom = message.forward_from ? new User(message.forward_from, bot) : undefined;
        /**
         * For messages forwarded from channels, information about the original channel
         * @type {Chat}
         */
        this.forwardFromChat = message.forward_from_chat ? new Chat(message.forward_from_chat) : undefined;
        /**
         * For messages forwarded from channels, identifier of the original message in the channel
         * @type {number}
         */
        this.forwardFromMessageId = message.forward_from_message_id;
        /**
         * For messages forwarded from channels, signature of the post author if present
         * @type {string}
         */
        this.forwardSignature = message.forward_signature;
        /**
         * Sender's name for messages forwarded from users who disallow adding a link to their account in forwarded messages
         * @type {string}
         */
        this.forwardSenderName = message.forward_sender_name;
        /**
         * For forwarded messages, date the original message was sent
         * @type {Date}
         */
        this.forwardDate = message.forward_date ? new Date(message.forward_date * 1000) : undefined;
        /**
         * For replies, the original message. Note that the Message object in this field will not contain further reply_to_message fields even if it itself is a reply.
         * @type {Message}
         */
        this.replyToMessage = message.reply_to_message ? new Message(message.reply_to_message) : undefined;
        /**
         * Date the message was last edited
         * @type {Date}
         */
        this.editDate = message.edit_date ? new Date(message.edit_date * 1000) : undefined;
        /**
         * The unique identifier of a media message group this message belongs to
         * @type {string}
         */
        this.mediaGroupId = message.media_group_id;
        /**
         * Signature of the post author for messages in channels
         * @type {string}
         */
        this.authorSignature = message.author_signature;
        /**
         * For text messages, the actual UTF-8 text of the message, 0-4096 characters
         * @type {string}
         */
        this.text = message.text;
        /**
         * For text messages, special entities like usernames, URLs, bot commands, etc. that appear in the text
         * @type {MessageEntity[]}
         */
        this.entities = message.entities ? message.entities.map(entity => new MessageEntity(entity, bot)) : undefined;
        /**
         * For messages with a caption, special entities like usernames, URLs, bot commands, etc. that appear in the caption
         * @type {MessageEntity[]}
         */
        this.captionEntities = message.caption_entities ? message.caption_entities.map(entity => new MessageEntity(entity, bot)) : undefined;
        /**
         * Message is an audio file, information about the file
         * @type {AudioType}
         */
        this.audio = message.audio ? new AudioType(message.audio, bot) : undefined;
        /**
         * Message is a general file, information about the file
         * @type {DocumentType}
         */
        this.document = message.document ? new DocumentType(message.document, bot) : undefined;
        /**
         * Message is an animation, information about the animation. For backward compatibility, when this field is set, the document field will also be set
         * @type {AnimationType}
         */
        this.animation = message.animation ? new AnimationType(message.animation, bot) : undefined;
        /**
         * Message is a game, information about the game
         * @type {GameType}
         */
        this.game = message.game ? new GameType(message.game, bot) : undefined;
        /**
         * Message is a photo, available sizes of the photo
         * @type {PhotoSize[]}
         */
        this.photo = message.photo ? message.photo.map(p => new PhotoSize(p, bot)) : undefined;
        /**
         * Message is a sticker, information about the sticker
         * @type {StickerType}
         */
        this.sticker = message.sticker ? new StickerType(message.sticker, bot) : undefined;
        /**
         * Message is a video, information about the video
         * @type {VideoType}
         */
        this.video = message.video ? new VideoType(message.video, bot) : undefined;
        /**
         * Message is a voice message, information about the file
         * @type {VoiceType}
         */
        this.voice = message.voice ? new VoiceType(message.voice, bot) : undefined;
        /**
         * Message is a video note, information about the video message
         * @type {VideoNote}
         */
        this.videoNote = message.video_note ? new VideoNote(message.video_note, bot) : undefined;
        /**
         * Caption for the animation, audio, document, photo, video or voice, 0-1024 characters
         * @type {string}
         */
        this.caption = message.caption;
        /**
         * Message is a shared contact, information about the contact
         * @type {ContactType}
         */
        this.contact = message.contact ? new ContactType(message.contact) : undefined;
        /**
         * Message is a shared location, information about the location
         * @type {LocationType}
         */
        this.location = message.location ? new LocationType(message.location) : undefined;
        /**
         * Message is a venue, information about the venue
         * @type {VenueType}
         */
        this.venue = message.venue ? new VenueType(message.venue) : undefined;
        /**
         * Message is a native poll, information about the poll
         * @type {PollType}
         */
        this.poll = message.poll ? new PollType(message.poll) : undefined;
        /**
         * Message is a dice with random value from 1 to 6
         * @type {Dice}
         */
        this.dice = message.dice ? new Dice(message.dice) : undefined;
        /**
         * New members that were added to the group or supergroup and information about them (the bot itself may be one of these members)
         * @type {User[]}
         */
        this.newChatMembers = message.new_chat_members ? message.new_chat_members.map(m => new User(m, bot)) : undefined;
        /**
         * A member was removed from the group, information about them (this member may be the bot itself)
         * @type {User[]}
         */
        this.leftChatMember = message.leftChatMember ? new User(message.left_chat_member, bot) : undefined;
        /**
         * A chat title was changed to this value
         * @type {string}
         */
        this.newChatTitle = message.new_chat_title;
        /**
         * A chat photo was change to this value
         * @type {PhotoSize[]}
         */
        this.newChatPhoto = message.new_chat_photo ? message.new_chat_photo.map(p => new PhotoSize(p)) : undefined;
        /**
         * Service message: the chat photo was deleted
         * @type {boolean}
         */
        this.deleteChatPhoto = message.delete_chat_photo;
        /**
         * Service message: the group has been created
         * @type {boolean}
         */
        this.groupChatCreated = message.group_chat_created;
        /**
         * Service message: the supergroup has been created. This field can‘t be received in a message coming through updates, because bot can’t be a member of a supergroup when it is created. It can only be found in reply_to_message if someone replies to a very first message in a directly created supergroup.
         * @type {boolean}
         */
        this.supergroupChatCreated = message.supergroup_chat_created;
        /**
         * the channel has been created. This field can‘t be received in a message coming through updates, because bot can’t be a member of a channel when it is created. It can only be found in reply_to_message if someone replies to a very first message in a channel.
         * @type {boolean}
         */
        this.channelChatCreated = message.channel_chat_created;
        /**
         * The group has been migrated to a supergroup with the specified identifier. This number may be greater than 32 bits and some programming languages may have difficulty/silent defects in interpreting it. But it is smaller than 52 bits, so a signed 64 bit integer or double-precision float type are safe for storing this identifier.
         * @type {number}
         */
        this.migrateToChatId = message.migrate_to_chat_id;
        /**
         * The supergroup has been migrated from a group with the specified identifier. This number may be greater than 32 bits and some programming languages may have difficulty/silent defects in interpreting it. But it is smaller than 52 bits, so a signed 64 bit integer or double-precision float type are safe for storing this identifier.
         * @type {number}
         */
        this.migrateFromChatId = message.migrate_from_chat_id;
        /**
         * Specified message was pinned. Note that the Message object in this field will not contain further reply_to_message fields even if it is itself a reply.
         * @type {Message}
         */
        this.pinnedMessage = message.pinned_message ? new Message(message.pinned_message) : undefined;
        /**
         * Message is an invoice for a payment, information about the invoice.
         * @type {InvoiceType}
         */
        this.invoice = message.invoice ? new InvoiceType(message.invoice) : undefined;
        /**
         * Message is a service message about a successful payment, information about the payment.
         * @type {SuccessfulPayment}
         */
        this.successfulPayment = message.successful_payment ? new SuccessfulPayment(successful_payment) : undefined;
        /**
         * The domain name of the website on which the user has logged in.
         * @type {string}
         */
        this.connectedWebsite = message.connected_website;

        //passport_data MISSING

        /**
         * Inline keyboard attached to the message. login_url buttons are represented as ordinary url buttons.
         * @type {InlineKeyboardMarkup}
         */
        this.replyMarkup = message.reply_markup ? new InlineKeyboardMarkup(message.reply_markup) : undefined;

    }

    //my custom methods


    /**
     * 
     * @typedef {Object} ReplyTextOptions
     * @property {'html'|'markdown'} parseMode Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
     * @property {boolean} disableWebPagePreview Disables link previews for links in this message
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to reply with text messages. On success, the sent Message is returned.
     * @param {string} textMessage Text of the message to be sent, 1-4096 characters after entities parsing
     * @param {ReplyTextOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * ctx.message.replyWithText('hey, whats up?😃')
            .then(sentMessage => console.log(sentMessage))
            .catch(err => console.log(err.message));
     */
    async replyWithText(text, options = {}) {
        options.replyToMessageId = this.messageId;
        return this.#bot.sendText(this.chat.id, text, options);
    }




    /**
     * 
     * @typedef {Object} ReplyPollOptions
     * @property {boolean} isAnonymous True, if the poll needs to be anonymous, defaults to True
     * @property {'quiz'|'regular'} type Poll type, “quiz” or “regular”, defaults to “regular”
     * @property {boolean} allowsMultipleAnswers True, if the poll allows multiple answers, ignored for polls in quiz mode, defaults to False
     * @property {number} correctOptionId 0-based identifier of the correct answer option, required for polls in quiz mode
     * @property {boolean} isClosed Pass True, if the poll needs to be immediately closed. This can be useful for poll preview.
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to reply with a native poll. On success, the sent Message is returned.
     * @param {string} question Poll question, 1-255 characters
     * @param {string[]} answerOptions Array of answer options, 2-10 strings 1-100 characters each
     * @param {ReplyPollOptions} [methodOptions]
     * @returns {Promise<Message>}
     * @example
     * ctx.message.replyWithPoll('do you love me?', ['Yes I do😍', 'Maybe🙄'])
            .then(sentMessage => console.log(sentMessage))
            .catch(err => console.log(err));
     */
    async replyWithPoll(question, answerOptions, methodOptions = {}) {
        methodOptions.replyToMessageId = this.messageId;
        return this.#bot.sendPoll(this.chat.id, question, answerOptions, methodOptions);
    }




    /**
     * 
     * @typedef {Object} ReplyPhotoOptions
     * @property {string} caption Audio caption, 0-1024 characters after entities parsing
     * @property {'html'|'markdown'} parseMode Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to reply with photos. On success, the sent Message is returned.
     * @param {string|ReadableStream} photo fileId or url or fs.createReadStream
     * @param {ReplyPhotoOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * ctx.message.replyWithPhoto('photo_file_id').then().catch()
     * //or
     * ctx.message.replyWithPhoto('http://example.com/photo.jpg').then().catch()
     * //or
     * const fs = require('fs');
     * ctx.message.replyWithPhoto(fs.createReadStream('./photo.jpg')).then().catch()
     */
    async replyWithPhoto(photo, options = {}) {
        options.replyToMessageId = this.messageId;
        return this.#bot.sendPhoto(this.chat.id, photo, options);
    }




    /**
     * 
     * @typedef {Object} ReplyAnimationOptions
     * @property {string} caption Audio caption, 0-1024 characters after entities parsing
     * @property {'html'|'markdown'} parseMode Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
     * @property {number} width Video width
     * @property {number} height Video height
     * @property {number} duration Duration of the audio in seconds
     * @property {string} thumb 
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to reply with animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent Message is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.
     * @param {string} animation fileId or url or fs.createReadStream
     * @param {ReplyAnimationOptions} [options]
     * @returns {Message}
     * @example
     * ctx.message.replyWithAnimation('gif_file_id').then().catch()
     * //or
     * ctx.message.replyWithAnimation('https://example.com/giphy.gif').then().catch();
     * //or
     * const fs = require('fs');
     * ctx.message.replyWithAnimation(fs.createReadStream('./giphy.gif')).then().catch()
     */
    async replyWithAnimation(animation, options = {}) {
        options.replyToMessageId = this.messageId;
        return this.#bot.sendAnimation(this.chat.id, animation, options);
    }




    /**
     * 
     * @typedef {Object} ReplyVideoOptions
     * @property {string} caption Video caption, 0-1024 characters after entities parsing
     * @property {'html'|'markdown'} parseMode Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
     * @property {boolean} supportsStreaming Pass True, if the uploaded video is suitable for streaming
     * @property {number} width Video width
     * @property {number} height Video height
     * @property {number} duration Duration of the audio in seconds
     * @property {string} thumb 
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to reply with video files, Telegram clients support mp4 videos (other formats may be sent as Document). On success, the sent Message is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
     * @param {string|ReadableStream} video fileId or url or fs.createReadStream
     * @param {ReplyVideoOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * ctx.message.replyWithVideo('video_file_id').then().catch()
     * //or
     * ctx.message.replyWithVideo('http://example.com/video.mp4').then().catch()
     * //or
     * const fs = require('fs');
     * ctx.message.replyWithVideo(fs.createReadStream('./video.mp4')).then().catch()
     */
    async replyWithVideo(video, options = {}) {
        options.replyToMessageId = this.messageId;
        return this.#bot.sendVideo(this.chat.id, video, options);
    }




    /**
     * 
     * @typedef {Object} ReplyVideoNoteOptions
     * @property {number} duration Duration of sent video in seconds
     * @property {string} thumb 
     * @property {number} length Video width and height, i.e. diameter of the video message
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * As of v.4.0, Telegram clients support rounded square mp4 videos of up to 1 minute long. Use this method to send video messages. On success, the sent Message is returned.
     * @param {string|ReadableStream} video fileId or url or fs.createReadStream
     * @param {ReplyVideoNoteOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * ctx.message.replyWithVideoNote('video_file_id').then().catch()
     * //or
     * ctx.message.replyWithVideoNote('http://example.com/video.mp4').then().catch()
     * //or
     * const fs = require('fs');
     * ctx.message.replyWithVideoNote(fs.createReadStream('./video.mp4')).then().catch()
     */
    async replyWithVideoNote(videoNote, options = {}) {
        options.replyToMessageId = this.messageId;
        return this.#bot.sendVideoNote(this.chat.id, videoNote, options);
    }




    /**
     * 
     * @typedef {Object} ReplyAudioOptions
     * @property {string} caption Audio caption, 0-1024 characters after entities parsing
     * @property {'html'|'markdown'} parseMode Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
     * @property {number} duration Duration of the audio in seconds
     * @property {string} performer Performer
     * @property {string} title Track name
     * @property {string} thumb 
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to reply with audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent Message is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
     * @param {string|ReadableStream} audio fileId or url or fs.createReadStream
     * @param {ReplyAudioOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * ctx.message.replyWithAudio('audio_file_id').then().catch()
     * //or
     * ctx.message.replyWithAudio('http://example.com/audio.mp3').then().catch()
     * //or
     * const fs = require('fs');
     * ctx.message.replyWithAudio(fs.createReadStream('./audio.mp3')).then().catch()
     */
    async replyWithAudio(audio, options = {}) {
        options.replyToMessageId = this.messageId;
        return this.#bot.sendAudio(this.chat.id, audio, options);
    }




    /**
     * 
     * @typedef {Object} ReplyVoiceOptions
     * @property {string} caption Audio caption, 0-1024 characters after entities parsing
     * @property {'html'|'markdown'} parseMode Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
     * @property {number} duration Duration of the voice in seconds
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to reply with audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent Message is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
     * @param {string|ReadableStream} voice fileId or url or fs.createReadStream
     * @param {ReplyVoiceOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * ctx.message.replyWithVoice('audio_file_id').then().catch()
     * //or
     * ctx.message.replyWithVoice('http://example.com/audio.ogg').then().catch()
     * //or
     * const fs = require('fs');
     * ctx.message.replyWithVoice(fs.createReadStream('./audio.ogg')).then().catch()
     */
    async replyWithVoice(voice, options = {}) {
        options.replyToMessageId = this.messageId;
        return this.#bot.sendVoice(this.chat.id, voice, options);
    }




    /**
     * 
     * @typedef {Object} ReplyDocumentOptions
     * @property {string} caption Audio caption, 0-1024 characters after entities parsing
     * @property {'html'|'markdown'} parseMode Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
     * @property {string} thumb 
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to reply with general files. On success, the sent Message is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
     * @param {string|ReadableStream} document fileId or url or fs.createReadStream
     * @param {ReplyDocumentOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * ctx.message.replyWithDocument('file_id').then().catch()
     * //or
     * ctx.message.replyWithDocument('http://example.com/something.pdf').then().catch()
     * //or
     * const fs = require('fs');
     * ctx.message.replyWithDocument(fs.createReadStream('./something.html')).then().catch()
     */
    async replyWithDocument(document, options = {}) {
        options.replyToMessageId = this.messageId;
        return this.#bot.sendDocument(this.chat.id, document, options);
    }




    /**
     * 
     * @typedef {Object} ReplyLocationOptions
     * @property {number} livePeriod Period in seconds for which the location will be updated (see Live Locations, should be between 60 and 86400.
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to reply with point on the map. On success, the sent Message is returned.
     * @param {number} latitude Latitude of the location
     * @param {number} longitude Longitude of the location
     * @param {ReplyLocationOptions} [options] 
     * @returns {Promise<Message>}
     * @example
     * ctx.message.replyWithLocation(48.8584, 2.2945)
            .then(sentMessage => console.log(sentMessage))
            .catch(err => console.log(err));
     */
    async replyWithLocation(latitude, longitude, options = {}) {
        options.replyToMessageId = this.messageId;
        return this.#bot.sendLocation(this.chat.id, latitude, longitude, options);
    }




    /**
     * 
     * @typedef {Object} ReplyVenueOptions
     * @property {string} foursquareId Foursquare identifier of the venue
     * @property {string} foursquareType Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.)
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to reply with information about a venue. On success, the sent Message is returned.
     * @param {number} latitude Latitude of the venue
     * @param {number} longitude Longitude of the venue
     * @param {string} title Name of the venue
     * @param {string} address Address of the venue
     * @param {ReplyVenueOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * ctx.message.replyWithVenue(48.8584, 2.2945, 'Eiffel Tower', 'Eiffel Tower address')
            .then(sentMessage => console.log(sentMessage))
            .catch(err => console.log(err));
     */
    async replyWithVenue(latitude, longitude, title, address, options = {}) {
        options.replyToMessageId = this.messageId;
        return this.#bot.sendVenue(this.chat.id, latitude, longitude, title, address, options);
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
     * @typedef {Object} replyMediaGroupOptions
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     */

    /**
     * 
     * Use this method to send a group of photos or videos as an album. On success, an array of the sent Messages is returned.
     * @param {MediaSendTYPE[]} media A JSON-serialized array describing photos and videos to be sent, must include 2–10 items
     * @param {replyMediaGroupOptions} options 
     * @returns {Message[]}
     * @example
     * async function messageHandler(msg) {
            try {
                await msg.replyWithMediaGroup([
                    {
                        type: 'photo',
                        media: 'https://wallpapercave.com/wp/wp2508452.jpg'
                    },
                    {
                        type: 'photo',
                        media: 'https://wallpapercave.com/wp/wp2508458.jpg'
                    }
                ]);
            }
            catch (err) {
                console.log(err.message);
            }
        }
     */
    async replyWithMediaGroup(media, options = {}) {
        options.replyToMessageId = this.messageId;
        return this.#bot.sendMediaGroup(this.chat.id, media, options);
    }




    /**
     * 
     * @typedef {Object} ReplyContactOptions
     * @property {string} lastName Contact's last name
     * @property {string} vcard Additional data about the contact in the form of a vCard, 0-2048 bytes
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to reply with phone contacts. On success, the sent Message is returned.
     * @param {string} phoneNumber Contact's phone number
     * @param {string} firstName 
     * @param {ReplyContactOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * ctx.message.replyWithContact('09129994444', 'James', { lastName: 'May' })
            .then(sentMessage => console.log(sentMessage))
            .catch(err => console.log(err));
     */
    async replyWithContact(phoneNumber, firstName, options = {}) {
        options.replyToMessageId = this.messageId;
        return this.#bot.sendContact(this.chat.id, phoneNumber, firstName, options);
    }




    /**
     * 
     * @typedef {Object} ReplyStickerOptions
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to reply with static .WEBP or animated .TGS stickers. On success, the sent Message is returned.
     * @param {string|ReadableStream} sticker fileId or url or fs.createReadStream
     * @param {ReplyStickerOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * ctx.message.replyWithSticker('sticker_file_id')
            .then(sentMessage => console.log(sentMessage))
            .catch(err => console.log(err));
     */
    async replyWithSticker(sticker, options = {}) {
        options.replyToMessageId = this.messageId;
        return this.#bot.sendSticker(this.chat.id, sticker, options);
    }




    /**
     * 
     * @typedef {Object} ReplyDiceOptions
     * @property {'🎲' | '🎯'} emoji Emoji on which the dice throw animation is based. Currently, must be one of “🎲” or “🎯”. Defaults to “🎲”
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */
    /**
     * Use this method to send a dice, which will have a random value from 1 to 6. On success, the sent Message is returned.
     * @param {ReplyDiceOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * ctx.message.replyWithDice()
            .then(sentMessage => console.log(sentMessage))
            .catch(err => console.log(err));
     */
    async replyWithDice(options = {}) {
        options.replyToMessageId = this.messageId;
        return this.#bot.sendDice(this.chat.id, options);
    }




    /**
     * 
     * @typedef {Object} EditTextOptions
     * @property {string} inlineMessageId Required if chatId and messageId are not specified. Identifier of the inline message
     * @property {'html'|'markdown'} parseMode Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
     * @property {boolean} disableWebPagePreview Disables link previews for links in this message
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to edit text and game messages. On success, if edited message is sent by the bot, the edited Message is returned, otherwise True is returned.
     * @param {string} text Text of the message to be sent, 1-4096 characters after entities parsing
     * @param {EditTextOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * ctx.message.editText('we edited this message😀😀')
     */
    async editText(text, options = {}) {
        return this.#bot.editMessageText(this.chat.id, this.messageId, text, options);
    }




    /**
     * 
     * @typedef {Object} EditCaptionOptions
     * @property {string} inlineMessageId Required if chatId and messageId are not specified. Identifier of the inline message
     * @property {'html'|'markdown'} parseMode Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to edit captions of messages. On success, if edited message is sent by the bot, the edited Message is returned, otherwise True is returned.
     * @param {string} caption New caption of the message, 0-1024 characters after entities parsing
     * @param {EditCaptionOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * ctx.message.editCaption('editing message 😊')
     *      .then(editedMessage => console.log(editedMessage));
     */
    async editCaption(caption, options = {}) {
        return this.#bot.editMessageCaption(this.chat.id, this.messageId, caption, options);
    }




    /**
     * 
     * @typedef {Object} EditReplyMarkupOptions
     * @property {string} inlineMessageId Required if chatId and messageId are not specified. Identifier of the inline message
     */

    /**
     * Use this method to edit only the reply markup of messages. On success, if edited message is sent by the bot, the edited Message is returned, otherwise True is returned.
     * @param {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup A JSON-serialized object for an inline keyboard.
     * @param {EditReplyMarkupOptions} [options]
     * @returns {Promise<Message>}
     * @example
     * ctx.callbackQuery.message.editReplyMarkup({
                inline_keyboard: [
                    [
                        { text: 'Thanks for the vote🥰', callback_data: 'NOT_IMPORTANT' }
                    ]
                ]
            });
     */
    async editReplyMarkup(replyMarkup, options = {}) {
        return this.#bot.editMessageReplyMarkup(this.chat.id, this.messageId, replyMarkup, options);
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
     * @typedef {Object} editMediaOptions
     * @property {string} inlineMessageId Required if chatId and messageId are not specified. Identifier of the inline message
     * @property {InlineKeyboardMarkup| ReplyKeyboardMarkup|ReplyKeyboardRemove} replyMarkup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */

    /**
     * Use this method to edit animation, audio, document, photo, or video messages. If a message is a part of a message album, then it can be edited only to a photo or a video. Otherwise, message type can be changed arbitrarily. When inline message is edited, new file can't be uploaded. Use previously uploaded file via its file_id or specify a URL. On success, if the edited message was sent by the bot, the edited Message is returned, otherwise True is returned.
     * @param {MediaTYPE} media A JSON-serialized object for a new media content of the message
     * @param {editMediaOptions} [options]
     * @returns {Promise<Message>}
     */

    async editMedia(media) {
        return this.#bot.editMessageMedia(this.chat.id, this.messageId, media);
    }




    /**
     * 
     * @typedef {Object} forwardOptions
     * @property {boolean} disableNotification Sends the message silently. Users will receive a notification with no sound.
     */

    /**
     * 
     * Use this method to forward messages of any kind. On success, the sent Message is returned.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param {forwardOptions} options 
     * @example
     * ctx.message.forwardTo(chatId)
     *      .then(sentMessage => console.log(sentMessage))
     *      .catch(err => console.log(err));
     */
    async forwardTo(chatId, options = {}) {
        return this.#bot.forwardMessage(chatId, this.chat.id, this.messageId, options);
    }




    /**
     * 
     * Use this method to delete a message, including service messages, with the following limitations:
     - A message can only be deleted if it was sent less than 48 hours ago.
     - A dice message in a private chat can only be deleted if it was sent more than 24 hours ago.
     - Bots can delete outgoing messages in private chats, groups, and supergroups.
     - Bots can delete incoming messages in private chats.
     - Bots granted can_post_messages permissions can delete outgoing messages in channels.
     - If the bot is an administrator of a group, it can delete any message there.
     - If the bot has can_delete_messages permission in a supergroup or a channel, it can delete any message there.
     Returns True on success.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param {forwardOptions} options 
     * @example
     * const fs = require('fs');
        async function messageHandler(msg) {
            try {
                msg.delete();
                const sentMsg = await bot.sendPhoto(msg.chat.id, fs.createReadStream('./public/midnight-madonna.jpg'));
                await delay(5);
                await sentMsg.delete();
            }
            catch (err) {
                console.log(err.message);
            }
        }
     */
    async delete() {
        return this.#bot.deleteMessage(this.chat.id, this.messageId);
    }




    /**
     * 
     * @typedef {Object} pinChatMessage
     * @property {boolean} disableNotification Pass True, if it is not necessary to send a notification to all chat members about the new pinned message. Notifications are always disabled in channels.
     * @returns {Promise<boolean>}
     */

    /**
     * 
     * @param {pinChatMessage} options 
     */
    async pinThisMessage(options = {}) {
        if (this.chat.type !== 'private') {
            return this.#bot.pinChatMessage(this.chat.id, this.messageId, options);
        }
        else {
            throw new Error(`can't pin message in the private chat`);
        }
    }


}




class MessageEntity {

    constructor(entity, bot) {
        this.type = entity.type;
        this.offset = entity.offset;
        this.length = entity.length;
        this.url = entity.url;
        this.user = entity.user ? new User(entity.user, bot) : undefined;
        this.language = entity.language;
    }

}




class CallbackQuery {

    #bot;

    constructor(query, bot) {
        this.#bot = bot;
        /**
         * Unique identifier for this query
         * @type {string}
         */
        this.id = query.id;
        /**
         * Sender
         * @type {User}
         */
        this.from = new User(query.from, bot);
        /**
         * Optional. Message with the callback button that originated the query. Note that message content and message date will not be available if the message is too old
         * @type {Message}
         */
        this.message = query.message ? new Message(query.message, bot) : undefined;
        /**
         * Optional. Identifier of the message sent via the bot in inline mode, that originated the query.
         * @type {string}
         */
        this.inlineMessageId = query.inline_message_id;
        /**
         * Global identifier, uniquely corresponding to the chat to which the message with the callback button was sent. Useful for high scores in games.
         * @type {string}
         */
        this.chatInstance = query.chat_instance;
        /**
         * ptional. Data associated with the callback button. Be aware that a bad client can send arbitrary data in this field.
         * @type {string}
         */
        this.data = query.data;
        /**
         * Optional. Short name of a Game to be returned, serves as the unique identifier for the game
         * @type {string}
         */
        this.gameShortName = query.gameShortName ? new GameType(query.gameShortName, bot) : undefined;
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
     * @param {CallbackQueryOptions} options
     * @returns {Promise<boolean>}
     */
    async answer(options = {}) {

        return this.#bot.answerCallbackQuery(this.id, options);

    }

}





class User {

    #bot;

    constructor(user, bot) {
        this.#bot = bot;
        /**
         * Unique identifier for this user or bot
         * @type {number}
         */
        this.id = user.id;
        /**
         * True, if this user is a bot
         * @type {boolean}
         */
        this.isBot = user.is_bot;
        /**
         * User‘s or bot’s first name
         * @type {string}
         */
        this.firstName = user.first_name;
        /**
         * Optional. User‘s or bot’s last name
         * @type {string}
         */
        this.lastName = user.last_name;
        /**
         * Optional. User‘s or bot’s username
         * @type {string}
         */
        this.username = user.username;
        /**
         * Optional. IETF language tag of the user's language
         * @type {string}
         */
        this.languageCode = user.language_code;
        /**
         * Optional. True, if the bot can be invited to groups. Returned only in getMe.
         * @type {boolean}
         */
        this.canJoinGroups = user.can_join_groups;
        /**
         * Optional. True, if privacy mode is disabled for the bot. Returned only in getMe.
         * @type {boolean}
         */
        this.canReadAllGroupMessages = user.can_read_all_group_messages;
        /**
         * Optional. True, if the bot supports inline queries. Returned only in getMe.
         * @type {boolean}
         */
        this.supportsInlineQueries = user.supports_inline_queries;
    }


    /**
     * 
     * @typedef {Object} getProfilePhotosOptions
     * @property {number} offset Sequential number of the first photo to be returned. By default, all photos are returned.
     * @property {number} limit Limits the number of photos to be retrieved. Values between 1—100 are accepted. Defaults to 100.
     */

    /**
     * Use this method to get a list of profile pictures for a user. Returns a UserProfilePhotos object.
     * @param {getProfilePhotosOptions} options 
     * @returns {Promise<UserProfilePhotos>}
     * @example
     */
    async getProfilePhotos(options = {}) {
        return this.#bot.getUserProfilePhotos(this.id, options);
    }

}




class Chat {

    #bot;

    constructor(chat, bot) {
        this.#bot = bot;
        /**
         * Unique identifier for this chat. This number may be greater than 32 bits and some programming languages may have difficulty/silent defects in interpreting it. But it is smaller than 52 bits, so a signed 64 bit integer or double-precision float type are safe for storing this identifier.
         * @type {number}
         */
        this.id = chat.id;
        /**
         * Type of chat, can be either “private”, “group”, “supergroup” or “channel”
         * @type {'private'|'group'|'supergroup'|'channel'}
         */
        this.type = chat.type;
        /**
         * Optional. Title, for supergroups, channels and group chats
         * @type {string}
         */
        this.title = chat.title;
        /**
         * Optional. Username, for private chats, supergroups and channels if available
         * @type {string}
         */
        this.username = chat.username;
        /**
         * Optional. First name of the other party in a private chat
         * @type {string}
         */
        this.firstName = chat.first_name;
        /**
         * Optional. Last name of the other party in a private chat
         * @type {string}
         */
        this.lastName = chat.last_name;
        /**
         * Optional. Chat photo. Returned only in getChat method.
         * @type {ChatPhoto}
         */
        this.photo = chat.photo ? new ChatPhoto(chat.photo, bot) : undefined;
        /**
         * ptional. Description, for groups, supergroups and channel chats. Returned only in getChat method.
         * @type {string}
         */
        this.description = chat.description;
        /**
         * Optional. Chat invite link, for groups, supergroups and channel chats. Each administrator in a chat generates their own invite links, so the bot must first generate the link using exportChatInviteLink. Returned only in getChat method.
         * @type {string}
         */
        this.inviteLink = chat.invite_link;
        /**
         * Optional. Pinned message, for groups, supergroups and channels. Returned only in getChat method.
         * @type {Message}
         */
        this.pinnedMessage = chat.pinnedMessage ? new Message(chat.pinned_message) : undefined;
        /**
         * Optional. Default chat member permissions, for groups and supergroups. Returned only in getChat method.
         * @type {ChatPermissions}
         */
        this.permissions = chat.permissions ? new ChatPermissions(chat.permissions) : undefined;
        /**
         * Optional. For supergroups, the minimum allowed delay between consecutive messages sent by each unpriviledged user. Returned only in getChat.
         * @type {number}
         */
        this.slowModeDelay = chat.slow_mode_delay;
        /**
         * Optional. For supergroups, name of group sticker set. Returned only in getChat.
         * @type {string}
         */
        this.stickerSetName = chat.sticker_set_name;
        /**
         * Optional. True, if the bot can change the group sticker set. Returned only in getChat.
         * @type {boolean}
         */
        this.canSetStickerSet = chat.can_set_sticker_set;
    }


    /**
     * 
     * @typedef {Object} kickMemberOptions
     * @property {Date} untilDate Date when the user will be unbanned. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever
     */

    /**
     * Use this method to kick a user from a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the group on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Returns True on success.
     * @param {number} userId Unique identifier of the target user
     * @param {kickMemberOptions} options
     * @returns {Promise<boolean>}
     * @example
     * chat.kickMember(userId)
            .then(isKicked => {
                console.log(isKicked);
            });
     */
    async kickMember(userId, options = {}) {
        return this.#bot.kickChatMember(this.id, userId, options);
    }


    /**
     * Use this method to unban a previously kicked user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. Returns True on success.
     * @param {number} userId Unique identifier of the target user
     * @returns {Promise<boolean>}
     * @example
     * chat.unbanChatMember(userId)
            .then(isUnban => {
                console.log(isUnban);
            });
     */
    async unbanMember(userId) {
        return this.#bot.unbanChatMember(this.id, userId);
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
     * @typedef {Object} restrictMemberOptions
     * @property {Date} untilDate Date when restrictions will be lifted for the user, unix time. If user is restricted for more than 366 days or less than 30 seconds from the current time, they are considered to be restricted forever
     */

    /**
     * Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate admin rights. Pass True for all permissions to lift restrictions from a user. Returns True on success.
     * @param {number} userId Unique identifier of the target user
     * @param {chatPermisions} permissions New user permissions
     * @param {restrictMemberOptions} options
     * @returns {Promise<boolean>}
     * @example
     * 
     */
    async restrictMember(userId, permissions, options) {
        return this.#bot.restrictChatMember(this.id, userId, permissions, options);
    }


    /**
     * 
     * @typedef {Object} promoteMemberOptions
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
     * @param {number} userId Unique identifier of the target user
     * @param {promoteMemberOptions} options
     * @returns {Promise<boolean>}
     * @example
     */
    async promoteMember(userId, options = {}) {
        return this.#bot.promoteChatMember(this.id, userId, options);
    }


    /**
     * Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns True on success.
     * @param {number} userId Unique identifier of the target user
     * @param {string} customTitle New custom title for the administrator; 0-16 characters, emoji are not allowed
     * @returns {boolean}
     */
    async setAdministratorCustomTitle(userId, customTitle) {
        return this.#bot.setChatAdministratorCustomTitle(this.id, userId, customTitle);
    }


    /**
     * Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the can_restrict_members admin rights. Returns True on success.
     * @param {chatPermisions} permissions New default chat permissions
     * @returns {Promise<boolean>}
     * @example
     */
    async setPermissions(permissions) {
        return this.#bot.setChatPermissions(this.id, permissions);
    }


    /**
     * Use this method to generate a new invite link for a chat; any previously generated link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Returns the new invite link as String on success.
     * @returns {Promise<string>}
     * @example
     * ctx.message.chat.exportInviteLink()
            .then(link => {
                return ctx.message.replyWithText(link);
            })
            .then(sentMessage => console.log(sentMessage))
            .catch(err => console.log(err.message))
     */
    async exportInviteLink() {
        return this.#bot.exportChatInviteLink(this.id);
    }


    /**
 * Use this method to set a new profile photo for the chat. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Returns True on success.
 * @param {ReadableStream} photo New chat photo using fs.createReadStream()
 * @returns {Promise<boolean>}
 * @example
 * ctx.message.chat.setPhoto(fs.createReadStream('./cat.jpg'))
        .then(isSet => {
            console.log(isSet);
        });
 */
    async setPhoto(photo) {
        return this.#bot.setChatPhoto(this.id, photo);
    }


    /**
 * Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Returns True on success.
 * @returns {Promise<boolean>}
 * @example
 * ctx.message.chat.deletePhoto()
        .then(deleted => {
            console.log(deleted);
        });
 */
    async deletePhoto() {
        return this.#bot.deleteChatPhoto(this.id);
    }


    /**
     * Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Returns True on success.
     * @param {string} title New chat title, 1-255 characters
     * @returns {Promise<boolean>}
     * @example
     * ctx.message.chat.setTitle('🐉 Depressed Dragons 🐉')
            .then(isSet => console.log(isSet))
            .catch(err => console.log(err.message));
     */
    async setTitle(title) {
        return this.#bot.setChatTitle(this.id, title);
    }


    /**
     * Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Returns True on success.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @returns {Promise<boolean>}
     * @example
     * ctx.message.chat.setDescription('The only way to do a thing, is to do it!')
            .then(isSet => console.log(isSet))
            .catch(err => console.log(err.message));
     */
    async setDescription(description) {
        return this.#bot.setChatDescription(this.id, description);
    }


    /**
 * 
 * @typedef {Object} pinMessage
 * @property {boolean} disableNotification Pass True, if it is not necessary to send a notification to all chat members about the new pinned message. Notifications are always disabled in channels.
 */

    /**
     * Use this method to pin a message in a group, a supergroup, or a channel. The bot must be an administrator in the chat for this to work and must have the ‘can_pin_messages’ admin right in the supergroup or ‘can_edit_messages’ admin right in the channel. Returns True on success.
     * @param {number} messageId Identifier of a message to pin
     * @param {pinMessage} [options] 
     * @returns {Promise<boolean>}
     */
    async pinMessage(messageId, options = {}) {
        return this.#bot.pinChatMessage(this.id, messageId, options);
    }


    /**
     * Use this method to unpin a message in a group, a supergroup, or a channel. The bot must be an administrator in the chat for this to work and must have the ‘can_pin_messages’ admin right in the supergroup or ‘can_edit_messages’ admin right in the channel. Returns True on success.
     * @param {number|string} chatId Unique identifier for the target chat or username of the target channel
     * @returns {Promise<boolean>}
     * @example
     * ctx.message.chat.unpinMessage()
            .then(isUnPinned => console.log(isUnPinned))
            .catch(err => console.log(err.message))
    */
    async unpinMessage() {
        return this.#bot.unpinChatMessage(this.id);
    }


    /**
    * Use this method for your bot to leave a group, supergroup or channel. Returns True on success.
    * @returns {Promise<boolean>}
    * @example
    * ctx.message.chat.leave()
           .then(isOk => console.log(isOk))
           .catch(err => console.log(err.message))
    */
    async leave() {
        return this.#bot.leaveChat(this.id);
    }


    /**
     * Use this method to get a list of administrators in a chat. On success, returns an Array of ChatMember objects that contains information about all chat administrators except other bots. If the chat is a group or a supergroup and no administrators were appointed, only the creator will be returned.
     * @returns {Promise<ChatMember[]>}
     * @example
     * ctx.message.chat.getAdministrators()
            .then(admins => {
                console.log(admins);
            });
     */
    async getAdministrators() {
        return this.#bot.getChatAdministrators(this.id);
    }


    /**
     * Use this method to get the number of members in a chat. Returns Int on success.
     * @returns {Promise<number>}
     * @example
     * ctx.message.chat.getMembersCount()
            .then(count => {
                console.log(count);
            });
     */
    async getMembersCount() {
        return this.#bot.getChatMembersCount(this.id);
    }


    /**
     * Use this method to get information about a member of a chat. Returns a ChatMember object on success.
     * @param {number} userId Unique identifier of the target user
     * @returns {Promise<ChatMember>}
     * @example
     * ctx.message.chat.getMember(userId)
            .then(member => {
                console.log(member);
            });
     */
    async getMember(userId) {
        return this.#bot.getChatMember(this.id, userId)
    }


    /**
     * Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Use the field can_set_sticker_set optionally returned in getChat requests to check if the bot can use this method. Returns True on success.
     * @param {string} stickerSetName Name of the sticker set to be set as the group sticker set
     * @returns {Promise<boolean>}
     * @example
     * ctx.message.chat.setStickerSet(stickerSetName)
            .then(isSet => {
                console.log(isSet);
            });
    */
    async setStickerSet(stickerSetName) {
        return this.#bot.setChatStickerSet(this.id, stickerSetName);
    }


    /**
     * Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate admin rights. Use the field can_set_sticker_set optionally returned in getChat requests to check if the bot can use this method. Returns True on success.
     * @returns {Promise<boolean>}
     * @example
     * ctx.message.chat.deleteStickerSet(chatId)
            .then(deleted => {
                console.log(deleted);
            });
     */
    async deleteStickerSet() {
        return this.#bot.deleteChatStickerSet(this.id);
    }

}




class ChatPermissions {

    constructor(permissions) {
        /**
         * Optional. True, if the user is allowed to send text messages, contacts, locations and venues
         * @type {boolean}
         */
        this.canSendMessages = permissions.can_send_messages;
        /**
         * Optional. True, if the user is allowed to send audios, documents, photos, videos, video notes and voice notes, implies can_send_messages
         * @type {boolean}
         */
        this.canSendMediaMessages = permissions.can_send_media_messages;
        /**
         * Optional. True, if the user is allowed to send polls, implies can_send_messages
         * @type {boolean}
         */
        this.canSendPolls = permissions.can_send_polls;
        /**
         * Optional. True, if the user is allowed to send animations, games, stickers and use inline bots, implies can_send_media_messages
         * @type {boolean}
         */
        this.canSendOtherMessages = permissions.can_send_other_messages;
        /**
         * Optional. True, if the user is allowed to add web page previews to their messages, implies can_send_media_messages
         * @type {boolean}
         */
        this.canAddWebPagePreviews = permissions.can_add_web_page_previews;
        /**
         * Optional. True, if the user is allowed to change the chat title, photo and other settings. Ignored in public supergroups
         * @type {boolean}
         */
        this.canChangeInfo = permissions.can_change_info;
        /**
         * Optional. True, if the user is allowed to invite new users to the chat
         * @type {boolean}
         */
        this.canInviteUsers = permissions.can_invite_users;
        /**
         * Optional. True, if the user is allowed to pin messages. Ignored in public supergroups
         * @type {boolean}
         */
        this.canPinMessages = permissions.can_pin_messages;
    }

}



class ChatPhoto {

    #bot;

    constructor(photo, bot) {
        this.#bot = bot;
        /**
         * File identifier of small (160x160) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed.
         * @type {string}
         */
        this.smallFileId = photo.small_file_id;
        /**
         * Unique file identifier of small (160x160) chat photo, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
         * @type {string}
         */
        this.smallFileUniqueId = photo.small_file_unique_id;
        /**
         * File identifier of big (640x640) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed.
         * @type {string}
         */
        this.bigFileId = photo.big_file_id;
        /**
         * Unique file identifier of big (640x640) chat photo, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
         * @type {string}
         */
        this.bigFileUniqueId = photo.big_file_unique_id;
    }


    /**
     * @returns {Promise<{data:Buffer, fileExtension:string}>}
     */
    async downloadBigOne() {
        return this.#bot.downloadFile(this.bigFileId);
    }

    /**
     * @returns {Promise<{data:Buffer, fileExtension:string}>}
     */
    async downloadSmallOne() {
        return this.#bot.downloadFile(this.smallFileId);
    }


    /**
     * Use this method get get file download link(⛔do not share the damn link, it contains your bot token⛔)
     * @returns {Promise<{link:string, fileExtension:string}>}
     */
    async getDownloadLink() {
        return this.#bot.getFileDownloadLink(this.smallFileId);
    }

}




class ChatMember {

    constructor(member, bot) {
        /**
         * Information about the user
         * @type {User}
         */
        this.user = new User(member.user, bot);
        /**
         * The member's status in the chat. Can be “creator”, “administrator”, “member”, “restricted”, “left” or “kicked”
         * @type {'creator'|'administrator'|'member'|'restricted'|'left'|'kicked'}
         */
        this.status = member.status;
        /**
         * Optional. Owner and administrators only. Custom title for this user
         * @type {string}
         */
        this.customTitle = member.custom_title;
        /**
         * Optional. Restricted and kicked only. Date when restrictions will be lifted for this user; unix time
         * @type {Date}
         */
        this.untilDate = member.until_date ? new Date(member.until_date * 1000) : undefined;
        /**
         * Optional. Administrators only. True, if the bot is allowed to edit administrator privileges of that user
         * @type {boolean}
         */
        this.canBeEdited = member.can_be_edited;
        /**
         * Optional. Administrators only. True, if the administrator can post in the channel; channels only
         * @type {boolean}
         */
        this.canPostMessages = member.can_post_messages;
        /**
         * Optional. Administrators only. True, if the administrator can edit messages of other users and can pin messages; channels only
         * @type {boolean}
         */
        this.canEditMessages = member.can_edit_messages;
        /**
         * Optional. Administrators only. True, if the administrator can delete messages of other users
         * @type {boolean}
         */
        this.canDeleteMessages = member.can_delete_messages;
        /**
         * Optional. Administrators only. True, if the administrator can restrict, ban or unban chat members
         * @type {boolean}
         */
        this.canRestrictMembers = member.can_restrict_members;
        /**
         * Optional. Administrators only. True, if the administrator can add new administrators with a subset of his own privileges or demote administrators that he has promoted, directly or indirectly (promoted by administrators that were appointed by the user)
         * @type {boolean}
         */
        this.canPromoteMembers = member.can_promote_members;
        /**
         * Optional. Administrators and restricted only. True, if the user is allowed to change the chat title, photo and other settings
         * @type {boolean}
         */
        this.canChangeInfo = member.can_change_info;
        /**
         * Optional. Administrators and restricted only. True, if the user is allowed to invite new users to the chat
         * @type {boolean}
         */
        this.canInviteUsers = member.can_invite_users;
        /**
         * Optional. Administrators and restricted only. True, if the user is allowed to pin messages; groups and supergroups only
         * @type {boolean}
         */
        this.canPinMessages = member.can_pin_messages;
        /**
         * Optional. Restricted only. True, if the user is a member of the chat at the moment of the request
         * @type {boolean}
         */
        this.isMember = member.is_member;
        /**
         * Optional. Restricted only. True, if the user is allowed to send text messages, contacts, locations and venues
         * @type {boolean}
         */
        this.canSendMessages = member.can_send_messages;
        /**
         * Optional. Restricted only. True, if the user is allowed to send audios, documents, photos, videos, video notes and voice notes
         * @type {boolean}
         */
        this.canSendMediaMessages = member.can_send_media_messages;
        /**
         * Optional. Restricted only. True, if the user is allowed to send polls
         * @type {boolean}
         */
        this.canSendPolls = member.can_send_polls;
        /**
         * Optional. Restricted only. True, if the user is allowed to send animations, games, stickers and use inline bots
         * @type {boolean}
         */
        this.canSendOtherMessages = member.can_send_other_messages;
        /**
         * Optional. Restricted only. True, if the user is allowed to add web page previews to their messages
         * @type {boolean}
         */
        this.canAddWebPagePreviews = member.can_add_web_page_previews;
    }

}






class AudioType {

    #bot;

    constructor(audio, bot) {
        this.#bot = bot;
        this.fileId = audio.file_id
        this.fileUniqueId = audio.file_unique_id;
        this.duration = audio.duration;
        this.performer = audio.performer;
        this.title = audio.title;
        this.mimeType = audio.mime_type;
        this.fileSize = audio.file_size;
        this.thumb = audio.thumb ? new PhotoSize(audio.thumb, bot) : undefined;
    }


    /**
     * @returns {Promise<{data:Buffer, fileExtension:string}>}
     */
    async download() {
        return this.#bot.downloadFile(this.fileId);
    }


    /**
     * Use this method get get file download link(⛔do not share the damn link, it contains your bot token⛔)
     * @returns {Promise<{link:string, fileExtension:string}>}
     */
    async getDownloadLink() {
        return this.#bot.getFileDownloadLink(this.fileId);
    }

}



class PhotoSize {

    #bot;

    constructor(thumb, bot) {
        this.#bot = bot;
        this.fileId = thumb.file_id;
        this.fileUniqueId = thumb.file_unique_id;
        this.width = thumb.width;
        this.height = thumb.height;
        this.fileSize = thumb.file_size;
    }

    /**
     * @returns {Promise<{data:Buffer, fileExtension:string}>}
     */
    async download() {
        return this.#bot.downloadFile(this.fileId);
    }


    /**
     * Use this method get get file download link(⛔do not share the damn link, it contains your bot token⛔)
     * @returns {Promise<{link:string, fileExtension:string}>}
     */
    async getDownloadLink() {
        return this.#bot.getFileDownloadLink(this.fileId);
    }

}



class DocumentType {

    #bot;

    constructor(document, bot) {
        this.#bot = bot;
        this.fileId = document.file_id;
        this.fileUniqueId = document.file_unique_id;
        this.thumb = document.thumb ? new PhotoSize(document.thumb) : undefined;
        this.fileName = document.file_name;
        this.mimeType = document.mime_type;
        this.fileSize = document.file_size;
    }

    /**
     * @returns {Promise<{data:Buffer, fileExtension:string}>}
     */
    async download() {
        return this.#bot.downloadFile(this.fileId);
    }


    /**
     * Use this method get get file download link(⛔do not share the damn link, it contains your bot token⛔)
     * @returns {Promise<{link:string, fileExtension:string}>}
     */
    async getDownloadLink() {
        return this.#bot.getFileDownloadLink(this.fileId);
    }

}



class AnimationType {

    #bot;

    constructor(animation, bot) {
        this.#bot = bot;
        this.fileId = animation.file_id;
        this.fileUniqueId = animation.file_unique_id;
        this.width = animation.width;
        this.height = animation.height;
        this.duration = animation.duration;
        this.thumb = animation.thumb ? new PhotoSize(animation.thumb) : undefined;
        this.fileName = animation.file_name;
        this.mimeType = animation.mime_type;
        this.fileSize = animation.file_size;
    }

    /**
     * @returns {Promise<{data:Buffer, fileExtension:string}>}
     */
    async download() {
        return this.#bot.downloadFile(this.fileId);
    }


    /**
     * Use this method get get file download link(⛔do not share the damn link, it contains your bot token⛔)
     * @returns {Promise<{link:string, fileExtension:string}>}
     */
    async getDownloadLink() {
        return this.#bot.getFileDownloadLink(this.fileId);
    }

}



class GameType {

    constructor(game, bot) {
        this.title = game.title;
        this.description = game.description;
        this.photo = game.photo ? game.photo.map(g => new PhotoSize(g)) : undefined;
        this.text = game.text;
        this.textEntities = game.text_entities ? game.text_entities.map(te => new MessageEntity(te, bot)) : undefined;
        this.animation = game.animation ? new AnimationType(game.animation) : undefined;
    }

}



class StickerType {

    #bot;

    constructor(sticker, bot) {
        this.#bot = bot;
        this.fileId = sticker.file_id;
        this.fileUniqueId = sticker.file_unique_id;
        this.width = sticker.width;
        this.height = sticker.height;
        this.isAnimated = sticker.is_animated;
        this.thumb = sticker.thumb ? new PhotoSize(sticker.thumb, bot) : undefined;
        this.emoji = sticker.emoji;
        this.set_name = sticker.set_name;
        this.maskPosition = sticker.mask_position ? new MaskPosition(sticker.mask_position) : undefined;
        this.fileSize = sticker.file_size;
    }


    /**
     * @returns {Promise<{data:Buffer, fileExtension:string}>}
     */
    async download() {
        return this.#bot.downloadFile(this.fileId);
    }


    /**
     * Use this method get get file download link(⛔do not share the damn link, it contains your bot token⛔)
     * @returns {Promise<{link:string, fileExtension:string}>}
     */
    async getDownloadLink() {
        return this.#bot.getFileDownloadLink(this.fileId);
    }


}




class StickerSet {

    constructor(set, bot) {
        /**
         * Sticker set name
         * @type {string}
         */
        this.name = set.namel
        /**
         * Sticker set title
         * @type {string}
         */
        this.title = set.title;
        /**
         * True, if the sticker set contains animated stickers
         * @type {boolean}
         */
        this.isAnimated = set.is_animated;
        /**
         * True, if the sticker set contains masks
         * @type {boolean}
         */
        this.contains_masks = set.contains_masks;
        /**
         * List of all set stickers
         * @type {StickerType[]}
         */
        this.stickers = set.stickers.map(s => new StickerType(s, bot));
    }

}




class VideoType {

    #bot;

    constructor(video, bot) {
        this.#bot = bot;
        this.fileId = video.file_id;
        this.fileUniqueId = video.file_unique_id;
        this.width = video.width;
        this.height = video.height;
        this.duration = video.duration;
        this.thumb = video.thumb ? new PhotoSize(video.thumb) : undefined;
        this.mimeType = video.mime_type;
        this.fileSize = video.file_size;
    }

    /**
     * @returns {Promise<{data:Buffer, fileExtension:string}>}
     */
    async download() {
        return this.#bot.downloadFile(this.fileId);
    }


    /**
     * Use this method get get file download link(⛔do not share the damn link, it contains your bot token⛔)
     * @returns {Promise<{link:string, fileExtension:string}>}
     */
    async getDownloadLink() {
        return this.#bot.getFileDownloadLink(this.fileId);
    }

}




class VoiceType {

    #bot;

    constructor(voice, bot) {
        this.#bot = bot;
        this.fileId = voice.file_id;
        this.fileUniqueId = voice.file_unique_id;
        this.duration = voice.duration;
        this.mimeType = voice.mime_type;
        this.fileSize = voice.file_size;
    }

    /**
     * @returns {Promise<{data:Buffer, fileExtension:string}>}
     */
    async download() {
        return this.#bot.downloadFile(this.fileId);
    }


    /**
     * Use this method get get file download link(⛔do not share the damn link, it contains your bot token⛔)
     * @returns {Promise<{link:string, fileExtension:string}>}
     */
    async getDownloadLink() {
        return this.#bot.getFileDownloadLink(this.fileId);
    }

}




class VideoNote {

    #bot;

    constructor(note, bot) {
        this.#bot = bot;
        this.fileId = note.file_id;
        this.fileUniqueId = note.file_unique_id;
        this.length = note.length;
        this.duration = note.duration;
        this.thumb = note.thumb ? new PhotoSize(note.thumb) : undefined;
        this.fileSize = note.file_size;
    }


    /**
    * @returns {Promise<{data:Buffer, fileExtension:string}>}
    */
    async download() {
        return this.#bot.downloadFile(this.fileId);
    }


    /**
     * Use this method get get file download link(⛔do not share the damn link, it contains your bot token⛔)
     * @returns {Promise<{link:string, fileExtension:string}>}
     */
    async getDownloadLink() {
        return this.#bot.getFileDownloadLink(this.fileId);
    }

}




class MaskPosition {

    constructor(mp) {
        this.point = mp.point;
        this.x_shift = mp.x_shift;
        this.y_shift = mp.y_shift;
        this.scale = mp.scale;
    }

}




class ContactType {

    constructor(contact) {
        this.phoneNumber = contact.phone_number;
        this.firstName = contact.first_name;
        this.lastName = contact.last_name;
        this.userId = contact.user_id;
        this.vcard = contact.vcard;
    }

}




class LocationType {

    constructor(location) {
        this.longitude = location.longitude;
        this.latitude = location.latitude;
    }

}




class VenueType {

    constructor(venue) {
        this.location = new LocationType(venue.location);
        this.title = venue.title;
        this.address = venue.address;
        this.foursquareId = venue.foursquare_id;
        this.foursquareType = venue.foursquare_type;
    }

}




class PollType {

    constructor(poll) {
        /**
         * Unique poll identifier
         * @type {string}
         */
        this.id = poll.id;
        /**
         * Poll question, 1-255 characters
         * @type {string}
         */
        this.question = poll.question;
        /**
         * List of poll options
         * @type {PollOption[]}
         */
        this.options = poll.options.map(p => new PollOption(p));
        /**
         * Total number of users that voted in the poll
         * @type {number}
         */
        this.totalVoterCount = poll.total_voter_count;
        /**
         * True, if the poll is closed
         * @type {boolean}
         */
        this.isClosed = poll.is_closed;
        /**
         * True, if the poll is anonymous
         * @type {boolean}
         */
        this.isAnonymous = poll.is_anonymous;
        /**
         * Poll type, currently can be “regular” or “quiz”
         * @type {'regular'|'quiz'}
         */
        this.type = poll.type;
        /**
         * True, if the poll allows multiple answers
         * @type {boolean}
         */
        this.allowsMultipleAnswers = poll.allows_multiple_answers;
        /**
         * Optional. 0-based identifier of the correct answer option. Available only for polls in the quiz mode, which are closed, or was sent (not forwarded) by the bot or to the private chat with the bot.
         * @type {number}
         */
        this.correctOptionId = poll.correct_option_id;
        /**
         * Optional. Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters
         * @type {string}
         */
        this.explanation = poll.explanation;
        /**
         * Optional. Special entities like usernames, URLs, bot commands, etc. that appear in the explanation
         * @type {MessageEntity[]}
         */
        this.explanationEntities = poll.explanation_entities ? poll.explanation_entities.map(entity => new MessageEntity(entity)) : undefined;
        /**
         * Optional. Amount of time in seconds the poll will be active after creation
         * @type {number}
         */
        this.openPeriod = poll.open_period;
        /**
         * Optional. Point in time when the poll will be automatically closed
         * @type {number}
         */
        this.closeDate = poll.close_date ? new Date(poll.close_date * 1000) : undefined;
    }

}




class PollOption {

    constructor(option) {
        this.text = option.text;
        this.voterCount = option.voter_count;
    }

}



class Dice {

    constructor(d) {
        /**
         * Emoji on which the dice throw animation is based
         * @type {string}
         */
        this.emoji = d.emoji;
        /**
         * Value of the dice, 1-6 for currently supported base emoji
         * @type {number}
         */
        this.value = d.value;
    }

}



class InvoiceType {

    constructor(invoice) {
        this.title = invoice.title;
        this.description = invoice.description;
        this.startParameter = invoice.start_parameter;
        this.currency = invoice.currency;
        this.totalAmount = invoice.total_amount;
    }

}




class SuccessfulPayment {

    constructor(payment) {
        this.currency = payment.currency;
        this.totalAmount = payment.total_amount;
        this.invoicePayload = payment.invoice_payload;
        this.shippingOptionId = payment.shipping_option_id;
        this.orderInfo = payment.order_info ? new OrderInfo(payment.order_info) : undefined;
        this.telegramPaymentChargeId = payment.telegram_payment_charge_id;
        this.providerPaymentChargeId = payment.provider_payment_charge_id;
    }

}




class OrderInfo {

    constructor(info) {
        this.name = info.name;
        this.phoneNumber = info.phone_number;
        this.email = info.email;
        this.shippingAddress = info.shipping_address ? new ShippingAddress(info.shipping_address) : undefined;
    }

}




class ShippingAddress {

    constructor(address) {
        this.countryCode = address.country_code;
        this.state = address.state;
        this.city = address.city;
        this.streetLine1 = address.street_line1;
        this.streetLine2 = address.street_line2;
        this.postCode = address.post_code;
    }

}




class InlineKeyboardMarkup {

    constructor(keyboard) {
        /**
         * @type {Array<InlineKeyboardButton[]>}
         */
        this.inline_keyboard = keyboard.inline_keyboard ? keyboard.inline_keyboard.map(row => row.map(button => new InlineKeyboardButton(button))) : undefined;
    }

}




class InlineKeyboardButton {

    constructor(button) {
        /**
         * Label text on the button
         * @type {string}
         */
        this.text = button.text;
        /**
         * Optional. HTTP or tg:// url to be opened when button is pressed
         * @type {string}
         */
        this.url = button.url;
        /**
         * Optional. An HTTP URL used to automatically authorize the user. Can be used as a replacement for the Telegram Login Widget.
         * @type {LoginUrl}
         */
        this.login_url = button.login_url ? new LoginUrl(button.login_url) : undefined;
        /**
         * Optional. Data to be sent in a callback query to the bot when button is pressed, 1-64 bytes
         * @type {string}
         */
        this.callback_data = button.callback_data;
        /**
         * Optional. If set, pressing the button will prompt the user to select one of their chats, open that chat and insert the bot‘s username and the specified inline query in the input field. Can be empty, in which case just the bot’s username will be inserted.
         * @type {string}
         */
        this.switch_inline_query = button.switch_inline_query;
        /**
         * Optional. If set, pressing the button will insert the bot‘s username and the specified inline query in the current chat's input field. Can be empty, in which case only the bot’s username will be inserted. This offers a quick way for the user to open your bot in inline mode in the same chat – good for selecting something from multiple options.
         * @type {string}
         */
        this.switch_inline_query_current_chat = button.switch_inline_query_current_chat;
        /**
         * Optional. Description of the game that will be launched when the user presses the button. NOTE: This type of button must always be the first button in the first row.
         */
        this.callback_game = button.callback_game;
        /**
         * Optional. Specify True, to send a Pay button. NOTE: This type of button must always be the first button in the first row.
         * @type {boolean}
         */
        this.pay = button.pay;
    }

}




class ReplyKeyboardRemove {

    constructor(markup) {
        /**
         * Requests clients to remove the custom keyboard (user will not be able to summon this keyboard; if you want to hide the keyboard from sight but keep it accessible, use one_time_keyboard in ReplyKeyboardMarkup)
         * @type {boolean}
         */
        this.remove_keyboard = markup.remove_keyboard ? new ReplyKeyboardMarkup(markup.remove_keyboard) : undefined;
    }

}




class ReplyKeyboardMarkup {

    constructor(markup) {
        /**
         * @type {Array<KeyboardButton[]>}
         */
        this.keyboard = markup.keyboard ? markup.keyboard.map(row => row.map(button => new KeyboardButton(button))) : undefined;
        /**
         * Optional. Requests clients to resize the keyboard vertically for optimal fit (e.g., make the keyboard smaller if there are just two rows of buttons). Defaults to false, in which case the custom keyboard is always of the same height as the app's standard keyboard.
         * @type {boolean}
         */
        this.resize_keyboard = markup.resize_keyboard;
        /**
         * Optional. Requests clients to hide the keyboard as soon as it's been used. The keyboard will still be available, but clients will automatically display the usual letter-keyboard in the chat – the user can press a special button in the input field to see the custom keyboard again. Defaults to false.
         * @type {boolean}
         */
        this.one_time_keyboard = markup.one_time_keyboard;
        /**
         * Optional. Use this parameter if you want to show the keyboard to specific users only. Targets: 1) users that are @mentioned in the text of the Message object; 2) if the bot's message is a reply (has reply_to_message_id), sender of the original message.
         * @type {boolean}
         */
        this.selective = markup.selective;
    }

}




class KeyboardButton {

    constructor(button) {
        /**
         * Text of the button. If none of the optional fields are used, it will be sent as a message when the button is pressed
         * @type {string}
         */
        this.text = button.text;
        /**
         * Optional. If True, the user's phone number will be sent as a contact when the button is pressed. Available in private chats only
         * @type {boolean}
         */
        this.request_contact = button.request_contact;
        /**
         * Optional. If True, the user's current location will be sent when the button is pressed. Available in private chats only
         * @type {boolean}
         */
        this.request_location = button.request_location;
        /**
         * Optional. If specified, the user will be asked to create a poll and send it to the bot when the button is pressed. Available in private chats only
         * @type {KeyboardButtonPollType}
         */
        this.request_poll = button.request_poll ? new KeyboardButtonPollType(button.request_poll) : undefined;
    }

}




class KeyboardButtonPollType {

    constructor(request_poll) {
        /**
         * @type {'quiz'|'regular'}
         */
        this.type = request_poll.type;
    }

}




class LoginUrl {

    constructor(url) {
        this.url = url.url;
        this.forwardText = url.forward_text;
        this.botUsername = url.bot_username;
        this.requestWriteAccess = url.request_write_access;
    }

}




class InlineQuery {

    #bot;

    constructor(query, bot) {
        this.#bot = bot;
        this.id = query.id;
        this.from = new User(query.from, bot);
        this.location = query.location ? new LocationType(query.location) : undefined;
        this.query = query.query;
        this.offset = query.offset;
    }


    //my custom methods


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
     * @param {Array} results A JSON-serialized array of results for the inline query
     * @param {InlineQueryOptions} [options] 
     * @returns {Promise<Array>}
     * @example
     * ctx.inlineQuery.answer([
            {
                type: 'gif',
                id: 'xhfsj1',
                gif_url: 'https://media.giphy.com/media/PfGZfvrugfsTS/giphy.gif',
                thumb_url: 'https://media.giphy.com/media/PfGZfvrugfsTS/giphy.gif'
            },
            {
                type: 'gif',
                id: 'xhfsj2',
                gif_url: 'https://media.giphy.com/media/IUnQIGt0bSoyA/giphy.gif',
                thumb_url: 'https://media.giphy.com/media/IUnQIGt0bSoyA/giphy.gif'
            }
        ]);
     */
    async answer(results, options = {}) {
        return this.#bot.answerInlineQuery(this.id, results, options);
    }

}




class ChosenInlineResult {

    constructor(chosen) {
        /**
         * The unique identifier for the result that was chosen
         * @type {string}
         */
        this.resultId = chosen.result_id;
        /**
         * The user that chose the result
         * @type {User}
         */
        this.from = new User(chosen.from);
        /**
         * Optional. Sender location, only for bots that require user location
         * @type {LocationType}
         */
        this.location = chosen.location ? new LocationType(chosen.location) : undefined;
        /**
         * Optional. Identifier of the sent inline message. Available only if there is an inline keyboard attached to the message. Will be also received in callback queries and can be used to edit the message.
         * @type {string}
         */
        this.inlineMessageId = chosen.inline_message_id;
        /**
         * The query that was used to obtain the result
         * @type {string}
         */
        this.query = chosen.query;
    }

}




class FileType {

    constructor(file) {
        this.fileId = file.file_id;
        this.fileUniqueId = file.file_unique_id;
        this.fileSize = file.file_size;
        this.filePath = file.file_path;
    }

}




class UserProfilePhotos {

    constructor(profilePhotos, bot) {
        /**
         * Total number of profile pictures the target user has
         * @type {number}
         */
        this.totalCount = profilePhotos.total_count;
        /**
         * Requested profile pictures (in up to 4 sizes each)
         * @type {Array<PhotoSize[]>}
         */
        this.photos = profilePhotos.photos.map(ps => ps.map(p => new PhotoSize(p, bot)));
    }

}




class TeleResponseError extends Error {

    constructor(message, errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

}




module.exports = {
    Message,
    User,
    InlineQuery,
    StickerSet,
    Context,
    TeleResponseError,
    ReplyKeyboardMarkup,
    InlineKeyboardMarkup,
    ReplyKeyboardRemove,
    Chat,
    ChatPermissions,
    ChatMember,
    UserProfilePhotos,
    FileType,
    MaskPosition
};