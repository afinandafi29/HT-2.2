import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaHome, FaEdit, FaSave, FaFacebook, FaLinkedin, FaBehance, FaGithub, FaDribbble, FaInstagram, FaUserSlash, FaExclamationTriangle, FaUserCheck } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom'; // To get userId from URL if viewing others' profiles
import { useAuth } from '../contexts/AuthContext';
import { getCurrentUserProfileApi, getUserProfileApi, updateUserProfileApi, blockUserApi, unblockUserApi, reportUserApi } from '../api/userApi'; // Adjust path as needed
import '../styles/profile.css';

// Default structure for profile data, helps prevent errors with undefined properties
const initialProfileState = {
  id: '',
  name: 'User',
  username: 'User',
  bio: 'Welcome to my profile',
  avatar_url: 'https://via.placeholder.com/150',
  stats: { // These will likely come from separate queries or aggregated fields in profiles table
    following: 0,
    followers: 0,
    likes: 0, // Likes on user's posts
  },
  socials: {
    facebook: '',
    linkedin: '',
    behance: '',
    codepen: '',
    dribbble: '',
    instagram: ''
  },
  // Add other fields from your backend 'profiles' table here
  // e.g., followers_count, following_count from your schema
  followers_count: 0,
  following_count: 0,
};

const allowedSocials = [
  { key: 'facebook', icon: FaFacebook, label: 'Facebook' },
  { key: 'instagram', icon: FaInstagram, label: 'Instagram' },
  { key: 'linkedin', icon: FaLinkedin, label: 'LinkedIn' },
  { key: 'github', icon: FaGithub, label: 'GitHub' },
  { key: 'behance', icon: FaBehance, label: 'Behance' },
  { key: 'dribbble', icon: FaDribbble, label: 'Dribbble' },
  // add more as needed
];


