import './App.css';
import React, { useState } from 'react';
import { periodicTable } from './periodic-data';
import InteractiveMode from './InteractiveMode';

const subshells = [
  ["1s", 2], ["2s", 2], ["2p", 6], ["3s", 2], ["3p", 6],
  ["4s", 2], ["3d", 10], ["4p", 6], ["5s", 2], ["4d", 10],
  ["5p", 6], ["6s", 2], ["4f", 14], ["5d", 10], ["6p", 6],
  ["7s", 2], ["5f", 14], ["6d", 10], ["7p", 6]
];

export default function App() {
  const [mode, setMode] = useState('menu'); // menu | generator | trainer
  const [atomicNumber, setAtomicNumber] = useState('');
  const [config, setConfig] = useState('');
  const [diagram, setDiagram] = useState([]);
  const [elementInfo, setElementInfo] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  const generateDiagram = () => {
    const z = parseInt(atomicNumber);
    if (isNaN(z) || z < 1 || z > 118) {
      setConfig('Please enter a valid atomic number (1–118)');
      setDiagram([]);
      setElementInfo(null);
      return;
    }

    let electrons = z;
    let configString = '';
    let diagramRows = [];

    for (let [sub, max] of subshells) {
      if (electrons <= 0) break;
      let filled = Math.min(electrons, max);
      configString += `${sub}^${filled} `;
      electrons -= filled;

      const orbitalCount = max / 2;
      let arrows = Array(orbitalCount).fill("");

      for (let i = 0; i < filled; i++) {
        if (i < orbitalCount) arrows[i] = "↑";
        else arrows[i % orbitalCount] += "↓";
      }

      diagramRows.push({ sub, arrows });
    }

    setConfig(`Electron Configuration for Z=${z}:\n` + configString);
    setDiagram(diagramRows.reverse());
    setElementInfo(periodicTable[z] || { symbol: "?", name: "Unknown Element" });
  };

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

  if (mode === 'trainer') {
    return <InteractiveMode goBack={() => setMode('menu')} />;
  }

  if (mode === 'menu') {
    return (
      <div className="container">
        <h1 className="title">Electron Configuration Kit</h1>
        <div className="menu-buttons">
          <button onClick={() => setMode('generator')}>Open Electron Config Visualizer</button>
          <button onClick={() => setMode('trainer')}>Start Interactive Trainer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title">Element Orbital Diagram Kit</h1>

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

      <div className="main-content">
        <div className="left-content">
          {showHelp && (
            <div className="help-box">
              <h2>Help: Orbital Diagram Rules</h2>
              <ul>
                <li><strong>Aufbau Principle</strong>: Electrons fill orbitals from lowest to highest energy.</li>
                <li><strong>Pauli Exclusion Principle</strong>: Each orbital holds 2 electrons with opposite spins.</li>
                <li><strong>Hund’s Rule</strong>: Electrons occupy empty orbitals first before pairing up.</li>
              </ul>
            </div>
          )}

          {elementInfo && (
            <div
              className={`element-info ${elementInfo.category ? elementInfo.category.toLowerCase().replace(/\s+/g, '-') : 'default'}`}
            >
              <h2>{elementInfo.name} ({elementInfo.symbol})</h2>
              <p><strong>Atomic Number:</strong> {atomicNumber}</p>
              <p><strong>Group:</strong> {elementInfo.group}</p>
              <p><strong>Period:</strong> {elementInfo.period}</p>
              <p><strong>Category:</strong> {elementInfo.category}</p>
            </div>
          )}

          <div className="config-box">
            <pre>{config}</pre>
            {["24", "29", "47", "79"].includes(atomicNumber) && (
              <div style={{ marginTop: "1rem", backgroundColor: "#fff3cd", padding: "0.75rem", borderRadius: "6px", borderLeft: "4px solid #ffc107" }}>
                <strong>⚠ Note:</strong> This element is an <em>exception</em> to the Aufbau Principle.
                <ul style={{ marginTop: "0.5rem" }}>
                  {atomicNumber === "24" && (
                    <li><strong>Chromium (Z=24):</strong> Expected: <code>[Ar] 4s² 3d⁴</code>, Actual: <code>[Ar] 4s¹ 3d⁵</code></li>
                  )}
                  {atomicNumber === "29" && (
                    <li><strong>Copper (Z=29):</strong> Expected: <code>[Ar] 4s² 3d⁹</code>, Actual: <code>[Ar] 4s¹ 3d¹⁰</code></li>
                  )}
                  {atomicNumber === "47" && (
                    <li><strong>Silver (Z=47):</strong> Expected: <code>[Kr] 5s² 4d⁹</code>, Actual: <code>[Kr] 5s¹ 4d¹⁰</code></li>
                  )}
                  {atomicNumber === "79" && (
                    <li><strong>Gold (Z=79):</strong> Expected: <code>[Xe] 6s² 4f¹⁴ 5d⁹</code>, Actual: <code>[Xe] 6s¹ 4f¹⁴ 5d¹⁰</code></li>
                  )}
                </ul>
                <p style={{ marginTop: "0.5rem" }}>
                  These occur because half-filled or fully-filled d-orbitals are more stable.
                </p>
              </div>
            )}
          </div>

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

        <div className="legend-tab">
          <h3>Category Legend</h3>
          <ul>
            {categories.map((cat, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ backgroundColor: `var(${cat.var})`, width: '16px', height: '16px', marginRight: '8px', display: 'inline-block', borderRadius: '3px' }}></span>
                {cat.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
