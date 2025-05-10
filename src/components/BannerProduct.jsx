import React from 'react'

const BannerProduct = () => {
  return (
    <div className='container mx-auto px-4 rounded overflow-visible'>
    <div className='h-90 w-full bg-[rgb(11,12,16)] rounded-xl relative overflow-hidden'>
      <video 
        src="/bannervideo.mp4" 
        className='absolute top-0 left-0 w-full h-full object-cover'
        autoPlay 
        muted 
        loop
      />
    </div>
  </div>
  
  )
}

export default BannerProduct