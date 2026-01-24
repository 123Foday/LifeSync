import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../context/NotificationContext';
import { Bell, X, Check, Calendar, Info, AlertCircle, ArrowRight } from 'lucide-react';

const NotificationDropdown = ({ isOpen, onClose }) => {
    const { notifications, unreadCount, markAsRead, clearAll } = useContext(NotificationContext);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    }

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    const getIcon = (type) => {
        switch (type) {
            case 'appointment_booked':
                return <Calendar className="w-4 h-4 text-green-500" />;
            case 'appointment_cancelled':
                return <X className="w-4 h-4 text-red-500" />;
            case 'appointment_completed':
                return <Check className="w-4 h-4 text-blue-500" />;
            case 'new_doctor':
            case 'new_hospital':
                return <Info className="w-4 h-4 text-indigo-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const handleNotificationClick = (n) => {
        if (!n.read) markAsRead(n._id);
        
        if (n.type.includes('appointment')) {
            navigate('/my-appointments');
        } else if (n.type === 'new_doctor') {
            navigate('/doctors');
        } else if (n.type === 'new_hospital') {
            navigate('/hospitals');
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Mobile Backdrop */}
            <div className={`md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-[90] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
            
            <div 
                ref={dropdownRef}
                className="absolute top-full right-0 mt-3 w-[calc(100vw-32px)] sm:w-[360px] bg-white dark:bg-[#121212] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-zinc-800 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200 origin-top-right scale-100"
                style={{ right: '0', maxWidth: 'calc(100vw - 32px)' }}
            >
            <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/30 dark:bg-zinc-800/20">
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Inbox</h3>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest mt-0.5">
                        {unreadCount} unread messages
                    </p>
                </div>
                {notifications.length > 0 && (
                    <button 
                        onClick={clearAll}
                        className="text-xs font-bold text-[#5f6FFF] hover:text-[#4e5bd8] transition-colors bg-[#5f6FFF]/5 dark:bg-[#5f6FFF]/10 px-3 py-1.5 rounded-lg"
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                    <div className="py-16 text-center px-6">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-zinc-800">
                            <Bell className="w-8 h-8 text-gray-300 dark:text-zinc-700" />
                        </div>
                        <h4 className="text-gray-900 dark:text-white font-bold mb-1">Silence is golden</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            We'll let you know when something important happens on LifeSync.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                        {notifications.map((n) => (
                            <div
                                key={n._id}
                                onClick={() => handleNotificationClick(n)}
                                className={`px-5 py-4 transition-all hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer relative group ${!n.read ? 'bg-[#5f6FFF]/[0.02] dark:bg-[#5f6FFF]/[0.05]' : ''}`}
                            >
                                <div className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${
                                        n.type.includes('cancelled') ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20' :
                                        n.type.includes('booked') ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20' :
                                        'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20'
                                    }`}>
                                        {getIcon(n.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <p className={`text-sm ${!n.read ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'} truncate pr-2`}>
                                                {n.title}
                                            </p>
                                            {!n.read && <div className="w-2 h-2 bg-[#5f6FFF] rounded-full mt-1.5 shadow-[0_0_8px_#5f6FFF]"></div>}
                                        </div>
                                        <p className="text-[13px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-2 uppercase font-medium tracking-tight">
                                            {n.message}
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                            {timeAgo(n.createdAt)}
                                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-zinc-700"></span>
                                            {n.type.split('_').join(' ')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {notifications.length > 0 && (
                <div className="px-5 py-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30">
                    <button 
                        onClick={() => { navigate('/my-appointments'); onClose(); }}
                        className="w-full text-center text-xs font-bold text-gray-500 hover:text-[#5f6FFF] dark:text-gray-400 dark:hover:text-white transition-all flex items-center justify-center gap-2 group"
                    >
                        View Full History
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}
        </div>
    </>
    );
};

export default NotificationDropdown;
