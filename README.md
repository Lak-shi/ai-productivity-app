# Productivity App - Donna

## Overview
Donna is an intelligent task management system that helps users organize, prioritize, and schedule their tasks efficiently. The application provides a user-friendly interface with both **list** and **calendar** views, enabling seamless task tracking. AI-powered prioritization ensures that tasks are arranged based on their urgency and importance.

## Setup Instructions
### Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (v14 or later)
- **npm** (Node Package Manager)
- **PostgreSQL** (for task storage)

### Steps to Run the Application
1. **Clone the repository:**

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file and add the following:
   ```env
   DATABASE_URL=your_postgres_database_url
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Start the backend server:**
   ```sh
   npm run server
   ```

5. **Start the frontend application:**
   ```sh
   npm start
   ```
6. Start PostgreSQL in Docker

The application will be accessible at `http://localhost:3000`.

## Project Structure
```
Donna/
│── backend/          # Express backend for task management
│── frontend/         # React frontend with task UI
│── database/         # PostgreSQL database setup and queries
│── .env              # Environment variables
│── package.json      # Project dependencies and scripts
│── README.md         # Documentation
```

## Features
- **Task Management:** Add, update, delete, and mark tasks as completed.
- **AI-Powered Prioritization:** Tasks are arranged based on urgency.
- **List & Calendar View:** Toggle between list and calendar mode.
- **Task Categorization:** Tasks are color-coded based on priority.
- **Completion Tracking:** Separate sections for scheduled and completed tasks.

## Use Cases
- **Project Management:** Keep track of deadlines and prioritize work.
- **Daily Planning:** Schedule personal and professional tasks effectively.
- **Collaboration:** Share task lists and deadlines with teams.

## Future Enhancements
- **AI-Powered Task Suggestions:** Implement AI-driven recommendations based on task history, deadlines, and priorities.
- **Smart Reminders & Notifications:** Receive timely alerts for upcoming or overdue tasks via email, push notifications, or in-app pop-ups.
- **Recurring Tasks Automation:** Automate the scheduling of repetitive tasks to improve workflow efficiency.
- **Optimized Task Fetching (Reduced Latency):** Improve API response time by implementing caching (Redis), pagination, and optimizing database queries.
- **Offline Mode:** Allow users to add and view tasks without an internet connection, syncing automatically when online.
- **Dark Mode & Theme Customization:** Provide users with a choice of themes, including dark mode, for better UI customization.
