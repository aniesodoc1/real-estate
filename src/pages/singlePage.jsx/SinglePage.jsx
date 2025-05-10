import React, { useContext, useState, useEffect } from 'react';
import "./SinglePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import DOMPurify from "dompurify";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import Videoslider from '../../components/videoslider/Videoslider';

const SinglePage = () => {
  const navigate = useNavigate();
  const post = useLoaderData(); // Get data directly here
  const [loading, setLoading] = useState(true); 
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (post) {
      setLoading(false); // Stop loading once data is fetched
    }
  }, [post]);

  const handleSave = async () => {
    setSaved((prev) => !prev);

    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.error("Error saving post:", err);
      setSaved((prev) => !prev); // Revert on error
    }
  };

  // Show loading state until data is fetched
  if (loading) {
    return <p>Loading property details...</p>;
  }

  if (!post) {
    return <p>Property details not found.</p>;
  }

  return (
    <div className='singlePage'>
      <div className='details'>
        <div className='wrapper'>
          <Slider images={post.images}/>
          <div className='info'>
            <div className='top'>
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src='/pin.png' alt='' />
                  <span>{post.address}</span>
                </div>
                <div className='price'>$ {post.price}</div>
              </div>
              <div className='user_and_explore'>
                <div className="user">
                  <img src={post.user.avatar || "noavatar.jpg"} alt='' />
                  <span>{post.user.phonenumber}</span>
                </div>
                <Link className='explore' to="/list">Explore More</Link>
              </div>
            </div>

            <Videoslider videos={post.videos}/>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.postDetail.desc) }}
            >
            </div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className='title'>General</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            <Link to="/profile"className='link'>
              <img src="/chat.png" alt="" />
              send a message
            </Link>
            <button
              onClick={handleSave}
              style={{ backgroundColor: saved ? "#fece51" : "white" }}
            >
              <img src="/save.png" alt="" />
              {saved ? "Place Saved" : "save the place"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePage;
