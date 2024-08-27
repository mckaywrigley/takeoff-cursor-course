import { useState } from "react";

export default function CompanyForm({ onSubmit }) {
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyContact, setCompanyContact] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ companyName, companyAddress, companyContact });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <label
          htmlFor="companyName"
          className="block mb-1"
        >
          Company Name
        </label>
        <input
          type="text"
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label
          htmlFor="companyAddress"
          className="block mb-1"
        >
          Company Address
        </label>
        <input
          type="text"
          id="companyAddress"
          value={companyAddress}
          onChange={(e) => setCompanyAddress(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label
          htmlFor="companyContact"
          className="block mb-1"
        >
          Best Contact
        </label>
        <input
          type="text"
          id="companyContact"
          value={companyContact}
          onChange={(e) => setCompanyContact(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
}
