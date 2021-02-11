const editJsonFile = require('edit-json-file')
const settings = editJsonFile('./utils/settings.json', {autosave: true})

const fs = require("fs")

const Discord = require("discord.js")

var totalTokens = 0, tokenWorkingArray = [];

var spammingDM = false, spammingChannel = false, aTest = new Set();

var avatar = document.getElementById("avatar"),
    nameUser = document.getElementById("name"),
    nameInput = document.getElementById("nameInput")
    startButton = document.getElementById("start"),
    userArea = document.getElementById("backgroundUser"),
    buttonsArea = document.getElementById("menuButtons"),
    consoleDiv = document.getElementById("console"),

    home = document.getElementById("home"),
    joinExit = document.getElementById("join-exitserver"),
    DMUser = document.getElementById("DMuser"),
    ChannelSpam = document.getElementById("ChannelSpam")

    homePag = document.getElementById("homePage"),
    joinExitPag = document.getElementById("join-exitPage"),
    DMUserPag = document.getElementById("DMUser-Page"),
    ChannelSpamPag = document.getElementById("ChannelSpam-Page")

    joinServerButton = document.getElementById("joinServer"),
    inviteCode = document.getElementById("inviteCode"),

    leaveServerButton = document.getElementById("exitServer"),
    serverToLeaveId = document.getElementById("Server ID EXIT"),

    addTokenButton = document.getElementById("addToken"),
    tokenToAdd = document.getElementById("tokenToAdd"),

    useridDM = document.getElementById("userID DM"),
    serveridDM = document.getElementById("Server ID DM"),
    cooldownSpamDM = document.getElementById("Cooldown Spam DM"),
    startStopDM = document.getElementById("Start Stop Spam DM"),
    messageInputdm = document.getElementById("messageInput DM"),

    serveridChannel = document.getElementById("Server ID SPAM CHANNEL"),
    channelSpamCooldown = document.getElementById("Cooldown Spam Channel"),
    channelId = document.getElementById("Channel ID"),
    messageInputChannel = document.getElementById("messageInput CHANNEL"),   
    startStopChannel = document.getElementById("Start Stop Spam Channel"),
    
    massReactButton = document.getElementById("MassReact"),
    massReactPage = document.getElementById("MassReact-Page"),

    emojiId = document.getElementById("EmojiID"),
    emojiSymbol = document.getElementById("Emoji Symbol"),
    serverIDEmoji = document.getElementById("Server ID Emoji"),
    channelIDEmoji = document.getElementById("Channel ID Emoji"),
    messageIDEmoji = document.getElementById("Message ID Emoji"),
    checkboxInput = document.getElementById("Use Symbol"),
    startMassReact = document.getElementById("startReact")

var tokenList = JSON.parse(fs.readFileSync('./utils/tokens.json'))
    tokenList = tokenList.tokens

checkboxInput.oninput = () => {
    if (checkboxInput.checked == true) {
        emojiSymbol.style.visibility = "visible";
        emojiId.style.visibility = "hidden";
    } else {
        emojiSymbol.style.visibility = "hidden";
        emojiId.style.visibility = "visible";
    }
}

startMassReact.onclick = () => {
    if (checkboxInput.checked == true) {
        if (emojiSymbol == "") return;
        if (serverIDEmoji == "") return;
        if (channelIDEmoji == "") return;
        if (messageIDEmoji == "") return;

        tokenWorkingArray.forEach(token => {

            const client = new Discord.Client()

            client.on('ready', () => {
            client.guilds.get(serverIDEmoji.value).channels.get(channelIDEmoji.value).fetchMessage(messageIDEmoji.value).then(message => {
                message.react(emojiSymbol.value)
                newMessage(client.user.username+' reacted with '+emojiSymbol.value+' in message '+messageIDEmoji.value, 'white', true)
             })
            })
            client.login(token)
        })

    } else if (checkboxInput.checked == false) {
        if (emojiId == "") return;
        if (serverIDEmoji == "") return;
        if (channelIDEmoji == "") return;
        if (messageIDEmoji == "") return;

        tokenWorkingArray.forEach(token => {

            const client = new Discord.Client()

            client.on('ready', () => {
            client.guilds.get(serverIDEmoji.value).channels.get(channelIDEmoji.value).fetchMessage(messageIDEmoji.value).then(message => {
                message.react(client.guilds.get(serverIDEmoji.value).emojis.get(emojiId.value))
                newMessage(client.user.username+' reacted with '+emojiId.value+' in message '+messageIDEmoji.value, 'white', true)
             })
            })
            client.login(token)
        })

    }
}

