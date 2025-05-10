import { useContext, useState } from "react";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss"
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  
   const {updateUser} = useContext(AuthContext);
  
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    const formData = new FormData(e.target);

    const phonenumber = formData.get("phonenumber")
    const password = formData.get("password")

    try{

      const res = await apiRequest.post("/auth/login", {
        phonenumber,
        password
      });

      updateUser(res.data.user)
      
     navigate("/list")
    }catch (err){
      setError(err.response.data.message)
    } finally {
      setIsLoading(false);
    }
  }

 
  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input
            name="phonenumber"
            required
            minLength={3}
            maxLength={20}
            type="text"
            placeholder="phonenumber"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
          />
          <button disabled={isLoading}>Login</button>
          {error && <span>{error}</span>}
          <Link to="/signup">Don't you have an account?</Link>
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

export default Login;
