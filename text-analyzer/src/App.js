// Import React and necessary components
import React from 'react';
import './App.css';
import TextAnalyzer from './TextAnalyzer';

// Main App component
function App() {
  return (
    <div className="App">
      {/* Header section with title */}
      <header className="App-header">
        <h1>Text Analyzer Application</h1>
      </header>
      
      {/* Main content area - contains the TextAnalyzer component */}
      <main>
        <TextAnalyzer />
      </main>
      
      {/* Footer with names */}
      <footer>
        <p>© 2026 Text Analyzer - David De Leon & Angela Monares</p>
      </footer>
    </div>
  );
}

export default App;