'use client'
import { useAuth } from '@/hooks/auth'
import AdminDashboard from '@/components/AdminDashboard'
import UserDashboard from '@/components/UserDashboard'

const Dashboard = () => {
    const { user } = useAuth() // Get the user data from your authentication hook
    console.log(user)

    return (
        <div className="p-6">
            {/* Display the user's name */}
            {user ? (
                <>
                    {/* Conditional rendering based on user role */}
                    {user.role === 'admin' ? (
                        <AdminDashboard />
                    ) : (
                        <UserDashboard />
                    )}
                </>
            ) : (
                <p className="mt-4 text-lg">Welcome to the Dashboard!</p>
            )}
            {/* Additional dashboard content goes here */}
        </div>
    )
}

export default Dashboard
