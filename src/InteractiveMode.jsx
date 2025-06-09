import React, { useState } from 'react';
import { periodicTable } from './periodic-data';
import './App.css';
import orbitalImage from './images/e-config.jpg';

export default function InteractiveMode({ goBack }) {
  const [step, setStep] = useState(0);
  const [inputAtomicNumber, setInputAtomicNumber] = useState('');
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [correctConfig, setCorrectConfig] = useState('');
  const [showOrbitalDiagram, setShowOrbitalDiagram] = useState(false);

  const subshells = [
    ["1s", 2], ["2s", 2], ["2p", 6], ["3s", 2], ["3p", 6],
    ["4s", 2], ["3d", 10], ["4p", 6], ["5s", 2], ["4d", 10],
    ["5p", 6], ["6s", 2], ["4f", 14], ["5d", 10], ["6p", 6],
    ["7s", 2], ["5f", 14], ["6d", 10], ["7p", 6]
  ];

  const calculateConfig = (z) => {
    let electrons = z;
    let configString = '';
    for (let [sub, max] of subshells) {
      if (electrons <= 0) break;
      let filled = Math.min(electrons, max);
      configString += `${sub}^${filled} `;
      electrons -= filled;
    }
    return configString.trim();
  };

  const handleStart = () => setStep(1);

  const handleCheck = () => {
    const z = parseInt(inputAtomicNumber);
    if (isNaN(z) || z < 1 || z > 118) {
      setFeedback('Please enter a valid atomic number (1–118)');
      return;
    }

    const correct = calculateConfig(z);
    setCorrectConfig(correct);

    if (userInput.trim().replace(/\s+/g, ' ') === correct) {
      setFeedback('✅ Correct!');
    } else {
      setFeedback(
        `❌ Incorrect. Review Aufbau, Pauli Exclusion, and Hund’s Rule.\nTry again or see the correct answer.`
      );
    }
  };

  return (
    <div className="container">
      <h1 className="title">Interactive Electron Configuration Trainer</h1>

      {step === 0 ? (
        <div style={{ textAlign: 'center' }}>
          <button onClick={handleStart}>Start</button>
          <button onClick={goBack} style={{ marginLeft: '10px' }}>Back to Generator</button>
        </div>
      ) : (
        <div>
          {/* Exemplar */}
          <div className="help-box">
            <h3>Electron Configuration Syntax Guide</h3>
            <p>Use this format: <code>1s^2 2s^2 2p^6</code></p>
            <p>Examples:</p>
            <ul>
              <li><strong>Hydrogen (Z=1):</strong> <code>1s^1</code></li>
              <li><strong>Helium (Z=2):</strong> <code>1s^2</code></li>
              <li><strong>Carbon (Z=6):</strong> <code>1s^2 2s^2 2p^2</code></li>
            </ul>
          </div>

          {/* Input Section */}
          <div className="input-section">
            <input
              type="number"
              placeholder="Enter atomic number"
              value={inputAtomicNumber}
              onChange={(e) => setInputAtomicNumber(e.target.value)}
            />
            <input
              type="text"
              placeholder="Your electron configuration"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button onClick={handleCheck}>Check</button>
            <button onClick={goBack} className="help-button">Back</button>
            <button onClick={() => setShowOrbitalDiagram(!showOrbitalDiagram)} style={{ marginLeft: '10px' }}>
              {showOrbitalDiagram ? 'Hide Diagram' : 'Show Aufbau Order Image'}
            </button>
          </div>

          {/* Optional Image Display */}
          {showOrbitalDiagram && (
            <div className="help-box" style={{ textAlign: 'center' }}>
              <h3>Aufbau Principle Diagram</h3>
              <p>This diagram shows the order in which orbitals are filled (from top to bottom following the arrows).</p>
              <img
                src={orbitalImage}
                alt="Orbital Filling Order"
                style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '10px' }}
              />
            </div>
          )}

          {/* Rules Reminder */}
          <div className="help-box">
            <h3>Hint: Key Principles</h3>
            <ul>
              <li><strong>Aufbau Principle:</strong> Fill lowest energy orbitals first.</li>
              <li><strong>Pauli Exclusion Principle:</strong> Max 2 electrons per orbital with opposite spins.</li>
              <li><strong>Hund’s Rule:</strong> Fill all orbitals singly before pairing.</li>
            </ul>
          </div>

          {/* Feedback Box */}
          <div className="config-box">
            <pre>{feedback}</pre>
            {feedback.includes('❌') && (
              <details>
                <summary>Show correct answer</summary>
                <p><strong>{correctConfig}</strong></p>
              </details>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
