# Employee Management System

A full-stack Employee Management System built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

------------------------------------------------------------

FEATURES

- Admin Login using JWT Authentication
- Add Employee
- View All Employees
- Search Employees by Name
- Filter Employees by Department
- Combined Search + Filter
- Upload Employee Photo (Multer)
- Delete Employee
- Protected Dashboard Route
- REST API Integration

------------------------------------------------------------

TECH STACK

Frontend:
- React.js
- Axios
- React Router DOM

Backend:
- Node.js
- Express.js
- MongoDB (MongoDB Atlas)
- Mongoose
- JWT Authentication
- Bcrypt.js
- Multer (for file upload)

------------------------------------------------------------

PROJECT STRUCTURE

employee-management-system/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md

------------------------------------------------------------

SETUP INSTRUCTIONS

Clone the Repository

git clone https://github.com/Kashish0814/employee-management-system.git
cd employee-management-system


------------------------------------------------------------

Backend Setup

cd backend
npm install

Create a .env file inside the backend folder and add:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Then start backend:

npm run dev

Backend will run at:
http://localhost:5000

------------------------------------------------------------

Frontend Setup

Open a new terminal:

cd frontend
npm install
npm start

Frontend will run at:
http://localhost:3000

------------------------------------------------------------

DEFAULT ADMIN LOGIN

You can create an admin user using MongoDB or Postman.

Example credentials:

Email: admin@gmail.com
Password: 123456

------------------------------------------------------------

API ENDPOINTS

Authentication:
POST /api/auth/login

Employee Routes:
POST /api/employees
GET /api/employees
DELETE /api/employees/:id

Search Example:
GET /api/employees?search=John

Filter Example:
GET /api/employees?department=HR

Combined Example:
GET /api/employees?search=John&department=HR

------------------------------------------------------------

FILE UPLOAD

Employee images are stored inside:
backend/uploads/

------------------------------------------------------------
FUTURE IMPROVEMENTS

- Edit Employee Feature
- Pagination
- Role-Based Access Control
- Cloud Deployment

------------------------------------------------------------
DEVELOPED BY

Kashish Yadav

