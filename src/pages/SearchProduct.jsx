import React, { useEffect } from 'react'
import { useLocation } from "react-router-dom"
import SummaryApi from '../common'
import { useState } from 'react'
import VerticalCard from '../components/VerticalCard'


const SearchProduct = () => {
  const query = useLocation()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  console.log(query)

  const fetchProduct = async()=> {
    setLoading(true)
    const response = await fetch(SummaryApi.searchProduct.url + query.search)
    const dataResponse = await response.json()
    setLoading(false)

    setData(dataResponse.data)
  }

  useEffect(() => {
   fetchProduct()
  }, [query])
  
  return (
    <div className='container mx-auto p-4'>
      {
        loading && (
          <p className='text-lg text-center font-bold text-orange-500'>Loading...</p>
        )
      }
      <p className='text-blue-600 text-2xl font-bold mb-2'>Search results : 
        <span className='text-white ml-2 px-4 rounded-xl bg-green-600 text-lg font-bold'>{data.length}</span>
        </p>

      {
        data.length === 0 && !loading && (
          <p className='bg-blue-600 text-lg text-center p-4 font-bold rounded-2xl'>We couldn't find any products for your search.Try searching available product!</p>
        )
      }

      {
        data.length !== 0 && !loading && (
              <VerticalCard loading={loading} data={data}/>
        )
      }
    </div>
  )
}

export default SearchProduct