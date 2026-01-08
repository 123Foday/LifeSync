import React, { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Eye, EyeOff } from 'lucide-react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { HospitalContext } from '../context/HospitalContext'

const Login = () => {

  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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
    <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center bg-gray-50 dark:bg-[#121212] transition-colors duration-300'>
      <div className='flex flex-col gap-4 w-full max-w-md mx-auto items-start p-8 sm:p-10 border dark:border-zinc-800 rounded-2xl text-[#5E5E5E] dark:text-gray-300 text-sm shadow-xl bg-white dark:bg-zinc-900'>
        <p className='text-3xl font-bold m-auto mb-4'><span className='text-primary'>{state}</span> Login</p>
        <div className='w-full'>
          <p className='font-medium mb-1'>Email</p>
          <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded w-full px-3 py-2 outline-none focus:border-primary transition-all' type="email" placeholder='admin@example.com' required />
        </div>
        <div className='w-full'>
          <p className='font-medium mb-1'>Password</p>
          <div className='relative'>
            <input 
              onChange={(e)=>setPassword(e.target.value)} 
              value={password} 
              className='border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded w-full px-3 py-2 pr-10 outline-none focus:border-primary transition-all' 
              type={showPassword ? "text" : "password"} 
              placeholder='••••••••' 
              required 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>
        <button className='bg-primary hover:bg-[#4a58e6] text-white w-full py-2.5 rounded-lg text-base font-semibold cursor-pointer transition-all shadow-lg hover:shadow-primary/30 mt-2'>Login</button>
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
