import React from 'react'
import "./Contact.scss"

const Contact = () => {
  return (
    <div className='app__footer'>
     <h2 className='head-text'>Contact us <span>for more </span>info!</h2>
    <div className='app__footer-cards'>
      <div className='app__footer-card'>
      <div className='app__footer-card1'>
          <img src="/whatsapp3.jpg" alt='whatsapp'></img>
          <a href='tel: +2349130448907' className='p-text'>+2349130448907</a>
        </div>
        <div className='app__footer-card2'>
          <img src="/mobile.png" alt='mobile'></img>
          <a href='tel: +9130448907' className='p-text'>+2349130448907</a>
        </div>
        <div className='app__footer-card3'>
          <img src="/email.png"alt='email'></img>
          <a href='mailto:aniesodoc@gmail.com' className='p-text'>aniesodoc@gmail.com</a>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Contact