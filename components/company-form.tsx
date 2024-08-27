import { motion } from "framer-motion";
import { useState } from "react";
import { FiImage, FiMapPin, FiPhone, FiUser } from "react-icons/fi";

interface CompanyFormProps {
  onSubmit: (data: { companyName: string; companyAddress: string; companyContact: string; companyLogo: File | null }) => void;
}

export default function CompanyForm({ onSubmit }: CompanyFormProps) {
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyContact, setCompanyContact] = useState("");
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ companyName, companyAddress, companyContact, companyLogo });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCompanyLogo(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Company Information</h2>
      {[
        { id: "companyName", label: "Company Name", icon: FiUser, value: companyName, setValue: setCompanyName },
        { id: "companyAddress", label: "Company Address", icon: FiMapPin, value: companyAddress, setValue: setCompanyAddress },
        { id: "companyContact", label: "Best Contact", icon: FiPhone, value: companyContact, setValue: setCompanyContact }
      ].map((field) => (
        <div
          key={field.id}
          className="relative"
        >
          <label
            htmlFor={field.id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {field.label}
          </label>
          <motion.div
            className="relative rounded-md shadow-sm"
            whileFocus="focus"
            variants={inputVariants}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <field.icon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="text"
              id={field.id}
              value={field.value}
              onChange={(e) => field.setValue(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </motion.div>
        </div>
      ))}

      <div className="relative">
        <label
          htmlFor="companyLogo"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Company Logo
        </label>
        <motion.div
          className="relative rounded-md shadow-sm"
          whileFocus="focus"
          variants={inputVariants}
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiImage
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <input
            type="file"
            id="companyLogo"
            accept="image/*"
            onChange={handleLogoChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </motion.div>
        {previewUrl && (
          <motion.img
            src={previewUrl}
            alt="Company Logo Preview"
            className="mt-2 w-32 h-32 object-contain border rounded"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      <motion.button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        Submit
      </motion.button>
    </motion.form>
  );
}
