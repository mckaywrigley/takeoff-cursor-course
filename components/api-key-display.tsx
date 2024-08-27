import Image from "next/image";
import { useState } from "react";

export default function ApiKeyDisplay({ apiKey, companyInfo }) {
  const [copied, setCopied] = useState(false);

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Company Information</h2>
      {companyInfo.companyLogo && (
        <div className="mb-4">
          <Image
            src={URL.createObjectURL(companyInfo.companyLogo)}
            alt="Company Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>
      )}
      <p>
        <strong>Name:</strong> {companyInfo.companyName}
      </p>
      <p>
        <strong>Address:</strong> {companyInfo.companyAddress}
      </p>
      <p>
        <strong>Contact:</strong> {companyInfo.companyContact}
      </p>

      <h2 className="text-xl font-semibold mt-6">Your API Key</h2>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={apiKey}
          readOnly
          className="w-full px-3 py-2 border rounded bg-gray-100"
        />
        <button
          onClick={copyApiKey}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
