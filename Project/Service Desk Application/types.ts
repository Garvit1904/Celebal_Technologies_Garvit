
import { UserRole, TicketStatus, TicketPriority, TicketCategory } from './constants';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdBy: string;
  creatorName: string;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  attachments?: File[];
}

export interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string) => Promise<User | null>;
  logout: () => void;
  tickets: Ticket[];
  allUsers: User[];
  isLoading: boolean;
  error: string | null;
  createTicket: (ticketData: Omit<Ticket, 'id' | 'status' | 'createdBy' | 'creatorName' | 'createdAt' | 'updatedAt' | 'comments'>) => Promise<Ticket | null>;
  updateTicket: (ticketId: string, updates: Partial<Ticket>) => Promise<Ticket | null>;
  addComment: (ticketId: string, content: string) => Promise<Ticket | null>;
  fetchTickets: () => void;
  fetchAllUsers: () => void;
  getTicketById: (ticketId: string) => Ticket | undefined;
}
