const request = require("request")
const Discord = require('discord.js')
const fs = require('fs')

const client = new Discord.Client()

let prefix = '!'

client.on('ready', () => 
{
  console.log(`Logged in as ${client.user.tag}!`);

  client.user.setActivity(' qui est sur le serveur', { type: 'WATCHING' })
})

client.on('message', (msg) => 
{
  if(!msg.content.startsWith(prefix)) return

  let args = msg.content.substring(1).split(' ')
  let cmd = args[0].toLowerCase()
  let name = ''
  let guildName = msg.guild.name
  let guildUrl = getImage(guildName)

  args.forEach(arg =>
  {
    name += ` ${arg}`
  })

  name = name.substring(cmd.length + 2)

  switch(cmd)
  {
    case 'add':
      add(msg, name, guildName, guildUrl)
      break
    case 'list':
      list(msg, guildName, guildUrl)
      break
    case 'remove':
      remove(msg, name, guildName, guildUrl)
      break
    case 'pl':
    case 'players':
    case 'player':
      players(msg, guildName, guildUrl)
      break  
    case 'addace':
    case 'aceadd':
      addace(msg, name, guildName, guildUrl)
      break
    case 'listace':
    case 'acelist':
      listace(msg, guildName, guildUrl)
      break
    case 'removeace':
    case 'aceremove':
      removeace(msg, name, guildName, guildUrl)
      break  
    default:
      return  
  }

    console.log(`${msg.guild.name}: ${msg.author.username} (${msg.member.displayName}) a utilisé la commande ${msg.content.substring(1)}`)
})

function getImage(guildName) {
  if(guildName.toLowerCase() == 'rockefeller') return 'https://cdn.discordapp.com/icons/531190657784479755/79048b6aabae4060813b3fb5105f19b0.png'
  if(guildName.toLowerCase() == 'ace') return 'https://cdn.discordapp.com/icons/540609572314939394/bbd4b1d5437b3feda2fe13ac4884f118.png'

  return 'https://cdn.discordapp.com/avatars/538806157196656640/8558918be6f9b89317098e26028b2926.png'
}

function players(msg, guildName, guildUrl)
{
  request('https://arma3-servers.net/server/15936/', function (error, response, html) 
  {
      if (!error && response.statusCode == 200)
      {
        let players = []
        let aceplayers = []
        let members = getMembers()
        let acemembers = getAceMembers()
        let content = html.substring(html.indexOf('Online Players</h3>') + 82, html.lastIndexOf('<div style="height: 20px;"></div>') - 22)
          
        onlinePlayers = content.split(', ')

        if(onlinePlayers.length < 2)
        {
          msg.channel.send(
            {
              embed: {
                color: 0xff3333,
                author:
                {
                  name: guildName,
                  icon_url: guildUrl
                },
                description: 'Le serveur est en train de redémarrer'
              }
            })
          return
        }

        if(members == null)
        {
            msg.channel.send(
                {
                  embed: {
                    color: 0xff3333,
                    author:
                    {
                      name: guildName,
                      icon_url: guildUrl
                    },
                    description: 'Il n\'y a pas de joueur ajouté'
                  }
                })
            return    
        }

        if(acemembers == null)
        {
            msg.channel.send(
                {
                  embed: {
                    color: 0xff3333,
                    author:
                    {
                      name: guildName,
                      icon_url: guildUrl
                    },
                    description: 'ACE: Il n\'y a pas de joueur ajouté'
                  }
                })
            return    
        }

        members.forEach(member =>
        {
          if(onlinePlayers.lastIndexOf(member) > -1)
          {
            players.push(member)
          }
        })

        acemembers.forEach(acemember =>
          {
            if(onlinePlayers.lastIndexOf(acemember) > -1)
            {
              aceplayers.push(acemember)
            }
          })

    

        let embedMembers = ''
        let embedAceMembers = ''

        if(players.length == 0)
        {
          embedMembers = 'Il n\'y a pas de membre en ligne'
        }
        else 
        {
          players.forEach(player =>
            {
              embedMembers += `\n:small_orange_diamond: ${player}`
            })
        }
        
        if(aceplayers.length == 0)
        {
          embedAceMembers = 'Il n\'y a pas de membre en ligne'
        }
        else 
        {
          aceplayers.forEach(aceplayer =>
            {
              embedAceMembers += `\n:small_orange_diamond: ${aceplayer}`
            })
        }

        embedMembers = embedMembers.substring(1)

        msg.channel.send(
            {
            embed: 
                  {
                  description: `󠀀󠀀\nJoueurs en ligne : **${onlinePlayers.length}**`,
                  color: 5301186,
                  author: {
                      name: guildName,
                      icon_url: guildUrl
                  },
                  fields: [
                      {
                          name: `Membres de Rockefeller: **${players.length}**`,
                          value: embedMembers
                      },
                      {
                        name: `Membres de l\'unité Ace : **${aceplayers.length}**`,
                        value: embedAceMembers
                    }     
                  ]  
              }
          })
      }
  })
}

