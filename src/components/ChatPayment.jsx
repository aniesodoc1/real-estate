import React, { useContext, useEffect, useRef, useState } from 'react';
import { format } from 'timeago.js';
import { toast } from 'react-toastify';
import { ImSpinner2 } from 'react-icons/im';
import { SocketContext } from '../context/SocketContext';
import { useSelector } from 'react-redux';
import { useNotificationStore } from '../helpers/notificationStore';
import apiRequest from '../common/apiRequest';

const ChatPayment = () => {
  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState(null);
  const user = useSelector(state => state?.user?.user);
  const { socket } = useContext(SocketContext);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);

  const messageEndRef = useRef();
  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);
  const decrease = useNotificationStore((state) => state.decrease);

  fetch();

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const handleOpenChat = async (_id, receiver) => {
    setLoading(true);
    try {
      const res = await apiRequest.get(`/chats/${_id}`);
      if (!res.data.seenBy.includes(user._id)) {
        decrease();
      }
      setChat({ ...res.data, receiver });
      setErrorMessage("");
    } catch (err) {
      console.log(err);
      setErrorMessage("⚠️ Failed to open chat. Please check your internet connection.");
      toast.error("Failed to open chat. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get('text');
    if (!text) return;

    setLoading(true);
    try {
      const res = await apiRequest.post(`/messages/${chat._id}`, { text });
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();
      socket.emit('sendMessage', {
        receiverId: chat.receiver._id,
        data: res.data,
      });
      setErrorMessage("");
    } catch (err) {
      console.log(err);
      setErrorMessage("⚠️ Failed to send message. Please check your internet connection.");
      toast.error("Failed to send message. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await apiRequest.get("/chats");
        console.log("Chats:", response.data);
        setChats(response.data || []);
        setErrorMessage("");
      } catch (err) {
        console.error("Error fetching chats:", err);
        setErrorMessage("⚠️ Failed to load chats. Please check your internet connection.");
        toast.error("Failed to load chats. Please check your connection.");
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put(`/chats/read/${chat._id}`);
      } catch (err) {
        console.log(err);
      }
    };

    if (chat && socket) {
      socket.on('getMessage', (data) => {
        if (chat._id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
        }
      });
    }
  }, [socket, chat]);

  const handleAddChat = async () => {
    if (!user) {
      toast.error("You must be logged in to add a chat!");
      return;
    }

    const receiverPhoneNumber = prompt("Enter the receiver's phone number:");
    if (!receiverPhoneNumber) return;

    try {
      const token = localStorage.getItem("authToken");
      const res = await apiRequest.get(`/users/phone/${receiverPhoneNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const receiver = res.data;

      if (!receiver) {
        setErrorMessage("⚠️ User not found! Please try a valid phone number.");
        toast.error("User not found! Please try a valid phone number.");
        return;
      }

      setErrorMessage("");
      const chatRes = await apiRequest.post(
        "/chats",
        { receiverId: receiver._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChats((prevChats) => [
        ...prevChats,
        { ...chatRes.data, receiver, lastMessage: "" },
      ]);
      setChat({ ...chatRes.data, receiver });
    } catch (err) {
      console.log("Error creating chat:", err);
      if (err.response?.status === 401) {
        toast.error("Unauthorized! Please log in again.");
      } else if (err.response?.status === 404) {
        toast.error("User not found! Please check the phone number.");
      } else {
        setErrorMessage("⚠️ Failed to add chat. Please check your internet connection.");
        toast.error("Failed to add chat. Please check your connection.");
      }
    }
  };

  return (
    <div className="flex p-4 flex-col text-white mb-8">
      <div className="flex flex-col gap-5">
        <div className="p-5 bg-blue-900 rounded-xl text-white text-center space-y-3">
          <h2 className="text-2xl font-bold text-orange-400">💬 Need Help with Delivery & Payment?</h2>
          <p className="text-base">
            Talk to our <span className="font-semibold text-green-400">customer service</span> about how you'd like your product delivered 📦 and how you’d prefer to make your payment 💳.
          </p>
          <p className="text-sm text-gray-300">We're here to help make it easy for you! 😊  09024372436, 09024372435</p>
        </div>

        {errorMessage && (
          <div className="text-orange-500 font-semibold bg-black p-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-row justify-between mb-4">
          <div className="relative">
            <button className="bg-blue-900 px-5 py-3 rounded text-white font-bold cursor-pointer">Messages</button>
            <div className="bg-red-600 absolute -top-2 -right-3 z-10 text-white w-6 h-6 rounded-full p-1 flex items-center justify-center">
              <span className="text-sm font-bold">{number > 0 ? number : 0}</span>
            </div>
          </div>

          <button
            onClick={handleAddChat}
            className="bg-green-700 cursor-pointer px-5 py-3 rounded text-white font-semibold"
            disabled={loading}
          >
            {loading ? <ImSpinner2 className="animate-spin" /> : null}
            {loading ? 'Adding Chat...' : 'Add Chat'}
          </button>
        </div>

        {loading && <p className="text-orange-500 font-bold mb-3">Loading...</p>}

        {chats.map((c) => (
          <div
            key={c._id}
            onClick={() => handleOpenChat(c._id, c.receiver)}
            className={`flex items-center gap-5 p-5 rounded-lg cursor-pointer relative ${c.seenBy.includes(user._id) || chat?._id === c._id ? 'bg-blue-900' : 'bg-red-700'} ${isMinimized ? 'h-12 overflow-hidden justify-between' : ''}`}
          >
            <img src={c.receiver.profilePic || '/noavatar.jpg'} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
            {!isMinimized && (
              <div className="flex flex-col font-bold">
                <span className="text-slate-100">{c.receiver.phonenumber}</span>
                <span className="text-slate-300">{c.receiver.name ? (c.receiver.name.length > 9 ? c.receiver.name.slice(0, 9) + '...' : c.receiver.name) : "No Name"}</span>
              </div>
            )}
            {!isMinimized && (
              <p className="font-bold text-sm">{c.lastMessage ? (c.lastMessage.length > 30 ? c.lastMessage.slice(0, 30) + '...' : c.lastMessage) : "No messages yet"}</p>
            )}
            <span
              onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
              className="absolute right-2 bg-orange-500 px-2 rounded text-white text-xs font-bold cursor-pointer"
            >
              {isMinimized ? 'Expand' : 'Minimize'}
            </span>
          </div>
        ))}
      </div>

      {chat && (
        <div className={`flex flex-col justify-between mt-4 bg-gray-900 ${isMinimized ? 'h-12 overflow-hidden' : ''}`}>
          <div className="flex items-center justify-between p-5 bg-blue-800 font-bold">
            <div className="flex items-center gap-5">
              <img src={chat.receiver.profilePic || '/noavatar.jpg'} alt="" className="w-8 h-8 rounded-full object-cover" />
              <div className="flex flex-col font-bold">
                <span>{chat.receiver.phonenumber}</span>
                <span>{chat.receiver.name ? (chat.receiver.name.length > 9 ? chat.receiver.name.slice(0, 9) + '...' : chat.receiver.name) : "No Name"}</span>
              </div>
            </div>
            <div>
              <span onClick={() => setIsMinimized(!isMinimized)} className="bg-orange-500 px-3 py-1 rounded text-sm cursor-pointer mr-2">
                {isMinimized ? 'Maximize' : 'Minimize'}
              </span>
              <span onClick={() => { setChat(null); window.location.reload() }} className="bg-gray-900 px-3 py-1 rounded text-sm cursor-pointer">X</span>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="h-96 overflow-y-auto p-5 flex flex-col gap-5">
                {chat.messages.map((message) => (
                  <div key={message._id} className={`p-3 rounded-lg text-white ${message.userId === user._id ? 'self-end text-right bg-black' : 'self-start text-left bg-gray-700'}`}>
                    <p>{message.text}</p>
                    <span className="text-xs bg-gray-700 px-1 rounded">{format(message.createdAt)}</span>
                  </div>
                ))}
                <div ref={messageEndRef}></div>
              </div>

              <form onSubmit={handleSubmit} className="h-16 flex items-center justify-between">
                <textarea name="text" placeholder="Send Message" className="bg-blue-800 flex-1 h-full border-none p-4 text-white text-base resize-none"></textarea>
                <button className="bg-green-700 h-full px-5 cursor-pointer text-white" disabled={loading}>
                  {loading ? <ImSpinner2 className="animate-spin" /> : null}
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatPayment;
