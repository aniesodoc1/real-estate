import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import displayNGCurrency from '../helpers/displayCurrency';
import { FaStar } from 'react-icons/fa';
import { FaStarHalfStroke } from 'react-icons/fa6';

const Pin = ({ data }) => {
  const location = [6.5841, 3.9860]; // Same hardcoded location

  return (
    <Marker position={location}>
      <Popup>
        <div className='flex flex-col items-center'>
          <img
            src={data.productImage?.[0]}
            alt="Product"
            className='w-48 h-32 rounded-lg object-cover'
          />
          <p className='text-sm font-bold'>{data.productName}</p>
           <div className='text-red-600 flex items-center gap-1'>
                      <FaStar/>
                      <FaStar/>
                      <FaStar/>
                      <FaStar/>
                      <FaStarHalfStroke/>
                    </div>
          <p className='text-sm font-bold '>{displayNGCurrency(data?.sellingPrice)}</p>
          <p className='text-sm font-bold'>{data?.description.length > 0 ? data?.description.slice(0,30) + "..." : data?.description}</p>
          </div>
      </Popup>
    </Marker>
  );
};

export default Pin;
