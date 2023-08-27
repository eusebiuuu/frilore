import { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { notificationsSocket, socket } from "../socket";
import customFetch from "../lib/customFetch";
import { catchAxiosError } from "../utils/utils";

export type ContextValue = {
  isSidebarOpen: boolean,
  onSidebarToggle: (val: boolean) => void,
  user: User | null | undefined,
  logout: () => Promise<unknown>,
  login: (user: User) => void
}

type UserContextProps = {
  children: ReactNode
}

type User = {
  user_id: string,
  username: string,
  password: string | null,
  real_name: string,
  country: string,
  email: string | null,
  role: string,
  birthday: string | null,
  google_id: null | string,
  github_id: null | string,
  description: string,
  last_login: string,
}

const defaultState: ContextValue = {
  isSidebarOpen: false,
  onSidebarToggle: (val: boolean) => { val },
  user: null,
  logout: async () => {},
  login: (_: User) => {},
}

const UserContext = createContext(defaultState);

export default function UserProvider({ children }: UserContextProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | undefined | null>({
    "user_id": "1183c530-7ea3-4a80-8378-fb4f5fb8875a",
    "username": "bob_john",
    "password": "$2b$10$./r.reUEA9PAFptRx7zLrOGWOoQ1jbTkn8C4.sfodT7eI4AFk1eF.",
    "real_name": "",
    "email": null,
    "country": "Romania",
    "role": "",
    "birthday": null,
    "google_id": null,
    "github_id": null,
    "description": "",
    "last_login": "2023-08-21T15:11:24.619Z"
  });

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
      // disconnect from sockets
    } catch (err) {
      catchAxiosError(err);
    }
  }

  function loginUser(user: User) {
    setUser(user);
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