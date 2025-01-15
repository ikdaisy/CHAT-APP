import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Api from '../Api';

const Email = () => {
  const api = Api();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [type, setType] = useState("signup"); // Default to signup

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangeType = (e) => {
    setType(e.target.value);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post(`${api}/checkemail`, { email, type }); // Include type in the request body
      localStorage.setItem('Email', email);
      if (res.status === 200) {
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
        }, 6000);
      }
    } catch (error) {
      toast.error(`🦄 ${error.response?.data || "An error occurred"}!`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <section className="py-10 bg-teal-50 sm:py-16 lg:py-24">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold leading-tight text-teal-800 sm:text-4xl lg:text-5xl">Email Verification</h2>
          <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-teal-600">Please enter your email to receive a verification link</p>
        </div>

        <div className="relative max-w-md mx-auto mt-8 md:mt-16">
          <div className="overflow-hidden bg-white rounded-md shadow-md">
            <div className="px-4 py-6 sm:px-8 sm:py-7">
              <form>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="email" className="text-base font-medium text-teal-900">Email address</label>
                    <div className="mt-2.5 relative text-teal-400 focus-within:text-teal-600">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        onChange={handleChangeEmail}
                        className="block w-full py-4 pl-10 pr-4 text-black placeholder-teal-500 transition-all duration-200 bg-white border border-teal-200 rounded-md focus:outline-none focus:border-teal-600 caret-teal-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="type" className="text-base font-medium text-teal-900">Type</label>
                    <div className="mt-2">
                      <select
                        id="type"
                        name="type"
                        value={type}
                        onChange={handleChangeType}
                        className="block w-full py-4 pl-4 pr-10 text-black bg-white border border-teal-200 rounded-md focus:outline-none focus:border-teal-600"
                        required
                      >
                        <option value="signup">Sign Up</option>
                        <option value="forgot-password">Forgot Password</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 bg-teal-600 border border-transparent rounded-md focus:outline-none hover:bg-teal-700 focus:bg-teal-700"
                    >
                      Verify Email
                    </button>
                    <ToastContainer />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Email;
