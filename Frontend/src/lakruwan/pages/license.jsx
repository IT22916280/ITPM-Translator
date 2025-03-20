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
        features: ["Unlimited translations", "Full language support", "Instant processing"] 
    }
];

export default function License() {
  return (
    <div className="container mx-auto p-5">
        <h1 className="h1-style text-center">Upgrade to unleash everything</h1>
        <p className="mb-4 text-center mx-56 text-md text-gray-500 pt-4 pb-6"> 
            Select a translation plan that fits your needs. Whether you need basic daily translations or unlimited access with advanced AI support, our plans provide the right balance of features and affordability. Purchase your license today and start translating with ease
        </p>
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