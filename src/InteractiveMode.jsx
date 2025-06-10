// Import React and hooks
import React, { useState, useEffect } from 'react';
import './App.css'; // Import main styling
import orbitalImage from './images/e-config.jpg'; // Orbital energy level image

// List of subshells in the order they are filled (simplified to 5d)
const subshells = [
  "1s", "2s", "2p", "3s", "3p",
  "4s", "3d", "4p", "5s", "4d"
];

// Maximum number of electrons for each subshell type
const maxElectrons = {
  s: 2,
  p: 6,
  d: 10
};

// Helper function to get subshell type (s, p, or d) from a string like "2p"
function getSubshellType(sub) {
  return sub.match(/[spd]/)[0];
}

// Generates the correct orbital diagram for a given atomic number
function generateCorrectDiagram(z) {
  let electrons = z;
  const output = [];

  for (let i = 0; i < subshells.length && electrons > 0; i++) {
    const sub = subshells[i];
    const type = getSubshellType(sub);
    const max = maxElectrons[type];
    const orbitals = max / 2;

    const row = Array(orbitals).fill(""); // Empty orbitals
    let placed = 0;

    while (electrons > 0 && placed < max) {
      const index = placed < orbitals ? placed : placed % orbitals;
      row[index] += placed < orbitals ? "↑" : "↓"; // Fill up then down
      placed++;
      electrons--;
    }

    output.push({ sub, arrows: row }); // Save one row for this subshell
  }

  return output;
}

