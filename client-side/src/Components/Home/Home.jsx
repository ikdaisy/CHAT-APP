import React, { useEffect, useState } from "react";
import Api from "../Api";
import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate, Link } from "react-router-dom";

const Home = ({ setUser }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('Token');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [chatMembers, setChatMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState("chats");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({});

  const handleProfileClick = () => {
    setCurrentPage("profile");
  };

  const handleChatClick = () => {
    setCurrentPage("chats");
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (token) {
      try {
        setIsEditing(false);
        const res = await axios.put(`${Api()}/edituser`, profileData, { headers: { "authorization": `Bearer ${token}` } });
        Swal.fire({
          title: 'Updated!',
          text: `${res.data.msg}`,
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'bg-white rounded-lg shadow-md',
            title: 'text-lg font-semibold text-gray-800',
            htmlContainer: 'text-sm text-gray-600',
            confirmButton: 'bg-teal-600 text-white px-5 py-2 rounded hover:bg-teal-700',
          },
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate('/signin');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    if (token) {
      try {
        const res = await axios.get(`${Api()}/getuser`, { headers: { "authorization": `Bearer ${token}` } });
        setProfileData(res.data.user);
        setUser(res.data.user.username);
        // setChatMembers([...new Map(res.data.chatMembers.map(member => [member._id, member])).values()].reverse());
        setChatMembers(res.data.chatMembers)
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate('/signin');
    }
  };

  const handleLogout = () => {
    navigate('/signin');
    localStorage.removeItem('Token');
    setUser('');
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 pt-12 text-black border border-right p-6 flex flex-col">
        <nav>
          <ul className="space-y-4">
            <li>
              <button
                onClick={handleChatClick}
                className="text-lg px-12 py-1 border border-teal-500 text-teal-600 hover:bg-teal-600 hover:text-white flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 8h10M7 12h6m5 8H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14l-4-4z"
                  />
                </svg>
                Chats
              </button>
            </li>
            <li>
              <button
                onClick={handleProfileClick}
                className="text-lg px-12 py-1 border border-teal-500 text-teal-600 hover:bg-teal-600 hover:text-white flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.33 0-6 2.67-6 6h12c0-3.33-2.67-6-6-6z"
                  />
                </svg>
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-lg px-12 border border-teal-500 text-teal-600 hover:bg-teal-600 hover:text-white flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H9m4-4V4a2 2 0 00-2-2H5a2 2 0 00-2 2v16a2 2 0 002 2h6a2 2 0 002-2v-4"
                  />
                </svg>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex-1 bg-white p-8 flex flex-col">
        {currentPage === "chats" ? (
          <>
          <div>
                        <h2 className="text-2xl font-bold text-teal-600 mb-6">Chats</h2>
                        <div className=" w-96grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {chatMembers.map((member) => (
                                <Link to={`/chat/${member._id}`} key={member._id}>
                                    <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition">
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={member.profile}
                                                alt={member.username}
                                                className="w-12 h-12 rounded-full border-2 border-teal-500"
                                            />
                                            <div>
                                                <p className="text-lg font-semibold text-gray-800">{member.username}</p>
                                                <p className="text-sm text-gray-500">Last message...</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                         <button
                onClick={() => { navigate('/contacts'); }}
                className="bg-teal-600 absolute bottom-10 right-20 text-white py-2 px-4 rounded-lg flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 018.5-8.5h.5M15 3h6m-3-3v6"
                  />
                </svg>
                New Chat
              </button>
                    </div>
                    
          </>
        ) : (
          <div>
            <h2 className="text-3xl font-semibold text-teal-600">Your Profile</h2>
            <div className="mt-8 flex items-center space-x-4">
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={profileData.profile}
                  alt="Profile"
                />
              </div>
            </div>
            <div className="mt-8">
              <h4 className="text-xl font-semibold">Account Details</h4>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 p-3 border rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-gray-900"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  disabled={!isEditing}
                  className="mt-1 p-3 border rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-gray-900"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 p-3 border rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-gray-900"
                />
              </div>
            </div>
            <div className="mt-8">
              {!isEditing ? (
                <button
                  onClick={handleEditClick}
                  className="bg-teal-600 text-white py-2 px-4 rounded-lg"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleSaveClick}
                  className="bg-teal-600 text-white py-2 px-4 rounded-lg"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