const ProfileCard = () => {
  const { currentUser, updateUserProfile: updateUserAuthContext } = useAuth(); // updateUserProfile from AuthContext if needed for user_metadata sync
  const navigate = useNavigate();
  const { userId } = useParams(); // If you implement viewing other profiles via /profile/:userId

  const [profileData, setProfileData] = useState(initialProfileState);
  const [editFormData, setEditFormData] = useState(initialProfileState);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isBlockedByCurrentUser, setIsBlockedByCurrentUser] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [actionError, setActionError] = useState(''); // For block/report errors
  const [actionLoading, setActionLoading] = useState(false);

  // Determine which user's profile to load
  const targetUserId = userId || currentUser?.id;
  // console.log("Target User ID:", userId); // Debugging line to check which user is being loaded

  const fetchProfile = useCallback(async () => {
    if (!targetUserId) {
      // If /profile is a private route, currentUser should exist.
      // Might navigate to login if no currentUser and not viewing other's profile.
      // For now, let's assume PrivateRoute handles currentUser availability for own profile.
      setIsLoading(false);
      if (!userId) { // Trying to view own profile but not logged in / currentUser not loaded
        // setError("Not authenticated or user ID not available.");
        navigate('/in'); // Optionally redirect
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      let fetchedData;
      if (userId && userId !== currentUser?.id) {
        // Viewing someone else's profile
        fetchedData = await getUserProfileApi(userId);
      } else {
        // Viewing own profile
        fetchedData = await getCurrentUserProfileApi();
      }

      // Map backend data (e.g., fetchedData.username) to frontend state (e.g., name)
      const displayData = {
        ...initialProfileState, // Start with defaults
        id: fetchedData.id,
        name: fetchedData.username || 'User', // Use 'username' from backend for 'name'
        username: fetchedData.username || 'User',
        bio: fetchedData.bio || '',
        avatar_url: fetchedData.avatar_url || initialProfileState.avatar_url,
        socials: fetchedData.socials || initialProfileState.socials,
        // Map stats - these might need separate fetches or be part of 'profiles' table
        stats: {
          followers: 0,
          following: 0,
          likes: 0,
        },
        followers_count: 0,
        following_count: 0,
      };

      setProfileData(displayData);
      setEditFormData(displayData); // Initialize edit form with fetched data
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError(err.message || 'Failed to load profile.');
      if (err.status === 401 && !userId) { // If fetching own profile and unauthorized
        navigate('/in');
      }
    } finally {
      setIsLoading(false);
    }
  }, [targetUserId, currentUser?.id, userId, navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]); // fetchProfile depends on targetUserId which changes with params or currentUser

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newEditFormData = { ...editFormData };

    if (name.startsWith("socials.")) {
      const socialField = name.split('.')[1];
      newEditFormData.socials = { ...newEditFormData.socials, [socialField]: value };
    } else if (name === "name") { // If 'name' in form maps to 'username' in backend
      newEditFormData.username = value;
      newEditFormData.name = value; // Keep local display name consistent
    }
    else {
      newEditFormData[name] = value;
    }
    setEditFormData(newEditFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || currentUser.id !== profileData.id) {
      setError("You can only edit your own profile.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Prepare data for backend: only send fields that can be updated
      // Backend expects: username, bio, avatar_url, socials
      const updatePayload = {
        username: editFormData.username,
        bio: editFormData.bio,
        avatar_url: editFormData.avatar_url,
        socials: editFormData.socials,
      };

      await updateUserProfileApi(updatePayload);

      // Update user_metadata in AuthContext if needed (e.g., if username/avatar is stored there too)
      // This depends on whether your backend's updateUserProfile also calls supabase.auth.updateUser()
      // and if your AuthContext's updateUserProfile is designed to sync with Supabase auth.
      // For simplicity, if the backend handles supabase.auth.updateUser, then the local currentUser
      // in AuthContext might get out of sync until next login or manual refresh.
      // A more robust way is for AuthContext.currentUser to also reflect latest user_metadata.
      // The `updateUserProfile` function in your `AuthContext` could be used for this.
      // await updateUserAuthContext({ username: updatedProfileFromServer.username, avatar_url: updatedProfileFromServer.avatar_url });
      // Or, more simply, just refetch profile after update:
      await fetchProfile(); // This will re-fetch and set profileData & editFormData

      setEditMode(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEditMode = () => {
    if (editMode) {
      setEditFormData({ ...profileData }); // Discard changes on cancel
    }
    setEditMode(!editMode);
    setError(null); // Clear previous errors
  };

  const handleBlockUser = async () => {
    if (!currentUser || !targetUserId || currentUser.id === targetUserId) return;
    setActionLoading(true);
    setActionError('');
    try {
      await blockUserApi(targetUserId);
      setIsBlockedByCurrentUser(true); // Optimistic update
      alert(`${profileData.name} has been blocked.`);
      // Optionally, refetch profile or posts if blocking should hide them immediately
    } catch (err) {
      setActionError(err.message || "Failed to block user.");
      if (err.status === 409) alert("User is already blocked."); // Handle conflict from API
      else alert("Failed to block user.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblockUser = async () => {
    if (!currentUser || !targetUserId || currentUser.id === targetUserId) return;
    setActionLoading(true);
    setActionError('');
    try {
      await unblockUserApi(targetUserId);
      setIsBlockedByCurrentUser(false); // Optimistic update
      alert(`${profileData.name} has been unblocked.`);
    } catch (err) {
      setActionError(err.message || "Failed to unblock user.");
      alert("Failed to unblock user.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenReportModal = () => {
    if (!currentUser || !targetUserId || currentUser.id === targetUserId) return;
    setReportReason('');
    setActionError('');
    setShowReportModal(true);
  };

  const handleReportUser = async (e) => {
    e.preventDefault();
    if (!reportReason.trim()) {
      setActionError("Please provide a reason for reporting.");
      return;
    }
    setActionLoading(true);
    setActionError('');
    try {
      await reportUserApi(targetUserId, reportReason);
      alert(`${profileData.name} has been reported. Thank you.`);
      setShowReportModal(false);
    } catch (err) {
      setActionError(err.message || "Failed to report user.");
      // alert("Failed to report user."); // Error shown in modal
    } finally {
      setActionLoading(false);
    }
  };


  const formatNumber = (num) => {
    return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num;
  };

  // Check if the current user is viewing their own profile
  const isOwnProfile = currentUser && currentUser.id === profileData.id;


  if (isLoading && !profileData.id) { // Show full page loader only on initial load
    return <div className="profile-container flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  }

  if (error) {
    return <div className="profile-container flex flex-col justify-center items-center h-screen text-red-500"><p>{error}</p><button onClick={fetchProfile} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Retry</button></div>;
  }

  if (!profileData.id && !isLoading) { // Handle case where profile doesn't exist after loading
    return <div className="profile-container flex justify-center items-center h-screen"><p>Profile not found.</p></div>;
  }

  return (
    <div className="profile-container">
      <div className="pCard_card">
        {isOwnProfile && (<div>
          {!editMode && (<button className='home-button home' onClick={() => navigate('/')}><FaHome /></button>)}
          <button className="edit-button text-sky-700" onClick={editMode ? handleSubmit : toggleEditMode}>
            {isLoading && editMode ? "Saving" : (editMode ? <FaSave /> : <FaEdit />)}
          </button>
        </div>
        )}

        {editMode && isOwnProfile ? (
          // Edit Form
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="profile-image-container">
              <img
                src={editFormData.avatar_url || initialProfileState.avatar_url}
                alt="Profile"
                className="profile-image"
              />
              <input
                type="text"
                name="avatar_url"
                value={editFormData.avatar_url}
                onChange={handleInputChange}
                placeholder="Profile image URL"
                className="image-url-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Name (Username):</label>
              <input
                type="text"
                id="name"
                name="name" // This will update editFormData.username via handleInputChange logic
                value={editFormData.name} // Display 'name' which is synced with 'username'
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio:</label>
              <textarea
                id="bio"
                name="bio"
                value={editFormData.bio}
                onChange={handleInputChange}
              />
            </div>

            {/* Stats are generally not directly editable, they are derived */}
            {/* <h3>Stats</h3> ... */}

            <h3>Social Media</h3>
            {allowedSocials.map(({ key, label }) => (
              <div className="form-group" key={key}>
                <label htmlFor={`socials.${key}`}>{label}:</label>
                <input
                  type="url"
                  id={`socials.${key}`}
                  name={`socials.${key}`}
                  value={editFormData.socials[key] || ''}
                  onChange={handleInputChange}
                  placeholder={`https://${key}.com/username`}
                />
              </div>
            ))}

            <div className="form-buttons">
              <button type="submit" className="save-button" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save'}
              </button>
              <button type="button" className="cancel-button" onClick={toggleEditMode} disabled={isLoading}>
                Cancel
              </button>
            </div>
            {error && <p className="error-message mt-2 text-red-500">{error}</p>}
          </form>
        ) : (
          // Profile Display
          <>
            <div className="pCard_up">
              <div className="profile-image-container">
                <img src={profileData.avatar_url} alt={profileData.name} className="profile-image" />
              </div>
              <div className="pCard_text">
                <h2>{profileData.name}</h2> {/* Display 'name' which is profileData.username */}
                <p>{profileData.bio}</p>
              </div>
              {!isOwnProfile && ( /* Show follow button if not own profile - for later phase */
                <div className="pCard_add">
                  <FaPlus /> {/* Placeholder for Follow button */}
                </div>
              )}
            </div>

            <div className="pCard_down">
              <div>
                <p>Following</p>
                <p>{formatNumber(profileData.following_count)}</p>
              </div>
              <div>
                <p>Followers</p>
                <p>{formatNumber(profileData.followers_count)}</p>
              </div>
              <div>
                <p>Likes</p> {/* This 'Likes' likely means likes received on user's posts */}
                <p>{formatNumber(profileData.stats.likes)}</p> {/* Placeholder - needs data */}
              </div>
            </div>

            {Object.values(profileData.socials).some(link => link) && ( // Only show if any social link exists
              <div className="pCard_back">
                <p>Social Media</p>
                <div className="social-icons">
                  {allowedSocials.map(({ key, icon: Icon }) => (
                    profileData.socials[key] ? (
                      <a key={key} href={profileData.socials[key]} target="_blank" rel="noopener noreferrer">
                        <Icon className="social-icon" />
                      </a>
                    ) : null
                  ))}
                </div>
                {/* <p>Follow Me!</p> */}
              </div>
            )}
            <div className="pCard_back bg-fuchsia-600 p-4 rounded-lg text-white">
              {currentUser && targetUserId && currentUser.id == targetUserId && (<p className="text-lg font-semibold mb-3">USER</p>)}

              {/* Actions */}
              {currentUser && targetUserId && currentUser.id !== targetUserId && (
                <div className="profile-actions flex space-x-2 justify-center">
                  {isBlockedByCurrentUser ? (
                    <button
                      onClick={handleUnblockUser}
                      disabled={actionLoading}
                      className="px-3 py-1.5 text-sm font-medium bg-yellow-600 rounded-md hover:bg-yellow-700 flex items-center"
                    >
                      <FaUserCheck className="mr-1" />
                      {actionLoading ? 'Unblocking...' : 'Unblock'}
                    </button>
                  ) : (
                    <button
                      onClick={handleBlockUser}
                      disabled={actionLoading}
                      className="px-3 py-1.5 text-sm font-medium bg-red-600 rounded-md hover:bg-red-700 flex items-center"
                    >
                      <FaUserSlash className="mr-1" />
                      {actionLoading ? 'Blocking...' : 'Block User'}
                    </button>
                  )}
                  <button
                    onClick={handleOpenReportModal}
                    disabled={actionLoading}
                    className="px-3 py-1.5 text-sm font-medium bg-gray-600 rounded-md hover:bg-gray-700 flex items-center"
                  >
                    <FaExclamationTriangle className="mr-1" />
                    Report
                  </button>
                </div>
              )}

              {/* Action Error */}
              {actionError && <p className="text-red-300 text-center text-xs mt-2">{actionError}</p>}

              {/* Modal (keep outside of .pCard_back for proper z-index positioning) */}
              {showReportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                  <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md relative">
                    <h3 className="text-xl font-semibold mb-4 text-white">Report {profileData.name}</h3>
                    <form onSubmit={handleReportUser}>
                      <textarea
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                        rows="4"
                        placeholder="Please provide a reason for reporting..."
                        required
                      />
                      {actionError && <p className="text-red-500 text-sm mt-2">{actionError}</p>}
                      <div className="mt-4 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowReportModal(false)}
                          disabled={actionLoading}
                          className="px-4 py-2 text-gray-300 bg-gray-600 rounded-md hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                        >
                          {actionLoading ? 'Submitting...' : 'Submit Report'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// TODO for `isBlockedByCurrentUser`: Create a backend endpoint `GET /api/users/block-status/:targetUserId` that checks the `blocked_users` table for `blocker_id = currentUser.id` and `blocked_id = targetUserId`. Call this in `checkBlockStatus`.

export default ProfileCard;