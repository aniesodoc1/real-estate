import React, { useContext, useState } from 'react';
import "./ProfileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from '../../lib/apiRequest';
import { useNavigate } from 'react-router-dom';
import Upload from '../../components/upload/Upload';

const ProfileUpdatePage = () => {
    const { updateUser, currentUser } = useContext(AuthContext);
    const [phonenumber, setPhonenumber] = useState(currentUser?.phonenumber || "");
    const [email, setEmail] = useState(currentUser?.email || "");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [avatar, setAvatar] = useState([]);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        const res = await apiRequest.put(`/users/${currentUser.id}`, {
          phonenumber,
          email,
          password,
          avatar:avatar[0]
        });

        console.log("Updated user:", res.data);

        updateUser(res.data.user); 
        navigate("/profile");

      } catch (err) {
        console.error("Update error:", err);
        setError(err.response?.data?.message || "Failed to update profile");
      }
    };

    return (
      <div className="profileUpdatePage">
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            <h1>Update Profile</h1>
            <div className="item">
              <label htmlFor="phonenumber">Phone Number</label>
              <input
                id="phonenumber"
                name="phonenumber"
                type="text"
                value={phonenumber}
                onChange={(e) => setPhonenumber(e.target.value)}
              />
            </div>
            <div className="item">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="item">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button>Update</button>
            {error && <span className="error">{error}</span>}
          </form>
        </div>
        <div className="sideContainer">
          <img src={avatar[0] || currentUser.avatar || "/noavatar.jpg"} alt="avatar" className="avatar" />
          <Upload
          uwConfig={{
            cloudName: "difdmg2bx",
            uploadPreset: "realestate",
            multiple: "false",
            maxImageFileSize: 10485760,
            folder: "avatars"
          }}
          setImages={setAvatar}
          />
        </div>
      </div>
    );
}

export default ProfileUpdatePage;
