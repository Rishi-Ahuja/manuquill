// App.js
import React, { useState, useEffect } from "react";
import { analyzeText, parseStructuredText } from "./openaiAPI";
import { formatAndSaveDocument as formatFormalDocument } from "./documentUtils_formal";
import { formatAndSaveDocument as formatPlayfulDocument } from "./documentUtils_playful";
import "./index.css"; // Import Tailwind + custom CSS
import formalImage from "./images/formal.png";
import playfulImage from "./images/playful.png";


const App = () => {
  const [inputText, setInputText] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(false);

  useEffect(() => {
    setParsedData(null);
  }, [inputText]);

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const structuredText = await analyzeText(inputText);
      const structuredData = parseStructuredText(structuredText);
      console.log("Structured Data:", structuredData);
      setParsedData(structuredData);
    } catch (error) {
      console.error("Error analyzing text:", error);
      alert("Failed to analyze text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadFormal = async () => {
    if (parsedData) {
      try {
        await formatFormalDocument(parsedData, "FormalDocument.docx");
      } catch (error) {
        console.error("Error formatting formal document:", error);
        alert("Failed to format and download the formal document. Please try again.");
      }
    } else {
      alert("No data available to download.");
    }
  };

  const handleDownloadPlayful = async () => {
    if (parsedData) {
      try {
        await formatPlayfulDocument(parsedData, "PlayfulDocument.docx");
      } catch (error) {
        console.error("Error formatting playful document:", error);
        alert("Failed to format and download the playful document. Please try again.");
      }
    } else {
      alert("No data available to download.");
    }
  };

  const templates = [
    {
      id: "formal",
      name: "Formal Template",
      image: formalImage,
      downloadFn: handleDownloadFormal,
    },
    {
      id: "playful",
      name: "Playful Template",
      image: playfulImage,
      downloadFn: handleDownloadPlayful,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-50 to-gray-100 relative overflow-hidden">
      {/* Floating Color Orbs */}
      <div className="orb orb1"></div>
      <div className="orb orb2"></div>
      <div className="orb orb3"></div>
      <div className="orb orb4"></div>
      <div className="orb orb5"></div>

      {/* How to Use Modal */}
      {showHowToUse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-8 w-11/12 md:w-3/4 lg:w-1/2 shadow-3xl transform transition-all duration-500 scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-serif font-bold text-gray-800">
                How to Use
              </h2>
              <button
                onClick={() => setShowHowToUse(false)}
                className="text-red-600 text-4xl font-bold leading-none focus:outline-none"
              >
                &times;
              </button>
            </div>
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/mDxDuY-jm7o?si=kDGtWAozpsCM-gOY"
                title="How to Use"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center px-6 py-12">
        <div className="glass p-10 rounded-3xl shadow-2xl max-w-5xl w-full transform transition-all duration-700 hover:scale-105 animate-float">
          <header className="text-center mb-12">
            <h1 className="text-6xl sm:text-7xl italic font-serif font-extrabold text-gray-800 drop-shadow-md">
              ManuQuill
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Effortless, Elegant Documents
            </p>
          </header>

          {/* Revamped "Enter Raw Text" Section */}
          <section className="mb-12">
            <h3 className="text-3xl font-semibold text-gray-800 mb-4 drop-shadow-sm">
              Enter Your Text
            </h3>
            <div className="relative group">
              <textarea
                className="w-full p-6 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out text-gray-800 shadow-lg bg-white bg-opacity-80"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your text here..."
                rows="8"
              />
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-blue-400 transition-all duration-300 pointer-events-none"></div>
            </div>
            <div className="flex justify-center mt-8">
              {!isLoading && !parsedData && inputText.trim() !== "" && (
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="elegant-btn text-lg"
                >
                  Analyze Text
                </button>
              )}
            </div>
          </section>

          {isLoading && (
            <div className="flex flex-col items-center mt-8">
              <div id="loader">
                <div id="box"></div>
                <div id="hill"></div>
              </div>
              <p className="mt-3 text-gray-700 font-semibold text-xl">
                Processing your text...
              </p>
            </div>
          )}

          {parsedData && (
            <section className="mt-10">
              <h3 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                Choose Your Template
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="glass cursor-pointer border border-gray-300 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2"
                  >
                    <img
                      src={template.image}
                      alt={template.name}
                      className="w-full h-56 object-cover"
                    />
                    <div className="p-6 text-center">
                      <h4 className="text-2xl font-bold text-gray-800 mb-4">
                        {template.name}
                      </h4>
                      <button
                        onClick={template.downloadFn}
                        className="elegant-btn text-lg"
                      >
                        Download{" "}
                        {template.id === "formal"
                          ? "Formal Document"
                          : "Playful Document"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Elegant Footer */}
      <footer className="bg-gray-100 bg-opacity-90 text-center py-3 border-t border-gray-300 backdrop-blur-sm">
        <p className="text-sm text-gray-700">
          &copy; {new Date().getFullYear()} ManuQuill.{" "}
          <a
            href="https://github.com/Rishi-Ahuja"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>{" "}
          /{" "}
          <a
            href="https://www.linkedin.com/in/rishi-ahuja14/"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </p>
      </footer>

      {/* Fixed How to Use Button */}
      <button
        className="fixed bottom-6 right-6 elegant-btn text-xl"
        onClick={() => setShowHowToUse(true)}
      >
        How to Use
      </button>
    </div>
  );
};

export default App;
