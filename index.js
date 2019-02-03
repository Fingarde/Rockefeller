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

  args.forEach(arg =>
  {
    name += ` ${arg}`
  })

  name = name.substring(cmd.length + 2)

  switch(cmd)
  {
    case 'add':
      add(msg, name)
      break
    case 'list':
      list(msg)
      break
    case 'remove':
      remove(msg, name)
      break
    case 'pl':
    case 'players':
    case 'player':
      players(msg)
      break  
    case 'addace':
    case 'aceadd':
      addace(msg, name)
      break
    case 'listace':
    case 'acelist':
      listace(msg)
      break
    case 'removeace':
    case 'aceremove':
      removeace(msg, name)
      break  
    default:
      return  
  }

    console.log(`${msg.author.username} (${msg.member.displayName}) a utilisé la commande ${msg.content.substring(1)}`)
})

function players(msg)
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
                  name: 'Rockefeller',
                  url: 'https://docs.google.com/spreadsheets/d/1N4pZYRc6TkA00hqTKure28RnM6tpycFltjOy_Cl88n4/edit?usp=sharing',
                  icon_url: 'https://cdn.discordapp.com/icons/531190657784479755/79048b6aabae4060813b3fb5105f19b0.png'
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
                      name: 'Rockefeller',
                      url: 'https://docs.google.com/spreadsheets/d/1N4pZYRc6TkA00hqTKure28RnM6tpycFltjOy_Cl88n4/edit?usp=sharing',
                      icon_url: 'https://cdn.discordapp.com/icons/531190657784479755/79048b6aabae4060813b3fb5105f19b0.png'
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
                      name: 'Rockefeller',
                      url: 'https://docs.google.com/spreadsheets/d/1N4pZYRc6TkA00hqTKure28RnM6tpycFltjOy_Cl88n4/edit?usp=sharing',
                      icon_url: 'https://cdn.discordapp.com/icons/531190657784479755/79048b6aabae4060813b3fb5105f19b0.png'
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
                  description: `󠀀󠀀\nJoueurs en ligne : **${onlinePlayers.length}** | Membres en ligne **${players.length}**`,
                  color: 5301186,
                  author: {
                      name: 'Rockefeller',
                      url: 'https://docs.google.com/spreadsheets/d/1N4pZYRc6TkA00hqTKure28RnM6tpycFltjOy_Cl88n4/edit?usp=sharing',
                      icon_url: 'https://cdn.discordapp.com/icons/531190657784479755/79048b6aabae4060813b3fb5105f19b0.png'
                  },
                  fields: [
                      {
                          name: 'Membres',
                          value: embedMembers
                      },
                      {
                        name: 'Membres de l\'unité Ace',
                        value: embedAceMembers
                    }     
                  ]  
              }
          })
      }
  })
}

function add(msg, name)
{
  let members = ''
  let currentMembers = getMembers()

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
              name: 'Rockefeller',
              url: 'https://docs.google.com/spreadsheets/d/1N4pZYRc6TkA00hqTKure28RnM6tpycFltjOy_Cl88n4/edit?usp=sharing',
              icon_url: 'https://cdn.discordapp.com/icons/531190657784479755/79048b6aabae4060813b3fb5105f19b0.png'
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
          name: 'Rockefeller',
          url: 'https://docs.google.com/spreadsheets/d/1N4pZYRc6TkA00hqTKure28RnM6tpycFltjOy_Cl88n4/edit?usp=sharing',
          icon_url: 'https://cdn.discordapp.com/icons/531190657784479755/79048b6aabae4060813b3fb5105f19b0.png'
        },
        description: `Le joueur ${name} a été ajouté`
      }
    })
}

