import React from 'react';

// TaskItem component for an individual task
function TaskItem({ task, toggleComplete, removeTask }) {
  return (
    <li className="task-item">
      {/* Checkbox for completion */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleComplete(task.id)}
        className="task-checkbox"
      />
      {/* Task text */}
      <span className={`task-text ${task.completed ? 'completed' : ''}`}>
        {task.text}
      </span>
      {/* Remove button */}
      <button
        onClick={() => removeTask(task.id)}
        className="remove-task-btn"
        aria-label={`Remove task: ${task.text}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </li>
  );
}

export default TaskItem;
