<<<<<<< HEAD
import React from 'react'
import HomePage from './pages/homePage/HomePage'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ListPage from './pages/listPage/ListPage'
import {Layout, RequireAuth} from './pages/layout/Layout'
import SinglePage from './pages/singlePage.jsx/SinglePage'
import ProfilePage from './pages/profilePage/ProfilePage'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import ProfileUpdatePage from './pages/profileUpdatePage/ProfileUpdatePage'
import { singlePageLoader } from './lib/loaders'
import About from './pages/about/About'
import Contact from './pages/contact/Contact'
import Agents from './pages/agent/Agents'
import NewPostPage from './pages/newPostPage/NewPostPage'


const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [{
        path: "/",
        element: <HomePage/>
      },
      {
        path: "/list",
        element: <ListPage/>,
      },
      {
        path: "/:id",
        element: <SinglePage/>,
        loader: singlePageLoader
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Register />,
      },
      {
        path: "/abouts",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/agents",
        element: <Agents />,
      },
    ]
  },
  {
    path: "/",
    element:<RequireAuth/>,
    children: [
      {
        path: "/profile",
        element: <ProfilePage/>
      },
      {
        path: "/profile/update",
        element: <ProfileUpdatePage/>
      },
      {
        path: "/add",
        element: <NewPostPage/>
      }
  ],
  }
  ]);
  return (
    <RouterProvider router={router}/>
=======
import React, { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react'
import SummaryApi from './common'
import Context from './context'
import { useDispatch } from 'react-redux'
import { setUserDetails } from './store/userSlice'

const App = () => {
  const dispatch = useDispatch()
  const [cartProductCount, setCartProductCount] = useState(0)

  const fetchUserDetails = async()=>{
    const dataResponse = await fetch(SummaryApi.current_user.url,{
      method : SummaryApi.current_user.method,
      credentials : "include"
    })
    const dataApi = await dataResponse.json()

    if(dataApi.success){
      dispatch(setUserDetails(dataApi.data))
    }
  }

  const fetchUserAddToCart = async()=>{
    const dataResponse = await fetch(SummaryApi.addToCartProductCount.url,{
      method : SummaryApi.addToCartProductCount.method,
      credentials : "include"
    })
    const dataApi = await dataResponse.json()
    setCartProductCount(dataApi?.data?.count)
  }

  useEffect(() => {
    fetchUserDetails()
    fetchUserAddToCart()
  }, [])
  
  return (
    <>
    <Context.Provider value={{
      fetchUserDetails,
      cartProductCount,
      fetchUserAddToCart
    }}>
    <ToastContainer
    position='top-center'
     />
    <Header/>
    <main className='min-h-[calc(100vh-110px)] pt-16'>
    <Outlet/>
    </main>
    <Footer/>
    </Context.Provider>
    </>
>>>>>>> 22ae305 (5commit)
  )
}

export default App