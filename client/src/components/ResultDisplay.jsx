import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
const getVibeLevel = (score) => {
  if (score >= 90) return { level: "Soulmates", emoji: "💫", color: "from-pink-500 to-purple-600" };
  if (score >= 80) return { level: "Perfect Match", emoji: "🔥", color: "from-orange-500 to-red-500" };
  if (score >= 70) return { level: "Great Vibes", emoji: "✨", color: "from-blue-500 to-purple-500" };
  if (score >= 60) return { level: "Good Match", emoji: "🌟", color: "from-green-500 to-blue-500" };
  if (score >= 50) return { level: "Some Sparks", emoji: "⚡", color: "from-yellow-500 to-orange-500" };
  return { level: "Different Vibes", emoji: "🌈", color: "from-gray-500 to-blue-500" };
};

export default function ResultDisplay() {
  const { id } = useParams();
  const [data, setData] = useState(null);


useEffect(() => {
  const userBName = localStorage.getItem(`vibeUserBName-${id}`);
  fetch(`${API}/vibe/${id}?user=${encodeURIComponent(userBName)}`)
    .then(res => res.json())
    .then(data => {
      console.log('API response:', data);
      setData(data);
    });
}, [id]);

  if (!data) return <p className="text-center mt-20 text-lg">Loading...</p>;

  if (data.message === "Waiting for friend to submit answers.") {
    return (
      <div className="max-w-xl mx-auto mt-16 p-8 bg-white shadow-xl rounded-xl text-center">
        <h2 className="text-xl font-semibold text-purple-600 mb-4">
          Waiting for your friend to submit their answers...
        </h2>
      </div>
    );
  }

  const score = parseFloat(data.finalScorePercent);
  const { level, emoji, color } = getVibeLevel(score);

  return (
    <div className={`max-w-xl mx-auto mt-16 p-8 text-center rounded-2xl shadow-lg bg-gradient-to-br ${color} text-white`}>
      <div className="text-4xl mb-4">🏆</div>
      <h1 className="text-2xl font-semibold">Vibe Check Complete!</h1>
      <p className="text-lg mt-2 text-white">You're comparing vibes with <strong>{data.adminName}</strong></p>

      <div className="text-6xl font-bold mt-4">{score.toFixed(0)}%</div>
      <p className="text-xl mt-2">{emoji} {level}</p>

      <div className="bg-white text-gray-800 rounded-xl p-4 mt-6">
        <p className="text-sm mb-1 text-gray-500">🎵 Music compatibility: {parseFloat(data.spotifyScorePercent==10?50:100).toFixed(0)}%</p>
        <p className="text-xs text-gray-500">Music taste accounts for 20% of your vibe score</p>
      </div>

      {data.commonSongs.length > 0 && (
        <div className="mt-6 bg-white text-gray-800 rounded-lg p-4 text-left">
          <h3 className="font-semibold mb-2">Common Songs:</h3>
          <ul className="list-disc list-inside space-y-1">
            {data.commonSongs.map((song, i) => (
              <li key={i}>{song}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-center gap-4 mt-8">
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg">
          🔗 Share
        </button>
        <button onClick={() => window.location.href = "/"} className="bg-white text-indigo-600 border border-indigo-400 hover:bg-indigo-100 font-semibold px-4 py-2 rounded-lg">
          🔁 Try Again
        </button>
      </div>
    </div>
  );
}
