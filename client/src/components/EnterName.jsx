import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EnterName() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleStart = () => {
    if (name.trim()) {
      localStorage.setItem('vibeAdminName', name.trim());
      navigate('/quiz');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">Start Your Vibe Check</h1>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          onClick={handleStart}
          className={`w-full py-3 rounded-xl font-bold transition ${
            name.trim()
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!name.trim()}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}
