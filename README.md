Calorie Counter (Full Stack)

A full-stack calorie tracking application built with React, Node.js, Express, and SQLite.
Users can register, log in, and track their daily food intake with automatic calorie totals.

Live Demo:
https://calorie-counter-fullstack.onrender.com

⸻

Features
	•	User authentication with JWT
	•	Register and login system
	•	Add foods with calorie counts
	•	Delete foods
	•	Automatic total calorie calculation
	•	Persistent login using localStorage
	•	Protected API routes
	•	Deployed full-stack application

⸻

Tech Stack

Frontend:
	•	React
	•	Vite
	•	JavaScript
	•	Fetch API

Backend:
	•	Node.js
	•	Express
	•	JWT authentication
	•	bcrypt password hashing

Database:
	•	SQLite
	•	better-sqlite3

Deployment:
	•	Render

⸻

How It Works
	1.	Users register with an email and password.
	2.	Passwords are hashed using bcrypt before being stored.
	3.	When a user logs in, the server returns a JWT token.
	4.	The frontend stores the token in localStorage.
	5.	All protected API requests include the token in the Authorization header.
	6.	The backend verifies the token before allowing access to food data.

⸻

API Endpoints

Auth:

POST /register
Creates a new user account.

POST /login
Authenticates a user and returns a JWT token.

Foods:

GET /foods
Returns all foods for the authenticated user.

POST /foods
Adds a new food item.

DELETE /foods/:id
Deletes a food item belonging to the authenticated user.

Local Development
Clone the repository:
git clone https://github.com/ConnorWrites/calorie-counter-fullstack.git
git calorie-counter-fullstack

Install backend dependencies:
cd backend
npm install

Run the backend:
node index.js

The server will start on http://localhost:4000
Open the app in your browser and test the API.

Deployment notes:
This project is deployed on Render as a single full-stack service.
The React frontend is built using:
npm run build
The resulting dist folder is served Express using:
express.static()
This allows the React frontend and Node API to run from the same server.

Tradeoffs:
SQLite is used for simplicity and ease of setup.
However, on Render free services the filesystem is ephemeral, meaning the database may reset when the server redeploys.

For production systems, a hosted database such as PostgreSQL would be recommended.

Future imporvements:
Possible features to extend the project:
- Edit food entries
- Daily calorie goals
- Food search/autocomplete
- Charts for calorie tracking
- Mobile-friendly UI styling
- PostgreSQL database

Author:
Conrad Wilken
GitHub:
https://github.com/ConnorWrites
