import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import Button from '../components/Button';

const UserEmailVerificationPage = () => {

    const [code, setCode] = useState(["", "", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    const { userVerification, error, isLoading } = useAuthStore();

    const handleChange = (index, value) => {

        const newCode = [...code];

        if (value.length > 1 && value.length < 8) {

            const pastedCode = value.slice(0, 7).split("");
            for (let i = 0; i < 7; i++) {
                newCode[i] = pastedCode[i] || "";
            }

            setCode(newCode);

            const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
            const focusIndex = lastFilledIndex < 6 ? lastFilledIndex + 1 : 6;
            inputRefs.current[focusIndex].focus();

        } else {

            newCode[index] = value;
            setCode(newCode);

            if (value && index < 6) {
                inputRefs.current[index + 1].focus();
            }
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join("");

        try {
            await userVerification(verificationCode);
            navigate('/');
            toast.success('Email verified successfully.');

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (code.every((digit) => digit !== "")) {
            handleSubmit(new Event('submit'));
        }
    }, [code]);

    return (
        <div className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-6 w-full max-w-md'>
                <h2 className='text-3xl font-bold mb-2 text-center bg-gradient-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text'>
                    Verify Your Email
                </h2>
                <p className='text-gray-400 text-center mb-6'>
                    Enter the 7-digit code sent to your email address.
                </p>

                <form onSubmit={handleSubmit} className='space-y-7'>
                    <div className='flex justify-between'>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type='text'
                                maxLength='7'
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none'
                            >
                            </input>
                        ))}
                    </div>

                    {error && <p className='text-red-500 font-semibold mt-2'>
                        {error}
                    </p>}

                    <Button type="submit" isLoading={isLoading} disabled={isLoading || code.some((digit) => !digit)}>
                        Verify Email
                    </Button>
                </form>
            </motion.div>
        </div>
    )
}

export default UserEmailVerificationPage