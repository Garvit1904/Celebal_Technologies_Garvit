
import { NavItem } from './types';
import { HomeIcon, TableIcon, CalendarIcon, KanbanIcon } from './components/Icons';

export const APP_NAME = "AdminPro";

export const NAVIGATION_ITEMS: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
  { name: 'Data Tables', path: '/tables', icon: TableIcon },
  { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
  { name: 'Kanban Board', path: '/kanban', icon: KanbanIcon },
];

export const MOCK_USER = {
  name: 'Admin User',
  avatarUrl: 'https://picsum.photos/seed/adminuser/100/100',
  email: 'admin@example.com'
};

export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';

export const KANBAN_COLUMNS_IDS = {
  TODO: 'todo',
  IN_PROGRESS: 'inprogress',
  DONE: 'done',
};
