import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { formatDate } from '../utilities/date'
import Button from '../components/Button'
import PasswordDialog from '../components/PasswordDialog'
import toast from 'react-hot-toast'

const UserHomePage = () => {

    const { user, userLogout, isLoading, userDeleteAccount } = useAuthStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleUserLogout = async (e) => {
        e.preventDefault();

        await userLogout();
    }

    const handleUserDeleteAccount = async (password) => {

        setDeleteLoading(true);

        try {
            await userDeleteAccount(password);
            toast.success("User account deleted successfully, redirecting to login page..");

        } catch (error) {

            console.error("Error deleting user account: ", error);
            toast.error("Account deletion failed. Please check your password.");

        } finally {

            setDeleteLoading(false);
            setIsDialogOpen(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className='max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
        >
            <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-700 to-blue-800 text-transparent bg-clip-text pb-1'>
                Home Page
            </h2>

            <div className='space-y-6'>
                <motion.div
                    className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className='text-xl font-semibold text-blue-500 mb-3'>Profile Information</h3>
                    <p className='text-gray-300'>Name: {user.name}</p>
                    <p className='text-gray-300'>Email: {user.email}</p>
                </motion.div>
                <motion.div
                    className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h3 className='text-xl font-semibold text-blue-500 mb-3'>Account Activity</h3>
                    <p className='text-gray-300'>
                        <span className='font-bold'>Joined: </span>
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                    <p className='text-gray-300'>
                        <span className='font-bold'>Last Login: </span>

                        {formatDate(user.lastLogin)}
                    </p>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className='mt-4'
            >
                <Button onClick={handleUserLogout} type="submit">
                    Log Out
                </Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className='mt-4'
            >
                <Button onClick={() => setIsDialogOpen(true)} type="submit">
                    Delete Account
                </Button>
            </motion.div>

            <PasswordDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleUserDeleteAccount}
                isLoading={deleteLoading}
            />
        </motion.div>
    )
}

export default UserHomePage