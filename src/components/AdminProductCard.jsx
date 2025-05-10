import React, { useState } from 'react'
import { FaUserEdit } from "react-icons/fa";
import AdminEditProduct from './AdminEditProduct';
import displayNGCurrency from '../helpers/displayCurrency';
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const AdminProductCard = ({ data, fetchdata }) => {
    const [editProduct, setEditProduct] = useState(false)

    const deleteProduct = async () => {
      try {
        const response = await fetch(SummaryApi.deleteProduct.url, {
          method: SummaryApi.deleteProduct.method,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: data._id }),
        });
    
        const responseData = await response.json();
    
        if (responseData.success) {
          toast.success("Product deleted successfully");
          fetchdata(); // Refresh the product list
        } else {
          toast.error(responseData.message || "Failed to delete product");
        }
      } catch (error) {
        toast.error("Something went wrong");
        console.error(error);
      }
    };
    
  return (
    <div className='bg-slate-900 p-4 rounded-xl'>
    <div className='w-40 '>
      <div className='w-38 h-32 flex justify-center items-center'>
    <img src={data?.productImage[0]} width={100} height={100} alt="" className='rounded-xl w-full object-fill h-full mx-auto' />
      </div>
    <div className='flex mt-1'>
    <h1 className='text-ellipsis line-clamp-1'>{data?.productName}</h1>
    <div className='w-fit ml-auto p-1 bg-green-600 rounded-full hover:bg-red-600 cursor-pointer' onClick={()=>setEditProduct(true)}>
    <FaUserEdit/>
    </div>
    </div>
    <div className='flex py-1'>
    <p className='font-bold'>{displayNGCurrency(data?.sellingPrice)}</p>
    <span className='ml-auto  p-1 w-fit text-red-600 cursor-pointer' onClick={deleteProduct}>
    <MdDelete />
    </span>
    </div>
    </div>
    {
        editProduct && (
            <AdminEditProduct productData={data} onClose={()=>setEditProduct(false)} fetchdata={fetchdata}/>
        )
    }
  </div>
  )
}

export default AdminProductCard