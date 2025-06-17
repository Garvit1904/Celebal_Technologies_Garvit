import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ tasks, toggleComplete, removeTask, filter }) => {
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return filter === 'completed' ? task.completed : !task.completed;
  });

  return (
    <ul>
      {filteredTasks.map(task => (
        <TodoItem
          key={task.id}
          task={task}
          toggleComplete={toggleComplete}
          removeTask={removeTask}
        />
      ))}
    </ul>
  );
};

export default TodoList;
