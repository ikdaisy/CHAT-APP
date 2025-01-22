import React, { useState } from "react";
import axios from "axios";
import Api from "../Api";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const email = localStorage.getItem("Email");
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    username: "",
    email: email,
    phone: "",
    password: "",
    cpassword: "",
    profile: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    cpassword: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));

    // Validation while typing
    if (name === "password") {
      const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
      if (!passwordRegex.test(value)) {
        setErrors((prev) => ({ ...prev, password: "Password must be 8-16 characters, include uppercase, lowercase, number, and special character." }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }

    if (name === "cpassword") {
      if (value !== userData.password) {
        setErrors((prev) => ({ ...prev, cpassword: "Passwords do not match." }));
      } else {
        setErrors((prev) => ({ ...prev, cpassword: "" }));
      }
    }

    if (name === "phone") {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(value)) {
        setErrors((prev) => ({ ...prev, phone: "Phone number must be a 10-digit number." }));
      } else {
        setErrors((prev) => ({ ...prev, phone: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.password || errors.cpassword || errors.phone) {
      toast.error("Please fix the errors before submitting.", {
        position: "bottom-center",
        autoClose: 5000,
        theme: "dark",
      });
      return;
    }

    try {
      const res = await axios.post(`${Api()}/signup`, userData);
      if (res.status === 201) {
        toast.success(`🦄 ${res.data.msg}!`, {
          position: "bottom-center",
          autoClose: 5000,
          theme: "dark",
        });
        setTimeout(() => {
          navigate("/signin");
        }, 5000);
      }
    } catch (error) {
      toast.error(`🦄 ${error.response.data.msg}!`, {
        position: "bottom-center",
        autoClose: 5000,
        theme: "dark",
      });
    }
  };

  const handleFile = async (e) => {
    const profile = await convertToBase64(e.target.files[0]);
    setUserData((prev) => ({ ...prev, profile: profile }));
  };

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  return (
    <section className="h-screen flex items-center justify-center bg-teal-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-teal-700 text-center">
          Create Your Account
        </h2>
        <p className="text-gray-600 text-center mt-2">It's quick and easy.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              placeholder="Enter your name"
              className="mt-1 w-full p-3 border rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={handleFile}
              className="mt-1 w-full p-3 border rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              type="text"
              name="phone"
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="mt-1 w-full p-3 border rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-gray-900"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
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
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div>
            <label
              htmlFor="cpassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="cpassword"
              onChange={handleChange}
              placeholder="Confirm your password"
              className="mt-1 w-full p-3 border rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-gray-900"
            />
            {errors.cpassword && <p className="text-red-500 text-sm">{errors.cpassword}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition"
          >
            Create Account
          </button>
        </form>
        <ToastContainer />
      </div>
    </section>
  );
};

export default SignUp;
