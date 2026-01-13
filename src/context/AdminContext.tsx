// src/context/AdminContext.tsx
import React, { useState, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

// نوع بيانات الـ Admin
interface Admin {
  id: number;
  username: string;
  email: string;
  role: 'admin';
}

// الوظائف المتاحة في Context
interface AdminContextType {
  isAdminAuthenticated: boolean;
  admin: Admin | null;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
}

// إنشاء Context
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Hook مخصص لاستخدام Context
export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within AdminProvider');
  }
  return context;
};

// Provider Component
export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);

  // دالة تسجيل الدخول
  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      // استدعاء API Backend
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setAdmin(data.admin);
        setIsAdminAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  };

  // دالة تسجيل الخروج
  const adminLogout = () => {
    setAdmin(null);
    setIsAdminAuthenticated(false);
  };

  return (
    <AdminContext.Provider value={{ isAdminAuthenticated, admin, adminLogin, adminLogout }}>
      {children}
    </AdminContext.Provider>
  );
};