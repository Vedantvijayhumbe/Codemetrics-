const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, 
    github: { type: String, required: false }, 
    codeforces: {
        rating: Number,
        maxRating: Number,
        solvedProblems: Number,
        contests: [{ contestId: Number, rank: Number, date: Date }]
    },
    codechef: {
        rating: Number,
        problemsSolved: Number,
        contests: [{ contestName: String, rank: Number, date: Date }]
    },
    githubActivity: [{
        repo: String,
        commits: Number,
        date: Date
    }],
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
