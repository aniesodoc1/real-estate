import React, { useState } from 'react'
import productCategory from '../helpers/productCategory'
import { FaUpload } from 'react-icons/fa'
import DisplayImage from './DisplayImage'
import { MdDelete } from 'react-icons/md'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import { ImSpinner2 } from 'react-icons/im'
import uploadMedia from '../helpers/uploadMedia'

const UploadProduct = ({ onClose, fetchData }) => {
  const [data, setData] = useState({
    productName: '',
    brandName: '',
    category: '',
    productImage: [],
    productVideo: [],
    description: '',
    price: '',
    sellingPrice: ''
  })

  const [loading, setLoading] = useState(false)
  const [openFullScreenImage, setOpenFullSreenImage] = useState(false)
  const [fullScreenImage, setFullScreenImage] = useState('')

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUploadProductImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const uploadImageCloudinary = await uploadMedia(file)
    setData((prev) => ({
      ...prev,
      productImage: [...prev.productImage, uploadImageCloudinary.url]
    }))
  }

  const handleUploadProductVideo = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const uploadVideoCloudinary = await uploadMedia(file)
    setData((prev) => ({
      ...prev,
      productVideo: [...prev.productVideo, uploadVideoCloudinary.url]
    }))
  }

  const handleDeleteProductImage = (index) => {
    const newProductImage = [...data.productImage]
    newProductImage.splice(index, 1)
    setData((prev) => ({
      ...prev,
      productImage: newProductImage
    }))
  }

  const handleDeleteProductVideo = (index) => {
    const newProductVideo = [...data.productVideo]
    newProductVideo.splice(index, 1)
    setData((prev) => ({
      ...prev,
      productVideo: newProductVideo
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const payload = {
      ...data,
      category: data.category.toLowerCase()
    }
    const response = await fetch(SummaryApi.uploadProduct.url, {
      method: SummaryApi.uploadProduct.method,
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const responseData = await response.json()
    setLoading(false)
    if (responseData.success) {
      fetchData()
      toast.success(responseData.message)
      onClose()
    }
    if (responseData.error) toast.error(responseData.message)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-40 px-2 sm:px-4">
      <div className="bg-gray-950 p-4 rounded-2xl w-full max-w-2xl max-h-[90%] h-full overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-lg">Upload Product</h2>
          <button className="text-white text-2xl font-extrabold cursor-pointer" onClick={onClose}>X</button>
        </div>

        <form className="flex-1 overflow-y-auto grid gap-2 pr-2 custom-scrollbar scroll-smooth" onSubmit={handleSubmit}>
          <label htmlFor="productName">Product Name</label>
          <input type="text" id="productName" name="productName" value={data.productName} onChange={handleOnChange} placeholder="Enter product name" className="p-2 bg-slate-900 rounded" required />

          <label htmlFor="brandName">Brand Name</label>
          <input type="text" id="brandName" name="brandName" value={data.brandName} onChange={handleOnChange} placeholder="Enter brand name" className="p-2 bg-slate-900 rounded" required />

          <label htmlFor="category">Category</label>
          <select name="category" value={data.category} onChange={handleOnChange} className="p-2 bg-slate-900 rounded" required>
            <option value="">Select category</option>
            {productCategory.map((el, index) => <option key={index} value={el.value}>{el.label}</option>)}
          </select>

          <label>Product Image</label>
          <label htmlFor="uploadImageInput">
            <div className="p-2 bg-slate-900 rounded-2xl h-32 w-full flex justify-center items-center cursor-pointer hover:bg-slate-800 transition">
              <div className="flex flex-col items-center gap-2">
                <FaUpload className="text-3xl sm:text-4xl" />
                <p className="text-xs sm:text-sm">Upload Product Image</p>
                <input type="file" accept="image/*" id="uploadImageInput" className="hidden" onChange={handleUploadProductImage} />
              </div>
            </div>
          </label>

          <div className="flex flex-wrap gap-2">
            {data.productImage.length > 0 ? data.productImage.map((el, index) => (
              <div key={index} className="relative group w-20 h-20">
                <img src={el} alt="preview" className="w-full h-full object-cover rounded bg-gray-900 cursor-pointer" onClick={() => { setOpenFullSreenImage(true); setFullScreenImage(el) }} />
                <div className="absolute bottom-0 right-0 bg-red-600 p-1 rounded-full hidden group-hover:block text-white cursor-pointer" onClick={() => handleDeleteProductImage(index)}>
                  <MdDelete size={16} />
                </div>
              </div>
            )) : <p className="text-red-600 text-xs">*Please upload product image</p>}
          </div>

          <label>Product Video</label>
          <label htmlFor="uploadVideoInput">
            <div className="p-2 bg-slate-900 rounded-2xl h-32 w-full flex justify-center items-center cursor-pointer hover:bg-slate-800 transition">
              <div className="flex flex-col items-center gap-2">
                <FaUpload className="text-3xl sm:text-4xl" />
                <p className="text-xs sm:text-sm">Upload Product Video</p>
                <input type="file" accept="video/*" id="uploadVideoInput" className="hidden" onChange={handleUploadProductVideo} />
              </div>
            </div>
          </label>

          <div className="flex flex-wrap gap-2">
            {data.productVideo.length > 0 ? data.productVideo.map((videoUrl, index) => (
              <div key={index} className="relative group w-32 h-20 bg-gray-800 rounded overflow-hidden">
                <video src={videoUrl} controls className="w-full h-full object-cover" />
                <div className="absolute bottom-0 right-0 bg-red-600 p-1 rounded-full hidden group-hover:block text-white cursor-pointer" onClick={() => handleDeleteProductVideo(index)}>
                  <MdDelete size={16} />
                </div>
              </div>
            )) : <p className="text-red-600 text-xs">*Please upload product video</p>}
          </div>

          <label htmlFor="price">Price</label>
          <input type="number" id="price" name="price" value={data.price} onChange={handleOnChange} placeholder="Enter price" className="p-2 bg-slate-900 rounded" required />

          <label htmlFor="sellingPrice">Selling Price</label>
          <input type="number" id="sellingPrice" name="sellingPrice" value={data.sellingPrice} onChange={handleOnChange} placeholder="Enter selling price" className="p-2 bg-slate-900 rounded" required />

          <label htmlFor="description">Description</label>
          <textarea name="description" value={data.description} onChange={handleOnChange} className="bg-slate-900 p-2 rounded h-28 resize-none" placeholder="Describe the product" required rows={3}></textarea>

          <button className="px-3 py-2 bg-blue-800 rounded-xl text-white mb-10 hover:bg-red-700 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50" disabled={loading}>
            {loading ? <ImSpinner2 className="animate-spin" /> : null}
            {loading ? 'Uploading...' : 'Upload Product'}
          </button>
        </form>
      </div>
      {openFullScreenImage && <DisplayImage onClose={() => setOpenFullSreenImage(false)} imgUrl={fullScreenImage} />}
    </div>
  )
}

export default UploadProduct
