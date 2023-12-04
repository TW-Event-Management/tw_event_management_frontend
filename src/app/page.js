'use client';

import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import EventList from '@/components/molecules/EventList';
import './navbar.css';

const Home = () => {
  const router = useRouter();

  const [mail, setMail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Move state declaration here

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
        router.push('/register');
      } else {
        try {
          const response = await axios.post('http://localhost:3000/register/verify-token', {
            token: token,
          });

          setFirstName(response.data.user.firstName);
          setIsAdmin(response.data.user.admin);
          setMail(response.data.user.email);
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
      <div className='content'>
        <EventList />
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

export default Home;
