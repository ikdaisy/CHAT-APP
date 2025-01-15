import axios from 'axios';
import React, { useState } from 'react';
import Api from '../Api';
import { ToastContainer, toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';

const ConfirmPassword = () => {
    const navigate= useNavigate()
    const email=localStorage.getItem('Email')
    console.log(email);
    
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit =async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
    } 
    const res = await axios.post(`${Api()}/changepassword`,{email,password})
   toast.success(`🦄 ${res.data.msg}!`, {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        });
                        
                        setTimeout(() => {
                           navigate('/signin');
                          }, 5000);
      
    
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Confirm Password</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full mt-2 p-3 border rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full mt-2 p-3 border rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          >
            Confirm Password
          </button>
            <ToastContainer />
        </form>
      </div>
    </div>
  );
};

export default ConfirmPassword;
