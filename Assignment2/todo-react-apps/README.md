# 📝 React To-Do List Application

A clean and powerful **To-Do List Application** built with **React.js** and styled using plain **CSS**, designed to help users manage daily tasks efficiently. This app follows a modular component-based architecture for scalability and maintainability.

---

## 🚀 Project Overview

This repository hosts a robust and user-friendly To-Do List application. It offers task creation, status tracking, and data persistence through browser local storage. Ideal for learning or demonstrating basic to intermediate-level React practices.

---

## ✨ Features

- **🧾 Task Management**: Easily add new tasks to your list.
- **✅ Status Toggling**: Mark tasks as complete or incomplete with a single click.
- **🗑️ Task Removal**: Delete tasks that are no longer needed.
- **🛡️ Input Validation**: Prevents empty or duplicate tasks with helpful feedback.
- **🔍 Dynamic Filtering**: View all tasks, only active tasks, or only completed tasks.
- **🔃 Flexible Sorting**: Sort by creation date (newest first), A-Z, or completion status.
- **💾 Local Persistence**: Tasks are stored in `localStorage`, so data stays even after refresh.
- **📱 Responsive Design**: Works smoothly across all screen sizes and devices.

---

## 📸 Screenshots

*(Add your screenshots inside a `/screenshots` folder and reference them here)*

| Desktop View               
|----------------------------
| ![](.todo.png) | 

---

## 📁 Project Structure
| ![](.todo.png) | 
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
│   ├── reportWebVitals.js // For measuring performance (standard CRA file).
│   └── setupTests.js      // For Jest/testing setup (standard CRA file).
├── package.json         // Defines project metadata, scripts, and dependencies.
├── README.md            // This file.
└── .gitignore           // Specifies intentionally untracked files to ignore by Git.

## ⚙️ Getting Started

Follow these steps to get a local copy of the project up and running on your machine.

### 🔧 Prerequisites

Make sure you have **Node.js** and **npm** (Node Package Manager) or **Yarn** installed on your system.

- **Node.js**: [Download & Install Node.js](https://nodejs.org/) (includes npm)


## 📦 Installation

### Clone the repository:

```bash
git clone https://github.com/Garvit1904/Celebal_Technologies_Garvit.git
cd Celebal_Technologies_Garvit/Assignment2
```

### 📦 Install Dependencies

Using **npm**:

```bash
npm install
```
### 🚀 Running the Application

After installation, you can start the development server:

Using **npm**:

```bash
npm start
```
This will open the application in your browser at http://localhost:3000 (or another available port). The app will automatically reload if you make any changes to the source code.
## 🎯 Usage

- **➕ Add a Task**  
  Type your task into the input field and press **Enter** or click the **"Add Task"** button.

- **✅ Mark as Complete**  
  Click the **checkbox** next to a task to toggle its completion status.

- **🗑️ Remove a Task**  
  Click the **trash can icon** next to a task to delete it from the list.

- **📂 Filter Tasks**  
  Use the **"All"**, **"Active"**, and **"Completed"** buttons to display tasks based on their status.

- **🔃 Sort Tasks**  
  Use the **dropdown menu** to sort your tasks by:
  - **Newest** (default)
  - **A-Z** (alphabetical)
  - **Status** (incomplete first)


