import React, { useState } from 'react'
import ROLE from '../common/role'
import SummaryApi from '../common'
import { toast } from 'react-toastify'

const ChangeUserRole = ({name, phonenumber, role, userId, onClose, callFunc}) => {
    const [userRole, setUserRole] = useState(role)

    const handleOnChangeSelect = (e) =>{
        setUserRole(e.target.value)
    }

    const updateUserRole = async () => {
        const fetchResponse = await fetch(SummaryApi.updateUser.url,{
            method : SummaryApi.updateUser.method,
            credentials : "include",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({
                userId : userId,
                role : userRole
            })
        })

        const responseData = await fetchResponse.json()

        if(responseData.success){
            callFunc()
            toast.success(responseData.message)
            onClose()
        }
        console.log(responseData)
    }
  return (
    <div className='fixed w-full top-0 bottom-0 right-0 left-0 h-full z-10 flex justify-between items-center'>
        <div className='mx-auto bg-gray-950 shadow-md p-4 w-full max-w-sm'>
            <button className='block ml-auto text-red-700 text-2xl font-extrabold cursor-pointer' onClick={onClose}>X</button>
        <h1 className='pb-2 text-lg font-medium'>change user role</h1>
        <p>name : {name}</p>
        <p>Phone number : {phonenumber}</p>
        <div className='flex items-center justify-between my-4'>
            <p>Role :</p>
            <select name="" id="" className='border px-4 py-1' value={userRole} onChange={handleOnChangeSelect}>
            {
                Object.values(ROLE).map(el => {
                    return(
                        <option value={el} key={el}>{el}</option>
                    )
                })
            }
        </select>
        </div>
       <button className='w-fit mx-auto block py-1 px-3 rounded-full bg-red-700 text-white hover:bg-red-800 cursor-pointer' onClick={updateUserRole}>Change Role</button>
        </div>
    </div>
  )
}

export default ChangeUserRole