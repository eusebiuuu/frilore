import { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { notificationsSocket, socket } from "../socket";
import customFetch from "../lib/customFetch";
import { catchAxiosError } from "../utils/utils";
import { User } from "../features/profile/utils.profile";

export type ContextValue = {
  isSidebarOpen: boolean,
  onSidebarToggle: (val: boolean) => void,
  user: User | null | undefined,
  logout: () => Promise<unknown>,
  login: (password: string, username: string) => Promise<unknown>,
  register: (password: string, username: string) => Promise<unknown>,
}

type UserContextProps = {
  children: ReactNode
}

const defaultState: ContextValue = {
  isSidebarOpen: false,
  onSidebarToggle: (val: boolean) => { val },
  user: null,
  logout: async () => {},
  login: async () => {},
  register: async () => {},
}

const UserContext = createContext(defaultState);

export default function UserProvider({ children }: UserContextProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | undefined | null>(undefined);

  useEffect(() => {
    socket.connect();
    notificationsSocket.connect();
    notificationsSocket.emit('join');
    return () => {
      socket.disconnect();
      notificationsSocket.disconnect();
      notificationsSocket.emit('leave');
    }
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const result = await customFetch.get('/auth');
  //       setUser(result.data.user);
  //       if (result.data.user) {
  //         connectToSocket();
  //       }
  //     } catch (err) {
  //       catchAxiosError(err);
  //     }
  //   })();
  // }, []);

  async function logoutUser() {
    if (!user) {
      return;
    }
    try {
      await customFetch.delete('/auth/logout');
      setUser(undefined);
      // disconnect from sockets & more similar
    } catch (err) {
      catchAxiosError(err);
    }
  }

  async function loginUser(password: string, username: string) {
    try {
      await customFetch.post('/auth/login', {
        password,
        username
      });
    } catch (err) {
      catchAxiosError(err);
    }
  }

  async function registerUser(password: string, username: string) {
    try {
      await customFetch.post('/auth/register', {
        password,
        username
      });
    } catch (err) {
      catchAxiosError(err);
    }
  }
  
  function handleSidebarToggle(value: boolean) {
    setIsSidebarOpen(value);
  }

  const value = {
    isSidebarOpen,
    onSidebarToggle: handleSidebarToggle,
    user,
    logout: logoutUser,
    login: loginUser,
    register: registerUser,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  return useContext(UserContext);
}