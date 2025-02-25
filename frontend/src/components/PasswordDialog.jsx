import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PasswordDialog = ({ isOpen, onClose, onConfirm, isLoading }) => {

    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 border border-gray-700"
            >
                <h2 className="text-xl font-semibold text-blue-500 mb-3">Confirm Account Deletion</h2>
                <p className="text-gray-300 mb-4">Please enter your password to delete your account.</p>

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-700 rounded bg-gray-800 text-gray-300"
                    placeholder="Enter your password"
                />

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(password)}
                        className={`px-4 py-2 rounded ${isLoading ? 'bg-gray-500' : 'bg-red-600 hover:bg-red-700'} text-blue-200`}
                        disabled={isLoading}
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default PasswordDialog;
