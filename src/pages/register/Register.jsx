import "./Register.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"
import { useContext, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";


const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {updateUser} = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    const formData = new FormData(e.target);

    const phonenumber = formData.get("phonenumber")
    const email = formData.get ("email")
    const password = formData.get("password")

    try{
      const res = await apiRequest.post("/auth/register", {
        phonenumber,email,password
      })

      updateUser(res.data.user)
      console.log(updateUser)
      navigate("/list");
    }catch (err){
      console.log(err)
      setError(err.response.data.message)
    } finally{
      setIsLoading(false);
    }
  }

  return (
    <div className="registerPage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="phonenumber" type="text" placeholder="phonenumber" />
          <input name="email" type="text" placeholder="Email" />
          <input name="password" type="password" placeholder="Password" />
          <button disabled={isLoading}>Register</button>
          {error && <span>{error}</span>}
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
      <video autoPlay loop muted >
            <source src="/bg-video2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

export default Register;
