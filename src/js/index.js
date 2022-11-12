const remote = require('electron').remote;
const { Notification } = remote;
const { Tail } = require('tail');
const fs = require('fs');

const configPath = './config.json';
const currentWindow = remote.getCurrentWindow();
let config = {
    logPath: '',
    apiKey: ''
};

let inLobby = true, players = [], hypixel = null, numplayers = 0;
let missingPlayer = false;

window.onload = e => {
    if (!fs.existsSync(configPath))
        fs.writeFileSync(configPath, JSON.stringify(config));
    config = JSON.parse(fs.readFileSync(configPath));
    hypixel = new Hypixel(config.apiKey, updateHTML);

    nowType = 'bw';
    changeCategory();
    updateHTML();

    const tail = new Tail(config.logPath, {/*logger: con, */useWatchFile: true, nLines: 1, fsWatchOptions: { interval: 100 } });
    tail.on('line', data => {
        let s = data.indexOf('[CHAT]');
        if (s == -1) return;//not a chat log
        let changed = false;
        let msg = data.substring(s + 7).replace(' [C]', '');
        console.log(msg);
        if (msg.indexOf('ONLINE:') != -1 && msg.indexOf(',') != -1) {//the result of /who command
            resize(true);
            if (inLobby) return;
            let who = msg.substring(8).split(', ');
            players = [];
            for (let i = 0; i < who.length; i++) {
                //save for future expand
                players.push(who[i]);
                hypixel.download(who[i], updateHTML);
            }
            missingPlayer = players.length < numplayers;
            changed = true;
        } else if (msg.indexOf('has joined') != -1 && msg.indexOf(':') == -1) {
            resize(true);
            inLobby = false;
            let join = msg.split(' ')[0];
            if (players.find(x => x == join) == null) {
                players.push(join);
                hypixel.download(join, updateHTML);
                changed = true;
            }
            if (msg.indexOf('/') != -1) {
                numplayers = Number(msg.substring(msg.indexOf('(') + 1, msg.indexOf('/')));
                missingPlayer = players.length < numplayers;
            }
        } else if (msg.indexOf('has quit') != -1 && msg.indexOf(':') == -1) {
            inLobby = false;
            let left = msg.split(' ')[0];
            if (players.find(x => x == left) != null) {
                players.remove(left);
                changed = true;
            }
        } else if (msg.indexOf('Sending you') != -1 && msg.indexOf(':') == -1) {
            resize(false);
            inLobby = false;
            players = [];
            changed = true;
        } else if ((msg.indexOf('joined the lobby!') != -1 || msg.indexOf('rewards!') != -1) && msg.indexOf(':') == -1) {
            resize(false);
            inLobby = true;
            players = [];
            changed = true;
            // for future usage
            // } else if (msg.indexOf('joined the party') !== -1 && msg.indexOf(':') === -1 && inlobby) {
            // } else if (msg.indexOf('You left the party') !== -1 && msg.indexOf(':') === -1 && inlobby) {
            // } else if (msg.indexOf('left the party') !== -1 && msg.indexOf(':') === -1 && inlobby) {
            // } else if (inlobby && (msg.indexOf('Party Leader:') === 0 || msg.indexOf('Party Moderators:') === 0 || msg.indexOf('Party Members:') === 0)) {
        } else if ((msg.indexOf('FINAL KILL') != -1 || msg.indexOf('disconnected') != -1) && msg.indexOf(':') == -1) {
            let left = msg.split(' ')[0];
            if (players.find(x => x == left) != null) {
                players.remove(left);
                changed = true;
            }
        } else if ((msg.indexOf('reconnected') != -1) && msg.indexOf(':') == -1) {
            let join = msg.split(' ')[0];
            if (players.find(x => x == join) == null) {
                players.push(join);
                changed = true;
            }
            // don't know how to use
            // } else if (msg.indexOf('Can\'t find a') !== -1 && msg.indexOf('\'!') !== -1 && msg.indexOf(':') === -1) {
            // } else if (msg.indexOf('Can\'t find a') !== -1 && msg.indexOf('\'') !== -1 && msg.indexOf(':') === -1) {
        } else if (msg.indexOf('The game starts in 1 second!') != -1 && msg.indexOf(':') == -1) {
            resize(false);
            new Notification({
                title: 'Game Started!',
                body: 'Your Hypixel game has started!'
            }).show();
        } else if (msg.indexOf('The game starts in 0 second!') != -1 && msg.indexOf(':') == -1)
            resize(false);
        else if (msg.indexOf('new API key') != -1 && msg.indexOf(':') == -1) {
            hypixel.apiKey = msg.substring(msg.indexOf('is ') + 3);
            hypixel.owner = null;
            hypixel.verified = false;
            hypixel.verifyKey();
            config.apiKey = hypixel.apiKey;
            fs.writeFileSync(configPath, JSON.stringify(config));
        }
        if (changed) {
            console.log(players);
            updateHTML();
        }
    });
    tail.on('error', (err) => console.log(err));
}

