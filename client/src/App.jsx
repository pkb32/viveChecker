import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateQuiz from './components/CreateQuiz';
import JoinQuiz from './components/JoinQuiz';
import ResultDisplay from './components/ResultDisplay';
import EnterName from './components/EnterName';
import EnterJoinName from './components/EnterJoinName';

export default function App() {
  return (
    <Router>
     <Routes>
      <Route path="/" element={<EnterName />} />
      <Route path="/quiz" element={<CreateQuiz />} />
      <Route path="/join/:id" element={<EnterJoinName />} />
      <Route path="/vibe/:id" element={<JoinQuiz />} />
      <Route path="/result/:id" element={<ResultDisplay />} />
    </Routes>
    </Router>
  );
}


