import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { HospitalContext } from '../../context/HospitalContext'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Phone, MapPin, User, Clock, Play, X, CheckCircle, AlertTriangle, PhoneCall } from 'lucide-react';

const HospitalDashboard = () => {

  const { hToken, dashData, getDashData, completeAppointment, cancelAppointment, doctors, getDoctors, backendUrl } = useContext(HospitalContext)
  const { currency, slotDateFormat } = useContext(AppContext)
  const { theme } = useTheme()
  const [emergencyLogs, setEmergencyLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (hToken) {
      getDashData()
      getDoctors()
      fetchEmergencyLogs()
      const interval = setInterval(() => {
        getDashData()
        getDoctors()
        fetchEmergencyLogs()
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [hToken])

  const fetchEmergencyLogs = async () => {
    try {
        const { data } = await axios.get(backendUrl + '/api/emergency/all', {
            headers: { Authorization: `Bearer ${hToken}` }
        });
        if (data.success) {
            // Filter to show only this hospital's emergency calls
            // The backend already filters by hospitalId, but we ensure it here too
            setEmergencyLogs(data.data);
        }
    } catch (error) {
        console.error("Failed to fetch emergency logs", error);
    }
  };

  const handleViewDetails = async (logId) => {
    try {
        const { data } = await axios.get(`${backendUrl}/api/emergency/${logId}`, {
            headers: { Authorization: `Bearer ${hToken}` }
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
            headers: { Authorization: `Bearer ${hToken}` }
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
          <p className='text-gray-500 dark:text-gray-400 font-medium animate-pulse'>Loading Hospital Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='m-5 transition-all duration-300'>
      <div className='flex items-center justify-between mb-6'>
        <div></div>
        <Link
          to='/hospital-emergency-call-center'
          className='bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 shadow-lg hover:shadow-xl'
        >
          <PhoneCall size={20} />
          Emergency Call Center
        </Link>
      </div>

      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white dark:bg-zinc-900 p-4 min-w-52 rounded-xl border border-gray-100 dark:border-zinc-800 cursor-pointer hover:shadow-md transition-all'>
          <img className='w-14' src={assets.people_icon} alt="" />
          <div>
            <p className='text-xl font-bold text-gray-800 dark:text-gray-100'>{doctors.length}</p>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>Doctors</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white dark:bg-zinc-900 p-4 min-w-52 rounded-xl border border-gray-100 dark:border-zinc-800 cursor-pointer hover:shadow-md transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-bold text-gray-800 dark:text-gray-100'>{dashData.appointments}</p>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>Total Appts</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white dark:bg-zinc-900 p-4 min-w-52 rounded-xl border border-gray-100 dark:border-zinc-800 cursor-pointer hover:shadow-md transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-bold text-gray-800 dark:text-gray-100'>{dashData.bookedCount}</p>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>Booked</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white dark:bg-zinc-900 p-4 min-w-52 rounded-xl border border-gray-100 dark:border-zinc-800 cursor-pointer hover:shadow-md transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-bold text-gray-800 dark:text-gray-100'>{dashData.patients}</p>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>Total Patients</p>
          </div>
        </div>
      </div>

      {/* Emergency Logs Section - Premium Design */}
      <div className='bg-red-50 dark:bg-red-900/10 rounded-xl overflow-hidden shadow-sm border border-red-100 dark:border-red-900/20 mt-10'>
        <div className='flex items-center justify-between px-6 py-4 bg-red-100 dark:bg-red-900/20 border-b border-red-200 dark:border-red-900/30'>
            <div className='flex items-center gap-2.5'>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <p className='font-bold text-red-700 dark:text-red-400'>Live Emergency Feed (IVR & AI Assistant)</p>
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
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">No recent emergency calls recorded.</div>
        )}
      </div>

      {/* Emergency Details Modal */}
      {showDetails && selectedLog && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4' onClick={() => setShowDetails(false)}>
            <div className='bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
                <div className='sticky top-0 bg-red-100 dark:bg-red-900/20 px-6 py-4 border-b border-red-200 dark:border-red-900/30 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <AlertTriangle className='text-red-600' size={20} />
                        <h2 className='font-bold text-red-700 dark:text-red-400'>Emergency Call Details</h2>
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

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10'>
        {/* Trends Chart */}
        <div className='lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800'>
          <h2 className='text-lg font-bold text-gray-800 dark:text-gray-100 mb-6'>Facility Activity Trends</h2>
          <div className='h-[300px] w-full'>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashData.trends}>
                <defs>
                  <linearGradient id="hospitalColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
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
                  contentStyle={{backgroundColor: theme === 'dark' ? '#18181b' : '#fff', borderRadius: '8px', border: 'none'}}
                />
                <Area type="monotone" dataKey="count" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#hospitalColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className='bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800'>
          <h2 className='text-lg font-bold text-gray-800 dark:text-gray-100 mb-6'>Appointment Status</h2>
          <div className='h-[300px] w-full'>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashData.statusDistribution}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#10B981" />
                  <Cell fill="#F87171" />
                  <Cell fill="#5F6FFF" />
                </Pie>
                <Tooltip 
                   contentStyle={{backgroundColor: theme === 'dark' ? '#18181b' : '#fff', borderRadius: '8px', border: 'none'}}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className='flex flex-wrap justify-center gap-4 mt-4'>
              {['Completed', 'Cancelled', 'Active'].map((label, i) => (
                <div key={label} className='flex items-center gap-1.5'>
                  <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-green-500' : i === 1 ? 'bg-red-400' : 'bg-primary'}`}></div>
                  <span className='text-[10px] uppercase font-bold text-gray-500'>{label}</span>
                </div>
              ))}
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
          {
            dashData.latestAppointments.map((item, index) => (
              <div className='flex items-center px-6 py-4 gap-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors' key={index}>
                <img className='rounded-full w-10 border dark:border-zinc-800' src={item.userData.image} alt="" />
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 dark:text-gray-100 font-medium'>{item.userData.name}</p>
                  <p className='text-gray-600 dark:text-gray-400'>{slotDateFormat(item.slotDate)}</p>
                </div>
                {
                  item.status === 'rejected' ? (
                    <p className='text-red-400 text-xs font-medium bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded'>Rejected</p>
                  ) : item.cancelled ? (
                    <p className='text-red-400 text-xs font-medium bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded'>Cancelled</p>
                  ) : (item.status === 'booked' || item.isCompleted) ? (
                    <p className='text-green-500 text-xs font-medium bg-green-50 dark:bg-green-900/10 px-2 py-1 rounded'>Booked</p>
                  ) : (
                    <div className='flex gap-2'>
                      <img onClick={() => cancelAppointment(item._id)} className='w-8 cursor-pointer hover:scale-110 transition-transform' src={assets.cancel_icon} alt="" />
                      <img onClick={() => completeAppointment(item._id)} className='w-8 cursor-pointer hover:scale-110 transition-transform' src={assets.tick_icon} alt="" />
                    </div>
                  )

                }
              </div>
            ))
          }

        </div>
      </div>

      {/* Hospital Doctors Section */}
      <div className='bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800 mt-10'>
        <div className='flex items-center gap-2.5 px-6 py-4 bg-white dark:bg-zinc-950 border-b dark:border-zinc-800'>
          <img src={assets.people_icon} alt="" />
          <p className='font-semibold text-gray-800 dark:text-gray-100'>Your Doctors ({doctors.length})</p>
        </div>

        {doctors && doctors.length > 0 ? (
          <div className='divide-y dark:divide-zinc-800'>
            {
              doctors.map((doctor, index) => (
                <div className='flex items-center px-6 py-4 gap-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors' key={index}>
                  <img className='rounded-full w-10 border dark:border-zinc-800' src={doctor.image} alt="" />
                  <div className='flex-1 text-sm'>
                    <p className='text-gray-800 dark:text-gray-100 font-medium'>{doctor.name}</p>
                    <p className='text-gray-600 dark:text-gray-400'>{doctor.speciality}</p>
                  </div>
                  <p className={`text-xs font-medium px-2 py-1 rounded ${doctor.available ? 'text-green-500 bg-green-50 dark:bg-green-900/10' : 'text-red-500 bg-red-50 dark:bg-red-900/10'}`}>
                    {doctor.available ? 'Available' : 'Not Available'}
                  </p>
                </div>
              ))
            }
          </div>
        ) : (
          <div className='px-6 py-12 text-center text-gray-500 dark:text-gray-400'>
            <p>No doctors assigned to this hospital yet</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default HospitalDashboard
