import React, { useState, useEffect } from 'react';

const MovieScreen = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('popular');
  const [error, setError] = useState(null);

  // Watchmode API Key
  const WATCHMODE_API_KEY = 'ILzoVazWtCJJw4wWR00Kf4DUxvK6apIinbJ8FSGh';

  useEffect(() => {
    fetchMovies();
  }, [activeCategory]);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);

    try {
      let endpoint = '';

      // Map categories to Watchmode API endpoints
      switch (activeCategory) {
        case 'popular':
          endpoint = `https://api.watchmode.com/v1/list-titles/?apiKey=${WATCHMODE_API_KEY}&types=movie&sort_by=popularity_desc&limit=12`;
          break;
        case 'trending':
          endpoint = `https://api.watchmode.com/v1/list-titles/?apiKey=${WATCHMODE_API_KEY}&types=movie&sort_by=trending&limit=12`;
          break;
        case 'new':
          endpoint = `https://api.watchmode.com/v1/list-titles/?apiKey=${WATCHMODE_API_KEY}&types=movie&sort_by=release_date_desc&limit=12`;
          break;
        default:
          endpoint = `https://api.watchmode.com/v1/list-titles/?apiKey=${WATCHMODE_API_KEY}&types=movie&limit=12`;
      }

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      // Transform Watchmode data to our format
      const transformedMovies = data.titles?.map(movie => ({
        id: movie.id,
        title: movie.title,
        poster: movie.poster || 'https://via.placeholder.com/300x450?text=No+Poster',
        rating: movie.user_rating || movie.imdb_rating || 'N/A',
        year: movie.year,
        type: movie.type
      })) || [];

      setMovies(transformedMovies);
    } catch (err) {
      console.error('Error fetching movies from Watchmode:', err);
      setError(err.message);

      // Fallback to demo data if API fails
      const fallbackData = {
        popular: [
          { id: 1, title: 'The Language of Love', poster: 'https://source.unsplash.com/random/300x450?movie', rating: 4.8 },
          { id: 2, title: 'Global Connections', poster: 'https://source.unsplash.com/random/300x450?cinema', rating: 4.5 },
          { id: 3, title: 'Words Across Worlds', poster: 'https://source.unsplash.com/random/300x450?film', rating: 4.7 },
          { id: 4, title: 'The Translator', poster: 'https://source.unsplash.com/random/300x450?theatre', rating: 4.3 },
        ],
        trending: [
          { id: 5, title: 'Polyglot Dreams', poster: 'https://source.unsplash.com/random/300x450?popcorn', rating: 4.9 },
          { id: 6, title: 'Lost in Translation', poster: 'https://source.unsplash.com/random/300x450?screen', rating: 4.6 },
          { id: 7, title: 'Babel', poster: 'https://source.unsplash.com/random/300x450?projector', rating: 4.4 },
          { id: 8, title: 'The Linguist', poster: 'https://source.unsplash.com/random/300x450?hollywood', rating: 4.2 },
        ],
        new: [
          { id: 9, title: 'Voices of the World', poster: 'https://source.unsplash.com/random/300x450?premiere', rating: 4.1 },
          { id: 10, title: 'The Last Word', poster: 'https://source.unsplash.com/random/300x450?actor', rating: 4.0 },
          { id: 11, title: 'Echo Chamber', poster: 'https://source.unsplash.com/random/300x450?actress', rating: 4.3 },
          { id: 12, title: 'Dialect', poster: 'https://source.unsplash.com/random/300x450?director', rating: 4.5 },
        ]
      };
      setMovies(fallbackData[activeCategory]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-black text-white overflow-y-auto">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold">Movies</h2>
        <p className="text-xs text-gray-500 mt-1">Powered by Watchmode API</p>
      </div>

      <div className="flex border-b border-gray-800">
        <button
          className={`flex-1 py-3 px-4 text-center ${activeCategory === 'popular' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveCategory('popular')}
        >
          Popular
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center ${activeCategory === 'trending' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveCategory('trending')}
        >
          Trending
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center ${activeCategory === 'new' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveCategory('new')}
        >
          New
        </button>
      </div>

      {error && (
        <div className="p-4 bg-yellow-900/20 border-l-4 border-yellow-500 text-yellow-200 text-sm">
          <p className="font-semibold">API Error</p>
          <p className="text-xs mt-1">{error} - Showing fallback data</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="p-4 grid grid-cols-2 gap-4">
          {movies.map(movie => (
            <div key={movie.id} className="bg-gray-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
                }}
              />
              <div className="p-2">
                <h3 className="font-medium text-sm line-clamp-2">{movie.title}</h3>
                {movie.year && (
                  <p className="text-xs text-gray-400 mt-1">{movie.year}</p>
                )}
                <div className="flex items-center mt-1">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="text-xs">{typeof movie.rating === 'number' ? movie.rating.toFixed(1) : movie.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieScreen;