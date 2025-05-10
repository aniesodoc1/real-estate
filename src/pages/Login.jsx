import React, { useContext } from 'react'
import { useState } from 'react';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import Context from '../context';
import { useSelector } from 'react-redux';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        phonenumber : "",
        password : ""
    })
    const navigate = useNavigate();
    const { fetchUserDetails,fetchUserAddToCart } = useContext(Context)
    const user = useSelector(state => state?.user?.user)

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return{
                ...preve,
                [name] : value
            }
        })
    }

const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
        const dataResponse = await fetch(SummaryApi.signIN.url, {
            method : SummaryApi.signIN.method,
            credentials : "include",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify(data)
        })

        const dataApi = await dataResponse.json()

        if (dataApi.success){
            toast.success(dataApi.message)
            fetchUserDetails()
            fetchUserAddToCart()
            navigate("/")
        } else if (dataApi.error){
            toast.error(dataApi.message)
        }
    } catch (error) {
        console.error("Login error:", error)
        toast.error("No internet connection, login failed.")
    } finally {
        setLoading(false)
    }
}

  return (
    <section id='login'>
        <div className="mx-auto container p-4">
            <div className="bg-blue-800 p-2 py-5 w-full max-w-sm mx-auto mt-3 rounded-3xl">
                <div className="w-20 h-20 mx-auto">
                    <img src= "/signin.gif" alt="" className='rounded-full' />
                </div>

                <form className='pt-6' onSubmit={handleSubmit}>
                    <div className="grid">
                        <label htmlFor="" className='mb-2'>Phone Number</label>
                        <div className='bg-gray-900 p-3 rounded-xl mb-2'>
                        <input type="phonenumber" 
                        placeholder='enter your phone number'
                        name='phonenumber'
                        value={data.phonenumber}
                         onChange={handleOnChange} 
                         autoFocus
                        className='w-full h-full outline-none bg-transparent' />
                        </div>
                    </div>
                    <div className="div">
                        <label htmlFor="">Password</label>
                        <div className='bg-gray-900 p-3 flex rounded-xl mt-2'>
                        <input type={showPassword ? "text" : "password"}
                         placeholder='enter your password' 
                         name='password'
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
                        <Link to={"/forget-password"} className='block w-fit ml-auto hover:text-slate-300 mt-1'>
                        forget password
                        </Link>
                    </div>
                    <button
                        disabled={loading}
                        className={`${
                            loading ? "bg-gray-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                        } text-white px-6 py-2 w-full max-w-[150px] cursor-pointer rounded-full hover:scale-110 transition-all mx-auto block mt-2`}
                        >
                        {loading ? "Logging in..." : "Login"}
                        </button>
                </form>
                <p className='my-5'>Don't have account ?
                    <Link to="/sign-up" className='hover:text-gray-400 ml-1 font-bold text-black'>Sign up</Link>
                </p>
            </div>
        </div>
    </section>
  )
}

export default Login