import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { suggestCategoryAndPriority, suggestSolution } from '../services/geminiService';
import { UserRole, TICKET_CATEGORIES, TICKET_PRIORITIES, TicketCategory, TicketPriority, TicketStatus, TICKET_STATUSES, STATUS_COLORS, PRIORITY_COLORS } from '../constants';
import Spinner from './common/Spinner';
import type { User, Comment as CommentType } from '../types';

const TicketPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, getTicketById, createTicket, updateTicket, addComment, allUsers, isLoading: isContextLoading } = useAppContext();
    const isNew = location.pathname === '/tickets/new';

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<TicketCategory>(TicketCategory.GENERAL);
    const [priority, setPriority] = useState<TicketPriority>(TicketPriority.LOW);
    
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiSolution, setAiSolution] = useState<string | null>(null);
    const [showSuccessBanner, setShowSuccessBanner] = useState(location.state?.ticketCreated || false);

    const ticket = isNew ? null : getTicketById(id || '');
    
    useEffect(() => {
        if (showSuccessBanner) {
            const timer = setTimeout(() => {
                setShowSuccessBanner(false);
                navigate(location.pathname, { replace: true, state: {} });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessBanner, navigate, location.pathname]);
    
    useEffect(() => {
        if (ticket) {
            setTitle(ticket.title);
            setDescription(ticket.description);
            setCategory(ticket.category);
            setPriority(ticket.priority);
        }
    }, [ticket]);

    const handleAiSuggest = async () => {
        if (!title || !description) {
            alert("Please enter a title and description first.");
            return;
        }
        setIsAiLoading(true);
        const suggestion = await suggestCategoryAndPriority(title, description);
        if (suggestion) {
            setCategory(suggestion.category);
            setPriority(suggestion.priority);
        } else {
            alert("Could not get AI suggestion. Please select manually.");
        }
        setIsAiLoading(false);
    };

    const handleSuggestSolution = async () => {
        if (!ticket) return;
        setIsAiLoading(true);
        setAiSolution(null);
        const solution = await suggestSolution(ticket);
        setAiSolution(solution || "Could not generate a solution.");
        setIsAiLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isNew) {
            const newTicket = await createTicket({ title, description, category, priority });
            if (newTicket) {
                navigate(`/tickets/${newTicket.id}`, { state: { ticketCreated: true } });
            }
        } else if (ticket) {
            await updateTicket(ticket.id, { title, description, category, priority });
        }
    };

    const handleStatusChange = async (newStatus: TicketStatus) => {
        if (ticket) {
            await updateTicket(ticket.id, { status: newStatus });
        }
    };
    
    const handleAssigneeChange = async (assigneeId: string) => {
        if (ticket) {
            const assignee = allUsers.find(u => u.id === assigneeId);
            await updateTicket(ticket.id, { assignedTo: assigneeId, assignedToName: assignee?.name });
        }
    }

    if (isContextLoading && !isNew && !ticket) return <div className="flex justify-center items-center h-64"><Spinner size="lg"/></div>
    if (!isNew && !ticket) return <div className="text-center py-10"><h2>Ticket not found</h2><button onClick={() => navigate('/dashboard')} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md">Go to Dashboard</button></div>

    return (
        <div className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-lg shadow-lg">
            {showSuccessBanner && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
                    <p className="font-bold">Ticket Created Successfully!</p>
                    <p>Our support team will review it shortly.</p>
                </div>
            )}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-6">{isNew ? 'Create New Ticket' : `Ticket #${ticket?.id}`}</h1>

            {isNew ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-dark-muted">Title</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-transparent dark:text-dark-text"/>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-dark-muted">Description</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={6} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-transparent dark:text-dark-text"/>
                    </div>
                    <div className="flex items-end space-x-4">
                        <div className="flex-1">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-dark-muted">Category</label>
                            <select id="category" value={category} onChange={(e) => setCategory(e.target.value as TicketCategory)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-transparent dark:text-dark-text">
                                {TICKET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                         <div className="flex-1">
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-dark-muted">Priority</label>
                            <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-transparent dark:text-dark-text">
                                {TICKET_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <button type="button" onClick={handleAiSuggest} disabled={isAiLoading} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300 flex items-center">
                            {isAiLoading ? <Spinner size="sm"/> : 'AI Suggest'}
                        </button>
                    </div>
                    <button type="submit" disabled={isContextLoading} className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-primary-300">
                        {isContextLoading ? 'Submitting...' : 'Submit Ticket'}
                    </button>
                </form>
            ) : (
                ticket && <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="md:col-span-2">
                             <h2 className="text-2xl font-semibold text-gray-800 dark:text-dark-text mb-2">{ticket.title}</h2>
                            <p className="text-gray-600 dark:text-dark-muted whitespace-pre-wrap">{ticket.description}</p>
                        </div>
                        <div className="space-y-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                            <div><span className="font-semibold">Status:</span> <span className={`font-semibold px-2 py-1 rounded-md text-sm ${STATUS_COLORS[ticket.status]}`}>{ticket.status}</span></div>
                            <div><span className="font-semibold">Priority:</span> <span className={`font-semibold px-2 py-1 rounded-md text-sm ${PRIORITY_COLORS[ticket.priority]}`}>{ticket.priority}</span></div>
                            <div><span className="font-semibold">Category:</span> {ticket.category}</div>
                            <div><span className="font-semibold">Created by:</span> {ticket.creatorName}</div>
                            <div><span className="font-semibold">Created at:</span> {new Date(ticket.createdAt).toLocaleString()}</div>
                            <div><span className="font-semibold">Assigned to:</span> {ticket.assignedToName || 'Unassigned'}</div>
                        </div>
                    </div>
                    
                    { user?.role === UserRole.USER && (
                        <div className="my-6 p-4 bg-blue-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-sm text-blue-800 dark:text-blue-200">
                             <p><span className="font-bold">Note:</span> Our support staff will review your ticket, update its status, and assign it for resolution. You can add comments below to provide more information.</p>
                        </div>
                    )}

                    { (user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF) && 
                        <AdminControls ticket={ticket} allUsers={allUsers} onStatusChange={handleStatusChange} onAssigneeChange={handleAssigneeChange} onSuggestSolution={handleSuggestSolution} isAiLoading={isAiLoading} />
                    }

                    {aiSolution && (
                         <div className="mt-6 p-4 border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-2">AI Suggested Solution</h3>
                            <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: aiSolution.replace(/\n/g, '<br />') }}></div>
                        </div>
                    )}

                    <CommentSection ticket={ticket} addComment={addComment} isLoading={isContextLoading} />
                </div>
            )}
        </div>
    );
};

