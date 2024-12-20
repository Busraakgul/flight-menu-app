import { useState } from "react";

export default function MenuUpload() {
  // State hooks to manage file input, OCR result, error messages, and translated items
  const [file, setFile] = useState(null); // Holds the selected file
  const [result, setResult] = useState(null); // Holds the OCR extraction result
  const [error, setError] = useState(null); // Holds any error messages
  const [translatedItems, setTranslatedItems] = useState([]); // Holds translated menu items

  // Function to handle file upload and OCR processing
  const handleUpload = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission
    setError(null); // Reset any previous error
    setResult(null); // Reset previous result
    setTranslatedItems([]); // Reset translations

    // Create FormData object to send the file in the request body
    const formData = new FormData();
    formData.append("file", file); // Append the selected file to the FormData object

    try {
      // Send POST request to upload the image for OCR processing
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData, // Attach the image in the request body
      });

      const data = await res.json(); // Parse the response as JSON

      // Check if the response is okay, otherwise throw an error
      if (!res.ok) throw new Error(data.error);

      setResult(data); // Set the OCR result if successful
    } catch (err) {
      setError(err.message); // Set error message if an error occurs
    }
  };

  // Function to handle translation of menu items
  const handleTranslateItems = async () => {
    if (!result || !result.menuItems) return; // Ensure there is result and menuItems to translate

    try {
      // Loop through menu items and translate each one asynchronously
      const translations = await Promise.all(
        result.menuItems.map(async (item) => {
          const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: item.description || item.item, // Send either description or item name for translation
              targetLanguage: "en", // Translate to English
            }),
          });

          const data = await res.json(); // Parse the translation response
          return { ...item, translated: data.translatedText }; // Add translated text to item
        })
      );

      setTranslatedItems(translations); // Set translated items to state
    } catch (err) {
      console.error("Translation Error:", err); // Log translation errors to console
    }
  };

  return (
    <div>
      <h2>Upload Menu Image</h2>
      <form onSubmit={handleUpload}>
        {/* File input to select an image for upload */}
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>

      {/* Display error message if any */}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Display OCR result and allow translation of menu items */}
      {result && (
        <div>
          <h3>Extracted Menu</h3>
          {/* Display image and menu items extracted by OCR */}
          <img src={result.imageUrl} alt="Uploaded" width="300" />
          <pre>{JSON.stringify(result.menuItems, null, 2)}</pre>

          <button onClick={handleTranslateItems}>Translate Menu</button>

          {/* Display translated menu items */}
          {translatedItems.length > 0 && (
            <div>
              <h3>Translated Menu</h3>
              <ul>
                {translatedItems.map((item, index) => (
                  <li key={index}>
                    <strong>{item.item}:</strong> {item.translated}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

