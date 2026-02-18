import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentUserProfileApi } from '../../api/userApi';
import { CircleUser } from 'lucide-react';

const Header = ({ onMenuClick, onProfileClick, onTitleClick }) => {
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

  // Debug logging


  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/jitsi';

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
          <Link to="/" className='flex items-center gap-3 no-underline group' onClick={onTitleClick}>
            <h1 className="text-xl md:text-2xl font-black tracking-tighter" style={{ color: '#ffffff', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#ffffff'}>HAPPYY TALK</h1>
            <div className="loader" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px' }}>
              <svg id="wave" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42.5 48" style={{ height: '30px', width: '25px', fill: '#ffffff', transition: 'fill 0.3s ease' }}>
                <title>Audio Wave</title>
                <path id="Line_1" data-name="Line 1" d="M0.91,15L0.78,15A1,1,0,0,0,0,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H0.91Z" style={{ animation: 'pulse 1s infinite', animationDelay: '0.15s' }} />
                <path id="Line_2" data-name="Line 2" d="M6.91,9L6.78,9A1,1,0,0,0,6,10V28a1,1,0,1,0,2,0s0,0,0,0V10A1,1,0,0,0,7,9H6.91Z" style={{ animation: 'pulse 1s infinite', animationDelay: '0.3s' }} />
                <path id="Line_3" data-name="Line 3" d="M12.91,0L12.78,0A1,1,0,0,0,12,1V37a1,1,0,1,0,2,0s0,0,0,0V1a1,1,0,0,0-1-1H12.91Z" style={{ animation: 'pulse 1s infinite', animationDelay: '0.45s' }} />
                <path id="Line_4" data-name="Line 4" d="M18.91,10l-0.12,0A1,1,0,0,0,18,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H18.91Z" style={{ animation: 'pulse 1s infinite', animationDelay: '0.6s' }} />
                <path id="Line_5" data-name="Line 5" d="M24.91,15l-0.12,0A1,1,0,0,0,24,16v6a1,1,0,0,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H24.91Z" style={{ animation: 'pulse 1s infinite', animationDelay: '0.75s' }} />
                <path id="Line_6" data-name="Line 6" d="M30.91,10l-0.12,0A1,1,0,0,0,30,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H30.91Z" style={{ animation: 'pulse 1s infinite', animationDelay: '0.9s' }} />
              </svg>
            </div>
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
                <img
                  alt={profileData?.username || "Profile"}
                  className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover border-2 border-blue-500 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform"
                  src={profilePic || defaultAvatar}
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#0f172a] rounded-full sm:hidden"></div>
              </div>
            </div>
          ) : (
            <Link
              to="/in"
              className="flex items-center justify-center w-10 h-10 bg-transparent text-white hover:bg-white/10 rounded-full transition-all no-underline"
              style={{ border: 'none' }}
              title="Login"
            >
              <CircleUser size={28} />
            </Link>
          )}
        </div>
      </div>

    </div>
  );
};

export default Header;