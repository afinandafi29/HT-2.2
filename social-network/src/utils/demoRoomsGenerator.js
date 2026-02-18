import { profileImages } from '../data/roomsData';

const usedProfileImages = new Set();

/**
 * Get a unique profile image that hasn't been used recently
 */
export const getUniqueProfileImage = () => {
  const available = profileImages.filter(img => !usedProfileImages.has(img));

  if (available.length === 0) {
    // If all images are used, clear the set to allow reuse, 
    // but try to shuffle or pick differently if possible.
    // Ideally we would want even more images, but 60 is a good start.
    usedProfileImages.clear();
    // Re-calculate available
    const freshAvailable = profileImages;
    const image = freshAvailable[Math.floor(Math.random() * freshAvailable.length)];
    usedProfileImages.add(image);
    return image;
  }

  const image = available[Math.floor(Math.random() * available.length)];
  usedProfileImages.add(image);
  return image;
};

/**
 * Generate fake demo rooms for different categories and languages
 */
export const generateDemoRooms = () => {
  const categories = {
    'Latest News': [
      'Breaking News Discussion',
      'Tech News Today',
      'World News Updates',
      'Sports Headlines',
      'Entertainment News'
    ],
    'Tech': [
      'AI & Machine Learning',
      'Web Development Tips',
      'Mobile App Dev',
      'Cloud Computing Talk',
      'Cybersecurity Discussion',
      'Data Science Forum',
      'DevOps Best Practices'
    ],
    'Podcast': [
      'Tech Talks Daily',
      'Business & Entrepreneurship',
      'True Crime Stories',
      'Comedy Hour',
      'Self Development Journey',
      'Science Explained'
    ],
    'Movies': [
      'Movie Classics Discussion',
      'Latest Releases Talk',
      'SciFi & Fantasy',
      'Documentary Lovers',
      'Horror Movie Night',
      'Bollywood Blockbusters',
      'Animation & Comics'
    ]
  };

  const languages = ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Japanese', 'Hindi', 'Chinese'];

  const rooms = [];
  let roomId = 1;

  // Generate rooms for each category and language combination
  Object.entries(categories).forEach(([category, titles]) => {
    titles.forEach(title => {
      languages.forEach((lang, index) => {
        if (index < 3) { // Generate 3 language variants per room to avoid too many
          const topicLang = index === 0 ? lang : `${lang}`;
          const roomTitle = `${title} - ${topicLang}`;
          const randomProfileCount = Math.floor(Math.random() * 8) + 2; // 2-9 people

          const profiles = [];
          for (let i = 0; i < randomProfileCount; i++) {
            profiles.push(getUniqueProfileImage());
          }

          rooms.push({
            id: roomId++,
            title: roomTitle,
            category: category,
            topic: topicLang,
            meeting_url: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'}/join/room-${roomId}`,
            happytalk_room_name: `HAPPYY-TALK-ROOM-${roomId}`,
            profile: {
              id: `user_${roomId}`,
              username: `Host_${roomId}`,
              avatar_url: getUniqueProfileImage()
            },
            people: profiles,
            created_by: `user_${roomId}`,
            is_private: false,
            created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
          });
        }
      });
    });
  });

  return rooms;
};

/**
 * Add horizontal scrolling support to room categories
 */
export const setupHorizontalScroll = () => {
  const roomGrids = document.querySelectorAll('[data-scrollable]');

  roomGrids.forEach(grid => {
    let isDown = false;
    let startX;
    let scrollLeft;

    grid.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - grid.offsetLeft;
      scrollLeft = grid.scrollLeft;
      grid.style.cursor = 'grabbing';
    });

    grid.addEventListener('mouseleave', () => {
      isDown = false;
      grid.style.cursor = 'grab';
    });

    grid.addEventListener('mouseup', () => {
      isDown = false;
      grid.style.cursor = 'grab';
    });

    grid.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - grid.offsetLeft;
      const walk = (x - startX) * 2;
      grid.scrollLeft = scrollLeft - walk;
    });
  });
};
