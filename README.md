Firebase CRUD Application
Overview
This project is a Next.js application that demonstrates CRUD (Create, Read, Update, Delete) operations using Firebase as the backend. It includes features such as user authentication, customer management, and an audit log system to track changes made to the data.

Features
User Authentication with Firebase
Customer Management (Create, Read, Update, Delete)
Audit Logging System
Responsive Design
Prerequisites
Before you begin, ensure you have met the following requirements:

Node.js (v14 or later)
npm or yarn
A Firebase account and project
Installation
Clone the repository:

git clone https://github.com/your-username/firebase-crud-app.git
cd firebase-crud-app
Install the dependencies:

npm install
or

yarn install
Set up your Firebase configuration:

Create a .env.local file in the root directory

Add your Firebase configuration variables:

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
Usage
To run the development server:

npm run dev
or

yarn dev
Open http://localhost:3000 with your browser to see the result.

Project Structure
/components: React components used throughout the application
/contexts: React contexts for state management
/lib: Utility functions and Firebase initialization
/pages: Next.js pages and API routes
/styles: CSS modules for styling components
/redux: Redux store and slices (if applicable)
Key Components
Customers.tsx: Manages the list of customers and CRUD operations
AuditLogs.tsx: Displays the audit logs of actions performed in the system
UserProfile.tsx: Handles user profile management
Layout.tsx: Provides the overall layout structure for the application
API Routes
/api/customers: Handles customer-related operations (GET, POST)
/api/customers/[id]: Handles operations for specific customers (PUT, DELETE)
/api/audit-logs: Retrieves audit logs
/api/user/profile: Manages user profile information
Audit Logging
The application includes an audit logging system that tracks actions performed by users. This includes:

Customer creation
Customer updates
Customer deletion
User profile updates
Audit logs capture the before and after states of entities, providing a detailed history of changes.

Authentication
User authentication is handled using Firebase Authentication. The application includes:

Login functionality
User registration
Protected routes that require authentication
Styling
The application uses CSS Modules for styling, ensuring that styles are scoped to their respective components. The styles directory contains the CSS module files for each component.

Deployment
This application can be deployed to Vercel or any other platform that supports Next.js applications. Ensure that you set up the environment variables in your deployment platform to match those in your .env.local file.

Contributing
Contributions to this project are welcome. Please fork the repository and create a pull request with your changes.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Support
If you encounter any issues or have questions, please file an issue on the GitHub repository.
