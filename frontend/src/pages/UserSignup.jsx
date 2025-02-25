import { motion } from "framer-motion";
import { User, Mail, Lock, Loader } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Button from "../components/Button";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import Input from "../components/Input";

const UserSignupPage = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const { userSignup, error, isLoading } = useAuthStore();

    const handleUserSignup = async (e) => {
        e.preventDefault();

        try {
            await userSignup(name, email, password);
            navigate('/userEmailVerification');

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='max-w-md w-full bg-gray-800 bg-opacity-50 bracdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
            <div className='p-8'>
                <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text'>
                    Create Account
                </h2>

                <form onSubmit={handleUserSignup}>
                    <Input
                        icon={User}
                        type='text'
                        placeholder='Full Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                    <Input
                        icon={Mail}
                        type='email'
                        placeholder='Email Address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    <Input
                        icon={Lock}
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />

                    {error && <p className="text-red-500 font-semibold mt-2">
                        {error}
                    </p>}

                    <PasswordStrengthMeter password={password} />

                    <Button type="submit" isLoading={isLoading}>
                        Sign Up
                    </Button>
                </form>
            </div>

            <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
                <p className='text-sm text-gray-400'>
                    Already have an account? {" "}
                    <Link to={"/userLogin"} className='text-blue-400 hover:underline'>
                        Login
                    </Link>
                </p>
            </div>

        </motion.div>
    )
}

export default UserSignupPage;