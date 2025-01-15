import React, { useEffect, useState } from "react";
import Api from "../Api";
import axios from "axios";
import { useNavigate,Link, useParams } from "react-router-dom";

const UserProfile = ({setUser}) => {
  const token = localStorage.getItem("Token");
    const {_id}=useParams()
    const [receiver, setReceiver] = useState({});
    useEffect(() => {
        fetchUser();
      }, []);
    
      const fetchUser = async() => {
       if(token){
        try {
            const res = await axios.get(`${Api()}/getreceiver/${_id}`, { headers: { "authorization": `Bearer ${token}` } });
            console.log(res);
            setReceiver(res.data.ruser)
            setUser(res.data.username)

            
            
        } catch (error) {
            console.log(error);
        }
       }
       else{
        navigate('/signin')
       }
      };

  return (
    <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 max-w-sm mx-auto mt-10">
      {/* Profile Picture */}
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-teal-500 mb-4">
        <img
          src={receiver.profile}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* User Info */}
      <h2 className="text-xl font-semibold text-teal-600 mb-2"></h2>
      <p className="text-gray-600 mb-1">
        <strong>Email:</strong> {receiver.email}
      </p>
      <p className="text-gray-600">
        <strong>Phone:</strong> {receiver.phone}
      </p>

      {/* Edit Button */}
      <Link to={`/chat/${receiver._id}`}><button
        className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-200"
      >
       Back to Chat
      </button></Link>
    </div>
  );
};

export default UserProfile;
