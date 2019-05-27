const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
  const guides = new Discord.RichEmbed()
    .setColor('#42f4ee')
    .attachFiles(['./assets/photos/logo.png', './assets/photos/logo2.png'])    
    .setAuthor('Discretize.eu', 'attachment://logo2.png', 'https://discretize.eu/')
    .setThumbnail('attachment://logo.png')
    .addField('__**Guides**__', '[Blast Stacking](https://discretize.eu/guides/blast-stacking)\n[Fractal Basics](https://discretize.eu/guides/fractal-basics)\n[Crit Cap](https://discretize.eu/guides/crit-cap)\n[Consumables](https://discretize.eu/guides/consumables)\n[Damage Mitigation](https://discretize.eu/guides/damage-mitigation)', true);
  
    try {
      return  message.channel.send(guides);
    }
    catch(error) {
      console.log(error);
    }
}

module.exports.help = {
    name : 'guides'
}