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
  const [showExceptions, setShowExceptions] = useState(false);

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
      <h1 className="title">Electron Configuration Trainer</h1>

      {step === 0 ? (
        <div className="trainer-menu">
          <button onClick={handleStart}>Start</button>
          <button onClick={goBack}>Back to Generator</button>
        </div>
      ) : (
        <div>
          {/* Syntax Guide */}
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

          {/* Inputs */}
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
            <button onClick={() => setShowOrbitalDiagram(!showOrbitalDiagram)}>
              {showOrbitalDiagram ? 'Hide Diagram' : 'Show Aufbau Order Image'}
            </button>
          </div>

          {/* Diagram Image */}
          {showOrbitalDiagram && (
            <div className="help-box" style={{ textAlign: 'center' }}>
              <h3>Aufbau Principle Diagram</h3>
              <p>This diagram shows the order in which orbitals are filled (follow the arrows).</p>
              <img
                src={orbitalImage}
                alt="Orbital Filling Order"
              />
            </div>
          )}

          {/* Rules + Exceptions */}
          <div className="help-box">
            <h3>Hint: Key Principles</h3>
            <ul>
              <li><strong>Aufbau Principle:</strong> Fill orbitals from lowest energy up.</li>
              <li><strong>Pauli Exclusion Principle:</strong> Max 2 electrons per orbital (opposite spins).</li>
              <li><strong>Hund’s Rule:</strong> Fill orbitals singly before pairing.</li>
            </ul>
            <button
              className="help-button"
              style={{ marginTop: '10px' }}
              onClick={() => setShowExceptions(!showExceptions)}
            >
              {showExceptions ? 'Hide Exceptions' : 'Show Exceptions'}
            </button>

            {showExceptions && (
              <div style={{ marginTop: '10px' }}>
                <h4>Configuration Exceptions</h4>
                <ul>
                  <li><strong>Chromium (Cr, Z=24):</strong> <code>[Ar] 4s^1 3d^5</code>  
                    <br />✓ More stable due to half-filled d-orbital.</li>
                  <li><strong>Copper (Cu, Z=29):</strong> <code>[Ar] 4s^1 3d^10</code>  
                    <br />✓ Full d-orbital preferred.</li>
                  <li><strong>Silver (Ag, Z=47):</strong> <code>[Kr] 5s^1 4d^10</code></li>
                  <li><strong>Gold (Au, Z=79):</strong> <code>[Xe] 6s^1 4f^14 5d^10</code></li>
                </ul>
                <p><em>These exceptions occur due to enhanced stability of half-filled or fully-filled d and f orbitals.</em></p>
              </div>
            )}
          </div>

          {/* Feedback */}
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
