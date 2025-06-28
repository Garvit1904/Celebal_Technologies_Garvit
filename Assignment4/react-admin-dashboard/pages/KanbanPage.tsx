import React, { useState, DragEvent } from 'react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { mockKanbanData } from '../services/mockData';
import { KanbanBoardData, KanbanColumn, KanbanTask } from '../types';
import { PlusIcon, EditIcon, TrashIcon, GripVerticalIcon } from '../components/Icons';
import { KANBAN_COLUMNS_IDS } from '../constants';


const KanbanPage: React.FC = () => {
  const [boardData, setBoardData] = useState<KanbanBoardData>(mockKanbanData);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
  const [targetColumnId, setTargetColumnId] = useState<string>(KANBAN_COLUMNS_IDS.TODO);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const [draggedTask, setDraggedTask] = useState<{ task: KanbanTask; fromColumnId: string } | null>(null);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, task: KanbanTask, fromColumnId: string) => {
    setDraggedTask({ task, fromColumnId });
    // e.dataTransfer.setData('text/plain', task.id); // Not strictly needed for this internal D&D
    e.currentTarget.classList.add('opacity-50', 'ring-2', 'ring-primary-500');
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, toColumnId: string) => {
    e.preventDefault(); // Necessary to allow dropping
    // Add visual feedback for drop target if needed
    const columnElement = e.currentTarget;
    if (!columnElement.classList.contains('bg-primary-500/10')) {
        columnElement.classList.add('bg-primary-500/10', 'dark:bg-primary-500/20');
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('bg-primary-500/10', 'dark:bg-primary-500/20');
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, toColumnId: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-primary-500/10', 'dark:bg-primary-500/20');
    
    if (!draggedTask) return;

    const { task, fromColumnId } = draggedTask;

    if (fromColumnId === toColumnId) {
      // Reorder within the same column - more complex, for now, just move to end
      const column = { ...boardData[fromColumnId] };
      column.tasks = column.tasks.filter(t => t.id !== task.id);
      column.tasks.push(task); // Simple move to end for now
      setBoardData({ ...boardData, [fromColumnId]: column });
    } else {
      // Move to a different column
      const fromCol = { ...boardData[fromColumnId] };
      fromCol.tasks = fromCol.tasks.filter(t => t.id !== task.id);

      const toCol = { ...boardData[toColumnId] };
      toCol.tasks = [...toCol.tasks, task];

      setBoardData({
        ...boardData,
        [fromColumnId]: fromCol,
        [toColumnId]: toCol,
      });
    }
    setDraggedTask(null);
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50', 'ring-2', 'ring-primary-500');
    setDraggedTask(null); // Clean up
  };


  const openAddTaskModal = (columnId: string) => {
    setEditingTask(null);
    setTargetColumnId(columnId);
    setNewTaskContent('');
    setNewTaskPriority('medium');
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task: KanbanTask, columnId: string) => {
    setEditingTask(task);
    setTargetColumnId(columnId); // Column where task currently resides
    setNewTaskContent(task.content);
    setNewTaskPriority(task.priority || 'medium');
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = () => {
    if (!newTaskContent.trim()) {
      alert("Task content cannot be empty.");
      return;
    }

    if (editingTask) { // Editing existing task
      const updatedTask = { ...editingTask, content: newTaskContent, priority: newTaskPriority };
      const column = { ...boardData[targetColumnId] };
      column.tasks = column.tasks.map(t => t.id === editingTask.id ? updatedTask : t);
      setBoardData({ ...boardData, [targetColumnId]: column });
    } else { // Adding new task
      const newTask: KanbanTask = {
        id: `task-${Date.now()}`,
        content: newTaskContent,
        priority: newTaskPriority,
      };
      const column = { ...boardData[targetColumnId] };
      column.tasks = [...column.tasks, newTask];
      setBoardData({ ...boardData, [targetColumnId]: column });
    }
    setIsTaskModalOpen(false);
  };

  const handleDeleteTask = (taskToDelete: KanbanTask, columnId: string) => {
    if (window.confirm(`Are you sure you want to delete task: "${taskToDelete.content}"?`)) {
        const column = { ...boardData[columnId] };
        column.tasks = column.tasks.filter(t => t.id !== taskToDelete.id);
        setBoardData({ ...boardData, [columnId]: column });
    }
    // If editing modal was open for this task, close it
    if(editingTask && editingTask.id === taskToDelete.id) {
        setIsTaskModalOpen(false);
    }
  };
  
  const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'border-red-500 dark:border-red-400';
      case 'medium': return 'border-yellow-500 dark:border-yellow-400';
      case 'low': return 'border-green-500 dark:border-green-400';
      default: return 'border-secondary-300 dark:border-secondary-600';
    }
  };


  return (
    <div className="space-y-6">
      <Card title="Project Kanban Board">
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 overflow-x-auto pb-4">
          {Object.values(boardData).map((column: KanbanColumn) => (
            <div
              key={column.id}
              className="flex-shrink-0 w-full md:w-80 bg-secondary-100 dark:bg-secondary-700/50 rounded-lg p-3 shadow"
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDrop={(e) => handleDrop(e, column.id)}
              onDragLeave={handleDragLeave}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-secondary-800 dark:text-secondary-200">{column.title} ({column.tasks.length})</h3>
                <button
                  onClick={() => openAddTaskModal(column.id)}
                  className="p-1.5 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-500/20 rounded-full"
                  title="Add task to this column"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto pr-1 custom-scrollbar"> {/* Ensure scrollbar appears */}
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task, column.id)}
                    onDragEnd={handleDragEnd}
                    className={`p-3 bg-white dark:bg-secondary-800 rounded-md shadow-sm cursor-grab hover:shadow-md transition-shadow border-l-4 ${getPriorityColor(task.priority)}`}
                  >
                    <div className="flex items-start justify-between">
                        <p className="text-sm text-secondary-700 dark:text-secondary-300 flex-grow mr-2">{task.content}</p>
                        <GripVerticalIcon className="w-5 h-5 text-secondary-400 dark:text-secondary-500 flex-shrink-0 cursor-grab" />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                        <span className={`px-1.5 py-0.5 rounded-full text-white text-[10px] ${
                            task.priority === 'high' ? 'bg-red-500' :
                            task.priority === 'medium' ? 'bg-yellow-500' :
                            task.priority === 'low' ? 'bg-green-500' : 'bg-secondary-400'
                        }`}>
                            {task.priority || 'N/A'}
                        </span>
                        <div className="space-x-1">
                            <button onClick={() => openEditTaskModal(task, column.id)} className="text-primary-500 hover:text-primary-700 p-0.5" title="Edit Task">
                                <EditIcon className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteTask(task, column.id)} className="text-red-500 hover:text-red-700 p-0.5" title="Delete Task">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                  </div>
                ))}
                {column.tasks.length === 0 && (
                    <div className="text-center text-sm text-secondary-500 dark:text-secondary-400 py-4">
                        No tasks here.
                    </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Add/Edit Task Modal */}
      <Modal
        title={editingTask ? 'Edit Task' : 'Add New Task'}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        footer={
          <>
            <button onClick={() => setIsTaskModalOpen(false)} className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-600 hover:bg-secondary-200 dark:hover:bg-secondary-500 rounded-lg">Cancel</button>
            <button onClick={handleSaveTask} className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg">{editingTask ? 'Save Changes' : 'Add Task'}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="task-content" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Content *</label>
            <textarea id="task-content" value={newTaskContent} onChange={(e) => setNewTaskContent(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-secondary-700 dark:text-white"></textarea>
          </div>
          <div>
            <label htmlFor="task-priority" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Priority</label>
            <select id="task-priority" value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-secondary-700 dark:text-white">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          {!editingTask && ( // Only show column selection when adding a new task if modal is generic, not column-specific
            <div>
                <label htmlFor="task-column" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Column</label>
                <select 
                    id="task-column" 
                    value={targetColumnId} 
                    onChange={(e) => setTargetColumnId(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-secondary-700 dark:text-white"
                >
                    {Object.values(boardData).map(col => (
                        <option key={col.id} value={col.id}>{col.title}</option>
                    ))}
                </select>
            </div>
          )}
        </div>
      </Modal>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #a0aec0; /* gray-400 */
            border-radius: 3px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #4a5568; /* gray-600 */
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #718096; /* gray-500 */
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #2d3748; /* gray-700 */
        }
      `}</style>
    </div>
  );
};

export default KanbanPage;
