import React, { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { onMessageListener } from '../services/firebaseService';
import { useNavigate } from 'react-router-dom';

const Notification = () => {
  const [notification, setNotification] = useState({ title: '', body: '' });
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onMessageListener()
      .then((payload) => {
        setNotification({
          title: payload.notification.title,
          body: payload.notification.body
        });
        setIsOpen(true);

        // Handle chat message notifications
        if (payload.data && payload.data.type === 'chat_message') {
          const { booking_id, message, timestamp } = payload.data;
          toast.info(
            <div>
              <div className="font-bold">{payload.notification.title}</div>
              <div>{payload.notification.body}</div>
              <div className="text-sm text-gray-500 mt-1">{message}</div>
            </div>,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              onClick: () => navigate(`/booking/${booking_id}/chat`)
            }
          );
        } else {
          // Handle other types of notifications
          toast.info(payload.notification.body, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      })

    return () => {
      unsubscribe;
    };
  }, [navigate]);

  return (
    <div className="relative">
      <button
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBell className="h-6 w-6" />
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-50">
            <h3 className="font-semibold mb-2">{notification.title}</h3>
            <p className="text-sm text-gray-600">{notification.body}</p>
          </div>
        )}
      </button>
    </div>
  );
};

export default Notification; 