const Discord = require('discord.js');
const bot = new Discord.Client({disableEveryone: true});
const fs = require('fs');
const dot_env = require('dotenv');
const fetch = require('node-fetch');
const cron_job = require('cron').CronJob;
const bot_config = require('./bot_config.json');
const rotation = require('./rotation.json');
const rotation_full = require('./rotation_plus_recs.json');
const auth = require('./functions').authenticate;
const id_array = require('./id_array.json');

dot_env.config();

let fractalsIDs = [];
let nextfractalsIDs = [];

async function callAPI() {
    try {
        await fetch('https://api.guildwars2.com/v2/achievements/daily')
                .then(res => res.json())
                .then(json => {
                    json.fractals.forEach(function(i) {
                    fractalsIDs.push(i.id);
                });
        });
        await fetch('https://api.guildwars2.com/v2/achievements/daily/tomorrow')
                .then(res => res.json())
                .then(json => {
                    json.fractals.forEach(function(i) {
                    nextfractalsIDs.push(i.id);
                });
        });
    } catch (error) {
        console.log(error);
    }
}

function clearFractalLists() {
    fractalsIDs = [];
    nextfractalsIDs = [];
}

function getDaily(now) {
    let tier_4;
    if (now === true) {
        tier_4 = fractalsIDs.filter(id => id_array.includes(id));
    } else {
        tier_4 = nextfractalsIDs.filter(id => id_array.includes(id));
    }
    
    let day;

    rotation.forEach(e => {
       if (JSON.stringify(Object.values(e)[0]) === JSON.stringify(tier_4)) {
        day = Object.keys(e);
       }
    });

    return day;
}

function getChannels() {
    let channels = [];

    bot.guilds.forEach((guild) => {
        guild.channels.forEach((channel) => {
            if (channel.name === 'discretize') {
                channels.push({
                    'name': channel.name,
                    'type': channel.type,
                    'id': channel.id
                });
            }
        });
    });

    return channels;
}

bot.commands = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
    
if (err) console.log(err);

    let js_file = files.filter(f => f.split('.').pop() === 'js')
    if(js_file.length <= 0) {
        console.log('Couldn\'t find commands');
        return;
    }

    js_file.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`(${f} loaded)\n|--------------------|`);
        bot.commands.set(props.help.name, props);
    });

});

bot.on('ready', async () => {
    console.log(`${bot.user.username} is online`);

   bot.user.setStatus('dnd')
     bot.user.setPresence({
         game: {
         name: '*help to get started',
         type: 'STREAMING',
           url: 'https://www.twitch.tv/fractal_god'
         }
     });    
});

var cron_job_1 = new cron_job({
    cronTime: '59 23 * * *',
    onTick: async function () {
        await callAPI();
        let channels = getChannels();
        channels.forEach(channel => {
            let generalChannel = bot.channels.get(channel.id);

            let daily = getDaily(false);

            let getAutomatedFullRotation = rotation_full[0][daily];
            const automatedDailyEmbed = new Discord.RichEmbed()
                .setColor('#36393f')
                .attachFiles(['./assets/photos/logo.png', `./assets/fractal_rotation/${daily}.png`, './assets/photos/fgspin.gif', './assets/photos/logo2.png'])    
                .setAuthor('Discretize.eu', 'attachment://logo2.png', 'https://discretize.eu/')
                .setTitle('Today\'s rotation')
                .setThumbnail('attachment://logo.png')
                .addField(getAutomatedFullRotation[0], getAutomatedFullRotation[1], true)
                .setImage(`attachment://${daily}.png`)
                .setTimestamp()
                .setFooter('Minecraft', 'attachment://fgspin.gif');

            generalChannel.send(automatedDailyEmbed);
        });
        clearFractalLists();
    },
    start: true,
    runOnInit: false,
});

