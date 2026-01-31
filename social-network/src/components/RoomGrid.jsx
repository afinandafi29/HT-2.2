import { useEffect, useState } from 'react';
import RoomCard from './RoomCard';
import { roomsData, profileImages } from '../../data/roomsData';

const RoomGrid = ({ searchTerm, activeCategory }) => {
  const [rooms, setRooms] = useState(roomsData);

  useEffect(() => {
    // Assign random profiles to each room
    const updatedRooms = rooms.map(room => {
      const numPeople = Math.floor(Math.random() * 7) + 4;
      const shuffledImages = [...profileImages].sort(() => 0.5 - Math.random());
      const people = Array.from({ length: numPeople }, (_, i) => ({
        avatar_url: shuffledImages[i],
        premium: Math.random() < 0.2
      }));

      return { ...room, people };
    });

    setRooms(updatedRooms);
  }, []);

  // Filter rooms based on search term and active category
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = searchTerm === '' ||
      room.title.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeCategory === 'all') {
      return matchesSearch;
    } else if (activeCategory === 'english' || activeCategory === '') {
      return matchesSearch;
    } else if (activeCategory === 'trending') {
      return matchesSearch && room.title.toLowerCase() === 'english';
    } else {
      return matchesSearch && room.title.toLowerCase() === activeCategory.toLowerCase();
    }
  });

  return (
    <div className="room-grid" id="room-grid">
      {filteredRooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
};

export default RoomGrid;