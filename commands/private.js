const Discord = require('discord.js');
const dot_env = require('dotenv');
dot_env.config();

module.exports.run = async (bot, message, args) => {

    function emoji(id) {
        return bot.emojis.get(id).toString();
    }

    try {
        if (message.author.id == process.env.QUNETUM) {
            message.delete().catch();
            message.channel.send(emoji('582632032895500328'));
        }
            
        else if (message.author.id == process.env.PEPEGAS) {
            message.channel.send(emoji('582631099964981249'));
        }
    } 
    catch(error) {
        console.log(error);
    }
}

module.exports.help = {
    name : 'me'
}