const AdminControls: React.FC<{ ticket: any, allUsers: User[], onStatusChange: (s:TicketStatus) => void, onAssigneeChange: (id: string) => void, onSuggestSolution: () => void, isAiLoading: boolean }> = ({ ticket, allUsers, onStatusChange, onAssigneeChange, onSuggestSolution, isAiLoading }) => {
    const staffMembers = allUsers.filter(u => u.role === UserRole.STAFF || u.role === UserRole.ADMIN);
    return (
        <div className="my-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border dark:border-gray-700">
            <h3 className="font-semibold mb-4 text-lg">Admin Controls</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-muted">Change Status</label>
                    <select value={ticket.status} onChange={(e) => onStatusChange(e.target.value as TicketStatus)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-transparent dark:text-dark-text">
                        {TICKET_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-muted">Assign To</label>
                    <select value={ticket.assignedTo || ''} onChange={(e) => onAssigneeChange(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-transparent dark:text-dark-text">
                        <option value="">Unassigned</option>
                        {staffMembers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div className="self-end">
                     <button onClick={onSuggestSolution} disabled={isAiLoading} className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300 flex items-center justify-center">
                        {isAiLoading ? <Spinner size="sm"/> : 'AI Suggest Solution'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const CommentSection: React.FC<{ticket: any, addComment: (id: string, content: string) => void, isLoading: boolean}> = ({ ticket, addComment, isLoading }) => {
    const [newComment, setNewComment] = useState('');

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            addComment(ticket.id, newComment.trim());
            setNewComment('');
        }
    };
    
    return (
        <div className="mt-8 pt-6 border-t dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4">Comments</h3>
            <div className="space-y-4 mb-6">
                {ticket.comments.length > 0 ? ticket.comments.map((comment: CommentType) => (
                    <div key={comment.id} className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <p className="text-sm text-gray-800 dark:text-dark-text">{comment.content}</p>
                        <p className="text-xs text-gray-500 dark:text-dark-muted mt-2">
                            - {comment.authorName} on {new Date(comment.createdAt).toLocaleString()}
                        </p>
                    </div>
                )) : <p className="text-sm text-gray-500 dark:text-dark-muted">No comments yet.</p>}
            </div>
            <form onSubmit={handleCommentSubmit} className="flex space-x-4">
                <input 
                    type="text" 
                    value={newComment} 
                    onChange={(e) => setNewComment(e.target.value)} 
                    placeholder="Add a comment..."
                    className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-transparent dark:text-dark-text"
                />
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-primary-300">
                    {isLoading ? '...' : 'Post'}
                </button>
            </form>
        </div>
    );
};


export default TicketPage;