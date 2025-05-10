<<<<<<< HEAD
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
=======
import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
>>>>>>> 22ae305 (5commit)

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
<<<<<<< HEAD
  const { currentUser } = useContext(AuthContext);
=======
  const currentUser = useSelector(state => state.user.user);
>>>>>>> 22ae305 (5commit)
  const [socket, setSocket] = useState(null);

  useEffect(() => {
  const newSocket = io(import.meta.env.VITE_SERVER_URL, {
    withCredentials: true,
  });
  setSocket(newSocket);

  return () => {
    newSocket.disconnect();
  };
}, []);


  useEffect(() => {
<<<<<<< HEAD
  currentUser && socket?.emit("newUser", currentUser.id);
=======
    currentUser && socket?.emit("newUser", currentUser.id);
>>>>>>> 22ae305 (5commit)
  }, [currentUser, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