let nowType = 'mm';
const updateHTML = () => {
    if (!hypixel.verified && !hypixel.verifying) {
        document.getElementById('Players').innerHTML += `${formatColor('§cInvalid API Key')}<br>`;
        return;
    }
    let title = hypixel.getTitle(nowType);
    document.getElementById('Levels').innerHTML = '';
    document.getElementById('Avatars').innerHTML = '';
    document.getElementById('Players').innerHTML = '';
    document.getElementById('Tags').innerHTML = '';
    for (let j = 0; j < title.length; j++)
        document.getElementById(title[j]).innerHTML = '';
    for (let i = 0; i < players.length; i++) {
        if (hypixel.data[players[i]] == null) {
            console.log('The data is null!');
            continue;
        }
        if (hypixel.data[players[i]].success == false) continue;// wait for download
        let data = hypixel.getData(players[i], nowType);
        if (hypixel.data[players[i]].nick == true) {
            document.getElementById('Levels').innerHTML += `<div>[ ? ]</div>`;
            document.getElementById('Avatars').innerHTML += `<div></div>`;
            document.getElementById('Players').innerHTML += `<div>${data[0]}</div>`;
            document.getElementById('Tags').innerHTML += `<div style="width:${width/2}px">${formatColor('§eNICK')}</div>`;
            for (let j = 0; j < title.length; j++)
                document.getElementById(title[j]).innerHTML += '<div></div>';
            continue;
        }
        document.getElementById('Levels').innerHTML += `<div>[${data[0]}]</div>`;
        document.getElementById('Avatars').innerHTML += `<img src="https://crafatar.com/avatars/${hypixel.getUuid(players[i])}?overlay" style="width:20px;height:20px"><br>`;
        document.getElementById('Players').innerHTML += `<div onclick="clickPlayerName('${players[i]}')">${data[1]}</div>`
        document.getElementById('Tags').innerHTML += `<div style="width:${width/2}px">${formatColor(hypixel.getTag(players[i]))}</div>`;
        for (let j = 0; j < title.length; j++)
            document.getElementById(title[j]).innerHTML += `<div>${data[j + 2]}</div>`
    }
    if (missingPlayer)
        document.getElementById('Players').innerHTML += `<div>${formatColor('§cMissing players')}</div><div>${formatColor('§cPlease type /who')}</div>`;
}

const width = 90;
const changeCategory = () => {
    let main = document.getElementById('main'), category = hypixel.getTitle(nowType);
    main.innerHTML = '<ul class="subtitle" style="width:450px">Players</ul>';
    main.innerHTML += '<ul id="Levels" class="data" style="left:0px;text-align:left"></ul>';
    main.innerHTML += '<ul id="Avatars" class="data" style="left:75px"></ul>';
    main.innerHTML += '<ul id="Players" class="data" style="left:100px;text-align:left"></ul>';
    main.innerHTML += '<ul class="subtitle" style="left:450px">Tag</ul>';
    main.innerHTML += '<ul id="Tags" class="data" style="left:450px"></ul>';
    for (let i = 0; i < category.length; i++) {
        main.innerHTML += `<ul class="subtitle" style="left:${500 + width * i}px;width:${width}px">${category[i]}</ul>`;
        main.innerHTML += `<ul id="${category[i]}" class="data" style="left:${500 + width * i}px;width:${width}px"></ul>`;
    }
}

const closeWindow = () => currentWindow.close();

const minimize = () => currentWindow.minimize();

let nowShow = true;
const showClick = () => {
    resize(null);
}
const resize = (show) => {
    if (show != null) nowShow = show;
    else nowShow ^= true;
    document.getElementById('show').style.transform = `rotate(${nowShow ? 0 : 90}deg)`;
    let height = nowShow ? 600 : 40;
    currentWindow.setResizable(true);
    currentWindow.setSize(1000, height, true);
    currentWindow.setResizable(false);
}
const clickPlayerName = (name) => {
    console.log(name);
}

const test = async (name) => {
    await hypixel.download(name);
    players.push(name);
    updateHTML();
}