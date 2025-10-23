import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        {/*--------left section---------*/}
        <div>
          <img className='mb-5 w-40' src={assets.logo} alt="" />
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem Ipsumis simply dummy text of the printing and typesetting industry. Lorem ipsum ha s been the always statement primary text ever since the 1905s when an typewriter prince took a gallery of many embeded it to make a type specific boo.</p>
        </div>

        {/*--------center section---------*/}
        <div>
          <p className='text-xl font-medium mb-5'>LifeSync</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/*--------right section---------*/}
        <div>
          <p  className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+232-88-915-854</li>
            <li>dtso.cbc.sl@gmail.com</li>
          </ul>
        </div>
      </div>

      {/*--------copyright section---------*/}
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright © 2025 LifeSync. - All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer
