import React, { useState, useEffect } from "react";
import "./TranslatorPg.css";
import Countries from "./Countries.jsx";
import { fetchTranslation } from "./Script.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./lakruwan/component/header.jsx";
import { jwtDecode } from "jwt-decode";

export default function TranslationPg() {
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [fromLang, setFromLang] = useState("en-GB");
  const [toLang, setToLang] = useState("si-LK");
  const [sameEngWords, setSameEngWords] = useState([]); // For English meanings
  const [sameSinWords, setSameSinWords] = useState([]); // For Sinhala meanings
  const [matchingTranslation, setMatchingTranslation] = useState([]); // Translations for selected word
  const [showAmbiPopup, setShowAmbiPopup] = useState(false);
  const navigate = useNavigate();

  // Check if the word is polysymous
  const checkPolisymous = async (inputText, lang) => {
    const words = inputText.split(" ");
    const lastWord = words[words.length - 1]; // Get the last word entered
    let endpoint = lang === "en-GB" ? "http://localhost:5001/poliengwords" : "http://localhost:5001/sinpoliwords";

    try {
      const response = await axios.get(endpoint);
      const wordList = Array.isArray(response.data) ? response.data : response.data.data;

      const foundWord = lang === "en-GB"
        ? wordList.find((wordObj) => wordObj.engWord === lastWord)
        : wordList.find((wordObj) => wordObj.sinWord === lastWord);

      if (foundWord) {
        if (lang === "en-GB") {
          setSameEngWords(foundWord.poliEngWMeanings); // Set possible English meanings
          setMatchingTranslation(foundWord.sinhalaWord); // Store Sinhala translations
        } else {
          setSameSinWords(foundWord.PoliSinWMeanings); // Set possible Sinhala meanings
          setMatchingTranslation(foundWord.engWord); // Store English translations
        }
        setShowAmbiPopup(true); // Show popup with options
        return;
      }

      setShowAmbiPopup(false); // No ambiguity found
    } catch (error) {
      console.error("Error fetching polysymous words:", error);
    }
  };

  // Handle user selection of a specific meaning
  const handleMeaningSelection = (selectedIndex) => {
    // Update the translation field with the matching translation
    const selectedTranslation = matchingTranslation[selectedIndex];
    setToText(selectedTranslation); // Update the output field
    setShowAmbiPopup(false); // Hide the popup
  };

  const handleTranslate = async () => {
    if (!fromText.trim()) return;

    setToText("Translating...");

    const translation = await fetchTranslation(fromText, fromLang, toLang);
    setToText(translation);
  };

  const handleExchange = () => {
    setFromText(toText);
    setToText(fromText);
    setFromLang(toLang);
    setToLang(fromLang);
  };

  const addTranslation = async () => {
    if (!fromText.trim() || !toText.trim()) {
        alert("Both input and translated text are required to save the translation.");
        return;
    }

    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const username = decodedToken.userName;

    try {
        const response = await axios.post("http://localhost:5001/inputTranslation", {
            username: username,
            savedtranslation: [
                {
                    english: fromLang === "en-GB" ? fromText : toText,
                    sinhala: fromLang === "si-LK" ? fromText : toText,
                },
            ],
        });

        if (response.status === 200) {
            alert("Translation saved successfully!");
        } else {
            alert("Failed to save the translation.");
        }
    } catch (error) {
        console.error("Error saving translation:", error);
        alert("An error occurred while saving the translation.");
    }
};

  const navigateToSavedTranslations = () => {
    navigate('/'); // Navigate to saved translations page
  };

  const navigateToHistory = () => {
    navigate('/'); // Navigate to history page
  };

  const sendfeedback =() =>
  {
    navigate("/");
  };

  

  return (
    <div className="flex justify-center py-25 w-full">
    <Header></Header>
      <div className="container">
        <div className="wrapper px-2">
          <div className="text-input">
            {showAmbiPopup && (
              <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-gray-100/50 z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Select a Meaning</h3>
                  <ul className="space-y-2">
                    {(sameEngWords.length > 0 ? sameEngWords : sameSinWords).map((meaning, index) => (
                      <li
                        key={index}
                        onClick={() => handleMeaningSelection(index)} // Select meaning
                        className="cursor-pointer p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                      >
                        {meaning}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setShowAmbiPopup(false)}
                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
            <textarea
              spellCheck="false"
              className="from-text"
              placeholder="Enter text"
              value={fromText}
              onChange={(e) => {
                setFromText(e.target.value);
                checkPolisymous(e.target.value, fromLang); // Check for ambiguous words
              }}
            ></textarea>
            <textarea
              spellCheck="false"
              className="to-text"
              placeholder="Translation"
              value={toText}
              readOnly
            ></textarea>
          </div>
          <ul className="controls">
            <li className="row from">
              <select value={fromLang} onChange={(e) => setFromLang(e.target.value)}>
                {Object.entries(Countries).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </li>
            <li className="exchange" onClick={handleExchange}>
              <i className="fas fa-exchange-alt"></i>
            </li>
            <li className="row to">
              <select value={toLang} onChange={(e) => setToLang(e.target.value)}>
                {Object.entries(Countries).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </li>
          </ul>
          <button onClick={handleTranslate} className="translate-button">Translate Text</button>
          <button onClick={addTranslation} className="favorite-button bg-cyan-400 hover:bg-cyan-500">
          ★ Save as Favorite
          </button>

        <p className='text-right mt-3 text-slate-600 font-medium cursor-pointer hover:text-blue-800' onClick={sendfeedback}>Send feedback</p>        
        </div>
      </div>
    </div>
  );
}