import React from 'react';
import TaskItem from './TaskItem.jsx';

// TaskList component for rendering the list of tasks
function TaskList({ tasks, toggleComplete, removeTask, filter }) {
  return (
    <>
      {tasks.length === 0 ? (
        <p className="no-tasks-message">
          {filter === 'all' && 'No tasks yet! Add one above.'}
          {filter === 'active' && 'No active tasks.'}
          {filter === 'completed' && 'No completed tasks.'}
        </p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              toggleComplete={toggleComplete}
              removeTask={removeTask}
            />
          ))}
        </ul>
      )}
    </>
  );
}

export default TaskList;
