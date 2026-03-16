// Import React and useState hook for managing component state
import React, { useState } from 'react';
// Import CSS for styling
import './TextAnalyzer.css';

const TextAnalyzer = () => {
    // State variables
    const [inputText, setInputText] = useState('');           // Stores user input
    const [analysisResult, setAnalysisResult] = useState(null); // Stores analysis results
    const [isAnalyzed, setIsAnalyzed] = useState(false);      // Tracks if analysis done

    // Updates text as user types
    const handleTextChange = (e) => {
        setInputText(e.target.value);
        setIsAnalyzed(false); // Hide old results when text changes
    };

    // Counts sentences by splitting on periods
    const countSentences = (text) => {
    if (!text.trim()) return 0;
    
    // Check if text contains any periods
    if (!text.includes('.')) return 0;
    
    const sentences = text.split('.').filter(s => s.trim() !== '');
    return sentences.length;
    };

    // Counts how many times each word appears
    const calculateWordFrequency = (text) => {
        if (!text.trim()) return {};
        
        // Convert to lowercase and remove punctuation
        const cleanText = text.toLowerCase().replace(/[^\w\s]/g, '');
        // Split into words
        const words = cleanText.split(/\s+/).filter(word => word.length > 0);
        
        // Count word frequencies
        const frequencyMap = {};
        words.forEach(word => {
            frequencyMap[word] = (frequencyMap[word] || 0) + 1;
        });
        
        return frequencyMap;
    };

    // Handles form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page refresh
        
        // Check if text is empty
        if (!inputText.trim()) {
            alert('Please enter some text to analyze.');
            return;
        }

        // Perform analysis
        const sentenceCount = countSentences(inputText);
        const wordFrequency = calculateWordFrequency(inputText);
        
        // Save results
        setAnalysisResult({
            sentenceCount: sentenceCount,
            wordFrequency: wordFrequency
        });
        
        setIsAnalyzed(true); // Show results
    };

    // Resets everything
    const handleReset = () => {
        setInputText('');        // Clear textarea
        setAnalysisResult(null);  // Clear results
        setIsAnalyzed(false);     // Hide results section
    };

    return (
        <div className="text-analyzer-container">
            <div className="split-layout">
                {/* Left Side - Input Section */}
                <div className="left-side">
                    <div className="input-section">
                        <h2>Enter Your Text</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <textarea
                                    value={inputText}
                                    onChange={handleTextChange}
                                    placeholder="Type or paste your text here... (Sentences should end with a period.)"
                                    rows="12"
                                    className="text-input"
                                />
                            </div>
                            <div className="button-group">
                                <button type="submit" className="analyze-btn">
                                    Analyze Text
                                </button>
                                <button type="button" onClick={handleReset} className="reset-btn">
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Side - Results Section */}
                <div className="right-side">
                    {isAnalyzed && analysisResult ? (
                        <div className="results-section">
                            <h2>Analysis Results</h2>
                            
                            {/* Sentence Count */}
                            <div className="result-card">
                                <h3>Sentence Count</h3>
                                <p className="sentence-count">
                                    Total Sentences: <strong>{analysisResult.sentenceCount}</strong>
                                </p>
                            </div>

                            {/* Word Frequency Table */}
                            <div className="result-card">
                                <h3>Word Frequency</h3>
                                {Object.keys(analysisResult.wordFrequency).length > 0 ? (
                                    <div className="table-container">
                                        <table className="frequency-table">
                                            <thead>
                                                <tr>
                                                    <th>Word</th>
                                                    <th>Frequency</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Sort words by frequency (highest first) and display */}
                                                {Object.entries(analysisResult.wordFrequency)
                                                    .sort((a, b) => b[1] - a[1])
                                                    .map(([word, count], index) => (
                                                        <tr key={index}>
                                                            <td>{word}</td>
                                                            <td>{count}</td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p>No words found in the text.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Placeholder shown when no analysis has been done */
                        <div className="results-placeholder">
                            <p>Enter text on the left and click "Analyze Text" to see results here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TextAnalyzer;