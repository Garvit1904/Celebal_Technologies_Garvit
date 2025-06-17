import React from 'react';

const TodoItem = ({ task, toggleComplete, removeTask }) => {
  return (
    <li>
      <span
        onClick={() => toggleComplete(task.id)}
        style={{
          textDecoration: task.completed ? 'line-through' : 'none',
          cursor: 'pointer',
        }}
      >
        {task.text}
      </span>
      <button onClick={() => removeTask(task.id)}>❌</button>
    </li>
  );
};

export default TodoItem;
