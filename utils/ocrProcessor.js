// Function to process the uploaded image using OCR (Optical Character Recognition)
export async function processImage(image) {
  // Creating a new FormData object to handle the image file
  const formData = new FormData();
  
  // Appending the image file to the form data with the key 'image'
  formData.append('image', image);

  // Sending the image to the backend API for OCR processing
  const response = await fetch('/api/ocr', {
    method: 'POST', // Using POST request method to submit the image
    body: formData, // Attaching the form data (image) to the request body
  });

  // Returning the response from the server as JSON after OCR processing
  return await response.json();
}
