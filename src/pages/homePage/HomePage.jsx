import React, { useContext } from 'react';
import "./HomePage.scss";
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';

const HomePage = () => {
  const {currentUser} = useContext(AuthContext)

  console.log(currentUser)
  return (
    <div className='homePage'>
        {/* Video Background */}
        <video autoPlay loop muted className="videoBackground">
            <source src="/bg-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>

        <Link to="/list" className="centeredLink">
        Explore Properties
      </Link>
    </div>
  )
}

export default HomePage;
