import React from 'react';
import { ProfileForm } from '../components/ProfileForm';

interface ProfilePageProps {
  onSuccess: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onSuccess }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <ProfileForm onSuccess={onSuccess} />
      </div>
    </div>
  );
};
