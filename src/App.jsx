// Importing necessary styles, React library, periodic table data, and the interactive game component
import './App.css';
import React, { useState } from 'react';
import { periodicTable } from './periodic-data';
import InteractiveMode from './InteractiveMode';

// A list of all subshells in the order they are filled, along with their maximum electron capacity
const subshells = [
  ["1s", 2], ["2s", 2], ["2p", 6], ["3s", 2], ["3p", 6],
  ["4s", 2], ["3d", 10], ["4p", 6], ["5s", 2], ["4d", 10],
  ["5p", 6], ["6s", 2], ["4f", 14], ["5d", 10], ["6p", 6],
  ["7s", 2], ["5f", 14], ["6d", 10], ["7p", 6]
];

// Main App Component
export default function App() {
  // React state hooks to store app state and user input
  const [mode, setMode] = useState('menu'); // Current screen: menu, generator, or trainer
  const [atomicNumber, setAtomicNumber] = useState(''); // User input for atomic number
  const [config, setConfig] = useState(''); // Text version of electron configuration
  const [diagram, setDiagram] = useState([]); // Visual representation of orbitals
  const [elementInfo, setElementInfo] = useState(null); // Information about the selected element
  const [showHelp, setShowHelp] = useState(false); // Whether to show help section

  // Function to generate the electron configuration and orbital diagram
  const generateDiagram = () => {
    const z = parseInt(atomicNumber); // Parse atomic number input

    // Handle invalid input
    if (isNaN(z) || z < 1 || z > 118) {
      setConfig('Please enter a valid atomic number (1–118)');
      setDiagram([]);
      setElementInfo(null);
      return;
    }

    let electrons = z; // Start with the full number of electrons
    let configString = ''; // Will build this into the config text string
    let diagramRows = []; // Each row represents a subshell with its arrows

    for (let [sub, max] of subshells) {
      if (electrons <= 0) break;

      // Determine how many electrons go into this subshell
      let filled = Math.min(electrons, max);
      configString += `${sub}^${filled} `;
      electrons -= filled;

      // Build the orbital diagram for this subshell
      const orbitalCount = max / 2;
      let arrows = Array(orbitalCount).fill("");

      for (let i = 0; i < filled; i++) {
        if (i < orbitalCount) arrows[i] = "↑";
        else arrows[i % orbitalCount] += "↓";
      }

      diagramRows.push({ sub, arrows });
    }

    // Save results in state
    setConfig(`Electron Configuration for Z=${z}:\n` + configString);
    setDiagram(diagramRows.reverse()); // Reverse for diagram layout
    setElementInfo(periodicTable[z] || { symbol: "?", name: "Unknown Element" });
  };

  // Known exceptions to the Aufbau principle
  const exceptions = {
    24: "[Ar] 4s¹ 3d⁵",
    29: "[Ar] 4s¹ 3d¹⁰",
    47: "[Kr] 5s¹ 4d¹⁰",
    79: "[Xe] 6s¹ 4f¹⁴ 5d¹⁰"
  };

  // Color categories for the legend and element styling
  const categories = [
    { name: 'Metal', var: '--metal' },
    { name: 'Nonmetal', var: '--nonmetal' },
    { name: 'Noble Gas', var: '--noblegas' },
    { name: 'Alkali Metal', var: '--alkalimetal' },
    { name: 'Alkaline Earth Metal', var: '--alkalineearthmetal' },
    { name: 'Metalloid', var: '--metalloid' },
    { name: 'Halogen', var: '--halogen' },
    { name: 'Transition Metal', var: '--transitionmetal' },
    { name: 'Lanthanide', var: '--lanthanide' },
    { name: 'Actinide', var: '--actinide' }
  ];

  // If the user selects the "trainer" mode, render the interactive builder
  if (mode === 'trainer') {
    return <InteractiveMode goBack={() => setMode('menu')} />;
  }

  // Main menu screen
  if (mode === 'menu') {
    return (
      <div className="container">
        <h1 className="title">The Orbitron</h1>
        <div className="menu-buttons">
          <button onClick={() => setMode('generator')}>🔬 Orbital Viewer</button>
          <button onClick={() => setMode('trainer')}>🧠 Orbital Game</button>
        </div>
        <div className="author-card">
          <h3>Created by Ramila, Serena, Evelyn, Eva, Hannah</h3>
          <p>SCH4U1 - Chemistry</p>
          <p>Ms. Moledina</p>
        </div>
      </div>
    );
  }

  // Configuration viewer screen
  return (
    <div className="container">
      <h1 className="title">Orbital Viewer</h1>

      {/* Input section to enter atomic number and toggle help */}
      <div className="input-section">
        <input
          type="number"
          placeholder="Enter atomic number (1–118)"
          value={atomicNumber}
          onChange={(e) => setAtomicNumber(e.target.value)}
        />
        <button onClick={generateDiagram}>Show Configuration</button>
        <button className="help-button" onClick={() => setShowHelp(!showHelp)}>
          {showHelp ? 'Hide Help' : 'Show Help'}
        </button>
        <button onClick={() => setMode('menu')}>Main Menu</button>
      </div>

      {/* Main layout content */}
      <div className="main-content">
        <div className="left-content">
          {/* Show help section if toggled */}
          {showHelp && (
            <div className="help-box">
              <h2>Help: Orbital Diagram Rules</h2>
              <ul>
                <li><strong>Aufbau Principle:</strong> Fill from lowest energy upward.</li>
                <li><strong>Pauli Exclusion Principle:</strong> Max 2 electrons per orbital with opposite spins.</li>
                <li><strong>Hund’s Rule:</strong> Spread out electrons before pairing.</li>
              </ul>
            </div>
          )}

          {/* Display element information if available */}
          {elementInfo && (
            <div className={`element-info ${elementInfo.category ? elementInfo.category.toLowerCase().replace(/\s+/g, '-') : 'default'}`}>
              <h2>{elementInfo.name} ({elementInfo.symbol})</h2>
              <p><strong>Atomic Number:</strong> {atomicNumber}</p>
              <p><strong>Group:</strong> {elementInfo.group}</p>
              <p><strong>Period:</strong> {elementInfo.period}</p>
              <p><strong>Category:</strong> {elementInfo.category}</p>
            </div>
          )}

          {/* Electron configuration display */}
          <div className="config-box">
            <pre>{config}</pre>
            {/* Show exception if element is in exception list */}
            {exceptions[atomicNumber] && (
              <div className="help-box">
                <strong>⚠ Exception:</strong> This element is known to violate the Aufbau principle.
                <br />
                Suggested configuration: <code>{exceptions[atomicNumber]}</code>
              </div>
            )}
          </div>

          {/* Orbital diagram rendering */}
          <div className="diagram-section">
            {diagram.length > 0 && <strong>Orbital Diagram:</strong>}
            {diagram.map((row, idx) => (
              <div key={idx} className="orbital-row">
                <div className="orbital-label">{row.sub}</div>
                <div className="orbital-line">
                  {row.arrows.map((a, i) => (
                    <div key={i} className="orbital">{a || '\u00A0'}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Element category legend */}
        <div className="legend-tab">
          <h3>Category Legend</h3>
          <ul>
            {categories.map((cat, i) => (
              <li key={i}>
                <span style={{ backgroundColor: `var(${cat.var})` }}></span>
                {cat.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
