import React, { useState } from "react";
import Countries from "./Countries.jsx";
import { fetchTranslation } from "./Script.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./lakruwan/component/header.jsx";
import { jwtDecode } from "jwt-decode";
import { FaExchangeAlt } from "react-icons/fa";

export default function TranslationPg() {
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [fromLang, setFromLang] = useState("en-GB");
  const [toLang, setToLang] = useState("si-LK");
  const [sameEngWords, setSameEngWords] = useState([]);
  const [sameSinWords, setSameSinWords] = useState([]);
  const [matchingTranslation, setMatchingTranslation] = useState([]);
  const [showAmbiPopup, setShowAmbiPopup] = useState(false);
  const navigate = useNavigate();

  // Check if the word is polysymous
  const checkPolisymous = async (inputText, lang) => {
    const words = inputText.split(" ");
    const lastWord = words[words.length - 1];
    let endpoint =
      lang === "en-GB"
        ? "http://localhost:5001/poliengwords"
        : "http://localhost:5001/sinpoliwords";

    try {
      const response = await axios.get(endpoint);
      const wordList = Array.isArray(response.data)
        ? response.data
        : response.data.data;

      const foundWord =
        lang === "en-GB"
          ? wordList.find((wordObj) => wordObj.engWord === lastWord)
          : wordList.find((wordObj) => wordObj.sinWord === lastWord);

      if (foundWord) {
        if (lang === "en-GB") {
          setSameEngWords(foundWord.poliEngWMeanings);
          setMatchingTranslation(foundWord.sinhalaWord);
        } else {
          setSameSinWords(foundWord.PoliSinWMeanings);
          setMatchingTranslation(foundWord.engWord);
        }
        setShowAmbiPopup(true);
        return;
      }

      setShowAmbiPopup(false);
    } catch (error) {
      console.error("Error fetching polysymous words:", error);
    }
  };

  // Handle user selection of a specific meaning
  const handleMeaningSelection = (selectedIndex) => {
    const selectedTranslation = matchingTranslation[selectedIndex];
    setToText(selectedTranslation);
    setShowAmbiPopup(false);
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
      alert(
        "Both input and translated text are required to save the translation."
      );
      return;
    }

    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const username = decodedToken.userName;

    try {
      const response = await axios.post(
        "http://localhost:5001/inputTranslation",
        {
          username: username,
          savedtranslation: [
            {
              english: fromLang === "en-GB" ? fromText : toText,
              sinhala: fromLang === "si-LK" ? fromText : toText,
            },
          ],
        }
      );

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

  const sendfeedback = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1 justify-center items-center py-10 px-4">
        <div className="w-full max-w-3xl bg-white border border-gray-200 shadow-2xl rounded-2xl p-8 relative transition-all">
          {/* Empty State */}
          {!fromText && (
            <div className="flex flex-col items-center justify-center mb-8">
              {/* Use your own SVG or PNG in /public/empty-translate.svg */}
              <img
                src="/empty-translate.svg"
                alt="Start translating"
                className="w-36 h-36 mb-4"
                draggable={false}
              />
              <p className="text-gray-600 text-lg font-medium mb-1">
                Start by typing text to translate!
              </p>
              <p className="text-gray-400 text-sm">
                Example: <span className="italic">Hello, how are you?</span>
              </p>
            </div>
          )}

          {/* Ambiguous Word Popup */}
          {showAmbiPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
              <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-5 text-center">
                  Select a Meaning
                </h3>
                <ul className="space-y-3">
                  {(sameEngWords.length > 0 ? sameEngWords : sameSinWords).map(
                    (meaning, index) => (
                      <li
                        key={index}
                        onClick={() => handleMeaningSelection(index)}
                        className="cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-blue-100 transition text-base text-gray-700"
                      >
                        {meaning}
                      </li>
                    )
                  )}
                </ul>
                <button
                  onClick={() => setShowAmbiPopup(false)}
                  className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Main Translator UI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Input Textarea */}
            <div className="flex flex-col">
              <label
                htmlFor="from-text"
                className="mb-2 text-gray-700 font-semibold"
              >
                Enter text
              </label>
              <textarea
                id="from-text"
                spellCheck="false"
                className="resize-none min-h-[120px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-300 focus:outline-none font-medium text-gray-800 bg-gray-50 transition"
                placeholder="Type here..."
                value={fromText}
                onChange={(e) => {
                  setFromText(e.target.value);
                  checkPolisymous(e.target.value, fromLang);
                }}
              />
            </div>
            {/* Output Textarea */}
            <div className="flex flex-col">
              <label
                htmlFor="to-text"
                className="mb-2 text-gray-700 font-semibold"
              >
                Translation
              </label>
              <textarea
                id="to-text"
                spellCheck="false"
                className="resize-none min-h-[120px] p-4 border border-gray-300 rounded-lg bg-gray-100 font-medium text-gray-700"
                placeholder="Translation"
                value={toText}
                readOnly
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={fromLang}
                onChange={(e) => setFromLang(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg bg-white font-medium"
              >
                {Object.entries(Countries).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleExchange}
                className="mx-2 bg-cyan-400 hover:bg-cyan-500 text-white rounded-full p-2 transition"
                title="Swap languages"
              >
                <FaExchangeAlt className="text-lg" />
              </button>
              <select
                value={toLang}
                onChange={(e) => setToLang(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg bg-white font-medium"
              >
                {Object.entries(Countries).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
              <button
                onClick={handleTranslate}
                className="w-full md:w-auto px-6 py-2 bg-cyan-400 hover:bg-cyan-500 text-white font-semibold rounded-lg shadow transition"
              >
                Translate Text
              </button>
              <button
                onClick={addTranslation}
                className="w-full md:w-auto px-6 py-2 bg-cyan-400 hover:bg-cyan-500 text-white font-semibold rounded-lg shadow flex items-center gap-2 transition"
              >
                <span>★</span> Save as Favorite
              </button>
            </div>
          </div>

          {/* Feedback */}
          <p
            className="text-right mt-5 text-slate-600 font-medium cursor-pointer hover:text-blue-800 transition"
            onClick={sendfeedback}
          >
            Send feedback
          </p>
        </div>
      </div>
    </div>
  );
}
