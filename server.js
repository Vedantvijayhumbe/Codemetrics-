// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");

// const app = express();
// app.use(express.json());
// app.use(cors());

// const PORT = 5000;

// // Fetch Codeforces Submissions
// app.get("/codeforces/:username", async (req, res) => {
//     try {
//         const { username } = req.params;
//         const response = await axios.get(`https://codeforces.com/api/user.status?handle=${username}&from=1&count=10`);
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to fetch Codeforces data" });
//     }
// });
// //fetching codechef data 
// app.get("/codechef/:username", async (req, res) => {
//     try {
//         const { username } = req.params;
//         const response = await axios.get(`https://codechef.com/api/user.status?handle=${username}&from=1&count=10`);
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to fetch Codechef data" });
//     }
// });

// // Fetch GitHub Commits
// app.get("/github/:username", async (req, res) => {
//     try {
//         const { username } = req.params;
//         const response = await axios.get(`https://api.github.com/users/${username}/events/public`);
//         const commits = response.data.filter(event => event.type === "PushEvent");
//         res.json(commits);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to fetch GitHub data" });
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");
// const cheerio = require("cheerio"); // For scraping CodeChef

// const app = express();
// app.use(express.json());
// app.use(cors());

// const PORT = 5000;

// // Fetch Codeforces Submissions
// app.get("/codeforces/:username", async (req, res) => {
//     try {
//         const { username } = req.params;
//         const response = await axios.get(`https://codeforces.com/api/user.status?handle=${username}&from=1&count=10`);
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to fetch Codeforces data" });
//     }
// });

// // Fetch CodeChef User Data (via Web Scraping)
// app.get("/codechef/:username", async (req, res) => {
//     try {
//         const { username } = req.params;
//         const url = `https://www.codechef.com/users/${username}`;
//         const { data } = await axios.get(url);
//         const $ = cheerio.load(data);

//         // Extract relevant user details
//         const rating = $(".rating-number").text().trim();
//         const stars = $(".rating-star").text().trim();
//         const globalRank = $(".rating-ranks .inline-list li").first().text().trim();
//         const countryRank = $(".rating-ranks .inline-list li").last().text().trim();

//         res.json({
//             username,
//             rating,
//             stars,
//             globalRank,
//             countryRank
//         });
//     } catch (error) {
//         res.status(500).json({ error: "Failed to fetch CodeChef data" });
//     }
// });

// // Fetch GitHub Public Commits
// app.get("/github/:username", async (req, res) => {
//     try {
//         const { username } = req.params;
//         const response = await axios.get(`https://api.github.com/users/${username}/events/public`);
//         const commits = response.data
//             .filter(event => event.type === "PushEvent")
//             .map(event => ({
//                 repo: event.repo.name,
//                 message: event.payload.commits.map(commit => commit.message),
//                 timestamp: event.created_at
//             }));

//         res.json(commits);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to fetch GitHub data" });
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });



const express = require("express");
const axios = require("axios");
const cors = require("cors");
const cheerio = require("cheerio");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;
const MONGO_URI = "mongodb://localhost:27017/cp_tracker"; // Change this if using MongoDB Atlas

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected!"))
    .catch(err => console.error("MongoDB connection error:", err));

// Define MongoDB Schema
const UserDataSchema = new mongoose.Schema({
    platform: String, // "codeforces", "codechef", or "github"
    username: String,
    data: Object,
    fetchedAt: { type: Date, default: Date.now }
});

const UserData = mongoose.model("UserData", UserDataSchema);

// Fetch Codeforces Data and Save to MongoDB
app.get("/codeforces/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const response = await axios.get(`https://codeforces.com/api/user.status?handle=${username}&from=1&count=10`);
        
        // Save to MongoDB
        await UserData.findOneAndUpdate(
            { platform: "codeforces", username },
            { data: response.data, fetchedAt: new Date() },
            { upsert: true, new: true }
        );

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch Codeforces data" });
    }
});

// Fetch CodeChef Data and Save to MongoDB
app.get("/codechef/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const url = `https://www.codechef.com/users/${username}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const rating = $(".rating-number").text().trim();
        const stars = $(".rating-star").text().trim();
        const globalRank = $(".rating-ranks .inline-list li").first().text().trim();
        const countryRank = $(".rating-ranks .inline-list li").last().text().trim();

        const userData = { username, rating, stars, globalRank, countryRank };

        // Save to MongoDB
        await UserData.findOneAndUpdate(
            { platform: "codechef", username },
            { data: userData, fetchedAt: new Date() },
            { upsert: true, new: true }
        );

        res.json(userData);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch CodeChef data" });
    }
});

// Fetch GitHub Data and Save to MongoDB
app.get("/github/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const response = await axios.get(`https://api.github.com/users/${username}/events/public`);
        const commits = response.data
            .filter(event => event.type === "PushEvent")
            .map(event => ({
                repo: event.repo.name,
                message: event.payload.commits.map(commit => commit.message),
                timestamp: event.created_at
            }));

        // Save to MongoDB
        await UserData.findOneAndUpdate(
            { platform: "github", username },
            { data: commits, fetchedAt: new Date() },
            { upsert: true, new: true }
        );

        res.json(commits);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch GitHub data" });
    }
});

// API to View Stored Data from MongoDB
app.get("/database/:platform/:username", async (req, res) => {
    try {
        const { platform, username } = req.params;
        const userData = await UserData.findOne({ platform, username });

        if (!userData) {
            return res.status(404).json({ error: "No data found" });
        }

        res.json(userData);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving data from MongoDB" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




// require("dotenv").config(); // Load environment variables first

// require("dotenv").config();
// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Root route
// app.get("/", (req, res) => {
//     res.send("Welcome to the Competitive Tracker API!");
// });

// // ✅ Route to fetch GitHub data
// app.get("/github/:username", async (req, res) => {
//     const { username } = req.params;
//     try {
//         const response = await axios.get(`https://api.github.com/users/${username}`);
//         res.json(response.data);
//     } catch (error) {
//         res.status(400).json({ error: "GitHub user not found" });
//     }
// });

// // ✅ Route to fetch Codeforces data
// app.get("/codeforces/:username", async (req, res) => {
//     const { username } = req.params;
//     try {
//         const response = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
//         res.json(response.data);
//     } catch (error) {
//         res.status(400).json({ error: "Codeforces user not found" });
//     }
// });

// // ✅ Route to fetch CodeChef data
// app.get("/codechef/:username", async (req, res) => {
//     const { username } = req.params;
//     try {
//         const response = await axios.get(`https://www.codechef.com/users/${username}`);
//         res.json({ message: `Scrape CodeChef profile for ${username}` });
//     } catch (error) {
//         res.status(400).json({ error: "CodeChef user not found" });
//     }
// });

// // Handle 404 errors
// app.use((req, res) => {
//     res.status(404).json({ error: "Route not found" });
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`✅ Server running on http://localhost:${PORT}`);
// });
