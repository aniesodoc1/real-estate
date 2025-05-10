import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { Link } from 'react-router-dom'

const CategoryList = () => {
  const [categoryProduct, setCategoryProduct] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const categoryLoading = new Array(13).fill(null)

  const fetchCategoryProduct = async () => {
    setLoading(true)
    try {
      const response = await fetch(SummaryApi.categoryProduct.url)
      if (!response.ok) {
        throw new Error("Something went wrong while fetching categories.");
      }
      const dataResponse = await response.json()
      setCategoryProduct(dataResponse?.data || [])
    } catch (err) {
      console.error("Fetch error:", err)
      setCategoryProduct([])
      setError("Failed to load categories,Please check your internet connection and refresh!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategoryProduct()
  }, [])

  return (
    <div className='container mx-auto p-4'>
      {error && (
        <div className="mb-4">
        <p className="text-red-500 text-sm bg-red-100 border border-red-300 p-2 rounded">
          {error}
        </p>
      </div>
      )}
      <div className='flex items-center gap-4 justify-between overflow-scroll scrollbar-none'>
        {loading ? (
          categoryLoading.map((_, index) => (
            <div
              key={"categoryLoading" + index}
              className='h-16 w-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-slate-200 animate-pulse'
            />
          ))
        ) : (
          categoryProduct.map((product, index) => (
            <Link
              to={"/product-category?category=" + product?.category}
              className='cursor-pointer'
              key={product?.category}
            >
              <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200 flex items-center justify-center'>
                <img
                  src={product?.productImage[0]}
                  alt=""
                  className='h-full object-scale-down mix-blend-multiply rounded-sm hover:scale-125 transition-all'
                />
              </div>
              <p className='text-center capitalize text-sm md:text-base text-slate-200'>
                {product?.category}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

export default CategoryList