startStopChannel.onclick = () => {
    if (serveridChannel.value == "") return;
    if (channelId.value == "") return;
    if (channelSpamCooldown.value == "") return;
    if (messageInputChannel.value == "") return;
    if (spammingDM == true) return;
    if (channelSpamCooldown.value < 400) cooldownSpamDM.value = 400;
    if (spammingChannel == false) {

        spammingChannel = true;
        startStopChannel.textContent = "Stop"
        newMessage('Raiding Channel '+channelId.value+' of Server '+serveridChannel.value, 'white', true)
        tokenWorkingArray.forEach(token => {

            const client = new Discord.Client()

            client.on('ready', () => {
                aTest.add(client.user.id)
                var intervalChannel = setInterval(() => {
                if (!aTest.has(client.user.id)) clearInterval(intervalChannel)
                client.guilds.get(serveridChannel.value).channels.get(channelId.value).send(messageInputChannel.value)
                },parseInt(channelSpamCooldown.value))
            })
            client.login(token)
        })
    } else if (spammingChannel == true) {
        spammingChannel = false;
        startStopChannel.textContent = "Start"
        aTest.forEach(test => {
            aTest.delete(test) // lol it really worked noice
        })
    }
}

startStopDM.onclick = () => {
    if (useridDM.value == "") return;
    if (serveridDM.value == "") return;
    if (cooldownSpamDM.value == "") return;
    if (messageInputdm.value == "") return;
    if (spammingChannel == true) return;
    if (cooldownSpamDM.value < 400) cooldownSpamDM.value = 400;
    if (spammingDM == false) {

        spammingDM = true;
        startStopDM.textContent = "Stop"
        newMessage('Raiding Direct-Message of '+useridDM.value+' ...', 'white', true)
        tokenWorkingArray.forEach(token => {
            const client = new Discord.Client()
            client.on('ready', () => {
                aTest.add(client.user.id)
                var intervalDm = setInterval(() => {
                if (!aTest.has(client.user.id)) clearInterval(intervalDm)
                client.guilds.get(serveridDM.value).members.get(useridDM.value).send(messageInputdm.value)
                },parseInt(cooldownSpamDM.value))
            })
            
            client.login(token)
        })
    } else if (spammingDM == true) {
        spammingDM = false;
        startStopDM.textContent = "Start"
        aTest.forEach(test => {
            aTest.delete(test) // lol it really worked noice
        })
    }
}

leaveServerButton.onclick = () => {
    tokenWorkingArray.forEach(token => {

        const client = new Discord.Client()

        client.on('ready', () => {
        newMessage(client.user.usename+' leaved an server: '+client.guilds.get(serverToLeaveId.value).name, 'white', true)
        client.guilds.get(serverToLeaveId.value).leave()
        })
        client.login(token)
    })
}


addTokenButton.onclick = () => {
 if (tokenToAdd.value == "") return;
 tokenList = JSON.parse(fs.readFileSync('./utils/tokens.json'))

 var array = [];

 tokenList["tokens"].forEach(token => {
     array.push(token)
 })

 array.push(tokenToAdd.value)

 var tokenDb = editJsonFile('./utils/tokens.json', {autosave: true})
 tokenDb.set('tokens', array)
 updateTokens()

 tokenToAdd.value = ""
}

joinServerButton.onclick = () => {

 tokenWorkingArray.forEach(token => {

    const client = new Discord.Client()

     client.on('ready', () => {
     newMessage(client.user.username+' accepted an invite: '+inviteCode.value, 'white', true)
     client.user.acceptInvite(inviteCode.value).catch(e => {
         console.log(e)
         newMessage(client.user.username+' is banned from '+inviteCode.value, 'red', true)
     })
     })

      client.on('guildMemberRemove', (member) => {
        if (member.id == client.user.id) {
            newMessage(client.user.username+' was kicked/banned or leaved from '+member.guild.name, 'red', true)
        }
      })

     client.login(token)
 })
}

