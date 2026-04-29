import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config/URL";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import { useNotification } from "../../context/NotificationContext";
import { Spin } from "antd";

const NotificationSection = () => {
    const { notifications, loading } = useNotification();
    const { user, token } = useAuth();

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col h-[400px]">
            <h3 className="text-lg font-bold text-gray-800 mb-4 shrink-0">Notification Section</h3>
            {loading ? (
                 <div className="flex-1 flex justify-center items-center p-4"><Spin /></div>
            ) : notifications.length > 0 ? (
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                    {notifications.map((notification) => (
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