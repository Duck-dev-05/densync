import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'factory_operator' | 'factory_expert' | 'system_admin';

interface User {
  user_id: string;
  name: string;
  role: UserRole;
  factory_location: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  login: (userId: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Clear any stored user on mount to always show login page
    localStorage.removeItem('densync_user');
  }, []);

  const login = async (userId: string) => {
    // Demo users for testing without backend
    const demoUsers: Record<string, User> = {
      'op1': { user_id: 'op1', name: 'Tanaka Hiroshi', role: 'factory_operator', factory_location: 'Gunma Plant' },
      'op2': { user_id: 'op2', name: 'Nguyen Van A', role: 'factory_operator', factory_location: 'Hải Phòng' },
      'op3': { user_id: 'op3', name: 'Somchai B', role: 'factory_operator', factory_location: 'Bangkok Assembly' },
      'exp1': { user_id: 'exp1', name: 'Dr. Kenji Tanaka', role: 'factory_expert', factory_location: 'Gunma Plant' },
      'exp2': { user_id: 'exp2', name: 'Nguyen Thi Mai', role: 'factory_expert', factory_location: 'Hải Phòng' },
      'admin1': { user_id: 'admin1', name: 'Marcus Chen', role: 'system_admin', factory_location: 'Global Support' },
    };

    const userData = demoUsers[userId];
    if (userData) {
      setUser(userData);
      localStorage.setItem('densync_user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('densync_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
