# Codemetrics-
Real time tracker of codeforces , codechef , github . tells about the recent commits on git , submissions on codeforces and codechef . 
Here I am using Node js and codeforces , codechef and github apis to access this data . 
To parse the raw data and convert into a more readable format I have use a JSON formatter extension from google web store . 

/Codemetrics 

│── /models

│   ├── userModel.js  <-- (Define the MongoDB Schema here)

│── /routes

│   ├── userRoutes.js <-- (Define API routes here)

│── /controllers

│   ├── userController.js <-- (Logic for handling requests)

│── server.js  <-- (Main entry point)

│── package.json

│── .env  <-- (For storing database credentials)

----> for Codeforces : used API keys 

----> for Codechef : used web scratching since no actual API exist for it 

----> for github : used API keys 
