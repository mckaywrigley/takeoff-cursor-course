"use client";

import ApiKeyDisplay from "@/components/api-key-display";
import CompanyForm from "@/components/company-form";
import { useState } from "react";

export default function Voice() {
  const [step, setStep] = useState(1);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [apiKey, setApiKey] = useState("");

  const handleCompanySubmit = (info) => {
    setCompanyInfo(info);
    // Simulate API key generation
    setApiKey("API_" + Math.random().toString(36).substr(2, 9));
    setStep(2);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Developer Platform</h1>
      {step === 1 ? (
        <CompanyForm onSubmit={handleCompanySubmit} />
      ) : (
        <ApiKeyDisplay
          apiKey={apiKey}
          companyInfo={companyInfo}
        />
      )}
    </div>
  );
}
