import React, { useState, useEffect } from 'react';
import './App.css';
import orbitalImage from './images/e-config.jpg';

const subshells = [
  "1s", "2s", "2p", "3s", "3p",
  "4s", "3d", "4p", "5s", "4d"
];

const maxElectrons = {
  s: 2,
  p: 6,
  d: 10
};

function getSubshellType(sub) {
  return sub.match(/[spd]/)[0];
}

function generateCorrectDiagram(z) {
  let electrons = z;
  const output = [];

  for (let i = 0; i < subshells.length && electrons > 0; i++) {
    const sub = subshells[i];
    const type = getSubshellType(sub);
    const max = maxElectrons[type];
    const orbitals = max / 2;

    const row = Array(orbitals).fill("");
    let placed = 0;

    while (electrons > 0 && placed < max) {
      const index = placed < orbitals ? placed : placed % orbitals;
      row[index] += placed < orbitals ? "↑" : "↓";
      placed++;
      electrons--;
    }

    output.push({ sub, arrows: row });
  }

  return output;
}

export default function InteractiveMode({ goBack }) {
  const [atomicNumber, setAtomicNumber] = useState(1);
  const [userDiagram, setUserDiagram] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [solution, setSolution] = useState([]);
  const [showImage, setShowImage] = useState(false);
  const [showExceptions, setShowExceptions] = useState(false);
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    const rand = Math.floor(Math.random() * 30) + 1;
    setAtomicNumber(rand);
    const correct = generateCorrectDiagram(rand);
    setSolution(correct);
    setUserDiagram([{ sub: correct[0].sub, arrows: Array(correct[0].arrows.length).fill("") }]);
  }, []);
    
  const rerollAtomicNumber = () => {
    const rand = Math.floor(Math.random() * 30) + 1;
    setAtomicNumber(rand);
    const correct = generateCorrectDiagram(rand);
    setSolution(correct);
    setShowSolution(false);
    setFeedback('');
    setUserDiagram([{ sub: correct[0].sub, arrows: Array(correct[0].arrows.length).fill("") }]);
    };

  const toggleArrow = (orbitalIdx, boxIdx) => {
    setUserDiagram(prev => {
      const newDiagram = JSON.parse(JSON.stringify(prev));
      const state = newDiagram[orbitalIdx].arrows[boxIdx];
      if (state === "") newDiagram[orbitalIdx].arrows[boxIdx] = "↑";
      else if (state === "↑") newDiagram[orbitalIdx].arrows[boxIdx] = "↑↓";
      else newDiagram[orbitalIdx].arrows[boxIdx] = "";
      return newDiagram;
    });
  };

  const addOrbital = () => {
    if (userDiagram.length < solution.length) {
      const next = solution[userDiagram.length];
      setUserDiagram(prev => [...prev, { sub: next.sub, arrows: Array(next.arrows.length).fill("") }]);
    }
  };

  const removeOrbital = () => {
    if (userDiagram.length > 1) {
      setUserDiagram(prev => prev.slice(0, -1));
    }
  };

  const checkDiagram = () => {
    const correct = JSON.stringify(solution.map(row => row.arrows));
    const user = JSON.stringify(userDiagram.map(row => row.arrows));
    setFeedback(user === correct ? "✅ Correct!" : "❌ Incorrect. Try again or reveal the solution.");
  };

  return (
    <div className="container">
      <h1 className="title">Orbital Game</h1>
      
      <div className="top-right-menu">
        <button className="help-button mainmenu-btn" onClick={goBack}>Main Menu</button>
    </div>

      <div className="help-box">
        <div className="atomic-header">
            <h4>Given the following Atomic Number, create the orbital diagram</h4>
            <br />
            <p><strong>Atomic Number:</strong> {atomicNumber}</p>
            <button className="help-button reroll-btn" onClick={rerollAtomicNumber}>🔁 Re-roll</button>
        </div>
        <p>Tap each orbital to add/remove electrons. Use Add/Remove to adjust orbitals.</p>

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

      {showImage && (
        <div className="help-box orbital-center">
            <h4>Orbital Energy Order</h4>
            <div className="orbital-image-container">
            <img src={orbitalImage} alt="Aufbau diagram" />
            </div>
        </div>
    )}
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

      {showRules && (
        <div className="help-box">
          <h4>Key Principles</h4>
          <ul>
            <li><strong>Aufbau Principle:</strong> Electrons fill from lowest energy upward.</li>
            <li><strong>Pauli Exclusion Principle:</strong> Each orbital holds 2 electrons with opposite spins.</li>
            <li><strong>Hund's Rule:</strong> Orbitals fill with one electron each before pairing.</li>
          </ul>
        </div>
      )}

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

      <div className="input-section" style={{ marginTop: '1rem' }}>
        <button onClick={addOrbital}>➕ Add Orbital</button>
        <button onClick={removeOrbital}>➖ Remove</button>
        <button onClick={checkDiagram}>✅ Check Diagram</button>
        <button onClick={() => setShowSolution(prev => !prev)}>
            {showSolution ? "🙈 Hide Solution" : "🔍 Show Solution"}
        </button>
      </div>

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
