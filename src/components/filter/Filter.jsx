import React, { useState } from 'react';
import "./filter.scss";
import { Link } from 'react-router-dom';

const Filter = () => {
  const [query, setQuery] = useState({
    property: "",
    type: "",
    city: "",
    minPrice: 0,
    maxPrice: 0,
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className='filter'>
      <h1>Search Results For <b>Lagos Nigeria</b></h1>
      <div className='top'>
        <div className='item'>
          <label htmlFor='city'>Location</label>
          <input type='text' id="city" name='city' placeholder='City' onChange={handleChange}/>
        </div>
      </div>
      <div className='bottom'>
        <div className='item'>
          <label htmlFor='type'>Type</label>
          <select name='type' id='type' onChange={handleChange}>
            <option value="">Any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>
        <div className='item'>
          <label htmlFor='property'>Property</label>
          <select name='property' id='property' onChange={handleChange}>
            <option value="">Any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
        </div>
        <div className='item'>
          <label htmlFor='minPrice'>Min Price</label>
          <input type='number' id="minPrice" name='minPrice' placeholder='Any' onChange={handleChange}/>
        </div>
        <div className='item'>
          <label htmlFor='maxPrice'>Max Price</label>
          <input type='number' id="maxPrice" name='maxPrice' placeholder='Any' onChange={handleChange}/>
        </div>
        <Link className="link" to={`/list?city=${query.city}&property=${query.property}&type=${query.type}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}>
          <img src='/search.png' alt=''/>
        </Link>
      </div>
    </div>
  );
};

export default Filter;
