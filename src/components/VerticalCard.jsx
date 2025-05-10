import React from 'react'
import scrollTop from '../helpers/scrollTop'
import displayNGCurrency from '../helpers/displayCurrency'
import Context from '../context'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6'

const VerticalCard = ({loading,data = []}) => {
    const loadingList =  new Array(13).fill(null)
    const { fetchUserAddToCart } = useContext(Context)
    const scrollElement = useRef()

    const handleAddToCart = async(e,id)=> {
        await addToCart(e,id)
        fetchUserAddToCart()
    }
    const scrollRight = () => {
        scrollElement.current.scrollLeft += 300
    }

     
    const scrollLeft = () => {
        scrollElement.current.scrollLeft -= 300
    }
  return (
<div className='items-center flex gap-4 md:gap-6 overflow-scroll scrollbar-none transition-all' ref={scrollElement}>
    <button className='bg-white text-black text-2xl shadow-md rounded-full p-2 absolute left-0 cursor-pointer' onClick={scrollLeft}><FaCircleChevronLeft/></button>
    <button className='bg-white text-black text-2xl shadow-md rounded-full p-2 absolute right-0 cursor-pointer' onClick={scrollRight}><FaCircleChevronRight/></button>
{
loading ?(
    loadingList.map((product,index) => {
        return (
            <div className='w-full rounded-xl min-w-[300px] md:min-w-[340px] max-w-[300px] md:max-w-[340px] shadow-md'>
            <div className='bg-slate-200 rounded-xl h-full p-4 min-w-[120px] md:min-w-[145px] flex items-center justify-center animate-pulse'>
            <img src={null}
                 alt=""
                 className='object-scale-down h-100 rounded-xl hover:scale-120 transition-all mix-blend-multiply animate-pulse bg-slate-200 p-2'/>
            </div>
            <div className='p-1 grid w-full gap-2'>
                <h2 className='text-black font-bold md:text-lg text-base text-ellipsis line-clamp-1 animate-pulse rounded-full bg-slate-200 p-2 py-4'></h2>
                <p className='capitalize text-slate-500 animate-pulse rounded-full bg-slate-200 p-2 py-4'></p>
                <div className='flex gap-1'>
                    <p className='text-red-600 font-medium animate-pulse rounded-full bg-slate-200 p-2 w-full py-4'></p>
                    <p className='text-slate-500 line-through animate-pulse rounded-full bg-slate-200 p-2 w-full py-4'></p>
                </div>
                <button className=' rounded-full px-3 py-4 mt-1 animate-pulse bg-slate-200 p-2'></button>
            </div>
        </div>
        )
    }
)
) : (
    data.map((product,index) => {
        return (
            <Link to={"/product/"+ product?._id} className='w-full rounded-xl min-w-[300px] md:min-w-[340px] max-w-[300px] md:max-w-[340px] bg-white shadow-md' onClick={scrollTop}>
            <div className='bg-slate-200 rounded-xl h-full p-4 min-w-[120px] md:min-w-[145px] flex items-center justify-center'>
                <img src={product.productImage[0]}
                 alt=""
                 className='object-scale-down h-60 lg:h-80 rounded-2xl hover:scale-120 transition-all mix-blend-multiply'/>
            </div>
            <div className='p-4 grid'>
                <h2 className='text-black font-bold md:text-lg text-base text-ellipsis line-clamp-1'>{product?.productName}</h2>
                <p className='capitalize text-slate-500'>{product?.category}</p>
                <div className='flex gap-1'>
                    <p className='text-red-600 font-medium'>{displayNGCurrency(product?.sellingPrice)}</p>
                    <p className='text-slate-500 line-through'>{displayNGCurrency(product?.price)}</p>
                </div>
                <button className='bg-red-600 hover:bg-red-800 rounded-full px-3 py-1 mt-1' onClick={(e)=>handleAddToCart(e,product?._id)}>Add to cart</button>
            </div>
        </Link>
        )
    }
)
)

}
</div>
  )
}

export default VerticalCard