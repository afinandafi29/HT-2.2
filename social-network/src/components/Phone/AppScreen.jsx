import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppIcon from './AppIcon';

const AppScreen = ({ onAppClick, searchQuery }) => {
  const navigate = useNavigate();
  const apps = [
    {
      id: 'youtube-app',
      title: 'YouTube',
      icon: 'https://img.icons8.com/?size=100&id=19318&format=png&color=000000',
      type: 'image'
    },
    {
      id: 'reels-app',
      title: 'Reels',
      type: 'svg',
      url: '/feed', // Or if there is a specific /reels route, but feed has Reels view
      svg: (
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="#ff0050" />
          <path d="M18 22h28v20H18z" fill="#fff" opacity="0.2" />
          <path d="M22 26l20 6-20 6z" fill="#fff" />
          <rect x="18" y="20" width="28" height="4" fill="#000" />
          <rect x="22" y="20" width="2" height="4" fill="#fff" />
          <rect x="31" y="20" width="2" height="4" fill="#fff" />
          <rect x="40" y="20" width="2" height="4" fill="#fff" />
        </svg>
      )
    },
    {
      id: 'games-folder',
      title: 'Games',
      type: 'svg',
      svg: (
        <svg viewBox="0 0 64 64">
          <rect x="8" y="24" width="48" height="24" rx="12" fill="#4f8cff" />
          <circle cx="22" cy="36" r="5" fill="#fff" />
          <rect x="19" y="33" width="6" height="2" fill="#4f8cff" />
          <rect x="21" y="31" width="2" height="6" fill="#4f8cff" />
          <circle cx="42" cy="36" r="2.5" fill="#fff" />
          <circle cx="48" cy="36" r="2.5" fill="#fff" />
          <circle cx="45" cy="32" r="2.5" fill="#fff" />
          <circle cx="45" cy="40" r="2.5" fill="#fff" />
        </svg>
      )
    },
    {
      id: 'watchparty-app',
      title: 'Watch Party',
      type: 'svg',
      svg: (
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="#ffb347" />
          <polygon points="28,22 46,32 28,42" fill="#fff" />
          <circle cx="20" cy="46" r="4" fill="#fff" />
          <circle cx="44" cy="46" r="4" fill="#fff" />
          <ellipse cx="32" cy="52" rx="12" ry="3" fill="#fff" opacity="0.6" />
        </svg>
      )
    },
    {
      id: 'whiteboard-app',
      title: 'Whiteboard',
      type: 'svg',
      svg: (
        <svg viewBox="0 0 64 64">
          <rect x="10" y="14" width="44" height="36" rx="4" fill="#fff" stroke="#333" strokeWidth="2" />
          <rect x="14" y="18" width="36" height="28" rx="2" fill="#e3f2fd" />
          <polygon points="50,44 54,50 46,50" fill="#333" />
          <rect x="40" y="38" width="8" height="2" fill="#1976d2" />
          <rect x="18" y="26" width="18" height="2" fill="#1976d2" />
          <rect x="18" y="30" width="10" height="2" fill="#1976d2" />
        </svg>
      )
    },
    {
      id: 'feed-app',
      title: 'Post',
      type: 'svg',
      url: '/post',
      svg: (
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="#4f8cff" />
          <rect x="20" y="22" width="24" height="20" rx="4" fill="#fff" />
          <rect x="24" y="26" width="16" height="4" rx="2" fill="#4f8cff" />
          <rect x="24" y="34" width="12" height="3" rx="1.5" fill="#b3d1ff" />
          <rect x="24" y="40" width="8" height="3" rx="1.5" fill="#b3d1ff" />
          <circle cx="28" cy="30" r="2" fill="#b3d1ff" />
        </svg>
      )
    },
    {
      id: 'news-app',
      title: 'News',
      type: 'svg',
      url: '/news',
      svg: (
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="#ff5252" />
          <path d="M18 20h28v24H18z" fill="#fff" />
          <path d="M22 24h20v2H22zm0 6h20v2H22zm0 6h14v2H22z" fill="#bdbdbd" />
        </svg>
      )
    },
    {
      id: 'social-app',
      title: 'Social',
      type: 'svg',
      svg: (
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="#ffb347" />
          <circle cx="24" cy="32" r="8" fill="#fff" />
          <circle cx="40" cy="32" r="8" fill="#fff" />
          <ellipse cx="32" cy="44" rx="14" ry="6" fill="#fff" opacity="0.7" />
          <circle cx="24" cy="32" r="3" fill="#ffb347" />
          <circle cx="40" cy="32" r="3" fill="#ffb347" />
        </svg>
      )
    },
    {
      id: 'movie-app',
      title: 'Movie',
      type: 'svg',
      svg: (
        <svg viewBox="0 0 64 64">
          <rect x="10" y="16" width="44" height="32" rx="6" fill="#22223b" />
          <polygon points="30,26 46,32 30,38" fill="#ff595e" />
          <rect x="16" y="20" width="4" height="4" rx="2" fill="#f8f9fa" />
          <rect x="16" y="40" width="4" height="4" rx="2" fill="#f8f9fa" />
          <rect x="44" y="20" width="4" height="4" rx="2" fill="#f8f9fa" />
          <rect x="44" y="40" width="4" height="4" rx="2" fill="#f8f9fa" />
        </svg>
      )
    },
    {
      id: 'spotify-app',
      title: 'Spotify',
      type: 'svg',
      url: '/music',
      svg: (
        <svg viewBox="0 0 64 64">
          <rect x="8" y="8" width="48" height="48" rx="12" fill="#1DB954" />
          <path d="M32 16c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zm7.348 23.066c-.289.482-.906.634-1.377.345-3.77-2.304-8.514-2.824-14.105-1.547-.541.124-.994-.289-1.118-.83-.124-.541.289-.994.83-1.118 6.116-1.395 11.384-.794 15.623 1.788.471.289.624.906.345 1.377-.001-.001-.001-.001-.002-.002zm1.965-4.366c-.365.606-1.14.795-1.746.43-4.315-2.654-10.885-3.422-15.98-1.87-.662.201-1.36-.172-1.36.834-1.561 5.835-1.777 13.102-.914 18.023 2.089.606.365.795 1.14.43 1.746zm.169-4.543c-5.178-3.076-13.714-3.36-18.656-1.859-.794.241-1.633-.207-1.874-1.001-.241-.794.207-1.633 1.001-1.874 5.694-1.729 15.115-1.395 21.068 2.152.724.43.961 1.368.531 2.092-.43.724-1.368.961-2.092.531l.022-.041z" fill="#fff" />
        </svg>
      )
    },
    {
      id: 'unsplash-app',
      title: 'Unsplash',
      type: 'svg',
      svg: (
        <svg viewBox="0 0 64 64">
          <rect x="8" y="8" width="48" height="48" rx="12" fill="#000" />
          <path d="M22 24h20v14H22zM32 28l-6 6h12z" fill="#fff" />
          <rect x="22" y="24" width="20" height="4" fill="#000" />
          <path d="M20 20h24v12h-4v-8h-16v8h-4z" fill="#fff" />
        </svg>
      )
    },
    {
      id: 'dictionary-app',
      title: 'Dictionary',
      type: 'svg',
      svg: (
        <svg viewBox="0 0 64 64">
          <rect x="8" y="8" width="48" height="48" rx="12" fill="#4f46e5" />
          <path d="M20 18h24v28H20z" fill="#fff" opacity="0.2" />
          <path d="M24 22h16v4H24zM24 30h16v2H24zM24 36h12v2H24z" fill="#fff" />
          <path d="M18 16v32h28V16H18zm26 30H20V18h24v28z" fill="#fff" />
        </svg>
      )
    },
    {
      id: 'theme-app',
      title: 'Theme',
      type: 'svg',
      svg: (
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="#333" />
          <path d="M20 32a12 12 0 1 1 24 0 12 12 0 0 1-24 0z" fill="#fff" opacity="0.5" />
          <circle cx="32" cy="32" r="10" fill="#ff4081" />
          <circle cx="42" cy="22" r="4" fill="#00e676" />
          <circle cx="22" cy="42" r="4" fill="#2979ff" />
        </svg>
      )
    },
    {
      id: 'app-store',
      title: 'App Store',
      type: 'svg',
      svg: (
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="#2979ff" />
          <path d="M32 18L18 26v18l14 8 14-8V26z" fill="#fff" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
          <path d="M32 18v22M18 26l14 14M46 26L32 40" stroke="#2979ff" strokeWidth="2" />
        </svg>
      )
    },
    {
      id: 'ai-chat-app',
      title: 'AI Chat',
      type: 'svg',
      svg: (
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="#8b5cf6" />
          <rect x="18" y="22" width="28" height="20" rx="4" fill="#fff" />
          <circle cx="24" cy="28" r="2" fill="#8b5cf6" />
          <circle cx="32" cy="28" r="2" fill="#8b5cf6" />
          <circle cx="40" cy="28" r="2" fill="#8b5cf6" />
          <path d="M22 35h20M22 38h16" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    }
  ];

  // External apps with image icons
  const externalApps = [
    { title: 'Instagram', icon: 'https://img.icons8.com/?size=100&id=BrU2BBoRXiWq&format=png&color=000000', url: 'https://instagram.com' },
    { title: 'Facebook', icon: 'https://img.icons8.com/?size=100&id=118497&format=png&color=000000', url: 'https://facebook.com' },
    { title: 'Pinterest', icon: 'https://img.icons8.com/?size=100&id=63676&format=png&color=000000', url: 'https://pinterest.com' },
    { title: 'LinkedIn', icon: 'https://img.icons8.com/?size=100&id=xuvGCOXi8Wyg&format=png&color=000000', url: 'https://linkedin.com' },
    { title: 'Quora', icon: 'https://img.icons8.com/?size=100&id=wPcChHypTdti&format=png&color=000000', url: 'https://quora.com' },
    { title: 'Reddit', icon: 'https://img.icons8.com/?size=100&id=FLisMqR76b1i&format=png&color=000000', url: 'https://reddit.com' },
    { title: 'Google', icon: 'https://img.icons8.com/?size=100&id=17949&format=png&color=000000', url: 'https://google.com' },
    { title: 'Chrome', icon: 'https://img.icons8.com/?size=100&id=63785&format=png&color=000000', url: 'https://www.google.com/chrome/' },
    { title: 'Google Maps', icon: 'https://img.icons8.com/?size=100&id=DcygmpZqBEd9&format=png&color=000000', url: 'https://maps.google.com' },
    { title: 'Google Docs', icon: 'https://img.icons8.com/?size=100&id=30464&format=png&color=000000', url: 'https://docs.google.com' },
    { title: 'Gmail', icon: 'https://img.icons8.com/?size=100&id=qyRpAggnV0zH&format=png&color=000000', url: 'https://mail.google.com' },
    { title: 'Google Pay', icon: 'https://img.icons8.com/?size=100&id=d3FdjviJ7gNe&format=png&color=000000', url: 'https://pay.google.com' },
    { title: 'Amazon', icon: 'https://img.icons8.com/?size=100&id=21295&format=png&color=000000', url: 'https://amazon.com' },
    { title: 'Amazon Music', icon: 'https://img.icons8.com/?size=100&id=3TE5FcLikFfj&format=png&color=000000', url: 'https://music.amazon.com' },
    { title: 'Spotify', icon: 'https://img.icons8.com/?size=100&id=G9XXzb9XaEKX&format=png&color=000000', url: 'https://spotify.com' },
    { title: 'Amazon Prime', icon: 'https://img.icons8.com/?size=100&id=TUt56jArwSOO&format=png&color=000000', url: 'https://www.amazon.com/amazonprime' },
    { title: 'Netflix', icon: 'https://img.icons8.com/?size=100&id=ortlsYTZxMvT&format=png&color=000000', url: 'https://www.netflix.com' },
    { title: 'Flipkart', icon: 'https://img.icons8.com/?size=100&id=UU2im0hihoyi&format=png&color=000000', url: 'https://www.flipkart.com' },
    { title: 'Swiggy', icon: 'https://img.icons8.com/?size=100&id=M8M9YjBrtUkd&format=png&color=000000', url: 'https://www.swiggy.com' },
    { title: 'Paytm', icon: 'https://img.icons8.com/?size=100&id=Aub11Fs5DJVg&format=png&color=000000', url: 'https://www.paytm.com' },
    { title: 'Canva', icon: 'https://img.icons8.com/?size=100&id=iWw83PVcBpLw&format=png&color=000000', url: 'https://www.canva.com' },
    { title: 'WhatsApp', icon: 'https://img.icons8.com/?size=100&id=16713&format=png&color=000000', url: 'https://www.whatsapp.com' },
    { title: 'Mail', icon: 'https://img.icons8.com/?size=100&id=cHNRcWMI2bLJ&format=png&color=000000', url: 'https://www.apple.com/mail' },
    { title: 'Snapchat', icon: 'https://img.icons8.com/?size=100&id=67599&format=png&color=000000', url: 'https://snapchat.com' },
    { title: 'Telegram', icon: 'https://img.icons8.com/?size=100&id=oWiuH0jFiU0R&format=png&color=000000', url: 'https://telegram.org' },
    { title: 'Zoom', icon: 'https://img.icons8.com/?size=100&id=82ewLsKHYlLc&format=png&color=000000', url: 'https://zoom.us' },
    { title: 'Google Meet', icon: 'https://img.icons8.com/?size=100&id=pE97I4t7Il9M&format=png&color=000000', url: 'https://meet.google.com' },
    { title: 'YouTube Music', icon: 'https://img.icons8.com/?size=100&id=V1cbDThDpbRc&format=png&color=000000', url: 'https://music.youtube.com' },
    { title: 'Google Translate', icon: 'https://img.icons8.com/?size=100&id=13647&format=png&color=000000', url: 'https://translate.google.com' },
    { title: 'Perplexity AI', icon: 'https://img.icons8.com/?size=100&id=kzJWN5jCDzpq&format=png&color=000000', url: 'https://www.perplexity.ai' },
    { title: 'X', icon: 'data:image/png;base64,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', url: 'https://x.com' },
    { title: 'TikTok', icon: 'data:image/png;base64,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', url: 'https://www.tiktok.com' },
    { title: 'ChatGPT', icon: 'https://img.icons8.com/color/512/chatgpt.png', url: 'https://www.openai.com/chatgpt' },
    { title: 'Zomato', icon: 'https://cdn.iconscout.com/icon/free/png-256/free-zomato-logo-icon-download-in-svg-png-gif-file-formats--food-company-brand-delivery-brans-logos-icons-1637644.png', url: 'https://www.zomato.com' },
    { title: 'PhonePe', icon: 'https://img.icons8.com/?size=100&id=OYtBxIlJwMGA&format=png&color=000000', url: 'https://www.phonepe.com' },
    { title: 'Notion', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuiJF9RmhWpGB2ZZZEJqnFISzMzhFdTVYxunUjpPd6Irb8fqIboNh5OfbEG9B_vf55Lgw&usqp=CAU', url: 'https://www.notion.so' },
    { title: 'Wikipedia', icon: 'data:image/png;base64,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', url: 'https://www.wikipedia.org' }
  ];

  // Combine all apps
  const allApps = [
    ...apps,
    ...externalApps.map((app, index) => ({
      id: `external-app-${index}`,
      title: app.title,
      icon: app.icon,
      type: 'image',
      url: app.url
    }))
  ];

  // Filter apps based on search query
  const filteredApps = allApps.filter(app =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-[calc(100%-75px)] bg-black text-white p-4 overflow-y-auto block">
      <div className="grid grid-cols-3 gap-4 justify-items-center">
        {filteredApps.map((app) => (
          <AppIcon
            key={app.id}
            id={app.id}
            title={app.title}
            icon={app.icon}
            type={app.type}
            svg={app.svg}
            url={app.url}
            onClick={() => {
              if (app.url) {
                // Check if it's an internal route (starts with /)
                if (app.url.startsWith('/')) {
                  navigate(app.url);
                } else {
                  window.open(app.url, '_blank');
                }
              } else {
                onAppClick(app.id);
              }
            }}
          />
        ))}
      </div>
      <div className="w-full h-[100px] bg-black mt-5"></div>
    </div>
  );
};

export default AppScreen;