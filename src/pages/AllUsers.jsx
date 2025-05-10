import React, { useState } from 'react'
import { useEffect } from 'react'
import SummaryApi from "../common"
import { toast } from "react-toastify"
import moment from "moment"
import { FaUserEdit } from "react-icons/fa";
import ChangeUserRole from '../components/ChangeUserRole'

const AllUsers = () => {
    const [allUsers, setAllUsers] = useState([])
    const [openUpdateRole, setOpenUpdateRole] = useState(false)
    const [updateUserDetails, setUpdateUserDetails] = useState({
      phonenumber : "",
      name : "",
      role : "",
      _id : ""
    })

    const fetchAllUsers = async() =>{
        const fetchData = await fetch(SummaryApi.allUser.url,{
            method : SummaryApi.allUser.method,
            credentials : "include"
        })

        const dataResponse = await fetchData.json()

        if (dataResponse.success){
            setAllUsers(dataResponse.data)
        }

        if (dataResponse.error){
            toast.error(dataResponse.message)
        }

        console.log(dataResponse)
    }

    useEffect(() => {
        fetchAllUsers()
    }, [])
    
  return (
    <div className='pb-4 bg-gray-950 rounded-xl'>

  {/* Table for md and up */}
  <div className='hidden md:block overflow-x-auto'>
    <table className='w-full text-left table-auto border-collapse'>
      <thead className='text-white'>
        <tr>
          <th className='py-3 px-4'>Sr</th>
          <th className='py-3 px-4'>Name</th>
          <th className='py-3 px-4'>Phone Number</th>
          <th className='py-3 px-4'>Role</th>
          <th className='py-3 px-4'>Joined</th>
          <th className='py-3 px-4'>Action</th>
        </tr>
      </thead>
      <tbody className='text-gray-300'>
        {allUsers.map((el, index) => (
          <tr key={index} className='border-t border-gray-700 hover:bg-gray-800'>
            <td className='py-2 px-4'>{index + 1}</td>
            <td className='py-2 px-4'>{el?.name}</td>
            <td className='py-2 px-4'>{el?.phonenumber}</td>
            <td className='py-2 px-4 capitalize'>{el?.role}</td>
            <td className='py-2 px-4'>{moment(el?.createdAt).format("lll")}</td>
            <td className='py-2 px-4'>
              <button
                className='bg-green-700 p-2 rounded-full hover:bg-green-900'
                onClick={() => {
                  setUpdateUserDetails(el);
                  setOpenUpdateRole(true);
                }}
              >
                <FaUserEdit />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Card layout for mobile */}
  <div className='block md:hidden px-4 space-y-4 py-4'>
    {allUsers.map((el, index) => (
      <div
        key={index}
        className='bg-gray-800 p-4 rounded-lg shadow flex flex-col gap-2 text-white'
      >
        <p><span className='font-semibold'>#{index + 1}</span></p>
        <p><span className='text-gray-400'>Name:</span> {el?.name}</p>
        <p><span className='text-gray-400'>Phone:</span> {el?.phonenumber}</p>
        <p><span className='text-gray-400'>Role:</span> <span className='capitalize'>{el?.role}</span></p>
        <p><span className='text-gray-400'>Joined:</span> {moment(el?.createdAt).format("lll")}</p>
        <button
          className='bg-green-700 hover:bg-green-900 px-4 py-2 rounded-full w-fit self-end mt-2'
          onClick={() => {
            setUpdateUserDetails(el);
            setOpenUpdateRole(true);
          }}
        >
          <FaUserEdit />
        </button>
      </div>
    ))}
  </div>

  {/* Modal */}
  {openUpdateRole && (
    <ChangeUserRole
      onClose={() => setOpenUpdateRole(false)}
      name={updateUserDetails.name}
      phonenumber={updateUserDetails.phonenumber}
      role={updateUserDetails.role}
      userId={updateUserDetails._id}
      callFunc={fetchAllUsers}
    />
  )}
</div>

  )
}

export default AllUsers