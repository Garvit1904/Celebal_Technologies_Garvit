
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { UserRole, TicketStatus, TICKET_STATUSES, TICKET_CATEGORIES, TICKET_PRIORITIES, STATUS_COLORS, PRIORITY_COLORS, TicketCategory, TicketPriority } from '../constants';
import type { Ticket } from '../types';

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow flex items-center">
    <div className="bg-primary-100 dark:bg-primary-900/50 p-3 rounded-full mr-4">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-dark-muted">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">{value}</p>
    </div>
  </div>
);

const TicketItem: React.FC<{ ticket: Ticket }> = ({ ticket }) => (
    <Link to={`/tickets/${ticket.id}`} className="block bg-white dark:bg-dark-surface p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
        <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg text-gray-800 dark:text-dark-text mb-2">{ticket.title}</h3>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${PRIORITY_COLORS[ticket.priority]}`}>{ticket.priority}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-dark-muted mb-4 truncate">{ticket.description}</p>
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-dark-muted">
            <span>{ticket.id}</span>
            <span className={`font-semibold px-2 py-1 rounded-md ${STATUS_COLORS[ticket.status]}`}>{ticket.status}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-dark-muted mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span>By: {ticket.creatorName}</span>
            <span>Last updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
        </div>
    </Link>
);

const Dashboard: React.FC = () => {
  const { user, tickets } = useAppContext();
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickets = useMemo(() => {
    let displayTickets: Ticket[] = [];

    if (user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF) {
      displayTickets = tickets;
    } else if (user) {
      displayTickets = tickets.filter(t => t.createdBy === user.id);
    }
    
    return displayTickets.filter(ticket => 
        (statusFilter === 'ALL' || ticket.status === statusFilter) &&
        (categoryFilter === 'ALL' || ticket.category === categoryFilter) &&
        (priorityFilter === 'ALL' || ticket.priority === priorityFilter) &&
        (searchTerm === '' || ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || ticket.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [tickets, user, statusFilter, categoryFilter, priorityFilter, searchTerm]);

  const stats = useMemo(() => {
    const relevantTickets = (user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF) ? tickets : tickets.filter(t => t.createdBy === user.id);
    return {
      total: relevantTickets.length,
      new: relevantTickets.filter(t => t.status === TicketStatus.NEW).length,
      inProgress: relevantTickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length,
      resolved: relevantTickets.filter(t => t.status === TicketStatus.RESOLVED).length,
    };
  }, [tickets, user]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Tickets" value={stats.total} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
        <StatCard title="New" value={stats.new} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>} />
        <StatCard title="In Progress" value={stats.inProgress} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
        <StatCard title="Resolved" value={stats.resolved} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
      </div>

      <div className="bg-white dark:bg-dark-surface p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input type="text" placeholder="Search tickets..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent dark:text-dark-text focus:ring-primary-500 focus:border-primary-500"/>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as TicketStatus | 'ALL')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent dark:text-dark-text focus:ring-primary-500 focus:border-primary-500">
                <option value="ALL">All Statuses</option>
                {TICKET_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value as TicketCategory | 'ALL')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent dark:text-dark-text focus:ring-primary-500 focus:border-primary-500">
                <option value="ALL">All Categories</option>
                {TICKET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as TicketPriority | 'ALL')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent dark:text-dark-text focus:ring-primary-500 focus:border-primary-500">
                <option value="ALL">All Priorities</option>
                {TICKET_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTickets.length > 0 ? (
          filteredTickets.map(ticket => <TicketItem key={ticket.id} ticket={ticket} />)
        ) : (
          <div className="col-span-full text-center py-10">
              <p className="text-gray-500 dark:text-dark-muted">No tickets match the current filters.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
