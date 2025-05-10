import React, { useContext, useEffect, useRef, useState } from 'react';
import './Chat.scss';
import { AuthContext } from '../../context/AuthContext';
import apiRequest from '../../lib/apiRequest';
import { format } from 'timeago.js';
import { SocketContext } from '../../context/SocketContext';
import { useNotificationStore } from '../../lib/notificationStore';
import { toast } from 'react-toastify';

const Chat = ({ chats, setChats }) => {
   const [chat, setChat] = useState(null);
   const { updateUser, currentUser } = useContext(AuthContext);
   const { socket } = useContext(SocketContext);
   const [loading, setLoading] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");
   const [isMinimized, setIsMinimized] = useState(false);

   const messageEndRef = useRef();
   const decrease = useNotificationStore((state) => state.decrease);

   useEffect(() => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [chat]);

   const handleOpenChat = async (id, receiver) => {
      setLoading(true);
      try {
         const res = await apiRequest.get(`/chats/${id}`);
         if (!res.data.seenBy.includes(currentUser.id)) {
            decrease();
         }
         setChat({ ...res.data, receiver });
      } catch (err) {
         console.log(err);
      } finally {
         setLoading(false);
      }
   };

   // Send message with loading indicator
   const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const text = formData.get('text');

      if (!text) return;
      setLoading(true);
      try {
         const res = await apiRequest.post(`/messages/${chat.id}`, { text });
         setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
         e.target.reset();
         socket.emit('sendMessage', {
            receiverId: chat.receiver.id,
            data: res.data,
         });
      } catch (err) {
         console.log(err);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      const read = async () => {
         try {
            await apiRequest.put(`/chats/read/${chat.id}`);
         } catch (err) {}
      };

      if (chat && socket) {
         socket.on('getMessage', (data) => {
            if (chat.id === data.chatId) {
               setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
               read();
            }
         });
      }

      //return () => socket.off('getMessage');
   }, [socket, chat]);

   // Add chat and handle errors
   const handleAddChat = async () => {
      if (!updateUser) {
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
          setErrorMessage("User not found! Please try a valid phone number.");
          toast.error("User not found! Please try a valid phone number.");
          return;
        }
    
        setErrorMessage("");
        const chatRes = await apiRequest.post(
          "/chats",
          { receiverId: receiver.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
    
        setChats((prevChats) => [
          ...prevChats,
          { ...chatRes.data, receiver, lastMessage: "" },
        ]);
        window.location.reload(); // Reload to update the state
      } catch (err) {
        console.log("Error creating chat:", err);
        if (err.response?.status === 401) {
         window.location.reload();
          toast.error("Unauthorized! Please log in again.");
        } else if (err.response?.status === 404) {
          toast.error("User not found! Please check the phone number.");
        } else {
         window.location.reload();
        }
      }
    };
    
   return (
      <div className='chat'>
      <div className='messages'>
         <div className='add_chat'>
            <h1>Messages</h1>
            <button className='add_button' onClick={handleAddChat}>Add Chat</button>
         </div>

         {loading && <p className='loading-message'>Loading...</p>}

         {chats?.map((c) => (
            <div
            className={`message ${isMinimized ? 'minimized' : ''}`}
            key={c.id}
            style={{
               backgroundColor: c.seenBy.includes(currentUser.id) || chat?.id === c.id ? 'blue' : 'darkred',
            }}
            onClick={() => handleOpenChat(c.id, c.receiver)}
         >
            <img src={c.receiver.avatar || '/noavatar.jpg'} alt='avatar' />
            {!isMinimized && (
               <span className="reciever_details">
                  <span>{c.receiver.phonenumber}</span>
                  <span>
                     {c.receiver.email
                        ? c.receiver.email.length > 9
                           ? c.receiver.email.slice(0, 9) + "..."
                           : c.receiver.email
                        : "No User Email"}
                  </span>
               </span>
            )}
            {!isMinimized && (
               <p>
                  {c.lastMessage
                     ? c.lastMessage.length > 20
                        ? c.lastMessage.slice(0, 20) + "..."
                        : c.lastMessage
                     : "No messages yet"}
               </p>
            )}
            {/* <span className='delete'>
               <img src="/delete.png" alt="Delete" />
            </span> */}
            <span className='minimize' onClick={(e) => {
               e.stopPropagation();
               setIsMinimized(!isMinimized);
            }}>
               {isMinimized ? 'Expand' : 'Minimize'}
            </span>
         </div>
         
         ))}
      </div>

      {chat && (
         <div className={`chatBox ${isMinimized ? 'minimized' : ''}`}>
            <div className='top'>
               <div className='user'>
                  <img src={chat.receiver.avatar || 'noavatar.jpg'} alt='' />
                  <span className="reciever_details">
                  <span>{chat.receiver.phonenumber}</span>
                  <span>
                     {chat.receiver.email
                        ? chat.receiver.email.length > 9
                           ? chat.receiver.email.slice(0, 9) + "..."
                           : chat.receiver.email
                        : "No User Email"}
                  </span>
               </span>
               </div>
               <span
                  className='minimize'
                  onClick={() => setIsMinimized(!isMinimized)}
               >
                  {isMinimized ? 'Maximize' : 'Minimize'}
               </span>
               <span
                  className='close'
                  onClick={() => {
                     setChat(null);
                     window.location.reload();
                     setChats([...chats]);
                  }}
               >
                  X
               </span>
            </div>

            {!isMinimized && (
               <>
                  <div className='center'>
                     {chat.messages.map((message) => (
                        <div
                           className='chatMessage'
                           style={{
                              alignSelf: message.userId === currentUser.id ? 'flex-end' : 'flex-start',
                              textAlign: message.userId === currentUser.id ? 'right' : 'left',
                              backgroundColor: message.userId === currentUser.id ? 'black' : '#444',
                           }}
                           key={message.id}
                        >
                           <p>{message.text}</p>
                           <span>{format(message.createdAt)}</span>
                        </div>
                     ))}
                     <div ref={messageEndRef}></div>
                  </div>

                  <form onSubmit={handleSubmit} className='bottom'>
                     <textarea name='text' placeholder='Send Message'></textarea>
                     <button>send</button>
                  </form>
               </>
            )}
         </div>
      )}
   </div>
   );
};

export default Chat;
