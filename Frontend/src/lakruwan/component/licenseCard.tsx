import React from "react";

interface licenseCardProps {
    title: string;
    description: string;
    price: string;
    validity: string;
    features: string[];
}

export default function licenseCard({title, description, price, validity, features }:licenseCardProps) {
    return(
        <div className="border border-gray-300 bg-white p-6 text-center rounded-lg w-86 h-full shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <p className="text-2xl font-bold text-blue-600">LKR {price}</p>
            <p className="text-sm text-gray-500 mb-4"><strong>Validity:</strong> {validity}</p>
            
            <div className="flex flex-col gap-2 mb-6 py-4">
                <button className="text-lg bg-blue-300 border border-blue-300 rounded-lg cursor-pointer p-1 hover:bg-blue-400 font-semibold text-white">
                    Purchase
                </button>
                <button className="text-lg border border-gray-300 rounded-lg cursor-pointer p-1 hover:bg-gray-300">
                    Free trial
                </button>
            </div>

            <ul className="text-md text-gray-700 space-y-2 border-t pt-4">
                {features.map((feature, index) => (
                <li key={index}>{feature}</li>
                ))}
            </ul>
        </div>
    )
}