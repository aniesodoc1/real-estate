import React from "react";
import "./Pin.scss";
import { Link } from "react-router-dom";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";




const Pin = ({ item }) => {
  const customIcon = new L.Icon({
    iconUrl: markerIcon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: markerShadow,
    shadowSize: [41, 41],
  });

  // Check if the first media is an image or video
  const firstMedia = item.images[0] || item.videos[0];
  const isVideo =
    firstMedia?.endsWith(".mp4") ||
    firstMedia?.endsWith(".webm") ||
    firstMedia?.endsWith(".ogg");

  return (
    <Marker position={[item.latitude, item.longitude]} icon={customIcon}>
      <Popup minWidth={250} maxWidth={300} autoPan={true}>
        <div className="popupContainer">
          {isVideo ? (
            <video src={firstMedia} autoPlay loop controls width="100%" />
          ) : (
            <img src={firstMedia} alt="Media" style={{ width: "100%", height: "auto" }} />
          )}
          <div className="textContainer">
            <Link to={`/${item.id}`}>{item.title}</Link>
            <span>{item.bedroom} bedroom</span>
            <b>$ {item.price}</b>
            <span>{item.address}</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default Pin;
