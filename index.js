const req = require('request');
const process = require('process');
const entities = require('html-entities');
const Discord = require('discord.js');

const bot = new Discord.Client();

const help = new Discord.MessageEmbed()
  .setAuthor('Ahoj, já jsem Ludvík!')
  .setDescription('Funguji pouze v kanálu, který má ve svém názvu "ludvík".\n Pokud na serveru takový není, popros adminy, ať nějaký vytvoří!\nPokud tu takový kanál je, tak si se mnou můžeš chatovat tam!')
  .setFooter('Ludvíka vytvořil Michal Antonič, bota Foxy#8956')

const list = {
  "ě": "e",
  "š": "s",
  "č": "c",
  "ř": "r",
  "ž": "z",
  "ý": "y",
  "á": "a",
  "í": "i",
  "é": "e",
  "ň": "n",
  "ó": "o",
  "ŕ": "r",
  "ů": "u",
  "ú": "u"
}

//stolen form stackoverflow ---------------------------------
String.prototype.allReplace = function (obj) {
  var retStr = this;
  for (var x in obj) {
    retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
  }
  return retStr;
};
//-----------------------------------------------------------

// sParse je strangerParse | lParse je ludvíkParse

bot.on('ready', () => {

  setInterval(function () {
    bot.user.setActivity('L!pomoc | Na ' + bot.guilds.cache.size + ' serverech.')
  }, 100);

  console.log('ready');
});

bot.on('message', (msg) => {
  if (msg.author.bot) return;
  if (msg.content.startsWith('!')) return;

  switch (msg.content.toLowerCase()) {

    case 'l!status':
      msg.channel.send('OK');
      break;

    case 'l!pomoc':
      msg.channel.send(help.setTimestamp().setColor('RANDOM'));
      console.log('exec l!pomoc');
      break;

    default:
      if (msg.channel.name.toLowerCase().includes('ludvík')) {
        processIT(msg);
      } else if (msg.channel.name.toLowerCase().includes('ludvik')) {
        processIT(msg);
      } else {
        return;
      }
      break;
  };

});

function processIT(message) {

  x = message.content.toLowerCase();
  let msg = x.allReplace(list)

  req.get({
    url: `http://www.ludvik.sk/system.php?sentence=${encodeURI(msg)}&name=${message.author.username}`,

  }, function (err, httpResponse, body) {

    message.channel.send(lParse(body, message));

  }
  );
}

function lParse(body, message) {

  msg = entities.decode(body);
  x = msg.split('>');
  lParsed = x[8].split('<');
  sParsed = x[2].split('<');

  if (msg.includes('|shutdown|')) {
    setTimeout(function () {
      message.channel.send('\\**Konec konverzace.*\\*');
    }, 100);
  };

  //console.log('Klient (' + message.author.tag + '): ' + sParsed[0] + '\nServer (Ludvík): ' + lParsed[0])

  return lParsed[0];
};

bot.login(process.env.TOKEN);
