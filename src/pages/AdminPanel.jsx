import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaBars, FaCircleUser, FaXmark } from "react-icons/fa6"
import { Link, Outlet, useNavigate } from "react-router-dom"
import ROLE from '../common/role'

const AdminPanel = () => {
  const user = useSelector(state => state?.user?.user)
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (user?.role !== ROLE.ADMIN) {
      navigate("/")
    }
  }, [user])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-[calc(100vh-100px)] flex">
      {/* Sidebar for large screens */}
      <aside className="hidden md:flex w-60 border-r border-slate-300 text-white flex-col justify-between p-4">
        <div>
          <div className="h-40 flex flex-col justify-center items-center">
            <div className="text-5xl text-blue-500 mb-2">
              {user?.profilePic ? (
                <img src={user.profilePic} alt="" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <FaCircleUser />
              )}
            </div>
            <p className="capitalize text-lg font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>

          <nav className="grid gap-2 mt-4">
            <Link to={"all-users"} className="px-3 py-2 rounded-2xl bg-gray-950 text-center font-bold hover:bg-gray-900 transition">
              All Users
            </Link>
            <Link to={"all-products"} className="px-3 py-2 rounded-2xl bg-gray-950 text-center font-bold hover:bg-gray-900 transition">
              All Products
            </Link>
          </nav>
        </div>

        <div className="text-center text-sm text-gray-500 mt-6">
          Admin Panel © 2025
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-black text-white flex items-center justify-between p-4 z-50">
        <p className="text-lg font-bold">Admin Panel</p>
        <button onClick={toggleSidebar} className="text-2xl">
          {isSidebarOpen ? <FaXmark /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar Drawer for mobile */}
      {isSidebarOpen && (
        <>
          <aside className="fixed top-0 left-0 w-60 h-full bg-blue-900 text-white z-50 flex flex-col justify-between p-4 md:hidden transition-transform">
            <div>
              <div className="h-40 flex flex-col justify-center items-center">
                <div className="text-5xl text-blue-500 mb-2">
                  {user?.profilePic ? (
                    <img src={user.profilePic} alt="" className="w-20 h-20 rounded-full object-cover" />
                  ) : (
                    <FaCircleUser />
                  )}
                </div>
                <p className="capitalize text-lg font-semibold">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.role}</p>
              </div>

              <nav className="grid gap-2 mt-4">
                <Link
                  to={"all-users"}
                  className="px-3 py-2 rounded-2xl bg-gray-950 text-center font-bold hover:bg-gray-900 transition"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  All Users
                </Link>
                <Link
                  to={"all-products"}
                  className="px-3 py-2 rounded-2xl bg-gray-950 text-center font-bold hover:bg-gray-900 transition"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  All Products
                </Link>
              </nav>
            </div>

            <div className="text-center text-sm text-gray-300 mt-6">
              Admin Panel © 2025
            </div>
          </aside>

          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 mt-[20px] md:mt-0">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminPanel
