import { createContext, useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { AdminContext } from "./AdminContext";
import { DoctorContext } from "./DoctorContext";
import { HospitalContext } from "./HospitalContext";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { aToken, backendUrl } = useContext(AdminContext);
    const { dToken } = useContext(DoctorContext);
    const { hToken } = useContext(HospitalContext);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const getNotifications = useCallback(async () => {
        try {
            let role = '';
            let id = '';
            let token = '';

            if (aToken) {
                role = 'admin';
                token = aToken;
            } else if (dToken) {
                role = 'doctor';
                token = dToken;
                // We'd need the doctor ID here, usually decoded from token or provided by context
            } else if (hToken) {
                role = 'hospital';
                token = hToken;
            }

            if (!role) return;

            const { data } = await axios.get(`${backendUrl}/api/notification/get`, {
                params: { role, id },
                headers: { atoken: aToken, dtoken: dToken, htoken: hToken } // Pass whatever token we have
            });

            if (data.success) {
                setNotifications(data.notifications);
                setUnreadCount(data.notifications.filter(n => !n.read).length);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }, [aToken, dToken, hToken, backendUrl]);

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
            let role = aToken ? 'admin' : dToken ? 'doctor' : 'hospital';
            const { data } = await axios.post(`${backendUrl}/api/notification/clear-all`, { role });
            if (data.success) {
                getNotifications();
            }
        } catch (error) {
            console.error("Error clearing notifications:", error);
        }
    };

    useEffect(() => {
        getNotifications();
        const interval = setInterval(getNotifications, 30000); // Poll every 30 seconds for a "real-time" feel without sockets
        return () => clearInterval(interval);
    }, [getNotifications]);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, clearAll, refreshNotifications: getNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};
