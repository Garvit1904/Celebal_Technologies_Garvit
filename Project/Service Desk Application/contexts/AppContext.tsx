
import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import type { AppContextType, Ticket, User } from '../types';
import { UserRole } from '../constants';
import { apiLogin, apiRegister, apiFetchTickets, apiCreateTicket, apiUpdateTicket, apiAddComment, apiFetchAllUsers } from '../services/mockApiService';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'light');
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const login = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const loggedInUser = await apiLogin(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        return loggedInUser;
      }
      throw new Error("Invalid credentials");
    } catch (err) {
      setError((err as Error).message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const newUser = await apiRegister(name, email, password);
      if (newUser) {
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        return newUser;
      }
      return null;
    } catch (err) {
      setError((err as Error).message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedTickets = await apiFetchTickets();
      setTickets(fetchedTickets);
    } catch (err) {
      setError("Failed to fetch tickets.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAllUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const users = await apiFetchAllUsers();
      setAllUsers(users);
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTicket = async (ticketData: Omit<Ticket, 'id' | 'status' | 'createdBy' | 'creatorName' | 'createdAt' | 'updatedAt' | 'comments'>): Promise<Ticket | null> => {
    if (!user) {
      setError("You must be logged in to create a ticket.");
      return null;
    }
    setIsLoading(true);
    try {
      const newTicket = await apiCreateTicket(ticketData, user);
      setTickets(prev => [newTicket, ...prev]);
      return newTicket;
    } catch (err) {
      setError("Failed to create ticket.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTicket = async (ticketId: string, updates: Partial<Ticket>): Promise<Ticket | null> => {
    setIsLoading(true);
    try {
      const updatedTicket = await apiUpdateTicket(ticketId, updates);
      setTickets(prev => prev.map(t => t.id === ticketId ? updatedTicket : t));
      return updatedTicket;
    } catch (err) {
      setError("Failed to update ticket.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const addComment = async (ticketId: string, content: string): Promise<Ticket | null> => {
    if (!user) {
      setError("You must be logged in to comment.");
      return null;
    }
    setIsLoading(true);
    try {
      const updatedTicket = await apiAddComment(ticketId, content, user);
      setTickets(prev => prev.map(t => t.id === ticketId ? updatedTicket : t));
      return updatedTicket;
    } catch (err) {
      setError("Failed to add comment.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getTicketById = (ticketId: string): Ticket | undefined => {
    return tickets.find(t => t.id === ticketId);
  };

  useEffect(() => {
    if (user) {
      fetchTickets();
      if(user.role === UserRole.ADMIN) {
        fetchAllUsers();
      }
    } else {
      setTickets([]);
      setAllUsers([]);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const value: AppContextType = {
    theme,
    toggleTheme,
    user,
    login,
    register,
    logout,
    tickets,
    allUsers,
    isLoading,
    error,
    createTicket,
    updateTicket,
    addComment,
    fetchTickets,
    fetchAllUsers,
    getTicketById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
