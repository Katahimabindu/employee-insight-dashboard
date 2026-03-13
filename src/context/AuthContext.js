import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [loggedIn, setLoggedIn] = useState(false);

  // check localstorage
  useEffect(() => {
    const savedInputs = localStorage.getItem("user_logged_in");
    if (savedInputs === "true") {
      setLoggedIn(true);
    }
  }, []);

  const signIn = (username, password) => {

    if (username === "testuser" && password === "Test123") {
      localStorage.setItem("user_logged_in", "true");
      setLoggedIn(true);
      return true;
    }

    return false;
  };

  const signOut = () => {
    localStorage.removeItem("user_logged_in");
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}