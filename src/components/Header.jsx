import React, { useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from "../common"
import { toast } from "react-toastify"
import { setUserDetails } from "../store/userSlice"
import ROLE from '../common/role';
import { useContext } from 'react';
import Context from '../context';

const Header = () => {
    const user = useSelector(state => state?.user?.user)
    const dispatch = useDispatch()
    const [menuDisplay, setMenuDisplay] = useState(false)
    const context = useContext(Context)
    const navigate = useNavigate()
    const searchInput = useLocation()
    const URLSearch = new URLSearchParams(searchInput?.search)
    const searchQuery = URLSearch.getAll("q")
    const [search, setSearch] = useState(searchQuery)

    const handleLogout = async () => {
        const fetchData = await fetch(SummaryApi.logout_user.url, {
            method : SummaryApi.logout_user.method,
            credentials : "include"
        })

        const data = await fetchData.json()

        if(data.success){
            dispatch(setUserDetails(null))
            toast.success(data.message)
            navigate("/")
        }

        if(data.error){
            toast.error(data.message)
        }
    }

    const handleSearch = (e)=>{
        const { value } = e.target

        setSearch(value)
        if(value){
            navigate(`/search?q=${value}`)
        } else {
            navigate("/search")
        }
    }

  return (
    <header className='h-16 shadow-md shadow-white/5 bg-black/100 backdrop-blur-lg px-4 fixed w-full z-50 '>
        <div className='container mx-auto h-full flex items-center justify-between'>
            <Link to="/" className='flex gap-2 items-center'>
                <img src='/logo.png' alt='' className='h-9 w-9 rounded-2xl'/>
                <p className='font-bold text-xl'>Frank Mosco</p>
            </Link>

            <div className='hidden lg:flex items-center w-full justify-between max-w-sm border-2 border-blue-800 rounded-full focus-within:shadow pl-2'>
                <input type="text" placeholder='Search product here...' className='w-full outline-none' onChange={handleSearch} value={search}/>
                <div className='text-lg min-w-[50px] h-8 bg-blue-800 flex items-center justify-center rounded-r-full text-white'>
                    <IoSearch />
                </div>
                </div>



            <div className="flex items-center gap-6">
                <div className='relative group flex justify-center'>
                {
                    user?._id && (
                        <div className="text-3xl cursor-pointer text-blue-800" onClick={()=>setMenuDisplay(preve => !preve)} >
                    {
                        user?.profilePic ? (
                            <img src={user?.profilePic} alt='' className='w-10 h-10 rounded-full'/>
                        ) : (
                            <FaCircleUser />
                        )
                    }
                </div>
                    )
                }
               {
                menuDisplay && (
                    <div className='absolute bottom-0 top-11 h-fit p-2 shadow-lg rounded bg-green-600'>
                    <nav>
                        {
                            user?.role === ROLE.ADMIN && (
                                <Link to="/admin-panel/all-products" className='whitespace-nowrap hover:bg-green-700 text-black p-2' onClick={()=>setMenuDisplay(preve => !preve)}>Admin panel</Link>
                            )
                        }
                    </nav>
                </div>
                )
               }
                </div>

                {
                user?._id && (
                <Link to={"/cart"} className="text-2xl relative">
                <span className='text-blue-700'><FaShoppingCart /></span>
                <div className='bg-red-600 absolute -top-2 -right-3 z-10 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center'>
                    <p className='text-sm'>{context?.cartProductCount}</p>
                </div>
                </Link>
                )
                }

                <div>
                    {
                        user?._id ? (
                            <button onClick={handleLogout} className='px-6 py-2 rounded-full text-white bg-blue-800 hover:bg-red-600 cursor-pointer'>Logout</button>
                        )
                        :
                        (
                            <Link to="/login" className='px-6 py-2 rounded-full text-white bg-blue-800 hover:bg-green-600 cursor-pointer'>Login</Link>
                        )
                    }
                </div>
            </div>
        </div>
    </header>
  )
}

export default Header