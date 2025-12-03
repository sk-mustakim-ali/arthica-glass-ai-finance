import React, { useState, useEffect } from "react";
import { AuthContext, DemoUser } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("arthica-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const loggedInUser: DemoUser = {
      id: "user-" + Date.now(),
      uid: "user-" + Date.now(),
      displayName: email.split("@")[0],
      email,
      onboardingCompleted: false,
    };
    
    setUser(loggedInUser);
    localStorage.setItem("arthica-user", JSON.stringify(loggedInUser));
  };

  const signup = async (email: string, password: string, name: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newUser: DemoUser = {
      id: "user-" + Date.now(),
      uid: "user-" + Date.now(),
      displayName: name || email.split("@")[0],
      email,
      onboardingCompleted: false,
    };
    
    setUser(newUser);
    localStorage.setItem("arthica-user", JSON.stringify(newUser));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("arthica-user");
  };

  const updateUser = (data: Partial<DemoUser>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("arthica-user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
