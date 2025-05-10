import React, { useContext, useState , useEffect} from 'react'
import "./Navbar.scss"
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';
import { useNotificationStore} from "../../lib/notificationStore"
import apiRequest from '../../lib/apiRequest';

const Navbar = () => {
  const [open, setOpen] = useState(false);
   const [user, setUser] = useState([]);
  const navigate = useNavigate();

  const {currentUser} = useContext(AuthContext);

  const fetch = useNotificationStore((state) => state.fetch)
  const number = useNotificationStore((state) => state.number)

  fetch()


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiRequest.get(`/users/${currentUser.id}`); 
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

  const onClickimg = () => {
    navigate("/profile")
  }

  const onLogin = () => {
    navigate("/login")
  }

  const onRegister = () => {
    navigate("/signup")
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiRequest.get(`/users/${currentUser.id}`); 
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
    <nav>
      <div className='left'>
        <a href='/' className='logo'>
          <img src='/logo.png' alt='logo'/>
          <span>PrimeAsset</span>
        </a>
        <Link to='/'>Home</Link>
        <Link to='/abouts'>About</Link>
        <Link to='/contact'>Contact</Link>
      </div>
      
      <div className='right'>
        <Link className='chatlink' to="/profile">
      {number > 0 && <div className="chatnotifications">{number}</div>}
      <img src='/chat.png'
       alt='' 
      className='chatimg' 
      onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}/>
      </Link>
        {currentUser ? (
          <div className='user'>
            <img src={user.avatar || "/noavatar.jpg"} alt="" onClick={onClickimg} />
            <span>{currentUser.email}</span>
            <Link to="/profile" className='profile'>
            {number > 0 && <div className="notifications">{number}</div>}
            <span>Messages</span>
            </Link>
          </div>
        ) : (
          <>
          <Link to='/agents'>Agents</Link>
          <button className='login' onClick={onLogin}>Login</button>
          <button className='register' onClick={onRegister}>Signup</button>
          </>
        )}
      <div className='menuIcon'>
      <img src='/menu.png' alt='menu' onClick={() => setOpen(!open)}/>
      </div>
      <div className={open ? "menu active" : "menu"}>
      { currentUser ? (
        <>
      <Link to='/'>Home</Link>
        <Link to='/abouts'>About</Link>
        <Link to='/contact'>Contact</Link>
        </>
      ) : (
        <Link to='/agents'>Agents</Link>
        )
}
      </div>
        </div>
    </nav>
  )
}

export default Navbar