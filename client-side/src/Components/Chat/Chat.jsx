import { useEffect, useState } from "react";

import { FaArrowLeft, FaEllipsisV, FaTrashAlt } from "react-icons/fa";
// Importing the back arrow icon
import { useNavigate, useParams,Link } from "react-router-dom";
import axios from "axios";
import Api from "../Api";


const Chat = ({ setUser }) => {
  const navigate = useNavigate();
  const [sender, setSender] = useState({});
  const [receiver, setReceiver] = useState({});
  const [message, setMessage] = useState(""); 
  const [messages, setMessages] = useState([]); 
  const [uid, setUid] = useState('');
  const [showDeleteMenu, setShowDeleteMenu] = useState(false); 
  const token = localStorage.getItem("Token");
  const { _id } = useParams();

  useEffect(() => {
     const interval = setInterval(()=>{
      fetchContacts()
 
     },1000)
     return ()=>clearInterval(interval)
   }, []);

  const fetchContacts = async () => {
    if (token) {
      try {
        const res = await axios.get(`${Api()}/getcontact/${_id}`, {
          headers: { authorization: `Bearer ${token}` },
        });
        setMessages(res.data.chats);
        setUid(res.data.uid);
        setReceiver(res.data.receiver);
        setSender(res.data.sender);
        setUser(res.data.sender.username);
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/signin");
    }
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      const currentDate = new Date();
      const [date, time] = currentDate.toLocaleString().split(', ');

      try {
        await axios.post(`${Api()}/addmessage/${_id}`, { message, date, time }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchContacts();
        setMessage("");
      } catch (error) {
        console.log(error);
      }
    }
  };
  
  const [deleteMenuMessageId, setDeleteMenuMessageId] = useState(null); // Track which message's menu is active
  
  // Function to toggle delete menu for a specific message
  const toggleDeleteMenu = (messageId) => {
    setDeleteMenuMessageId(deleteMenuMessageId === messageId ? null : messageId);
  };
  
  const handleDeleteMessage = async (_id) => {
    try {
      await axios.delete(`${Api()}/deletemessage/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(messages.filter((msg) => msg._id !== _id));
      setDeleteMenuMessageId(null); // Reset the active menu
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-teal-50">
      {/* Header with Back Arrow and Profile */}
      <div className="flex items-center border border-teal-600 hover:bg-teal-500 p-2 ">
        <button
          onClick={() => navigate("/")}
          className="text-teal-600 hover:text-teal-800 mr-4"
        >
          <FaArrowLeft size={20} />
        </button>
        <Link to={`/userprofile/${receiver._id}`} className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-5">
            <img
              src={receiver.profile}
              alt="User Avatar"
              className="w-12 h-12 object-cover"
            />
          </div>
          <h2 className="text-2xl font-semibold">{receiver.username}</h2>
        </Link>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`relative flex items-start space-x-4 ${msg.senderId === uid ? "justify-end" : ""}`}
          >
            <div className={`w-12 h-12 rounded-full overflow-hidden ${msg.senderId === uid ? "ml-4" : ""}`}>
              <img
                src={msg.senderId === uid ? sender.profile : receiver.profile}
                alt="Avatar"
                className="w-12 h-12 object-cover"
              />
            </div>
            <div className={`p-3 rounded-lg shadow-md max-w-sm ${msg.senderId === uid ? "bg-teal-600 text-white" : "bg-gray-800 text-white"}`}>
              <p className="text-sm">{msg.message}</p>
              <p className="text-xs text-white">{msg.time}</p>

              {msg.senderId === uid && (
                <div className="absolute top-0 right-0">
                  <button
                    className="text-white hover:text-teal-500"
                    onClick={() => toggleDeleteMenu(msg._id)}

                  >
                    <FaEllipsisV size={15} />
                  </button>
                  {deleteMenuMessageId === msg._id && (
                  <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-32 z-10">
                    <button
                      className="block w-full text-left p-2 text-red-500"
                      onClick={() => handleDeleteMessage(msg._id)}
                    >
                      <FaTrashAlt size={15} className="inline mr-2" />
                      Delete
                    </button>
                  </div>
                )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white shadow-md flex items-center space-x-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
