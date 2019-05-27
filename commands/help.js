const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
  const help = new Discord.RichEmbed()
    .setColor('#36393f')
    .attachFiles(['./assets/photos/logo.png', './assets/photos/fg.png', './assets/photos/logo2.png'])    
    .setAuthor('Discretize.eu', 'attachment://logo2.png', 'https://discretize.eu/')
    .setThumbnail('attachment://logo.png')
    .setTitle('__Commands__')
    .addField('*Today', 'Gives you todays rotation', true)
    .addField('*Discord', 'Gives you the link to our discord', true)
    .addField('*Tomorrow', 'Gives you tomorrows rotation', true)
    .addField('*Guides', 'Gives you the links to the guides tab on our site', true)
    .addField('*Builds', 'Gives you the links to the builds tab on our site', true)
    .addField('*Apply', 'Gives you the link to the apply tab on our site', true)
    .addField('*List', 'Gives you a list of the fractal names', true)
    .addField('*Fractal (name of fractal)', 'Gives you information about the selected fractal', true)
    .setTimestamp()
    .setFooter('Made by Quantum#0099 and Cjcrew#6692', 'attachment://fg.png');
    
    try {
      return message.channel.send(help);
    }
    catch(error) {
      console.log(error);
    }
}

module.exports.help = {
    name : 'help'
}