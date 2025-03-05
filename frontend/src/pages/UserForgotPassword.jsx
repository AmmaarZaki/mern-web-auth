import React from 'react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore';
import Input from '../components/Input';
import { ArrowLeft, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-hot-toast";

const UserForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [captchaStatus, setCaptchaStatus] = useState(false);
    const [captchaToken, setCaptchaToken] = useState('');

    const { isLoading, userForgotPassword, error } = useAuthStore();

    const onSuccessCaptcha = async (token) => {
        setCaptchaToken(token);
        setCaptchaStatus(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (captchaStatus) {
            try {
                await userForgotPassword(email, captchaToken);
                setIsSubmitted(true);
            } catch (error) {
                console.log("Error:", error);
            }

        } else {
            toast.error("Verify that you are not a robot!");
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
                <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text pb-1'>
                    Forgot Password
                </h2>

                {!isSubmitted ? (
                    <form onSubmit={handleSubmit}>
                        <p className='text-gray-300 mb-6 text-center'>
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        <Input
                            icon={Mail}
                            type='email'
                            placeholder='Email Address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <div className="flex justify-center items-center mb-4">
                            <ReCAPTCHA
                                sitekey="6LcQReoqAAAAAOO3kfgs37-Xga30L_bwZxgqAySz"
                                onChange={onSuccessCaptcha}
                            />
                        </div>

                        <Button type="submit" isLoading={isLoading}>
                            Send Reset Link
                        </Button>
                        {error && <p className='text-red-500 font-semibold pt-1'>
                            {error}
                        </p>}
                    </form>
                ) : (
                    <div className='text-center'>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className='w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4'
                        >
                            <Mail className='h-8 w-8 text-blue-200' />
                        </motion.div>
                        <p className='text-gray-300 mb-6'>
                            If an account exists for {email}, you will receive a password reset link shortly.
                        </p>
                    </div>
                )}
            </div>

            <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
                <Link to={"/userLogin"} className='text-sm text-blue-200 hover:underline flex items-center'>
                    <ArrowLeft className='h-4 w-4 mr-2' /> Back To Login
                </Link>
            </div>

        </motion.div>
    )
}

export default UserForgotPassword