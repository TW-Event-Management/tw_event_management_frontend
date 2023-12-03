import React from 'react';
import { useRouter } from 'next/navigation';
import ProfileForm from '@/components/molecules/ProfileForm';
import './register-style.css';

const ProfilePage = () => {
    const router = useRouter();

    return(
        <div className='main'>
            <div className='left'>
                <ProfileForm />
            </div>
            <div className='right'>
            </div>
        </div>
    );
}

export default ProfilePage;