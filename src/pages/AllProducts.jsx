import React, { useEffect } from 'react'
import { useState } from 'react'
import UploadProduct from '../components/UploadProduct'
import SummaryApi from '../common'
import AdminProductCard from '../components/AdminProductCard'

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false)
  const [allProduct, setAllProduct] = useState([])

  const fetchAllProduct = async() => {
    const response = await fetch(SummaryApi.allProduct.url)
    const dataResponse = await response.json()

    console.log(dataResponse)
    setAllProduct(dataResponse?.data || [])
  }

  useEffect(() => {
   fetchAllProduct()
  }, [])
  
  return (
    <div>
    <div className='bg-gray-950 py-2 px-4 flex justify-between items-center'>
      <h2 className='font-bold text-lg'>All Products</h2>
      <button className=' hover:bg-green-600 hover:text-white py-2 px-3 rounded-full cursor-pointer bg-red-600 text-white transition-all' onClick={() =>{setOpenUploadProduct(true)}}>Upload product</button>
    </div>

    <div className='flex items-center flex-wrap h-[calc(100vh-180px)] overflow-y-scroll scroll-smooth scrollbar-none custom-scrollbar gap-5 py-4'>
      {
        allProduct.map((product,index) => {
          return(
            <AdminProductCard data={product} key={index+"allProduct"} fetchdata={fetchAllProduct}/>
          )
        })
      }
    </div>
    {
      openUploadProduct && (
        <UploadProduct onClose={()=>setOpenUploadProduct(false)} fetchData={fetchAllProduct}/>
      )
    }
    </div>
  )
}

export default AllProducts