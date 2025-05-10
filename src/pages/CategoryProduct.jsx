import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import productCategory from '../helpers/productCategory'
import SummaryApi from '../common'
import CategoryCard from '../components/CategoryCard'

const CategoryProduct = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [showFilter, setShowFilter] = useState(false) // for mobile toggle
  const navigate = useNavigate()
  const location = useLocation()
  const urlSearch = new URLSearchParams(location.search)
  const urlCategoryListInArray = urlSearch.getAll("category")

  const urlCategoryListInObject = {}
  urlCategoryListInArray.forEach(el => {
    urlCategoryListInObject[el] = true
  })

  const [selectCategory, setSelectCategory] = useState(urlCategoryListInObject)
  const [filterCategoryList, setFilterCategoryList] = useState([])
  const [sortBy, setSortBy] = useState("")

  const fetchData = async () => {
    const response = await fetch(SummaryApi.filterProduct.url, {
      method: SummaryApi.filterProduct.method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ category: filterCategoryList })
    })
    const dataResponse = await response.json()
    setData(dataResponse?.data || [])
  }

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target
    setSelectCategory(prev => ({
      ...prev,
      [value]: checked
    }))
  }

  const handleOnChangeSortBy = (e) => {
    const { value } = e.target
    setSortBy(value)
    if (value === "asc") {
      setData(prev => [...prev].sort((a, b) => a.sellingPrice - b.sellingPrice))
    }
    if (value === "dsc") {
      setData(prev => [...prev].sort((a, b) => b.sellingPrice - a.sellingPrice))
    }
  }

  useEffect(() => {
    fetchData()
  }, [filterCategoryList])

  useEffect(() => {
    const arrayOfCategory = Object.keys(selectCategory).filter(key => selectCategory[key])
    setFilterCategoryList(arrayOfCategory)

    const urlFormat = arrayOfCategory.map(el => `category=${el}`)
    navigate("/product-category?" + urlFormat.join("&"))
  }, [selectCategory])

  return (
    <div className='container mx-auto py-4 px-2'>
      {/* Toggle button on small devices */}
      <div className='lg:hidden flex justify-between items-center mb-4'>
        <h2 className='text-lg font-bold text-blue-600'>Filter Products</h2>
        <button onClick={() => setShowFilter(!showFilter)} className='bg-blue-600 text-white px-4 py-1 rounded-full text-sm'>
          {showFilter ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[200px_auto] gap-4'>
        {/* Filters */}
        <div className={`lg:block ${showFilter ? 'block' : 'hidden'} border border-slate-300 p-2 rounded-lg`}>
          {/* Sort by */}
          <div className='mb-4'>
            <h3 className='text-lg uppercase font-bold text-blue-600 pb-1'>Sort by</h3>
            <form className='text-sm flex flex-col gap-2 py-2'>
              <label className='flex items-center gap-3'>
                <input type="radio" name='sort' value={"asc"} checked={sortBy === "asc"} onChange={handleOnChangeSortBy} className='w-4 h-4 accent-blue-600' />
                <span className='font-bold text-base'>Price - Low to High</span>
              </label>
              <label className='flex items-center gap-3'>
                <input type="radio" name='sort' value={"dsc"} checked={sortBy === "dsc"} onChange={handleOnChangeSortBy} className='w-4 h-4 accent-blue-600' />
                <span className='font-bold text-base'>Price - High to Low</span>
              </label>
            </form>
          </div>

          {/* Filter by Category */}
          <div>
            <h3 className='text-lg uppercase font-bold text-blue-600 pb-1'>Category</h3>
            <form className='text-sm flex flex-col gap-2 py-2'>
              {productCategory.map((cat, index) => (
                <label key={index} className='flex items-center gap-3'>
                  <input type='checkbox' name='category' value={cat.value} id={cat.value} checked={!!selectCategory[cat.value]} onChange={handleSelectCategory} className='w-4 h-4 accent-blue-600' />
                  <span className='font-bold text-base'>{cat.label}</span>
                </label>
              ))}
            </form>
          </div>
        </div>

        {/* Product section */}
        <div>
          <p className='text-blue-600 text-lg font-bold mb-2'>
            Search results: 
            <span className='text-white ml-2 px-4 rounded-xl bg-green-600 text-lg font-bold'>{data.length}</span>
          </p>
          <div className='min-h-[calc(100vh-120px)] overflow-y-scroll max-h-[calc(100vh-120px)] scrollbar-none'>
            {loading && <p className="text-center py-4 text-blue-600 font-semibold">Loading products...</p>}
            {!loading && data.length > 0 && <CategoryCard data={data} loading={loading} />}
            {!loading && data.length === 0 && <p className="text-center py-4 text-green-600 text-lg font-bold">Select Category!</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryProduct
