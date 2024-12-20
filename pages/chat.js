import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function Chat() {
  // State to hold all the chat messages
  const [messages, setMessages] = useState([]);
  // State to hold the user's query (message input)
  const [query, setQuery] = useState("");
  // State to handle the loading state during API calls
  const [loading, setLoading] = useState(false);

  // Function to handle sending a message
  const handleSend = async () => {
    // Prevent sending empty or only whitespace messages
    if (!query.trim()) return;

    // Create a message object for the user's input
    const userMessage = { type: "user", text: query };
    setMessages((prev) => [...prev, userMessage]); // Add the user's message to the message list
    setQuery(""); // Clear the input field

    try {
      // Set loading state to true while waiting for the API response
      setLoading(true);

      // Send a POST request with the user's query to the chat API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }), // Sending the user's query
      });

      // Parse the response data from the API
      const data = await response.json();

      // Create a message object for the bot's response
      const botMessage = { type: "bot", text: data.response || "No response" };
      setMessages((prev) => [...prev, botMessage]); // Add the bot's message to the list
    } catch (error) {
      console.error("Error:", error);
      // In case of an error, add an error message from the bot
      const errorMessage = { type: "bot", text: "An error occurred. Please try again." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      // Reset loading state when the API call is completed
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      {/* Chat Header */}
      <Typography variant="h4" textAlign="center" gutterBottom>
        Interactive Chat Interface
      </Typography>

      {/* Chat Message List */}
      <List
        sx={{
          maxHeight: "400px",
          overflowY: "auto", // Allow scrolling if messages exceed the container height
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        {/* Iterate through the messages state to display each message */}
        {messages.map((message, index) => (
          <ListItem
            key={index}
            sx={{
              justifyContent: message.type === "user" ? "flex-end" : "flex-start", // Align user messages to the right, bot messages to the left
            }}
          >
            <ListItemText
              primary={message.text} // Display message text
              sx={{
                backgroundColor: message.type === "user" ? "#007bff" : "#f1f1f1", // Blue background for user messages, gray for bot
                color: message.type === "user" ? "#fff" : "#000", // White text for user, black for bot
                padding: "10px",
                borderRadius: "8px",
                maxWidth: "70%", // Limit message width for readability
              }}
            />
          </ListItem>
        ))}
      </List>

      {/* User Input Section */}
      <Box display="flex" alignItems="center">
        {/* Input field for user query */}
        <TextField
          fullWidth
          placeholder="Type your question here..."
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Update the query state as user types
          disabled={loading} // Disable input while loading
        />
        {/* Send button */}
        <Button
          onClick={handleSend} // Trigger handleSend when clicked
          variant="contained"
          color="primary"
          sx={{ ml: 2 }}
          disabled={loading || !query.trim()} // Disable button while loading or when input is empty
        >
          {/* Show loading spinner if the request is in progress */}
          {loading ? <CircularProgress size={24} /> : "Send"}
        </Button>
      </Box>
    </Box>
  );
}
