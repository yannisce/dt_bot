const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
  try {
    return message.channel.send('https://discord.gg/ekzzVKq');
  }
  catch(error) {
    console.log(error);
  }
}

module.exports.help = {
  name : 'discord'
}