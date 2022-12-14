const getData = {
    "ov": (api) => {
        achievements = api.achievements ?? {};
        return `Level : ${(api.networkExp ?? 0) < 0 ? 1 : (1 - 3.5 + Math.sqrt(12.25 + 0.0008 * (api.networkExp ?? 0))).toFixed(2)}<br>
      Karma : ${api.karma ?? 0}<br>
      Achievement Point :  ${api.achievementPoints ?? 0}<br>
      Complete Quest : ${achievements.general_quest_master ?? 0}<br>
      Complete Challenge : ${achievements.general_challenger ?? 0}<br>
      Language : ${formatNameString(api.userLanguage ?? 'ENGLISH')}<br>
      Rank Gifted : ${api?.giftingMeta?.ranksGiven ?? 0}<br>
      First Login : ${formatDateTime(api.firstLogin)}<br>
      Last Login &nbsp: ${formatDateTime(api.lastLogin)}<br>
      Last Logout : ${formatDateTime(api.lastLogout)}`;//&nbsp is space in html
    },
    "bw": (api) => {
        achievements = api.achievements ?? {};
        bedwar = api.stats?.Bedwars ?? {};
        return `Level : ${achievements.bedwars_level ?? 0} | Coins : ${bedwar.coins ?? 0}<br>
      Winstreak : ${bedwar.winstreak ?? 0}<br>
      Bed Destroy : ${bedwar.beds_broken_bedwars ?? 0} | Bed Lost : ${bedwar.beds_lost_bedwars ?? 0}<br>
      Win : ${bedwar.wins_bedwars ?? 0} | Loss : ${bedwar.losses_bedwars ?? 0} | W/L : ${((bedwar.wins_bedwars ?? 0) / (bedwar.losses_bedwars ?? 0)).toFixed(2)}<br>
      Kill : ${bedwar.kills_bedwars ?? 0} | Death : ${bedwar.deaths_bedwars ?? 0} | K/D : ${((bedwar.kills_bedwars ?? 0) / (bedwar.deaths_bedwars ?? 0)).toFixed(2)}<br>
      Final Kill : ${bedwar.final_kills_bedwars ?? 0} | Final Death : ${bedwar.final_deaths_bedwars ?? 0}<br>
      FKDR : ${((bedwar.final_kills_bedwars ?? 0) / (bedwar.final_deaths_bedwars ?? 0)).toFixed(2)}<br>
      Iron : ${bedwar.iron_resources_collected_bedwars ?? 0} | Gold : ${bedwar.gold_resources_collected_bedwars ?? 0}<br>
      Diamond : ${bedwar.diamond_resources_collected_bedwars ?? 0} | Emerald : ${bedwar.emerald_resources_collected_bedwars ?? 0}`;
    },
    "sw": (api) => {
        skywar = api.stats?.SkyWars ?? {};
        return `Level : ${formatColor(skywar.levelFormatted)} | Soul : ${skywar.souls ?? 0}<br>
      Coins : ${skywar.coins ?? 0} | Assists : ${skywar.assists ?? 0}<br>
      Kills : ${skywar.kills ?? 0} | Deaths : ${skywar.deaths ?? 0} | K/D : ${((skywar.kills ?? 0) / (skywar.deaths ?? 0)).toFixed(2)}<br>
      Wins : ${skywar.wins ?? 0} | Losses : ${skywar.losses ?? 0} | W/L : ${((skywar.wins ?? 0) / (skywar.losses ?? 0)).toFixed(2)}`;
    },
    "mm": (api) => {
        mm = api.stats?.MurderMystery ?? {};
        return `Coins : ${mm.coins ?? 0} | Gold Collected : ${mm.coins_pickedup ?? 0}<br>
      Murder Chance : ${mm.murderer_chance ?? 0}%<br>
      Detective Chance : ${mm.detective_chance ?? 0}%<br>
      Wins : ${mm.wins ?? 0} | Win Rate : ${(100 * (mm.wins ?? 0) / (mm.games ?? 0)).toFixed(2)}%<br>
      Kills : ${mm.kills ?? 0} | Deaths : ${mm.deaths ?? 0}<br>
      Knife Kills : ${mm.knife_kills ?? 0} | Bow Kills : ${mm.bow_kills ?? 0}<br>
      Kills As Murderer : ${mm.kills_as_murderer ?? 0} | Heroes : ${mm.was_hero ?? 0}<br>
      Kills As Infected : ${mm.kills_as_infected ?? 0}<br>
      Kills As Survivor : ${mm.kills_as_survivor ?? 0}<br>
      Longest Time Survive : ${mm.longest_time_as_survivor_seconds ?? 0}s<br>
      Alpha Chance : ${mm.alpha_chance ?? 0}%`
    },
    "duel": (api) => {
        duel = api.stats?.Duels ?? {};
        return `Coins : ${duel.coins ?? 0} | Ping Preference : ${duel.pingPreference ?? 0}ms<br>
      Wins : ${duel.wins ?? 0} | Losses : ${duel.losses} | W/L : ${((duel.wins ?? 0) / (duel.losses ?? 0)).toFixed(2)}<br>
      Best Winstreak : ${duel.best_all_modes_winstreak ?? '?'} | Current Winstreak : ${duel.current_winstreak ?? '?'}<br>
      Kills : ${duel.kills ?? 0} | Deaths : ${duel.deaths ?? 0} | K/D : ${((duel.kills ?? 0) / (duel.deaths ?? 0)).toFixed(2)}<br>`
    },
    "uhc": (api) => {
        uhc = api.stats?.UHC ?? {};
        return `Score : ${uhc.score ?? 0} | Coins : ${uhc.coins ?? 0} | Wins : ${uhc.wins ?? 0}<br>
      Kills : ${uhc.kills ?? 0} | Deaths : ${uhc.deaths ?? 0} | K/D : ${((uhc.kills ?? 0) / (uhc.deaths ?? 0)).toFixed(2)}<br>`
    },
    "mw": (api) => {
        mw = api.stats?.Walls3 ?? {};
        return `Coins : ${mw.coins ?? 0} | Wither Damage : ${mw.wither_damage ?? 0}<br>
      Chosen Class : ${formatNameString(mw.chosen_class ?? 'None')}<br>
      Wins : ${mw.wins ?? 0} | Losses : ${mw.losses ?? 0} | W/L : ${((mw.wins ?? 0) / (mw.losses ?? 0)).toFixed(2)}<br>
      Kills : ${mw.kills ?? 0} | Deaths : ${mw.deaths ?? 0}<br>
      K/D : ${((mw.kills ?? 0) / (mw.deaths ?? 0)).toFixed(2)} | Assists : ${mw.assists ?? 0}<br>
      Final kills : ${mw.final_kills ?? 0} | Final deaths : ${mw.final_deaths ?? 0}<br>
      FKDR : ${((mw.final_kills ?? 0) / (mw.final_deaths ?? 0)).toFixed(2)} | Final Assists : ${mw.final_assists ?? 0}<br>`
    },
    "bb": (api) => {
        bb = api.stats?.BuildBattle ?? {};
        return `Game played : ${bb.games_played ?? 0} | Score : ${bb.score ?? 0} | Wins : ${bb.wins ?? 0}<br>
      Solo-Normal wins : ${(bb.wins_solo_normal ?? 0) + (bb.wins_solo_normal_latest ?? 0)} | Team-Normal wins : ${bb.wins_teams_normal ?? 0}<br>
      Solo-Pro wins : ${bb.wins_solo_pro ?? 0} | Guess the build wins : ${bb.wins_guess_the_build ?? 0}<br>`
    },
    "pit": (api) => {
        profile = api.stats?.Pit?.profile ?? {};
        pit_stats_ptl = api.stats?.Pit?.pit_stats_ptl ?? {};
        return `Level : ${getThePitLevel(profile) ?? 0} | Prestiges : ${profile.prestiges ?? ['None']}<br>
      Kills : ${pit_stats_ptl.kills ?? 0} | Deaths : ${pit_stats_ptl.deaths ?? 0}<br>
      Assists : ${pit_stats_ptl.assists ?? 0} | Max Kill Streak : ${pit_stats_ptl.max_streak ?? 0}<br>
      K/D : ${((pit_stats_ptl.kills ?? 0) / (pit_stats_ptl.deaths ?? 0)).toFixed(2)} | 
      K+A/D : ${(((pit_stats_ptl.kills ?? 0) + (pit_stats_ptl.assists ?? 0)) / (pit_stats_ptl.deaths ?? 0)).toFixed(2)}<br>`
    },
    "bsg": (api) => {
        bsg = api.stats?.Blitz ?? {};
        return `Coins : ${bsg.coins ?? 0} | Chests Opened : ${bsg.chests_opened ?? 0}<br>
      Games Played : ${bsg.games_played ?? 0} | Wins : ${bsg.wins ?? 0}<br>
      Kills : ${bsg.kills ?? 0} | Deaths : ${bsg.deaths ?? 0} | K/D : ${((bsg.kills ?? 0) / (bsg.deaths ?? 0)).toFixed(2)}<br>`
    },
    "arcade": (api) => {
        arcade = api.stats?.Arcade ?? {};
        return `Coins : ${arcade.coins ?? 0}<br>
      Zombie : <br>
      Total Rounds Survived : ${arcade.total_rounds_survived_zombies ?? 0} | Wins : ${arcade.wins_zombies ?? 0}<br>
      Hit Rate : ${(100 * (arcade.bullets_hit_zombies ?? 0) / (arcade.bullets_shot_zombies ?? 0)).toFixed(2)}% | 
      Head Shot Rate : ${(100 * (arcade.headshots_zombies ?? 0) / (arcade.bullets_hit_zombies ?? 0)).toFixed(2)}%<br>
      Wins or Best Round : (Map : Normal/Hard/RIP)<br>
      Dead End : ${getRoundValue(arcade, 'deadend', 'normal')} / ${getRoundValue(arcade, 'deadend', 'hard')} / ${getRoundValue(arcade, 'deadend', 'rip')}<br>
      Bad Blood : ${getRoundValue(arcade, 'badblood', 'normal')} / ${getRoundValue(arcade, 'badblood', 'hard')} / ${getRoundValue(arcade, 'badblood', 'rip')}<br>
      Alien Arcadium : ${getRoundValue(arcade, 'alienarcadium', 'normal')}<br>`
    }
};