function add(msg, name, guildName, guildUrl)
{
  let members = ''
  let currentMembers = getMembers()

  if(guildName != 'Rockefeller')
  {
    msg.channel.send(
      {
        embed: {
          color: 0xff3333,
          author:
          {
            name: guildName,
            icon_url: guildUrl
          },
            description: `${guildName} n\'a pas la permission de changer les membres de rockefeller`
          }
        })

      return
  }

  if(currentMembers != null)
  {
    if(currentMembers.lastIndexOf(name) > -1)
    {
      msg.channel.send(
        {
          embed: {
            color: 0xff3333,
            author:
            {
              name: guildName,
              icon_url: guildUrl
            },
            description: `Le joueur avec le nom ${name} a déja été ajouté`
          }
        })

      return
    }

    currentMembers.forEach((member) =>
    {
      members += `${member}\n`
    })
  }

  members += name

  fs.writeFileSync('members', members)

  msg.channel.send(
    {
      embed: {
        color: 0x47E77A,
        author:
        {
          name: guildName,
          icon_url: guildUrl
        },
        description: `Le joueur ${name} a été ajouté`
      }
    })
}

function remove(msg, name, guildName, guildUrl)
{
  let members = ''
  let currentMembers = getMembers()

  if(guildName != 'Rockefeller')
  {
    msg.channel.send(
      {
        embed: {
          color: 0xff3333,
          author:
          {
            name: guildName,
            icon_url: guildUrl
          },
            description: `${guildName} n\'a pas la permission de changer les membres de rockefeller`
          }
        })

      return
  }

  if(currentMembers == null)
  {
     msg.channel.send(
      {
        embed: {
          color: 0xff3333,
          author:
          {
            name: guildName,
            icon_url: guildUrl
          },
          description: 'Il n\'y a pas de joueur ajouté'
        }
      })

    return
  }

  if(currentMembers.lastIndexOf(name) == -1)
  {
    msg.channel.send(
      {
        embed: {
          color: 0xff3333,
          author:
          {
            name: guildName,
            icon_url: guildUrl
          },
          description: `Il n\'y a pas de joueur avec le nom ${name}`
        }
      })

    return
  }

  currentMembers.forEach((member) =>
  {
    if(member != name)
    members += `\n${member}`
  })

  fs.writeFileSync('members',  members.substring(1))

  msg.channel.send(
    {
      embed: {
        color: 0x47E77A,
        author:
        {
          name: guildName,
          icon_url: guildUrl
        },
        description: `Le joueur ${name} a été retiré`
      }
    })
}

function list(msg, guildName, guildUrl)
{
  let currentMembers = getMembers()
  let msgPlayer = ''

  if(currentMembers == null)
  {
    msg.channel.send(
      {
        embed: {
          color: 0xff3333,
          author:
          {
            name: guildName,
            icon_url: guildUrl
          },
          description: 'Il n\'y a pas de joueur ajouté'
        }
      })

    return
  }

  currentMembers.forEach(member => 
  {
    msgPlayer += `\n:small_orange_diamond: ${member}`
  })
  msgPlayer = msgPlayer.substring(1)

  msg.channel.send(
    {
      embed: {
        color: 0x47E77A,
        author:
        {
          name: guildName,
          icon_url: guildUrl
        },
        fields:
        [{
            name: 'Les joueurs ajoutés sont:',
            value: msgPlayer
        }]  
      }
    })
}

