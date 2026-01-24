import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Phone, MapPin, User, Clock, Play, X, CheckCircle, AlertTriangle, PhoneCall } from 'lucide-react';


const Dashboard = () => {

  const { aToken, getDashData, cancelAppointment, dashData, backendUrl } = useContext(AdminContext)

  const { slotDateFormat } = useContext(AppContext)
  const { theme } = useTheme()
  const [emergencyLogs, setEmergencyLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (aToken) {
      getDashData()
      fetchEmergencyLogs()
      const interval = setInterval(() => {
        getDashData()
        fetchEmergencyLogs()
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [aToken])

  const fetchEmergencyLogs = async () => {
    try {
        const { data } = await axios.get(backendUrl + '/api/emergency/all', {
            headers: { atoken: aToken }
        });
        if (data.success) {
            // Admin sees only main call center calls (filtered by backend)
            setEmergencyLogs(data.data);
        }
    } catch (error) {
        console.error("Failed to fetch emergency logs", error);
    }
  };

  const handleViewDetails = async (logId) => {
    try {
        const { data } = await axios.get(`${backendUrl}/api/emergency/${logId}`, {
            headers: { atoken: aToken }
        });
        if (data.success) {
            setSelectedLog(data.data);
            setShowDetails(true);
        }
    } catch (error) {
        console.error("Failed to fetch emergency details", error);
    }
  };

  const updateEmergencyStatus = async (logId, newStatus) => {
    try {
        const { data } = await axios.post(`${backendUrl}/api/emergency/update-status/${logId}`, {
            status: newStatus
        }, {
            headers: { atoken: aToken }
        });
        if (data.success) {
            toast.success("Status updated successfully");
            fetchEmergencyLogs();
            if (selectedLog && selectedLog._id === logId) {
                setSelectedLog(data.data);
            }
        }
    } catch (error) {
        console.error("Failed to update status", error);
        toast.error("Failed to update status");
    }
  };
  if (!dashData) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background dark:bg-zinc-950'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
          <p className='text-gray-500 dark:text-gray-400 font-medium animate-pulse'>Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='p-6 bg-gray-50 dark:bg-[#121212] min-h-screen transition-all duration-300'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>Dashboard Overview</h1>
        <Link
          to='/emergency-call-center'
          className='bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 shadow-lg hover:shadow-xl'
        >
          <PhoneCall size={20} />
          Emergency Call Center
        </Link>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-zinc-800'>
          <div className='flex items-center gap-4'>
            <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl shadow-inner'>
              <img className='w-12 h-12' src={assets.doctor_icon} alt="" />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800 dark:text-gray-100'>{dashData.doctors}</p>
              <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>Total Doctors</p>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-zinc-800'>
          <div className='flex items-center gap-4'>
            <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl shadow-inner'>
              <img className='w-12 h-12' src={assets.hospital_icon} alt="" />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800 dark:text-gray-100'>{dashData.hospitals}</p>
              <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>Total Hospitals</p>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-zinc-800'>
          <div className='flex items-center gap-4'>
            <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl shadow-inner'>
              <img className='w-12 h-12' src={assets.appointments_icon} alt="" />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800 dark:text-gray-100'>{dashData.appointments}</p>
              <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>Total Appointments</p>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-zinc-800'>
          <div className='flex items-center gap-4'>
            <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl shadow-inner'>
              <img className='w-12 h-12' src={assets.patients_icon} alt="" />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800 dark:text-gray-100'>{dashData.patients}</p>
              <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>Total Patients</p>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10'>
        {/* Appointment Trends Chart */}
        <div className='lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800'>
          <h2 className='text-lg font-bold text-gray-800 dark:text-gray-100 mb-6'>Appointment Trends</h2>
          <div className='h-[300px] w-full'>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashData.trends}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5F6FFF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#5F6FFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#333' : '#eee'} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: theme === 'dark' ? '#888' : '#666', fontSize: 12}}
                  tickFormatter={(str) => str.split('-').slice(1).join('/')}
                />
                <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{fill: theme === 'dark' ? '#888' : '#666', fontSize: 12}}
                />
                <Tooltip 
                  contentStyle={{backgroundColor: theme === 'dark' ? '#18181b' : '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Area type="monotone" dataKey="count" stroke="#5F6FFF" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Provider Distribution Chart */}
        <div className='bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800'>
          <h2 className='text-lg font-bold text-gray-800 dark:text-gray-100 mb-6'>Providers</h2>
          <div className='h-[300px] w-full'>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashData.distribution}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#5F6FFF" />
                  <Cell fill="#10B981" />
                </Pie>
                <Tooltip 
                   contentStyle={{backgroundColor: theme === 'dark' ? '#18181b' : '#fff', borderRadius: '8px', border: 'none'}}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className='flex justify-center gap-6 mt-4'>
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 rounded-full bg-primary'></div>
                <span className='text-xs text-gray-500'>Doctors</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 rounded-full bg-green-500'></div>
                <span className='text-xs text-gray-500'>Hospitals</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className='bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800 mt-10'>
        <div className='flex items-center gap-2.5 px-6 py-4 bg-white dark:bg-zinc-950 border-b dark:border-zinc-800'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold text-gray-800 dark:text-gray-100'>Latest Bookings</p>
        </div>

        <div className='divide-y dark:divide-zinc-800'>
          {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
            dashData.latestAppointments.map((item, index) => {
              const providerData = item.providerType === 'hospital' 
                ? item.hospitalData 
                : item.docData;
              
              if (!providerData) {
                return (
                  <div 
                    className='flex items-center px-6 py-4 gap-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors' 
                    key={index}
                  >
                    <div className='w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center'>
                      <span className='text-gray-500 dark:text-gray-400 text-xs'>N/A</span>
                    </div>
                    <div className='flex-1 text-sm'>
                      <p className='text-gray-800 dark:text-gray-100 font-medium'>Provider data unavailable</p>
                      <p className='text-gray-600 dark:text-gray-400'>
                        {item.slotDate} | {item.slotTime}
                      </p>
                    </div>
                    <span className='text-xs text-gray-400 dark:text-gray-500'>
                      {item.providerType || 'doctor'}
                    </span>
                  </div>
                );
              }

              return (
                <div 
                  className='flex items-center px-6 py-4 gap-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors' 
                  key={index}
                >
                  <img 
                    className='rounded-full w-10 border dark:border-zinc-800' 
                    src={providerData.image} 
                    alt={providerData.name || "Provider"} 
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%23ddd"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="14">?</text></svg>';
                    }}
                  />
                  <div className='flex-1 text-sm'>
                    <p className='text-gray-800 dark:text-gray-100 font-medium flex items-center gap-2'>
                      {providerData.name}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.providerType === 'hospital'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {item.providerType === 'hospital' ? 'HOSPITAL' : 'DOCTOR'}
                      </span>
                    </p>
                    <p className='text-gray-600 dark:text-gray-400'>
                      {item.slotDate} | {item.slotTime}
                    </p>
                  </div>
                  {item.cancelled ? (
                    <p className='text-red-400 text-xs font-medium bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded'>Cancelled</p>
                  ) : item.isCompleted ? (
                    <p className='text-green-500 text-xs font-medium bg-green-50 dark:bg-green-900/10 px-2 py-1 rounded'>Booked</p>
                  ) : (
                    <p className='text-blue-500 text-xs font-medium bg-blue-50 dark:bg-blue-900/10 px-2 py-1 rounded'>Scheduled</p>
                  )}
                </div>
              );
            })
          ) : (
            <div className='px-6 py-12 text-center text-gray-400 dark:text-gray-500'>
              No recent bookings found
            </div>
          )}
        </div>
      </div>

      {/* Main Call Center Emergency Logs Section */}
      <div className='bg-red-50 dark:bg-red-900/10 rounded-xl overflow-hidden shadow-sm border border-red-100 dark:border-red-900/20 mt-10'>
        <div className='flex items-center justify-between px-6 py-4 bg-red-100 dark:bg-red-900/20 border-b border-red-200 dark:border-red-900/30'>
            <div className='flex items-center gap-2.5'>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <p className='font-bold text-red-700 dark:text-red-400'>Main Call Center - Emergency Feed (IVR & AI Assistant)</p>
            </div>
            <p className='text-sm text-red-600 dark:text-red-400'>{emergencyLogs.length} Total Calls</p>
        </div>
        
        {emergencyLogs && emergencyLogs.length > 0 ? (
             <div className='divide-y divide-red-100 dark:divide-red-900/20 max-h-[600px] overflow-y-auto'>
                {emergencyLogs.map((log, index) => (
                    <div key={log._id || index} className='p-4 hover:bg-red-100/50 dark:hover:bg-red-900/10 transition'>
                        <div className='flex flex-col md:flex-row gap-4 justify-between'>
                            <div className='flex-1'>
                                <div className='flex items-start gap-3 mb-2'>
                                    <div className={`w-2 h-2 rounded-full mt-2 ${
                                        log.priority === 'Critical' ? 'bg-red-600 animate-pulse' :
                                        log.priority === 'High' ? 'bg-orange-500' :
                                        log.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}></div>
                                    <div className='flex-1'>
                                        <div className='flex items-center gap-2 mb-1'>
                                            <User size={12} className='text-gray-500' />
                                            <p className='font-bold text-gray-800 dark:text-gray-100'>{log.callerName || 'Anonymous'}</p>
                                            {log.contactNumber && (
                                                <>
                                                    <Phone size={12} className='text-gray-500 ml-2' />
                                                    <span className='text-sm text-gray-600 dark:text-gray-400'>{log.contactNumber}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className='flex items-center gap-2 mb-1'>
                                            <MapPin size={12} className='text-gray-500' />
                                            <p className='text-sm text-gray-700 dark:text-gray-300'>{log.location || 'Location not provided'}</p>
                                        </div>
                                        <p className='text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2'>{log.summary}</p>
                                        <div className='mt-2 flex flex-wrap gap-2'>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                log.priority === 'Critical' ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200' :
                                                log.priority === 'High' ? 'bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200' :
                                                log.priority === 'Medium' ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200' :
                                                'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                                            }`}>
                                                {log.priority} Priority
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                log.status === 'Resolved' ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200' :
                                                log.status === 'In Progress' || log.status === 'Routed to Agent' ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200' :
                                                'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                            }`}>
                                                {log.status}
                                            </span>
                                            {log.emergencyType && (
                                                <span className='text-xs bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-full'>
                                                    {log.emergencyType}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col items-end gap-2'>
                                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <Clock size={12} />
                                    {new Date(log.createdAt).toLocaleString()}
                                </div>
                                <button
                                    onClick={() => handleViewDetails(log._id)}
                                    className='text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition'
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
        ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">No emergency calls from main call center.</div>
        )}
      </div>

      {/* Emergency Details Modal - Same as Hospital Dashboard */}
      {showDetails && selectedLog && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4' onClick={() => setShowDetails(false)}>
            <div className='bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
                <div className='sticky top-0 bg-red-100 dark:bg-red-900/20 px-6 py-4 border-b border-red-200 dark:border-red-900/30 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <AlertTriangle className='text-red-600' size={20} />
                        <h2 className='font-bold text-red-700 dark:text-red-400'>Emergency Call Details - Main Call Center</h2>
                    </div>
                    <button onClick={() => setShowDetails(false)} className='text-gray-500 hover:text-gray-700'>
                        <X size={20} />
                    </button>
                </div>

                <div className='p-6 space-y-6'>
                    {/* Call Information */}
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg'>
                            <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Call ID</p>
                            <p className='font-semibold'>{selectedLog.callId}</p>
                        </div>
                        <div className='bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg'>
                            <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Status</p>
                            <p className='font-semibold'>{selectedLog.status}</p>
                        </div>
                        <div className='bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg'>
                            <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Priority</p>
                            <p className='font-semibold'>{selectedLog.priority}</p>
                        </div>
                        <div className='bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg'>
                            <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Emergency Type</p>
                            <p className='font-semibold'>{selectedLog.emergencyType || 'Medical'}</p>
                        </div>
                    </div>

                    {/* Caller Information */}
                    <div className='bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg'>
                        <h3 className='font-semibold mb-3 flex items-center gap-2'>
                            <User size={18} />
                            Caller Information
                        </h3>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Name</p>
                                <p>{selectedLog.callerName || 'Anonymous'}</p>
                            </div>
                            {selectedLog.contactNumber && (
                                <div>
                                    <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Contact</p>
                                    <p>{selectedLog.contactNumber}</p>
                                </div>
                            )}
                            <div className='col-span-2'>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Location</p>
                                <p className='flex items-center gap-1'>
                                    <MapPin size={12} />
                                    {selectedLog.location || 'Not provided'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Full Conversation Transcript */}
                    <div className='bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg'>
                        <h3 className='font-semibold mb-3'>Full Conversation Transcript</h3>
                        <div className='space-y-3 max-h-64 overflow-y-auto'>
                            {selectedLog.conversation && selectedLog.conversation.length > 0 ? (
                                selectedLog.conversation.map((msg, idx) => (
                                    <div key={idx} className={`p-3 rounded-lg ${
                                        msg.sender === 'AI' ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-green-100 dark:bg-green-900/20'
                                    }`}>
                                        <div className='flex items-center justify-between mb-1'>
                                            <span className='text-xs font-semibold'>
                                                {msg.sender === 'AI' ? '🤖 AI Assistant' : msg.sender === 'Agent' ? '👨‍⚕️ Human Agent' : '👤 Caller'}
                                            </span>
                                            <span className='text-xs text-gray-500'>
                                                {new Date(msg.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <p className='text-sm'>{msg.text}</p>
                                    </div>
                                ))
                            ) : (
                                <p className='text-gray-500 text-center py-4'>No conversation transcript available</p>
                            )}
                        </div>
                    </div>

                    {/* AI Analysis */}
                    {selectedLog.aiAnalysis && (
                        <div className='bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg'>
                            <h3 className='font-semibold mb-3'>AI Analysis</h3>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Sentiment</p>
                                    <p className='capitalize'>{selectedLog.aiAnalysis.sentiment || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Urgency Score</p>
                                    <p>{selectedLog.aiAnalysis.urgencyScore || 'N/A'}/10</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Audio Recording */}
                    {selectedLog.audioRecordingUrl && (
                        <div className='bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg'>
                            <h3 className='font-semibold mb-3 flex items-center gap-2'>
                                <Play size={18} />
                                Audio Recording
                            </h3>
                            <audio controls className='w-full'>
                                <source src={selectedLog.audioRecordingUrl} type="audio/webm" />
                                <source src={selectedLog.audioRecordingUrl} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}

                    {/* Summary */}
                    <div className='bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg'>
                        <h3 className='font-semibold mb-3'>Summary</h3>
                        <p className='text-sm'>{selectedLog.summary}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-3 pt-4 border-t border-gray-200 dark:border-zinc-700'>
                        {selectedLog.status !== 'Resolved' && (
                            <>
                                <button
                                    onClick={() => updateEmergencyStatus(selectedLog._id, 'In Progress')}
                                    className='flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition'
                                >
                                    Mark In Progress
                                </button>
                                <button
                                    onClick={() => updateEmergencyStatus(selectedLog._id, 'Resolved')}
                                    className='flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-2'
                                >
                                    <CheckCircle size={18} />
                                    Mark Resolved
                                </button>
                            </>
                        )}
                        {selectedLog.status === 'Resolved' && (
                            <div className='flex-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg flex items-center justify-center gap-2'>
                                <CheckCircle size={18} />
                                Resolved
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
    )
  }


export default Dashboard
