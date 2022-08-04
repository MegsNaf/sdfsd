const Discord = require("discord.js");
const disbut = require("discord-buttons");
const db = require('quick.db');
const ayar = require('../ayarlar.json')
exports.run = async (client, message, args) => { 
    message.delete()
	const basvurdata = await db.get(`basvurbilgi`);
	if(basvurdata) return message.reply(`Başvurular geçici olarak durdurulmuştur.`);
	
	const bandata = await db.get(`ban.${message.author.id}`)
	if(bandata) return message.reply("Başvuru sistemimizden banlısınız.");
		
  let category = message.guild.channels.cache.get(ayar.basvurkategori);
            
  message.guild.channels.create(`${message.author.username}-başvuru`, {
    parent: category,
    permissionOverwrites: [
        {id: ayar.everyoneid, deny: [('VIEW_CHANNEL'), ('SEND_MESSAGES')]},
		{id: ayar.adminrol, allow: [('VIEW_CHANNEL'), ('SEND_MESSAGES')]},
        {id: message.author.id, allow: [('VIEW_CHANNEL'), ('SEND_MESSAGES')]}]
    }).then( async baschannel => {

    
  const sorular = [
    '**İsminiz nedir?**',
    '**Yaşınız nedir?**',
    '**Çalışan bir mikrofonunuz var mı?**',
    '**Günlük aktiflik süreniz nedir?**',
    '**Rol Bilginiz nedir?** ?/10',
    '**Kaç yıldır MTA oynuyorsunuz?**'
  ]
  let sayac = 0
  
  const filter = m => m.author.id === message.author.id
  const collector = new Discord.MessageCollector(baschannel, filter, {
    max: sorular.length,
    time: 2000 * 60
  })
  baschannel.send(`Merhaba ${message.author}, Grove Gang e katılmak istiyorsanız birazdan gelecek soruları yanıtlamalısınız.\n:hourglass: Unutmayın!!! Tüm soruları cevaplamanız için tam 2 Dakikanız var hızlı olun. :)`);
  baschannel.send(sorular[sayac++])
  collector.on('collect', m => {
    if(sayac < sorular.length){
      m.channel.send(sorular[sayac++])
    }
  })

  collector.on('end', collected => {
    if(!collected.size) return baschannel.send('**Süreniz Bitti!**\nBu kanal 5 saniye sonra silinecektir').then(
      setTimeout(function() {
        baschannel.delete();
         }, 5000));
    baschannel.send('**Başvurunuz Başarıyla iletilmiştir! \n Başvurunu : <#1004729103481569400> kanalı üzerinden takip edebilirsin.**\nBu kanal 10 saniye sonra silinecektir').then(
      setTimeout(function() {
        baschannel.delete();
         }, 10000));
    let sayac = 0
    
    const onybuton = new disbut.MessageButton()
    .setLabel('Onayla')
    .setStyle('green')
    .setID('onay');
    const redbuton = new disbut.MessageButton()
    .setLabel('Reddet')
    .setStyle('red')
    .setID('red');
    let row = new disbut.MessageActionRow()
    .addComponents(onybuton, redbuton);

    const log = new Discord.MessageEmbed()
    .setAuthor(message.author.username + ` (${message.author.id})`, message.author.avatarURL({dynamic: true}))
	.setTitle('Yeni Başvuru Geldi!')
	.setDescription('Aşağıdaki butonlardan onay/red işlemlerini gercekleştirebilirsiniz')
    .setColor('BLUE')
    .addField('Başvuran Hakkında',[
      `**İsim: **\t\t${collected.map(m => m.content).slice(0,1)}`,
      `**Yaş: **\t\t${collected.map(m => m.content).slice(1,2)}`,
      `**Mikrofon: **\t\t${collected.map(m => m.content).slice(2,3)}`,
      `**Günlük aktiflik: **\t\t${collected.map(m => m.content).slice(3,4)}`,
	  `**Rol bilgisi: **\t\t${collected.map(m => m.content).slice(4,5)}`,
      `**Mta oynama süresi: **\t\t${collected.map(m => m.content).slice(5,6)}`
    ])
    .setTimestamp()
    .setFooter('Developed by MegsNaf', message.guild.iconURL());
    client.channels.cache.get(ayar.yetkililog).send({
		buttons: [onybuton, redbuton],
	    embed: log}).then(async m => {
      db.set(`basvur.${m.id}`, message.author.id);
    })

  })
  
})
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['başvuru', "basvuru"]
}
exports.help = {
  name: 'basvur'
}