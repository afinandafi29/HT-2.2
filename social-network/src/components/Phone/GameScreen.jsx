import React from 'react';

const GameScreen = ({ searchQuery }) => {
  const games = [
    { title: "Among Us", url: "https://www.innersloth.com/games/among-us/" },
    { title: "Diep.io", url: "https://diep.io/" },
    { title: "Shell Shockers", url: "https://shellshock.io/" },
    { title: "Paper.io 2", url: "https://paper-io.com/" },
    { title: "Hole.io", url: "https://hole-io.com/" },
    { title: "Surviv.io", url: "https://surviv.io/" },
    { title: "Zombs Royale", url: "https://zombsroyale.io/" },
    { title: "Worms Zone", url: "https://worms.zone/" },
    { title: "Voxiom.io", url: "https://voxiom.io/" },
    { title: "BuildRoyale.io", url: "https://buildroyale.io/" },
    { title: "Smash Karts", url: "https://smashkarts.io/" },
    { title: "Little Big Snake", url: "https://littlebigsnake.com/" },
    { title: "Taming.io", url: "https://taming.io/" },
    { title: "Colonist.io", url: "https://colonist.io/" },
    { title: "Secret Hitler", url: "https://secrethitler.io/" },
    { title: "Drawize", url: "https://www.drawize.com/" },
    { title: "Schedios.io", url: "https://schedios.io/" },
    { title: "Wanderers.io", url: "https://wanderers.io/" },
    { title: "Wilds.io", url: "https://wilds.io/" },
    { title: "PlayingCards.io", url: "https://playingcards.io/" },
    { title: "Tetris 99", url: "https://www.nintendo.com/games/detail/tetris-99-switch/" },
    { title: "Jackbox Party", url: "https://www.jackboxgames.com/" },
    { title: "Quizizz", url: "https://quizizz.com/" },
    { title: "Kahoot!", url: "https://kahoot.com/" },
    { title: "Blooket", url: "https://www.blooket.com/" },
    { title: "GeoGuessr", url: "https://www.geoguessr.com/" },
    { title: "Tetr.io", url: "https://tetr.io/" },
    { title: "Destiny 2", url: "https://www.destinythegame.com/" },
    { title: "Fortnite", url: "https://www.fortnite.com/" },
    { title: "Rocket League", url: "https://www.rocketleague.com/" },
    { title: "Fall Guys", url: "https://fallguys.com/" },
    { title: "Brawlhalla", url: "https://www.brawlhalla.com/" },
    { title: "Warframe", url: "https://www.warframe.com/" },
    { title: "Splatoon 3", url: "https://www.nintendo.com/games/detail/splatoon-3-switch/" },
    { title: "Overwatch 2", url: "https://overwatch.blizzard.com/" },
    { title: "Valorant", url: "https://playvalorant.com/" },
    { title: "Apex Legends", url: "https://www.ea.com/games/apex-legends" },
    { title: "Warzone", url: "https://www.callofduty.com/warzone" },
    { title: "Genshin Impact", url: "https://genshin.hoyoverse.com/" },
    { title: "Roblox", url: "https://www.roblox.com/" },
    { title: "Minecraft", url: "https://www.minecraft.net/" },
    { title: "Among Us VR", url: "https://www.innersloth.com/games/among-us-vr/" },
    { title: "Rec Room", url: "https://recroom.com/" },
    { title: "VRChat", url: "https://hello.vrchat.com/" },
    { title: "World of Tanks", url: "https://worldoftanks.com/" },
    { title: "World of Warships", url: "https://worldofwarships.com/" },
    { title: "Clash Royale", url: "https://clashroyale.com/" },
    { title: "Brawl Stars", url: "https://supercell.com/en/games/brawlstars/" },
    { title: "Hearthstone", url: "https://hearthstone.blizzard.com/" },
    { title: "MTG Arena", url: "https://magic.wizards.com/en/mtgarena" },
    { title: "Master Duel", url: "https://www.konami.com/yugioh/masterduel/" },
    { title: "Runescape", url: "https://www.runescape.com/" },
    { title: "OS Runescape", url: "https://oldschool.runescape.com/" },
    { title: "Albion Online", url: "https://albiononline.com/" },
    { title: "EVE Online", url: "https://www.eveonline.com/" },
    { title: "SWTOR", url: "https://www.swtor.com/" },
    { title: "Guild Wars 2", url: "https://www.guildwars2.com/" },
    { title: "FFXIV", url: "https://www.finalfantasyxiv.com/" },
    { title: "Lost Ark", url: "https://www.playlostark.com/" },
    { title: "Path of Exile", url: "https://www.pathofexile.com/" },
    { title: "Diablo IV", url: "https://diablo4.blizzard.com/" },
    { title: "Monster Hunter", url: "https://www.monsterhunter.com/rise/" },
    { title: "Sea of Thieves", url: "https://www.seaofthieves.com/" },
    { title: "Among Trees", url: "https://amongtreesgame.com/" },
    { title: "Phasmophobia", url: "https://phasmophobia.kineticgames.com/" },
    { title: "Dead by Daylight", url: "https://deadbydaylight.com/" },
    { title: "Back 4 Blood", url: "https://www.back4blood.com/" },
    { title: "Left 4 Dead 2", url: "https://store.steampowered.com/app/550/Left_4_Dead_2/" },
    { title: "Team Fortress 2", url: "https://store.steampowered.com/app/440/Team_Fortress_2/" },
    { title: "CS:GO", url: "https://www.counter-strike.net/" },
    { title: "R6 Siege", url: "https://www.ubisoft.com/en-us/game/rainbow-six/siege" },
    { title: "Halo Infinite", url: "https://www.halowaypoint.com/en-us/games/halo-infinite" },
    { title: "FIFA 23", url: "https://www.ea.com/games/fifa/fifa-23" },
    { title: "NBA 2K23", url: "https://nba.2k.com/" },
    { title: "Madden NFL 23", url: "https://www.ea.com/games/madden-nfl/madden-nfl-23" },
    { title: "Mario Kart 8", url: "https://www.nintendo.com/games/detail/mario-kart-8-deluxe-switch/" },
    { title: "Smash Ultimate", url: "https://www.smashbros.com/" },
    { title: "Animal Crossing", url: "https://www.animal-crossing.com/new-horizons/" },
    { title: "Stardew Valley", url: "https://www.stardewvalley.net/" },
    { title: "No Man’s Sky", url: "https://www.nomanssky.com/" },
    { title: "Elite Dangerous", url: "https://www.elitedangerous.com/" },
    { title: "Star Citizen", url: "https://robertsspaceindustries.com/" },
    { title: "Gran Turismo 7", url: "https://www.playstation.com/en-us/games/gran-turismo-7/" },
    { title: "Forza Horizon 5", url: "https://www.forzamotorsport.net/en-us/forza-horizon-5" },
    { title: "Wipeout", url: "https://www.playstation.com/en-us/games/wipeout-omega-collection/" },
    { title: "Dofus", url: "https://www.dofus.com/" },
    { title: "Wakfu", url: "https://www.wakfu.com/" },
    { title: "Tibia", url: "https://www.tibia.com/" },
    { title: "Dota 2", url: "https://www.dota2.com/" },
    { title: "League of Legends", url: "https://www.leagueoflegends.com/" },
    { title: "Smite", url: "https://www.smitegame.com/" },
    { title: "Heroes of Storm", url: "https://heroesofthestorm.com/" },
    { title: "Paladins", url: "https://www.paladins.com/" },
    { title: "Knockout City", url: "https://www.ea.com/games/knockout-city" },
    { title: "Gang Beasts", url: "https://gangbeasts.game/" },
    { title: "Worms Rumble", url: "https://www.team17.com/games/worms-rumble/" },
    { title: "Pummel Party", url: "https://store.steampowered.com/app/880670/Pummel_Party/" },
    { title: "Tabletop Sim", url: "https://www.tabletopsimulator.com/" },
    { title: "Skull", url: "https://skull.games/" },
    { title: "Fishbowl", url: "https://fishbowl-game.com/" }
  ];

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIconUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (e) {
      return 'https://img.icons8.com/?size=100&id=123&format=png';
    }
  };

  return (
    <div className="w-full h-[calc(100%-80px)] bg-black text-white p-5 overflow-y-auto block no-scrollbar">
      <h2 className="text-xl font-bold mb-4">Multiplayer Games</h2>
      <div className="grid grid-cols-4 gap-4 justify-items-center">
        {filteredGames.map((game, index) => (
          <div key={index} className="flex flex-col items-center gap-1 group w-full">
            <a href={game.url} target="_blank" rel="noopener noreferrer" className="w-[60px] h-[60px] bg-[#1a1a1a] rounded-[18px] flex items-center justify-center transition-all duration-300 group-hover:bg-[#333] group-hover:scale-105 shadow-md border border-white/5">
              <img
                src={getIconUrl(game.url)}
                alt={game.title}
                className="w-10 h-10 object-contain rounded-md filter drop-shadow opacity-90 group-hover:opacity-100"
                onError={(e) => { e.target.src = 'https://img.icons8.com/ios-filled/50/ffffff/controller.png' }}
              />
            </a>
            <div className="text-center text-[10px] text-gray-400 group-hover:text-white line-clamp-1 w-full px-1">{game.title}</div>
          </div>
        ))}
      </div>
      <div className="h-20"></div>
    </div>
  );
};

export default GameScreen;