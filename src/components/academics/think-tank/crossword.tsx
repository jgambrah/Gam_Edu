
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Check, RotateCcw, Lightbulb, Sparkles, RefreshCw } from 'lucide-react';
import { generateCrosswordAction } from '@/ai/flows/think-tank';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CrosswordPuzzle = () => {
  const [currentPuzzle, setCurrentPuzzle] = useState<any>(null);
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [cellStatus, setCellStatus] = useState<string[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const [showHints, setShowHints] = useState<Record<number, boolean>>({});
  const [completed, setCompleted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [studentInterest, setStudentInterest] = useState('');

  const loadPuzzle = (puzzleData: any) => {
    setCurrentPuzzle(puzzleData);
    const rows = puzzleData.grid.length;
    const cols = puzzleData.grid[0].length;
    setUserGrid(Array(rows).fill(null).map(() => Array(cols).fill('')));
    setCellStatus(Array(rows).fill(null).map(() => Array(cols).fill('')));
    setShowHints({});
    setCompleted(false);
    setSelectedCell(null);
  };

  const generatePuzzleWithAI = useCallback(async (topic?: string) => {
    const interest = topic || studentInterest || "General Knowledge";
    setIsGenerating(true);
    try {
      const puzzleData = await generateCrosswordAction(interest);
      if (puzzleData) {
        loadPuzzle({ id: Date.now(), ...puzzleData });
      } else {
        throw new Error('AI did not return a valid puzzle.');
      }
    } catch (error) {
      console.error('Error generating puzzle:', error);
      alert('Failed to generate puzzle. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [studentInterest]);

  // Generate a default puzzle on initial load
  useEffect(() => {
    generatePuzzleWithAI("Science");
  }, [generatePuzzleWithAI]);


  // Check if puzzle is complete
  useEffect(() => {
    if (!currentPuzzle || !userGrid.length) return;
    
    const isComplete = currentPuzzle.grid.every((row: string[], i: number) =>
      row.every((cell, j) => cell === '' || (userGrid[i]?.[j]?.toUpperCase() === cell))
    );
    setCompleted(isComplete);
  }, [userGrid, currentPuzzle]);

  const isPlayableCell = (row: number, col: number) => {
    if (!currentPuzzle || !currentPuzzle.clues) return false;
    const isAcross = currentPuzzle.clues.across.some((clue: any) => 
        row === clue.row && col >= clue.col && col < clue.col + clue.answer.length
    );
    const isDown = currentPuzzle.clues.down.some((clue: any) => 
        col === clue.col && row >= clue.row && row < clue.row + clue.answer.length
    );
    return isAcross || isDown;
  };

  const handleCellClick = (row: number, col: number) => {
    if (isPlayableCell(row, col)) {
        if (selectedCell?.row === row && selectedCell?.col === col) {
            setDirection(direction === 'across' ? 'down' : 'across');
        } else {
            setSelectedCell({ row, col });
        }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
    e.preventDefault();
    if (!isPlayableCell(row, col)) return;

    const newGrid = userGrid.map(r => [...r]);
    const newStatusGrid = cellStatus.map(r => [...r]);

    if (e.key === 'Backspace') {
      newGrid[row][col] = '';
      newStatusGrid[row][col] = '';
      setUserGrid(newGrid);
      setCellStatus(newStatusGrid);

      // Move to previous cell
      if (direction === 'across' && col > 0) {
        let prevCol = col - 1;
        while (prevCol >= 0 && !isPlayableCell(row, prevCol)) prevCol--;
        if (prevCol >= 0) setSelectedCell({ row, col: prevCol });
      } else if (direction === 'down' && row > 0) {
        let prevRow = row - 1;
        while (prevRow >= 0 && !isPlayableCell(prevRow, col)) prevRow--;
        if (prevRow >= 0) setSelectedCell({ row: prevRow, col });
      }
      return;
    }

    if (/^[a-zA-Z]$/.test(e.key)) {
      newGrid[row][col] = e.key.toUpperCase();
      newStatusGrid[row][col] = ''; // Reset status on new input
      setUserGrid(newGrid);
      setCellStatus(newStatusGrid);

      // Move to next cell
      if (direction === 'across' && col < cols - 1) {
        let nextCol = col + 1;
        while (nextCol < cols && !isPlayableCell(row, nextCol)) nextCol++;
        if (nextCol < cols) setSelectedCell({ row, col: nextCol });
      } else if (direction === 'down' && row < rows - 1) {
        let nextRow = row + 1;
        while (nextRow < rows && !isPlayableCell(nextRow, col)) nextRow++;
        if (nextRow < rows) setSelectedCell({ row: nextRow, col });
      }
    }
  };
  
  const handleReset = () => {
    if (!currentPuzzle) return;
    const rows = currentPuzzle.grid.length;
    const cols = currentPuzzle.grid[0].length;
    setUserGrid(Array(rows).fill(null).map(() => Array(cols).fill('')));
    setCellStatus(Array(rows).fill(null).map(() => Array(cols).fill('')));
    setShowHints({});
    setCompleted(false);
  };
  
  const handleCheckAnswers = () => {
    const newStatusGrid = userGrid.map((row, i) =>
      row.map((cell, j) => {
        if (!isPlayableCell(i, j)) return '';
        if (!cell) return ''; // Unanswered
        return cell.toUpperCase() === currentPuzzle.grid[i][j] ? 'correct' : 'incorrect';
      })
    );
    setCellStatus(newStatusGrid);
  };

  const toggleHint = (clueNumber: number) => {
    setShowHints(prev => ({ ...prev, [clueNumber]: !prev[clueNumber] }));
  };

  const getClueNumber = (row: number, col: number) => {
    const acrossClue = currentPuzzle.clues.across.find((clue: any) => clue.row === row && clue.col === col);
    if (acrossClue) return acrossClue.number;

    const downClue = currentPuzzle.clues.down.find((clue: any) => clue.row === row && clue.col === col);
    if (downClue) return downClue.number;
    
    return null;
  };
  
  if (!currentPuzzle || isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] bg-slate-50 rounded-lg">
          <Loader2 size={48} className="animate-spin text-indigo-500 mb-4" />
          <p className="text-indigo-700 font-semibold">Generating your puzzle...</p>
      </div>
    );
  }

  const rows = currentPuzzle.grid.length;
  const cols = currentPuzzle.grid[0].length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2 text-indigo-900">
            AI-Powered Think Tank
          </h1>
          <p className="text-center text-gray-600 mb-6">Generate custom puzzles based on your interests!</p>

          <div className="mb-6 p-4 bg-indigo-50 border-2 border-indigo-300 rounded-lg">
            <h3 className="font-bold text-indigo-900 mb-2">What would you like to learn about?</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={studentInterest}
                onChange={(e) => setStudentInterest(e.target.value)}
                placeholder="e.g., Space, Animals, Sports, History..."
                className="flex-1 p-2 border-2 border-indigo-300 rounded"
                onKeyPress={(e) => e.key === 'Enter' && generatePuzzleWithAI()}
              />
              <button
                onClick={() => generatePuzzleWithAI()}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-indigo-600 mt-2">
              💡 Try: "Ancient Egypt", "Soccer", "Dinosaurs", "Planets", "Coding"
            </p>
          </div>

          <p className="text-center text-sm text-indigo-600 mb-4">
            Current Puzzle: {currentPuzzle.title}
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <div className="inline-block bg-gray-100 p-2 sm:p-4 rounded-lg shadow-inner overflow-x-auto">
                {currentPuzzle.grid.map((row: string[], i: number) => (
                  <div key={i} className="flex">
                    {row.map((_, j: number) => {
                      const clueNum = getClueNumber(i, j);
                      const isSelected = selectedCell?.row === i && selectedCell?.col === j;
                      const status = cellStatus[i]?.[j];
                      const isPlayable = isPlayableCell(i, j);

                      let cellClass = 'bg-white border-gray-300 cursor-pointer hover:bg-blue-50';
                      if (!isPlayable) cellClass = 'bg-gray-800 border-gray-900';
                      else if (isSelected) cellClass = 'bg-yellow-200 border-yellow-400 border-2';
                      else if (status === 'correct') cellClass = 'bg-green-100 border-green-300';
                      else if (status === 'incorrect') cellClass = 'bg-red-100 border-red-300';

                      return (
                        <div
                          key={j}
                          className={`w-8 h-8 sm:w-10 sm:h-10 border relative ${cellClass}`}
                          onClick={() => handleCellClick(i, j)}
                        >
                          {clueNum && (
                            <span className="absolute top-0 left-0.5 text-xs font-bold text-indigo-600 select-none">
                              {clueNum}
                            </span>
                          )}
                          <input
                            type="text"
                            maxLength={1}
                            onKeyDown={(e) => handleKeyDown(e, i, j)}
                            value={userGrid[i]?.[j] || ''}
                            onChange={() => {}} // Controlled by onKeyDown
                            className="w-full h-full text-center text-base sm:text-lg font-semibold uppercase bg-transparent outline-none"
                            ref={(input) => isSelected && input?.focus()}
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3 mt-6 justify-center">
                <button
                  onClick={handleCheckAnswers}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base"
                >
                  <Check size={18} />
                  Check
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm sm:text-base"
                >
                  <RotateCcw size={18} />
                  Reset
                </button>
              </div>

              {completed && (
                <div className="mt-4 p-4 bg-green-100 border-2 border-green-500 rounded-lg">
                  <p className="text-green-800 font-bold text-center text-sm sm:text-base">
                    🎉 Congratulations! You've completed the puzzle!
                  </p>
                   <button
                    onClick={() => generatePuzzleWithAI()}
                    className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Generate Another Puzzle
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {currentPuzzle.clues.across.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-indigo-900 mb-3">Across</h3>
                  <div className="space-y-2">
                    {currentPuzzle.clues.across.map((clue: any) => (
                      <div key={clue.number} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-start justify-between">
                          <p className="text-gray-800 text-sm sm:text-base">
                            <span className="font-bold text-indigo-600">{clue.number}.</span> {clue.clue}
                          </p>
                          <button
                            onClick={() => toggleHint(clue.number)}
                            className="ml-2 p-1 hover:bg-yellow-200 rounded flex-shrink-0"
                            title="Show hint"
                          >
                            <Lightbulb size={16} className={showHints[clue.number] ? 'text-yellow-600' : 'text-gray-400'} />
                          </button>
                        </div>
                        {showHints[clue.number] && (
                          <p className="text-xs sm:text-sm text-indigo-600 mt-1">
                            First letter: {clue.answer[0]} | Length: {clue.answer.length} letters
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentPuzzle.clues.down.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-indigo-900 mb-3">Down</h3>
                  <div className="space-y-2">
                    {currentPuzzle.clues.down.map((clue: any) => (
                      <div key={clue.number} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-start justify-between">
                          <p className="text-gray-800 text-sm sm:text-base">
                            <span className="font-bold text-indigo-600">{clue.number}.</span> {clue.clue}
                          </p>
                          <button
                            onClick={() => toggleHint(clue.number)}
                            className="ml-2 p-1 hover:bg-yellow-200 rounded flex-shrink-0"
                            title="Show hint"
                          >
                            <Lightbulb size={16} className={showHints[clue.number] ? 'text-yellow-600' : 'text-gray-400'} />
                          </button>
                        </div>
                        {showHints[clue.number] && (
                          <p className="text-xs sm:text-sm text-indigo-600 mt-1">
                            First letter: {clue.answer[0]} | Length: {clue.answer.length} letters
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrosswordPuzzle;
