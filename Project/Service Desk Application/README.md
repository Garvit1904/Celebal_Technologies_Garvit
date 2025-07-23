# GenDesk - AI-Powered Service Desk

This is a modern, responsive service desk application for managing support tickets. It features role-based access control and uses the Gemini API for AI-powered ticket categorization and solution suggestions.

## How to Run This Application Locally

This project is designed to be easy to run locally using Node.js and npm.

### Prerequisites

*   [Node.js](https://nodejs.org/) (which includes npm) installed on your machine.

### Step 1: Add Your Gemini API Key

The application needs a Gemini API key to power its AI features.

1.  Open the `env.js` file.
2.  You will see a line: `API_KEY: 'YOUR_GEMINI_API_KEY_HERE'`.
3.  Replace `YOUR_GEMINI_API_KEY_HERE` with your actual Gemini API key.
4.  Save the file.

**Note:** This method is for local development. Do not commit this file to a public repository with your key in it.

### Step 2: Install Dependencies

Open a terminal or command prompt in the project's root directory (the folder containing `package.json`) and run:
```bash
npm install
```
This will download and install the simple web server needed to run the project.

### Step 3: Run the Application

Once the installation is complete, start the development server by running:
```bash
npm start
```
You should see a message indicating the server is running, usually on port 3000.

### Step 4: Open in Browser

Open your web browser and navigate to:
[**http://localhost:3000**](http://localhost:3000)

The GenDesk application should now be running! You can use the demo accounts mentioned on the login page to explore the different roles.
