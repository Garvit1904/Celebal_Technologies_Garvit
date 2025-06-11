import React, { useState, useEffect, useRef } from 'react';
import TaskForm from './components/TaskForm.jsx';
import FilterSortControls from './components/FilterSortControls.jsx';
import TaskList from './components/TaskList.jsx';
import './App.css'; // Import the main CSS file

// Main App component
function App() {
  // State to store the list of tasks
  const [tasks, setTasks] = useState([]);
  // State for filtering tasks (all, active, completed)
  const [filter, setFilter] = useState('all');
  // State for sorting tasks (default, alphabetical, status)
  const [sort, setSort] = useState('default');
  // State for showing a validation message from TaskForm
  const [validationMessage, setValidationMessage] = useState('');
  // Ref for the new task input field, passed down to TaskForm
  const newTaskInputRef = useRef(null);

  // useEffect hook to load tasks from localStorage when the component mounts
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('react-todo-list-tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage:", error);
    }
  }, []); // Empty dependency array means this runs once on mount

  // useEffect hook to save tasks to localStorage whenever the tasks state changes
  useEffect(() => {
    try {
      localStorage.setItem('react-todo-list-tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to localStorage:", error);
    }
  }, [tasks]); // Runs whenever the 'tasks' state changes

  // Function to handle adding a new task
  const addTask = (newTaskText) => {
    const trimmedTask = newTaskText.trim();

    if (!trimmedTask) {
      setValidationMessage('Task cannot be empty.');
      setTimeout(() => setValidationMessage(''), 3000);
      return;
    }

    if (tasks.some(task => task.text.toLowerCase() === trimmedTask.toLowerCase())) {
      setValidationMessage('This task already exists!');
      setTimeout(() => setValidationMessage(''), 3000);
      return;
    }

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: trimmedTask,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);
    setValidationMessage('');
    newTaskInputRef.current.focus();
  };

  // Function to handle toggling a task's completion status
  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Function to handle removing a task
  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Function to filter tasks based on the current filter state
  const getFilteredTasks = () => {
    switch (filter) {
      case 'active':
        return tasks.filter((task) => !task.completed);
      case 'completed':
        return tasks.filter((task) => task.completed);
      case 'all':
      default:
        return tasks;
    }
  };

  // Function to sort tasks based on the current sort state
  const getSortedTasks = (filteredTasks) => {
    const sorted = [...filteredTasks];

    switch (sort) {
      case 'alphabetical':
        return sorted.sort((a, b) => a.text.localeCompare(b.text));
      case 'status':
        return sorted.sort((a, b) => a.completed - b.completed);
      case 'default':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  // Get the tasks to display after filtering and sorting
  const displayedTasks = getSortedTasks(getFilteredTasks());

  return (
    <div className="app-container">
      <div className="todo-card">
        <h1 className="app-title">My To-Do List</h1>

        {/* Task Form Component */}
        <TaskForm onSubmitTask={addTask} validationMessage={validationMessage} newTaskInputRef={newTaskInputRef} />

        {/* Filter and Sort Controls Component */}
        <FilterSortControls filter={filter} setFilter={setFilter} sort={sort} setSort={setSort} />

        {/* Task List Component */}
        <TaskList tasks={displayedTasks} toggleComplete={toggleComplete} removeTask={removeTask} filter={filter} />
      </div>
    </div>
  );
}

export default App;
