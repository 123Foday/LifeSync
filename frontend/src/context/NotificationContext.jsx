import { createContext, useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { AppContext } from "./AppContext";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { token, userData, backendUrl } = useContext(AppContext);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const getNotifications = useCallback(async () => {
        try {
            if (!token || !userData) return;

            const { data } = await axios.get(`${backendUrl}/api/notification/get`, {
                params: { role: 'user', id: userData._id },
            });

            if (data.success) {
                setNotifications(data.notifications);
                setUnreadCount(data.notifications.filter(n => !n.read).length);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }, [token, userData, backendUrl]);

    const markAsRead = async (notificationId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/notification/mark-read`, { notificationId });
            if (data.success) {
                getNotifications();
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const clearAll = async () => {
        try {
            if (!userData) return;
            const { data } = await axios.post(`${backendUrl}/api/notification/clear-all`, { role: 'user', id: userData._id });
            if (data.success) {
                getNotifications();
            }
        } catch (error) {
            console.error("Error clearing notifications:", error);
        }
    };

    useEffect(() => {
        if (token && userData) {
            getNotifications();
            const interval = setInterval(getNotifications, 30000); 
            return () => clearInterval(interval);
        }
    }, [token, userData, getNotifications]);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, clearAll, refreshNotifications: getNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};
