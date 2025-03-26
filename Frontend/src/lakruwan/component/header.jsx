import { useState } from "react";
import Menu from "../../assets/header/menu.svg?react";

export default function Header() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className={`fixed top-0 right-0 h-full bg-blue-200 transition-all duration-300 ${
                isExpanded ? "w-80" : "w-15"
            }`}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {/* <Menu className="w-8 h-8 text-white m-4" /> */}
        </div>
    );
}
