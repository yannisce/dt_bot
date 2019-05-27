const Discord = require('discord.js');
const auth = require('../functions').authenticate;

module.exports.run = async (bot, message, args) => {
    try {
        if (auth(message.author.id)) {
            if (args[0] === 'total') {
                let total = new Discord.RichEmbed()
                .setColor('#36393f')
                .setTitle(`Discretize is in :  ${bot.guilds.size} guilds! 💫`);
                message.channel.send(total);
            } else {
                let i = 1;
                bot.guilds.forEach((guild) => {
                  message.channel.send(` (${i}) - ${guild.name} - `);
                  i++;
                });
            }
        }
    }
    catch(error) {
        console.log(error);
    }
}


module.exports.help = {
    name : 'guilds'
}