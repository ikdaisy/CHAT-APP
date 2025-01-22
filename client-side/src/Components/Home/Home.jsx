import React, { useEffect, useState } from "react";
import Api from "../Api";
import axios from "axios";
import Swal from 'sweetalert2';
import '../../App.css'
import { useNavigate, Link } from "react-router-dom";

const Home = ({ setUser }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('Token');
  const [chatMembers, setChatMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState("chats");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [searchQuery,setSearchQuery]=useState("")
const filteredContacts=chatMembers.filter((mb)=>
      mb.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
 
const handleImageChange=async(e)=>{
  console.log(e.target.files[0]);
    
  const profile=await convertBase64(e.target.files[0])
  // console.log(profile);
  setProfileData((pre)=>({...pre,profile:profile}))
}
function convertBase64(file){
  return new Promise((resolve,reject)=>{
      const fileReader=new FileReader()
      // console.log(fileReader);
      fileReader.readAsDataURL(file)
      fileReader.onload=()=>{
          resolve(fileReader.result);

      }
      fileReader.onerror=(error)=>{
          reject(error);
      }
      
  })

}
 
const handleOpenChat=async(_id)=>{
  try {
    const res = await axios.get(`${Api()}/openchat/${_id}`,{ headers: { "authorization": `Bearer ${token}` } })
    console.log(res);
    fetchUser()
    
    
  } catch (error) {
    console.log(error.response);
    
    
  }
}
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

  // useEffect(() => {
  //   const interval = setInterval(()=>{
  //   fetchUser();

  //   },1000)
  //   return ()=>clearInterval(interval)
  // }, []);

  useEffect(()=>{
fetchUser()
  },[])

  const fetchUser = async () => {
    if (token) {
      try {
        const res = await axios.get(`${Api()}/getuser`, { headers: { "authorization": `Bearer ${token}` } });
        setProfileData(res.data.user);
        setUser(res.data.user.username);
        setChatMembers([...new Map(res.data.chatMembers.map(member => [member._id, member])).values()].reverse());
       
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate('/signin');
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your account!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#008080', // Teal color
      cancelButtonColor: '#f4f4f4', // Light background for cancel
      confirmButtonText: '<span style="color: white;">Yes, log me out!</span>', // White text
      cancelButtonText: '<span style="color: #333;">Cancel</span>', // Dark text for contrast
      background: '#ffffff', // White background
      color: '#333', // Dark text for the popup content
      customClass: {
        title: 'text-lg font-bold', // Optional: Add extra styling
        content: 'text-sm',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform logout actions
        setUser('');
        navigate('/signin');
        localStorage.removeItem('Token');
  
        Swal.fire({
          title: 'Logged Out',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
          background: '#ffffff', // White background
          color: '#008080', // Teal text
          iconColor: '#008080', // Teal icon
        });
      }
    });
  };
 
  

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-64 pt-12 text-black border border-right p-6 flex flex-col">
        <nav>
          <ul className="space-y-4">
            <li>
              <button
                onClick={handleChatClick}
                className="text-lg w-full py-1 border border-teal-500 text-teal-600 hover:bg-teal-600 hover:text-white flex items-center justify-center"
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
                className="text-lg w-full py-1 border border-teal-500 text-teal-600 hover:bg-teal-600 hover:text-white flex items-center justify-center"
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
                className="text-lg w-full py-1 border border-teal-500 text-teal-600 hover:bg-teal-600 hover:text-white flex items-center justify-center"
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
                        <div className="relative mb-6">
        {/* Search Icon */}
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <circle cx="10" cy="10" r="7" stroke="black" strokeWidth="2" fill="none"/>
  <line x1="15" y1="15" x2="20" y2="20" stroke="black" strokeWidth="2"/>
</svg>
        </span>
        <input
          type="text"
          placeholder="Search contacts" onChange={(e)=>{setSearchQuery(e.target.value)}}
          className="w-full p-3  pl-10 border border-teal-600 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition ease-in-out duration-200"
        />
      </div>
                        <div className=" w-96grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredContacts.map((member) => (
                                <Link to={`/chat/${member._id}`} key={member._id} onClick={()=>{handleOpenChat(member._id)}}>
                                    <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition flex justify-between items-center">
  <div className="flex items-center space-x-4">
    <img
      src={member.profile}
      alt={member.username}
      className="w-12 h-12 rounded-full border-2 border-teal-500"
    />
    <div>
      <p className="text-lg font-semibold text-gray-800">{member.username}</p>
      <p className="text-sm text-gray-500 truncate w-32">
        {member.lastMessage || "No messages yet..."}
      </p>
    </div>
  </div>
  <div className="text-right">
  {member.lastMessageTime && (
    <p className='text-teal-600'>
    {(() => {
      try {
        // Date in DD/MM/YYYY format
        const [day, month, year] = member.lastMessageDate.split('/').map(Number);
        
        // Time in h:mm:ss a format (12-hour format with AM/PM)
        const [time, ampm] = member.lastMessageTime.split(' ');
        const [hours, minutes, seconds] = time.split(':').map(Number);
        
        // Convert 12-hour format to 24-hour format
        const hours24 = ampm.toLowerCase() === 'am' ? (hours === 12 ? 0 : hours) : (hours === 12 ? 12 : hours + 12);
        
        // Create a Date object from the parsed components
        const lastMessageDateTime = new Date(year, month - 1, day, hours24, minutes, seconds);

        // Get the current date and time
        const now = new Date();
        
        // Check if the message was sent on the same day
        const isSameDay = lastMessageDateTime.getFullYear() === now.getFullYear() &&
                          lastMessageDateTime.getMonth() === now.getMonth() &&
                          lastMessageDateTime.getDate() === now.getDate();

        // Return time if same day, otherwise return date
        return isSameDay ? member.lastMessageTime : member.lastMessageDate;
      } catch (error) {
        console.error("Error parsing date/time:", error);
        return member.lastMessageTime; // Fallback to date if parsing fails
      }
    })()}
  </p>
  )}
  {member.unreadCount > 0 && (
    <div className="bg-teal-600 text-white text-xs font-bold ms-6 w-6 h-6 flex items-center justify-center rounded-full">
      {member.unreadCount}
    </div>
  )}
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
            <div className="w-24 h-24 rounded-full overflow-hidden relative group">
  <img
    className="w-full h-full object-cover"
    src={profileData.profile} 
    alt="Profile" 
  />
  {isEditing && (
    <label
      htmlFor="profile"
      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 12.5a7.5 7.5 0 1115 0M12 8v9m0 0l3.5-3.5M12 17l-3.5-3.5"
        />
      </svg>
      <span className="ml-2">Edit</span>
      <input
        id="profile"
        type="file"
       
        className="hidden"
        onChange={handleImageChange}
      />
    </label>
  )}
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
