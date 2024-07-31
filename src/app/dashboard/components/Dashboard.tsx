import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

const Dashboard: React.FC = () => {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return null; // This will not be rendered as useEffect will redirect
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
            <p>You are logged in!</p>
            <button
                onClick={logout}
                className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition duration-300"
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;