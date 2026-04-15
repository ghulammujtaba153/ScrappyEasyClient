import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config/URL";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import { Spin } from "antd";

const NotificationSection = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, token } = useAuth();

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user?._id && !user?.id) {
                setLoading(false);
                return;
            }

            try {
                // Correctly fetching from the user-specific route
                const response = await axios.get(`${BASE_URL}/api/notifications/user/${user._id || user.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                // The API directly returns an array of notifications
                if (Array.isArray(response.data)) {
                    setData(response.data);
                } else if (response.data?.success) {
                    setData(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [user, token]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col h-[400px]">
            <h3 className="text-lg font-bold text-gray-800 mb-4 shrink-0">Notification Section</h3>
            {loading ? (
                 <div className="flex-1 flex justify-center items-center p-4"><Spin /></div>
            ) : data.length > 0 ? (
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                    {data.map((notification) => (
                        <div 
                            key={notification._id} 
                            className={`p-4 border rounded-lg transition-colors ${notification.isRead ? 'bg-gray-50 border-gray-100 hover:bg-gray-100' : 'bg-blue-50 border-blue-100 hover:bg-blue-100'}`}
                        >
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="font-semibold text-gray-800 leading-tight">{notification.title}</h3>
                                {!notification.isRead && (
                                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1 shrink-0"></span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{notification.description}</p>
                            <span className="text-xs text-gray-400 mt-2 block font-medium">
                                {new Date(notification.createdAt).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500 text-center">No notifications yet.</p>
                </div>
            )}
        </div>
    );
};

export default NotificationSection;