import React, { useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";
import Api from "../Api";


const Contacts = ({setUser}) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");
  const [contacts, setContacts] = useState([]);
  const [searchQuery,setSearchQuery]=useState("")


  

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    if (token) {
      try {
        const res = await axios.get(`${Api()}/getcontacts`, {
          headers: { authorization: `Bearer ${token}` },
        });
        // console.log(res);
        setContacts(res.data.contacts);
        setUser(res.data.username)
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/signin");
    }
  };

  const filteredContacts=contacts.filter((contact)=>
    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex justify-center items-center min-h-screen">
    <div className="bg-white border border-teal-800 p-5 rounded-lg w-full max-w-3xl shadow-lg">
      {/* Container for search input and list */}
      <div className="w-full">
        {/* Search Input */}
        <div className="relative">
          {/* Search Icon */}
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <circle cx="10" cy="10" r="7" stroke="black" strokeWidth="2" fill="none"/>
              <line x1="15" y1="15" x2="20" y2="20" stroke="black" strokeWidth="2"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search contacts" 
            onChange={(e) => { setSearchQuery(e.target.value); }}
            className="w-full p-3 pl-10 border border-teal-600 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition ease-in-out duration-200"
          />
        </div>
  
        {/* Contact List */}
        <ul className="space-y-4 mt-6 overflow-y-auto max-h-[400px]"> {/* Set max height and enable vertical scrolling */}
          {filteredContacts.map((contact) => (
            <Link to={`/chat/${contact._id}`} key={contact._id}>
              <li className="flex items-center p-4 mb-6 border border-teal-600 rounded-lg hover:bg-teal-600 hover:shadow-md transition cursor-pointer w-full">
                <img
                  src={contact.profile}
                  alt={contact.username}
                  className="w-14 h-14 rounded-full mr-6"
                />
                <p className="text-lg text-gray-800 font-medium flex-1">
                  {contact.username}
                </p>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  </div>


  );
};

export default Contacts;
