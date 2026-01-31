import React from 'react';

const WatchPartyScreen = ({ searchQuery }) => {
  const platforms = [
    { title: "Netflix", url: "https://www.netflix.com" },
    { title: "Prime Video", url: "https://www.primevideo.com" },
    { title: "Disney+", url: "https://www.disneyplus.com" },
    { title: "Hulu", url: "https://www.hulu.com" },
    { title: "Max", url: "https://www.max.com" },
    { title: "Apple TV+", url: "https://tv.apple.com" },
    { title: "Paramount+", url: "https://www.paramountplus.com" },
    { title: "Peacock", url: "https://www.peacocktv.com" },
    { title: "YouTube Premium", url: "https://www.youtube.com/premium" },
    { title: "Hotstar", url: "https://www.hotstar.com" },
    { title: "JioCinema", url: "https://www.jiocinema.com" },
    { title: "Zee5", url: "https://www.zee5.com" },
    { title: "SonyLIV", url: "https://www.sonyliv.com" },
    { title: "MX Player", url: "https://www.mxplayer.in" },
    { title: "ALTBalaji", url: "https://www.altbalaji.com" },
    { title: "Eros Now", url: "https://www.erosnow.com" },
    { title: "Aha", url: "https://www.aha.video" },
    { title: "Sun NXT", url: "https://www.sunnxt.com" },
    { title: "Hoichoi", url: "https://www.hoichoi.tv" },
    { title: "Viu", url: "https://www.viu.com" },
    { title: "iQIYI", url: "https://www.iq.com" },
    { title: "WeTV", url: "https://wetv.vip" },
    { title: "Viki", url: "https://www.viki.com" },
    { title: "Crunchyroll", url: "https://www.crunchyroll.com" },
    { title: "HIDIVE", url: "https://www.hidive.com" },
    { title: "RetroCrush", url: "https://www.retrocrush.tv" },
    { title: "AsianCrush", url: "https://www.asiancrush.com" },
    { title: "Kocowa", url: "https://www.kocowa.com" },
    { title: "Tubi", url: "https://tubitv.com" },
    { title: "Pluto TV", url: "https://pluto.tv" },
    { title: "Freevee", url: "https://www.amazon.com/freevee" },
    { title: "Roku Channel", url: "https://therokuchannel.roku.com" },
    { title: "Plex", url: "https://www.plex.tv" },
    { title: "Crackle", url: "https://www.crackle.com" },
    { title: "Popcornflix", url: "https://www.popcornflix.com" },
    { title: "Kanopy", url: "https://www.kanopy.com" },
    { title: "Hoopla", url: "https://www.hoopladigital.com" },
    { title: "Sling TV", url: "https://www.sling.com" },
    { title: "YouTube TV", url: "https://tv.youtube.com" },
    { title: "Hulu Live", url: "https://www.hulu.com/live-tv" },
    { title: "FuboTV", url: "https://www.fubo.tv" },
    { title: "DirecTV Stream", url: "https://www.directv.com/stream" },
    { title: "Philo", url: "https://www.philo.com" },
    { title: "Frndly TV", url: "https://frndlytv.com" },
    { title: "Viaplay", url: "https://viaplay.com" },
    { title: "BritBox", url: "https://www.britbox.com" },
    { title: "Acorn TV", url: "https://acorn.tv" },
    { title: "Shudder", url: "https://www.shudder.com" },
    { title: "AMC+", url: "https://www.amcplus.com" },
    { title: "Sundance Now", url: "https://www.sundancenow.com" },
    { title: "Criterion", url: "https://www.criterionchannel.com" },
    { title: "Mubi", url: "https://mubi.com" },
    { title: "Curiosity Stream", url: "https://curiositystream.com" },
    { title: "Discovery+", url: "https://www.discoveryplus.com" },
    { title: "ESPN+", url: "https://plus.espn.com" },
    { title: "DAZN", url: "https://www.dazn.com" },
    { title: "NFL+", url: "https://www.nfl.com/plus" },
    { title: "NBA League Pass", url: "https://www.nba.com/leaguepass" },
    { title: "MLB.TV", url: "https://www.mlb.tv" },
    { title: "WWE Network", url: "https://watch.wwe.com" },
    { title: "UFC Fight Pass", url: "https://ufcfightpass.com" },
    { title: "Starz", url: "https://www.starz.com" },
    { title: "BET+", url: "https://www.bet.plus" },
    { title: "ALLBLK", url: "https://allblk.tv" },
    { title: "Hallmark Movies", url: "https://www.hmnow.com" },
    { title: "Lifetime Club", url: "https://www.mylifetime.com/lifetime-movie-club" },
    { title: "Pure Flix", url: "https://www.pureflix.com" },
    { title: "UP Faith & Family", url: "https://upfaithandfamily.com" },
    { title: "Gaia", url: "https://www.gaia.com" },
    { title: "MagellanTV", url: "https://www.magellantv.com" },
    { title: "Docubay", url: "https://www.docubay.com" },
    { title: "History Vault", url: "https://www.historyvault.com" },
    { title: "MHz Choice", url: "https://mhchoice.com" },
    { title: "Topic", url: "https://www.topic.com" },
    { title: "Ovid.tv", url: "https://www.ovid.tv" },
    { title: "Fandor", url: "https://www.fandor.com" },
    { title: "BroadwayHD", url: "https://www.broadwayhd.com" },
    { title: "ViX Premium", url: "https://www.vix.com" },
    { title: "Canela.TV", url: "https://www.canela.tv" },
    { title: "Telemundo", url: "https://www.telemundo.com" },
    { title: "Univision", url: "https://www.univisionnow.com" },
    { title: "Blim TV", url: "https://www.blim.com" },
    { title: "Shahid", url: "https://shahid.mbc.net" },
    { title: "OSN Streaming", url: "https://streaming.osn.com" },
    { title: "Lionsgate Play", url: "https://www.lionsgateplay.com" },
    { title: "iflix", url: "https://www.iflix.com" },
    { title: "CatchPlay", url: "https://www.catchplay.com" },
    { title: "Bilibili", url: "https://www.bilibili.tv" },
    { title: "Youku", url: "https://www.youku.com" },
    { title: "Mango TV", url: "https://w.mgtv.com" },
    { title: "TrueID", url: "https://trueid.net" },
    { title: "Now TV", url: "https://www.now.com" },
    { title: "TVB Anywhere", url: "https://www.tvbanywherena.com" }
  ];

  const filteredPlatforms = platforms.filter(platform =>
    platform.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIconUrl = (url) => {
    try {
      if (!url) return 'https://img.icons8.com/?size=100&id=123&format=png';
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (e) {
      return 'https://img.icons8.com/?size=100&id=123&format=png';
    }
  };

  return (
    <div className="w-full h-[calc(100%-80px)] bg-black text-white p-5 overflow-y-auto block no-scrollbar">
      <h2 className="text-xl font-bold mb-4">Streaming Apps</h2>
      <div className="grid grid-cols-4 gap-4 justify-items-center">
        {filteredPlatforms.map((platform, index) => (
          <div key={index} className="flex flex-col items-center gap-1 group w-full">
            <a href={platform.url} target="_blank" rel="noopener noreferrer" className="w-[60px] h-[60px] bg-[#1a1a1a] rounded-[18px] flex items-center justify-center transition-all duration-300 group-hover:bg-[#333] group-hover:scale-105 shadow-md border border-white/5">
              <img
                src={getIconUrl(platform.url)}
                alt={platform.title}
                className="w-10 h-10 object-contain rounded-md filter drop-shadow opacity-90 group-hover:opacity-100"
                onError={(e) => { e.target.src = 'https://img.icons8.com/ios-filled/50/ffffff/tv-show.png' }}
              />
            </a>
            <div className="text-center text-[10px] text-gray-400 group-hover:text-white line-clamp-1 w-full px-1">{platform.title}</div>
          </div>
        ))}
      </div>
      <div className="h-20"></div>
    </div>
  );
};

export default WatchPartyScreen;