import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentUserProfileApi } from '../../api/userApi';

const Header = ({ onMenuClick, onProfileClick }) => {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Default placeholder image
  const defaultAvatar = "https://via.placeholder.com/150";

  // Get profile data including avatar_url
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getCurrentUserProfileApi();
        setProfileData(response);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  // Determine which avatar to display
  const profilePic = profileData?.avatar_url || currentUser?.avatar_url || defaultAvatar;

  return (
    <div className="header-section">
      <div className="w-full flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-5">
          <button
            className="group w-10 h-10 flex items-center justify-center bg-transparent text-primary hover:text-white transition-all cursor-pointer border-none outline-none p-0"
            onClick={onMenuClick}
            title="Open Menu"
          >
            <i className="fas fa-bars text-2xl transition-all duration-300 group-hover:scale-110"></i>
          </button>
          <Link to="/" className='flex items-center gap-3 no-underline group'>
            <div className="relative">
              <img
                src="/logo.png"
                alt="HAPPYY TALK Logo"
                className="h-10 w-12 object-contain transition-transform duration-500 group-hover:rotate-[360deg]"
              />
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tighter text-primary" style={{ color: '#ffffff', textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>HAPPYY TALK</h1>
          </Link>
        </div>

        <div className="profile-section flex items-center">
          {currentUser ? (
            <div
              onClick={onProfileClick}
              className="flex items-center gap-3 no-underline group px-3 py-1.5 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10 cursor-pointer"
            >
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-white font-black text-sm leading-tight tracking-tight uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  {profileData?.username || currentUser?.username || 'User'}
                </span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                  <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Online</span>
                </div>
              </div>
              <div className="relative">
                {isLoading ? (
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-blue-500/10 animate-pulse border-2 border-blue-500/30"></div>
                ) : (
                  <>
                    <img
                      alt={profileData?.username || "Profile"}
                      className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover border-2 border-blue-500 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform"
                      src={profilePic || defaultAvatar}
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#0f172a] rounded-full sm:hidden"></div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <Link to="/in" className="signin-button-header text-xs px-3 py-1.5 md:text-sm md:px-5 md:py-2.5 flex items-center gap-2 font-bold tracking-wider uppercase">
              <i className="fas fa-user-circle text-base"></i>
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>

    </div>
  );
};

export default Header;