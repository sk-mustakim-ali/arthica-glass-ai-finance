import React, { useState, useEffect } from "react";
import { AuthContext, DemoUser } from "./AuthContext";

const DEMO_USER: DemoUser = {
  id: "demo-user-1",
  uid: "demo-user-1",
  displayName: "Demo User",
  email: "demo@arthica.app",
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for stored session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("arthica-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Demo login - accepts any credentials
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
    
    const loggedInUser: DemoUser = {
      id: "user-" + Date.now(),
      uid: "user-" + Date.now(),
      displayName: email.split("@")[0],
      email,
    };
    
    setUser(loggedInUser);
    localStorage.setItem("arthica-user", JSON.stringify(loggedInUser));
  };

  const signup = async (email: string, password: string, name: string) => {
    // Demo signup
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newUser: DemoUser = {
      id: "user-" + Date.now(),
      uid: "user-" + Date.now(),
      displayName: name || email.split("@")[0],
      email,
    };
    
    setUser(newUser);
    localStorage.setItem("arthica-user", JSON.stringify(newUser));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("arthica-user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
