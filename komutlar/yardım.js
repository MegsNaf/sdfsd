const Discord = require("discord.js");
const disbut = require("discord-buttons");
const db = require('quick.db');
const ayar = require('../ayarlar.json')
exports.run = async (client, message, args) => { 
   const embed = new Discord.MessageEmbed()
   .setTitle("Başvuru yardım menüsü")
   .addField("Ekip Başvurusunda bulun",`\`${ayar.prefix}başvur\``)
  .addField("Başvuru sistemini aç/kapat",`\`${ayar.prefix}başvur-durum aç/kapat\``)
  .addField("Başvuramıyacak kişileri engelle",`\`${ayar.prefix}başvur-ban banla/kaldır @kişi\``)
   .setThumbnail(client.user.avatarURL({dynamic:true}))
   .setFooter(`${message.author.tag} tarafından istendi`,message.author.avatarURL({dynamic:true,size:1024}));
  message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['help']
}
exports.help = {
  name: 'yardım'
}