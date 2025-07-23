
import { UserRole, TicketStatus, TicketPriority, TicketCategory } from '../constants';
import type { User, Ticket, Comment } from '../types';

const usersKey = 'genDesk_users';
const ticketsKey = 'genDesk_tickets';

const createInitialData = () => {
  if (!localStorage.getItem(usersKey)) {
    const initialUsers: User[] = [
      { id: 'user-1', name: 'Admin User', email: 'admin@example.com', role: UserRole.ADMIN, createdAt: new Date().toISOString() },
      { id: 'user-2', name: 'Alice Johnson', email: 'alice@example.com', role: UserRole.USER, createdAt: new Date().toISOString() },
      { id: 'user-3', name: 'Bob Smith', email: 'bob@example.com', role: UserRole.STAFF, createdAt: new Date().toISOString() },
    ];
    localStorage.setItem(usersKey, JSON.stringify(initialUsers));
  }

  if (!localStorage.getItem(ticketsKey)) {
    const initialTickets: Ticket[] = [
      {
        id: 'ticket-1',
        title: 'Cannot connect to company Wi-Fi',
        description: 'My laptop is unable to connect to the "Corporate" Wi-Fi network. I have tried restarting my machine, but it did not help. My colleague next to me is connected fine.',
        status: TicketStatus.ASSIGNED,
        priority: TicketPriority.HIGH,
        category: TicketCategory.IT,
        createdBy: 'user-2',
        creatorName: 'Alice Johnson',
        assignedTo: 'user-3',
        assignedToName: 'Bob Smith',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        comments: [
          {id: 'comment-1', authorId: 'user-3', authorName: 'Bob Smith', content: "I'll be stopping by your desk this afternoon to take a look.", createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()}
        ],
      },
      {
        id: 'ticket-2',
        title: 'New employee onboarding request',
        description: 'We have a new hire starting next Monday. Please set up their accounts and hardware.',
        status: TicketStatus.NEW,
        priority: TicketPriority.MEDIUM,
        category: TicketCategory.HR,
        createdBy: 'user-1',
        creatorName: 'Admin User',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        comments: [],
      },
    ];
    localStorage.setItem(ticketsKey, JSON.stringify(initialTickets));
  }
};

createInitialData();

const simulateDelay = <T,>(data: T): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), 500));
};

// --- AUTH ---
export const apiLogin = async (email: string, password_unused: string): Promise<User | null> => {
  const users: User[] = JSON.parse(localStorage.getItem(usersKey) || '[]');
  const user = users.find(u => u.email === email);
  return simulateDelay(user || null);
};

export const apiRegister = async (name: string, email: string, password_unused: string): Promise<User | null> => {
  let users: User[] = JSON.parse(localStorage.getItem(usersKey) || '[]');
  if (users.some(u => u.email === email)) {
    throw new Error('User with this email already exists.');
  }
  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    role: UserRole.USER,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  localStorage.setItem(usersKey, JSON.stringify(users));
  return simulateDelay(newUser);
};


// --- TICKETS ---
export const apiFetchTickets = async (): Promise<Ticket[]> => {
  const tickets: Ticket[] = JSON.parse(localStorage.getItem(ticketsKey) || '[]');
  return simulateDelay(tickets.sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
};

export const apiCreateTicket = async (ticketData: Omit<Ticket, 'id' | 'status' | 'createdBy' | 'creatorName' | 'createdAt' | 'updatedAt' | 'comments'>, creator: User): Promise<Ticket> => {
  let tickets: Ticket[] = JSON.parse(localStorage.getItem(ticketsKey) || '[]');
  const now = new Date().toISOString();
  const newTicket: Ticket = {
    ...ticketData,
    id: `ticket-${Date.now()}`,
    status: TicketStatus.NEW,
    createdBy: creator.id,
    creatorName: creator.name,
    createdAt: now,
    updatedAt: now,
    comments: [],
  };
  tickets.push(newTicket);
  localStorage.setItem(ticketsKey, JSON.stringify(tickets));
  return simulateDelay(newTicket);
};

export const apiUpdateTicket = async (ticketId: string, updates: Partial<Ticket>): Promise<Ticket> => {
  let tickets: Ticket[] = JSON.parse(localStorage.getItem(ticketsKey) || '[]');
  const ticketIndex = tickets.findIndex(t => t.id === ticketId);
  if (ticketIndex === -1) throw new Error('Ticket not found');
  
  const updatedTicket = { ...tickets[ticketIndex], ...updates, updatedAt: new Date().toISOString() };
  tickets[ticketIndex] = updatedTicket;
  localStorage.setItem(ticketsKey, JSON.stringify(tickets));
  return simulateDelay(updatedTicket);
};

export const apiAddComment = async (ticketId: string, content: string, author: User): Promise<Ticket> => {
  let tickets: Ticket[] = JSON.parse(localStorage.getItem(ticketsKey) || '[]');
  const ticketIndex = tickets.findIndex(t => t.id === ticketId);
  if (ticketIndex === -1) throw new Error('Ticket not found');
  
  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    authorId: author.id,
    authorName: author.name,
    content,
    createdAt: new Date().toISOString(),
  };

  tickets[ticketIndex].comments.push(newComment);
  tickets[ticketIndex].updatedAt = new Date().toISOString();

  localStorage.setItem(ticketsKey, JSON.stringify(tickets));
  return simulateDelay(tickets[ticketIndex]);
};


// --- USERS ---
export const apiFetchAllUsers = async (): Promise<User[]> => {
  const users: User[] = JSON.parse(localStorage.getItem(usersKey) || '[]');
  return simulateDelay(users);
};
