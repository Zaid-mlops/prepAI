import React, { useState } from 'react';
import { generateQuizQuestions } from '../services/geminiService';
import { QuizCategory } from '../types';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export const Quiz: React.FC = () => {
  const [topic, setTopic] = useState<string>(QuizCategory.DSA);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const startQuiz = async () => {
    setIsLoading(true);
    setQuizFinished(false);
    setScore(0);
    setCurrentIndex(0);
    setQuestions([]);
    
    try {
      const qs = await generateQuizQuestions(topic);
      setQuestions(qs);
    } catch (e) {
      alert("Failed to generate quiz. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    setSelectedOption(index);
  };

  const nextQuestion = () => {
    if (selectedOption === null) return;
    
    if (selectedOption === questions[currentIndex].correctIndex) {
      setScore(s => s + 1);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Generating Questions for {topic}...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0 && !quizFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <h2 className="text-3xl font-bold text-white mb-6">Test Your Knowledge</h2>
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 w-full max-w-md">
          <label className="block text-slate-300 mb-2 font-semibold">Select Topic</label>
          <select 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg p-3 mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {Object.values(QuizCategory).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button 
            onClick={startQuiz}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 text-center max-w-lg w-full">
          <h2 className="text-3xl font-bold text-white mb-4">Quiz Completed!</h2>
          <div className="text-6xl font-black text-blue-500 mb-4">{score} / {questions.length}</div>
          <p className="text-slate-400 mb-8">
            {score === questions.length ? "Perfect Score! You are ready!" : "Keep practicing to improve."}
          </p>
          <button 
            onClick={() => { setQuestions([]); setQuizFinished(false); }}
            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg"
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <span className="text-slate-400">Question {currentIndex + 1} of {questions.length}</span>
        <span className="bg-slate-700 text-xs px-2 py-1 rounded text-slate-300">{topic}</span>
      </div>
      
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex-1 flex flex-col">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-6">{currentQ.question}</h3>
        
        <div className="space-y-3 flex-1">
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={`w-full text-left p-4 rounded-lg border transition ${
                selectedOption === idx 
                  ? 'bg-blue-600 border-blue-500 text-white' 
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <span className="font-bold mr-3">{String.fromCharCode(65 + idx)}.</span> {opt}
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={nextQuestion}
            disabled={selectedOption === null}
            className={`px-6 py-3 rounded-lg font-bold text-white transition ${
              selectedOption === null 
                ? 'bg-slate-700 cursor-not-allowed text-slate-500' 
                : 'bg-green-600 hover:bg-green-500'
            }`}
          >
            {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
};