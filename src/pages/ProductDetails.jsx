import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import SummaryApi from '../common'
import { FaStar } from "react-icons/fa";
import { FaStarHalfStroke } from "react-icons/fa6";
import displayNGCurrency from '../helpers/displayCurrency'
import VerticalCardProduct from '../components/VerticalCardProduct';
import scrollTop from '../helpers/scrollTop';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import Map from '../components/Map';

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    productVideo: [],
    description: "",
    price: "",
    sellingPrice: ""
  })

  const params = useParams()
  const [loading, setLoading] = useState(false)
  const productImageListLoading = new Array(4).fill(null)

  const [activePreview, setActivePreview] = useState("") // image or video url
  const [previewType, setPreviewType] = useState("image") // 'image' | 'video'

  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({ x: 0, y: 0 })
  const [zoomImage, setZoomImage] = useState(false)
  const { fetchUserAddToCart } = useContext(Context)
  const navigate = useNavigate()

  const fetchProductDetails = async () => {
    setLoading(true)
    const response = await fetch(SummaryApi.productDetails.url, {
      method: SummaryApi.productDetails.method,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        productId: params?.id
      })
    })
    setLoading(false)
    const dataResponse = await response.json()
    setData(dataResponse?.data)
    // set default preview (video if exists, else first image)
    if (dataResponse?.data?.productVideo?.length > 0) {
      setActivePreview(dataResponse.data.productVideo[0])
      setPreviewType("video")
    } else if (dataResponse?.data?.productImage?.length > 0) {
      setActivePreview(dataResponse.data.productImage[0])
      setPreviewType("image")
    }
  }

  useEffect(() => {
    fetchProductDetails()
  }, [params])

  const handleZoomImage = useCallback((e) => {
    setZoomImage(true)
    const { left, top, width, height } = e.target.getBoundingClientRect()
    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height
    setZoomImageCoordinate({ x, y })
  }, [])

  const handleLeaveImageZoom = () => {
    setZoomImage(false)
  }

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id)
    fetchUserAddToCart()
  }

  const handleBuyProduct = async (e, id) => {
    await addToCart(e, id)
    fetchUserAddToCart()
    navigate("/cart")
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='min-h-[200px] flex flex-col lg:flex-row gap-4'>
        {/* product preview */}
        <div className='h-96 flex flex-col lg:flex-row-reverse gap-4'>
          <div className='h-[300px] w-[300px] lg:w-96 lg:h-96 rounded-xl bg-slate-200 relative'>
            {/* active preview */}
            {previewType === "video" ? (
              <video
                src={activePreview}
                controls
                className='h-full w-full object-scale-down rounded-xl cursor-pointer mix-blend-multiply'
              />
            ) : (
              <img
                src={activePreview}
                className='h-full w-full object-scale-down rounded-xl cursor-pointer mix-blend-multiply'
                alt=""
                onMouseMove={handleZoomImage}
                onMouseLeave={handleLeaveImageZoom}
              />
            )}

            {/* image zoom */}
            {previewType === "image" && zoomImage && (
              <div className='hidden lg:block absolute rounded-xl overflow-hidden min-w-[500px] z-50 min-h-[400px] bg-slate-300 p-1 -right-[510px] top-0'>
                <div
                  className='w-full h-full min-h-[400px] rounded-2xl min-w-[500px] mix-blend-multiply scale-100'
                  style={{
                    backgroundImage: `url(${activePreview})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`
                  }}
                ></div>
              </div>
            )}
          </div>

          {/* thumbnails */}
          <div className='h-full'>
            {loading ? (
              <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                {productImageListLoading.map((el, index) => (
                  <div className='h-20 w-20 bg-slate-200 animate-pulse rounded' key={"loadingImageDetails" + index}></div>
                ))}
              </div>
            ) : (
              <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                {/* video thumbnail */}
                {data?.productVideo && data.productVideo.length > 0 && (
                  <div className='h-20 w-20 bg-slate-200 p-1 rounded-xl'>
                    <video
                      src={data.productVideo[0]}
                      className='w-full h-full rounded-xl object-scale-down mix-blend-multiply cursor-pointer'
                      onMouseEnter={() => {
                        setActivePreview(data.productVideo[0])
                        setPreviewType("video")
                        setZoomImage(false)
                      }}
                      onClick={() => {
                        setActivePreview(data.productVideo[0])
                        setPreviewType("video")
                        setZoomImage(false)
                      }}
                      muted
                    />
                  </div>
                )}

                {/* image thumbnails */}
                {data?.productImage?.map((imgUrl) => (
                  <div className='h-20 w-20 bg-slate-200 p-1 rounded-xl' key={imgUrl}>
                    <img
                      src={imgUrl}
                      alt=""
                      className='w-full h-full rounded-xl object-scale-down mix-blend-multiply cursor-pointer'
                      onMouseEnter={() => {
                        setActivePreview(imgUrl)
                        setPreviewType("image")
                      }}
                      onClick={() => {
                        setActivePreview(imgUrl)
                        setPreviewType("image")
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* product details */}
        {loading ? (
          <div className='grid gap-1 w-90 lg:w-100'>
            <p className='bg-slate-200 animate-pulse h-6 rounded-full inline-block'></p>
            <h2 className='text-2xl lg:text-4xl font-medium bg-slate-200 animate-pulse rounded-full h-6'></h2>
            <p className='capitalize text-slate-400 bg-slate-200 min-w-[100px] animate-pulse rounded-full h-6'></p>
            <div className='text-red-600 flex items-center gap-1 bg-slate-200 animate-pulse rounded-full h-6'></div>
            <div className='items-center flex gap-2 font-medium text-2xl lg:text-3xl my-1 bg-slate-200 animate-pulse rounded-full h-6'></div>
            <div className='flex gap-1'>
              <button className='bg-slate-200 rounded-full animate-pulse h-6'></button>
              <button className='bg-slate-200 rounded-full animate-pulse h-6'></button>
            </div>
          </div>
        ) : (
          <div className='flex flex-col gap-1 mt-2'>
            <p className='bg-red-200 text-red-600 px-2 rounded-full inline-block w-fit'>{data?.brandName}</p>
            <h2 className='text-2xl lg:text-4xl font-medium'>{data?.productName}</h2>
            <p className='capitalize text-slate-400'>{data?.category}</p>
            <div className='text-red-600 flex items-center gap-1'>
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfStroke />
            </div>
            <div className='items-center flex gap-2 font-medium text-2xl lg:text-3xl my-1'>
              <p className='text-blue-600'>{displayNGCurrency(data?.sellingPrice)}</p>
              <p className='text-slate-400 line-through'>{displayNGCurrency(data?.price)}</p>
            </div>
            <div className='flex items-center gap-3 my-2'>
              <button className='bg-red-600 rounded px-3 py-2 min-w-[120px] cursor-pointer' onClick={(e) => handleBuyProduct(e, data?._id)}>Buy</button>
              <button className='bg-red-600 rounded px-3 py-2 min-w-[120px] cursor-pointer' onClick={(e) => handleAddToCart(e, data?._id)}>Add To Cart</button>
            </div>
            <div>
              <p className='text-white font-medium my-1'>Description</p>
              <p className='text-slate-300'>{data?.description}</p>
            </div>
          </div>
        )}

        <Map data={data} />
      </div>

      {data?.category && (
        <VerticalCardProduct category={data?.category} heading={"Recommended Product"} onScrollTop={scrollTop} />
      )}
    </div>
  )
}

export default ProductDetails