function remove(msg, name)
{
  let members = ''
  let currentMembers = getMembers()

  if(currentMembers == null)
  {
     msg.channel.send(
      {
        embed: {
          color: 0xff3333,
          author:
          {
            name: 'Rockefeller',
            url: 'https://docs.google.com/spreadsheets/d/1N4pZYRc6TkA00hqTKure28RnM6tpycFltjOy_Cl88n4/edit?usp=sharing',
            icon_url: 'https://cdn.discordapp.com/icons/531190657784479755/79048b6aabae4060813b3fb5105f19b0.png'
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
            name: 'Rockefeller',
            url: 'https://docs.google.com/spreadsheets/d/1N4pZYRc6TkA00hqTKure28RnM6tpycFltjOy_Cl88n4/edit?usp=sharing',
            icon_url: 'https://cdn.discordapp.com/icons/531190657784479755/79048b6aabae4060813b3fb5105f19b0.png'
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
          name: 'Rockefeller',
          url: 'https://docs.google.com/spreadsheets/d/1N4pZYRc6TkA00hqTKure28RnM6tpycFltjOy_Cl88n4/edit?usp=sharing',
          icon_url: 'https://cdn.discordapp.com/icons/531190657784479755/79048b6aabae4060813b3fb5105f19b0.png'
        },
        description: `Le joueur ${name} a été retiré`
      }
    })
}

function list(msg)
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
            name: 'Rockefeller',
            url: 'https://docs.google.com/spreadsheets/d/1N4pZYRc6TkA00hqTKure28RnM6tpycFltjOy_Cl88n4/edit?usp=sharing',
            icon_url: 'https://cdn.discordapp.com/icons/531190657784479755/79048b6aabae4060813b3fb5105f19b0.png'
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
          name: 'Rockefeller',
          url: 'https://docs.google.com/spreadsheets/d/1N4pZYRc6TkA00hqTKure28RnM6tpycFltjOy_Cl88n4/edit?usp=sharing',
          icon_url: 'https://cdn.discordapp.com/icons/531190657784479755/79048b6aabae4060813b3fb5105f19b0.png'
        },
        fields:
        [{
            name: 'Les joueurs ajoutés sont:',
            value: msgPlayer
        }]  
      }
    })
}

function addace(msg, name)
{
  let members = ''
  let currentMembers = getAceMembers()

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
              name: 'Rockefeller',
              url: 'https://docs.google.com/spreadsheets/d/1N4pZYRc6TkA00hqTKure28RnM6tpycFltjOy_Cl88n4/edit?usp=sharing',
              icon_url: 'https://cdn.discordapp.com/icons/531190657784479755/79048b6aabae4060813b3fb5105f19b0.png'
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
          name: 'Rockefeller',
          url: 'https://docs.google.com/spreadsheets/d/1N4pZYRc6TkA00hqTKure28RnM6tpycFltjOy_Cl88n4/edit?usp=sharing',
          icon_url: 'https://cdn.discordapp.com/icons/531190657784479755/79048b6aabae4060813b3fb5105f19b0.png'
        },
        description: `ACE: Le joueur ${name} a été ajouté`
      }
    })
}

function removeace(msg, name)
{
  let members = ''
  let currentMembers = getAceMembers()

  if(currentMembers == null)
  {
     msg.channel.send(
      {
        embed: {
          color: 0xff3333,
          author:
          {
            name: 'Rockefeller',
            url: 'https://docs.google.com/spreadsheets/d/1N4pZYRc6TkA00hqTKure28RnM6tpycFltjOy_Cl88n4/edit?usp=sharing',
            icon_url: 'https://cdn.discordapp.com/icons/531190657784479755/79048b6aabae4060813b3fb5105f19b0.png'
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
            name: 'Rockefeller',
            url: 'https://docs.google.com/spreadsheets/d/1N4pZYRc6TkA00hqTKure28RnM6tpycFltjOy_Cl88n4/edit?usp=sharing',
            icon_url: 'https://cdn.discordapp.com/icons/531190657784479755/79048b6aabae4060813b3fb5105f19b0.png'
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
          name: 'Rockefeller',
          url: 'https://docs.google.com/spreadsheets/d/1N4pZYRc6TkA00hqTKure28RnM6tpycFltjOy_Cl88n4/edit?usp=sharing',
          icon_url: 'https://cdn.discordapp.com/icons/531190657784479755/79048b6aabae4060813b3fb5105f19b0.png'
        },
        description: `ACE: Le joueur ${name} a été retiré`
      }
    })
}

function listace(msg)
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
            name: 'Rockefeller',
            url: 'https://docs.google.com/spreadsheets/d/1N4pZYRc6TkA00hqTKure28RnM6tpycFltjOy_Cl88n4/edit?usp=sharing',
            icon_url: 'https://cdn.discordapp.com/icons/531190657784479755/79048b6aabae4060813b3fb5105f19b0.png'
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
          name: 'Rockefeller',
          url: 'https://docs.google.com/spreadsheets/d/1N4pZYRc6TkA00hqTKure28RnM6tpycFltjOy_Cl88n4/edit?usp=sharing',
          icon_url: 'https://cdn.discordapp.com/icons/531190657784479755/79048b6aabae4060813b3fb5105f19b0.png'
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