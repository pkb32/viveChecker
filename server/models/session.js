const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  name: String,
  answers: [String],
  spotifyUrl: String,
  songs: [String],
  score: Number,
  commonSongs: [String],
  createdAt: { type: Date, default: Date.now },
});

const sessionSchema = new mongoose.Schema({
  userAName: String,
  userAAnswers: [String],
  userASpotify: String,
  userASongs: [String],
  responses: [responseSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);
