const express = require("express");
const axios = require("axios");
const cors = require("cors");
const cheerio = require("cheerio"); // For scraping CodeChef

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;

// Fetch Codeforces Submissions
app.get("/codeforces/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const response = await axios.get(`https://codeforces.com/api/user.status?handle=${username}&from=1&count=10`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch Codeforces data" });
    }
});

// Fetch CodeChef User Data (via Web Scraping)
app.get("/codechef/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const url = `https://www.codechef.com/users/${username}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Extract relevant user details
        const rating = $(".rating-number").text().trim();
        const stars = $(".rating-star").text().trim();
        const globalRank = $(".rating-ranks .inline-list li").first().text().trim();
        const countryRank = $(".rating-ranks .inline-list li").last().text().trim();

        res.json({
            username,
            rating,
            stars,
            globalRank,
            countryRank
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch CodeChef data" });
    }
});

// Fetch GitHub Public Commits
app.get("/github/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const response = await axios.get(`https://api.github.com/users/${username}/events/public`);//my tokens are finished 
        const commits = response.data
            .filter(event => event.type === "PushEvent")
            .map(event => ({
                repo: event.repo.name,
                message: event.payload.commits.map(commit => commit.message),
                timestamp: event.created_at
            }));

        res.json(commits);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch GitHub data" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
