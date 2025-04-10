import React, { useState, useContext } from "react";
import axios from "axios";
import "../styles/UploadVerification.css"; // Import CSS
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const UploadVerification = () => {
  const [uniqueId, setUniqueId] = useState("");
  const [isUniqueIdValid, setIsUniqueIdValid] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { user, logout } = useContext(AuthContext); // Add the useContext hook

  // Handle unique ID verification
  const handleUniqueIdVerification = async (e) => {
    e.preventDefault();
    if (!uniqueId) {
      setError("Unique ID is required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/verify-unique-id", { uniqueId });

      if (response.data.exists) {
        setIsUniqueIdValid(true);
        setError(""); // Clear any error messages
      } else {
        setIsUniqueIdValid(false);
        setError("Unique ID does not exist.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred.");
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  // Handle form submission for uploading file
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uniqueId || !file) {
      setError("Unique ID and file are required.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("uniqueId", uniqueId);
    formData.append("signature", file);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to perform verification.");
      setIsUploading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/upload-verification", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setResult(response.data.result); // 'Real' or 'Forged'
      setError("");
      setIsUploading(false);
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred.");
      setIsUploading(false);
    }
  };

  // Reset the form and all states
  const handleRefresh = () => {
    setUniqueId("");
    setIsUniqueIdValid(false);
    setFile(null);
    setPreview(null);
    setError("");
    setResult("");
    setIsUploading(false);
  };

  return (
    <>
      <Navbar />
      <div>
        {user ? (
          <div className="upload-page">
            <h2>Verification of Signature</h2>

            {/* Unique ID verification form */}
            {!isUniqueIdValid && (
              <form onSubmit={handleUniqueIdVerification}>
                <input
                  type="text"
                  placeholder="Enter Unique ID"
                  value={uniqueId}
                  onChange={(e) => setUniqueId(e.target.value)}
                  required
                />
                <button type="submit">Verify Unique ID</button>
              </form>
            )}

            {/* File upload form after unique ID is verified */}
            {isUniqueIdValid && (
              <>
                <form onSubmit={handleSubmit}>
                  <p>Unique ID: {uniqueId}</p>
                  <input
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={handleFileChange}
                    required
                  />
                  {preview && (
                    <div className="image-preview">
                      <img
                        src={preview}
                        alt="Preview"
                        className="preview-image"
                      />
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload"}
                  </button>
                </form>
              </>
            )}

            {/* Error message and result */}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="result">{result && <p>Result: {result}</p>}</div>

            {/* Reload button */}
            <div className="refresh_button">
              <button onClick={handleRefresh}>Reload</button>
            </div>
          </div>
        ) : (
          <div className="upload-page">
            <h2>Verification of Signature</h2>
            <p>You must be logged in to access the verification form. Please log in to proceed.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadVerification;
