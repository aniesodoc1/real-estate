import React, { useContext, useEffect, useState } from 'react'; 
import "./ProfilePage.scss";
import List from '../../components/list/List';
import Chat from '../../components/chat/Chat';
import { Link, useNavigate } from 'react-router-dom';
import apiRequest from '../../lib/apiRequest';
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { updateUser, currentUser } = useContext(AuthContext);
  console.log(currentUser)
  const [userPosts, setUserPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [chats, setChats] = useState([]);  //  State for chats
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState([]);


  // Fetch profile posts
  useEffect(() => {
    const fetchProfilePosts = async () => {
      try {
        const response = await apiRequest.get("/users/profilePosts");
        console.log("Profile Posts:", response.data);
        setUserPosts(response.data.userPosts || []);
        setSavedPosts(response.data.savedPosts || []);
      } catch (err) {
        console.error("Error fetching profile posts:", err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchProfilePosts();
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await apiRequest.get("/chats");
        console.log("Chats:", response.data);
        setChats(response.data || []); // Ensure it's an array
      } catch (err) {
        console.error("Error fetching chats:", err);
        setError("Failed to load chats");
      }
    };

    fetchChats();
  }, []);

  // Logout function
  const handleLogout = async ()  => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiRequest.get(`/users/fetchUser/${currentUser.id}`); 
        console.log(response)
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className='profilePage'>
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar: 
              <img src={user.avatar || "noavatar.jpg"} alt="User Avatar" />
            </span>
            <span>Phone Number: <b>{currentUser?.phonenumber}</b></span>
            <span>E-mail: <b>{currentUser?.email}</b></span>
            <button onClick={handleLogout}>Logout</button>
          </div>

          <div className="title">
            <h1>My List</h1>
            <Link to="/add">
              <button>Create New Post</button>
            </Link>
          </div>
          {loading ? <p className='loading-message'>Loading posts...</p> : <List posts={userPosts} />}
          {error && <p className="error">{error}</p>}

          <div className="title">
            <h1>Saved List</h1>
          </div>
          {loading ? <p className='loading-message'>Loading saved posts...</p> : <List posts={savedPosts} />}
        </div>
      </div>

      <div className="chatContainer">
        <div className="wrapper">
          <Chat chats={chats} />  {/* ✅ Pass fetched chats */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
