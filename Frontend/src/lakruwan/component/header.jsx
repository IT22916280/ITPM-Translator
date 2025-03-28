import { useState } from "react";
import Menu from "../../assets/header/menu.svg";
import Close from "../../assets/header/close.svg";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const [isExpanded, setIsExpanded] = useState(false);

    const navigate = useNavigate();
    return (
        <div
            className={`fixed flex flex-col top-0 right-0 h-full border-l-1 border-gray-300 bg-gray-100 transition-all duration-300 p-1 ${
                isExpanded ? "w-60" : "w-10"
            }`}
        >
            {/* <Menu className="w-8 h-8 text-white m-4" /> */}
            {!isExpanded && (<img 
                src={Menu} 
                alt="Menu" 
                className="absolute w-6 h-6 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)} 
            />)}

            {isExpanded && (<img 
                src={Close} 
                alt="Close" 
                className="absolute w-6 h-6 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)} 
            />)}

            <div className="flex-grow pt-7">
                <div className="border-t-1 border-gray-300">
                    {isExpanded && (
                        <>
                            {/* dashboard */}
                            <button onClick={() => navigate("/dashboard")} className="w-full rounded-md p-1 mt-1 cursor-pointer hover:bg-gray-200">
                                License
                            </button>
                            {/* history */}
                            <button onClick={() => navigate("/savedTranslations")} className="w-full rounded-md p-1 mt-1 cursor-pointer hover:bg-gray-200">
                                History
                            </button>
                            {/* license */}
                            <button onClick={() => navigate("/license")} className="w-full rounded-md p-1 mt-1 cursor-pointer hover:bg-gray-200">
                                License
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* log out button */}
            {isExpanded && (
                <div className="border-t border-gray-300 p-2">
                    <button
                        className="w-full rounded-md p-2 bg-blue-200 cursor-pointer hover:bg-blue-300"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("/");
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
