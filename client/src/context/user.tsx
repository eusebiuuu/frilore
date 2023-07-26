import { createContext, useState, ReactNode, useContext } from "react";

export type User = {
  isSidebarOpen: boolean,
  onSidebarToggle: (val: boolean) => void
}

type UserContextProps = {
  children: ReactNode
}

const defaultState = {
  isSidebarOpen: false,
  onSidebarToggle: (val: boolean) => { val }
}

const UserContext = createContext(defaultState);

export default function UserProvider({ children }: UserContextProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  function handleSidebarToggle(value: boolean) {
    // console.log(value);
    setIsSidebarOpen(value);
  }

  const value = {
    isSidebarOpen,
    onSidebarToggle: handleSidebarToggle,
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