async function updateTokens() {
    setTimeout(() => {
    newMessage("Trying to load tokens...")

    totalTokens = 0;
    tokenWorkingArray = [];

    tokenList = JSON.parse(fs.readFileSync('./utils/tokens.json'))
    tokenList = tokenList.tokens

    if (!tokenList[0]) return newMessage('No tokens found.', 'orange', true)

    tokenList.forEach(token => {

        const client = new Discord.Client()

        client.on('ready', () => {
            totalTokens++;
            newMessage('[ VALID TOKEN ] '+client.user.username+' Loaded | '+totalTokens+' Tokens Connected.', 'lime', false)
            tokenWorkingArray.push(token)
        })
        client.login(token).catch(err => {
            newMessage('[ INVALID TOKEN ] '+token+' Failed to Connect | '+totalTokens+' Tokens Connected.', 'red', false)
        })
        var pos = tokenList.indexOf(token)
        if (pos == tokenList.length-1) {
        newMessage('Finished Reading Tokens | '+tokenList.length+' Tokens Were Readed.')
        }
    })

 },1950)
}

home.onclick = () => {
  homePag.style.visibility = "visible"
  homePag.style.opacity = "1"

  // other pages
  joinExitPag.style.visibility = "hidden"
  joinExitPag.style.opacity = "0"

  DMUserPag.style.visibility = "hidden"
  DMUserPag.style.opacity = "0"

  ChannelSpamPag.style.visibility = "hidden"
  ChannelSpamPag.style.opacity = "0"
  
  massReactPage.style.visibility = "hidden"
  massReactPage.style.opacity = "0"
  emojiId.style.visibility = "hidden";
  emojiSymbol.style.visibility = "hidden";
  checkboxInput.checked = false;
}

joinExit.onclick = () => {
    joinExitPag.style.visibility = "visible"
    joinExitPag.style.opacity = "1"
  
    // other pages
    homePag.style.visibility = "hidden"
    homePag.style.opacity = "0"
  
    DMUserPag.style.visibility = "hidden"
    DMUserPag.style.opacity = "0"
  
    ChannelSpamPag.style.visibility = "hidden"
    ChannelSpamPag.style.opacity = "0"

    massReactPage.style.visibility = "hidden"
    massReactPage.style.opacity = "0"
    emojiId.style.visibility = "hidden";
    emojiSymbol.style.visibility = "hidden";
    checkboxInput.checked = false;
}

DMUser.onclick = () => {
    DMUserPag.style.visibility = "visible"
    DMUserPag.style.opacity = "1"
  
    // other pages
    homePag.style.visibility = "hidden"
    homePag.style.opacity = "0"
  
    joinExitPag.style.visibility = "hidden"
    joinExitPag.style.opacity = "0"
  
    ChannelSpamPag.style.visibility = "hidden"
    ChannelSpamPag.style.opacity = "0"

    massReactPage.style.visibility = "hidden"
    massReactPage.style.opacity = "0"
    emojiId.style.visibility = "hidden";
    emojiSymbol.style.visibility = "hidden";
    checkboxInput.checked = false;
}

ChannelSpam.onclick = () => {
    ChannelSpamPag.style.visibility = "visible"
    ChannelSpamPag.style.opacity = "1"
  
    // other pages
    homePag.style.visibility = "hidden"
    homePag.style.opacity = "0"
  
    DMUserPag.style.visibility = "hidden"
    DMUserPag.style.opacity = "0"
  
    joinExitPag.style.visibility = "hidden"
    joinExitPag.style.opacity = "0"

    massReactPage.style.visibility = "hidden"
    massReactPage.style.opacity = "0"
    emojiId.style.visibility = "hidden";
    emojiSymbol.style.visibility = "hidden";
    checkboxInput.checked = false;
}

