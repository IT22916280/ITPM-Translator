import React, { useState, useEffect } from "react";

export default function UpdateLicenseForm({ licenseData, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({
    licenseName: "",
    title: "",
    price: "",
    validity: "",
    description: "",
  });

  useEffect(() => {
    if (licenseData) {
      setFormData({
        licenseName: licenseData.licenseName || "",
        title: licenseData.title || "",
        price: licenseData.price || "",
        validity: licenseData.validity || "",
        description: Array.isArray(licenseData.description)
          ? licenseData.description.join(", ")
          : licenseData.description || "",
      });
    }
  }, [licenseData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Join the description array into a string (if it's an array)
    const updatedData = {
      ...formData,
      description: formData.description.split(",").map((item) => item.trim()).join(", "), // Join array to string
    };
  
    onUpdate(licenseData._id, updatedData);
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">License Name</label>
        <input
          type="text"
          name="licenseName"
          value={formData.licenseName}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price (LKR)</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      {/* <div>
        <label className="block text-sm font-medium text-gray-700">Validity</label>
        <input
          type="text"
          name="validity"
          value={formData.validity}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
      </div> */}

      <div>
        <label className="block text-sm font-medium text-gray-700">Features (comma separated)</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </div>
    </form>
  );
}
