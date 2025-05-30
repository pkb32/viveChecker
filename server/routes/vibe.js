const express = require('express');
const router = express.Router();
const Session = require('../models/session');
const { getPlaylistTracks } = require('../services/spotifyService.js');

//started
router.post('/start', async (req, res) => {
  try {
    const { userAName } = req.body;

    const session = new Session({
      userAName,
      userAAnswers: [],
      userASpotify: '',
      userASongs: [],
      responses: [],
    });

    await session.save();
    res.json({ sessionId: session._id });
  } catch (error) {
    console.error('Error starting session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
//ended


// Create quiz (User A)
router.post('/', async (req, res) => {
  try {
    const { sessionId, userAName, userAAnswers, userASpotify } = req.body;
if (!sessionId) {
  return res.status(400).json({ message: "Session ID missing" });
}
    const userASongs = userASpotify
      ? (await getPlaylistTracks(userASpotify)).map(s => (s || '').trim().toLowerCase())
      : [];
//updated
   const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    session.userAName = userAName;
    session.userAAnswers = userAAnswers;
    session.userASpotify = userASpotify;
    session.userASongs = userASongs;

//end
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
    if (session.responses.find(r => r.userBId === req.body.userBId)) {
      return res.status(400).json({ message: "You have already submitted your answers." });
    }


    const userBSongs = userBSpotify
      ? (await getPlaylistTracks(userBSpotify)).map(s => (s || '').trim().toLowerCase())
      : [];

    const commonSongs = session.userASongs.filter(song =>
      userBSongs.includes(song)
    );

    const matchCount = session.userAAnswers.reduce((score, ans, i) => {
  const answerA = (ans || '').trim().toLowerCase();
  const answerB = (userBAnswers[i] || '').trim().toLowerCase();
  return score + (answerA === answerB ? 1 : 0);
}, 0);


    let baseScorePercent = 0;
if (Array.isArray(session.userAAnswers) && session.userAAnswers.length > 0) {
  baseScorePercent = (matchCount / session.userAAnswers.length) * 80;
} else {
  console.warn('Warning: No questions found for User A!');
}
    
    let spotifyScorePercent = 0;
    if (commonSongs.length >= 3) {
      spotifyScorePercent = 20;
    } else if (commonSongs.length >= 1) {
      spotifyScorePercent = 10;
    }
    const finalScorePercent = baseScorePercent + spotifyScorePercent;
const safeScore = isNaN(finalScorePercent) ? 0 : finalScorePercent;
    session.responses.push({
      userBId: userBId,
      name: userBName,
      answers: userBAnswers,
      spotifyUrl: userBSpotify,
      songs: userBSongs,
      score: safeScore,
      commonSongs: commonSongs,
    });

    await session.save();
    res.sendStatus(200);
  } catch (error) {
    console.error('Error saving response:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all results
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

// Get result for a specific user
router.get('/:id', async (req, res) => {
  try {
    const { user } = req.query;
    const session = await Session.findById(req.params.id);

    if (!session) {
      console.error('Session not found for ID:', req.params.id);
      return res.sendStatus(404);
    }

    if (!user) {
      console.error('User ID missing in query param');
      return res.status(400).json({ message: "User ID is required in query (?user=...)" });
    }

    const result = session.responses.find(r => r.userBId === user);

    if (!result) {
      console.log('No result found for userBId:', user);
      return res.json({ message: "Waiting for this user to submit answers." });
    }

    const commonSongs = Array.isArray(result.commonSongs) ? result.commonSongs : [];
    const score = typeof result.score === 'number' ? result.score : 0;

    let spotifyScore = 0;
    if (commonSongs.length >= 3) {
      spotifyScore = 20;
    } else if (commonSongs.length >= 1) {
      spotifyScore = 10;
    }

    const matchScorePercent = score - spotifyScore;

    res.json({
      matchScore: Math.round(matchScorePercent),
      spotifyScorePercent: spotifyScore.toFixed(2),
      finalScorePercent: score.toFixed(2),
      commonSongs,
      user: result.name,
      adminName: session.userAName,
    });
  } catch (error) {
    console.error('Error fetching session results:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
