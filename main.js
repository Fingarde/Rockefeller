const request = require("request");

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => 
{
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => 
{
  if (msg.content === '!players')
    {

        var onlinePlayers = null
        var rockefellerPlayers = null

        request('https://arma3-servers.net/server/15936/', function (error, response, html) 
        {
            if (!error && response.statusCode == 200)
            {
                var content = html + ""
                content = html.substring(content.indexOf('Online Players</h3>') + 82, content.lastIndexOf('<div style="height: 20px;"></div>') - 22)
                
                onlinePlayers = content.split(', ')

                var rockefellerPlayersString = ''

                msg.guild.members.forEach( (member) =>
                {
                    if(onlinePlayers.indexOf(member.nickname) > -1)
                    {
                        rockefellerPlayersString += `\n :small_orange_diamond: ${member.nickname}`
                    }
                })

                rockefellerPlayers = rockefellerPlayersString.substring(2).split('\n :small_orange_diamond: ')
                msg.channel.send(
                    {
                    embed: 
                        {
                        description: ` 󠀀󠀀\nOnline Players : ${onlinePlayers.length} | Familly Players : ${rockefellerPlayers.length}`,
                        color: 5301186,
                        author: {
                            name: 'Rockefeller',
                            url: 'https://docs.google.com/spreadsheets/d/1N4pZYRc6TkA00hqTKure28RnM6tpycFltjOy_Cl88n4/edit?usp=sharing',
                            icon_url: 'https://cdn.discordapp.com/icons/531190657784479755/79048b6aabae4060813b3fb5105f19b0.png'
                        },
                        fields: [
                            {
                                name: 'Players',
                                value: rockefellerPlayersString
                            }   
                        ]  
                    }
                });
            }
        });
    }
});

client.login(process.env.TOKEN);