const getRoundValue = (arcade, map, difficulty) => {
    if (arcade[`wins_zombies_${map}_${difficulty}`] ?? 0 > 0) return `${arcade[`wins_zombies_${map}_${difficulty}`]} Wins`;
    return `${arcade[`total_rounds_survived_zombies_${map}_${difficulty}`] ?? 0} Rounds`;
}

const getGuild = (guildJson, uuid) => {
    if (guildJson == null) return 'Guild : No Guild';
    let data = `Guild : ${guildJson.name}<br>
    Level : ${getGuildLevel(guildJson.exp).toFixed(2)}<br>
    Members : ${guildJson.members.length}<br>`
    let playerGuildJson = guildJson.members.find(member => member.uuid == uuid);
    let rankJson = guildJson.ranks.find(rank => rank.name == playerGuildJson.rank);
    if (playerGuildJson == null || rankJson == null) return data;
    return data + `Join Time : ${formatDateTime(playerGuildJson.joined)}<br>
    Rank : ${playerGuildJson.rank} (${formatColor(formatColorFromString(guildJson.tagColor) + '[' + rankJson.tag + ']')})`;
}
const getStatus = (statusJson) => {
    if (statusJson.online)
        if (statusJson.map != null)
            return `Status : Online<br>Game Type : ${formatNameString(statusJson.gameType)}<br>Mode : ${formatNameString(statusJson.mode)}<br>Map : ${statusJson.map}`;
        else
            return `Status : Online<br>Game Type : ${formatNameString(statusJson.gameType)}<br>Mode : ${formatNameString(statusJson.mode)}`;
    else return `Status : Offline`;
}

const gameTitle = {
    'bw': ['WS', 'FKDR', 'WLR', 'Finals', 'Wins'],
    'sw': ['WS', 'KDR', 'WLR', 'Kills', 'Wins'],
    'duel': ['WS', 'KDR', 'WLR', 'Kills', 'Wins'],
    'mm': ['WR', 'Kills', 'MC', 'DC', 'AC'],// mc=murderer_chance dc=detective_chance ac=alpha_chance
    'uhc': ['Score', 'KDR', 'WLR', 'Kills', 'Wins'],
    'mw': ['FKDR', 'WLR', 'Finals', 'Wins', 'WDamage'],
    'ww': ['KDR', 'WR', 'Kills', 'Wins', 'WPlaced'],
}