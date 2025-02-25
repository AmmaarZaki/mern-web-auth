import React from 'react'
import { motion } from 'framer-motion'
import { Loader } from 'lucide-react'

const Button = ({
    onClick,
    isLoading = false,
    children,
    type = "button",
    disabled = false
}) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='w-full py-3 px-4 bg-gradient-to-r from-blue-800 to-blue-900 text-blue-200 font-bold rounded-lg shadow-lg 
                hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                focus:ring-offset-gray-900 transition duration-200'
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
        >
            {isLoading ? <Loader className='w-6 h-6 animate-spin  mx-auto' /> : children}
        </motion.button>
    )
}

export default Button