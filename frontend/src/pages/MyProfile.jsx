import React, {useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const MyProfile = () => {

  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)

  const updateUserProfileData = async () => {
    
    try {
      
      const formData = new FormData()

      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)

      image && formData.append('image', image)

      if (!token) {
        toast.error('Not authorized. Please log in again.')
        return
      }

      const { data } = await axios.post(
        backendUrl + '/api/user/update-profile',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return userData && (
    <div className='max-w-lg flex flex-col gap-4 text-sm transition-all duration-300'>
      <div className='flex items-center gap-6'>
        {
          isEdit
          ? <label htmlFor="image" className='group'>
            <div className='inline-block relative cursor-pointer'>
              <img className='w-40 h-40 object-cover rounded-xl opacity-75 ring-4 ring-indigo-50 dark:ring-indigo-900/30' src={image ? URL.createObjectURL(image): userData.image} alt="" />
              <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-xl'>
                 <img className='w-10' src={assets.upload_icon} alt="" />
              </div>
            </div>
            <input onChange={(e)=>setImage(e.target.files[0])} type="file"  id="image" hidden />
          </label>
          : <img className='w-40 h-40 object-cover rounded-xl shadow-lg ring-4 ring-white dark:ring-zinc-900' src={userData.image} alt="" />
        }
        
        <div className='flex-1'>
          {
            isEdit
            ? <input className='bg-gray-50 dark:bg-zinc-900 dark:text-white text-3xl font-bold max-w-full px-4 py-2 rounded-lg border-2 border-[#5f6FFF]' type="text" value={userData.name} onChange={e => setUserData(prev => ({...prev, name: e.target.value}))}/>
            : <p className='font-bold text-4xl text-neutral-800 dark:text-neutral-100'>{userData.name}</p>
          }
          <p className='text-[#5f6FFF] dark:text-blue-400 font-medium mt-1 uppercase tracking-wider text-xs'>Verified Patient</p>
        </div>
      </div>

      <hr className='bg-zinc-200 dark:bg-zinc-900 h-[1px] border-none my-2' />
      
      <div className='bg-white dark:bg-[#121212] p-6 rounded-2xl border dark:border-gray-800 shadow-sm'>
        <p className='text-neutral-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs mb-4'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_2.5fr] gap-y-4 items-center text-neutral-700 dark:text-neutral-300'>
          <p className='font-semibold'>Email Address:</p>
          <p className='text-blue-600 dark:text-blue-400 font-medium'>{userData.email}</p>
          
          <p className='font-semibold'>Phone Number:</p>
          {
            isEdit
            ? <input className='bg-gray-50 dark:bg-zinc-900 dark:text-white p-2 rounded border dark:border-gray-700 outline-none w-full max-w-64' type="text" value={userData.phone} onChange={e => setUserData(prev => ({...prev, phone: e.target.value}))}/>
            : <p className='text-blue-600 dark:text-blue-400'>{userData.phone}</p>
          }
          
          <p className='font-semibold self-start mt-1'>Home Address:</p>
          {
            isEdit
            ? <div className='flex flex-col gap-2'>
                <input className='bg-gray-50 dark:bg-zinc-900 dark:text-white p-2 rounded border dark:border-gray-700 outline-none' onChange={(e) => setUserData(prev => ({...prev, address: {...prev.address, line1: e.target.value} }))} value={userData?.address?.line1 || ''} type="text" placeholder="Line 1" />
                <input className='bg-gray-50 dark:bg-zinc-900 dark:text-white p-2 rounded border dark:border-gray-700 outline-none' onChange={(e) => setUserData(prev => ({...prev, address: {...prev.address, line2: e.target.value} }))} value={userData?.address?.line2 || ''} type="text" placeholder="Line 2" />
            </div>
            : <p className='text-gray-600 dark:text-gray-400'>
                {userData?.address?.line1}
                <br />
                {userData?.address?.line2}
            </p>
          }
        </div>
      </div>

      <div className='bg-white dark:bg-black p-6 rounded-2xl border dark:border-gray-800 shadow-sm'>
        <p className='text-neutral-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs mb-4'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_2.5fr] gap-y-4 items-center text-neutral-700 dark:text-neutral-300'>
          <p className='font-semibold'>Sex:</p>
          {
            isEdit
            ? <select className='max-w-32 bg-gray-50 dark:bg-zinc-900 dark:text-white p-2 rounded border dark:border-gray-700' onChange={(e) => setUserData(prev => ({...prev, gender: e.target.value}))} value={userData.gender}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            : <p className='text-gray-600 dark:text-gray-400'>{userData.gender}</p>
          }
          
          <p className='font-semibold'>Date of Birth:</p>
          {
            isEdit ? 
              <input
              className='max-w-40 bg-gray-50 dark:bg-zinc-900 dark:text-white p-2 rounded border dark:border-gray-700'
              type="date"
              onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
              value={userData.dob && /^\d{4}-\d{2}-\d{2}$/.test(userData.dob) ? userData.dob : ''}
              />
            : <p className='text-gray-600 dark:text-gray-400'>{userData.dob}</p>
          }
        </div>
      </div>

      <div className='mt-8 mb-10 flex gap-4'>
        {
          isEdit
          ? <button className='flex-1 bg-[#5f6FFF] text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-100 dark:shadow-none hover:scale-105 transition-all' onClick={updateUserProfileData}>
              Save Profile
            </button>
          : <button className='flex-1 border-2 border-[#5f6FFF] text-[#5f6FFF] dark:text-[#5f6FFF] px-8 py-3 rounded-xl font-semibold hover:bg-[#5f6FFF] hover:text-white transition-all' onClick={()=>setIsEdit(true)}>
              Edit Profile
            </button>
        }
        {isEdit && <button className='flex-1 border-2 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all' onClick={()=>setIsEdit(false)}>Cancel</button>}
      </div>

    </div>
  )
}

export default MyProfile