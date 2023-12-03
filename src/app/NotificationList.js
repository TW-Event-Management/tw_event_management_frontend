import React from 'react';
import './NotificationList.css'

const NotificationList = ({notifications, onClose}) => {
  return (
    <div className="notification-list">
      <div className="notification-header">
        <span>Notifications</span>
        <button onClick={onClose}>X</button>
      </div>
      <ul>
        {notifications.map(notification => (
          <li key={notification.id} className="notification-item">
            {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
