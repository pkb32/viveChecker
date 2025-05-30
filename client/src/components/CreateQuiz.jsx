import { useState, useEffect } from 'react';

const questions = [
  {
    question: 'Perfect weekend vibes?',
    options: [
      'Mountain hiking adventure',
      'Beach relaxation day',
      'City exploration',
      'Cozy home Netflix marathon',
    ],
  },
  {
   question: "Your go-to drink?",
    options: [
      "Coffee ",
      "Tea ",
      "Energy drinks ",
      "Water (staying hydrated) "
    ],
  },
  {
   question: "At a party, you're usually...",
    options: [
      "The life of the party ",
      "Having deep conversations in the corner",
      "On the dance floor ",
      "Planning the perfect exit time"
    ],
  },
  {
   question: "When you're stressed, you...",
    options: [
      "Exercise it out ",
      "Listen to music ",
      "Talk to friends ",
      "Take a long bath "
    ], 
  },
  {
    question: "Your phone's wallpaper is probably...",
    options: [
      "A stunning landscape",
      "Friends/family photo",
      "Cute animals",
      "Minimalist abstract design"
    ],
  },
  {
    question: "Favorite time of day?",
    options: [
      "Early morning sunrise ",
      "Golden hour afternoon ",
      "Sunset vibes ",
      "Late night owl hours "
    ],
  },
  {
    question: "Perfect date night?",
    options: [
      "Cooking together at home",
      "Concert or live show",
      "Candlelit dinner",
      "Outdoor adventure"
    ],
  },
  {
    question: "Your superpower would be...",
    options: [
      "Reading minds ",
      "Time travel ",
      "Flying ",
      "Invisibility "
    ],
  },
  {
     question: "Favorite season?",
    options: [
      "Spring (new beginnings) ",
      "Summer (beach vibes) ",
      "Fall (cozy sweaters) ",
      "Winter (hot cocoa season) "
    ],
  },
  {
    question: "Your favourite Subject in school is/was...",
    options: [
      "Maths",
      "Sci",
      "SST",
      "Language"
    ],
  }
];

export default function CreateQuiz() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [spotify, setSpotify] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [adminName, setAdminName] = useState('Admin');
  const [allResults, setAllResults] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const API = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    const storedName = localStorage.getItem('vibeAdminName');
    if (storedName) setAdminName(storedName);
  }, []);

  useEffect(() => {
    // Automatically create a new session on component mount
    const createSession = async () => {
      const res = await fetch(`${API}/vibe/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAName: adminName }),
      });
      const data = await res.json();
      setSessionId(data.sessionId);
    };

    if (!sessionId) createSession();
  }, [adminName]);

  useEffect(() => {
    if (!sessionId) return;
    const interval = setInterval(() => {
      fetch(`${API}/vibe/results/${sessionId}`)
        .then(res => res.json())
        .then(data => setAllResults(data.results || []));
    }, 4000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const handleSelect = (option) => {
    const updated = [...answers];
    updated[currentQuestion] = option;
    setAnswers(updated);
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
    }
  };

  const handleSubmit = async () => {
    await fetch(`${API}/vibe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userAName: adminName,
        userAAnswers: answers,
        userASpotify: spotify || '',
        sessionId,
      }),
    });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-purple-600 mb-6">
          Create Vibe Check Quiz
        </h1>
        <h2 className="text-xl text-center text-gray-700 mb-4">
          Welcome, {adminName}!
        </h2>

        {sessionId && currentQuestion < questions.length && !submitted && (
          <>
            <div className="text-right text-sm text-gray-500 mb-2">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {questions[currentQuestion].question}
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {questions[currentQuestion].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(opt)}
                    className={`w-full px-4 py-3 rounded-lg border text-left font-medium transition ${
                      answers[currentQuestion] === opt
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-purple-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {sessionId && currentQuestion === questions.length - 1 && answers[currentQuestion] && !submitted && (
          <div className="mt-6">
            <label className="block text-gray-700 font-medium mb-2">
              Your Spotify playlist URL (optional)
            </label>
            <input
              value={spotify}
              onChange={(e) => setSpotify(e.target.value)}
              placeholder="Enter your Spotify playlist URL"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={handleSubmit}
              className="w-full py-3 mt-4 rounded-xl font-bold bg-purple-600 text-white hover:bg-purple-700 transition"
            >
              Create Quiz & Get Link
            </button>
          </div>
        )}

        {sessionId &&submitted && (
          <div className="text-center mt-6">
            <h2 className="text-xl font-semibold mb-2">Share this link with your friend:</h2>
            <a
              href={`${window.location.origin}/join/${sessionId}`}
              className="text-purple-700 underline break-words"
            >
              {window.location.origin}/join/{sessionId}
            </a>
          </div>
        )}

        {sessionId && allResults.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Vibe Matches</h3>
            <table className="w-full text-left border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-sm text-gray-600">
                <tr>
                  <th className="px-4 py-2">Friend</th>
                  <th className="px-4 py-2">Vibe Score</th>
                  <th className="px-4 py-2">Common Songs</th>
                </tr>
              </thead>
              <tbody>
                {allResults.map((res, idx) => (
                  <tr key={idx} className="border-t text-sm">
                    <td className="px-4 py-2">{res.name}</td>
                    <td className="px-4 py-2">{res.score}%</td>
                    <td className="px-4 py-2">
                      {res.commonSongs.slice(0, 3).join(', ') || 'None'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