// Main component: Orbital Game
export default function InteractiveMode({ goBack }) {
  // State variables for tracking diagram and options
  const [atomicNumber, setAtomicNumber] = useState(1);
  const [userDiagram, setUserDiagram] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [solution, setSolution] = useState([]);
  const [showImage, setShowImage] = useState(false);
  const [showExceptions, setShowExceptions] = useState(false);
  const [showRules, setShowRules] = useState(false);

  // Initialize the game with a random atomic number between 1–30
  useEffect(() => {
    const rand = Math.floor(Math.random() * 118) + 1;
    setAtomicNumber(rand);
    const correct = generateCorrectDiagram(rand);
    setSolution(correct);
    setUserDiagram([{ sub: correct[0].sub, arrows: Array(correct[0].arrows.length).fill("") }]);
  }, []);

  // Function to generate a new random atomic number and reset everything
  const rerollAtomicNumber = () => {
    const rand = Math.floor(Math.random() * 30) + 1;
    setAtomicNumber(rand);
    const correct = generateCorrectDiagram(rand);
    setSolution(correct);
    setShowSolution(false);
    setFeedback('');
    setUserDiagram([{ sub: correct[0].sub, arrows: Array(correct[0].arrows.length).fill("") }]);
  };

  // Handles clicks on an orbital: ↑ → ↑↓ → empty (cycling)
  const toggleArrow = (orbitalIdx, boxIdx) => {
    setUserDiagram(prev => {
      const newDiagram = JSON.parse(JSON.stringify(prev)); // Deep copy
      const state = newDiagram[orbitalIdx].arrows[boxIdx];
      if (state === "") newDiagram[orbitalIdx].arrows[boxIdx] = "↑";
      else if (state === "↑") newDiagram[orbitalIdx].arrows[boxIdx] = "↑↓";
      else newDiagram[orbitalIdx].arrows[boxIdx] = "";
      return newDiagram;
    });
  };

  // Adds the next orbital row if available
  const addOrbital = () => {
    if (userDiagram.length < solution.length) {
      const next = solution[userDiagram.length];
      setUserDiagram(prev => [...prev, { sub: next.sub, arrows: Array(next.arrows.length).fill("") }]);
    }
  };

  // Removes the last orbital row
  const removeOrbital = () => {
    if (userDiagram.length > 1) {
      setUserDiagram(prev => prev.slice(0, -1));
    }
  };

  // Compares user input with the correct answer and gives feedback
  const checkDiagram = () => {
    const correct = JSON.stringify(solution.map(row => row.arrows));
    const user = JSON.stringify(userDiagram.map(row => row.arrows));
    setFeedback(user === correct ? "✅ Correct!" : "❌ Incorrect. Try again or reveal the solution.");
  };

  return (
    <div className="container">
      <h1 className="title">Orbital Game</h1>

      {/* Main menu button (top-right corner) */}
      <div className="top-right-menu">
        <button className="help-button mainmenu-btn" onClick={goBack}>Main Menu</button>
      </div>

      {/* Atomic number and control buttons */}
      <div className="help-box">
        <div className="atomic-header">
          <div className="atomic-labels">
            <p><strong>Given the following Atomic Number, create the orbital diagram</strong></p>
            <div className="atomic-value">
                <span><strong>Atomic Number:</strong> {atomicNumber}</span>
            </div>
            </div>
            <button className="help-button reroll-btn" onClick={rerollAtomicNumber}>🔁 Re-roll</button>
        </div>
        <p>Tap each orbital to add/remove electrons. Use Add/Remove to adjust orbitals.</p>

        {/* Toggle buttons for help sections */}
        <div className="input-section">
          <button className="help-button" onClick={() => setShowImage(!showImage)}>
            {showImage ? "Hide Aufbau Diagram" : "Show Aufbau Diagram"}
          </button>
          <button className="help-button" onClick={() => setShowExceptions(!showExceptions)}>
            {showExceptions ? "Hide Exceptions" : "Show Exceptions"}
          </button>
          <button className="help-button" onClick={() => setShowRules(!showRules)}>
            {showRules ? "Hide Rules" : "Key Principles"}
          </button>
        </div>
      </div>

      {/* Show Aufbau image if toggled */}
      {showImage && (
        <div className="help-box orbital-center">
          <h4>Orbital Energy Order</h4>
          <div className="orbital-image-container">
            <img src={orbitalImage} alt="Aufbau diagram" />
          </div>
        </div>
      )}

      {/* Show exception list */}
      {showExceptions && (
        <div className="help-box">
          <h4>Exceptions to the Aufbau Principle</h4>
          <ul>
            <li><strong>Cr (24):</strong> [Ar] 4s¹ 3d⁵</li>
            <li><strong>Cu (29):</strong> [Ar] 4s¹ 3d¹⁰</li>
            <li><strong>Ag (47):</strong> [Kr] 5s¹ 4d¹⁰</li>
            <li><strong>Au (79):</strong> [Xe] 6s¹ 4f¹⁴ 5d¹⁰</li>
          </ul>
        </div>
      )}

      {/* Show rules like Aufbau, Hund’s, Pauli */}
      {showRules && (
        <div className="help-box">
          <h4>Key Principles</h4>
          <ul>
            <li><strong>Aufbau Principle:</strong> Fill from lowest energy upward.</li>
            <li><strong>Pauli Exclusion Principle:</strong> Opposite spins only, max 2 per orbital.</li>
            <li><strong>Hund's Rule:</strong> Spread electrons before pairing.</li>
          </ul>
        </div>
      )}

      {/* User-generated orbital diagram */}
      <div className="diagram-section">
        {userDiagram.map((row, rowIdx) => (
          <div key={rowIdx} className="orbital-row">
            <div className="orbital-label">{row.sub}</div>
            <div className="orbital-line">
              {row.arrows.map((arrow, i) => (
                <div key={i} className="orbital" onClick={() => toggleArrow(rowIdx, i)}>
                  {arrow || '\u00A0'}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons: Add, Remove, Check, Solution */}
      <div className="input-section" style={{ marginTop: '1rem' }}>
        <button onClick={addOrbital}>➕ Add Orbital</button>
        <button onClick={removeOrbital}>➖ Remove</button>
        <button onClick={checkDiagram}>✅ Check Diagram</button>
        <button onClick={() => setShowSolution(prev => !prev)}>
          {showSolution ? "🙈 Hide Solution" : "🔍 Show Solution"}
        </button>
      </div>

      {/* Feedback and solution section */}
      <div className="config-box">
        <pre>{feedback}</pre>
        {showSolution && (
          <>
            <strong>Solution:</strong>
            {solution.map((row, idx) => (
              <div key={idx} className="orbital-row">
                <div className="orbital-label">{row.sub}</div>
                <div className="orbital-line">
                  {row.arrows.map((a, i) => (
                    <div key={i} className="orbital">{a || '\u00A0'}</div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
