# code-mentor

## The Task

Tom is Josh’s mentor for JS, but while Covid is still out there he prefers to do remote sessions.
Tom wants to share with Josh a piece of code, observe him while he is writing and changing the code in real time.

Help Tom creating an online coding web application with the following pages and features :

Lobby page (no need for authentication) :
The page should contain the title “Choose code block” and a list of at least 4 items which represents code blocks, each item can be represented by a name (for example - “Async case”)
Clicking on an item should take the user to the code block page with the details of the code block he chooses.

Code block page :
Both users should enter this page. (2 different clients)
Assume that the first user who opens the code block page is the mentor, after that, any other user will be counted as a student.

The mentor will see the code block he choose with a read only mode
The student will see the code block with the ability to change the code
Code changes should be displayed in real-time (Socket)
Use Highlight.js (or any equivalent library) to highlight the syntax
(Support JS code only)

## Running The Project

### Step 1: Clone the Repository

First, clone the project repository from GitHub using Git:

git clone https://github.com/omer2080/code-mentor.git
#### cd code-mentor

### Step 2: Set Up the Backend

Navigate to the backend directory and install dependencies:

#### cd server
#### npm install

Run the backend server:
#### npm start

This should start the Node.js server, typically listening on http://localhost:5000.

### Step 3: Set Up the Frontend

Open a new terminal window/tab. Navigate to the frontend directory from the root of the project and install dependencies:

#### cd ../client
#### npm install

Run the React application:
#### npm run dev

Open browser with the client URL.


## Deployment

This project has been deployed and is accessible online at [code-mentor.onrender.com](https://code-mentor.onrender.com).

