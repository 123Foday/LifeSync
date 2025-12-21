import React, { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { HospitalContext } from '../context/HospitalContext'

const Login = () => {

  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const {setAToken, backendUrl} = useContext(AdminContext)
  const {setDToken} = useContext(DoctorContext)
  const {setHToken} = useContext(HospitalContext)
  
  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      
      if (state === 'Admin') {

        const {data} = await axios.post(backendUrl + '/api/admin/login', {email, password})
        if (data.success) {
          localStorage.setItem('aToken', data.token)
          setAToken(data.token);
        } else {
          toast.error(data.message)
        }
        
      } else if (state === 'Hospital') {
        const {data} = await axios.post(backendUrl + '/api/hospital/login', {email, password})
        if (data.success) {
          localStorage.setItem('hToken', data.token)
          setHToken(data.token);
        } else {
          toast.error(data.message)
        }
      } else {
        const {data} = await axios.post(backendUrl + '/api/doctor/login', {email, password})
        if (data.success) {
          localStorage.setItem('dToken', data.token)
          setDToken(data.token);
          console.log(data.token)
        } else {
          toast.error(data.message)
        }
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 w-full max-w-md mx-auto items-start p-6 sm:p-8 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'><span className='text-primary'>{state} </span>Login</p>
        <div className='w-full'>
          <p>Email</p>
          <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full mt-1' type="email" required />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input onChange={(e)=>setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full mt-1' type="password" required />
        </div>
        <button className='bg-primary text-white w-full py-2 rounded-md text-base cursor-pointer'>Login</button>
        {
          state === 'Admin' ? (
            <>
              <p>Doctor Login? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Doctor')}>Click here</span></p>
              <p>Hospital Login? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Hospital')}>Click here</span></p>
            </>
          ) : state === 'Doctor' ? (
            <>
              <p>Admin Login? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Admin')}>Click here</span></p>
              <p>Hospital Login? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Hospital')}>Click here</span></p>
            </>
          ) : (
            <>
              <p>Admin Login? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Admin')}>Click here</span></p>
              <p>Doctor Login? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Doctor')}>Click here</span></p>
            </>
          )
        }
      </div>
    </form>
  )
}

export default Login
