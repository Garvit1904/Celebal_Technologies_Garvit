
import { TableRow, CalendarEvent, KanbanTask, KanbanColumn, KanbanBoardData } from '../types';
import { KANBAN_COLUMNS_IDS } from '../constants';

// Mock Table Data
export const mockTableData: TableRow[] = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active', joinedDate: '2023-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Editor', status: 'Pending', joinedDate: '2023-02-20' },
  { id: 3, name: 'Robert Brown', email: 'robert.brown@example.com', role: 'Viewer', status: 'Active', joinedDate: '2023-03-10' },
  { id: 4, name: 'Emily White', email: 'emily.white@example.com', role: 'Editor', status: 'Inactive', joinedDate: '2022-12-05' },
  { id: 5, name: 'Michael Green', email: 'michael.green@example.com', role: 'Admin', status: 'Active', joinedDate: '2023-04-01' },
  { id: 6, name: 'Sarah Black', email: 'sarah.black@example.com', role: 'Viewer', status: 'Pending', joinedDate: '2023-05-22' },
  { id: 7, name: 'David Grey', email: 'david.grey@example.com', role: 'Editor', status: 'Active', joinedDate: '2023-06-11' },
  { id: 8, name: 'Linda Blue', email: 'linda.blue@example.com', role: 'Admin', status: 'Inactive', joinedDate: '2022-11-15' },
  { id: 9, name: 'James Yellow', email: 'james.yellow@example.com', role: 'Viewer', status: 'Active', joinedDate: '2023-07-03' },
  { id: 10, name: 'Patricia Pink', email: 'patricia.pink@example.com', role: 'Editor', status: 'Pending', joinedDate: '2023-08-19' },
];

// Mock Chart Data
export const mockLineChartData = [
  { name: 'Jan', uv: 400, pv: 240 },
  { name: 'Feb', uv: 300, pv: 139 },
  { name: 'Mar', uv: 200, pv: 980 },
  { name: 'Apr', uv: 278, pv: 390 },
  { name: 'May', uv: 189, pv: 480 },
  { name: 'Jun', uv: 239, pv: 380 },
  { name: 'Jul', uv: 349, pv: 430 },
];

export const mockBarChartData = [
  { name: 'Product A', sales: 4000, profit: 2400 },
  { name: 'Product B', sales: 3000, profit: 1398 },
  { name: 'Product C', sales: 2000, profit: 9800 },
  { name: 'Product D', sales: 2780, profit: 3908 },
  { name: 'Product E', sales: 1890, profit: 4800 },
];

export const mockPieChartData = [
  { name: 'Electronics', value: 400 },
  { name: 'Clothing', value: 300 },
  { name: 'Groceries', value: 300 },
  { name: 'Books', value: 200 },
];


// Mock Calendar Events
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);
const lastWeek = new Date(today);
lastWeek.setDate(today.getDate() - 7);


export const mockCalendarEvents: CalendarEvent[] = [
  { id: '1', date: today, title: 'Team Meeting', description: 'Discuss project milestones.', color: 'bg-blue-500' },
  { id: '2', date: today, title: 'Client Call', description: 'Follow up with Client X.', color: 'bg-green-500' },
  { id: '3', date: tomorrow, title: 'Design Review', description: 'Finalize UI mockups.', color: 'bg-yellow-500' },
  { id: '4', date: nextWeek, title: 'Sprint Planning', description: 'Plan next sprint tasks.', color: 'bg-purple-500' },
  { id: '5', date: lastWeek, title: 'Product Launch Party', description: 'Celebrate the new release!', color: 'bg-pink-500' },
  { 
    id: '6', 
    date: new Date(today.getFullYear(), today.getMonth(), 15), 
    title: 'Monthly Report Due', 
    description: 'Submit monthly performance report.',
    color: 'bg-red-500'
  },
   { 
    id: '7', 
    date: new Date(today.getFullYear(), today.getMonth() + 1, 5), 
    title: 'Vacation Start', 
    description: 'Annual leave.',
    color: 'bg-teal-500'
  },
];


// Mock Kanban Data
const initialTasksTodo: KanbanTask[] = [
  { id: 'task-1', content: 'Design homepage UI', priority: 'high' },
  { id: 'task-2', content: 'Develop API endpoints', priority: 'medium' },
  { id: 'task-3', content: 'Write documentation for feature X', priority: 'low' },
];

const initialTasksInProgress: KanbanTask[] = [
  { id: 'task-4', content: 'Implement user authentication', priority: 'high' },
  { id: 'task-5', content: 'Test payment gateway integration', priority: 'medium' },
];

const initialTasksDone: KanbanTask[] = [
  { id: 'task-6', content: 'Setup project repository', priority: 'low' },
  { id: 'task-7', content: 'Initial project planning meeting', priority: 'medium' },
];

export const mockKanbanData: KanbanBoardData = {
  [KANBAN_COLUMNS_IDS.TODO]: {
    id: KANBAN_COLUMNS_IDS.TODO,
    title: 'To Do',
    tasks: initialTasksTodo,
  },
  [KANBAN_COLUMNS_IDS.IN_PROGRESS]: {
    id: KANBAN_COLUMNS_IDS.IN_PROGRESS,
    title: 'In Progress',
    tasks: initialTasksInProgress,
  },
  [KANBAN_COLUMNS_IDS.DONE]: {
    id: KANBAN_COLUMNS_IDS.DONE,
    title: 'Done',
    tasks: initialTasksDone,
  },
};

// Dashboard Stats
export const mockDashboardStats = [
    { title: "Total Users", value: "1,250", change: "+15%", changeType: "positive", iconType: "users" },
    { title: "Total Revenue", value: "$45,8K", change: "+8.2%", changeType: "positive", iconType: "revenue" },
    { title: "New Orders", value: "356", change: "-2.1%", changeType: "negative", iconType: "orders" },
    { title: "Growth", value: "+30.5%", change: "+5%", changeType: "positive", iconType: "growth" },
] as const;

export const mockRecentActivities = [
    { id: 'act-1', user: 'Alice Johnson', action: 'updated task "Deploy to Staging"', time: '2m ago', avatar: 'https://picsum.photos/seed/alice/40/40' },
    { id: 'act-2', user: 'Bob Williams', action: 'commented on "Bug Report #123"', time: '15m ago', avatar: 'https://picsum.photos/seed/bob/40/40' },
    { id: 'act-3', user: 'Carol Davis', action: 'added new user "David Millers"', time: '1h ago', avatar: 'https://picsum.photos/seed/carol/40/40' },
    { id: 'act-4', user: 'System', action: 'completed backup', time: '3h ago', avatar: 'https://picsum.photos/seed/system/40/40' },
];
