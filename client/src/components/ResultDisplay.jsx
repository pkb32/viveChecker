import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";

const getVibeLevel = (score) => {
  if (score >= 90)
    return {
      level: "Soulmates",
      emoji: "💫",
      color: "from-pink-500 to-purple-600",
    };
  if (score >= 80)
    return {
      level: "Perfect Match",
      emoji: "🔥",
      color: "from-orange-500 to-red-500",
    };
  if (score >= 70)
    return {
      level: "Great Vibes",
      emoji: "✨",
      color: "from-blue-500 to-purple-500",
    };
  if (score >= 60)
    return {
      level: "Good Match",
      emoji: "🌟",
      color: "from-green-500 to-blue-500",
    };
  if (score >= 50)
    return {
      level: "Some Sparks",
      emoji: "⚡",
      color: "from-yellow-500 to-orange-500",
    };
  return {
    level: "Different Vibes",
    emoji: "🌈",
    color: "from-gray-500 to-blue-500",
  };
};

export default function ResultDisplay() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const resultRef = useRef(null);
  const API = import.meta.env.VITE_API_BASE;
  const modalRef = useRef(null);

useEffect(() => {
  const key = `vibe-userBId-${id}`;
  let userBId = localStorage.getItem(key);

  if (!userBId) {
    userBId = crypto.randomUUID();
    localStorage.setItem(key, userBId);
  }

  // ✅ NOW: fetch result using the userBId
  fetch(`${API}/vibe/${id}?user=${encodeURIComponent(userBId)}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched result:", data);
      setData(data);
    })
    .catch((err) => {
      console.error("Error fetching result:", err);
    });
}, [id]);



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/join/${id}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  const handleScreenshot = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current);
    const link = document.createElement("a");
    link.download = "vibe-result.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleNativeShare = () => {
    const shareData = {
      title: "Vibe Check Result",
      text: "Check out our vibe match!",
      url: `${window.location.origin}/join/${id}`,
    };
    if (navigator.share) {
      navigator
        .share(shareData)
        .catch((err) => console.error("Share failed:", err));
    } else {
      alert("Share not supported on this device.");
    }
  };

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

  const score = parseFloat(data.finalScorePercent || 0);
  const { level, emoji, color } = getVibeLevel(score);

  return (
    <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 w-full min-h-screen flex items-center justify-center px-4 py-8 overflow-x-hidden">
      <div
        ref={resultRef}
        className={`max-w-xl w-full h-full max-h-[90vh] overflow-y-auto no-scrollbar p-8 text-center rounded-2xl shadow-lg bg-gradient-to-br ${color} text-white`}
      >
        <div className="text-3xl sm:text-4xl mb-4">🏆</div>
        <h1 className="text-xl sm:text-2xl font-semibold">
          Vibe Check Complete!
        </h1>
        <p className="text-base sm:text-lg mt-2 text-white">
          You're comparing vibes with <strong>{data.adminName}</strong>
        </p>

        <div className="text-5xl sm:text-6xl font-bold mt-4">
          {score.toFixed(0)}%
        </div>
        <p className="text-lg sm:text-xl mt-2">
          {emoji} {level}
        </p>

        <div className="bg-white text-gray-800 rounded-xl p-4 mt-6">
          <p className="text-sm sm:text-base mb-1 text-gray-500">
            🎵 Music compatibility:{" "}
            {parseFloat(
              data.spotifyScorePercent == 10
                ? 50
                : data.spotifyScorePercent == 20
                ? 100
                : 0
            ).toFixed(0)}
            %
          </p>
          <p className="text-xs text-gray-500">
            Music taste accounts for 20% of your vibe score
          </p>
        </div>

        {Array.isArray(data?.commonSongs) && data.commonSongs.length > 0 && (
  <div className="mt-6 bg-white text-gray-800 rounded-lg p-4 text-left">
    <h3 className="font-semibold mb-2">Common Songs:</h3>
    <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
      {data.commonSongs.map((song, i) => (
        <li key={i}>{song}</li>
      ))}
    </ul>
  </div>
)}

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg w-full sm:w-auto"
          >
            🔗 Share
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-white text-indigo-600 border border-indigo-400 hover:bg-indigo-100 font-semibold px-4 py-2 rounded-lg w-full sm:w-auto"
          >
            🔁 Try Again
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div
            ref={modalRef}
            className="backdrop-blur-xl text-black p-4 sm:p-6 rounded-lg w-full max-w-sm"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center py-4 px-4 sm:px-6 rounded">
              <h2 className="text-lg sm:text-xl font-bold tracking-wide">
                🔗 Share Your Vibe Result
              </h2>
              <p className="text-sm mt-1 opacity-90">Make your vibe known ✨</p>
            </div>
            <button
              onClick={handleCopyLink}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 my-4 rounded"
            >
              Copy Link
            </button>
            <button
              onClick={handleScreenshot}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mb-2"
            >
              Download Screenshot
            </button>
            <button
              onClick={handleNativeShare}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded mb-2"
            >
              Share via App
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-2 border border-gray-300 hover:bg-gray-100 rounded px-4 py-2 text-white hover:text-black"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
