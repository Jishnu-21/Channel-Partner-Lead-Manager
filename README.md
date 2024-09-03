# Channel Partner Lead Manager

A comprehensive web application that allows channel partners to submit leads and store their details in a database. Internal users can access these details and visualize data through charts. This project utilizes Node.js, Express, and a database for backend functionality, along with React, Material-UI, and Recharts for a responsive and interactive frontend.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Form Validation](#form-validation)
- [Hosting](#hosting)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Lead Submission**: Channel partners can fill out a form to submit lead information.
- **Data Storage**: Lead details are securely stored in a database.
- **JWT Authentication**: Secure access using JWT tokens for internal users.
- **Data Visualization**: Internal users can view lead data and generate charts for analysis.
- **Responsive Design**: The application is fully responsive and user-friendly.

## Technologies Used

### Backend
- Node.js
- Express
- MongoDB (or your preferred database)
- JWT for authentication

### Frontend
- React
- Material-UI (MUI) for UI components
- Recharts for data visualization

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Jishnu-21/Channel-Partner-Lead-Manager.git
   cd Channel-Partner-Lead-Manager
2.Install backend dependencies:

bash
Copy code
cd backend
npm install
3.Install frontend dependencies:

bash
Copy code
cd frontend
npm install
4.Set up your environment variables for database connection and JWT secret in a .env file in the backend directory.

5.Start the backend server:

bash
Copy code
cd backend
npm start
6.Start the frontend server:

bash
Copy code
cd frontend
npm run dev
7.Open your browser and navigate to http://localhost:5173 to access the application.

OR

you can run both backend and frontend with npm run dev at root directory.

Usage
Channel partners can fill out the lead submission form with all necessary details.
Submitted leads are stored in the database and can be accessed by internal users.
Internal users can view the details of the leads and visualize the data through charts provided by Recharts.
Form Validation
The lead submission form includes validation for required fields to ensure complete data entry. Error messages will display if any required fields are left empty.

Hosting
The frontend is hosted on Vercel.
The backend server is hosted on an EC2 instance.
Contributing
Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1.Fork the repository.
1.Create a new branch: git checkout -b feature/YourFeature
2.Make your changes and commit them: git commit -m 'Add your feature'
3.Push to the branch: git push origin feature/YourFeature
4.Open a pull request.
