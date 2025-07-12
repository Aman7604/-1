import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleNotification = (event) => {
      const { type, message } = event.detail;
      const notification = {
        id: Date.now().toString(),
        type,
        message,
      };

      setNotifications(prev => [...prev, notification]);

      // Auto remove after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000);
    };

    window.addEventListener('showNotification', handleNotification);

    return () => {
      window.removeEventListener('showNotification', handleNotification);
    };
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 md:right-6 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification-light pointer-events-auto flex ring-1 ring-gray-200 hover-lift-light ${
            notification.type === 'success' ? 'notification-success' :
            notification.type === 'error' ? 'notification-error' :
            'notification-info'
          }`}
        >
          <div className="flex-1 p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {notification.type === 'success' ? (
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                ) : notification.type === 'error' ? (
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Info className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {notification.message}
                </p>
                <div className="mt-1 flex items-center space-x-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    notification.type === 'success' ? 'bg-green-500' :
                    notification.type === 'error' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}></div>
                  <span className="text-xs text-gray-500 font-medium">Just now</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => removeNotification(notification.id)}
              className="w-full border border-transparent rounded-none rounded-r-xl p-3 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-300 hover:bg-gray-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}