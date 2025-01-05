import React, { useState } from "react";
import { analyzeText, parseStructuredText } from "./openaiAPI";
import { formatAndSaveDocument } from "./documentUtils";
import './App.css'; // This imports the CSS file

const App = () => {
  const [inputText, setInputText] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State for loading

  const handleAnalyze = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const structuredText = await analyzeText(inputText); // Get AI analysis
      const structuredData = parseStructuredText(structuredText); // Parse into structured JSON
      console.log("Structured Data:", structuredData); // Log structured JSON
      setParsedData(structuredData);
    } catch (error) {
      console.error("Error analyzing text:", error);
      alert("Failed to analyze text. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleDownloadFormattedDoc = async () => {
    if (parsedData) {
      try {
        await formatAndSaveDocument(parsedData, "FormattedDocument.docx");
      } catch (error) {
        console.error("Error formatting document:", error);
        alert("Failed to format and download the document. Please try again.");
      }
    } else {
      alert("No data available to download.");
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Textura: Document Formatter</h1>
        <h2>Turn your raw text into a beautifully formatted document</h2>
      </header>

      <section className="input-section">
        <h3>Enter Raw Text</h3>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter or paste your text here..."
          rows="10"
          cols="50"
        />
        <div className="button-container">
          <button onClick={handleAnalyze} disabled={isLoading}>
            {isLoading ? "Analyzing..." : "Analyze Text"}
          </button>
        </div>
      </section>

      {isLoading && (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Processing...</p>
        </div>
      )}

      {parsedData && (
        <section className="output-section">
          <h3>Formatted Document Ready</h3>
          <button onClick={handleDownloadFormattedDoc}>Download Formatted Document</button>
        </section>
      )}
      
      
    </div>
  );
};

export default App;
