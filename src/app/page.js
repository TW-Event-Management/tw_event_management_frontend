'use client'

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
      <div className='headerr'>
        <input type='checkbox' name='' id='chk1'></input>
        <div className='logo'><h5>GloEvent</h5></div>
        <div className='search-box'>
          <form action=''>
            <input type='text' name='search' id='srch' placeholder='Search'></input>
            <button type='submit'><i className=''></i></button>
          </form>
        </div>
        <ul>
          <li><a href='#'>Home</a></li>
          <li><button className='notification-btn'>
        </button></li>
        <li>
  <button onClick={() => router.push('/profile')}>Profile</button>
</li>
        </ul>
      </div>
      <EventList />
    </div>
  )

}

export default Home;