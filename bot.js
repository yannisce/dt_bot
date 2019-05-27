const Discord = require('discord.js');
const bot = new Discord.Client({disableEveryone: true});
const fs = require('fs');
const dot_env = require('dotenv');
const fetch = require('node-fetch');
const CronJob = require('cron').CronJob;
const bot_config = require('./bot_config.json');
const rotation = require('./rotation.json');
const auth = require('./functions').authenticate;
const id_array = 
[
    2966, 3458, 2932, 2989, 2952, 3177, 2948, 2939, 2967, 3038, 2930, 3973, 2932, 2947, 4224, 3177, 2952, 2923, 
    3038, 2939, 2941, 4224, 4494, 2903, 3973, 2947, 2966, 2892, 3458, 2989, 2952, 2967, 2956, 2947, 2923, 2941,
    3038, 2948, 3177, 4494, 2930, 2966, 2892, 4224, 2923
];

dot_env.config();

let fractalsIDs = [];
let nextfractalsIDs = [];

(async () => {
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
})();

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

var cronJob1 = new CronJob({
    cronTime: '16 0 * * *',
    onTick: function () {
        let channels = getChannels();
        channels.forEach(channel => {
            let generalChannel = bot.channels.get(channel.id);
            let daily = getDaily(true);
            generalChannel.send({files: [`./assets/fractal_rotation/${daily}.png`]});
        });
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
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);
    args = args.map(arg => arg.toLowerCase());
    
    let command_file = bot.commands.get(cmd.slice(prefix.length));
    if  (command_file) command_file.run(bot, message, args);

    switch(cmd) {

        case `${prefix}today`:
            
            const today = getDaily(true);
            return message.channel.send({files: [`./assets/fractal_rotation/${today}.png`]});
            
        break;

        case `${prefix}tomorrow`:

            const tomorrow = getDaily(false);
            return message.channel.send({files: [`./assets/fractal_rotation/${tomorrow}.png`]});

        break;

        case `${prefix}say`:
        if (auth(message.author.id)) {
            const channels = getChannels();
                channels.forEach(function(channel) {
                let general_channel = bot.channels.get(channel.id);
                general_channel.send(args[0]);
             });
        }
        break;

        case `${prefix}announce`:
        if (auth(message.author.id)) {

            const channels = getChannels();
            channels.forEach(function(channel) {
            let general_channel = bot.channels.get(channel.id)
            let update = new Discord.RichEmbed()
            .setColor('#36393f')
            .attachFiles(['./assets/photos/logo.png','./assets/photos/logo2.png'])    
            .setAuthor('Discretize.eu', 'attachment://logo2.png', 'https://discretize.eu/')
            .setThumbnail('attachment://logo.png')
            .setTitle('__Update Incoming__')
            .addField('- Changed nothing\n- Changed nothing again', 'Version 1.0' , true) 
            general_channel.send(update);

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