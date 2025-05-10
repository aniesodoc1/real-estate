import React from 'react'
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.scss"
import Pin from '../pin/Pin';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


const Map = ({items}) => {
  return (
    <MapContainer center={items.length === 1 ? [items[0].latitude, items[0].longitude] : [6.5244, 3.3792]}
     zoom={7} scrollWheelZoom={false} className='map'>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {items.map(item=>(
        <Pin item={item} key={item.id}/>
      ))}
    </MapContainer>
  )
}

export default Map