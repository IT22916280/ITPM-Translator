import React from 'react'
import LicenseCard from '../component/licenseCard'

const licenseData = [
    { 
        id: 1, 
        title: "Basic Translator", 
        description: "Translate up to 10 words per day with essential language support.", 
        price: "$29/year", 
        validity: "1 Year", 
        features: ["10 words per day", "Basic language support", "Limited access to AI models"] 
    },
    { 
        id: 2, 
        title: "Advanced Translator", 
        description: "Get access to 50 words per day, expanded language support", 
        price: "$59/year", 
        validity: "1 Year", 
        features: ["50 words per day", "Expanded language support", "Priority AI-enhanced translations"] 
    },
    { 
        id: 3, 
        title: "Ultimate Translator", 
        description: "Unlimited translations with full access to all supported languages", 
        price: "$99/year", 
        validity: "1 Year", 
        features: ["Unlimited translations", "Full language support", "Access to advanced AI models", "Instant processing"] 
    }
];

export default function License() {
  return (
    <div className="container mx-auto p-5">
        <h2 className="text-2xl font-bold text-center mb-6">Available Translation Plans</h2>
        <div className="flex justify-center gap-6 ">
            {licenseData.map((license) => (
                <LicenseCard
                    key={license.id}
                    title={license.title}
                    description={license.description}
                    price={license.price}
                    validity={license.validity}
                    features={license.features}
                />
            ))}
        </div>
    </div>
  )
}