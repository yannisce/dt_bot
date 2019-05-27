const Discord = require('discord.js');


module.exports.run = async (bot, message, args) => {
  try {
    switch(args[0]) {
      case 'aquatic':
        return message.channel.send({files: ['./assets/fractals/aquatic_ruins.png']});
        break;
      case 'swampland':
        return message.channel.send({files: ['./assets/fractals/swampland.png']});
        break;
      case 'sirens':
        return message.channel.send({files: ['./assets/fractals/sirens_reef.png']});
        break;
      case 'uncategorized':
        return message.channel.send({files: ['./assets/fractals/uncategorized.png']});
        break;
      case 'underground':
        return message.channel.send({files: ['./assets/fractals/underground_facility.png']});
        break;
      case 'cliffside':
        return message.channel.send({files: ['./assets/fractals/cliffside.png']});
        break;
      case 'deepstone':
        return message.channel.send({files: ['./assets/fractals/deepstone.png']});
        break;
      case 'urban':
        return message.channel.send({files: ['./assets/fractals/urban_battleground.png']});
        break;
      case 'twilight':
        return message.channel.send({files: ['./assets/fractals/twilight_oasis.png']});
        break;
      case 'chaos':
        return message.channel.send({files: ['./assets/fractals/chaos.png']});
        break;
      case 'molten':
        return message.channel.send({files: ['./assets/fractals/molten_boss']});
        break;
      case 'volcanic':
        return message.channel.send({files: ['./assets/fractals/volcanic.png']});
        break;
      case 'snowblind':
        return message.channel.send({files: ['./assets/fractals/snowblind']});
        break;
      case 'mai':
        return message.channel.send({files: ['./assets/fractals/mai_trin.png']});
        break;
      case 'aetherblade':
        return message.channel.send({files: ['./assets/fractals/aetherblade.png']});
        break;
      case 'thaumanova':
        return message.channel.send({files: ['./assets/fractals/thaumanova.png']});
        break;
      case 'nightmare':
        return message.channel.send({files: ['./assets/fractals/nightmare.png']});
        break;
      case 'shattered':
        return message.channel.send({files: ['./assets/fractals/shattered_observatory.png']});
        break;
      default:
        return message.channel.send('Fractal not found.');
    }
  }
  catch(error) {
    console.log(error);
  }
}

module.exports.help = {
    name : 'fractal'
}