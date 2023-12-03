import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfileForm = () => {
    const [storedEmail, setStoredEmail] = useState('');
    const [userInfo, setUserInfo] = useState({
        id: '',
        firstName: '',
        lastName: ''
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                if (typeof window !== 'undefined') {
                    const emailFromLocalStorage = localStorage.getItem('email');
                    setStoredEmail(emailFromLocalStorage || '');

                    if (emailFromLocalStorage) {
                        const resp = await axios.get('http://localhost:3000/users/get-all');
                        console.log(resp);
                        const { id, firstName, lastName } = response.data;

                        setUserInfo({
                            id: id,
                            firstName: firstName,
                            lastName: lastName
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching user information:', error);
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <div>
            <h1>User Profile</h1>
            <p>Email: {storedEmail}</p>
            <p>ID: {userInfo.id}</p>
            <p>First Name: {userInfo.firstName}</p>
            <p>Last Name: {userInfo.lastName}</p>
        </div>
    );
};

export default ProfileForm;
