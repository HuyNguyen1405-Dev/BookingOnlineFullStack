import { createContext, useState } from "react";
import axios from "axios";
import { useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("Huy test: ", user);
    const fetchData = async () => {
      await axios.get("/profile").then(({ data }) => {
        setUser(data);
      });
    };
    if (!user) {
      fetchData();
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
