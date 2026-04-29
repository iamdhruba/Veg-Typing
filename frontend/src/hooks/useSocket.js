import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

let globalSocket = null;

export const useSocket = () => {
  const [socket, setSocket] = useState(globalSocket);

  useEffect(() => {
    if (!globalSocket) {
      globalSocket = io(SOCKET_URL, {
        withCredentials: true,
      });
    }
    setSocket(globalSocket);

    return () => {
      // Don't disconnect on unmount — keep alive globally
    };
  }, []);

  return socket;
};
