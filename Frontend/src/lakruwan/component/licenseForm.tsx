import React, { useState } from "react";
import axios from "axios";

const LicenseForm = () => {
  const [formData, setFormData] = useState({
    licenseName: "",
    title: "",
    description: "",
    price: "",
    isEnabled: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.licenseName || !formData.title || !formData.description || !formData.price) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      isEnabled: formData.isEnabled || false,
    };

    try {
      const response = await axios.post("http://localhost:5001/license/post", payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("License created successfully:", response.data);
      alert("License created successfully!");
      setFormData({
        licenseName: "",
        title: "",
        description: "",
        price: "",
        isEnabled: false,
      });
    } catch (err) {
      console.error("Error creating license:", err);
      alert("Failed to create license.");
    }
  };

  return (
    <div className="flex justify-center items-center w-full">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg w-full mx-6 p-4 border border-blue-300">
        <h2 className="text-2xl font-bold mb-4 text-center">Add New License</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">License Name</label>
          <input
            type="text"
            name="licenseName"
            value={formData.licenseName}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Price (LKR)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Additional Content</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="isEnabled"
            checked={formData.isEnabled}
            onChange={handleChange}
            className="h-5 w-5 text-blue-600"
          />
          <label className="ml-2 text-sm text-gray-700">Enabled</label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Create License
        </button>
      </form>
    </div>
  );
};

export default LicenseForm;