bot.on('guildCreate', guild => {
    try {
        let first_channel_id = guild.channels.array().filter(channel => {
            return channel.type === 'text' ? true : false
        })[0].id;
        let first_channel = bot.channels.get(first_channel_id);
    
        const join_message = new Discord.RichEmbed()
        .setColor('#36393f')
        .attachFiles(['./assets/photos/logo.png', './assets/photos/logo2.png', './assets/photos/fg.png'])    
        .setAuthor('Discretize.eu', 'attachment://logo2.png', 'https://discretize.eu/')
        .setThumbnail('attachment://logo.png')
        .setTitle('__Thanks for adding our bot!__')
        .addField('To receive the fractal daily rotation at reset and future update/announcements, you need to create a text channel named \'discretize\'', 'Do *help to get started', true)
        .setFooter('Add us if you want to give any feedback Quantum#0099 and Cjcrew#6692', 'attachment://fg.png');
    
        first_channel.send(join_message);
        
        const discretize_log = bot.channels.get(process.env.NOTIFICATION);
        let log = new Discord.RichEmbed()
        .setColor('#50ff00')
        .attachFiles(['./assets/photos/logo.png', './assets/photos/logo2.png'])    
        .setAuthor('Discretize.eu', 'attachment://logo2.png', 'https://discretize.eu/')
        .setThumbnail('attachment://logo.png')
        .addField(':inbox_tray: __Discretize Bot joined a new server!__', `Server : \`${guild.name} (${guild.id})\` \n Owner : \`${guild.ownerID}\` \n Region : \`${guild.region}\` \n Member Count : \`${guild.memberCount}\` \n Timestamp : \`${guild.joinedAt}\` `, true);
    
        discretize_log.send(log);
    } catch (error) {
        console.log(error);
    }

});

bot.on('guildDelete', guild => {
    
    try {
        const discretize_log = bot.channels.get(process.env.NOTIFICATION);
        const log = new Discord.RichEmbed()
        .setColor('#ff0000')
        .attachFiles(['./assets/photos/logo.png', './assets/photos/logo2.png'])    
        .setAuthor('Discretize.eu', 'attachment://logo2.png', 'https://discretize.eu/')
        .setThumbnail('attachment://logo.png')
        .addField(':outbox_tray: __Discretize Bot left a server__', `Server : \`${guild.name} (${guild.id})\` \n Owner : \`${guild.ownerID}\` \n Region : \`${guild.region}\` \n Member Count : \`${guild.memberCount}\` \n Timestamp : \`${guild.joinedAt}\` `, true);
    
        discretize_log.send(log);
    } catch (error) {
        console.log(error);
    }
    
});

bot.on('message', async message => {
try {
    let prefix = bot_config.prefix;
    let messageArray = message.content.split(' ');
    let input_prefix = messageArray[0][0];
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);
    args = args.map(arg => arg.toLowerCase());

    let command_file = bot.commands.get(cmd.slice(prefix.length));
    if  (command_file && input_prefix === prefix) command_file.run(bot, message, args);

    switch(cmd) {

        case `${prefix}today`:
            await callAPI();    

            const today = getDaily(true);
            clearFractalLists();

            let getFullRotation = rotation_full[0][today];
            const todayRichEmbed = new Discord.RichEmbed()
                .setColor('#36393f')
                .attachFiles(['./assets/photos/logo.png', `./assets/fractal_rotation/${today}.png`, './assets/photos/fgspin.gif'])    
                .setAuthor('Discretize.eu', message.author.avatarURL, 'https://discretize.eu/')
                .setTitle('Today\'s rotation')
                .setThumbnail('attachment://logo.png')
                .addField(getFullRotation[0], getFullRotation[1], true)
                .setImage(`attachment://${today}.png`)
                .setTimestamp()
                .setFooter('Minecraft', 'attachment://fgspin.gif');

            return message.channel.send(todayRichEmbed);
            
        break;

        case `${prefix}tomorrow`:
            await callAPI();  

            const tomorrow = getDaily(false);
            clearFractalLists();

            let getTomorrowFullRotation = rotation_full[0][tomorrow];
            const tomorrowRichEmbed = new Discord.RichEmbed()
                .setColor('#36393f')
                .attachFiles(['./assets/photos/logo.png', `./assets/fractal_rotation/${tomorrow}.png`, './assets/photos/fgspin.gif'])    
                .setAuthor('Discretize.eu', message.author.avatarURL, 'https://discretize.eu/')
                .setTitle('Tomorrow\'s rotation')
                .setThumbnail('attachment://logo.png')
                .addField(getTomorrowFullRotation[0], getTomorrowFullRotation[1], true)
                .setImage(`attachment://${tomorrow}.png`)
                .setTimestamp()
                .setFooter('Minecraft', 'attachment://fgspin.gif');

            return message.channel.send(tomorrowRichEmbed);

        break;

        case `${prefix}say`:
        if (auth(message.author.id)) {
            const channels = getChannels();
                channels.forEach(function(channel) {
                let general_channel = bot.channels.get(channel.id);
                general_channel.send(args.join(" "));
             });
        }
        break;

        default:
            return;
        }
    } catch (error) {
        console.log(error);
    }

});

bot.login(process.env.TOKEN);