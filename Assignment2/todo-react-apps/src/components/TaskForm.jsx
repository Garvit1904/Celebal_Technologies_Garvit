import React, { useState } from 'react';

// TaskForm component for adding new tasks
function TaskForm({ onSubmitTask, validationMessage, newTaskInputRef }) {
  const [newTask, setNewTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitTask(newTask); // Call the parent's addTask function
    setNewTask(''); // Clear the input field after submission
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          className="task-input"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          ref={newTaskInputRef} // Assign the ref for focus management
        />
        <button
          type="submit"
          className="add-task-btn"
        >
          Add Task
        </button>
      </form>
      {/* Validation Message, rendered conditionally */}
      {validationMessage && (
        <p className="validation-message">{validationMessage}</p>
      )}
    </>
  );
}

export default TaskForm;
