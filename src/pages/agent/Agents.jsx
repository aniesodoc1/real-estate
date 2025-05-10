import React, { useEffect, useState } from "react";
import "./Agents.scss";
import { toast } from "react-toastify";
import apiRequest from "../../lib/apiRequest"; 

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch agents from API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await apiRequest.get("/users"); 
        setAgents(response.data);
      } catch (err) {
        console.error("Error fetching agents:", err);
        setError("Failed to load agents.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const notify = () => {
    toast.success("Login to communicate with agents!");
  };

  return (
    <div className="people-you-may-know">
      <h3>Find Agents Around You!</h3>
      
      {loading && <p>Loading agents...</p>}
      {error && <p className="error">{error}</p>}

      <div className="people-list">
        {agents.map((agent) => (
          <div className="person-card" key={agent.id}>
            <img src={agent.avatar || "/noavatar.jpg"} alt={agent.email} className="profile-pic" />
            <div className="person-info">
              <p className="name">{agent.email}</p>
              <p className="mutual-friends">{agent.phonenumber}</p>
              <button className="add-friend" onClick={notify}>Add Agent</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agents;
