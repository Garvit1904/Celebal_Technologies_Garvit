React To-Do List Application
🚀 Project Overview
This repository hosts a robust and user-friendly To-Do List application built with React.js and styled with standard CSS. Designed for simplicity and efficiency, this application allows users to effectively manage their daily tasks, offering features for task creation, status tracking, and data persistence. It demonstrates a clean, component-based architecture for enhanced maintainability and scalability.

✨ Features
Task Management: Easily add new tasks to your list.

Status Toggling: Mark tasks as complete or incomplete with a single click.

Task Removal: Delete tasks that are no longer needed.

Input Validation: Prevents the addition of empty or duplicate tasks, providing helpful feedback.

Dynamic Filtering: View all tasks, only active tasks, or only completed tasks.

Flexible Sorting: Organize tasks by creation date (newest first), alphabetically (A-Z), or by completion status.

Local Persistence: All tasks are automatically saved to your browser's localStorage, ensuring your data remains intact even after closing or refreshing the browser.

Responsive Design: The user interface adapts seamlessly across various devices and screen sizes.

📸 Screenshots
Here's a glimpse of the application's user interface:

todo.png



📁 Project Structure
The application follows a standard React project layout, promoting modularity and separation of concerns:

my-todo-app/
├── public/
│   ├── index.html       // The main HTML file where the React app is mounted.
│   └── favicon.ico      // Website icon.
├── src/
│   ├── App.jsx          // The core application component, managing global state and data flow.
│   ├── index.js         // The entry point for the React application, renders the App component.
│   ├── App.css          // Contains all the custom CSS styles for the application.
│   ├── components/      // A directory for reusable UI components.
│   │   ├── TaskForm.jsx           // Component for adding new tasks.
│   │   ├── TaskList.jsx           // Component for rendering the list of tasks.
│   │   ├── TaskItem.jsx           // Component for displaying a single task item.
│   │   └── FilterSortControls.jsx // Component for filtering and sorting options.
│   └── reportWebVitals.js // For measuring performance (standard CRA file).
│   └── setupTests.js      // For Jest/testing setup (standard CRA file).
├── package.json         // Defines project metadata, scripts, and dependencies.
├── README.md            // This file.
└── .gitignore           // Specifies intentionally untracked files to ignore by Git.

⚙️ Getting Started
Follow these steps to get a local copy of the project up and running on your machine.

Prerequisites
Make sure you have Node.js and npm (Node Package Manager) or Yarn installed on your system.

Node.js: Download & Install Node.js (includes npm)

Yarn (Optional): npm install --global yarn

Installation
Clone the repository:

git clone <https://github.com/Garvit1904/Celebal_Technologies_Garvit/tree/main/Assignment2>
cd my-todo-app

Install dependencies:
Using npm:

npm install

Running the Application
After installation, you can start the development server:

Using npm:

npm start

This will open the application in your browser at http://localhost:3000 (or another available port). The app will automatically reload if you make any changes to the source code.

🎯 Usage
Add a Task: Type your task into the input field and press Enter or click the "Add Task" button.

Mark as Complete: Click the checkbox next to a task to toggle its completion status.

Remove a Task: Click the trash can icon next to a task to delete it from the list.

Filter Tasks: Use the "All", "Active", and "Completed" buttons to display tasks based on their status.

Sort Tasks: Use the dropdown menu to sort your tasks by "Newest" (default), "A-Z" (alphabetical), or "Status" (incomplete first).

