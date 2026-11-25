import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const DEMO_USERS = [
  {
    id: "user-01",
    name: "Sunita Devi",
    role: "Anganwadi Worker (Sevika)",
    roleId: "aww",
    sector: "Rampur Sector 1",
    phc: "Rampur Primary Health Centre",
    username: "anganwadi",
    avatar: "SD",
    badge: "Primary Health Frontline"
  },
  {
    id: "user-02",
    name: "Dr. Arvind Mehta, MBBS, DCH",
    role: "Medical Officer (Paediatrician)",
    roleId: "doctor",
    sector: "Block Health Mission",
    phc: "Community Health Centre Shivpuri",
    username: "doctor",
    avatar: "AM",
    badge: "Clinical Specialist"
  },
  {
    id: "user-03",
    name: "Meenakshi Rao",
    role: "Child Development Project Officer (CDPO)",
    roleId: "supervisor",
    sector: "District Health Administration",
    phc: "District POSHAN Mission",
    username: "supervisor",
    avatar: "MR",
    badge: "Administrative Supervisor"
  }
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('childcare_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_USERS[0];
      }
    }
    return DEMO_USERS[0]; // Auto-logged in with demo user for seamless test & presentation
  });

  const login = (username, password, roleId) => {
    let matchedUser = DEMO_USERS.find(u => u.username === username.trim().toLowerCase());
    if (!matchedUser && roleId) {
      matchedUser = DEMO_USERS.find(u => u.roleId === roleId);
    }
    if (!matchedUser) {
      matchedUser = DEMO_USERS[0];
    }
    setCurrentUser(matchedUser);
    localStorage.setItem('childcare_auth_user', JSON.stringify(matchedUser));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('childcare_auth_user');
  };

  const switchUser = (userObj) => {
    setCurrentUser(userObj);
    localStorage.setItem('childcare_auth_user', JSON.stringify(userObj));
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, switchUser, DEMO_USERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
