import React, { useEffect, useState } from 'react';
import './ListPage.scss';
import Filter from '../../components/filter/Filter';
import Card from '../../components/card/Card';
import Map from '../../components/map/Map';
import { useLocation } from 'react-router-dom';
import apiRequest from '../../lib/apiRequest';

const ListPage = () => {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Refresh Posts function
  const refreshPosts = async () => {
    setLoading(true);
    try {
      const response = await apiRequest.get(`/posts${location.search}`);
      console.log('Filtered Data:', response.data);

      if (Array.isArray(response.data)) {
        setPosts(response.data);
      } else {
        console.warn('Unexpected postResponse structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts on initial render or when location.search changes
  useEffect(() => {
    refreshPosts();
  }, [location.search]);

  console.log('Posts:', posts);

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          <div className="mapContainer">
            <Map items={posts} />
          </div>
          {loading ? (
            <p className='loading-message'>Loading properties...</p>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} item={post} refreshPosts={refreshPosts} />
            ))
          ) : (
            <p>No properties found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListPage;
