import React, { useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";
import Api from "../Api";

const Contacts = ({setUser}) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");
  const [contacts, setContacts] = useState([]); // Example contacts

  

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    if (token) {
      try {
        const res = await axios.get(`${Api()}/getcontacts`, {
          headers: { authorization: `Bearer ${token}` },
        });
        console.log(res);
        setContacts(res.data.contacts);
        setUser(res.data.username)
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/signin");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="bg-white border border-teal-800 p-6 rounded-lg w-full max-w-3xl shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Select a Contact</h3>
        <ul className="space-y-4">
          {contacts.map((contact) => (
           <Link to={`/chat/${contact._id}`}>
            <li
              key={contact._id}
              
              className="flex items-center p-4 border border-teal-600 rounded-lg hover:bg-teal-600 hover:shadow-md transition cursor-pointer w-full"
            >
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
  );
};

export default Contacts;
