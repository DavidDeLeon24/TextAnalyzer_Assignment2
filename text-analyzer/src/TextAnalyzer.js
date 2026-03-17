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

    // Counts sentences (ends with ., !, or ?)
    const countSentences = (text) => {
        if (!text.trim()) return 0;
        
        // Replace decimal numbers (444.333) with placeholder so they aren't split
        let processedText = text.replace(/\d+\.\d+/g, '###DECIMAL###');
        
        // Replace URLs with placeholder so they aren't split
        processedText = processedText.replace(/www\.\S+|https?:\/\/\S+/g, '###URL###');
        
        // Find text that ends with . ! or ? followed by space or end of string
        const sentenceRegex = /[^.!?]+[.!?]+(?:\s|$)/g;
        const matches = processedText.match(sentenceRegex) || [];
        
        // Filter out invalid sentences
        const validSentences = matches.filter(sentence => {
            const trimmed = sentence.trim();
            if (trimmed.length < 2) return false; // Too short
            
            // Remove the ending punctuation
            const textWithoutPunctuation = trimmed.slice(0, -1).trim();
            
            // Must have at least one letter
            const hasLetter = /[a-zA-Z]/.test(textWithoutPunctuation);
            
            // Check if it's a single letter (like "a" or "b")
            const isSingleLetter = /^[a-zA-Z]$/.test(textWithoutPunctuation);
            
            // Check if it's ONLY numbers/symbols with NO letters (like "1+2.")
            const isOnlyMath = /^[0-9\s+\-*/=]+$/.test(textWithoutPunctuation) && !hasLetter;
            
            // Keep only valid sentences
            return hasLetter && !isSingleLetter && !isOnlyMath;
        });
        
        return validSentences.length;
    };

    // Counts how many times each word appears
    const calculateWordFrequency = (text) => {
        if (!text.trim()) return {};
        
        // Convert to lowercase and remove punctuation
        const cleanText = text.toLowerCase().replace(/[^\w\s']|_/g, ' ').replace(/\s+/g, ' ');
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
        e.preventDefault(); // Stop page from refreshing
        
        // Check if text is empty
        if (!inputText.trim()) {
            alert('Please enter some text to analyze.');
            return;
        }

        // Run analysis
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
        setIsAnalyzed(false);     // Hide results
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
                                    placeholder="Type or paste your text here... (Sentences end with ., !, or ?)"
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
                                                {/* Show words from most to least frequent */}
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
                        /* Show this when no analysis yet */
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
