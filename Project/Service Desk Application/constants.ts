
export enum UserRole {
  USER = 'User',
  ADMIN = 'Admin',
  STAFF = 'Support Staff'
}

export enum TicketStatus {
  NEW = 'New',
  ASSIGNED = 'Assigned',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed',
}

export enum TicketPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export enum TicketCategory {
  IT = 'IT',
  HR = 'HR',
  FACILITIES = 'Facilities',
  FINANCE = 'Finance',
  GENERAL = 'General',
}

export const TICKET_CATEGORIES = Object.values(TicketCategory);
export const TICKET_PRIORITIES = Object.values(TicketPriority);
export const TICKET_STATUSES = Object.values(TicketStatus);

export const STATUS_COLORS: { [key in TicketStatus]: string } = {
  [TicketStatus.NEW]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [TicketStatus.ASSIGNED]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [TicketStatus.IN_PROGRESS]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  [TicketStatus.RESOLVED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [TicketStatus.CLOSED]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

export const PRIORITY_COLORS: { [key in TicketPriority]: string } = {
  [TicketPriority.LOW]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  [TicketPriority.MEDIUM]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [TicketPriority.HIGH]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};
