import { Card, CardContent, Typography, Button } from "@mui/material"; // Import Material UI components
import { useState } from "react"; // Import React hook for state management
import axios from "axios"; // Import axios for making HTTP requests

export default function MenuCard({ item, description }) {
  // State to store the translated text
  const [translatedText, setTranslatedText] = useState("");

  // Function that gets triggered when the user clicks 'Translate'
  const handleTranslate = async () => {
    try {
      // Send a POST request to the /api/translate endpoint with the text to be translated
      const response = await axios.post("/api/translate", {
        text: description || item, // Use 'description' if available, otherwise 'item'
        targetLanguage: "en", // Set the target language to English
      });

      // Set the translated text received from the server
      setTranslatedText(response.data.translatedText);
    } catch (error) {
      // If there's an error, log it to the console
      console.error("Translation Error:", error);
    }
  };

  return (
    <Card
      style={{
        margin: "10px", // Add margin around the card
        height: "180px", // Set fixed height for the card
        display: "flex", // Use flexbox to arrange content
        flexDirection: "column", // Stack elements vertically
        justifyContent: "space-between", // Space out the content
      }}
    >
      <CardContent>
        {/* Display the menu item name */}
        <Typography variant="h6" style={{ fontWeight: "bold" }}>
          {item}
        </Typography>

        {/* Display the description of the item */}
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>

        {/* If there is a translated text, display it */}
        {translatedText && (
          <Typography variant="body2" color="primary">
            Translated: {translatedText}
          </Typography>
        )}

        {/* Button to trigger the translation */}
        <Button
          variant="contained" // Set button style
          color="primary" // Primary color for the button
          onClick={handleTranslate} // Handle click event for translation
          style={{ marginTop: "10px" }} // Add margin on top of the button
        >
          Translate
        </Button>
      </CardContent>
    </Card>
  );
}
