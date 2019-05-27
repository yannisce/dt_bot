const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
    const list = new Discord.RichEmbed()
        .setColor('#f44289')
        .attachFiles(['./assets/photos/logo.png', './assets/photos/logo2.png', './assets/photos/fg.png'])
        .setAuthor('Discretize.eu', 'attachment://logo2.png', 'https://discretize.eu/')
        .setThumbnail('attachment://logo.png')
        .setTitle('__List of Fractals__')
        .addField('Aquatic Ruins\nSwampland\nSirens Reef\nUncategorized\nUnderground Facility\nCliffside\nDeepstone\nUrban Battleground\nTwilight Oasis\nChaos\nMolten Boss\nVolcanic\nSnowblind\nMai Trin\nAetherblade\nThaumanova Reactor\nNightmare\nShattered Observatory', 'Use *Fractal (name of fractal) to gain more info about the fractal󠂪', true)
        .setTimestamp()
        .setFooter('󠂪 󠂪', 'attachment://fg.png', 'https://discretize.eu/');

    try {
        return message.channel.send(list);
    }
    catch(error) {
        console.log(error);
    }
}

module.exports.help = {
    name : 'list'
}