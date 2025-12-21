import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='container px-4 sm:px-6'>
      <div className='flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-[3fr_1fr_1fr] gap-8 sm:gap-10 lg:gap-14 my-8 sm:my-10 mt-20 sm:mt-32 md:mt-40 text-xs sm:text-sm'>
        {/*--------left section---------*/}
        <div className='text-center sm:text-left'>
          <img className='mb-4 sm:mb-5 w-32 sm:w-40 mx-auto sm:mx-0' src={assets.logo} alt="" />
          <p className='w-full sm:w-full md:w-2/3 text-gray-600 leading-5 sm:leading-6 text-xs sm:text-sm'>Lorem Ipsumis simply dummy text of the printing and typesetting industry. Lorem ipsum ha s been the always statement primary text ever since the 1905s when an typewriter prince took a gallery of many embeded it to make a type specific boo.</p>
        </div>

        {/*--------center section---------*/}
        <div className='text-center sm:text-left'>
          <p className='text-lg sm:text-xl font-medium mb-4 sm:mb-5'>LifeSync</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li className='cursor-pointer hover:text-[#5f6FFF] transition-colors'>Home</li>
            <li className='cursor-pointer hover:text-[#5f6FFF] transition-colors'>About us</li>
            <li className='cursor-pointer hover:text-[#5f6FFF] transition-colors'>Privacy policy</li>
          </ul>
        </div>

        {/*--------right section---------*/}
        <div className='text-center sm:text-left'>
          <p className='text-lg sm:text-xl font-medium mb-4 sm:mb-5'>GET IN TOUCH</p>
          <div className='flex flex-col gap-3 text-gray-600'>
            <div>
              <p className='font-semibold text-gray-700 mb-1 text-xs sm:text-sm'>Our Office</p>
              <p className='text-xs sm:text-sm'>0050 Liverpool Street, Freetown, Sierra Leone</p>
            </div>
            <div>
              <p className='font-semibold text-gray-700 mb-1 text-xs sm:text-sm'>Contact</p>
              <p className='text-xs sm:text-sm'>Tel: (+232) 88-915-854</p>
              <p className='text-xs sm:text-sm break-all'>Email: dtso.cbc.sl@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      {/*--------copyright section---------*/}
      <div>
        <hr className='my-4 sm:my-6' />
        <p className='py-4 sm:py-5 text-xs sm:text-sm text-center'>Copyright © 2025 LifeSync. - All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer
