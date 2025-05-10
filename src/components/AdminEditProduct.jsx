import React, { useState } from 'react'
import productCategory from '../helpers/productCategory'
import { FaUpload } from "react-icons/fa"
import uploadMedia from '../helpers/uploadMedia'
import DisplayImage from './DisplayImage'
import { MdDelete } from "react-icons/md"
import SummaryApi from '../common'
import { toast } from "react-toastify"

const AdminEditProduct = ({ onClose, productData, fetchdata }) => {
  const [data, setData] = useState({
    ...productData,
    productName: productData?.productName,
    brandName: productData?.brandName,
    category: productData?.category,
    productImage: productData?.productImage || [],
    productVideo: productData?.productVideo || [],
    description: productData?.description,
    price: productData?.price,
    sellingPrice: productData?.sellingPrice
  })

  const [openFullScreenImage, setOpenFullSreenImage] = useState(false)
  const [fullScreenImage, setFullScreenImage] = useState("")

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const uploadResponse = await uploadMedia(file)

    if (file.type.startsWith("video/")) {
      setData(prev => ({
        ...prev,
        productVideo: [...prev.productVideo, uploadResponse.url]
      }))
    } else {
      setData(prev => ({
        ...prev,
        productImage: [...prev.productImage, uploadResponse.url]
      }))
    }
  }

  const handleDeleteProductImage = (index) => {
    const newProductImage = [...data.productImage]
    newProductImage.splice(index, 1)
    setData(prev => ({ ...prev, productImage: newProductImage }))
  }

  const handleDeleteProductVideo = (index) => {
    const newProductVideo = [...data.productVideo]
    newProductVideo.splice(index, 1)
    setData(prev => ({ ...prev, productVideo: newProductVideo }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch(SummaryApi.updateProduct.url, {
      method: SummaryApi.updateProduct.method,
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data)
    })
    const responseData = await response.json()

    if (responseData.success) {
      fetchdata()
      toast.success(responseData?.message)
      onClose()
    }

    if (responseData.error) {
      toast.error(responseData?.message)
    }
  }

  return (
    <div className='fixed w-full h-full top-0 left-0 flex justify-center items-center bg-black bg-opacity-50'>
      <div className='bg-gray-950 p-4 rounded-2xl w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
        <div className='flex justify-between items-center'>
          <h2 className='font-bold text-lg'>Edit Product</h2>
          <button className='text-white text-2xl font-extrabold cursor-pointer' onClick={onClose}>X</button>
        </div>

        <form className="grid p-4 gap-2 overflow-scroll h-full pb-5 scroll-smooth custom-scrollbar" onSubmit={handleSubmit}>
          <label htmlFor="productName">Product Name</label>
          <input type="text" id='productName' name="productName" value={data.productName} onChange={handleOnChange} className='p-2 bg-slate-900 rounded' required />

          <label htmlFor="brandName">Brand Name</label>
          <input type="text" id='brandName' name="brandName" value={data.brandName} onChange={handleOnChange} className='p-2 bg-slate-900 rounded' required />

          <label htmlFor="category">Category</label>
          <select name="category" value={data.category} required onChange={handleOnChange} className='p-2 bg-slate-900 rounded'>
            <option value="">Select category</option>
            {productCategory.map((el, index) => (
              <option value={el.value} key={el.value + index}>{el.label}</option>
            ))}
          </select>

          <label htmlFor="productMedia">Product Media (Image / Video)</label>
          <label htmlFor='uploadImageInput'>
            <div className='p-2 bg-slate-900 rounded-2xl h-32 w-full flex justify-center items-center cursor-pointer'>
              <div className='flex justify-center items-center flex-col gap-2'>
                <span className='text-4xl'> <FaUpload /></span>
                <p className='text-sm'>Upload Image or Video</p>
                <input type="file" id='uploadImageInput' accept="image/*,video/*" className='hidden' onChange={handleUploadProduct} />
              </div>
            </div>
          </label>

          {/* Display Uploaded Images */}
          <div className='flex flex-wrap gap-2 mt-2'>
            {data.productImage.length > 0 ? data.productImage.map((el, index) => (
              <div className='relative group' key={index}>
                <img src={el} alt="product media" className='bg-gray-900 h-20 w-20 cursor-pointer' onClick={() => { setOpenFullSreenImage(true); setFullScreenImage(el) }} />
                <div className='text-white hidden bg-red-600 rounded-full group-hover:block cursor-pointer absolute bottom-0 right-0' onClick={() => handleDeleteProductImage(index)}>
                  <MdDelete />
                </div>
              </div>
            )) : (
              <p className='text-red-600 text-xs'>*Please upload product images</p>
            )}
          </div>

          {/* Display Uploaded Videos */}
          <div className='flex flex-wrap gap-2 mt-2'>
            {data.productVideo.length > 0 ? data.productVideo.map((el, index) => (
              <div className='relative group' key={index}>
                <video src={el} controls width={80} height={80} className='rounded bg-gray-900' />
                <div className='text-white hidden bg-red-600 rounded-full group-hover:block cursor-pointer absolute bottom-0 right-0' onClick={() => handleDeleteProductVideo(index)}>
                  <MdDelete />
                </div>
              </div>
            )) : (
              <p className='text-red-600 text-xs'>*Please upload product videos</p>
            )}
          </div>

          <label htmlFor="price">Price</label>
          <input type="number" id='price' name="price" value={data.price} onChange={handleOnChange} className='p-2 bg-slate-900 rounded' required />

          <label htmlFor="sellingPrice">Selling Price</label>
          <input type="number" id='sellingPrice' name="sellingPrice" value={data.sellingPrice} onChange={handleOnChange} className='p-2 bg-slate-900 rounded' required />

          <label htmlFor="description">Description</label>
          <textarea name="description" className='bg-slate-900 p-1 h-28 resize-none rounded' onChange={handleOnChange} value={data.description} placeholder='Describe the product' rows={3} required></textarea>

          <button className='px-3 py-2 bg-blue-800 rounded-xl text-white mb-10 hover:bg-red-700 cursor-pointer'>Update Product</button>
        </form>
      </div>

      {openFullScreenImage && <DisplayImage onClose={() => setOpenFullSreenImage(false)} imgUrl={fullScreenImage} />}
    </div>
  )
}

export default AdminEditProduct
