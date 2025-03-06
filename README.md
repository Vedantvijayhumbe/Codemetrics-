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


STEPS : - 

1) installing necessary dependancies :
   ``` npm install express axios cors dotenv cheerio 
```

note that while using ubuntu / wsl use :
```cd /mnt/c/Users/```

2) when you run this server.js file on port 5000 you'll get raw data . to convert this raw data into parsed data we'll use :

```https://github.com/callumlocke/json-formatter```

this is an open source extension for converting the data into a more readable format .This can also be done via REST/POSTMAN to get XML/JSON file output . 

3) Create an .env file : use these dependancies over there 

```MONGO_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/yourDatabase?retryWrites=true&w=majority
PORT=5000
```

4) To fetch user data from codeoforces is difficult since there is no official API to do so . We will do web scratching  for this :  https://www.zyte.com/learn/what-is-web-scraping/
5) run these programs using :
   ```node server.js```

   ```npm start ```
