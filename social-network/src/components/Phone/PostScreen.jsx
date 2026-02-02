import React, { useState, useEffect } from 'react';

const PostScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching posts
    setTimeout(() => {
      setPosts([
        {
          id: 1,
          author: 'StarGazer',
          avatar: '/profiles/ACg8ocJG7LMZRabftI6ewwD1U-TC7XZdv586UXWqq4EYrfj5V-o9sWMJ-s12.webp',
          content: 'Just joined an amazing English room! Learning new phrases and making friends. #LanguageLovers #HAPPYY TALK',
          image: 'https://source.unsplash.com/random/600x400?galaxy',
          likes: 189,
          comments: 24,
          time: '2h ago'
        },
        {
          id: 2,
          author: 'CosmoChat',
          avatar: '/profiles/ACg8ocL2bhd8s2iHX2n3yHA8Zl9cc8HBh4lfMjMc2mIlBRxzcVkp5dRY-s12.webp',
          content: 'Spanish room was lit! Discussed favorite movies en español. Join us next time! #CineEnEspañol',
          image: null,
          likes: 567,
          comments: 42,
          time: '4h ago'
        },
        {
          id: 3,
          author: 'NebulaNerd',
          avatar: '/profiles/Abraham Baker.webp',
          content: 'French conversation practice was so fun! Learned about Parisian culture. #FrenchVibes',
          image: 'https://source.unsplash.com/random/600x400?paris',
          likes: 243,
          comments: 18,
          time: '1d ago'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="h-full bg-black text-white overflow-y-auto">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold">Post</h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover" />
                  <div className="ml-3">
                    <div className="font-semibold">{post.author}</div>
                    <div className="text-xs text-gray-400">{post.time}</div>
                  </div>
                </div>
                <p className="text-gray-200 mb-3">{post.content}</p>
                {post.image && (
                  <img src={post.image} alt="Post content" className="w-full h-auto rounded-lg mb-3" />
                )}
                <div className="flex justify-between text-gray-400 text-sm">
                  <div>❤️ {post.likes} likes</div>
                  <div>💬 {post.comments} comments</div>
                  <div>📤 Share</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostScreen;