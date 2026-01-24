import React, {useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const MyProfile = () => {

  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)

  // Email Change Flow States
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailStep, setEmailStep] = useState(1) // 1: Request, 2: Verify Old, 3: Finalize New
  const [oldEmailOtp, setOldEmailOtp] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newEmailOtp, setNewEmailOtp] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Account Deletion States
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")
  const [deleteOtp, setDeleteOtp] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(false)

  const updateUserProfileData = async () => {
    
    try {
      
      const formData = new FormData()

      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)
      
      // Append settings
      if (userData.settings) {
        formData.append('settings', JSON.stringify(userData.settings))
      }

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

  // Email Change Handlers
  const requestEmailChange = async () => {
    setIsProcessing(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/user/request-email-change', {}, { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        toast.success(data.message)
        setEmailStep(2)
        startCountdown()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Request failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const verifyOldEmail = async () => {
    if (!oldEmailOtp || !newEmail) return toast.error('Fill all fields')
    setIsProcessing(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/user/verify-old-email', { otp: oldEmailOtp, newEmail }, { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        toast.success(data.message)
        setEmailStep(3)
        setCountdown(0)
        startCountdown()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const finalizeEmailChange = async () => {
    if (!newEmailOtp) return toast.error('Enter OTP')
    setIsProcessing(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/user/finalize-email-change', { otp: newEmailOtp }, { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        toast.success(data.message)
        setShowEmailModal(false)
        resetEmailFlow()
        await loadUserProfileData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Finalization failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const resetEmailFlow = () => {
    setEmailStep(1)
    setOldEmailOtp("")
    setNewEmail("")
    setNewEmailOtp("")
    setCountdown(0)
  }

  const startCountdown = () => {
    setCountdown(60)
  }

  React.useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000)
    }
    return () => clearInterval(timer)
  }, [countdown])

  const requestDeletionOTP = async () => {
    setIsProcessing(true)
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/request-deletion-otp',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success(data.message)
        setIsOtpSent(true)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP request failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const deleteAccount = async () => {
    const isSSO = userData.authProvider !== 'local'
    if (isSSO && !deleteOtp && !deletePassword) return toast.error('Please provide verification code or password')
    if (!isSSO && !deletePassword) return toast.error('Please enter your password to confirm')
    
    setIsDeleting(true)
    try {
      const payload = isSSO && !deletePassword ? { otp: deleteOtp } : { password: deletePassword }
      
      const { data } = await axios.post(
        backendUrl + '/api/user/delete-account',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        localStorage.removeItem('token')
        window.location.href = '/' // Redirect to home/login
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Account deletion failed')
    } finally {
      setIsDeleting(false)
    }
  }

  const getProfileImage = () => {
    if (image) return URL.createObjectURL(image)
    
    // Check if it's the specific hardcoded default base64 or generic default
    const isDefaultBase64 = userData.image && userData.image.startsWith("data:image/png;base64,iVBORw0KGgoAAA")
    
    // Use custom image if it exists and isn't the default
    if (userData.image && !isDefaultBase64) return userData.image
    
    // Gender-based fallback
    if (userData.gender === 'Male') return assets.avatar_male
    if (userData.gender === 'Female') return assets.avatar_female
    
    return assets.avatar_default
  }

  return userData && (
    <>
    <div className='max-w-lg flex flex-col gap-4 text-sm transition-all duration-300'>
      <div className='flex items-center gap-6'>
        {
          isEdit
          ? <label htmlFor="image" className='group'>
            <div className='inline-block relative cursor-pointer'>
              <img className='w-40 h-40 object-cover rounded-xl opacity-75 ring-4 ring-indigo-50 dark:ring-indigo-900/30' src={getProfileImage()} alt="" />
              <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-xl'>
                 <img className='w-10' src={assets.upload_icon} alt="" />
              </div>
            </div>
            <input onChange={(e)=>setImage(e.target.files[0])} type="file"  id="image" hidden />
          </label> // Line 213 replacement
          : <img className='w-40 h-40 object-cover rounded-xl shadow-lg ring-4 ring-white dark:ring-zinc-900' src={getProfileImage()} alt="" />
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
          <div className='flex items-center gap-3'>
            <p className='text-blue-600 dark:text-blue-400 font-medium'>{userData.email}</p>
            {!isEdit && (
              <button 
                onClick={() => setShowEmailModal(true)}
                className='text-[10px] bg-indigo-50 dark:bg-indigo-900/30 text-[#5f6FFF] px-2 py-1 rounded hover:bg-[#5f6FFF] hover:text-white transition-all font-bold uppercase border border-indigo-100 dark:border-indigo-800'
              >
                Change
              </button>
            )}
          </div>
          
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
              <option value="Not Selected">Select</option>
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

      <div className='bg-white dark:bg-[#121212] p-6 rounded-2xl border dark:border-gray-800 shadow-sm'>
        <p className='text-neutral-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs mb-4'>APP SETTINGS & PREFERENCES</p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-neutral-700 dark:text-neutral-300'>
          
          {/* Notifications */}
          <div className='flex flex-col gap-3'>
            <p className='font-semibold text-sm text-gray-900 dark:text-white border-b dark:border-gray-800 pb-2'>Notifications</p>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600 dark:text-gray-400'>Email Notifications</span>
              <input 
                type="checkbox" 
                disabled={!isEdit}
                checked={userData.settings?.notifications?.email ?? true}
                onChange={(e) => setUserData(prev => ({ ...prev, settings: { ...prev.settings, notifications: { ...(prev.settings?.notifications || {}), email: e.target.checked } } }))}
                className={`w-4 h-4 ${!isEdit ? 'opacity-60' : 'cursor-pointer'}`}
              />
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600 dark:text-gray-400'>SMS Notifications</span>
              <input 
                type="checkbox" 
                disabled={!isEdit}
                checked={userData.settings?.notifications?.sms ?? true}
                onChange={(e) => setUserData(prev => ({ ...prev, settings: { ...prev.settings, notifications: { ...(prev.settings?.notifications || {}), sms: e.target.checked } } }))}
                className={`w-4 h-4 ${!isEdit ? 'opacity-60' : 'cursor-pointer'}`}
              />
            </div>
          </div>

          {/* Appearance */}
          <div className='flex flex-col gap-3'>
            <p className='font-semibold text-sm text-gray-900 dark:text-white border-b dark:border-gray-800 pb-2'>Appearance</p>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600 dark:text-gray-400'>Theme</span>
              {isEdit ? (
                <select 
                  value={userData.settings?.theme ?? 'light'}
                  onChange={(e) => setUserData(prev => ({ ...prev, settings: { ...prev.settings, theme: e.target.value } }))}
                  className='bg-gray-50 dark:bg-zinc-900 dark:text-white text-xs p-1.5 rounded border dark:border-gray-700 outline-none'
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              ) : (
                <span className='text-xs font-medium bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded capitalize'>{userData.settings?.theme || 'Light'}</span>
              )}
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600 dark:text-gray-400'>Font Size</span>
              {isEdit ? (
                <select 
                  value={userData.settings?.font?.size ?? 'medium'}
                  onChange={(e) => setUserData(prev => ({ ...prev, settings: { ...prev.settings, font: { ...(prev.settings?.font || {}), size: e.target.value } } }))}
                  className='bg-gray-50 dark:bg-zinc-900 dark:text-white text-xs p-1.5 rounded border dark:border-gray-700 outline-none'
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              ) : (
                <span className='text-xs font-medium bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded capitalize'>{userData.settings?.font?.size || 'Medium'}</span>
              )}
            </div>
          </div>

        </div>
      </div>

      <div className='mt-8 mb-10 flex gap-4'>
        {
          isEdit
          ? <button className='flex-1 bg-[#5f6FFF] text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-100 dark:shadow-none hover:scale-105 transition-all' onClick={updateUserProfileData}>
              Save Profile & Settings
            </button>
          : <button className='flex-1 border-2 border-[#5f6FFF] text-[#5f6FFF] dark:text-[#5f6FFF] px-8 py-3 rounded-xl font-semibold hover:bg-[#5f6FFF] hover:text-white transition-all' onClick={()=>setIsEdit(true)}>
              Edit Profile
            </button>
        }
        {isEdit && <button className='flex-1 border-2 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all' onClick={()=>setIsEdit(false)}>Cancel</button>}
      </div>

      {!isEdit && (
        <div className='mt-8 mb-12 border-t-2 border-red-50 dark:border-red-900/20 pt-8'>
          <h3 className='text-red-500 font-bold uppercase tracking-widest text-xs mb-4'>Danger Zone</h3>
          <div className='bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <p className='font-bold text-red-700 dark:text-red-400'>Delete Account</p>
              <p className='text-xs text-red-600/70 dark:text-red-400/60 mt-1'>Once you delete your account, there is no going back. Please be certain.</p>
            </div>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className='bg-red-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-600 transition-all shadow-md shadow-red-100 dark:shadow-none text-xs uppercase tracking-wider'
            >
              Delete My Account
            </button>
          </div>
        </div>
      )}

    </div>

      {/* Email Change Modal */}
      {showEmailModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-sm'>
          <div className='bg-white dark:bg-[#121212] w-full max-w-md rounded-2xl shadow-2xl p-8 border dark:border-gray-800 transition-all transform animate-in fade-in zoom-in duration-300'>
            <div className='flex justify-between items-center mb-6'>
              <h3 className='text-xl font-bold dark:text-white'>Secure Email Change</h3>
              <button onClick={() => { setShowEmailModal(false); resetEmailFlow(); }} className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors'>✕</button>
            </div>

            {emailStep === 1 && (
              <div className='flex flex-col gap-4'>
                <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>To change your email, we first need to verify your current address: <span className='font-bold text-gray-900 dark:text-white'>{userData.email}</span></p>
                <button 
                  onClick={requestEmailChange}
                  disabled={isProcessing}
                  className='bg-[#5f6FFF] text-white py-3.5 rounded-xl font-bold hover:bg-[#4f5fef] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-blue-100 dark:shadow-none disabled:bg-gray-400'
                >
                  {isProcessing ? 'Sending...' : 'Send Verification Code'}
                </button>
              </div>
            )}

            {emailStep === 2 && (
              <div className='flex flex-col gap-5'>
                <div className='bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30'>
                  <p className='text-xs text-blue-700 dark:text-blue-300 leading-tight'>Step 1: Verify current email. Check your inbox/spam for a 6-digit code.</p>
                </div>
                <div>
                  <label className='block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1.5 tracking-wider'>Current Email Code</label>
                  <input 
                    className='w-full bg-gray-50 dark:bg-zinc-900 dark:text-white p-3.5 rounded-xl border dark:border-gray-800 outline-none focus:border-[#5f6FFF] transition-all text-center text-2xl tracking-[0.5em] font-mono'
                    maxLength='6'
                    value={oldEmailOtp}
                    onChange={e => setOldEmailOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    autoFocus
                  />
                </div>
                <div>
                  <label className='block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1.5 tracking-wider'>New Email Address</label>
                  <input 
                    className='w-full bg-gray-50 dark:bg-zinc-900 dark:text-white p-3.5 rounded-xl border dark:border-gray-800 outline-none focus:border-[#5f6FFF] transition-all font-medium'
                    type='email'
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder="new@email.com"
                  />
                </div>
                <button 
                  onClick={verifyOldEmail}
                  disabled={isProcessing}
                  className='bg-[#5f6FFF] text-white py-3.5 rounded-xl font-bold hover:bg-[#4f5fef] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-blue-100 dark:shadow-none'
                >
                  {isProcessing ? 'Verifying...' : 'Next Step'}
                </button>
                {countdown > 0 ? (
                  <p className='text-center text-xs text-gray-400'>Resend code in <span className='font-bold text-gray-500'>{countdown}s</span></p>
                ) : (
                  <button onClick={requestEmailChange} className='text-xs text-[#5f6FFF] font-bold hover:underline'>Resend Verification Code</button>
                )}
              </div>
            )}

            {emailStep === 3 && (
              <div className='flex flex-col gap-5'>
                <div className='bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/30'>
                  <p className='text-xs text-green-700 dark:text-green-300 leading-tight'>Step 2: Confirm new email. We've sent a final code to <span className='font-bold'>{newEmail}</span>.</p>
                </div>
                <div>
                  <label className='block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1.5 tracking-wider'>New Email Code</label>
                  <input 
                    className='w-full bg-gray-50 dark:bg-zinc-900 dark:text-white p-3.5 rounded-xl border dark:border-gray-800 outline-none focus:border-[#5f6FFF] transition-all text-center text-2xl tracking-[0.5em] font-mono'
                    maxLength='6'
                    value={newEmailOtp}
                    onChange={e => setNewEmailOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    autoFocus
                  />
                </div>
                <button 
                  onClick={finalizeEmailChange}
                  disabled={isProcessing}
                  className='bg-[#5f6FFF] text-white py-3.5 rounded-xl font-bold hover:bg-[#4f5fef] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-blue-100 dark:shadow-none'
                >
                  {isProcessing ? 'Updating...' : 'Confirm & Save Email'}
                </button>
                <button 
                    onClick={() => setEmailStep(2)} 
                    className='text-xs text-gray-400 hover:text-gray-600 font-medium'
                    disabled={isProcessing}
                >
                    Back to previous step
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Account Deletion Modal */}
      {showDeleteModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-sm'>
          <div className='bg-white dark:bg-[#121212] w-full max-w-md rounded-2xl shadow-2xl p-8 border dark:border-gray-800 transition-all transform animate-in fade-in zoom-in duration-300'>
            <div className='flex justify-between items-center mb-6'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center'>
                  <span className='text-red-600 dark:text-red-400 text-xl font-bold'>!</span>
                </div>
                <h3 className='text-xl font-bold dark:text-white'>Confirm Deletion</h3>
              </div>
              <button 
                onClick={() => { setShowDeleteModal(false); setDeletePassword(""); }} 
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors'
              >
                ✕
              </button>
            </div>

            <div className='flex flex-col gap-6'>
              <div className='bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30'>
                <p className='text-sm text-red-700 dark:text-red-300 leading-relaxed font-medium'>
                  You are about to permanently delete your LifeSync account. This action cannot be undone. 
                  <br /><br />
                  An email notification will be sent to <span className='font-bold underline'>{userData.email}</span> to confirm this activity.
                </p>
              </div>

              {userData.authProvider === 'local' ? (
                <div>
                  <label className='block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-2 tracking-wider'>Enter Password to Confirm</label>
                  <input 
                    type='password'
                    className='w-full bg-gray-50 dark:bg-zinc-900 dark:text-white p-3.5 rounded-xl border dark:border-gray-800 outline-none focus:border-red-500 transition-all font-medium'
                    value={deletePassword}
                    onChange={e => setDeletePassword(e.target.value)}
                    placeholder="Your account password"
                    autoFocus
                  />
                </div>
              ) : (
                <div className='flex flex-col gap-4'>
                  {!isOtpSent ? (
                    <div className='flex flex-col gap-3'>
                      <p className='text-xs text-gray-500'>As an SSO user, please request a verification code to confirm deletion.</p>
                      <button 
                        onClick={requestDeletionOTP}
                        disabled={isProcessing}
                        className='bg-indigo-50 dark:bg-indigo-900/30 text-[#5f6FFF] py-3 rounded-xl font-bold hover:bg-[#5f6FFF] hover:text-white transition-all disabled:opacity-50'
                      >
                        {isProcessing ? 'Sending...' : 'Request Deletion Code'}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className='block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-2 tracking-wider'>Verification Code</label>
                      <input 
                        className='w-full bg-gray-50 dark:bg-zinc-900 dark:text-white p-3.5 rounded-xl border dark:border-gray-800 outline-none focus:border-red-500 transition-all text-center text-2xl tracking-[0.5em] font-mono'
                        maxLength='6'
                        value={deleteOtp}
                        onChange={e => setDeleteOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder="000000"
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              )}

              <div className='flex flex-col gap-3'>
                <button 
                  onClick={deleteAccount}
                  disabled={isDeleting || (userData.authProvider !== 'local' && !isOtpSent && !deletePassword)}
                  className='w-full bg-red-500 text-white py-4 rounded-xl font-bold hover:bg-red-600 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-red-100 dark:shadow-none disabled:bg-gray-400'
                >
                  {isDeleting ? 'Deleting Account...' : 'Permanently Delete Account'}
                </button>
                <button 
                  onClick={() => { setShowDeleteModal(false); setDeletePassword(""); setDeleteOtp(""); setIsOtpSent(false); }} 
                  className='w-full text-gray-500 dark:text-gray-400 py-2 font-semibold hover:text-gray-700 dark:hover:text-gray-200 transition-colors'
                  disabled={isDeleting}
                >
                  Keep My Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MyProfile