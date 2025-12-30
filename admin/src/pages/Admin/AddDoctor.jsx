import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';

const AddDoctor = () => {

  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [hospitalId, setHospitalId] = useState('')

  const { backendUrl, aToken, hospitals, getAllHospitals } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllHospitals()
    }
  }, [aToken, getAllHospitals])

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (!docImg) {
        return toast.error("Image Not Selected")
      }

      const formData = new FormData()

      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({line1:address1, line2:address2}))
      formData.append('hospitalId', hospitalId)

      // console.log formData
      formData.forEach((value, key)=>{
        console.log(`${key} : ${value}`);
      })

  const {data} = await axios.post(backendUrl + '/api/admin/add-doctor', formData, {headers:{ atoken: aToken } })

      if (data.success) {
        toast.success(data.message)
         setDocImg(false)
        setName('')
        setPassword('')
        setEmail('')
        setAddress1('')
        setAddress2('')
        setAbout('')
      } else {
        toast.error(data.message)
      }
    
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full transition-all duration-300'>
      <p className='mb-3 text-lg font-medium text-gray-800 dark:text-gray-100'>Add Doctor</p>

      <div className='bg-white dark:bg-zinc-900 px-8 py-8 border dark:border-zinc-800 rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll no-scrollbar'>
        <div className=' flex items-center gap-4 mb-8 text-gray-500 dark:text-gray-400'>
          <label htmlFor="doc-img">
            <img className='w-16 bg-gray-100 dark:bg-zinc-800 rounded-full cursor-pointer border-2 border-transparent hover:border-primary transition-all' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
          </label>
          <input onChange={(e)=> setDocImg(e.target.files[0])} type="file" id="doc-img" hidden/>
          <p>Upload doctor <br />picture</p>
        </div>

        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600 dark:text-gray-300'>
          <div className='w-full lg:flex-1 flex flex-col gap-4'>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor name</p>
              <input onChange={(e)=>setName(e.target.value)} value={name} className='border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded px-3 py-2 outline-none focus:border-primary transition-all' type="text" placeholder='Name' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Email</p>
              <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded px-3 py-2 outline-none focus:border-primary transition-all' type="email" placeholder='Email' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor password</p>
              <input onChange={(e)=>setPassword(e.target.value)} value={password} className='border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded px-3 py-2 outline-none focus:border-primary transition-all' type="password" placeholder='Password' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Experience</p>
              <select onChange={(e)=>setExperience(e.target.value)} value={experience} className='border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded px-3 py-2 outline-none focus:border-primary transition-all' name="" id="">
...
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
                <option value="4 Years">4 Years</option>
                <option value="5 Years">5 Years</option>
                <option value="6 Years">6 Years</option>
                <option value="7 Years">7 Years</option>
                <option value="8 Years">8 Years</option>
                <option value="9 Years">9 Years</option>
                <option value="10 Years">10 Years</option>
              </select>
            </div>

          </div>

          <div className='w-full lg:flex-1 flex flex-col gap-4'>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Speciality</p>
              <select onChange={(e)=>setSpeciality(e.target.value)} value={speciality} className='border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded px-3 py-2 outline-none focus:border-primary transition-all' name="" id="">
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Psychologist">Psychologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Education</p>
              <input onChange={(e)=>setDegree(e.target.value)} value={degree} className='border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded px-3 py-2 outline-none focus:border-primary transition-all' type="text" placeholder='Education' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Address</p>
              <input onChange={(e)=>setAddress1(e.target.value)} value={address1} className='border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded px-3 py-2 outline-none focus:border-primary transition-all mb-2' type="text" placeholder='address 1' />
              <input onChange={(e)=>setAddress2(e.target.value)} value={address2} className='border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded px-3 py-2 outline-none focus:border-primary transition-all' type="text" placeholder='address 2' />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Hospital (Optional - Leave empty for Private Doctor)</p>
              <select
                onChange={(e) => setHospitalId(e.target.value)}
                value={hospitalId}
                className='border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded px-3 py-2 outline-none focus:border-primary transition-all'
              >
                <option value="">Private Doctor (No Hospital)</option>
                {hospitals && hospitals.length > 0 && hospitals.map((hospital) => (
                  <option key={hospital._id} value={hospital._id}>
                    {hospital.name}
                  </option>
                ))}
              </select>
            </div>
            
          </div>
        </div>

        <div>
              <p className='mt-4 mb-2'>About Doctor</p>
              <textarea onChange={(e)=>setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded outline-none focus:border-primary transition-all' placeholder='write about doctor' rows={5} required />
            </div>
            <button type='submit' className='bg-primary px-10 py-3 mt-8 text-white rounded-full hover:bg-[#4a58e6] transition-colors shadow-lg hover:shadow-primary/20'>Add doctor</button>

        </div>

    </form>
  )
}

export default AddDoctor
