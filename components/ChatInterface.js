import { useState } from 'react'; // Importing React hooks for state management
import { Box, Input, Button, Text } from '@chakra-ui/react'; // Importing Chakra UI components

export default function ChatInterface() {
  // State to hold the user's input message
  const [input, setInput] = useState('');
  // State to store the response from the server
  const [response, setResponse] = useState('');

  // Function that gets triggered when the user clicks 'Send'
  const handleChat = async () => {
    // Send the user's input message to the backend API via a POST request
    const res = await fetch('/api/chat', {
      method: 'POST', // Specify the HTTP method
      body: JSON.stringify({ message: input }), // Send the user's message as JSON
    });

    // Parse the JSON response from the backend
    const data = await res.json();
    
    // Update the response state with the server's reply
    setResponse(data.reply);
  };

  return (
    <Box>
      {/* Input field where the user types their message */}
      <Input 
        value={input} // Bind the input field to the 'input' state
        onChange={(e) => setInput(e.target.value)} // Update the 'input' state as the user types
      />
      
      {/* Button that triggers the 'handleChat' function when clicked */}
      <Button onClick={handleChat}>Send</Button>
      
      {/* If there's a response, display it below the input */}
      {response && <Text mt={4}>{response}</Text>}
    </Box>
  );
}
