import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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


export default function JoinQuiz() {
  const { id } = useParams();
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [spotify, setSpotify] = useState('');
  const [loading, setLoading] = useState(true);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [userBName, setUserBName] = useState('');
  const [adminName, setAdminName] = useState('Admin');
  const API = import.meta.env.VITE_API_BASE;
  const navigate = useNavigate();

  // Check if User B has already submitted answers
  useEffect(() => {
    fetch(`${API}/vibe/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.userBAnswers && data.userBAnswers.length) {
          setAlreadySubmitted(true);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const name = localStorage.getItem(`vibeUserBName-${id}`);
    if (name) setUserBName(name);
  }, [id]);
  useEffect(() => {
    const storedName = localStorage.getItem('vibeAdminName');
    if (storedName) setAdminName(storedName);
  }, []);

  const handleSelect = (option) => {
    const updated = [...answers];
    updated[currentQuestion] = option;
    setAnswers(updated);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 300);
    }
  };

  const handleSubmit = async () => {
    const userBName = localStorage.getItem(`vibeUserBName-${id}`);
    let userBId = localStorage.getItem('vibe-userBId');
    if (!userBId) {
    userBId = crypto.randomUUID(); // or use uuid npm lib
    localStorage.setItem('vibe-userBId', userBId);
  }
    const res = await fetch(`${API}/vibe/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userBId,
        userBName,
        userBAnswers: answers,
        userBSpotify: spotify,
      }),
    });

    if (res.ok) {
      navigate(`/result/${id}`);
    } else {
      alert('Error submitting your answers, maybe already submitted.');
    }
  };

  if (loading) return <p className="text-center mt-20 text-lg">Loading...</p>;

  if (alreadySubmitted)
    return (
      <div className="max-w-xl mx-auto mt-16 p-8 bg-white shadow-xl rounded-xl text-center">
        <h2 className="text-xl mb-4 font-semibold text-purple-600">You have already submitted answers for this quiz.</h2>
        <button
          onClick={() => navigate(`/result/${id}`)}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          View Result
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-purple-600 mb-6">Join Vibe Check Quiz of {adminName}</h1>
        <h2 className="text-xl text-center text-gray-700 mb-4">
          Welcome, {userBName}!, check your vibes with {adminName}
        </h2>


        {currentQuestion < questions.length && (
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

        {currentQuestion === questions.length - 1 && answers[currentQuestion] && (
          <div className="mt-6">
            <label className="block text-gray-700 font-medium mb-2">
              Your Spotify songs playlist URL
            </label>
            <input
              value={spotify}
              onChange={(e) => setSpotify(e.target.value)}
              placeholder="Enter your Spotify playlist URL"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            <button
              onClick={handleSubmit}
              disabled={!spotify.trim()}
              className={`w-full py-3 mt-4 rounded-xl font-bold transition ${
                spotify.trim()
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit Answers
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
