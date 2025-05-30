const express = require('express');
const router = express.Router();
const Session = require('../models/session');
const { getPlaylistTracks } = require('../services/spotifyService.js');

// Create quiz (User A)
router.post('/', async (req, res) => {
  try {
    const { userAName, userAAnswers, userASpotify } = req.body;

    const userASongs = userASpotify
      ? (await getPlaylistTracks(userASpotify)).map(s => s.toLowerCase().trim())
      : [];

    const session = new Session({
      userAName,
      userAAnswers,
      userASpotify,
      userASongs,
      responses: [],
    });

    await session.save();
    res.json({ sessionId: session._id });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit response (User B)
router.put('/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.sendStatus(404);

    const { userBId,userBName, userBAnswers, userBSpotify } = req.body;

    // Check if this user already submitted, and allow different user but same nickname
    if (session.responses.find(r => r.name === userBName)) {
      return res.status(400).json({ message: "You have already submitted your answers." });
    }

    const userBSongs = userBSpotify
      ? (await getPlaylistTracks(userBSpotify)).map(s => s.toLowerCase().trim())
      : [];

    const commonSongs = session.userASongs.filter(song =>
      userBSongs.includes(song)
    );

    const matchCount = session.userAAnswers.reduce((score, ans, i) => (
      score + (ans === userBAnswers[i] ? 1 : 0)
    ), 0);

    const baseScorePercent = (matchCount / session.userAAnswers.length) * 80;
    
    let spotifyScorePercent = 0;
    if (commonSongs.length >= 3) {
      spotifyScorePercent = 20;
    } else if (commonSongs.length >= 1) {
      spotifyScorePercent = 10;
    }
    const finalScorePercent = baseScorePercent + spotifyScorePercent;

    session.responses.push({
      userId: userBId,
      name: userBName,
      answers: userBAnswers,
      spotifyUrl: userBSpotify,
      songs: userBSongs,
      score: finalScorePercent,
      commonSongs
    });

    await session.save();
    res.sendStatus(200);
  } catch (error) {
    console.error('Error saving response:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get result for a specific user
router.get('/:id', async (req, res) => {
  try {
    const { user } = req.query;
    const session = await Session.findById(req.params.id);
    if (!session) return res.sendStatus(404);

    if (!user) {
      return res.status(400).json({ message: "User name is required in query (?user=...)" });
    }

    const result = session.responses.find(r => r.name === user);
    if (!result) {
      return res.json({ message: "Waiting for this user to submit answers." });
    }


    let spotifyScore = 0;
    if (result.commonSongs.length >= 3) {
      spotifyScore = 20;
    } else if (result.commonSongs.length >= 1) {
      spotifyScore = 10;
    }

    const matchScorePercent = result.score - spotifyScore;

    res.json({
      matchScore: `${Math.round(matchScorePercent)}%`,
      spotifyScorePercent: (result.score - matchScorePercent).toFixed(2),
      finalScorePercent: result.score.toFixed(2),
      commonSongs: result.commonSongs,
      user: result.name,
      adminName: session.userAName,
    });
  } catch (error) {
    console.error('Error fetching session results:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/results/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.sendStatus(404);

    const results = session.responses.map(r => ({
      name: r.name,
      score: r.score.toFixed(2),
      commonSongs: r.commonSongs,
    }));

    res.json({ adminName: session.userAName, results });
  } catch (error) {
    console.error('Error fetching all results:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
