import React from 'react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useParams, useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Button from '../components/Button'
import Input from '../components/Input'

const ResetUserPassword = () => {

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { resetUserPassword, isLoading, error, message } = useAuthStore();
    const { token } = useParams();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Password do not match!")
        } else {
            try {
                await resetUserPassword(token, password);
                toast.success("Password reset successfully, redirecting to login page..");
                setTimeout(() => {
                    navigate("/userLogin");
                }, 1000);

            } catch (error) {
                console.error(error);
                toast.error(error.message || "Error resetting password.");
            }
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
        >
            <div className='p-8'>
                <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text'>
                    Reset Password
                </h2>
                {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
                {message && <p className='text-green-500 text-sm mb-4'>{message}</p>}


                <form onSubmit={handleSubmit}>
                    <Input
                        icon={Lock}
                        type='password'
                        placeholder='New Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Input
                        icon={Lock}
                        type='password'
                        placeholder='Confirm New Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" isLoading={isLoading}>
                        Set New Password
                    </Button>
                </form>
            </div>

        </motion.div>
    )
}

export default ResetUserPassword