massReactButton.onclick = () => {
    massReactPage.style.visibility = "visible"
    massReactPage.style.opacity = "1"

    emojiId.style.visibility = "visible";
    emojiSymbol.style.visibility = "hidden";
    checkboxInput.checked = false;
  
    // other pages
    homePag.style.visibility = "hidden"
    homePag.style.opacity = "0"
  
    DMUserPag.style.visibility = "hidden"
    DMUserPag.style.opacity = "0"
  
    joinExitPag.style.visibility = "hidden"
    joinExitPag.style.opacity = "0"

    ChannelSpamPag.style.visibility = "hidden"
    ChannelSpamPag.style.opacity = "0"
}

function addZero(n) {return n < 10 ? '0' + n : n}

newMessage = function(string, color, time) {
    var date = new Date();

    if (!color) color = 'white';

    var hour = date.getHours(), minute = date.getMinutes()

    var text = document.createElement("p")
    if (time == true) {
    text.textContent = '[ '+addZero(hour)+':'+addZero(minute)+' ] '+string;
    } else {
    text.textContent = string;
    }
    text.style.fontFamily = "Arial";
    text.style.fontSize = "16px";
    text.style.color = color;
    text.style.paddingLeft = "8px"
    text.style.userSelect = "none";
    text.style.position = 'relative';
    consoleDiv.appendChild(text)

    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

nameUser.textContent = settings.get('settings.username')

if (settings.get('settings.username') == "") {
    nameUser.textContent = "Unknown"
}

if (settings.get('settings.avatarBase64') !== "") {
    avatar.src = settings.get('settings.avatarBase64')
} else {
    avatar.src = "https://stylizedbay.com/wp-content/uploads/2018/02/unknown-avatar.jpg"
}

avatar.onclick = () => { 
   let input = document.createElement("input");
   input.type = "file";
   input.accept = "image/*";
   input.addEventListener("change", function() {
    if (!input.files || !input.files[0]) return;
   })
    input.addEventListener("change", function () {
    if (!input.files || !input.files[0]) return;

    let reader = new FileReader();
    reader.addEventListener("load", function () {
        let image = new Image();
        image.src = reader.result;

        image.addEventListener("load", function () {
            settings.set('settings.avatarBase64', reader.result)
            avatar.src = reader.result;
            console.log("Avatar Changed.")
        });
    });
    reader.readAsDataURL(input.files[0]);
    }); 

    input.click();
}

document.getElementById("console").style.height = Math.abs(window.innerHeight / 3.98) // i'm bad at math sorry

nameUser.onmouseover = () => {
    nameUser.style.textShadow = '1px 1px 25px white'
}

nameUser.onmouseout = () => {
    nameUser.style.textShadow = '0px 0px 0px white'
}

avatar.onmouseover = () => {
 avatar.height = "150"
 avatar.width = "150"
}

avatar.onmouseout = () => {
 avatar.height = "128"
 avatar.width = "128"
}

nameUser.onclick = () => {
  nameInput.style.visibility = "visible"
  nameInput.style.opacity = "1"
  nameInput.style.width = "98.5%"
}

nameInput.onchange = () => {
  nameUser.textContent = nameInput.value
  settings.set('settings.username', nameInput.value)
  nameInput.style.opacity = "0"
  nameInput.style.width = "0%"
  nameInput.value = "";
  setTimeout(nameInput.style.visibility = "hidden", 500)
}

startButton.onclick = () => {
    avatar.height = "150"
    avatar.width = "150"

    userArea.style.opacity = "0";
    setTimeout(() => {
    userArea.style.visibility = "hidden";

    setTimeout(() => {
    newMessage("Discord Raider Started", "white", true)
    },500)

    setTimeout(() => {
    newMessage("Discord.JS loaded", "white", true)
    newMessage("Client loaded", "white", true)
    },1250)
    setTimeout(() => {
    buttonsArea.style.visibility = "visible";
    buttonsArea.style.opacity = "1";

    consoleDiv.style.visibility = "visible";
    consoleDiv.style.opacity = "1"

    homePag.style.visibility = "visible";
    homePag.style.opacity = "1"

    },500)
    },500)

    updateTokens()
}

startButton.onmouseover = () => {
 startButton.style.border = "3px solid white";
 startButton.style.fontSize = "30px";
}
   
startButton.onmouseout = () => {
 startButton.style.border = "3px solid black";
 startButton.style.fontSize = "24px";
}
