import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Api from "../Api";

const SignIn = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${Api()}/signin`, userData);
      if (res.status === 200) {
        localStorage.setItem("Token", res.data.token);
        toast.success(`🎉 ${res.data.msg}!`, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      toast.error(`❌ ${error.response.data.msg}!`, {
        position: "bottom-center",
        autoClose: 3000,
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
    <section className="h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-teal-700 text-center">
          Welcome Back!
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Please login to continue.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 w-full p-3 border rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-gray-900"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Enter your password"
              className="mt-1 w-full p-3 border rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-gray-900"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition"
          >
            Log In
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link
            to="/email"
            className="text-teal-500 hover:underline text-sm"
          >
            Forgot your password?
          </Link>
        </div>
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              to="/email"
              className="text-teal-500 hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default SignIn;
