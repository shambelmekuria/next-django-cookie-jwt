"use client";
import { DJANGO_BASE_URL } from "@/config/defualt";
import { deleteToken } from "@/lib/auth";
import { fetcher } from "@/lib/fecher";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { createContext } from "react";
import useSWR from "swr";

// Constant
const LOGIN_REDIRECT = "/home";
const LOGOUT_REDIRECT = "/login";

type AuthProviderProps = {
  children: ReactNode;
};
type AuthContextProps = {
  isAuthenticated: boolean;
  fullname: string;
  username: string;
  role: string;
  logout: () => void;
};
const AuthContext = createContext<AuthContextProps | null>(null);

function AuthProvider({ children }: AuthProviderProps) {
  // const { data, error, isLoading } = useSWR("/api/auth/refresh", fetcher);
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  useEffect(() => {
    // Change Personal Info State
    const storedFullname = localStorage.getItem("fullname");
    if (storedFullname) {
      setFullname(storedFullname);
    }
  }, []);

  const logout = async () => {
    try {
      await axios.post(`${DJANGO_BASE_URL}/api/auth/logout`, {});
      setIsAuthenticated(false);
      router.replace(LOGOUT_REDIRECT);
    } catch {
      router.replace(LOGIN_REDIRECT);
    }
  };
  return (
    <AuthContext.Provider
      value={{ username, role, fullname, isAuthenticated, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
