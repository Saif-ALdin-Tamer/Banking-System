# NeoBank - Modern Banking System

A full-stack modern banking application built with the **MERN** stack (MongoDB, Express.js, React, Node.js). This project demonstrates a robust, scalable, and secure architecture suitable for financial transactions, featuring a beautiful UI, secure authentication, and seamless user experience.

![NeoBank Preview](https://banking-system-front-end-git-main-saif-al-din-s-projects.vercel.app/favicon.ico)

## 🔗 Live Links
- **Frontend (Live)**: [https://banking-system-front-end-git-main-saif-al-din-s-projects.vercel.app](https://banking-system-front-end-git-main-saif-al-din-s-projects.vercel.app)
- **Backend API**: [https://banking-system-back-end.vercel.app/api/health](https://banking-system-back-end.vercel.app/api/health)

## 🚀 Key Features
- **Secure Authentication**: User registration and login using JWT (JSON Web Tokens) with hashed passwords (bcryptjs).
- **Dashboard**: A comprehensive overview of user balance, recent transactions, and account details.
- **Transactions**: Secure money transfers between users, deposits, and transaction history tracking.
- **Card Management**: Virtual card generation and management.
- **Admin Panel**: Role-based access control for managing users and monitoring system transactions.
- **Payment Gateway Integration**: Stripe integration for seamless and secure deposits.
- **Responsive UI**: A modern, mobile-friendly interface built with React, Tailwind CSS, and Framer Motion.

## 🏗️ Engineering Architecture

This project is built using industry-standard software engineering principles and architectural patterns to ensure scalability, maintainability, and security:

### 1. MVC (Model-View-Controller) Pattern
The backend strictly follows the **MVC architecture**, separating concerns to make the codebase modular:
- **Models**: Defines data schemas and business logic using Mongoose (e.g., `usersModel.js`, `transactionModel.js`).
- **Controllers**: Handles incoming HTTP requests, processes logic, and interacts with Models (e.g., `authControllers.js`, `transferControllers.js`).
- **Routes (View/Router)**: Maps specific API endpoints to their respective controllers, keeping routing logic decoupled.

### 2. RESTful APIs
The backend exposes a clean and stateless **RESTful API** architecture. Endpoints are logically structured around resources (e.g., `/api/users`, `/api/transactions`, `/api/auth`), using appropriate HTTP methods (GET, POST, PUT, DELETE) and returning standardized JSON responses.

### 3. Security & Authentication
- **JWT (JSON Web Tokens)**: Stateless and secure authentication mechanism. Tokens are issued upon login and required for protected routes.
- **Password Hashing**: User passwords are encrypted using `bcryptjs` before being stored in the database.
- **CORS Configuration**: Cross-Origin Resource Sharing is strictly configured to only accept requests from the trusted frontend domain, preventing unauthorized API access.
- **Serverless Optimizations**: Connection caching mechanism is implemented for MongoDB to prevent connection drops and connection limits in a serverless environment (Vercel).

### 4. Frontend Architecture
- **Component-Based UI**: Built with **React**, utilizing functional components and hooks for reusable and manageable UI elements.
- **State Management**: Centralized application state using React Context API (`AuthContext`) for managing user sessions globally.
- **Form Validation**: Client-side validation using `react-hook-form` and `yup` for robust and performant form handling.

## 💻 Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS (v4)
- Framer Motion (Animations)
- React Router DOM (SPA Routing)
- Axios (HTTP Client)
- React Hook Form & Yup (Validation)

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- Bcrypt.js
- Stripe (Payments)

**Deployment:**
- **Vercel**: Both Frontend (SPA with rewrites) and Backend (Serverless functions) are deployed on Vercel.
- **MongoDB Atlas**: Cloud database hosting.

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)
- Stripe account (for payments)

### Backend Setup
1. Navigate to the backend directory: `cd BackEnd`
2. Install dependencies: `npm install`
3. Create a `.env` file and add the following:
   ```env
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the development server: `npm run server`

### Frontend Setup
1. Navigate to the frontend directory: `cd Frontend/front-end`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`

---
*Built by Saif Aldin Tamer*
