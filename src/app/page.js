'use client'

import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import EventList from '@/components/molecules/EventList';

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
        // redirect to RegisterPage if token doesn't exist
        router.push('/register');
      } else {
        // verify user with token
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
      <h1>Home</h1>
      <p>Hello {firstName}</p>
      <p>Admin: {isAdmin ? 'Yes' : 'No'}</p>
      <p>Mail: {mail}</p>
      <button onClick={() => {
        localStorage.removeItem('token');
        console.log('token removed')
        router.push('/register');
      }}>Logout</button>
      <EventList />
    </div>
  )

}

export default Home;