function addace(msg, name, guildName, guildUrl)
{
  let members = ''
  let currentMembers = getAceMembers()

  if(guildName != 'Rockefeller' || guildName != 'ACE')
  {
    msg.channel.send(
      {
        embed: {
          color: 0xff3333,
          author:
          {
            name: guildName,
            icon_url: guildUrl
          },
            description: `${guildName} n\'a pas la permission de changer les membres de l\'unité ACE`
          }
        })

      return
  }

  if(currentMembers != null)
  {
    if(currentMembers.lastIndexOf(name) > -1)
    {
      msg.channel.send(
        {
          embed: {
            color: 0xff3333,
            author:
            {
              name: guildName,
              icon_url: guildUrl
            },
            description: `ACE: Le joueur avec le nom ${name} a déja été ajouté`
          }
        })

      return
    }

    currentMembers.forEach((member) =>
    {
      members += `${member}\n`
    })
  }

  members += name

  fs.writeFileSync('acemembers', members)

  msg.channel.send(
    {
      embed: {
        color: 0x47E77A,
        author:
        {
          name: guildName,
          icon_url: guildUrl
        },
        description: `ACE: Le joueur ${name} a été ajouté`
      }
    })
}

function removeace(msg, name, guildName, guildUrl)
{
  let members = ''
  let currentMembers = getAceMembers()

  if(guildName != 'Rockefeller' || guildName != 'ACE')
  {
    msg.channel.send(
      {
        embed: {
          color: 0xff3333,
          author:
          {
            name: guildName,
            icon_url: guildUrl
          },
            description: `${guildName} n\'a pas la permission de changer les membres de l\'unité ACE`
          }
        })

      return
  }
  
  if(currentMembers == null)
  {
     msg.channel.send(
      {
        embed: {
          color: 0xff3333,
          author:
          {
            name: guildName,
            icon_url: guildUrl
          },
          description: 'ACE: Il n\'y a pas de joueur ajouté'
        }
      })

    return
  }

  if(currentMembers.lastIndexOf(name) == -1)
  {
    msg.channel.send(
      {
        embed: {
          color: 0xff3333,
          author:
          {
            name: guildName,
            icon_url: guildUrl
          },
          description: `ACE: Il n\'y a pas de joueur avec le nom ${name}`
        }
      })

    return
  }

  currentMembers.forEach((member) =>
  {
    if(member != name)
    members += `\n${member}`
  })

  fs.writeFileSync('acemembers',  members.substring(1))

  msg.channel.send(
    {
      embed: {
        color: 0x47E77A,
        author:
        {
          name: guildName,
          icon_url: guildUrl
        },
        description: `ACE: Le joueur ${name} a été retiré`
      }
    })
}

function listace(msg, guildName, guildUrl)
{
  let currentMembers = getAceMembers()
  let msgPlayer = ''

  if(currentMembers == null)
  {
    msg.channel.send(
      {
        embed: {
          color: 0xff3333,
          author:
          {
            name: guildName,
            icon_url: guildUrl
          },
          description: 'ACE: Il n\'y a pas de joueur ajouté'
        }
      })

    return
  }

  currentMembers.forEach(member => 
  {
    msgPlayer += `\n:small_orange_diamond: ${member}`
  })
  msgPlayer = msgPlayer.substring(1)

  msg.channel.send(
    {
      embed: {
        color: 0x47E77A,
        author:
        {
          name: guildName,
          icon_url: guildUrl
        },
        fields:
        [{
            name: 'ACE: Les joueurs ajoutés sont:',
            value: msgPlayer
        }]  
      }
    })
}

function getMembers() 
{
  let content = fs.readFileSync('members', 'utf8')
  if(content.length == 0) return null

  return content.split('\n')
}

function getAceMembers() 
{
  let content = fs.readFileSync('acemembers', 'utf8')
  if(content.length == 0) return null

  return content.split('\n')
}

client.login('TOKEN')