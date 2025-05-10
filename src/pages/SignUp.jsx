import React from 'react'
import { useState } from 'react';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import imageTobase64 from "../helpers/imageTobase64";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] =useState(false)
  const [loading, setLoading] = useState(false); 
      const [data, setData] = useState({
        name: "",
          phonenumber : "",
          password : "",
          confirmpassword : "",
          profilePic : ""
      });

      const navigate = useNavigate();
      const handleOnChange = (e) => {
          const { name, value } = e.target
  
          setData((preve) => {
              return{
                  ...preve,
                  [name] : value
              }
          })
      }

      const handleUploadPic = async (e) => {
        const file = e.target.files[0]

        const imagePic = await imageTobase64(file)

        setData((preve) => {
          return {
            ...preve,
            profilePic : imagePic
          }
        })
      } 

const handleSubmit = async (e) => {
  e.preventDefault();

  if (data.password !== data.confirmpassword) {
    toast.error("Please check password and confirm password!");
    return;
  }

  try {
    setLoading(true); // disable button

    const dataResponse = await fetch(SummaryApi.signUP.url, {
      method: SummaryApi.signUP.method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      navigate("/login");
      toast.success(dataApi.message);
    } else {
      toast.error(dataApi.message || "Signup failed");
    }
  } catch (error) {
    toast.error("Signup failed. Please check your internet connection.");
  } finally {
    setLoading(false); // re-enable button
  }
};

  return (
    <section id='signup'>
        <div className="mx-auto container p-4">
            <div className="bg-blue-800 p-2 py-5 w-full max-w-sm mx-auto mt-3 rounded-3xl">
                <div className="w-20 h-20 mx-auto relative overflow-hidden rounded-full">
                  <div>
                    <img src={data.profilePic || "/noavatar.jpg"} alt="" className='rounded-full' />
                  </div>
                  <form>
                    <label>
                    <div className="text-xs bg-opacity-80 font-medium text-gray-900 bg-red-500 pb-4 pt-2 cursor-pointer text-center absolute bottom-0 w-full">
                    Upload Photo
                  </div>
                  <input type='file' className='hidden' required onChange={handleUploadPic}/>
                    </label>
                  </form>
                </div>

                <form className='pt-2' onSubmit={handleSubmit}>
                <div className="grid">
                        <label htmlFor="" className='mb-2'>Name</label>
                        <div className='bg-gray-900 p-3 rounded-xl mb-2'>
                        <input type="text" 
                        placeholder='enter your name'
                        name='name'
                        required
                        value={data.name}
                         onChange={handleOnChange} 
                        className='w-full h-full outline-none bg-transparent' />
                        </div>
                    </div>
                    <div className="grid">
                        <label htmlFor="" className='mb-2'>Phone Number</label>
                        <div className='bg-gray-900 p-3 rounded-xl mb-2'>
                        <input type="text" 
                        placeholder='enter your phone number'
                        name='phonenumber'
                        required
                        value={data.phonenumber}
                         onChange={handleOnChange} 
                        className='w-full h-full outline-none bg-transparent' />
                        </div>
                    </div>
                    <div className="div">
                        <label htmlFor="">Password</label>
                        <div className='bg-gray-900 p-3 flex rounded-xl mt-2 mb-2'>
                        <input type={showPassword ? "text" : "password"}
                         placeholder='enter your password' 
                         name='password'
                         required
                         value={data.password}
                          onChange={handleOnChange} 
                         className='w-full h-full outline-none bg-transparent'/>
                        <div className='cursor-pointer text-xl' onClick={() => setShowPassword((preve) => !preve)}>
                            <span>
                                {
                                    showPassword ? (
                            <FaEyeSlash />
                                    )
                                    :
                                    (
                                        <FaEye />
                                    )
                                }
                            </span>
                        </div>
                        </div>
                    </div>

                    <div className="div">
                        <label htmlFor="">Confirm Password</label>
                        <div className='bg-gray-900 p-3 flex rounded-xl mt-2'>
                        <input type={showConfirmPassword ? "text" : "password"}
                         placeholder='enter confirm password' 
                         name='confirmpassword'
                         required
                         value={data.confirmpassword}
                          onChange={handleOnChange} 
                         className='w-full h-full outline-none bg-transparent'/>
                        <div className='cursor-pointer text-xl' onClick={() => setShowConfirmPassword((preve) => !preve)}>
                            <span>
                                {
                                    showPassword ? (
                            <FaEyeSlash />
                                    )
                                    :
                                    (
                                        <FaEye />
                                    )
                                }
                            </span>
                        </div>
                        </div>
                        <Link to={"/forget-password"} className='block w-fit ml-auto hover:text-slate-300 mt-1'>
                        forget password?
                        </Link>
                    </div>
                    <button
                    disabled={loading}
                    className={`${
                      loading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
                    } bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full transition-all mx-auto block mt-2`}
                  >
                    {loading ? "Signing up..." : "Sign Up"}
                  </button>

                </form>
                <p className='my-3'>Already have an account ?
                    <Link to="/login" className='hover:text-gray-400 ml-1 font-bold text-black'>Login</Link>
                </p>
            </div>
        </div>
    </section>
  )
}

export default SignUp