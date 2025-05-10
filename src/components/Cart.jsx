import React, { useState } from 'react'
import SummaryApi from '../common'
import { useEffect } from 'react'
import { useContext } from 'react'
import Context from '../context'
import displayNGCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md";
import { Link } from 'react-router-dom'

const Cart = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const context = useContext(Context)
    const loadingCart = new Array(context.cartProductCount).fill(null)

    const fetchData = async() => {
        const response = await fetch(SummaryApi.addToCartProductView.url,{
            credentials : "include",
            headers : {
                "content-type" : "application/json"
            },
        })

        const responseData = await response.json()

        if(responseData.success){
            setData(responseData.data)
        }
    }
    const handleLoading = async() =>{
       await fetchData()
    }
    useEffect(() => {
      setLoading(true)
        handleLoading()
        setLoading(false)
    }, [])
    

    const increaseQty = async(id,qty) => {
        const response = await fetch(SummaryApi.updateCartProduct.url,{
            method : SummaryApi.updateCartProduct.method,
            credentials : "include",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify(
                {
                    _id : id,
                    quantity : qty + 1
                }
            )
        })

        const responseData = await response.json()

        if (responseData.success){
            fetchData()
        }
    }
   
    const decreaseQty = async (id,qty) => {
            if(qty >= 2){
                const response = await fetch(SummaryApi.updateCartProduct.url,{
                    method : SummaryApi.updateCartProduct.method,
                    credentials : "include",
                    headers : {
                        "content-type" : "application/json"
                    },
                    body : JSON.stringify(
                        {
                            _id : id,
                            quantity : qty - 1
                        }
                    )
                })
        
                const responseData = await response.json()
        
                if (responseData.success){
                    fetchData()
                }
            }
    }

    const deleteCartProduct = async (id)=> {
        const response = await fetch(SummaryApi.deleteCartProduct.url,{
            method : SummaryApi.deleteCartProduct.method,
            credentials : "include",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify(
                {
                    _id : id,
                }
            )
        })

        const responseData = await response.json()

        if (responseData.success){
            fetchData()
            context.fetchUserAddToCart()
        }
    }

    const totalQty = data.reduce((previousValue,currentValue)=> previousValue + currentValue.quantity,0)
    const totalPrice = data.reduce((preve,curr)=> preve + (curr.quantity * curr?.productId?.sellingPrice), 0 )
  return (
    <div className='container mx-auto'>
        <div className='text-center text-lg'>
        {
            data.length === 0 && !loading && (
                <p className='bg-white py-5 text-black text-xl font-bold rounded-xl'>No Data</p>
            )
        }
        </div>

        <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-2 lg:px-0'>
            {/*view product*/}
            <div className='w-full max-w-3xl'>
                {
                    loading ? (
                        loadingCart.map((el,index) => {
                            return (
                                <div key={el + "Add To cart Loading"+index} className='w-full bg-slate-200 h-32 my-1 border-slate-200 animate-pulse rounded-xl'>
                            </div>
                            )
                        })
                    ) : (
                        data.map((product,index)=>{
                            return(
                            <div key={product?._id + "Add To cart Loading"} className='w-full h-32 my-2 bg-white border-slate-200 rounded-xl grid grid-cols-[150px_1fr]'>
                                <div className='h-32 w-40 p-2 bg-slate-200'>
                                    <img src={product?.productId?.productImage[0]} className='w-full rounded-4xl  h-full object-scale-down mix-blend-multiply' alt="" />
                                </div>
                                <div className='px-4 py-2 relative'>
                                    <div className='absolute right-0 text-red-600 rounded-full p-3 cursor-pointer hover:bg-red-600 hover:text-white' onClick={()=>deleteCartProduct(product?._id)}>
                                    <MdDelete />
                                    </div>
                                    <h2 className='text-black lg:text-xl font-bold text-ellipsis line-clamp-1'>{product?.productId?.productName}</h2>
                                    <p className='text-slate-500 font-bold'>{product?.productId?.category}</p>
                                    <div className='flex items-center justify-between'>
                                    <p className='text-red-600 text-lg font-bold'>{displayNGCurrency(product?.productId?.sellingPrice)}</p>
                                    <p className='text-slate-600 text-lg font-bold'>{displayNGCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                                    </div>
                                    <div className='flex items-center gap-2 mt-2'>
                                        <button className='bg-red-600 w-6 h-6 flex justify-center items-center rounded cursor-pointer' onClick={()=>decreaseQty(product?._id,product?.quantity)}>-</button>
                                        <span className='text-black'>{product?.quantity}</span>
                                        <button className='bg-red-600 w-6 h-6 flex justify-center items-center rounded cursor-pointer' onClick={()=>increaseQty(product?._id,product?.quantity)}>+</button>
                                    </div>
                                </div>
                            </div>
                        )
                        })
                    )
                }
            </div>

            {/**Summary */}
           <div className='mt-2 lg:mt-0 w-full lg:max-w-sm'>
                    {
                            loading ? (
                                <div className='h-36 bg-slate-200 border-slate-300 animate-pulse rounded-xl'>
                        </div>
                            ) : (
                                <div className='h-45 bg-white rounded-2xl mt-2 mb-8'>
                            <h2 className='text-white text-lg font-bold bg-blue-600 px-4 py-2'>Summary</h2>
                            <div className='flex items-center justify-between px-4 gap-3 font-bold text-lg text-black'>
                            <p >Quantity</p>
                            <p>{totalQty}</p>
                            </div>
                            <div className='flex items-center justify-between px-4 gap-3 mt-1 font-bold text-lg text-black'>
                                <p>Total Price</p>
                                <p>{displayNGCurrency(totalPrice)}</p>
                            </div>
                            <Link to={"/chatpayment"} >
                            <button className='bg-green-600 hover:bg-green-500 cursor-pointer py-4 mt-8 rounded-2xl text-white w-full'>Payment</button>
                            </Link>
                        </div>
                            )
                        }
           </div>
        </div>
    </div>
  )
}

export default Cart