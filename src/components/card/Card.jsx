import React from "react";
import "./Card.scss";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Card = ({ item, refreshPosts }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`https://real-estate-server-e9wo.onrender.com/api/posts/${item.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        refreshPosts();
        alert("Post deleted successfully!");
      } else {
        toast.error("Failed to delete. post doesn't belong to you, You don't have permission!");
        //alert("Failed to delete. post doesn't belong to you, You don't have permission!");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        {item.images && item.images.length > 0 ? (
          <img src={item.images[0]} alt="Property" />
        ) : item.videos && item.videos.length > 0 ? (
          <video controls autoPlay loop src={item.videos[0]} />
        ) : (
          <div className="noMedia">No Media Available</div>
        )}
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="Location" />
          <span>{item.address}</span>
        </p>
        <p className="price">${item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img className="bed" src="/bed.png" alt="Bedroom" />
              <span>{item.bedroom} bedrooms</span>
            </div>
            <div className="feature">
              <img className="bath" src="/bath.png" alt="Bathroom" />
              <span>{item.bathroom} bathrooms</span>
            </div>
          </div>
          <div className="icons">
            <div className="icon" onClick={handleDelete}>
              <img src="/delete.png" alt="Delete" />
            </div>
            <Link className="icon" to="/profile">
              <img src="/chat.png" alt="Chat" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
