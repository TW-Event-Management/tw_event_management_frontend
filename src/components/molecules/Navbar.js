// Navbar.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './navbar.css';

const Navbar = ({ isAdmin: propIsAdmin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(propIsAdmin);

  const handleCreateClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      console.log(token);

      if (!token) {
        // redirect to RegisterPage if token doesn't exist
        router.push('/register');
      } else {
        // verify user with token
        try {
          const response = await axios.post('http://localhost:3000/register/verify-token', {
            token: token,
          });
          setIsAdmin(response.data.user.admin);
        } catch (error) {
          console.error(error);
        }
      }
    };

    checkToken();
  }, []);

  return (
    <div>
      <div className='navbar'>
        <div className='left'>
          <h1 className='events-title'>Events</h1>
        </div>
        <div className='right'>
          <ul>
            {isAdmin && <li className='admin-only' onClick={handleCreateClick}>Create</li>}
            <li className='notification'>Notification</li>
            <li>
              <button className='profile-btn'><a href='#'></a></button>
            </li>
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            {/* Add your modal content here */}
            <p>This is the modal content.</p>
            <button onClick={handleCloseModal}>Close Modal</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
