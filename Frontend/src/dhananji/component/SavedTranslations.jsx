import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../lakruwan/component/header";
import { jwtDecode } from "jwt-decode";

export default function SavedTranslations() {
  const [translations, setTranslations] = useState([]);
  const [docID, setDocID] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTranslation, setCurrentTranslation] = useState({
    index: null,
    english: "",
    sinhala: "",
  });
  // Search functionality - uncommented
  const [searchTerm, setSearchTerm] = useState("");
  // const searchTerm = ""; // Default empty search term while feature is disabled - removed this line
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState("all");
  const [reportFormat, setReportFormat] = useState("pdf");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userName = decodedToken.userName;

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/allTranslations/${userName}`
        );
        setTranslations(response.data.AllTranslations);
        setDocID(response.data.documentId);
      } catch (error) {
        console.error("Error fetching translations:", error);
      }
    };

    fetchTranslations();
  }, [userName]);

  const handleDelete = async (index) => {
    try {
      await axios.delete(
        `http://localhost:5001/deleteSavedTranslation/${docID}/${index}`
      );

      alert("Translation deleted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting translation:", error);
      alert("Failed to delete translation.");
    }
  };

  const handleEdit = async (index) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/allTranslations/${docID}/${index}`
      );
      const { savedtranslation } = response.data;

      setCurrentTranslation({
        index,
        english: savedtranslation.english,
        sinhala: savedtranslation.sinhala,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching translation:", error);
      alert("Failed to fetch translation.");
    }
  };

  const handleUpdate = async () => {
    const { index, english, sinhala } = currentTranslation;

    if (!english || !sinhala) {
      alert("Both English and Sinhala translations are required.");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:5001/updateTranslation/${docID}/${index}`,
        {
          savedtranslation: [{ english, sinhala }],
        }
      );

      alert("Translation updated successfully!");

      const updatedTranslations = [...translations];
      updatedTranslations[index] = {
        ...updatedTranslations[index],
        english,
        sinhala,
      };
      setTranslations(updatedTranslations);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating translation:", error);
      alert("Failed to update translation.");
    }
  };

  const handleGoBack = () => {
    navigate(`/Translator/pg`);
  };

  // Search filtering - uncommented
  const filteredTranslations = translations.filter(
    (t) =>
      t.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.sinhala.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // const filteredTranslations = translations; // Show all translations while search is disabled - removed this line

  // Report generation functions
  const openReportModal = () => {
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
  };

  // Function to generate CSV locally without backend
  const generateCSVLocally = (reportData) => {
    // Create CSV content
    let csvContent = "English,Sinhala\n";
    
    reportData.forEach(item => {
      // Properly escape fields containing commas or quotes
      const escapedEnglish = `"${item.english.replace(/"/g, '""')}"`;
      const escapedSinhala = `"${item.sinhala.replace(/"/g, '""')}"`;
      csvContent += `${escapedEnglish},${escapedSinhala}\n`;
    });
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `translations-report-${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Function to generate a PDF report directly for download
  const generatePDFReport = (reportData) => {
    setIsGeneratingReport(true);
    
    try {
      // Import jspdf library from CDN at runtime
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.async = true;
      
      script.onload = () => {
        // Import jspdf-autotable for table support
        const autoTableScript = document.createElement('script');
        autoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js';
        autoTableScript.async = true;
        
        autoTableScript.onload = () => {
          try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Add title
            const timestamp = new Date().toLocaleString();
            doc.setFontSize(20);
            doc.setTextColor(37, 99, 235); // Blue color
            doc.text('Translations Report', 14, 20);
            
            // Add report info
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100); // Gray color
            doc.text(`User: ${userName}`, 14, 30);
            doc.text(`Generated: ${timestamp}`, 14, 37);
            doc.text(`Total Translations: ${reportData.length}`, 14, 44);
            
            // Create table data
            const tableData = reportData.map((item, index) => [
              index + 1,
              item.english,
              item.sinhala
            ]);
            
            // Add table
            doc.autoTable({
              startY: 50,
              head: [['#', 'English', 'Sinhala']],
              body: tableData,
              theme: 'striped',
              headStyles: { fillColor: [242, 247, 255], textColor: 40 },
              alternateRowStyles: { fillColor: [249, 249, 249] },
              columnStyles: {
                0: { cellWidth: 10 },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 'auto' }
              },
              styles: { overflow: 'linebreak' },
              margin: { top: 60 }
            });
            
            // Add footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
              doc.setPage(i);
              const footerY = doc.internal.pageSize.height - 10;
              doc.setFontSize(10);
              doc.setTextColor(150);
              doc.text(`Generated by Translation App - ${timestamp}`, doc.internal.pageSize.width / 2, footerY, { align: 'center' });
              doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 20, footerY);
            }
            
            // Save and download PDF
            const pdfOutput = doc.output('blob');
            const dateStr = new Date().toISOString().slice(0, 10);
            const url = URL.createObjectURL(pdfOutput);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `translations-report-${dateStr}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setIsGeneratingReport(false);
            closeReportModal();
          } catch (err) {
            console.error("Error in client-side PDF generation:", err);
            // Try server side generation as fallback
            tryServerSidePDFGeneration(reportData);
          }
        };
        
        document.body.appendChild(autoTableScript);
      };
      
      document.body.appendChild(script);
      
    } catch (error) {
      console.error("Error loading PDF libraries:", error);
      tryServerSidePDFGeneration(reportData);
    }
  };
  
  // Fallback to server-side PDF generation
  const tryServerSidePDFGeneration = (reportData) => {
    try {
      const timestamp = new Date().toLocaleString();
      
      // Create report data object
      const reportRequestData = {
        userName,
        generatedAt: timestamp,
        reportFormat: 'pdf',
        translations: reportData
      };
      
      // Send request to backend for PDF generation
      axios.post(
        `http://localhost:5001/generateReport`, 
        reportRequestData,
        { responseType: 'blob' }
      )
      .then(response => {
        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        const dateStr = new Date().toISOString().slice(0, 10);
        
        link.href = url;
        link.setAttribute('download', `translations-report-${dateStr}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        setIsGeneratingReport(false);
        closeReportModal();
      })
      .catch(error => {
        console.error("Server-side PDF generation failed:", error);
        alert("PDF generation failed. Falling back to CSV format.");
        generateCSVLocally(reportData);
        setIsGeneratingReport(false);
        closeReportModal();
      });
    } catch (error) {
      console.error("Error in server-side PDF generation attempt:", error);
      generateCSVLocally(reportData);
      setIsGeneratingReport(false);
      closeReportModal();
    }
  };

  const generateReport = async () => {
    setIsGeneratingReport(true);
    
    try {
      // Determine which translations to include in the report
      let reportTranslations = [];
      
      if (reportType === "all") {
        reportTranslations = translations;
      } else if (reportType === "filtered") {
        reportTranslations = filteredTranslations;
      }
      
      if (reportFormat === "csv") {
        // Generate CSV directly in the browser
        generateCSVLocally(reportTranslations);
        setIsGeneratingReport(false);
        closeReportModal();
      } else if (reportFormat === "pdf") {
        // Generate PDF
        generatePDFReport(reportTranslations);
        closeReportModal();
      } else {
        // Excel format - try backend first, fall back to CSV
        try {
          // Create report data object
          const reportData = {
            userName,
            generatedAt: new Date().toISOString(),
            reportFormat: "excel",
            translations: reportTranslations,
          };
          
          // Send request to backend for Excel
          const response = await axios.post(
            `http://localhost:5001/generateReport`, 
            reportData,
            { responseType: 'blob' }
          );
          
          // Create a download link for the Excel file
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          const timestamp = new Date().toISOString().slice(0, 10);
          
          link.href = url;
          link.setAttribute('download', `translations-report-${timestamp}.xlsx`);
          
          document.body.appendChild(link);
          link.click();
          link.remove();
          
          setIsGeneratingReport(false);
          closeReportModal();
        } catch (error) {
          console.error("Excel generation failed, falling back to CSV:", error);
          alert("Excel report generation is not available. Generating CSV instead.");
          generateCSVLocally(reportTranslations);
          setIsGeneratingReport(false);
          closeReportModal();
        }
      }
      
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="min-h-screen w-screen p-4 pr-15">
      <Header />
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-center">
            Saved Translations
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={openReportModal}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
            >
              Generate Report
            </button>
            <button
              onClick={handleGoBack}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer"
            >
              Go Back
            </button>
          </div>
        </div>

        {/* 🔍 Search Input - Uncommented */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by English or Sinhala..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
       

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Input
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black tracking-wider">
                  Output
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-black tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTranslations.length > 0 ? (
                filteredTranslations.map((translation, index) => (
                  <tr key={`${translation._id}-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {translation.english}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {translation.sinhala}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(index)}
                          className="bg-blue-400 text-white py-1 px-3 rounded-md hover:bg-blue-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="bg-gray-400 text-white py-1 px-3 rounded-md hover:bg-gray-600"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No translations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✏️ Modal for editing translation */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Translation</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                English
              </label>
              <input
                type="text"
                value={currentTranslation.english}
                onChange={(e) =>
                  setCurrentTranslation({
                    ...currentTranslation,
                    english: e.target.value,
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Sinhala
              </label>
              <input
                type="text"
                value={currentTranslation.sinhala}
                onChange={(e) =>
                  setCurrentTranslation({
                    ...currentTranslation,
                    sinhala: e.target.value,
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📊 Modal for report generation */}
      {isReportModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Generate Translation Report</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Content
              </label>
              <div className="flex flex-col space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="reportType"
                    value="all"
                    checked={reportType === "all"}
                    onChange={() => setReportType("all")}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">All translations ({translations.length})</span>
                </label>
                {/* Filtered option - uncommented */}
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="reportType"
                    value="filtered"
                    checked={reportType === "filtered"}
                    onChange={() => setReportType("filtered")}
                    className="form-radio h-4 w-4 text-blue-600"
                    disabled={!searchTerm}
                  />
                  <span className="ml-2">
                    Current filtered results ({filteredTranslations.length})
                    {!searchTerm && " (requires search filter)"}
                  </span>
                </label>
                
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Format
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="reportFormat"
                    value="pdf"
                    checked={reportFormat === "pdf"}
                    onChange={() => setReportFormat("pdf")}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">PDF</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="reportFormat"
                    value="excel"
                    checked={reportFormat === "excel"}
                    onChange={() => setReportFormat("excel")}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Excel</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="reportFormat"
                    value="csv"
                    checked={reportFormat === "csv"}
                    onChange={() => setReportFormat("csv")}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">CSV</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeReportModal}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                disabled={isGeneratingReport}
              >
                Cancel
              </button>
              <button
                onClick={generateReport}
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 flex items-center"
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  "Download Report"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}