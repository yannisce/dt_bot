const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
  const builds = new Discord.RichEmbed()
    .setColor('#b3f442')
    .attachFiles(['./assets/photos/logo.png', './assets/photos/logo2.png'])  
    .setAuthor('Discretize.eu', 'attachment://logo2.png', 'https://discretize.eu/')
    .setThumbnail('attachment://logo.png')
    .addField('__**Meta Builds**__','[Power Sword Weaver](https://discretize.eu/builds/elementalist/power-sword-weaver)\n[Power Dragonhunter](https://discretize.eu/builds/guardian/power-dragonhunter)\n[Power Soulbeast](https://discretize.eu/builds/ranger/power-soulbeast)\n[Banner Warrior](https://discretize.eu/builds/warrior/banner-warrior)\n[Hybrid Chrono](https://discretize.eu/builds/mesmer/hybrid-chronomancer)\n[Hybrid Firebrand](https://discretize.eu/builds/guardian/hybrid-firebrand)\n[Hybrid Renegade](https://discretize.eu/builds/revenant/hybrid-renegade)', true)
    .addField('__**Great Builds**__', '[Power Daredevil](https://discretize.eu/builds/thief/power-daredevil)\n[Power Staff Weaver](https://discretize.eu/builds/elementalist/power-staff-weaver)\n[Power Chrono](https://discretize.eu/builds/mesmer/power-chronomancer)\n[Power Tempest](https://discretize.eu/builds/elementalist/power-tempest)\n[Power Holosmith](https://discretize.eu/builds/engineer/power-holosmith)', true)
    .addField('__**Good Builds**__', '[Power Deadeye](https://discretize.eu/builds/thief/power-deadeye)\n[Power Reaper](https://discretize.eu/builds/necromancer/power-reaper)\n[Heal Druid](https://discretize.eu/builds/ranger/heal-druid)', true);

    try {
      return message.channel.send(builds);
    } 
    catch(error) {
      console.log(error);
    }
}

module.exports.help = {
    name : 'builds'
}