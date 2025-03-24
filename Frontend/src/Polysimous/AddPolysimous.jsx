import React, { useState } from "react";
import AddEngPolisymous from "./AddEngPolisymous";
import AddSinPolisymous from "./AddSinPolisymous";
import { TbExchange } from "react-icons/tb";


export default function AddPolysimous() {
    const [isEnglish, setIsEnglish] = useState(true);

    const toggleAmbiguousForm = () => {
      setIsEnglish(!isEnglish); // Toggle between English and Sinhala forms
    };
  
    return (
      <div className="relative">
        {/* Toggle Switch (Positioned in top-right corner) */}
        <label
          htmlFor="toggle-switch"
          className="flex items-center mb-4 cursor-pointer absolute"
          style={{marginLeft: '11.15in', marginTop: '0.64in'}}
        >
          <div className="relative">
            <input
              type="checkbox"
              id="toggle-switch"
              className="sr-only"
              checked={isEnglish}
              onChange={toggleAmbiguousForm}
            />
            <div className="block bg-white border-2 border-gray-300 w-28 h-8 rounded-md"></div>
            <div
              className={`absolute top-0 left-0 w-20 h-8 bg--600 pt-1 rounded-t-md transition-transform ${
                isEnglish ? "transform translate-x-0" : "transform translate-x-0"
              }`}
            >
              <span className="ml-3 mt-10 font-bold text-green-600">
                {isEnglish ? "English" : "Sinhala"}
                <TbExchange className="absolute -mt-5 ml-20" />
              </span>
            </div>
          </div>
        </label>
  
        {/* Ambiguous Word Form */}
        <div>
          {isEnglish ? <AddEngPolisymous /> : <AddSinPolisymous />}
        </div>
      </div>
    );
}
